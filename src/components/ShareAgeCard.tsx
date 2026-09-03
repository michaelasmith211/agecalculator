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

  // Draw high-resolution retina canvas image with crisp vector icons & live seconds
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

    // 3. Inner Card Border & Glow
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(40, 40, width - 80, height - 80, 36);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.fill();
    ctx.restore();

    // 4. Header Badge (Brand)
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

    // 5. Title / User Name
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 52px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(displayName, 80, 195);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '22px system-ui, -apple-system, sans-serif';
    ctx.fillText(`Born on ${dayOfWeekBorn}, ${birthDateFormatted} • Zodiac: ${zodiacSign}`, 80, 240);
    ctx.restore();

    // 6. Giant Age Display Blocks (Years, Months, Days)
    const blockWidth = (width - 160 - 40) / 3;
    const blockHeight = aspectRatio === 'story' ? 260 : 210;
    const startY = 280;

    const ageUnits = [
      { num: String(years), label: 'YEARS' },
      { num: String(months), label: 'MONTHS' },
      { num: String(days), label: 'DAYS' }
    ];

    ageUnits.forEach((unit, idx) => {
      const x = 80 + idx * (blockWidth + 20);

      // Block background
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, startY, blockWidth, blockHeight, 24);
      ctx.fill();
      ctx.stroke();

      // Number
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 96px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(unit.num, x + blockWidth / 2, startY + blockHeight * 0.45);

      // Label
      ctx.fillStyle = theme.accentColor;
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
      ctx.fillText(unit.label, x + blockWidth / 2, startY + blockHeight * 0.82);
      ctx.restore();
    });

    // 7. Live Real-Time Seconds Ticker Banner
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

    // Lightning Icon Circle Badge
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(130, bannerY + bannerH / 2, 24, 0, Math.PI * 2);
    ctx.fill();
    drawZapIcon(ctx, 130, bannerY + bannerH / 2, 28, '#0f172a');

    // Text info
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('⚡ LIVE REAL-TIME SECONDS LIVED', 170, bannerY + 22);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 34px monospace, system-ui, sans-serif';
    ctx.fillText(`${liveSeconds.toLocaleString()} seconds`, 170, bannerY + 48);
    ctx.restore();

    // 8. Key Milestone Infographic Cards (2x2 Grid)
    const gridY = bannerY + bannerH + 25;
    const cardW = (width - 160 - 25) / 2;
    const cardH = aspectRatio === 'story' ? 220 : 160;

    const stats = [
      {
        type: 'cake',
        badgeColor: '#ec4899',
        iconColor: '#ffffff',
        title: 'NEXT BIRTHDAY',
        val: `${daysUntilNextBirthday} Days Left`,
        sub: `Turning ${ageTurningNext} years old`
      },
      {
        type: 'calendar',
        badgeColor: '#3b82f6',
        iconColor: '#ffffff',
        title: 'TOTAL DAYS ON EARTH',
        val: `${totalDays.toLocaleString()} Days`,
        sub: `Exact elapsed calendar days`
      },
      {
        type: 'heart',
        badgeColor: '#f43f5e',
        iconColor: '#ffffff',
        title: 'ESTIMATED HEARTBEATS',
        val: `~${(lifeStats.estimatedHeartbeats / 1_000_000).toFixed(1)}M`,
        sub: `Beating approx 80 times/min`
      },
      {
        type: 'sun',
        badgeColor: '#f59e0b',
        iconColor: '#ffffff',
        title: 'SOLAR YEAR PROGRESS',
        val: `${lifeStats.sunOrbitProgressPercent}%`,
        sub: `Completed towards Age ${ageTurningNext}`
      }
    ];

    const pos = [
      { x: 80, y: gridY },
      { x: 80 + cardW + 25, y: gridY },
      { x: 80, y: gridY + cardH + 20 },
      { x: 80 + cardW + 25, y: gridY + cardH + 20 }
    ];

    stats.forEach((s, idx) => {
      const p = pos[idx];
      ctx.save();
      // Card box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, cardW, cardH, 20);
      ctx.fill();
      ctx.stroke();

      // Colored Icon Badge Circle (100% OPAQUE & VIBRANT)
      const badgeX = p.x + 36;
      const badgeY = p.y + 36;
      const badgeRadius = 22;

      ctx.fillStyle = s.badgeColor;
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw Vector Icon Shape inside badge circle
      if (s.type === 'cake') {
        drawCakeIcon(ctx, badgeX, badgeY - 2, 26, '#ffffff');
      } else if (s.type === 'calendar') {
        drawCalendarIcon(ctx, badgeX, badgeY, 26, '#ffffff');
      } else if (s.type === 'heart') {
        drawHeartIcon(ctx, badgeX, badgeY, 26, '#ffffff');
      } else if (s.type === 'sun') {
        drawSunIcon(ctx, badgeX, badgeY, 28, '#ffffff');
      }

      // Title Text (Fully reset fillStyle & opacity)
      ctx.fillStyle = theme.accentColor;
      ctx.font = 'bold 17px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(s.title, p.x + 72, badgeY);

      // Value Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 34px system-ui, -apple-system, sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText(s.val, p.x + 22, p.y + 70);

      // Subtitle Text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.font = '19px system-ui, -apple-system, sans-serif';
      ctx.fillText(s.sub, p.x + 22, p.y + 115);
      ctx.restore();
    });

    // 9. Footer Brand & Call-To-Action
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

  // Copy Image directly to clipboard (supported in modern browsers)
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
          // Fallback to text copy
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
      const file = new File([blob], 'my-age-card.png', { type: 'image/png' });

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
          // Fall through if user canceled or failed
        }
      }

      // Fallback to URL/text Web Share or Clipboard
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${displayName} – Age Calculator`,
            text: shareText,
            url: shareUrl
          });
          trackEvent('age_card_web_shared_text');
        } catch {
          // Fallback to copy link
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
              onClick={() => setAspectRatio('square')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                aspectRatio === 'square'
                  ? 'bg-blue-50 border-blue-600 text-blue-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Square className="w-3.5 h-3.5" />
              <span>Square (1:1)</span>
            </button>

            <button
              type="button"
              onClick={() => setAspectRatio('story')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                aspectRatio === 'story'
                  ? 'bg-blue-50 border-blue-600 text-blue-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Story (9:16)</span>
            </button>

            <button
              type="button"
              onClick={() => setAspectRatio('wide')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                aspectRatio === 'wide'
                  ? 'bg-blue-50 border-blue-600 text-blue-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Wide (16:9)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Live Preview Card (What Will Be Shared) */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 px-1">
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Live Interactive Preview (Ticking Live Seconds)</span>
          </span>
          <span className="text-slate-400 font-normal">
            {aspectRatio === 'square' ? '1200 × 1200' : aspectRatio === 'story' ? '1080 × 1920' : '1200 × 675'}
          </span>
        </div>

        {/* Live CSS Card matching Canvas Output */}
        <div
          className={`w-full max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${theme.gradientBg} text-white shadow-xl border border-white/10 relative overflow-hidden transition-all duration-300 ${
            aspectRatio === 'story' ? 'aspect-9/14 sm:aspect-9/13' : ''
          }`}
        >
          {/* Decorative Glow */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-30"
            style={{ backgroundColor: theme.accentColor }}
          />

          {/* Card Header */}
          <div className="relative z-10 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-white shadow-xs"
              style={{ backgroundColor: theme.pillColor }}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>agecalculators.dev</span>
            </div>
            <div className="text-[11px] font-medium text-white/70">
              Verified Age Card
            </div>
          </div>

          {/* User Name & Birth Info */}
          <div className="relative z-10 mt-5">
            <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {displayName}
            </h4>
            <p className="text-xs sm:text-sm text-white/80 mt-1">
              Born on <strong className="text-white">{dayOfWeekBorn}, {birthDateFormatted}</strong> • Zodiac: <strong className="text-white">{zodiacSign}</strong>
            </p>
          </div>

          {/* Big Highlight Age Numbers */}
          <div className="relative z-10 grid grid-cols-3 gap-2.5 sm:gap-4 my-6">
            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
              <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-mono tabular-nums leading-none">
                {years}
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1.5" style={{ color: theme.accentColor }}>
                Years
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
              <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-mono tabular-nums leading-none">
                {months}
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1.5" style={{ color: theme.accentColor }}>
                Months
              </div>
            </div>

            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 text-center">
              <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-mono tabular-nums leading-none">
                {days}
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-1.5" style={{ color: theme.accentColor }}>
                Days
              </div>
            </div>
          </div>

          {/* Live Running Total Seconds Banner */}
          <div className="relative z-10 p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-white/15 mb-6 flex items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                <Zap className="w-5 h-5 text-slate-950 fill-slate-950 animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sky-400">
                  Live Total Seconds Lived
                </div>
                <div className="text-base sm:text-xl font-black font-mono text-white tabular-nums">
                  {liveSeconds.toLocaleString()} <span className="text-xs text-slate-400 font-normal">seconds</span>
                </div>
              </div>
            </div>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping mr-2 shrink-0" />
          </div>

          {/* 2x2 Highlight Metric Badges with Colorful Vector Circles */}
          <div className="relative z-10 grid grid-cols-2 gap-2.5 sm:gap-3 text-left">
            {/* Next Birthday */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Cake className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: theme.accentColor }}>
                  Next Birthday
                </div>
                <div className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                  {daysUntilNextBirthday} Days Left
                </div>
                <div className="text-[10px] text-white/60">Turning {ageTurningNext} years old</div>
              </div>
            </div>

            {/* Total Days */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: theme.accentColor }}>
                  Total Days
                </div>
                <div className="text-sm sm:text-base font-extrabold text-white mt-0.5 font-mono">
                  {totalDays.toLocaleString()} Days
                </div>
                <div className="text-[10px] text-white/60">Lived on Earth</div>
              </div>
            </div>

            {/* Heartbeats */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: theme.accentColor }}>
                  Heartbeats
                </div>
                <div className="text-sm sm:text-base font-extrabold text-white mt-0.5 font-mono">
                  ~{(lifeStats.estimatedHeartbeats / 1_000_000).toFixed(1)} Million
                </div>
                <div className="text-[10px] text-white/60">~80 beats/min</div>
              </div>
            </div>

            {/* Solar Orbit */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: theme.accentColor }}>
                  Solar Orbit
                </div>
                <div className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                  {lifeStats.sunOrbitProgressPercent}% Done
                </div>
                <div className="text-[10px] text-white/60">Towards Age {ageTurningNext}</div>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="relative z-10 mt-5 pt-3.5 border-t border-white/10 text-center text-[11px] text-white/70">
            ⚡ Calculate your exact age down to the second at <strong>agecalculators.dev</strong>
          </div>
        </div>
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
          <span>{isGenerating ? 'Rendering High-Res Image...' : 'Download Image (PNG)'}</span>
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
