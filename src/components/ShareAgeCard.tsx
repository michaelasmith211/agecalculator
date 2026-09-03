'use client';

import React, { useState, useRef, useCallback } from 'react';
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
  CheckCircle2
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
    gradientBg: 'from-slate-900 via-blue-950 to-indigo-950',
    canvasBgStart: '#0f172a',
    canvasBgEnd: '#1e1b4b',
    accentColor: '#38bdf8',
    cardBg: 'rgba(30, 58, 138, 0.35)',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    textColor: '#ffffff',
    highlightText: '#60a5fa',
    pillColor: '#2563eb'
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Glow',
    gradientBg: 'from-slate-950 via-rose-950 to-amber-950',
    canvasBgStart: '#0c0a09',
    canvasBgEnd: '#4c0519',
    accentColor: '#fb7185',
    cardBg: 'rgba(159, 18, 57, 0.35)',
    badgeBg: 'rgba(251, 113, 133, 0.15)',
    textColor: '#ffffff',
    highlightText: '#fb923c',
    pillColor: '#e11d48'
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Mint',
    gradientBg: 'from-slate-950 via-teal-950 to-emerald-950',
    canvasBgStart: '#022c22',
    canvasBgEnd: '#064e3b',
    accentColor: '#34d399',
    cardBg: 'rgba(6, 78, 59, 0.35)',
    badgeBg: 'rgba(52, 211, 153, 0.15)',
    textColor: '#ffffff',
    highlightText: '#6ee7b7',
    pillColor: '#059669'
  },
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Violet',
    gradientBg: 'from-slate-950 via-purple-950 to-fuchsia-950',
    canvasBgStart: '#180828',
    canvasBgEnd: '#3b0764',
    accentColor: '#c084fc',
    cardBg: 'rgba(88, 28, 135, 0.35)',
    badgeBg: 'rgba(192, 132, 252, 0.15)',
    textColor: '#ffffff',
    highlightText: '#e879f9',
    pillColor: '#9333ea'
  }
};

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
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const lifeStats = calculateLifeStats(totalSeconds || (years * 365.25 + months * 30.43 + days) * 86400, daysUntilNextBirthday);
  const theme = THEMES[activeTheme];

  const displayName = userName.trim() ? `${userName.trim()}'s Exact Age` : 'My Exact Age';
  const shareText = `🎉 ${displayName}: I am ${years} Years, ${months} Months, and ${days} Days old today (${totalDays.toLocaleString()} total days lived)! Calculate yours down to the second on ${SITE_CONFIG.name}:`;
  const shareUrl = `${SITE_CONFIG.domain}/`;

  // Draw high-res retina image to canvas
  const drawCardToCanvas = useCallback((): HTMLCanvasElement | null => {
    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = 1200;
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

    // 2. Decorative ambient orbs
    const orb1 = ctx.createRadialGradient(200, 200, 10, 200, 200, 400);
    orb1.addColorStop(0, `${theme.accentColor}33`);
    orb1.addColorStop(1, 'transparent');
    ctx.fillStyle = orb1;
    ctx.fillRect(0, 0, width, height);

    const orb2 = ctx.createRadialGradient(1000, 1000, 10, 1000, 1000, 500);
    orb2.addColorStop(0, `${theme.accentColor}22`);
    orb2.addColorStop(1, 'transparent');
    ctx.fillStyle = orb2;
    ctx.fillRect(0, 0, width, height);

    // 3. Inner Card Border & Glow
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(50, 50, width - 100, height - 100, 40);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.fill();
    ctx.restore();

    // 4. Header Badge (Brand)
    ctx.save();
    ctx.fillStyle = theme.pillColor;
    ctx.beginPath();
    ctx.roundRect(100, 100, 280, 56, 28);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('📅 agecalculators.dev', 240, 128);
    ctx.restore();

    // 5. Title / User Name
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(displayName, 100, 220);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '24px system-ui, -apple-system, sans-serif';
    ctx.fillText(`Born on ${dayOfWeekBorn}, ${birthDateFormatted} • Zodiac: ${zodiacSign}`, 100, 265);
    ctx.restore();

    // 6. Giant Age Display Blocks (Years, Months, Days)
    const blockWidth = 310;
    const blockHeight = 240;
    const startY = 320;
    const gaps = [100, 445, 790];

    const ageUnits = [
      { num: String(years), label: 'YEARS' },
      { num: String(months), label: 'MONTHS' },
      { num: String(days), label: 'DAYS' }
    ];

    ageUnits.forEach((unit, idx) => {
      const x = gaps[idx];

      // Block background
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, startY, blockWidth, blockHeight, 28);
      ctx.fill();
      ctx.stroke();

      // Number
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 110px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(unit.num, x + blockWidth / 2, startY + 140);

      // Label
      ctx.fillStyle = theme.accentColor;
      ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
      ctx.fillText(unit.label, x + blockWidth / 2, startY + 200);
      ctx.restore();
    });

    // 7. Key Milestone Infographic Cards (2x2 Grid)
    const gridY = 600;
    const cardW = 480;
    const cardH = 170;

    const stats = [
      {
        icon: '🎂',
        title: 'NEXT BIRTHDAY',
        val: `${daysUntilNextBirthday} Days Left`,
        sub: `Turning ${ageTurningNext} years old`
      },
      {
        icon: '🗓️',
        title: 'TOTAL DAYS ON EARTH',
        val: `${totalDays.toLocaleString()} Days`,
        sub: `Exact elapsed calendar days`
      },
      {
        icon: '💓',
        title: 'ESTIMATED HEARTBEATS',
        val: `~${(lifeStats.estimatedHeartbeats / 1_000_000).toFixed(1)}M`,
        sub: `Beating approx 80 times/min`
      },
      {
        icon: '☀️',
        title: 'SOLAR YEAR PROGRESS',
        val: `${lifeStats.sunOrbitProgressPercent}%`,
        sub: `Completed towards Age ${ageTurningNext}`
      }
    ];

    const pos = [
      { x: 100, y: gridY },
      { x: 620, y: gridY },
      { x: 100, y: gridY + 200 },
      { x: 620, y: gridY + 200 }
    ];

    stats.forEach((s, idx) => {
      const p = pos[idx];
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, cardW, cardH, 20);
      ctx.fill();
      ctx.stroke();

      ctx.font = '36px system-ui, -apple-system, sans-serif';
      ctx.fillText(s.icon, p.x + 30, p.y + 60);

      ctx.fillStyle = theme.accentColor;
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(s.title, p.x + 85, p.y + 55);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
      ctx.fillText(s.val, p.x + 30, p.y + 115);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '20px system-ui, -apple-system, sans-serif';
      ctx.fillText(s.sub, p.x + 30, p.y + 145);
      ctx.restore();
    });

    // 8. Footer Brand & Call-To-Action
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ Calculate your exact age down to the second at agecalculators.dev', width / 2, 1070);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '18px system-ui, -apple-system, sans-serif';
    ctx.fillText('100% Free • Exact Calendar Precision • Live Seconds Odometer', width / 2, 1105);
    ctx.restore();

    return canvas;
  }, [
    displayName,
    years,
    months,
    days,
    totalDays,
    birthDateFormatted,
    dayOfWeekBorn,
    zodiacSign,
    daysUntilNextBirthday,
    ageTurningNext,
    lifeStats,
    theme
  ]);

  // Download high-resolution PNG
  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const canvas = drawCardToCanvas();
      if (!canvas) return;

      const imageURI = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `my-exact-age-card-agecalculators-${birthDate.year}.png`;
      link.href = imageURI;
      link.click();

      trackEvent('age_card_downloaded', { theme: activeTheme });
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
            <span>Engaging Social Card</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Share My Age Card
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Download your personalized infographic milestone card or share directly with friends and family on social media.
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

      {/* Name Customizer Input */}
      <div className="mt-5 max-w-md">
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

      {/* Visual Live Preview Card (What Will Be Shared) */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 px-1">
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Live Image Preview</span>
          </span>
          <span className="text-slate-400 font-normal">HD 1200 × 1200 Format</span>
        </div>

        {/* Live CSS Card matching Canvas Output */}
        <div
          className={`w-full max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${theme.gradientBg} text-white shadow-xl border border-white/10 relative overflow-hidden transition-all duration-300`}
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

          {/* 2x2 Highlight Metric Badges */}
          <div className="relative z-10 grid grid-cols-2 gap-2.5 sm:gap-3 text-left">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: theme.accentColor }}>
                <Cake className="w-3.5 h-3.5" />
                <span>Next Birthday</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                {daysUntilNextBirthday} Days Left
              </div>
              <div className="text-[10px] text-white/60">Turning {ageTurningNext} years old</div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: theme.accentColor }}>
                <Calendar className="w-3.5 h-3.5" />
                <span>Total Days</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white mt-0.5 font-mono">
                {totalDays.toLocaleString()} Days
              </div>
              <div className="text-[10px] text-white/60">Lived on Earth</div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: theme.accentColor }}>
                <Heart className="w-3.5 h-3.5" />
                <span>Heartbeats</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white mt-0.5 font-mono">
                ~{(lifeStats.estimatedHeartbeats / 1_000_000).toFixed(1)} Million
              </div>
              <div className="text-[10px] text-white/60">~80 beats/min</div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: theme.accentColor }}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Solar Orbit</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                {lifeStats.sunOrbitProgressPercent}% Done
              </div>
              <div className="text-[10px] text-white/60">Towards Age {ageTurningNext}</div>
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
          <span>{isGenerating ? 'Rendering Image...' : 'Download Image (PNG)'}</span>
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
