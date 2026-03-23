#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

const repoRoot = process.cwd();
const foodItemsDir = path.join(repoRoot, 'public/images/menu/food-items');
const dataFile = path.join(repoRoot, 'data/menuOutside.ts');

function nameTokens(s) {
  return s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(Boolean);
}

async function main() {
  const files = await fs.readdir(foodItemsDir).catch(() => []);
  const webpFiles = files.filter(f => f.toLowerCase().endsWith('.webp'));
  if (!webpFiles.length) {
    console.log('No webp files found in', foodItemsDir); process.exit(0);
  }

  let ts = await fs.readFile(dataFile, 'utf8');
  const objectRegex = /\{([\s\S]*?)\}/g;
  const items = [];
  let m;
  while ((m = objectRegex.exec(ts)) !== null) {
    const block = m[1];
    const idM = /id:\s*"([^"]+)"/.exec(block);
    const nameM = /name:\s*"([^"]+)"/.exec(block);
    if (idM && nameM) items.push({ id: idM[1], name: nameM[1] });
  }

  function bestMatch(name) {
    const tokens = nameTokens(name);
    let best = null; let bestScore = 0;
    for (const f of webpFiles) {
      const fname = f.toLowerCase();
      let score = 0;
      for (const t of tokens) if (fname.includes(t)) score++;
      if (score > bestScore) { bestScore = score; best = f; }
    }
    return bestScore > 0 ? best : null;
  }

  const replacements = [];
  let newTs = ts;
  for (const it of items) {
    const match = bestMatch(it.name) || bestMatch(it.id);
    if (match) {
      const webpPath = `/images/menu/food-items/${match}`;
      const blockPattern = new RegExp(`(\\{[\\s\\S]*?id:\\s*"${it.id}"[\\s\\S]*?)image:\\s*"[^"]*"`, 'g');
      if (blockPattern.test(newTs)) {
        newTs = newTs.replace(blockPattern, `$1image: "${webpPath}"`);
        replacements.push({ id: it.id, name: it.name, image: webpPath });
      }
    }
  }

  if (replacements.length) {
    await fs.writeFile(dataFile + '.fooditems.bak', ts, 'utf8');
    await fs.writeFile(dataFile, newTs, 'utf8');
    console.log(`Updated ${dataFile} with ${replacements.length} replacements; backup saved to ${dataFile}.fooditems.bak`);
    console.table(replacements.map(r => ({ id: r.id, name: r.name, image: r.image })));
  } else {
    console.log('No replacements made for', dataFile);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
