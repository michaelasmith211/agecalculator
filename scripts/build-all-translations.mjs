import fs from 'fs';
import path from 'path';

import { en } from './translations/en.mjs';
import { es, fr, de, it, pt, nl } from './translations/western_europe.mjs';
import { hi, mr, bn, ar, ur, fa, he } from './translations/south_asian_middle_east.mjs';
import { zh, ja, ko, id } from './translations/east_southeast_asian.mjs';
import { ru, tr, pl, cs, el, sv, da, fi, no } from './translations/nordic_slavic_other.mjs';

const ALL_LANGUAGES = {
  en,
  es,
  fr,
  de,
  it,
  pt,
  nl,
  hi,
  mr,
  bn,
  ar,
  ur,
  fa,
  he,
  zh,
  ja,
  ko,
  id,
  ru,
  tr,
  pl,
  cs,
  el,
  sv,
  da,
  fi,
  no
};

const outputDirs = [
  path.resolve(process.cwd(), 'src/locales'),
  path.resolve(process.cwd(), 'locales')
];

for (const dir of outputDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

let count = 0;
for (const [code, dict] of Object.entries(ALL_LANGUAGES)) {
  const jsonContent = JSON.stringify(dict, null, 2);
  for (const dir of outputDirs) {
    const targetFile = path.join(dir, `${code}.json`);
    fs.writeFileSync(targetFile, jsonContent, 'utf8');
  }
  count++;
}

console.log(`Successfully generated and wrote ${count} language dictionaries to both src/locales/ and locales/!`);
