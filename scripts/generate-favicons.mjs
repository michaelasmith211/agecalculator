import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SVG_CONTENT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
    <linearGradient id="redHeader" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ef4444"/>
      <stop offset="100%" stop-color="#f43f5e"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#0f172a" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Squircle Background -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>

  <!-- Calendar Outer Body with Shadow -->
  <g filter="url(#shadow)">
    <!-- Calendar White Card -->
    <rect x="86" y="112" width="340" height="308" rx="44" fill="#ffffff"/>

    <!-- Calendar Red Header Strip -->
    <path d="M 86,156 C 86,131.7 105.7,112 130,112 L 382,112 C 406.3,112 426,131.7 426,156 L 426,196 L 86,196 Z" fill="url(#redHeader)"/>

    <!-- Binder Rings -->
    <rect x="156" y="80" width="28" height="56" rx="14" fill="#ffffff"/>
    <rect x="328" y="80" width="28" height="56" rx="14" fill="#ffffff"/>

    <!-- Date Grid -->
    <rect x="136" y="232" width="44" height="38" rx="8" fill="#e2e8f0"/>
    <rect x="206" y="232" width="44" height="38" rx="8" fill="#e2e8f0"/>
    <rect x="276" y="232" width="44" height="38" rx="8" fill="#e2e8f0"/>
    <rect x="346" y="232" width="44" height="38" rx="8" fill="#e2e8f0"/>

    <rect x="136" y="290" width="44" height="38" rx="8" fill="#e2e8f0"/>
    <rect x="206" y="290" width="44" height="38" rx="8" fill="#2563eb"/>
    <rect x="276" y="290" width="44" height="38" rx="8" fill="#e2e8f0"/>
    <rect x="346" y="290" width="44" height="38" rx="8" fill="#e2e8f0"/>

    <rect x="136" y="348" width="44" height="38" rx="8" fill="#e2e8f0"/>
    <rect x="206" y="348" width="44" height="38" rx="8" fill="#e2e8f0"/>
    <rect x="276" y="348" width="44" height="38" rx="8" fill="#e2e8f0"/>
    <rect x="346" y="348" width="44" height="38" rx="8" fill="#e2e8f0"/>
  </g>
</svg>`;

async function main() {
  const publicDir = path.resolve(process.cwd(), 'public');
  const srcAppDir = path.resolve(process.cwd(), 'src/app');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Write SVG files
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), SVG_CONTENT);
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), SVG_CONTENT);
  fs.writeFileSync(path.join(srcAppDir, 'icon.svg'), SVG_CONTENT);
  console.log('✓ SVG icons generated');

  const svgBuffer = Buffer.from(SVG_CONTENT);

  // 2. Generate PNG sizes required by Google Search, iOS, Android & browsers
  const sizes = [
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'favicon-96x96.png', size: 96 },
    { name: 'favicon-192x192.png', size: 192 },
    { name: 'favicon-512x512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'apple-touch-icon-precomposed.png', size: 180 }
  ];

  for (const s of sizes) {
    const pngBuf = await sharp(svgBuffer)
      .resize(s.size, s.size)
      .png({ compressionLevel: 9 })
      .toBuffer();
    fs.writeFileSync(path.join(publicDir, s.name), pngBuf);
    console.log(`✓ Generated ${s.name} (${s.size}x${s.size})`);
  }

  // 3. Generate standard favicon.ico (multi-size ICO container with 48x48, 32x32, 16x16)
  // Generating a 48x48 PNG and packaging it as ICO header or standard 48x48 ICO buffer
  const p48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  const p32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const p16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();

  // Create standard multi-image ICO binary
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type 1 = ICO
  icoHeader.writeUInt16LE(3, 4); // Number of images = 3

  const images = [
    { buf: p48, width: 48, height: 48 },
    { buf: p32, width: 32, height: 32 },
    { buf: p16, width: 16, height: 16 }
  ];

  let offset = 6 + (16 * images.length);
  const dirEntries = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.buf.length, 8); // Image size in bytes
    entry.writeUInt32LE(offset, 12); // Offset of image data
    dirEntries.push(entry);
    offset += img.buf.length;
  }

  const icoBuffer = Buffer.concat([
    icoHeader,
    ...dirEntries,
    ...images.map(img => img.buf)
  ]);

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(srcAppDir, 'favicon.ico'), icoBuffer);
  console.log('✓ Generated multi-resolution favicon.ico (16, 32, 48px)');

  console.log('Favicon generation completed successfully!');
}

main().catch((err) => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
