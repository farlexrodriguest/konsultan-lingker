#!/usr/bin/env node
import sharp from 'sharp';
import { resolve, basename } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(__dirname, '..');

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Usage: node scripts/svg-to-raster.mjs <svg-file> [output.ext]');
  console.error('  Output extension defaults to .png; pass .webp for WebP.');
  process.exit(1);
}

const inputPath = resolve(root, args[0]);
const outExt = args[1] ? args[1].replace(/^.*(\.[a-z]+)$/i, '$1').toLowerCase() : '.png';
let outputPath = args[1]
  ? resolve(root, args[1])
  : inputPath.replace(/\.svg$/i, outExt);

try {
  mkdirSync(resolve(outputPath, '..'), { recursive: true });
  const info = await sharp(inputPath)
    [outExt === '.webp' ? 'webp' : 'png']()
    .toFile(outputPath);
  console.log(`${basename(inputPath)} → ${basename(outputPath)} (${info.size} bytes)`);
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}