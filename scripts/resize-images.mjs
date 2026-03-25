/**
 * Resize large source images to max 2400px, preserving correct orientation via EXIF.
 * Run: node scripts/resize-images.mjs
 */

import sharp from "sharp";
import { readdir, stat, rename } from "fs/promises";
import { join, extname } from "path";

const TARGET_DIR = "public/images";
const MAX_PX = 2400;
const QUALITY = 88;

async function processDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      await processDir(fullPath);
      continue;
    }

    const ext = extname(entry.name).toLowerCase();
    if (![".jpg", ".jpeg"].includes(ext)) continue;

    const { size } = await stat(fullPath);
    const tmpPath = fullPath + ".tmp.jpg";

    await sharp(fullPath)
      .rotate()           // apply EXIF orientation then strip the flag — prevents sideways display
      .resize({
        width: MAX_PX,
        height: MAX_PX,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(tmpPath);

    const { size: newSize } = await stat(tmpPath);
    await rename(tmpPath, fullPath);

    console.log(
      `  ✓  ${fullPath}  ${(size / 1024 / 1024).toFixed(1)} MB → ${(newSize / 1024).toFixed(0)} KB`
    );
  }
}

console.log(`Resizing images in ${TARGET_DIR} (max ${MAX_PX}px, quality ${QUALITY})...\n`);
await processDir(TARGET_DIR);
console.log("\nDone.");
