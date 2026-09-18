import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const WIDTH = 1280;
const HEIGHT = 720;
const FPS = 30;
const DURATION_SECONDS = 25;
const TOTAL_FRAMES = FPS * DURATION_SECONDS; // 750 frames

const videosDir = path.join(rootDir, 'public', 'videos');
const imagesDir = path.join(rootDir, 'public', 'images');
fs.mkdirSync(videosDir, { recursive: true });
fs.mkdirSync(imagesDir, { recursive: true });

const mp4Output = path.join(videosDir, 'how-it-works.mp4');
const webmOutput = path.join(videosDir, 'how-it-works.webm');
const posterWebp = path.join(imagesDir, 'video-poster.webp');
const posterJpg = path.join(imagesDir, 'video-poster.jpg');

console.log(`🎬 Generating Explainer Video (${WIDTH}x${HEIGHT} @ ${FPS}fps, ${DURATION_SECONDS}s, ${TOTAL_FRAMES} frames)...`);

function renderFrameSvg(frameIndex) {
  const time = frameIndex / FPS;
  const progressPercent = Math.min(100, Math.max(0, (frameIndex / TOTAL_FRAMES) * 100));

  // Determine current scene
  // Scene 1: 0 - 5.0s (Intro)
  // Scene 2: 5.0 - 10.0s (Step 1: Enter DOB)
  // Scene 3: 10.0 - 15.0s (Step 2: Choose Date & Time)
  // Scene 4: 15.0 - 21.0s (Step 3: Instant Calculation & Live Seconds)
  // Scene 5: 21.0 - 25.0s (Summary & Features)

  let scene = 1;
  if (time >= 21.0) scene = 5;
  else if (time >= 15.0) scene = 4;
  else if (time >= 10.0) scene = 3;
  else if (time >= 5.0) scene = 2;

  // Header SVG Component
  const headerSvg = `
    <!-- Top Navigation Bar -->
    <rect x="0" y="0" width="1280" height="72" fill="#ffffff" fill-opacity="0.95" />
    <line x1="0" y1="72" x2="1280" y2="72" stroke="#e2e8f0" stroke-width="1.5" />
    
    <!-- Brand Logo -->
    <rect x="64" y="16" width="40" height="40" rx="10" fill="#2563eb" />
    <!-- Calendar icon inside logo -->
    <rect x="73" y="25" width="22" height="22" rx="4" fill="none" stroke="#ffffff" stroke-width="2" />
    <line x1="73" y1="31" x2="95" y2="31" stroke="#ffffff" stroke-width="2" />
    <line x1="79" y1="22" x2="79" y2="26" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
    <line x1="89" y1="22" x2="89" y2="26" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />

    <text x="116" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#0f172a">Age Calculator</text>
    <text x="116" y="53" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#64748b">agecalculators.dev</text>

    <!-- Top Badges -->
    <rect x="1000" y="20" width="216" height="32" rx="16" fill="#eff6ff" stroke="#dbeafe" stroke-width="1" />
    <circle cx="1018" cy="36" r="5" fill="#2563eb" />
    <text x="1032" y="41" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#1d4ed8">Official Video Guide</text>
    
    <!-- Timeline Progress Bar -->
    <rect x="0" y="70" width="1280" height="3" fill="#f1f5f9" />
    <rect x="0" y="70" width="${(1280 * progressPercent) / 100}" height="3" fill="#2563eb" />
  `;

  let sceneContent = '';

  if (scene === 1) {
    // INTRO SCENE (0 - 5s)
    const fade = Math.min(1, (time / 0.8));

    sceneContent = `
      <g opacity="${fade}">
        <!-- Hero Pill -->
        <rect x="470" y="115" width="340" height="34" rx="17" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5" />
        <text x="640" y="137" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#1d4ed8" text-anchor="middle">✨ Free Online Chronological Calculator</text>

        <!-- Main Title -->
        <text x="640" y="195" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="900" fill="#0f172a" text-anchor="middle">How the Age Calculator Works</text>
        <text x="640" y="235" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="500" fill="#475569" text-anchor="middle">Calculate your exact chronological age in seconds down to the millisecond</text>

        <!-- Main Illustrated Demo Card -->
        <rect x="180" y="270" width="920" height="360" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" filter="url(#shadow)" />
        
        <!-- 3 Feature Columns -->
        <g transform="translate(220, 310)">
          <!-- Col 1 -->
          <rect x="0" y="0" width="260" height="280" rx="18" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
          <rect x="20" y="24" width="48" height="48" rx="12" fill="#dbeafe" />
          <text x="44" y="55" font-size="24" text-anchor="middle">📅</text>
          <text x="20" y="105" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#0f172a">Exact Calendar Math</text>
          <text x="20" y="135" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#64748b">Calculates years, months, and</text>
          <text x="20" y="155" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#64748b">days taking leap years and</text>
          <text x="20" y="175" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#64748b">variable month lengths into account.</text>
          <rect x="20" y="220" width="130" height="28" rx="14" fill="#eff6ff" />
          <text x="85" y="239" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#2563eb" text-anchor="middle">100% Precision</text>
        </g>

        <g transform="translate(510, 310)">
          <!-- Col 2 -->
          <rect x="0" y="0" width="260" height="280" rx="18" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
          <rect x="20" y="24" width="48" height="48" rx="12" fill="#fef3c7" />
          <text x="44" y="55" font-size="24" text-anchor="middle">⏱️</text>
          <text x="20" y="105" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#0f172a">Live Running Ticker</text>
          <text x="20" y="135" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#64748b">Live animated odometer shows</text>
          <text x="20" y="155" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#64748b">your total lived seconds ticking</text>
          <text x="20" y="175" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#64748b">up in real time as you watch.</text>
          <rect x="20" y="220" width="130" height="28" rx="14" fill="#fef3c7" />
          <text x="85" y="239" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#b45309" text-anchor="middle">Real-Time Clock</text>
        </g>

        <g transform="translate(800, 310)">
          <!-- Col 3 -->
          <rect x="0" y="0" width="260" height="280" rx="18" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
          <rect x="20" y="24" width="48" height="48" rx="12" fill="#dcfce7" />
          <text x="44" y="55" font-size="24" text-anchor="middle">🔒</text>
          <text x="20" y="105" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#0f172a">Zero Server Tracking</text>
          <text x="20" y="135" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#64748b">100% computed inside your browser.</text>
          <text x="20" y="155" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#64748b">Your birth dates never leave</text>
          <text x="20" y="175" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#64748b">your device. Zero cookies needed.</text>
          <rect x="20" y="220" width="130" height="28" rx="14" fill="#dcfce7" />
          <text x="85" y="239" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#15803d" text-anchor="middle">Private &amp; Secure</text>
        </g>

        <!-- Floating Start Watch badge -->
        <g transform="translate(640, 655)">
          <rect x="-110" y="-18" width="220" height="36" rx="18" fill="#2563eb" />
          <polygon points="-40,-7 -40,7 -25,0" fill="#ffffff" />
          <text x="5" y="5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">Step-by-Step Demo</text>
        </g>
      </g>
    `;
  } else if (scene === 2) {
    // STEP 1: ENTER DATE OF BIRTH (5 - 10s)
    const stepTime = time - 5.0; // 0 to 5s
    const cursorX = Math.min(680, 850 - Math.min(stepTime, 2) * 100);
    const cursorY = Math.min(370, 520 - Math.min(stepTime, 2) * 80);
    const hasTyped = stepTime >= 1.5;

    sceneContent = `
      <g>
        <!-- Step Header -->
        <rect x="180" y="105" width="140" height="32" rx="16" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5" />
        <text x="250" y="126" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800" fill="#2563eb" text-anchor="middle">STEP 1 OF 3</text>
        
        <text x="180" y="175" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="900" fill="#0f172a">Enter Your Date of Birth</text>
        <text x="180" y="205" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="500" fill="#64748b">Select your day, month, and year of birth using the clean interactive picker</text>

        <!-- Calculator Mockup Card -->
        <rect x="180" y="235" width="920" height="420" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" filter="url(#shadow)" />

        <g transform="translate(230, 285)">
          <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#334155">DATE OF BIRTH (DD / MM / YYYY)</text>
          
          <!-- Input Field with active highlight -->
          <rect x="0" y="16" width="460" height="60" rx="14" fill="#ffffff" stroke="${hasTyped ? '#2563eb' : '#cbd5e1'}" stroke-width="${hasTyped ? '2.5' : '1.5'}" />
          <!-- Calendar Icon inside input -->
          <text x="24" y="53" font-size="22">📅</text>
          <text x="64" y="53" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700" fill="${hasTyped ? '#0f172a' : '#94a3b8'}">
            ${hasTyped ? '15 / 09 / 1995' : 'Select Birth Date...'}
          </text>
          
          ${hasTyped ? `
            <rect x="420" y="32" width="26" height="26" rx="13" fill="#dcfce7" />
            <text x="433" y="50" font-size="14" font-weight="bold" fill="#16a34a" text-anchor="middle">✓</text>
          ` : ''}

          <!-- Quick Date Helpers -->
          <text x="0" y="115" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#64748b">Popular Shortcuts:</text>
          <rect x="120" y="98" width="80" height="26" rx="8" fill="#f1f5f9" />
          <text x="160" y="116" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#475569" text-anchor="middle">1990</text>
          
          <rect x="210" y="98" width="80" height="26" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1" />
          <text x="250" y="116" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#2563eb" text-anchor="middle">1995</text>

          <rect x="300" y="98" width="80" height="26" rx="8" fill="#f1f5f9" />
          <text x="340" y="116" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#475569" text-anchor="middle">2000</text>

          <!-- Explanation Callout on right -->
          <g transform="translate(520, 10)">
            <rect x="0" y="0" width="350" height="260" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
            <text x="24" y="36" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0f172a">Calendar Intelligence</text>
            <text x="24" y="70" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#475569">💡 Exact leap year adjustments included</text>
            <text x="24" y="102" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#475569">💡 Automatically borrows days correctly</text>
            <text x="24" y="134" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#475569">💡 Gregorian calendar verified</text>
            <text x="24" y="166" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#475569">💡 Compatible with all world date formats</text>

            <rect x="24" y="200" width="302" height="38" rx="10" fill="#dbeafe" />
            <text x="175" y="224" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#1e40af" text-anchor="middle">Target Birthday: September 15, 1995</text>
          </g>
        </g>

        <!-- Animated Mouse Cursor -->
        <g transform="translate(${cursorX}, ${cursorY})">
          <path d="M0,0 L0,24 L6,18 L14,24 L17,20 L9,14 L18,14 Z" fill="#0f172a" stroke="#ffffff" stroke-width="1.5" />
          ${stepTime > 1.2 && stepTime < 1.8 ? `
            <circle cx="0" cy="0" r="16" fill="none" stroke="#2563eb" stroke-width="2" opacity="0.6" />
          ` : ''}
        </g>
      </g>
    `;
  } else if (scene === 3) {
    // STEP 2: CHOOSE TARGET DATE & TIME (10 - 15s)
    const stepTime = time - 10.0;
    const timeToggled = stepTime >= 1.5;

    sceneContent = `
      <g>
        <!-- Step Header -->
        <rect x="180" y="105" width="140" height="32" rx="16" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5" />
        <text x="250" y="126" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800" fill="#2563eb" text-anchor="middle">STEP 2 OF 3</text>
        
        <text x="180" y="175" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="900" fill="#0f172a">Customize Date &amp; Time (Optional)</text>
        <text x="180" y="205" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="500" fill="#64748b">Calculate age for Today, or pick any past/future milestone date and exact birth time</text>

        <!-- Calculator Mockup Card -->
        <rect x="180" y="235" width="920" height="420" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" filter="url(#shadow)" />

        <g transform="translate(230, 275)">
          <!-- Option A: Target Date -->
          <text x="0" y="10" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#334155">CALCULATE AGE ON THIS DATE</text>
          <rect x="0" y="24" width="400" height="52" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
          <text x="20" y="56" font-size="18">🎯</text>
          <text x="56" y="56" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700" fill="#0f172a">Today (18 Sep 2026)</text>
          <rect x="310" y="34" width="70" height="30" rx="8" fill="#2563eb" />
          <text x="345" y="54" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">Default</text>

          <!-- Option B: Include Birth Time Switch -->
          <g transform="translate(0, 110)">
            <text x="0" y="10" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#334155">INCLUDE EXACT BIRTH TIME (FOR SECONDS PRECISION)</text>
            
            <rect x="0" y="24" width="400" height="64" rx="14" fill="${timeToggled ? '#eff6ff' : '#f8fafc'}" stroke="${timeToggled ? '#3b82f6' : '#cbd5e1'}" stroke-width="${timeToggled ? '2' : '1.5'}" />
            
            <!-- Toggle Switch -->
            <rect x="20" y="40" width="50" height="28" rx="14" fill="${timeToggled ? '#2563eb' : '#cbd5e1'}" />
            <circle cx="${timeToggled ? 55 : 34}" cy="54" r="10" fill="#ffffff" filter="url(#shadow-sm)" />

            <text x="85" y="59" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="${timeToggled ? '#1d4ed8' : '#64748b'}">
              ${timeToggled ? 'Birth Time: 08:30 AM' : 'Enable Birth Time'}
            </text>
          </g>

          <!-- Feature Cards on Right -->
          <g transform="translate(470, 10)">
            <rect x="0" y="0" width="390" height="290" rx="18" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
            <text x="24" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0f172a">Why Down-to-the-Second Precision?</text>
            
            <g transform="translate(24, 60)">
              <circle cx="16" cy="16" r="16" fill="#dbeafe" />
              <text x="16" y="22" font-size="16" text-anchor="middle">⏰</text>
              <text x="44" y="14" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#1e293b">Exact Hour &amp; Minute</text>
              <text x="44" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#64748b">Calculates live seconds from the moment you were born.</text>
            </g>

            <g transform="translate(24, 125)">
              <circle cx="16" cy="16" r="16" fill="#fef3c7" />
              <text x="16" y="22" font-size="16" text-anchor="middle">🎓</text>
              <text x="44" y="14" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#1e293b">Official Records &amp; Clinical Use</text>
              <text x="44" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#64748b">Perfect for passports, retirement dates, and school admission.</text>
            </g>

            <g transform="translate(24, 190)">
              <circle cx="16" cy="16" r="16" fill="#dcfce7" />
              <text x="16" y="22" font-size="16" text-anchor="middle">🎂</text>
              <text x="44" y="14" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#1e293b">Milestone Reminders</text>
              <text x="44" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#64748b">Displays exact days and weekdays until your 32nd birthday.</text>
            </g>
          </g>
        </g>
      </g>
    `;
  } else if (scene === 4) {
    // STEP 3: INSTANT CALCULATION & RESULTS (15 - 21s)
    const stepTime = time - 15.0; // 0 to 6s
    // Live ticking seconds calculation
    const baseSeconds = 978566400;
    const runningSeconds = baseSeconds + Math.floor(stepTime * 30);

    sceneContent = `
      <g>
        <!-- Step Header -->
        <rect x="180" y="95" width="140" height="32" rx="16" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5" />
        <text x="250" y="116" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800" fill="#2563eb" text-anchor="middle">STEP 3 OF 3</text>
        
        <text x="180" y="160" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="900" fill="#0f172a">Instant Calculation &amp; Live Results</text>
        <text x="180" y="190" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="500" fill="#64748b">One click unlocks your full chronological age breakdown and live real-time ticking clock</text>

        <!-- Big Results Card -->
        <rect x="180" y="215" width="920" height="460" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" filter="url(#shadow)" />

        <!-- Top Primary Result Banner -->
        <g transform="translate(220, 245)">
          <rect x="0" y="0" width="840" height="115" rx="18" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2" />
          <text x="30" y="36" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#2563eb" letter-spacing="1">YOUR EXACT AGE TODAY</text>
          
          <text x="30" y="85" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="40" font-weight="900" fill="#0f172a">
            31 <tspan font-size="22" font-weight="700" fill="#64748b">Years</tspan>  0 <tspan font-size="22" font-weight="700" fill="#64748b">Months</tspan>  3 <tspan font-size="22" font-weight="700" fill="#64748b">Days</tspan>
          </text>

          <rect x="660" y="32" width="150" height="50" rx="12" fill="#2563eb" />
          <text x="735" y="63" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#ffffff" text-anchor="middle">Verified Exact ✓</text>
        </g>

        <!-- 4 Grid Stat Cards -->
        <g transform="translate(220, 380)">
          <!-- Card 1: Total Days -->
          <rect x="0" y="0" width="195" height="110" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
          <text x="20" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#64748b">TOTAL DAYS LIVED</text>
          <text x="20" y="70" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="26" font-weight="900" fill="#0f172a">11,326</text>
          <text x="20" y="92" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#059669">372 Calendar Months</text>

          <!-- Card 2: Total Hours -->
          <rect x="215" y="0" width="195" height="110" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
          <text x="235" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#64748b">TOTAL HOURS</text>
          <text x="235" y="70" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="26" font-weight="900" fill="#0f172a">271,824</text>
          <text x="235" y="92" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#2563eb">1,618 Weeks</text>

          <!-- Card 3: Next Birthday -->
          <rect x="430" y="0" width="195" height="110" rx="16" fill="#fefce8" stroke="#fef08a" stroke-width="1.5" />
          <text x="450" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#a16207">NEXT BIRTHDAY</text>
          <text x="450" y="70" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="900" fill="#854d0e">In 362 Days</text>
          <text x="450" y="92" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#ca8a04">Wednesday, Sep 15</text>

          <!-- Card 4: Born on Day -->
          <rect x="645" y="0" width="195" height="110" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5" />
          <text x="665" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#64748b">DAY OF BIRTH</text>
          <text x="665" y="70" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="900" fill="#0f172a">Friday</text>
          <text x="665" y="92" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#64748b">Zodiac: Virgo ♍</text>
        </g>

        <!-- Live Seconds Ticker Banner -->
        <g transform="translate(220, 510)">
          <rect x="0" y="0" width="840" height="60" rx="14" fill="#0f172a" />
          <circle cx="30" cy="30" r="6" fill="#22c55e" />
          <text x="48" y="36" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#94a3b8">LIVE RUNNING SECONDS TICKER:</text>
          <text x="320" y="37" font-family="Courier, monospace" font-size="24" font-weight="900" fill="#38bdf8">${runningSeconds.toLocaleString()}</text>
          <text x="680" y="35" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#4ade80">● Real-Time</text>
        </g>
      </g>
    `;
  } else {
    // SCENE 5: SUMMARY & CTA (21 - 25s)
    const fade = Math.min(1, (time - 21.0) / 0.8);

    sceneContent = `
      <g opacity="${fade}">
        <!-- End Screen Header -->
        <rect x="490" y="105" width="300" height="34" rx="17" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5" />
        <text x="640" y="127" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#2563eb" text-anchor="middle">⭐ FAST • 100% PRIVATE • FREE FOREVER</text>
        
        <text x="640" y="180" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="40" font-weight="900" fill="#0f172a" text-anchor="middle">Ready to Calculate Your Exact Age?</text>
        <text x="640" y="215" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="500" fill="#475569" text-anchor="middle">Join thousands calculating chronological age, birthdays, and date intervals daily</text>

        <!-- Big Feature Highlights Grid -->
        <g transform="translate(180, 255)">
          <rect x="0" y="0" width="920" height="260" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="2" filter="url(#shadow)" />

          <g transform="translate(40, 40)">
            <rect x="0" y="0" width="390" height="75" rx="14" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
            <circle cx="38" cy="38" r="20" fill="#dbeafe" />
            <text x="38" y="45" font-size="20" text-anchor="middle">⚡</text>
            <text x="75" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0f172a">Live Running Seconds Ticker</text>
            <text x="75" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#64748b">Instant down-to-the-second accuracy on all devices</text>
          </g>

          <g transform="translate(490, 40)">
            <rect x="0" y="0" width="390" height="75" rx="14" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
            <circle cx="38" cy="38" r="20" fill="#dcfce7" />
            <text x="38" y="45" font-size="20" text-anchor="middle">🛡️</text>
            <text x="75" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0f172a">100% Client-Side Privacy</text>
            <text x="75" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#64748b">Zero tracking, zero database, zero registration</text>
          </g>

          <g transform="translate(40, 140)">
            <rect x="0" y="0" width="390" height="75" rx="14" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
            <circle cx="38" cy="38" r="20" fill="#fef3c7" />
            <text x="38" y="45" font-size="20" text-anchor="middle">🌍</text>
            <text x="75" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0f172a">39 Languages Supported</text>
            <text x="75" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#64748b">Fully translated into Spanish, French, German, and more</text>
          </g>

          <g transform="translate(490, 140)">
            <rect x="0" y="0" width="390" height="75" rx="14" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
            <circle cx="38" cy="38" r="20" fill="#f3e8ff" />
            <text x="38" y="45" font-size="20" text-anchor="middle">📱</text>
            <text x="75" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0f172a">Mobile &amp; PWA Ready</text>
            <text x="75" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="500" fill="#64748b">Instant bookmarking and offline app capability</text>
          </g>
        </g>

        <!-- Big CTA Button -->
        <g transform="translate(640, 580)">
          <rect x="-220" y="-30" width="440" height="60" rx="18" fill="#2563eb" filter="url(#shadow)" />
          <text x="0" y="8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#ffffff" text-anchor="middle">
            Calculate Your Age at agecalculators.dev →
          </text>
        </g>
      </g>
    `;
  }

  return `
    <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mainBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc" />
          <stop offset="50%" stop-color="#f1f5f9" />
          <stop offset="100%" stop-color="#eff6ff" />
        </linearGradient>
        
        <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="10" stdDeviation="15" flood-color="#0f172a" flood-opacity="0.06" />
        </filter>

        <filter id="shadow-sm" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.1" />
        </filter>

        <!-- Subtle Dot Grid Pattern -->
        <pattern id="dotGrid" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#cbd5e1" fill-opacity="0.4" />
        </pattern>
      </defs>

      <!-- Background with subtle tech dots -->
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#mainBg)" />
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#dotGrid)" />

      <!-- Ambient Glow Orbs -->
      <circle cx="150" cy="150" r="180" fill="#bfdbfe" fill-opacity="0.25" filter="blur(60px)" />
      <circle cx="1150" cy="550" r="220" fill="#dbeafe" fill-opacity="0.25" filter="blur(70px)" />

      ${headerSvg}
      ${sceneContent}
    </svg>
  `;
}

async function generatePoster() {
  console.log('🖼️  Generating high-res video poster thumbnail (frame 550)...');
  const posterSvg = renderFrameSvg(550);
  
  // High-res WebP
  await sharp(Buffer.from(posterSvg))
    .webp({ quality: 90 })
    .toFile(posterWebp);

  // High-res JPEG
  await sharp(Buffer.from(posterSvg))
    .jpeg({ quality: 90 })
    .toFile(posterJpg);

  console.log('✓ Poster generated: video-poster.webp & video-poster.jpg');
}

async function renderVideo(outputPath, isWebm = false) {
  return new Promise((resolve, reject) => {
    console.log(`🎥 Encoding ${isWebm ? 'WebM (VP9)' : 'MP4 (H.264)'} to ${path.basename(outputPath)}...`);

    const ffmpegArgs = isWebm
      ? [
          '-y',
          '-f', 'image2pipe',
          '-vcodec', 'png',
          '-r', String(FPS),
          '-i', '-',
          '-c:v', 'libvpx-vp9',
          '-b:v', '1500k',
          '-crf', '30',
          '-pix_fmt', 'yuv420p',
          outputPath
        ]
      : [
          '-y',
          '-f', 'image2pipe',
          '-vcodec', 'png',
          '-r', String(FPS),
          '-i', '-',
          '-c:v', 'libx264',
          '-profile:v', 'high',
          '-level:v', '4.0',
          '-preset', 'fast',
          '-crf', '22',
          '-pix_fmt', 'yuv420p',
          '-movflags', '+faststart',
          outputPath
        ];

    const proc = spawn(ffmpegPath, ffmpegArgs, { stdio: ['pipe', 'inherit', 'inherit'] });

    proc.on('error', reject);
    proc.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });

    // Feed frames sequentially into stdin
    (async () => {
      try {
        for (let i = 0; i < TOTAL_FRAMES; i++) {
          const svg = renderFrameSvg(i);
          const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
          
          const canWrite = proc.stdin.write(pngBuffer);
          if (!canWrite) {
            await new Promise(r => proc.stdin.once('drain', r));
          }

          if (i % 75 === 0 || i === TOTAL_FRAMES - 1) {
            process.stdout.write(`\r[${isWebm ? 'WebM' : 'MP4'}] Frame ${i + 1}/${TOTAL_FRAMES} (${Math.round(((i + 1) / TOTAL_FRAMES) * 100)}%)`);
          }
        }
        process.stdout.write('\n');
        proc.stdin.end();
      } catch (err) {
        proc.stdin.destroy(err);
        reject(err);
      }
    })();
  });
}

async function main() {
  const startTime = Date.now();
  
  await generatePoster();
  await renderVideo(mp4Output, false);
  await renderVideo(webmOutput, true);

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n🎉 Explainer Video & Poster generation complete in ${duration}s!`);
  console.log(`- MP4:  ${mp4Output} (${(fs.statSync(mp4Output).size / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`- WebM: ${webmOutput} (${(fs.statSync(webmOutput).size / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch(err => {
  console.error('Fatal error generating video:', err);
  process.exit(1);
});
