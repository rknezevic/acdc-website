const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, '..', 'img');
const QUALITY = 80;

function findJpgFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findJpgFiles(fullPath));
    } else if (entry.isFile() && /\.(jpg|jpeg)$/i.test(entry.name)) {
      results.push(fullPath);
    }
  }

  return results;
}

async function optimizeImages() {
  const files = findJpgFiles(IMG_DIR);
  console.log(`Found ${files.length} JPG files to convert...`);

  let converted = 0;
  let skipped = 0;

  for (const file of files) {
    const webpPath = file.replace(/\.(jpg|jpeg)$/i, '.webp');

    // Skip if WebP already exists and is newer than source
    if (fs.existsSync(webpPath)) {
      const srcStat = fs.statSync(file);
      const webpStat = fs.statSync(webpPath);
      if (webpStat.mtimeMs >= srcStat.mtimeMs) {
        skipped++;
        continue;
      }
    }

    try {
      await sharp(file)
        .webp({ quality: QUALITY })
        .toFile(webpPath);
      converted++;
      console.log(`✓ ${path.relative(IMG_DIR, webpPath)}`);
    } catch (err) {
      console.error(`✗ ${path.relative(IMG_DIR, file)}: ${err.message}`);
    }
  }

  console.log(`\nDone! Converted: ${converted}, Skipped: ${skipped}, Total: ${files.length}`);
}

optimizeImages();
