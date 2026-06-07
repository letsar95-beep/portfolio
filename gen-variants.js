const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES = path.join(__dirname, 'images');
const ORIG = path.join(IMAGES, 'originals');
const WIDTHS = [800, 1600];           // адаптивные ширины (только меньше оригинала)
const exts = new Set(['.png', '.jpg', '.jpeg']);

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, files);
    else if (exts.has(path.extname(name).toLowerCase())) files.push(full);
  }
  return files;
}

(async () => {
  const files = walk(ORIG);
  const manifest = {};
  let made = 0;

  for (const file of files) {
    const rel = path.relative(ORIG, file);               // "кейс Франшиза/image 0.png"
    const meta = await sharp(file).metadata();
    if (!meta.width || meta.width < 1000) continue;       // мелкие — без вариантов

    const relDir = path.dirname(rel);
    const base = path.basename(rel).replace(/\.(png|jpe?g)$/i, '');
    const fullKey = 'images/' + (relDir === '.' ? '' : relDir + '/') + base + '.webp';
    const variants = [];

    for (const w of WIDTHS) {
      if (w >= meta.width) continue;
      const outRel = (relDir === '.' ? '' : relDir + '/') + base + '-' + w + '.webp';
      const outAbs = path.join(IMAGES, outRel);
      fs.mkdirSync(path.dirname(outAbs), { recursive: true });
      await sharp(file).resize({ width: w }).webp({ lossless: true, effort: 6 }).toFile(outAbs);
      variants.push(w);
      made++;
    }
    manifest[fullKey] = { fullW: meta.width, variants };
  }

  fs.writeFileSync(path.join(__dirname, 'variants-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('variants made:', made, '| base images:', Object.keys(manifest).length);
})();
