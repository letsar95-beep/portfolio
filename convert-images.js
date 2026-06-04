const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES = path.join(__dirname, 'images');
const ORIG = path.join(IMAGES, 'originals');
const QUALITY = 95;
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
function human(n) {
  if (n > 1024 * 1024) return (n / 1024 / 1024).toFixed(2) + ' MB';
  return (n / 1024).toFixed(1) + ' KB';
}

(async () => {
  // источник — оригиналы в images/originals
  const files = walk(ORIG);
  const rows = [];
  let totalBefore = 0, totalAfter = 0;

  for (const file of files) {
    const rel = path.relative(ORIG, file);            // напр. "кейс Франшиза/image 0.png"
    const before = fs.statSync(file).size;
    const webpPath = path.join(IMAGES, rel).replace(/\.(png|jpe?g)$/i, '.webp');

    fs.mkdirSync(path.dirname(webpPath), { recursive: true });
    await sharp(file).webp({ quality: QUALITY, effort: 6 }).toFile(webpPath);
    const after = fs.statSync(webpPath).size;

    totalBefore += before; totalAfter += after;
    rows.push({ rel, before, after, pct: ((1 - after / before) * 100) });
  }

  const pad = (s, n) => String(s).padEnd(n);
  const padL = (s, n) => String(s).padStart(n);
  const w = Math.max(...rows.map(r => r.rel.length), 9);
  console.log('quality=' + QUALITY + ', effort=6\n');
  console.log(pad('Файл', w) + ' | ' + padL('До', 10) + ' | ' + padL('После', 10) + ' | ' + padL('Сжатие', 8));
  console.log('-'.repeat(w) + '-+-' + '-'.repeat(10) + '-+-' + '-'.repeat(10) + '-+-' + '-'.repeat(8));
  for (const r of rows.sort((a, b) => a.rel.localeCompare(b.rel))) {
    console.log(pad(r.rel, w) + ' | ' + padL(human(r.before), 10) + ' | ' + padL(human(r.after), 10) + ' | ' + padL(r.pct.toFixed(1) + '%', 8));
  }
  console.log('-'.repeat(w) + '-+-' + '-'.repeat(10) + '-+-' + '-'.repeat(10) + '-+-' + '-'.repeat(8));
  console.log(pad('ИТОГО (' + rows.length + ')', w) + ' | ' + padL(human(totalBefore), 10) + ' | ' + padL(human(totalAfter), 10) + ' | ' + padL(((1 - totalAfter / totalBefore) * 100).toFixed(1) + '%', 8));
})();
