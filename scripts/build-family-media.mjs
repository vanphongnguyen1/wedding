// Builds the /family album from the raw media in public/images/farm (git-ignored).
//
//   node scripts/build-family-media.mjs
//
// - Photos  → resized/recompressed to public/images/family/p/<slug>.jpg (skipped if already up to date)
// - Live Photos (IMG_x.JPEG + IMG_x.MOV) → one "live" item
// - Videos  → poster expected at public/images/family/v/<slug>.jpg; video file served from
//             public/images/family/v/<slug>.mp4 if a compressed copy exists, otherwise the raw farm file
//             (run scripts/compress-family-videos.mjs first so nothing points at the git-ignored farm folder)
// - Writes lib/family-media.json (newest first) for the page to import.
// Exclusions / crops: scripts/family-media.config.json
import sharp from "sharp";
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync, mkdirSync, openSync, readSync, closeSync } from "node:fs";
import { join, extname, basename } from "node:path";

const SRC = "public/images/farm";
const OUT = "public/images/family";
const MAX = 2000;
const config = JSON.parse(readFileSync("scripts/family-media.config.json", "utf8"));
const excluded = new Set(config.exclude ?? []);

const slug = (f) => basename(f, extname(f)).toLowerCase().replace(/\s*\((\d+)\)/g, "-$1").replace(/[^a-z0-9_-]+/g, "-").replace(/^-|-$/g, "");
const url = (p) => "/" + p.replace(/\\/g, "/").replace(/^public\//, "").split("/").map(encodeURIComponent).join("/");
mkdirSync(join(OUT, "p"), { recursive: true });
mkdirSync(join(OUT, "v"), { recursive: true });

// ── EXIF / MP4 dates ────────────────────────────────────────────────────────
function exifDate(exif) {
  if (!exif) return null;
  const m = [...exif.toString("latin1").matchAll(/(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/g)];
  const iso = m.map((x) => `${x[1]}-${x[2]}-${x[3]}T${x[4]}:${x[5]}:${x[6]}`).sort()[0];
  return iso && !iso.startsWith("0000") ? iso : null;
}

function readAt(p, pos, n) {
  const fd = openSync(p, "r"); const b = Buffer.alloc(n); readSync(fd, b, 0, n, pos); closeSync(fd); return b;
}

/** Creation time + duration from the mvhd box of an MP4/MOV */
function mp4Info(p) {
  const size = statSync(p).size;
  for (let pos = 0; pos + 8 <= size;) {
    const h = readAt(p, pos, 16);
    let len = h.readUInt32BE(0);
    const type = h.toString("latin1", 4, 8);
    if (len === 1) len = Number(h.readBigUInt64BE(8)); else if (len === 0) len = size - pos;
    if (type === "moov") {
      const moov = readAt(p, pos, Math.min(len, 8 << 20));
      const i = moov.indexOf("mvhd"), v = moov[i + 4];
      const ct = v === 1 ? Number(moov.readBigUInt64BE(i + 8)) : moov.readUInt32BE(i + 8);
      const scale = v === 1 ? moov.readUInt32BE(i + 24) : moov.readUInt32BE(i + 16);
      const dur = v === 1 ? Number(moov.readBigUInt64BE(i + 28)) : moov.readUInt32BE(i + 20);
      const d = ct > 0 ? new Date((ct - 2082844800) * 1000) : null; // seconds since 1904
      return { date: d && d.getFullYear() > 2005 ? d.toISOString().slice(0, 19) : null, duration: Math.round(dur / scale) };
    }
    if (len < 8) break;
    pos += len;
  }
  return { date: null, duration: 0 };
}

// ── Build ───────────────────────────────────────────────────────────────────
const files = readdirSync(SRC).filter((f) => !excluded.has(f)).sort();
const isPhoto = (f) => /\.(jpe?g|png)$/i.test(f);
const isVideo = (f) => /\.(mp4|mov)$/i.test(f);
const liveClips = new Map(files.filter((f) => /\.mov$/i.test(f)).map((f) => [basename(f, extname(f)).toLowerCase(), f]));

const items = [];
const usedClips = new Set();
let written = 0;

for (const f of files.filter(isPhoto)) {
  const src = join(SRC, f);
  const out = join(OUT, "p", `${slug(f)}.jpg`);
  if (!existsSync(out) || statSync(out).mtimeMs < statSync(src).mtimeMs) {
    let img = sharp(src).rotate();
    if (config.crop?.[f]) img = sharp(await img.toBuffer()).extract(config.crop[f]);
    await img
      .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 80, mozjpeg: true, progressive: true })
      .toFile(out);
    written++;
  }
  const [meta, outMeta] = await Promise.all([sharp(src).metadata(), sharp(out).metadata()]);
  const item = { kind: "photo", src: url(out), w: outMeta.width, h: outMeta.height, date: exifDate(meta.exif) };

  // Live Photo pair: same basename .MOV
  const clip = liveClips.get(basename(f, extname(f)).toLowerCase());
  if (clip) {
    usedClips.add(clip);
    const compressedClip = join(OUT, "v", `live-${slug(clip)}.mp4`);
    Object.assign(item, { kind: "live", video: url(existsSync(compressedClip) ? compressedClip : join(SRC, clip)) });
  }
  items.push(item);
}

const missingPosters = [];
for (const f of files.filter(isVideo)) {
  if (usedClips.has(f)) continue;
  const s = slug(f);
  const poster = join(OUT, "v", `${s}.jpg`);
  const compressed = join(OUT, "v", `${s}.mp4`);
  // Videos that must be cropped (private on-screen text) are never published from the raw file
  if (config.videoCrop?.[f] && !existsSync(compressed)) { missingPosters.push(`${f} (needs cropped encode)`); continue; }
  if (!existsSync(poster)) { missingPosters.push(f); continue; }
  const pm = await sharp(poster).metadata();
  const { date, duration } = mp4Info(join(SRC, f));
  items.push({
    kind: "video",
    src: url(existsSync(compressed) ? compressed : join(SRC, f)),
    poster: url(poster),
    w: pm.width,
    h: pm.height,
    duration,
    date,
  });
}

// Newest first; undated last
items.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
writeFileSync("lib/family-media.json", JSON.stringify(items, null, 1) + "\n");

const n = (k) => items.filter((i) => i.kind === k).length;
console.log(`lib/family-media.json: ${items.length} items (${n("photo")} photos, ${n("live")} live, ${n("video")} videos); ${written} photos (re)encoded; ${excluded.size} excluded`);
if (missingPosters.length) console.log(`⚠ ${missingPosters.length} videos skipped — no poster yet: ${missingPosters.join(", ")}`);
const raw = items.filter((i) => (i.video ?? (i.kind === "video" ? i.src : "")).startsWith("/images/farm/"));
if (raw.length) console.log(`⚠ ${raw.length} item(s) still use raw videos from the git-ignored farm folder (won't deploy) — run scripts/compress-family-videos.mjs`);
