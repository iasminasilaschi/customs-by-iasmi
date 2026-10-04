// Usage: npm run media:prepare -- <input-folder> <output-folder>
// Resizes photos to max 2000px (JPG, rotated by EXIF, metadata stripped so
// no GPS location is published) and compresses videos to web-friendly mp4.
import { readdirSync, mkdirSync, statSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage: npm run media:prepare -- <input-folder> <output-folder>");
  process.exit(1);
}
mkdirSync(output, { recursive: true });

const photos = new Set([".jpg", ".jpeg", ".png", ".heic", ".webp"]);
const videos = new Set([".mp4", ".mov", ".m4v"]);

for (const file of readdirSync(input).sort()) {
  const full = join(input, file);
  if (!statSync(full).isFile()) continue;
  const ext = extname(file).toLowerCase();
  const name = basename(file, extname(file));
  if (photos.has(ext)) {
    const out = join(output, `${name}.jpg`);
    await sharp(full)
      .rotate() // honour phone orientation; metadata (incl. GPS) is dropped
      .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(out);
    console.log("photo ", out);
  } else if (videos.has(ext)) {
    const out = join(output, `${name}.mp4`);
    const r = spawnSync(
      "ffmpeg",
      ["-y", "-i", full, "-vf", "scale='min(1080,iw)':-2", "-c:v", "libx264", "-crf", "28",
       "-preset", "slow", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart",
       "-map_metadata", "-1", out],
      { stdio: "ignore" },
    );
    console.log(r.status === 0 ? "video " : "FAILED", out);
  }
}
