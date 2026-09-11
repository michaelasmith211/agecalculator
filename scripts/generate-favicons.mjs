import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// High-contrast, SEO-optimized SVG icon for Google Search, browser tabs, and bookmarks
// Engineered for maximum legibility and recognition even when rescaled down to 16x16 px
const SVG_CONTENT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient: Rich Royal Blue -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e40af"/>
      <stop offset="50%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>

    <!-- Calendar Red Header Gradient -->
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#f43f5e"/>
    </linearGradient>

    <!-- Dial Gradient -->
    <linearGradient id="dialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>

    <!-- Drop Shadow for Calendar Sheet -->
    <filter id="cardShadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#0f172a" flood-opacity="0.32"/>
    </filter>
  </defs>

  <!-- Outer Rounded Squircle Base (Google Search friendly silhouette) -->
  <rect width="512" height="512" rx="116" fill="url(#bgGrad)"/>
  
  <!-- Subtle Inner Border Highlight -->
  <rect x="6" y="6" width="500" height="500" rx="110" fill="none" stroke="#ffffff" stroke-width="4" stroke-opacity="0.2"/>

  <!-- Calendar Container with Subtle Shadow -->
  <g filter="url(#cardShadow)">
    <!-- Calendar White Sheet -->
    <rect x="72" y="96" width="368" height="336" rx="44" fill="#ffffff"/>

    <!-- Calendar Red Header Strip -->
    <path d="M 72,140 C 72,115.7 91.7,96 116,96 L 396,96 C 420.3,96 440,115.7 440,140 L 440,192 L 72,192 Z" fill="url(#headerGrad)"/>

    <!-- Binder Rings (Bold White Loops with Silver Rim) -->
    <rect x="146" y="64" width="36" height="64" rx="18" fill="#ffffff"/>
    <rect x="152" y="70" width="24" height="52" rx="12" fill="#cbd5e1"/>
    <rect x="156" y="74" width="16" height="44" rx="8" fill="#ffffff"/>

    <rect x="330" y="64" width="36" height="64" rx="18" fill="#ffffff"/>
    <rect x="336" y="70" width="24" height="52" rx="12" fill="#cbd5e1"/>
    <rect x="340" y="74" width="16" height="44" rx="8" fill="#ffffff"/>

    <!-- Central Precision Clock Face (Represents Age, Time Elapsed & Real-Time Calculation) -->
    <!-- Outer Dial Circle -->
    <circle cx="256" cy="312" r="94" fill="url(#dialGrad)" stroke="#2563eb" stroke-width="16"/>

    <!-- 4 Major Hour Ticks (12, 3, 6, 9) -->
    <line x1="256" y1="230" x2="256" y2="244" stroke="#2563eb" stroke-width="8" stroke-linecap="round"/>
    <line x1="338" y1="312" x2="324" y2="312" stroke="#2563eb" stroke-width="8" stroke-linecap="round"/>
    <line x1="256" y1="394" x2="256" y2="380" stroke="#2563eb" stroke-width="8" stroke-linecap="round"/>
    <line x1="174" y1="312" x2="188" y2="312" stroke="#2563eb" stroke-width="8" stroke-linecap="round"/>

    <!-- Hour Hand (pointing to 10 o'clock - dynamic position) -->
    <line x1="256" y1="312" x2="204" y2="264" stroke="#1e3a8a" stroke-width="16" stroke-linecap="round"/>

    <!-- Minute Hand (pointing to 2 o'clock) -->
    <line x1="256" y1="312" x2="308" y2="248" stroke="#2563eb" stroke-width="12" stroke-linecap="round"/>

    <!-- Center Pivot Pin -->
    <circle cx="256" cy="312" r="14" fill="#ef4444"/>
    <circle cx="256" cy="312" r="6" fill="#ffffff"/>
  </g>
</svg>`;

// PWA Maskable icon with safe zone padding (central 80% circle)
const MASKABLE_SVG_CONTENT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e40af"/>
      <stop offset="50%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#f43f5e"/>
    </linearGradient>
  </defs>

  <!-- Full-bleed background for maskable adaptive clipping -->
  <rect width="512" height="512" fill="url(#bgGrad)"/>

  <!-- Centered calendar within 80% safe zone -->
  <g transform="translate(25.6, 25.6) scale(0.9)">
    <rect x="72" y="96" width="368" height="336" rx="44" fill="#ffffff"/>
    <path d="M 72,140 C 72,115.7 91.7,96 116,96 L 396,96 C 420.3,96 440,115.7 440,140 L 440,192 L 72,192 Z" fill="url(#headerGrad)"/>

    <rect x="146" y="64" width="36" height="64" rx="18" fill="#ffffff"/>
    <rect x="152" y="70" width="24" height="52" rx="12" fill="#cbd5e1"/>
    <rect x="156" y="74" width="16" height="44" rx="8" fill="#ffffff"/>

    <rect x="330" y="64" width="36" height="64" rx="18" fill="#ffffff"/>
    <rect x="336" y="70" width="24" height="52" rx="12" fill="#cbd5e1"/>
    <rect x="340" y="74" width="16" height="44" rx="8" fill="#ffffff"/>

    <circle cx="256" cy="312" r="94" fill="#ffffff" stroke="#2563eb" stroke-width="16"/>
    <line x1="256" y1="230" x2="256" y2="244" stroke="#2563eb" stroke-width="8" stroke-linecap="round"/>
    <line x1="338" y1="312" x2="324" y2="312" stroke="#2563eb" stroke-width="8" stroke-linecap="round"/>
    <line x1="256" y1="394" x2="256" y2="380" stroke="#2563eb" stroke-width="8" stroke-linecap="round"/>
    <line x1="174" y1="312" x2="188" y2="312" stroke="#2563eb" stroke-width="8" stroke-linecap="round"/>

    <line x1="256" y1="312" x2="204" y2="264" stroke="#1e3a8a" stroke-width="16" stroke-linecap="round"/>
    <line x1="256" y1="312" x2="308" y2="248" stroke="#2563eb" stroke-width="12" stroke-linecap="round"/>

    <circle cx="256" cy="312" r="14" fill="#ef4444"/>
    <circle cx="256" cy="312" r="6" fill="#ffffff"/>
  </g>
</svg>`;

async function main() {
  const publicDir = path.resolve(process.cwd(), 'public');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Write clean SVG vector icons for modern browsers
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), SVG_CONTENT);
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), SVG_CONTENT);
  console.log('✓ SVG icons generated');

  const svgBuffer = Buffer.from(SVG_CONTENT);
  const maskableBuffer = Buffer.from(MASKABLE_SVG_CONTENT);

  // 2. Generate PNG sizes strictly adhering to Google Search & modern devices:
  // - 48x48 (Google Search official recommendation)
  // - 96x96 (Google Search 2x retina)
  // - 144x144 (Google Search 3x & Windows tiles)
  // - 192x192 (Android Chrome home screen & Google 4x)
  // - 512x512 (PWA & Web Store)
  // - 180x180 (Apple Touch Icon for iOS Safari)
  const sizes = [
    { name: 'favicon-48x48.png', size: 48, buf: svgBuffer },
    { name: 'favicon-96x96.png', size: 96, buf: svgBuffer },
    { name: 'favicon-144x144.png', size: 144, buf: svgBuffer },
    { name: 'favicon-192x192.png', size: 192, buf: svgBuffer },
    { name: 'favicon-512x512.png', size: 512, buf: svgBuffer },
    { name: 'maskable-icon-512x512.png', size: 512, buf: maskableBuffer },
    { name: 'apple-touch-icon.png', size: 180, buf: svgBuffer },
    { name: 'apple-touch-icon-precomposed.png', size: 180, buf: svgBuffer }
  ];

  for (const s of sizes) {
    const pngBuf = await sharp(s.buf)
      .resize(s.size, s.size)
      .png({ compressionLevel: 9 })
      .toBuffer();
    fs.writeFileSync(path.join(publicDir, s.name), pngBuf);
    console.log(`✓ Generated ${s.name} (${s.size}x${s.size})`);
  }

  // 3. Generate multi-resolution favicon.ico container (16x16, 32x32, 48x48)
  const p48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  const p32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const p16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();

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
  console.log('✓ Generated multi-resolution favicon.ico (16, 32, 48px)');

  // 4. Generate Windows browserconfig.xml
  const browserConfigXml = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/favicon-192x192.png"/>
      <TileColor>#2563eb</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;
  fs.writeFileSync(path.join(publicDir, 'browserconfig.xml'), browserConfigXml);
  console.log('✓ Generated browserconfig.xml');

  console.log('Favicon generation completed successfully!');
}

main().catch((err) => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
