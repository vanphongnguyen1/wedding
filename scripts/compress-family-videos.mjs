// Compresses the raw family videos in public/images/farm into web-friendly MP4s that live in the repo.
//
//   node scripts/compress-family-videos.mjs        (then: node scripts/build-family-media.mjs)
//
// Needs ffmpeg on PATH (e.g. `winget install Gyan.FFmpeg.Essentials`), or set FFMPEG=C:\path\to\ffmpeg.exe
//
// - Videos      → public/images/family/v/<slug>.mp4   H.264 + AAC, long edge ≤ 1280 (720p), ≤ 30 fps, ≤ ~1.5 Mbps, faststart
// - Posters     → public/images/family/v/<slug>.jpg   (only if missing)
// - Live clips  → public/images/family/v/live-<slug>.mp4  (muted, long edge ≤ 960)
// - videoCrop   → per-file crop from scripts/family-media.config.json, applied before encoding
// Already-compressed files are skipped, so re-running only handles new videos.
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, existsSync, statSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { join, extname, basename } from "node:path";

const SRC = "public/images/farm";
const OUT = "public/images/family/v";
const FFMPEG = process.env.FFMPEG || "ffmpeg";
const config = JSON.parse(readFileSync("scripts/family-media.config.json", "utf8"));
const excluded = new Set(config.exclude ?? []);
const slug = (f) => basename(f, extname(f)).toLowerCase().replace(/\s*\((\d+)\)/g, "-$1").replace(/[^a-z0-9_-]+/g, "-").replace(/^-|-$/g, "");

if (spawnSync(FFMPEG, ["-version"]).error) {
  console.error("ffmpeg not found. Install it (winget install Gyan.FFmpeg.Essentials) or set FFMPEG=<path to ffmpeg.exe>.");
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

// Fit the long edge into `max` px, keep aspect, even dimensions (required by H.264)
const fit = (max) => `scale='if(gt(iw,ih),min(${max},iw),-2)':'if(gt(iw,ih),-2,min(${max},ih))'`;

function ffmpeg(args, out) {
  const tmp = out.replace(/(\.\w+)$/, ".part$1");
  const r = spawnSync(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", ...args, tmp], { stdio: "inherit" });
  if (r.status !== 0) { rmSync(tmp, { force: true }); return false; }
  renameSync(tmp, out); // only publish complete files
  return true;
}

const files = readdirSync(SRC).filter((f) => !excluded.has(f)).sort();
const photoBases = new Set(files.filter((f) => /\.(jpe?g|png)$/i.test(f)).map((f) => basename(f, extname(f)).toLowerCase()));
const videos = files.filter((f) => /\.(mp4|mov)$/i.test(f));

let before = 0, after = 0, done = 0;
const failed = [];
for (const f of videos) {
  const src = join(SRC, f);
  const s = slug(f);
  const isLive = /\.mov$/i.test(f) && photoBases.has(basename(f, extname(f)).toLowerCase());
  const out = join(OUT, isLive ? `live-${s}.mp4` : `${s}.mp4`);

  if (!existsSync(out)) {
    process.stdout.write(`→ ${f} … `);
    // Cropped screen recordings: crop first (removes private on-screen text), drop audio
    const crop = config.videoCrop?.[f];
    const ok = crop
      ? ffmpeg(["-i", src, "-vf", `crop=${crop},${fit(1280)}`, "-an", "-c:v", "libx264", "-crf", "24", "-preset", "slow",
          "-pix_fmt", "yuv420p", "-movflags", "+faststart"], out)
      : isLive
      ? ffmpeg(["-i", src, "-vf", fit(960), "-an", "-c:v", "libx264", "-crf", "28", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart"], out)
      // CRF for quality, capped at ~1.5 Mbps so noisy/detailed phone clips stay small (GitHub rejects files > 100 MB)
      : ffmpeg(["-i", src, "-vf", fit(1280), "-fpsmax", "30", "-c:v", "libx264", "-crf", "28", "-maxrate", "1500k", "-bufsize", "3000k",
          "-preset", "slow", "-profile:v", "high", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-ac", "2", "-movflags", "+faststart"], out);
    if (!ok) { failed.push(f); console.log("FAILED"); continue; }
    done++;
    console.log(`${(statSync(src).size / 1048576).toFixed(1)} MB → ${(statSync(out).size / 1048576).toFixed(1)} MB`);
  }
  before += statSync(src).size;
  after += statSync(out).size;

  const poster = join(OUT, `${s}.jpg`);
  if (!isLive && !existsSync(poster)) {
    ffmpeg(["-ss", "1", "-i", out, "-frames:v", "1", "-vf", fit(1280), "-q:v", "4"], poster);
  }
}

console.log(`\n${done} video(s) compressed this run. Total ${(before / 1048576).toFixed(0)} MB → ${(after / 1048576).toFixed(0)} MB`);
if (failed.length) console.log(`⚠ failed: ${failed.join(", ")}`);
console.log("Next: node scripts/build-family-media.mjs");
