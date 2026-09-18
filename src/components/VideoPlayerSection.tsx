'use client';

import React, { useRef, useState } from 'react';
import { Play, Sparkles, Clock, Download } from 'lucide-react';

interface Chapter {
  id: string;
  time: number;
  label: string;
  title: string;
  desc: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 'intro',
    time: 0,
    label: '0:00',
    title: 'Overview & Capabilities',
    desc: 'Introduction to chronological age calculation, precision leap year rules, and zero-tracking privacy.'
  },
  {
    id: 'step-1',
    time: 5,
    label: '0:05',
    title: 'Step 1: Enter Birth Date',
    desc: 'Select day, month, and year with quick-select shortcuts and full international date format support.'
  },
  {
    id: 'step-2',
    time: 10,
    label: '0:10',
    title: 'Step 2: Target Date & Birth Time',
    desc: 'Customize the calculation reference date or enable optional birth time for down-to-the-second accuracy.'
  },
  {
    id: 'step-3',
    time: 15,
    label: '0:15',
    title: 'Step 3: Live Instant Results',
    desc: 'One click calculates exact years, months, days, total days lived, and a real-time ticking seconds odometer.'
  },
  {
    id: 'summary',
    time: 21,
    label: '0:21',
    title: 'Step 4: Milestones & Features',
    desc: 'Next birthday countdown, milestone trackers, 39 language options, and mobile PWA compatibility.'
  }
];

export default function VideoPlayerSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const handleSeek = (seconds: number, index: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
      setActiveChapterIndex(index);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    for (let i = CHAPTERS.length - 1; i >= 0; i--) {
      if (current >= CHAPTERS[i].time) {
        setActiveChapterIndex(i);
        break;
      }
    }
  };

  return (
    <section
      id="video-guide"
      className="my-16 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs"
      aria-labelledby="video-guide-heading"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Video Walkthrough &amp; Guide</span>
        </div>
        <h2
          id="video-guide-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight"
        >
          How the Age Calculator Works (Video Guide)
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Watch our 25-second step-by-step video demonstration to see how to calculate your exact chronological age, next birthday countdown, and live running seconds in real time.
        </p>
      </div>

      {/* Main Video Player Container */}
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-950 aspect-video group">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            controls
            playsInline
            preload="metadata"
            poster="/images/video-poster.webp"
            onTimeUpdate={handleTimeUpdate}
            title="How to Calculate Your Age Online - Video Walkthrough"
          >
            <source src="/videos/how-it-works.mp4" type="video/mp4" />
            <source src="/videos/how-it-works.webm" type="video/webm" />
            <track
              kind="captions"
              src="/videos/how-it-works-captions.vtt"
              srcLang="en"
              label="English"
              default
            />
            <p className="p-6 text-white text-center text-sm">
              Your browser does not support HTML5 video.{' '}
              <a
                href="/videos/how-it-works.mp4"
                download
                className="text-blue-400 underline font-semibold"
              >
                Download the MP4 video here
              </a>.
            </p>
          </video>
        </div>

        {/* Video Player Meta & Download Bar */}
        <div className="mt-3 px-1 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Duration: 0:25
            </span>
            <span>•</span>
            <span>HD 720p</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium">Captions Included (WebVTT)</span>
          </div>

          <a
            href="/videos/how-it-works.mp4"
            download="age-calculator-how-it-works.mp4"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            title="Download HD Video Guide"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Video (.MP4)</span>
          </a>
        </div>

        {/* Interactive Key Moments / Chapter Buttons */}
        <div className="mt-8 border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Video Chapters &amp; Key Moments</span>
            </h3>
            <span className="text-xs text-slate-500">Click any timestamp to jump</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CHAPTERS.map((chapter, idx) => {
              const isActive = activeChapterIndex === idx;
              return (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => handleSeek(chapter.time, idx)}
                  className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                  }`}
                  aria-label={`Jump to ${chapter.title} at ${chapter.label}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {chapter.label}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-current" />
                        Now Playing
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm mt-1">
                    {chapter.title}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {chapter.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step-by-Step SEO Content Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-extrabold shrink-0">
                1
              </span>
              <span>1. Enter Date of Birth</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Select your birth day, month, and year. Supports all Gregorian leap years and standard international calendar formats.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-extrabold shrink-0">
                2
              </span>
              <span>2. Pick Date &amp; Time</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Defaults to today&apos;s current date, or select any custom milestone date. Toggle exact birth time for precision down to the second.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-extrabold shrink-0">
                3
              </span>
              <span>3. Live Odometer Results</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Instantly view exact age in years, months, and days, next birthday countdown, and a live running seconds odometer that never stops ticking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
