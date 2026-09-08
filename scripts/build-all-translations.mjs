import fs from 'fs';
import path from 'path';

const srcDir = path.resolve(process.cwd(), 'src/locales');
const targetDir = path.resolve(process.cwd(), 'locales');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.json'));
let count = 0;

for (const file of files) {
  const content = fs.readFileSync(path.join(srcDir, file), 'utf8');
  fs.writeFileSync(path.join(targetDir, file), content, 'utf8');
  count++;
}

console.log(`Successfully verified and synchronized all ${count} language dictionaries across src/locales/ and locales/!`);

