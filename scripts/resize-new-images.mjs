/**
 * Resize only newly staged images (git status A).
 * Applies EXIF rotation to prevent sideways display.
 * Run: node scripts/resize-new-images.mjs
 */

import sharp from "sharp";
import { stat, rename } from "fs/promises";
import { execSync } from "child_process";

const MAX_PX = 2400;
const QUALITY = 88;

const newFiles = execSync("git status --short public/images/", { encoding: "utf8" })
  .split("\n")
  .filter((l) => l.startsWith("A "))
  .map((l) => l.replace(/^A\s+/, "").trim())
  .filter((f) => /\.(jpg|jpeg)$/i.test(f));

console.log(`Found ${newFiles.length} new images to process...\n`);

for (const filePath of newFiles) {
  const tmpPath = filePath + ".tmp.jpg";

  const { size } = await stat(filePath);

  await sharp(filePath)
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
  await rename(tmpPath, filePath);

  console.log(
    `  ✓  ${filePath}  ${(size / 1024 / 1024).toFixed(1)} MB → ${(newSize / 1024).toFixed(0)} KB`
  );
}

console.log("\nDone.");
