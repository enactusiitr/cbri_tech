#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const publicMenuDir = path.join(process.cwd(), 'public/images/menu');
const dataFile = path.join(process.cwd(), 'data/menuInside.ts');

async function main() {
  const files = await fs.readdir(publicMenuDir);
  const images = files.filter(f => /\.(jpe?g|png)$/i.test(f));
  console.log(`Found ${images.length} local images to convert`);
  for (const img of images) {
    const inPath = path.join(publicMenuDir, img);
    const outName = img.replace(/\.(jpe?g|png)$/i, '.webp');
    const outPath = path.join(publicMenuDir, outName);
    try {
      // convert if not exists
      try { await fs.access(outPath); console.log(`${outName} already exists`); continue; } catch {}
      await sharp(inPath).resize(1200, 800, { fit: 'cover' }).webp({ quality: 80 }).toFile(outPath);
      console.log(`Converted ${img} -> ${outName}`);
    } catch (e) {
      console.error(`Failed to convert ${img}: ${e.message}`);
    }
  }

  // Update data file references from .jpg/.png to .webp when webp exists
  let ts = await fs.readFile(dataFile, 'utf8');
  let changed = false;
  for (const f of images) {
    const webp = f.replace(/\.(jpe?g|png)$/i, '.webp');
    const webpPath = `/images/menu/${webp}`;
    const jpgPath = `/images/menu/${f}`;
    if (ts.includes(jpgPath)) {
      ts = ts.split(jpgPath).join(webpPath);
      changed = true;
    }
  }
  if (changed) {
    await fs.writeFile(dataFile + '.bak2', ts, 'utf8');
    await fs.writeFile(dataFile, ts, 'utf8');
    console.log('Updated data file to reference webp images; backup at data/menuInside.ts.bak2');
  } else {
    console.log('No references to update in data file');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
