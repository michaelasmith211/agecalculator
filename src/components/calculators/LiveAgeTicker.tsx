'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import {
  Zap,
  Heart,
  Wind,
  Eye,
  Moon,
  Compass,
  Globe2,
  Sparkles,
  Clock,
  Activity
} from 'lucide-react';
import {
  CalendarDate,
  CalendarTime,
  calculateLifeStats,
  LifeStats
} from '@/lib/date-utils';

interface LiveAgeTickerProps {
  birthDate: CalendarDate;
  birthTime?: CalendarTime;
  targetDate: CalendarDate;
  isTodayTarget: boolean;
  years: number;
  months: number;
  days: number;
  daysUntilNextBirthday: number;
  ageTurningNext: number;
  birthDateFormatted: string;
}

const emptySubscribe = () => () => {};

export default function LiveAgeTicker({
  birthDate,
  birthTime,
  targetDate,
  isTodayTarget,
  years,
  months,
  days,
  daysUntilNextBirthday,
  ageTurningNext,
  birthDateFormatted
}: LiveAgeTickerProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [liveSeconds, setLiveSeconds] = useState<number>(0);
  const [liveMillis, setLiveMillis] = useState<number>(0);
  const [systemTimeStr, setSystemTimeStr] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'biology' | 'space'>('biology');

  useEffect(() => {
    if (!isClient) return;

    let animFrameId: number;

    const updateLiveTicker = () => {
      const now = new Date();
      setSystemTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      if (isTodayTarget) {
        // Calculate exact milliseconds elapsed from birth datetime to current system millisecond
        const bHours = birthTime?.hours || 0;
        const bMinutes = birthTime?.minutes || 0;
        const bSeconds = birthTime?.seconds || 0;
        const birthTimestamp = new Date(birthDate.year, birthDate.month - 1, birthDate.day, bHours, bMinutes, bSeconds, 0).getTime();
        const currentTimestamp = now.getTime();
        const deltaMs = Math.max(0, currentTimestamp - birthTimestamp);

        const totalSecs = Math.floor(deltaMs / 1000);
        const millis = deltaMs % 1000;

        setLiveSeconds(totalSecs);
        setLiveMillis(millis);
      } else {
        // Static target date calculation
        const bHours = birthTime?.hours || 0;
        const bMinutes = birthTime?.minutes || 0;
        const birthTimestamp = new Date(birthDate.year, birthDate.month - 1, birthDate.day, bHours, bMinutes, 0, 0).getTime();
        const targetTimestamp = new Date(targetDate.year, targetDate.month - 1, targetDate.day, 12, 0, 0, 0).getTime();
        const deltaMs = Math.max(0, targetTimestamp - birthTimestamp);
        setLiveSeconds(Math.floor(deltaMs / 1000));
        setLiveMillis(0);
      }

      animFrameId = requestAnimationFrame(updateLiveTicker);
    };

    animFrameId = requestAnimationFrame(updateLiveTicker);
    return () => cancelAnimationFrame(animFrameId);
  }, [birthDate, birthTime, targetDate, isTodayTarget, isClient]);

  const lifeStats: LifeStats = calculateLifeStats(
    liveSeconds || (years * 365.25 + months * 30.43 + days) * 86400,
    daysUntilNextBirthday
  );

  return (
    <div className="space-y-6">
      {/* Real-time Ticking Odometer Banner */}
      <div className="p-6 sm:p-8 bg-slate-900 text-white border border-slate-800 rounded-2xl shadow-lg relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <span>Live Real-Time Age Ticker</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isTodayTarget
                  ? 'Synchronized with your device system clock down to the millisecond'
                  : `Calculated as of target date ${targetDate.year}-${targetDate.month}-${targetDate.day}`}
              </p>
            </div>
          </div>

          {isClient && isTodayTarget && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300 self-start md:self-auto">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>System Clock: <strong className="text-white">{systemTimeStr}</strong></span>
            </div>
          )}
        </div>

        {/* Big Milliseconds Odometer Display */}
        <div className="relative z-10 my-6 text-center sm:text-left">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Running Total Seconds Lived
          </div>
          <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-1 font-mono">
            <span className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight">
              {liveSeconds.toLocaleString()}
            </span>
            <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-blue-400">
              .{String(liveMillis).padStart(3, '0')}
            </span>
            <span className="text-lg sm:text-2xl font-bold text-slate-400 ml-1">
              seconds
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Every second represents 1,000 milliseconds of life experience since {birthDateFormatted}
            {birthTime ? ` at ${String(birthTime.hours).padStart(2, '0')}:${String(birthTime.minutes).padStart(2, '0')}` : ''}.
          </p>
        </div>

        {/* Solar Progress Bar */}
        <div className="relative z-10 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Solar Year Progress (Age {years} → {ageTurningNext})</span>
            </span>
            <span className="font-mono text-amber-400 font-bold">
              {lifeStats.sunOrbitProgressPercent}% Completed
            </span>
          </div>

          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400 transition-all duration-300 shadow-xs"
              style={{ width: `${lifeStats.sunOrbitProgressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
            <span>Turned {years} on last birthday</span>
            <span>Turning {ageTurningNext} in <strong>{daysUntilNextBirthday} days</strong></span>
          </div>
        </div>
      </div>

      {/* Interactive Tabs: Biology vs Planetary Exploration */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Interactive Life Stats & Planetary Ages
            </h3>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab('biology')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'biology'
                  ? 'bg-white text-blue-700 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Biological Milestones
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('space')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'space'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Cosmic & Planetary Ages
            </button>
          </div>
        </div>

        {activeTab === 'biology' ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 animate-in fade-in duration-200">
            {/* Heartbeats */}
            <div className="p-4 bg-rose-50/60 border border-rose-100 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-rose-700">
                <span className="text-xs font-bold uppercase tracking-wider">Heartbeats</span>
                <Heart className="w-4 h-4 text-rose-500 animate-bounce" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-rose-950 font-mono">
                ~{lifeStats.estimatedHeartbeats.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">Approx. 80 beats per minute</div>
            </div>

            {/* Breaths */}
            <div className="p-4 bg-sky-50/60 border border-sky-100 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-sky-700">
                <span className="text-xs font-bold uppercase tracking-wider">Breaths Taken</span>
                <Wind className="w-4 h-4 text-sky-500" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-sky-950 font-mono">
                ~{lifeStats.estimatedBreaths.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">Approx. 16 breaths per min</div>
            </div>

            {/* Blinks */}
            <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-amber-800">
                <span className="text-xs font-bold uppercase tracking-wider">Eye Blinks</span>
                <Eye className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-amber-950 font-mono">
                ~{lifeStats.estimatedBlinks.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">Approx. 17 blinks per min</div>
            </div>

            {/* Sleep */}
            <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-purple-700">
                <span className="text-xs font-bold uppercase tracking-wider">Time Asleep</span>
                <Moon className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-purple-950 font-mono">
                ~{lifeStats.estimatedDaysSlept.toLocaleString()} Days
              </div>
              <div className="text-[11px] text-slate-500">~{lifeStats.estimatedHoursSlept.toLocaleString()} hours (1/3 of life)</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 animate-in fade-in duration-200">
            {/* Mercury */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-xs font-bold uppercase tracking-wider">Mercury</span>
                <Globe2 className="w-4 h-4 text-slate-500" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono">
                {lifeStats.ageOnMercury} Years
              </div>
              <div className="text-[11px] text-slate-500">88 Earth days per solar year</div>
            </div>

            {/* Venus */}
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-amber-800">
                <span className="text-xs font-bold uppercase tracking-wider">Venus</span>
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-amber-950 font-mono">
                {lifeStats.ageOnVenus} Years
              </div>
              <div className="text-[11px] text-slate-500">224.7 Earth days per year</div>
            </div>

            {/* Mars */}
            <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-rose-700">
                <span className="text-xs font-bold uppercase tracking-wider">Mars</span>
                <Globe2 className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-rose-950 font-mono">
                {lifeStats.ageOnMars} Years
              </div>
              <div className="text-[11px] text-slate-500">687 Earth days per year</div>
            </div>

            {/* Jupiter */}
            <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-indigo-700">
                <span className="text-xs font-bold uppercase tracking-wider">Jupiter</span>
                <Globe2 className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-indigo-950 font-mono">
                {lifeStats.ageOnJupiter} Years
              </div>
              <div className="text-[11px] text-slate-500">11.86 Earth years per orbit</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
