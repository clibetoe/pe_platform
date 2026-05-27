#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import url from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const svgPath = path.join(projectRoot, 'public', 'assets', 'logo', 'logo.svg');
const out1 = path.join(projectRoot, 'public', 'assets', 'logo', 'logo.png');
const out2 = path.join(projectRoot, 'public', 'assets', 'logo', 'logo@2x.png');

async function run() {
  try {
    const svg = await fs.readFile(svgPath);

    // Generate 2x first (larger), then 1x
    await sharp(svg).png({ compressionLevel: 9 }).resize({ width: 480 }).toFile(out2);
    await sharp(svg).png({ compressionLevel: 9 }).resize({ width: 240 }).toFile(out1);

    console.log('Generated:', out1);
    console.log('Generated:', out2);
  } catch (err) {
    console.error('Failed to generate PNGs:', err.message || err);
    process.exit(1);
  }
}

run();
