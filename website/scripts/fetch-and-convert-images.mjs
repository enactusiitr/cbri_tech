#!/usr/bin/env node
/*
  Script: fetch-and-convert-images.mjs
  - Reads `data/menuInside.ts`, extracts menu item ids and names
  - Downloads a matching image from Unsplash for each item
  - Converts each image to WebP using sharp and saves to `public/images/menu/<id>.webp`
  - Updates `data/menuInside.ts` to point to the new WebP files

  Note: Uses Unsplash Source (no API key). Images are free to use but check Unsplash terms if needed.
*/

import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

// Use current working directory as repository root when running the script
const repoRoot = process.cwd();
const dataFile = path.join(repoRoot, "data/menuInside.ts");
const publicMenuDir = path.join(repoRoot, "public/images/menu");

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    // ignore
  }
}

function extractItems(tsText) {
  // crude parser: find object blocks and extract id and name
  const items = [];
  const objectRegex = /\{([\s\S]*?)\}/g;
  let match;
  while ((match = objectRegex.exec(tsText)) !== null) {
    const block = match[1];
    const idMatch = /id:\s*"([^"]+)"/.exec(block);
    const nameMatch = /name:\s*"([^"]+)"/.exec(block);
    if (idMatch && nameMatch) {
      items.push({ id: idMatch[1], name: nameMatch[1], blockText: block });
    }
  }
  return items;
}

async function downloadImageFor(query, outPath) {
  // Try Unsplash Source first
  const unsplash = `https://source.unsplash.com/1200x800/?${encodeURIComponent(query)}`;
  console.log(`Trying Unsplash ${unsplash} -> ${outPath}`);
  try {
    const res = await fetch(unsplash, { redirect: 'follow' });
    if (res.ok) {
      const buffer = await res.arrayBuffer();
      await fs.writeFile(outPath, Buffer.from(buffer));
      return;
    }
    console.warn(`Unsplash returned ${res.status}, falling back`);
  } catch (e) {
    console.warn(`Unsplash error: ${e.message}, falling back`);
  }

  // Fallback to LoremFlickr which serves images by tag
  const lorem = `https://loremflickr.com/1200/800/${encodeURIComponent(query)}`;
  console.log(`Trying LoremFlickr ${lorem} -> ${outPath}`);
  const res2 = await fetch(lorem, { redirect: 'follow' });
  if (!res2.ok) throw new Error(`Failed to download ${lorem}: ${res2.status}`);
  const buffer2 = await res2.arrayBuffer();
  await fs.writeFile(outPath, Buffer.from(buffer2));
}

async function main() {
  console.log("Reading data file:", dataFile);
  const ts = await fs.readFile(dataFile, "utf8");
  const items = extractItems(ts);
  console.log(`Found ${items.length} menu items`);

  await ensureDir(publicMenuDir);

  // read existing images in public menu dir for local fallback
  let existingFiles = [];
  try { existingFiles = (await fs.readdir(publicMenuDir)).filter(f => /\.(jpe?g|png|webp)$/i.test(f)); } catch (e) { existingFiles = []; }

  const replacements = [];

  for (const it of items) {
    const filenameJpg = `${it.id}.jpg`;
    const tempJpgPath = path.join(publicMenuDir, filenameJpg);
    const outWebp = `${it.id}.webp`;
    const outWebpPath = path.join(publicMenuDir, outWebp);

    let succeeded = false;
    try {
      const query = `${it.name} food`;
      await downloadImageFor(query, tempJpgPath);
      // convert to webp
      await sharp(tempJpgPath).resize(1200, 800, { fit: 'cover' }).webp({ quality: 80 }).toFile(outWebpPath);
      // remove temp jpg
      await fs.unlink(tempJpgPath);

      replacements.push({ id: it.id, webp: `/images/menu/${outWebp}` });
      console.log(`Saved ${outWebpPath}`);
      succeeded = true;
    } catch (e) {
      console.warn(`Download failed for ${it.id}: ${e.message}`);
    }

    if (!succeeded) {
      // Try to find a local best-match image file in existingFiles
      const findLocalMatch = (name, files) => {
        const tokens = name.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
        if (!tokens.length) return null;
        // score files by number of token matches in filename
        let best = null;
        let bestScore = 0;
        for (const f of files) {
          const fname = f.toLowerCase();
          let score = 0;
          for (const t of tokens) if (fname.includes(t)) score++;
          if (score > bestScore) { bestScore = score; best = f; }
        }
        return bestScore > 0 ? best : null;
      };

      const match = findLocalMatch(it.name, existingFiles);
      if (match) {
        const localPath = path.join(publicMenuDir, match);
        try {
          await sharp(localPath).resize(1200, 800, { fit: 'cover' }).webp({ quality: 80 }).toFile(outWebpPath);
          replacements.push({ id: it.id, webp: `/images/menu/${outWebp}` });
          console.log(`Used local image ${match} -> ${outWebp}`);
          succeeded = true;
        } catch (e) {
          console.error(`Failed to convert local ${match} for ${it.id}: ${e.message}`);
        }
      } else {
        console.warn(`No local match found for ${it.name} (${it.id})`);
      }
    }
  }

  // Update data file: replace image: "..." occurrences for each id
  let newTs = ts;
  for (const r of replacements) {
    // Replace image: "..." in block that contains id: "r.id"
    const blockPattern = new RegExp(`(\\{[\\s\\S]*?id:\\s*"${r.id}"[\\s\\S]*?)image:\\s*"[^"]*"`, 'g');
    newTs = newTs.replace(blockPattern, `$1image: "${r.webp}"`);
  }

  // Backup original
  await fs.writeFile(dataFile + ".bak", ts, "utf8");
  await fs.writeFile(dataFile, newTs, "utf8");
  console.log(`Updated data file and created backup at ${dataFile}.bak`);
}

main().catch(err => { console.error(err); process.exit(1); });
