#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const repoRoot = process.cwd();
const srcDir = path.join(repoRoot, 'food items');
const destDir = path.join(repoRoot, 'public/images/menu/food-items');
const dataFile = path.join(repoRoot, 'data/menuInside.ts');

async function ensureDir(d) {
  try { await fs.mkdir(d, { recursive: true }); } catch (e) {}
}

function nameTokens(s) {
  return s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean);
}

async function convertAndCopy() {
  await ensureDir(destDir);
  const files = await fs.readdir(srcDir);
  const copied = [];
  for (const f of files) {
    const inPath = path.join(srcDir, f);
    const stat = await fs.stat(inPath);
    if (!stat.isFile()) continue;
    const ext = path.extname(f).toLowerCase();
    const base = path.basename(f, ext).replace(/\s+/g, '-').toLowerCase();
    const outName = `${base}.webp`;
    const outPath = path.join(destDir, outName);
    try {
      // convert using sharp
      await sharp(inPath).resize(1200, 800, { fit: 'cover' }).webp({ quality: 80 }).toFile(outPath);
      copied.push({ src: f, out: outName });
      console.log(`Converted ${f} -> ${outName}`);
    } catch (e) {
      console.error(`Failed to convert ${f}: ${e.message}`);
    }
  }
  return copied;
}

async function updateDataFile(copied) {
  let ts = await fs.readFile(dataFile, 'utf8');
  // parse items: crude extraction of objects with id and name
  const objectRegex = /\{([\s\S]*?)\}/g;
  const items = [];
  let m;
  while ((m = objectRegex.exec(ts)) !== null) {
    const block = m[1];
    const idM = /id:\s*"([^"]+)"/.exec(block);
    const nameM = /name:\s*"([^"]+)"/.exec(block);
    if (idM && nameM) items.push({ id: idM[1], name: nameM[1], blockStart: m.index, blockText: block });
  }

  const fileNames = copied.map(c => c.out);

  function bestMatchFor(name) {
    const tokens = nameTokens(name);
    let best = null; let bestScore = 0;
    for (const f of fileNames) {
      const fname = f.toLowerCase();
      let score = 0;
      for (const t of tokens) if (fname.includes(t)) score++;
      if (score > bestScore) { bestScore = score; best = f; }
    }
    return bestScore > 0 ? best : null;
  }

  // perform replacements
  let newTs = ts;
  const replacements = [];
  for (const it of items) {
    const match = bestMatchFor(it.name) || bestMatchFor(it.id) || null;
    if (match) {
      const webpPath = `/images/menu/food-items/${match}`;
      // replace the image: "..." inside the block corresponding to this item id
      const blockPattern = new RegExp(`(\\{[\\s\\S]*?id:\\s*"${it.id}"[\\s\\S]*?)image:\\s*"[^"]*"`, 'g');
      if (blockPattern.test(newTs)) {
        newTs = newTs.replace(blockPattern, `$1image: "${webpPath}"`);
        replacements.push({ id: it.id, image: webpPath });
      }
    }
  }

  if (replacements.length) {
    await fs.writeFile(dataFile + '.fooditems.bak', ts, 'utf8');
    await fs.writeFile(dataFile, newTs, 'utf8');
    console.log(`Updated ${dataFile} with ${replacements.length} replacements; backup created at ${dataFile}.fooditems.bak`);
  } else {
    console.log('No replacements made');
  }
  return replacements;
}

async function main() {
  try {
    const copied = await convertAndCopy();
    const reps = await updateDataFile(copied);
    console.log('Done. Replacements:', reps.length);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
