const fs = require('fs');
const path = require('path');

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'variants-manifest.json'), 'utf8'));
// нормализованный поиск (macOS отдаёт имена в NFD, в HTML — NFC)
const byNFC = {};
for (const k in manifest) byNFC[k.normalize('NFC')] = manifest[k];

function sizesFor(file, key) {
  if (key.includes('Маруся/') || key.includes('Мотивационное')) return '(min-width: 1400px) 1400px, 100vw';
  if (file === 'index.html') return '(min-width: 961px) 561px, 100vw';
  return '(min-width: 1101px) 1100px, 100vw';
}

const htmlFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));
let total = 0;

for (const file of htmlFiles) {
  let s = fs.readFileSync(file, 'utf8');
  let n = 0;
  s = s.replace(/<img\b[^>]*>/g, tag => {
    if (/\ssrcset=/.test(tag)) return tag;
    const m = tag.match(/\ssrc="([^"]+)"/);
    if (!m) return tag;
    const rawSrc = m[1];
    const rawNoQuery = rawSrc.split('?')[0];                       // рабочий путь (нужная нормализация/кодировка)
    const key = decodeURIComponent(rawSrc.replace(/^\.\//, '').split('?')[0]).normalize('NFC');
    const entry = byNFC[key];
    if (!entry) return tag;

    const urls = entry.variants.map(w => rawNoQuery.replace(/\.webp$/, '-' + w + '.webp') + ' ' + w + 'w');
    urls.push(rawNoQuery + ' ' + entry.fullW + 'w');
    const srcset = urls.join(', ');
    const sizes = sizesFor(file, key);
    const dataFull = rawNoQuery;

    n++;
    return tag.replace(/^<img\b/,
      '<img srcset="' + srcset + '" sizes="' + sizes + '" data-full="' + dataFull + '"');
  });
  if (n) fs.writeFileSync(file, s);
  console.log(file, '+srcset:', n);
  total += n;
}
console.log('TOTAL added now:', total);
