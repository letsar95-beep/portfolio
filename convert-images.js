const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES = path.join(__dirname, 'images');
const ORIG = path.join(IMAGES, 'originals');
const exts = new Set(['.png', '.jpg', '.jpeg']);

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (full === ORIG) continue; // не заходим в originals
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
  const files = walk(IMAGES);
  const rows = [];
  let totalBefore = 0, totalAfter = 0;

  for (const file of files) {
    const rel = path.relative(IMAGES, file);
    const before = fs.statSync(file).size;
    const webpPath = file.replace(/\.(png|jpe?g)$/i, '.webp');

    await sharp(file).webp({ quality: 85, effort: 6 }).toFile(webpPath);
    const after = fs.statSync(webpPath).size;

    // переносим оригинал в images/originals/<rel>
    const dest = path.join(ORIG, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.renameSync(file, dest);

    totalBefore += before; totalAfter += after;
    rows.push({ rel, before, after, pct: ((1 - after / before) * 100) });
  }

  // печать таблицы
  const pad = (s, n) => String(s).padEnd(n);
  const padL = (s, n) => String(s).padStart(n);
  const w = Math.max(...rows.map(r => r.rel.length), 9);
  console.log(pad('Файл', w) + ' | ' + padL('До', 10) + ' | ' + padL('После', 10) + ' | ' + padL('Сжатие', 8));
  console.log('-'.repeat(w) + '-+-' + '-'.repeat(10) + '-+-' + '-'.repeat(10) + '-+-' + '-'.repeat(8));
  for (const r of rows.sort((a, b) => a.rel.localeCompare(b.rel))) {
    console.log(pad(r.rel, w) + ' | ' + padL(human(r.before), 10) + ' | ' + padL(human(r.after), 10) + ' | ' + padL(r.pct.toFixed(1) + '%', 8));
  }
  console.log('-'.repeat(w) + '-+-' + '-'.repeat(10) + '-+-' + '-'.repeat(10) + '-+-' + '-'.repeat(8));
  console.log(pad('ИТОГО (' + rows.length + ' файлов)', w) + ' | ' + padL(human(totalBefore), 10) + ' | ' + padL(human(totalAfter), 10) + ' | ' + padL(((1 - totalAfter / totalBefore) * 100).toFixed(1) + '%', 8));
})();
