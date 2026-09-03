'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Share2,
  Download,
  Copy,
  Check,
  Sparkles,
  Calendar,
  Cake,
  Heart,
  Palette,
  Eye,
  CheckCircle2,
  Clock,
  Zap,
  Smartphone,
  Square,
  Maximize2
} from 'lucide-react';
import { CalendarDate, calculateLifeStats } from '@/lib/date-utils';
import { SITE_CONFIG } from '@/lib/constants';
import { trackEvent } from '@/lib/analytics';

interface ShareAgeCardProps {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalSeconds: number;
  birthDate: CalendarDate;
  birthDateFormatted: string;
  dayOfWeekBorn: string;
  daysUntilNextBirthday: number;
  ageTurningNext: number;
  zodiacSign: string;
}

type ThemeKey = 'sapphire' | 'sunset' | 'emerald' | 'cosmic';
type AspectRatio = 'square' | 'story' | 'wide';

interface ThemeConfig {
  id: ThemeKey;
  name: string;
  gradientBg: string;
  canvasBgStart: string;
  canvasBgEnd: string;
  accentColor: string;
  cardBg: string;
  badgeBg: string;
  textColor: string;
  highlightText: string;
  pillColor: string;
}

const THEMES: Record<ThemeKey, ThemeConfig> = {
  sapphire: {
    id: 'sapphire',
    name: 'Royal Sapphire',
    gradientBg: 'from-slate-950 via-blue-950 to-indigo-950',
    canvasBgStart: '#090d16',
    canvasBgEnd: '#1e1b4b',
    accentColor: '#38bdf8',
    cardBg: 'rgba(30, 58, 138, 0.45)',
    badgeBg: 'rgba(56, 189, 248, 0.2)',
    textColor: '#ffffff',
    highlightText: '#60a5fa',
    pillColor: '#2563eb'
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Glow',
    gradientBg: 'from-slate-950 via-rose-950 to-amber-950',
    canvasBgStart: '#140509',
    canvasBgEnd: '#4c0519',
    accentColor: '#fb7185',
    cardBg: 'rgba(159, 18, 57, 0.45)',
    badgeBg: 'rgba(251, 113, 133, 0.2)',
    textColor: '#ffffff',
    highlightText: '#fb923c',
    pillColor: '#e11d48'
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Mint',
    gradientBg: 'from-slate-950 via-teal-950 to-emerald-950',
    canvasBgStart: '#021e17',
    canvasBgEnd: '#064e3b',
    accentColor: '#34d399',
    cardBg: 'rgba(6, 78, 59, 0.45)',
    badgeBg: 'rgba(52, 211, 153, 0.2)',
    textColor: '#ffffff',
    highlightText: '#6ee7b7',
    pillColor: '#059669'
  },
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Violet',
    gradientBg: 'from-slate-950 via-purple-950 to-fuchsia-950',
    canvasBgStart: '#130424',
    canvasBgEnd: '#3b0764',
    accentColor: '#c084fc',
    cardBg: 'rgba(88, 28, 135, 0.45)',
    badgeBg: 'rgba(192, 132, 252, 0.2)',
    textColor: '#ffffff',
    highlightText: '#e879f9',
    pillColor: '#9333ea'
  }
};

/* Vector Icon Canvas Drawing Utilities (100% visible, cross-platform sharp) */
function drawHeartIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  const d = size * 0.45;
  ctx.moveTo(cx, cy - d * 0.2);
  ctx.bezierCurveTo(cx, cy - d * 0.9, cx - d * 1.1, cy - d * 0.9, cx - d * 1.1, cy - d * 0.1);
  ctx.bezierCurveTo(cx - d * 1.1, cy + d * 0.5, cx, cy + d * 1.1, cx, cy + d * 1.25);
  ctx.bezierCurveTo(cx, cy + d * 1.1, cx + d * 1.1, cy + d * 0.5, cx + d * 1.1, cy - d * 0.1);
  ctx.bezierCurveTo(cx + d * 1.1, cy - d * 0.9, cx, cy - d * 0.9, cx, cy - d * 0.2);
  ctx.fill();
  ctx.restore();
}

function drawCakeIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  const w = size * 0.8;
  const h = size * 0.45;
  const x = cx - w / 2;
  const y = cy;

  // Cake base
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 6);
  ctx.fill();

  // Icing topping
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(x - 2, y - 2, w + 4, h * 0.35, 4);
  ctx.fill();

  // Candles
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(cx - w * 0.3, y - h * 0.65, 3.5, h * 0.65);
  ctx.fillRect(cx - 1.75, y - h * 0.85, 3.5, h * 0.85);
  ctx.fillRect(cx + w * 0.3 - 3.5, y - h * 0.65, 3.5, h * 0.65);

  // Flames
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(cx - w * 0.3 + 1.75, y - h * 0.85, 3.5, 0, Math.PI * 2);
  ctx.arc(cx, y - h * 1.05, 4, 0, Math.PI * 2);
  ctx.arc(cx + w * 0.3 - 1.75, y - h * 0.85, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCalendarIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  const w = size * 0.8;
  const h = size * 0.8;
  const x = cx - w / 2;
  const y = cy - h / 2;

  // Body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 6);
  ctx.fill();

  // Red header bar
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h * 0.3, [6, 6, 0, 0]);
  ctx.fill();

  // Spiral binder hooks
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(cx - w * 0.3, y - 3, 3, 7);
  ctx.fillRect(cx + w * 0.3 - 3, y - 3, 3, 7);

  // Date block
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(cx - w * 0.25, y + h * 0.45, w * 0.5, h * 0.4, 3);
  ctx.fill();
  ctx.restore();
}

function drawSunIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;

  // Center circle
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.28, 0, Math.PI * 2);
  ctx.fill();

  // Sun rays
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const x1 = cx + Math.cos(angle) * (size * 0.38);
    const y1 = cy + Math.sin(angle) * (size * 0.38);
    const x2 = cx + Math.cos(angle) * (size * 0.55);
    const y2 = cy + Math.sin(angle) * (size * 0.55);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawZapIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  const s = size * 0.6;
  ctx.moveTo(cx + s * 0.1, cy - s);
  ctx.lineTo(cx - s * 0.7, cy + s * 0.1);
  ctx.lineTo(cx - s * 0.1, cy + s * 0.1);
  ctx.lineTo(cx - s * 0.3, cy + s);
  ctx.lineTo(cx + s * 0.7, cy - s * 0.1);
  ctx.lineTo(cx + s * 0.1, cy - s * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export default function ShareAgeCard({
  years,
  months,
  days,
  totalDays,
  totalSeconds,
  birthDate,
  birthDateFormatted,
  dayOfWeekBorn,
  daysUntilNextBirthday,
  ageTurningNext,
  zodiacSign
}: ShareAgeCardProps) {
  const [userName, setUserName] = useState<string>('');
  const [activeTheme, setActiveTheme] = useState<ThemeKey>('sapphire');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('square');
  const [liveSeconds, setLiveSeconds] = useState<number>(totalSeconds);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live real-time seconds ticking on card
  useEffect(() => {
    let animId: number;
    const birthTimestamp = new Date(birthDate.year, birthDate.month - 1, birthDate.day, 0, 0, 0, 0).getTime();

    const tick = () => {
      const now = Date.now();
      const delta = Math.floor(Math.max(0, now - birthTimestamp) / 1000);
      setLiveSeconds(delta);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [birthDate]);

  const lifeStats = calculateLifeStats(liveSeconds || (years * 365.25 + months * 30.43 + days) * 86400, daysUntilNextBirthday);
  const theme = THEMES[activeTheme];

  const displayName = userName.trim() ? `${userName.trim()}'s Exact Age` : 'My Exact Age';
  const shareText = `🎉 ${displayName}: I am ${years} Years, ${months} Months, and ${days} Days old today (${totalDays.toLocaleString()} days & ${liveSeconds.toLocaleString()} seconds lived)! Calculate yours live on ${SITE_CONFIG.name}:`;
  const shareUrl = `${SITE_CONFIG.domain}/`;

  // Draw high-resolution canvas with dedicated layout tailored to the chosen aspect ratio
  const drawCardToCanvas = useCallback((): HTMLCanvasElement | null => {
    const canvas = document.createElement('canvas');

    let width = 1200;
    let height = 1200;
    if (aspectRatio === 'story') {
      width = 1080;
      height = 1920;
    } else if (aspectRatio === 'wide') {
      width = 1200;
      height = 675;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, theme.canvasBgStart);
    bgGrad.addColorStop(0.5, theme.canvasBgStart);
    bgGrad.addColorStop(1, theme.canvasBgEnd);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Ambient Glowing Orbs
    const orb1 = ctx.createRadialGradient(200, 200, 10, 200, 200, 450);
    orb1.addColorStop(0, `${theme.accentColor}33`);
    orb1.addColorStop(1, 'transparent');
    ctx.fillStyle = orb1;
    ctx.fillRect(0, 0, width, height);

    const orb2 = ctx.createRadialGradient(width - 200, height - 200, 10, width - 200, height - 200, 500);
    orb2.addColorStop(0, `${theme.accentColor}22`);
    orb2.addColorStop(1, 'transparent');
    ctx.fillStyle = orb2;
    ctx.fillRect(0, 0, width, height);

    // 3. Inner Card Border
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(36, 36, width - 72, height - 72, 32);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.fill();
    ctx.restore();

    // Stats data array
    const stats = [
      {
        type: 'cake',
        badgeColor: '#ec4899',
        title: 'NEXT BIRTHDAY',
        val: `${daysUntilNextBirthday} Days Left`,
        sub: `Turning ${ageTurningNext} years old`
      },
      {
        type: 'calendar',
        badgeColor: '#3b82f6',
        title: 'TOTAL DAYS ON EARTH',
        val: `${totalDays.toLocaleString()} Days`,
        sub: `Exact elapsed calendar days`
      },
      {
        type: 'heart',
        badgeColor: '#f43f5e',
        title: 'ESTIMATED HEARTBEATS',
        val: `~${(lifeStats.estimatedHeartbeats / 1_000_000).toFixed(1)}M`,
        sub: `Beating approx 80 times/min`
      },
      {
        type: 'sun',
        badgeColor: '#f59e0b',
        title: 'SOLAR YEAR PROGRESS',
        val: `${lifeStats.sunOrbitProgressPercent}%`,
        sub: `Completed towards Age ${ageTurningNext}`
      }
    ];

    // ==========================================
    // LAYOUT 1: WIDE (16:9 — 1200 x 675)
    // ==========================================
    if (aspectRatio === 'wide') {
      const leftW = 540;
      const leftX = 70;

      // Header Brand
      ctx.save();
      ctx.fillStyle = theme.pillColor;
      ctx.beginPath();
      ctx.roundRect(leftX, 60, 260, 44, 22);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📅 agecalculators.dev', leftX + 130, 82);
      ctx.restore();

      // Title & DOB
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 40px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(displayName, leftX, 150);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '18px system-ui, -apple-system, sans-serif';
      ctx.fillText(`Born on ${dayOfWeekBorn}, ${birthDateFormatted} • ${zodiacSign}`, leftX, 185);
      ctx.restore();

      // 3 Age Blocks (Years, Months, Days)
      const bWidth = (leftW - 30) / 3;
      const bHeight = 150;
      const bY = 215;
      const ageUnits = [
        { num: String(years), label: 'YEARS' },
        { num: String(months), label: 'MONTHS' },
        { num: String(days), label: 'DAYS' }
      ];

      ageUnits.forEach((unit, idx) => {
        const bx = leftX + idx * (bWidth + 15);
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(bx, bY, bWidth, bHeight, 18);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 68px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(unit.num, bx + bWidth / 2, bY + bHeight * 0.42);

        ctx.fillStyle = theme.accentColor;
        ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
        ctx.fillText(unit.label, bx + bWidth / 2, bY + bHeight * 0.82);
        ctx.restore();
      });

      // Left Column: Live Seconds Ticker Banner
      const secY = 385;
      const secH = 90;
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = `${theme.accentColor}66`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(leftX, secY, leftW, secH, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(leftX + 40, secY + secH / 2, 20, 0, Math.PI * 2);
      ctx.fill();
      drawZapIcon(ctx, leftX + 40, secY + secH / 2, 24, '#0f172a');

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('⚡ LIVE TOTAL SECONDS LIVED', leftX + 75, secY + 18);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 28px monospace, system-ui, sans-serif';
      ctx.fillText(`${liveSeconds.toLocaleString()} seconds`, leftX + 75, secY + 42);
      ctx.restore();

      // Right Column: 2x2 Metric Cards (Right side: x = 650)
      const rightX = 640;
      const cardW = (width - rightX - 70 - 20) / 2;
      const cardH = 190;
      const posWide = [
        { x: rightX, y: 80 },
        { x: rightX + cardW + 20, y: 80 },
        { x: rightX, y: 290 },
        { x: rightX + cardW + 20, y: 290 }
      ];

      stats.forEach((s, idx) => {
        const p = posWide[idx];
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, cardW, cardH, 18);
        ctx.fill();
        ctx.stroke();

        const badgeX = p.x + 32;
        const badgeY = p.y + 32;
        ctx.fillStyle = s.badgeColor;
        ctx.beginPath();
        ctx.arc(badgeX, badgeY, 18, 0, Math.PI * 2);
        ctx.fill();

        if (s.type === 'cake') drawCakeIcon(ctx, badgeX, badgeY - 2, 22, '#ffffff');
        else if (s.type === 'calendar') drawCalendarIcon(ctx, badgeX, badgeY, 22, '#ffffff');
        else if (s.type === 'heart') drawHeartIcon(ctx, badgeX, badgeY, 22, '#ffffff');
        else if (s.type === 'sun') drawSunIcon(ctx, badgeX, badgeY, 24, '#ffffff');

        ctx.fillStyle = theme.accentColor;
        ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(s.title, p.x + 60, badgeY);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillText(s.val, p.x + 18, p.y + 70);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '16px system-ui, -apple-system, sans-serif';
        ctx.fillText(s.sub, p.x + 18, p.y + 115);
        ctx.restore();
      });

      // Footer
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚡ Calculate your exact age down to the second at agecalculators.dev', width / 2, 600);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '14px system-ui, -apple-system, sans-serif';
      ctx.fillText('100% Free • Exact Calendar Precision • Live Seconds Odometer', width / 2, 628);
      ctx.restore();
    }
    // ==========================================
    // LAYOUT 2: STORY (9:16 — 1080 x 1920)
    // ==========================================
    else if (aspectRatio === 'story') {
      // Header Brand
      ctx.save();
      ctx.fillStyle = theme.pillColor;
      ctx.beginPath();
      ctx.roundRect(80, 120, 320, 60, 30);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📅 agecalculators.dev', 240, 150);
      ctx.restore();

      // Title & DOB
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 62px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(displayName, 80, 260);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '26px system-ui, -apple-system, sans-serif';
      ctx.fillText(`Born on ${dayOfWeekBorn}, ${birthDateFormatted}`, 80, 315);
      ctx.fillText(`Western Zodiac: ${zodiacSign}`, 80, 355);
      ctx.restore();

      // Big 3 Age Blocks
      const blockWidth = (width - 160 - 30) / 3;
      const blockHeight = 240;
      const startY = 420;
      const ageUnits = [
        { num: String(years), label: 'YEARS' },
        { num: String(months), label: 'MONTHS' },
        { num: String(days), label: 'DAYS' }
      ];

      ageUnits.forEach((unit, idx) => {
        const x = 80 + idx * (blockWidth + 15);
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, startY, blockWidth, blockHeight, 24);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 100px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(unit.num, x + blockWidth / 2, startY + blockHeight * 0.42);

        ctx.fillStyle = theme.accentColor;
        ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
        ctx.fillText(unit.label, x + blockWidth / 2, startY + blockHeight * 0.82);
        ctx.restore();
      });

      // Live Real-Time Seconds Hero Banner
      const bannerY = startY + blockHeight + 35;
      const bannerW = width - 160;
      const bannerH = 140;

      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = `${theme.accentColor}88`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(80, bannerY, bannerW, bannerH, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(145, bannerY + bannerH / 2, 32, 0, Math.PI * 2);
      ctx.fill();
      drawZapIcon(ctx, 145, bannerY + bannerH / 2, 38, '#0f172a');

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('⚡ LIVE REAL-TIME SECONDS LIVED', 195, bannerY + 30);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 42px monospace, system-ui, sans-serif';
      ctx.fillText(`${liveSeconds.toLocaleString()} s`, 195, bannerY + 65);
      ctx.restore();

      // 4 Stacked Metric Cards spanning the vertical canvas
      const stackY = bannerY + bannerH + 40;
      const cardW = width - 160;
      const cardH = 175;

      stats.forEach((s, idx) => {
        const cy = stackY + idx * (cardH + 20);
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(80, cy, cardW, cardH, 22);
        ctx.fill();
        ctx.stroke();

        const badgeX = 80 + 45;
        const badgeY = cy + cardH / 2;
        ctx.fillStyle = s.badgeColor;
        ctx.beginPath();
        ctx.arc(badgeX, badgeY, 28, 0, Math.PI * 2);
        ctx.fill();

        if (s.type === 'cake') drawCakeIcon(ctx, badgeX, badgeY - 3, 34, '#ffffff');
        else if (s.type === 'calendar') drawCalendarIcon(ctx, badgeX, badgeY, 34, '#ffffff');
        else if (s.type === 'heart') drawHeartIcon(ctx, badgeX, badgeY, 34, '#ffffff');
        else if (s.type === 'sun') drawSunIcon(ctx, badgeX, badgeY, 36, '#ffffff');

        ctx.fillStyle = theme.accentColor;
        ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(s.title, 80 + 95, cy + 30);

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 38px system-ui, -apple-system, sans-serif';
        ctx.fillText(s.val, 80 + 95, cy + 62);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '22px system-ui, -apple-system, sans-serif';
        ctx.fillText(s.sub, 80 + 95, cy + 115);
        ctx.restore();
      });

      // Footer
      ctx.save();
      const footerY = height - 120;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚡ Calculate your exact age down to the second', width / 2, footerY);

      ctx.fillStyle = theme.accentColor;
      ctx.font = '900 28px system-ui, -apple-system, sans-serif';
      ctx.fillText('agecalculators.dev', width / 2, footerY + 38);
      ctx.restore();
    }
    // ==========================================
    // LAYOUT 3: SQUARE (1:1 — 1200 x 1200)
    // ==========================================
    else {
      // Header Brand
      ctx.save();
      ctx.fillStyle = theme.pillColor;
      ctx.beginPath();
      ctx.roundRect(80, 80, 300, 54, 27);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📅 agecalculators.dev', 230, 107);
      ctx.restore();

      // Title & DOB
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 52px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(displayName, 80, 195);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '22px system-ui, -apple-system, sans-serif';
      ctx.fillText(`Born on ${dayOfWeekBorn}, ${birthDateFormatted} • Zodiac: ${zodiacSign}`, 80, 240);
      ctx.restore();

      // 3 Age Blocks
      const blockWidth = (width - 160 - 40) / 3;
      const blockHeight = 210;
      const startY = 280;
      const ageUnits = [
        { num: String(years), label: 'YEARS' },
        { num: String(months), label: 'MONTHS' },
        { num: String(days), label: 'DAYS' }
      ];

      ageUnits.forEach((unit, idx) => {
        const x = 80 + idx * (blockWidth + 20);
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, startY, blockWidth, blockHeight, 24);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 96px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(unit.num, x + blockWidth / 2, startY + blockHeight * 0.45);

        ctx.fillStyle = theme.accentColor;
        ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
        ctx.fillText(unit.label, x + blockWidth / 2, startY + blockHeight * 0.82);
        ctx.restore();
      });

      // Live Seconds Banner
      const bannerY = startY + blockHeight + 25;
      const bannerW = width - 160;
      const bannerH = 100;

      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = `${theme.accentColor}66`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(80, bannerY, bannerW, bannerH, 20);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(130, bannerY + bannerH / 2, 24, 0, Math.PI * 2);
      ctx.fill();
      drawZapIcon(ctx, 130, bannerY + bannerH / 2, 28, '#0f172a');

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('⚡ LIVE REAL-TIME SECONDS LIVED', 170, bannerY + 22);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 34px monospace, system-ui, sans-serif';
      ctx.fillText(`${liveSeconds.toLocaleString()} seconds`, 170, bannerY + 48);
      ctx.restore();

      // 2x2 Metric Cards
      const gridY = bannerY + bannerH + 25;
      const cardW = (width - 160 - 25) / 2;
      const cardH = 160;
      const posSquare = [
        { x: 80, y: gridY },
        { x: 80 + cardW + 25, y: gridY },
        { x: 80, y: gridY + cardH + 20 },
        { x: 80 + cardW + 25, y: gridY + cardH + 20 }
      ];

      stats.forEach((s, idx) => {
        const p = posSquare[idx];
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, cardW, cardH, 20);
        ctx.fill();
        ctx.stroke();

        const badgeX = p.x + 36;
        const badgeY = p.y + 36;
        ctx.fillStyle = s.badgeColor;
        ctx.beginPath();
        ctx.arc(badgeX, badgeY, 22, 0, Math.PI * 2);
        ctx.fill();

        if (s.type === 'cake') drawCakeIcon(ctx, badgeX, badgeY - 2, 26, '#ffffff');
        else if (s.type === 'calendar') drawCalendarIcon(ctx, badgeX, badgeY, 26, '#ffffff');
        else if (s.type === 'heart') drawHeartIcon(ctx, badgeX, badgeY, 26, '#ffffff');
        else if (s.type === 'sun') drawSunIcon(ctx, badgeX, badgeY, 28, '#ffffff');

        ctx.fillStyle = theme.accentColor;
        ctx.font = 'bold 17px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(s.title, p.x + 72, badgeY);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 34px system-ui, -apple-system, sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillText(s.val, p.x + 22, p.y + 70);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.font = '19px system-ui, -apple-system, sans-serif';
        ctx.fillText(s.sub, p.x + 22, p.y + 115);
        ctx.restore();
      });

      // Footer
      ctx.save();
      const footerY = height - 90;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚡ Calculate your exact age down to the second at agecalculators.dev', width / 2, footerY);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '17px system-ui, -apple-system, sans-serif';
      ctx.fillText('100% Free • Exact Calendar Precision • Live Seconds Odometer', width / 2, footerY + 30);
      ctx.restore();
    }

    return canvas;
  }, [
    displayName,
    years,
    months,
    days,
    totalDays,
    liveSeconds,
    birthDateFormatted,
    dayOfWeekBorn,
    zodiacSign,
    daysUntilNextBirthday,
    ageTurningNext,
    lifeStats,
    theme,
    aspectRatio
  ]);

  // Download high-resolution PNG
  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const canvas = drawCardToCanvas();
      if (!canvas) return;

      const imageURI = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `my-exact-age-card-${birthDate.year}-${aspectRatio}.png`;
      link.href = imageURI;
      link.click();

      trackEvent('age_card_downloaded', { theme: activeTheme, ratio: aspectRatio });
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy Image directly to clipboard
  const handleCopyImage = async () => {
    setIsGenerating(true);
    try {
      const canvas = drawCardToCanvas();
      if (!canvas) return;

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const item = new (window as any).ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 2500);
          trackEvent('age_card_copied_image');
        } catch {
          await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
          setCopiedLink(true);
          setTimeout(() => setCopiedLink(false), 2500);
        }
      }, 'image/png');
    } finally {
      setIsGenerating(false);
    }
  };

  // Native Web Share API with image file attachment
  const handleWebShare = async () => {
    const canvas = drawCardToCanvas();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `my-age-card-${aspectRatio}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `${displayName} – Age Calculator`,
            text: shareText,
            files: [file]
          });
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 2500);
          trackEvent('age_card_web_shared_with_file');
          return;
        } catch {
          // Fall through
        }
      }

      if (navigator.share) {
        try {
          await navigator.share({
            title: `${displayName} – Age Calculator`,
            text: shareText,
            url: shareUrl
          });
          trackEvent('age_card_web_shared_text');
        } catch {
          // Fall through
        }
      } else {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    }, 'image/png');
  };

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=AgeCalculator,Milestone,MyAge`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`
  };

  return (
    <div className="mt-10 bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-50 text-pink-700 border border-pink-100 mb-2 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>Engaging Social Card with Live Seconds</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Share My Age Card
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Download your personalized infographic milestone card or share directly with friends on social media.
          </p>
        </div>

        {/* Theme Picker */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto">
          <Palette className="w-4 h-4 text-slate-500 ml-2" />
          <div className="flex items-center gap-1">
            {(Object.keys(THEMES) as ThemeKey[]).map((tKey) => {
              const t = THEMES[tKey];
              const isSelected = activeTheme === tKey;
              return (
                <button
                  key={tKey}
                  type="button"
                  onClick={() => {
                    setActiveTheme(tKey);
                    trackEvent('age_card_theme_changed', { theme: tKey });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={t.name}
                >
                  {t.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Controls: Name Customizer & Aspect Ratio Selector */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="card-name-input" className="block text-xs font-bold text-slate-700 mb-1.5">
            Customize Name on Card (Optional)
          </label>
          <input
            id="card-name-input"
            type="text"
            maxLength={30}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="e.g. Alex, Sarah, Michael"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white rounded-xl text-sm font-semibold text-slate-900 shadow-2xs transition-all placeholder:text-slate-400 placeholder:font-normal"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Card Format / Aspect Ratio
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setAspectRatio('square');
                trackEvent('age_card_theme_changed', { ratio: 'square' });
              }}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                aspectRatio === 'square'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span>Square (1:1)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAspectRatio('story');
                trackEvent('age_card_theme_changed', { ratio: 'story' });
              }}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                aspectRatio === 'story'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Story (9:16)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAspectRatio('wide');
                trackEvent('age_card_theme_changed', { ratio: 'wide' });
              }}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                aspectRatio === 'wide'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Wide (16:9)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Live Preview Card (Adapts to Selected Aspect Ratio) */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 px-1">
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>
              Live Interactive Preview ({aspectRatio === 'square' ? 'Square 1:1' : aspectRatio === 'story' ? 'Story 9:16' : 'Wide 16:9'})
            </span>
          </span>
          <span className="text-slate-400 font-mono text-[11px]">
            {aspectRatio === 'square' ? '1200 × 1200 px' : aspectRatio === 'story' ? '1080 × 1920 px' : '1200 × 675 px'}
          </span>
        </div>

        {/* =========================================
            LIVE PREVIEW: WIDE (16:9)
        ========================================= */}
        {aspectRatio === 'wide' && (
          <div
            className={`w-full max-w-4xl mx-auto rounded-3xl p-5 sm:p-7 bg-gradient-to-br ${theme.gradientBg} text-white shadow-xl border border-white/10 relative overflow-hidden transition-all duration-300`}
          >
            {/* Ambient Glow */}
            <div
              className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-30"
              style={{ backgroundColor: theme.accentColor }}
            />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Column */}
              <div className="md:col-span-6 space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold text-white shadow-xs"
                    style={{ backgroundColor: theme.pillColor }}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>agecalculators.dev</span>
                  </div>
                  <span className="text-[11px] text-white/70 font-medium">Verified Age Card</span>
                </div>

                <div>
                  <h4 className="text-2xl font-extrabold text-white tracking-tight">{displayName}</h4>
                  <p className="text-xs text-white/80 mt-0.5">
                    Born on <strong className="text-white">{dayOfWeekBorn}, {birthDateFormatted}</strong> • Zodiac: <strong className="text-white">{zodiacSign}</strong>
                  </p>
                </div>

                {/* 3 Age blocks */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
                    <div className="text-2xl sm:text-3xl font-black text-white font-mono leading-none">{years}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: theme.accentColor }}>Years</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
                    <div className="text-2xl sm:text-3xl font-black text-white font-mono leading-none">{months}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: theme.accentColor }}>Months</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
                    <div className="text-2xl sm:text-3xl font-black text-white font-mono leading-none">{days}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: theme.accentColor }}>Days</div>
                  </div>
                </div>

                {/* Live Seconds ticker */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-white/15 flex items-center justify-between gap-2 shadow-inner">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4 text-slate-950 fill-slate-950 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-sky-400">Live Seconds Lived</div>
                      <div className="text-sm sm:text-base font-black font-mono text-white tabular-nums">
                        {liveSeconds.toLocaleString()} s
                      </div>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
                </div>
              </div>

              {/* Right Column: 2x2 Metric Cards */}
              <div className="md:col-span-6 grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center mb-1.5">
                    <Cake className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[10px] font-bold uppercase" style={{ color: theme.accentColor }}>Next Birthday</div>
                  <div className="text-sm font-extrabold text-white mt-0.5">{daysUntilNextBirthday} Days Left</div>
                  <div className="text-[10px] text-white/60">Turning {ageTurningNext}</div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center mb-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[10px] font-bold uppercase" style={{ color: theme.accentColor }}>Total Days</div>
                  <div className="text-sm font-extrabold text-white mt-0.5 font-mono">{totalDays.toLocaleString()} Days</div>
                  <div className="text-[10px] text-white/60">On Earth</div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center mb-1.5">
                    <Heart className="w-3.5 h-3.5 fill-white" />
                  </div>
                  <div className="text-[10px] font-bold uppercase" style={{ color: theme.accentColor }}>Heartbeats</div>
                  <div className="text-sm font-extrabold text-white mt-0.5 font-mono">~{(lifeStats.estimatedHeartbeats / 1_000_000).toFixed(1)}M</div>
                  <div className="text-[10px] text-white/60">~80 bpm</div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center mb-1.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[10px] font-bold uppercase" style={{ color: theme.accentColor }}>Solar Orbit</div>
                  <div className="text-sm font-extrabold text-white mt-0.5">{lifeStats.sunOrbitProgressPercent}% Done</div>
                  <div className="text-[10px] text-white/60">To Age {ageTurningNext}</div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-4 pt-3 border-t border-white/10 text-center text-[11px] text-white/70">
              ⚡ Calculate your exact age down to the second at <strong>agecalculators.dev</strong>
            </div>
          </div>
        )}

        {/* =========================================
            LIVE PREVIEW: STORY (9:16)
        ========================================= */}
        {aspectRatio === 'story' && (
          <div
            className={`w-full max-w-sm mx-auto rounded-3xl p-6 bg-gradient-to-br ${theme.gradientBg} text-white shadow-xl border border-white/10 relative overflow-hidden transition-all duration-300 space-y-4`}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-30"
              style={{ backgroundColor: theme.accentColor }}
            />

            <div className="relative z-10 flex items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold text-white shadow-xs"
                style={{ backgroundColor: theme.pillColor }}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>agecalculators.dev</span>
              </div>
              <span className="text-[10px] text-white/70 font-medium">Verified Story</span>
            </div>

            <div className="relative z-10">
              <h4 className="text-2xl font-black text-white tracking-tight">{displayName}</h4>
              <p className="text-xs text-white/80 mt-0.5">
                Born on <strong className="text-white">{dayOfWeekBorn}, {birthDateFormatted}</strong>
              </p>
              <p className="text-[11px] text-white/70">Zodiac: {zodiacSign}</p>
            </div>

            {/* Big 3 Age Blocks */}
            <div className="relative z-10 grid grid-cols-3 gap-2">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
                <div className="text-2xl font-black text-white font-mono leading-none">{years}</div>
                <div className="text-[10px] font-bold uppercase mt-1" style={{ color: theme.accentColor }}>Years</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
                <div className="text-2xl font-black text-white font-mono leading-none">{months}</div>
                <div className="text-[10px] font-bold uppercase mt-1" style={{ color: theme.accentColor }}>Months</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
                <div className="text-2xl font-black text-white font-mono leading-none">{days}</div>
                <div className="text-[10px] font-bold uppercase mt-1" style={{ color: theme.accentColor }}>Days</div>
              </div>
            </div>

            {/* Live Seconds Banner */}
            <div className="relative z-10 p-3.5 rounded-2xl bg-slate-900/95 border border-white/15 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-slate-950 fill-slate-950 animate-pulse" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-sky-400">Live Seconds Lived</div>
                  <div className="text-sm font-black font-mono text-white tabular-nums">{liveSeconds.toLocaleString()} s</div>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
            </div>

            {/* 4 Stacked Metric Cards */}
            <div className="relative z-10 space-y-2">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0">
                  <Cake className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase" style={{ color: theme.accentColor }}>Next Birthday</div>
                  <div className="text-xs font-bold text-white">{daysUntilNextBirthday} Days Left (Turning {ageTurningNext})</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase" style={{ color: theme.accentColor }}>Total Days</div>
                  <div className="text-xs font-bold text-white font-mono">{totalDays.toLocaleString()} Days on Earth</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase" style={{ color: theme.accentColor }}>Heartbeats</div>
                  <div className="text-xs font-bold text-white font-mono">~{(lifeStats.estimatedHeartbeats / 1_000_000).toFixed(1)} Million</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase" style={{ color: theme.accentColor }}>Solar Orbit</div>
                  <div className="text-xs font-bold text-white">{lifeStats.sunOrbitProgressPercent}% to Age {ageTurningNext}</div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-2 border-t border-white/10 text-center text-[10px] text-white/70">
              ⚡ Calculate yours at <strong>agecalculators.dev</strong>
            </div>
          </div>
        )}

        {/* =========================================
            LIVE PREVIEW: SQUARE (1:1)
        ========================================= */}
        {aspectRatio === 'square' && (
          <div
            className={`w-full max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${theme.gradientBg} text-white shadow-xl border border-white/10 relative overflow-hidden transition-all duration-300`}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-30"
              style={{ backgroundColor: theme.accentColor }}
            />

            <div className="relative z-10 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-white shadow-xs"
                style={{ backgroundColor: theme.pillColor }}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>agecalculators.dev</span>
              </div>
              <div className="text-[11px] font-medium text-white/70">Verified Age Card</div>
            </div>

            <div className="relative z-10 mt-5">
              <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{displayName}</h4>
              <p className="text-xs sm:text-sm text-white/80 mt-1">
                Born on <strong className="text-white">{dayOfWeekBorn}, {birthDateFormatted}</strong> • Zodiac: <strong className="text-white">{zodiacSign}</strong>
              </p>
            </div>

            {/* Big Age Numbers */}
            <div className="relative z-10 grid grid-cols-3 gap-2.5 sm:gap-4 my-6">
              <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
                <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-mono tabular-nums leading-none">{years}</div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1.5" style={{ color: theme.accentColor }}>Years</div>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
                <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-mono tabular-nums leading-none">{months}</div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1.5" style={{ color: theme.accentColor }}>Months</div>
              </div>
              <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
                <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-mono tabular-nums leading-none">{days}</div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1.5" style={{ color: theme.accentColor }}>Days</div>
              </div>
            </div>

            {/* Live Seconds Banner */}
            <div className="relative z-10 p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-white/15 mb-6 flex items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                  <Zap className="w-5 h-5 text-slate-950 fill-slate-950 animate-pulse" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sky-400">Live Total Seconds Lived</div>
                  <div className="text-base sm:text-xl font-black font-mono text-white tabular-nums">
                    {liveSeconds.toLocaleString()} <span className="text-xs text-slate-400 font-normal">seconds</span>
                  </div>
                </div>
              </div>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping mr-2 shrink-0" />
            </div>

            {/* 2x2 Metric Badges */}
            <div className="relative z-10 grid grid-cols-2 gap-2.5 sm:gap-3 text-left">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Cake className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: theme.accentColor }}>Next Birthday</div>
                  <div className="text-sm sm:text-base font-extrabold text-white mt-0.5">{daysUntilNextBirthday} Days Left</div>
                  <div className="text-[10px] text-white/60">Turning {ageTurningNext}</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: theme.accentColor }}>Total Days</div>
                  <div className="text-sm sm:text-base font-extrabold text-white mt-0.5 font-mono">{totalDays.toLocaleString()} Days</div>
                  <div className="text-[10px] text-white/60">On Earth</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Heart className="w-4 h-4 text-white fill-white" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: theme.accentColor }}>Heartbeats</div>
                  <div className="text-sm sm:text-base font-extrabold text-white mt-0.5 font-mono">~{(lifeStats.estimatedHeartbeats / 1_000_000).toFixed(1)}M</div>
                  <div className="text-[10px] text-white/60">~80 bpm</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: theme.accentColor }}>Solar Orbit</div>
                  <div className="text-sm sm:text-base font-extrabold text-white mt-0.5">{lifeStats.sunOrbitProgressPercent}% Done</div>
                  <div className="text-[10px] text-white/60">To Age {ageTurningNext}</div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-5 pt-3.5 border-t border-white/10 text-center text-[11px] text-white/70">
              ⚡ Calculate your exact age down to the second at <strong>agecalculators.dev</strong>
            </div>
          </div>
        )}
      </div>

      {/* Primary Actions: Download & Native Share Buttons */}
      <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isGenerating}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-extrabold text-sm shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isGenerating ? 'Rendering High-Res Image...' : `Download ${aspectRatio.toUpperCase()} Image (PNG)`}</span>
        </button>

        <button
          type="button"
          onClick={handleWebShare}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-extrabold text-sm shadow-sm hover:shadow transition-all cursor-pointer"
        >
          {shareSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          <span>{shareSuccess ? 'Shared!' : 'Share Image Card'}</span>
        </button>

        <button
          type="button"
          onClick={handleCopyImage}
          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold text-sm transition-all cursor-pointer"
          title="Copy image or text link to clipboard"
        >
          {copiedImage || copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
          <span>{copiedImage ? 'Image Copied!' : copiedLink ? 'Link Copied!' : 'Copy'}</span>
        </button>
      </div>

      {/* 1-Tap Direct Social Media Buttons */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Or Share Directly on Social Media
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {/* WhatsApp */}
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('age_card_social_click', { platform: 'whatsapp' })}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 transition-all border border-[#25D366]/20"
          >
            <span>💬 WhatsApp</span>
          </a>

          {/* X / Twitter */}
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('age_card_social_click', { platform: 'twitter' })}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-black transition-all"
          >
            <span>𝕏 Post</span>
          </a>

          {/* Facebook */}
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('age_card_social_click', { platform: 'facebook' })}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition-all border border-[#1877F2]/20"
          >
            <span>Facebook</span>
          </a>

          {/* Telegram */}
          <a
            href={shareLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('age_card_social_click', { platform: 'telegram' })}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9]/20 transition-all border border-[#229ED9]/20"
          >
            <span>Telegram</span>
          </a>

          {/* LinkedIn */}
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('age_card_social_click', { platform: 'linkedin' })}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-all border border-[#0A66C2]/20"
          >
            <span>LinkedIn</span>
          </a>

          {/* Reddit */}
          <a
            href={shareLinks.reddit}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('age_card_social_click', { platform: 'reddit' })}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#FF4500]/10 text-[#FF4500] hover:bg-[#FF4500]/20 transition-all border border-[#FF4500]/20"
          >
            <span>Reddit</span>
          </a>
        </div>
      </div>

      {/* Hidden canvas element for rendering */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  );
}
