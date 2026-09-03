'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import {
  Calendar,
  Clock,
  RotateCcw,
  Sparkles,
  Cake,
  CalendarDays,
  Copy,
  Check,
  AlertCircle,
  Printer,
  BookmarkCheck,
  Trash2
} from 'lucide-react';
import {
  AgeResult,
  calculateAge,
  getTodayCalendarDate,
  getCurrentSystemTime,
  parseDateString,
  parseTimeString,
  toDateString,
  formatDisplayDate,
  CalendarTime
} from '@/lib/date-utils';
import {
  saveUserBirthday,
  getSavedUserBirthday,
  clearSavedUserBirthday,
  SavedBirthdayData
} from '@/lib/cookie-utils';
import { trackEvent } from '@/lib/analytics';
import SocialShare from '@/components/SocialShare';
import LiveAgeTicker from '@/components/calculators/LiveAgeTicker';
import ShareAgeCard from '@/components/ShareAgeCard';

interface MainAgeCalculatorProps {
  initialBirthDate?: string;
  initialTargetDate?: string;
}

const emptySubscribe = () => () => {};

export default function MainAgeCalculator({
  initialBirthDate = '2000-01-15',
  initialTargetDate
}: MainAgeCalculatorProps) {
  const today = getTodayCalendarDate();
  const todayStr = toDateString(today);

  // Client-safe detection of saved cookie birthday for reactive UI
  const savedCookieJson = useSyncExternalStore(
    emptySubscribe,
    () => {
      const saved = getSavedUserBirthday();
      return saved ? JSON.stringify(saved) : '';
    },
    () => ''
  );

  const savedData: SavedBirthdayData | null = savedCookieJson ? JSON.parse(savedCookieJson) : null;

  const [birthDateStr, setBirthDateStr] = useState<string>(initialBirthDate);
  const [targetDateStr, setTargetDateStr] = useState<string>(initialTargetDate || todayStr);
  const [isCustomTarget, setIsCustomTarget] = useState<boolean>(!!initialTargetDate && initialTargetDate !== todayStr);

  // Optional birth time support
  const [includeTime, setIncludeTime] = useState<boolean>(false);
  const [birthTimeStr, setBirthTimeStr] = useState<string>('08:30');
  const [targetTimeStr, setTargetTimeStr] = useState<string>('12:00');

  const [isAutoLoaded, setIsAutoLoaded] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Synchronous calculation initialization
  const [result, setResult] = useState<AgeResult | null>(() => {
    const b = parseDateString(initialBirthDate);
    const t = parseDateString(initialTargetDate || todayStr);
    if (b && t) {
      try {
        return calculateAge(b, t);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [error, setError] = useState<string | null>(null);

  // Automatically load last entered birthday from cookie on client mount
  useEffect(() => {
    const saved = getSavedUserBirthday();
    if (saved && saved.dob) {
      const timer = setTimeout(() => {
        setBirthDateStr(saved.dob);
        if (saved.tob) {
          setBirthTimeStr(saved.tob);
        }
        const withTime = !!saved.includeTime;
        setIncludeTime(withTime);
        setIsAutoLoaded(true);

        const bDate = parseDateString(saved.dob);
        const tDate = parseDateString(todayStr);
        if (bDate && tDate) {
          const bTime = withTime && saved.tob ? parseTimeString(saved.tob) || undefined : undefined;
          const tTime = withTime ? getCurrentSystemTime() : undefined;
          try {
            const res = calculateAge(bDate, tDate, bTime, tTime);
            setResult(res);
          } catch {
            // Ignore
          }
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [todayStr]);

  const performCalculation = (
    bStr: string,
    tStr: string,
    useTime = includeTime,
    bTimeStr = birthTimeStr,
    tTimeStr = targetTimeStr
  ) => {
    setError(null);
    if (!bStr) {
      setError('Please select or enter your Date of Birth.');
      setResult(null);
      return;
    }

    const bDate = parseDateString(bStr);
    if (!bDate) {
      setError('Invalid Date of Birth. Please enter a valid calendar date.');
      setResult(null);
      return;
    }

    const tDate = parseDateString(tStr);
    if (!tDate) {
      setError('Invalid Target Date.');
      setResult(null);
      return;
    }

    let bTime: CalendarTime | undefined = undefined;
    let tTime: CalendarTime | undefined = undefined;

    if (useTime) {
      bTime = parseTimeString(bTimeStr) || { hours: 0, minutes: 0, seconds: 0 };
      if (!isCustomTarget) {
        tTime = getCurrentSystemTime();
      } else {
        tTime = parseTimeString(tTimeStr) || { hours: 12, minutes: 0, seconds: 0 };
      }
    }

    try {
      const res = calculateAge(bDate, tDate, bTime, tTime);
      setResult(res);

      // Auto-save entered birthday and time to browser cookie for next visits
      saveUserBirthday(bStr, useTime ? bTimeStr : undefined, useTime);
      setIsAutoLoaded(true);

      trackEvent('age_calculator_used', {
        birth_year: bDate.year,
        calculated_age_years: res.years,
        used_time: useTime
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred during calculation.';
      setError(message);
      setResult(null);
    }
  };

  const handleReset = () => {
    setBirthDateStr('');
    setTargetDateStr(todayStr);
    setIsCustomTarget(false);
    setIncludeTime(false);
    setBirthTimeStr('08:30');
    setTargetTimeStr('12:00');
    setResult(null);
    setError(null);
    clearSavedUserBirthday();
    setIsAutoLoaded(false);
    trackEvent('reset_calculator');
  };

  const handleClearSavedCookie = () => {
    clearSavedUserBirthday();
    setIsAutoLoaded(false);
  };

  const handleCopyResult = () => {
    if (!result) return;
    const timeSuffix = result.birthTimeFormatted ? ` (born at ${result.birthTimeFormatted})` : '';
    const text = `Age: ${result.years} Years, ${result.months} Months, ${result.days} Days${timeSuffix} (${result.totalDays.toLocaleString()} total days lived). Calculated on agecalculators.dev`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const parsedBirthDate = parseDateString(birthDateStr);
  const parsedBirthTime = includeTime ? parseTimeString(birthTimeStr) || undefined : undefined;
  const parsedTargetDate = parseDateString(targetDateStr) || today;
  const isTodayTarget = !isCustomTarget || targetDateStr === todayStr;

  return (
    <div id="calculator" className="calculator-card p-4 sm:p-6 md:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Instant Calendar & Time Precision Calculation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Online Age Calculator
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Enter your date of birth (and optional birth time) to calculate your exact age in years, months, days, and live running seconds.
          </p>
        </div>

        {result && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyResult}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Copy result summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Print result"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>
          </div>
        )}
      </div>

      {/* Auto-Loaded Saved Birthday Notice */}
      {isAutoLoaded && savedData && savedData.dob && (
        <div className="mt-4 p-2.5 px-3.5 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Auto-Loaded:</strong> Showing your saved birthday (<strong>{savedData.dob}</strong>{savedData.tob ? ` at ${savedData.tob}` : ''}).
            </span>
          </div>

          <button
            type="button"
            onClick={handleClearSavedCookie}
            className="text-emerald-700 hover:text-emerald-900 font-semibold underline flex items-center gap-1 px-1.5 py-0.5 cursor-pointer shrink-0"
            title="Forget saved birthday on this browser"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          performCalculation(birthDateStr, targetDateStr);
        }}
        className="mt-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date of Birth Input */}
          <div className="space-y-2">
            <label htmlFor="dob-input" className="block text-sm font-bold text-slate-800">
              Date of Birth <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="dob-input"
                type="date"
                required
                value={birthDateStr}
                max={targetDateStr || todayStr}
                onChange={(e) => {
                  setBirthDateStr(e.target.value);
                  if (e.target.value) {
                    performCalculation(e.target.value, targetDateStr);
                  }
                }}
                className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-300 focus:border-blue-600 rounded-xl text-slate-900 font-medium text-base shadow-2xs transition-all"
                aria-describedby="dob-helper"
              />
            </div>
            <p id="dob-helper" className="text-xs text-slate-500">
              Select your birth day, month, and year (DD / MM / YYYY). Automatically saved in your browser cookies.
            </p>
          </div>

          {/* Age As Of Date Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="target-input" className="block text-sm font-bold text-slate-800">
                Age As Of Date
              </label>
              <button
                type="button"
                onClick={() => {
                  const nextCustom = !isCustomTarget;
                  setIsCustomTarget(nextCustom);
                  if (!nextCustom) {
                    setTargetDateStr(todayStr);
                    performCalculation(birthDateStr, todayStr);
                  }
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
              >
                {isCustomTarget ? 'Use Today' : 'Change Date'}
              </button>
            </div>
            <div className="relative">
              <input
                id="target-input"
                type="date"
                value={targetDateStr}
                disabled={!isCustomTarget}
                onChange={(e) => {
                  setTargetDateStr(e.target.value);
                  if (birthDateStr && e.target.value) {
                    performCalculation(birthDateStr, e.target.value);
                  }
                }}
                className={`w-full px-4 py-3 border rounded-xl font-medium text-base shadow-2xs transition-all ${
                  isCustomTarget
                    ? 'bg-slate-50 hover:bg-slate-100/70 focus:bg-white border-slate-300 focus:border-blue-600 text-slate-900'
                    : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                }`}
              />
            </div>
            <p className="text-xs text-slate-500">
              {isCustomTarget
                ? 'Calculate how old you were or will be on this specific date.'
                : 'Default is synchronized to your current local system date.'}
            </p>
          </div>
        </div>

        {/* Optional Exact Birth Time Toggle */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="time-toggle" className="flex items-center gap-2 cursor-pointer select-none">
              <input
                id="time-toggle"
                type="checkbox"
                checked={includeTime}
                onChange={(e) => {
                  setIncludeTime(e.target.checked);
                  performCalculation(birthDateStr, targetDateStr, e.target.checked);
                }}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Include Exact Birth Time (Optional)</span>
              </span>
            </label>
            <span className="text-[11px] text-slate-500">For down-to-the-minute precision</span>
          </div>

          {includeTime && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/80 animate-in fade-in duration-150">
              <div>
                <label htmlFor="birth-time" className="block text-xs font-semibold text-slate-700 mb-1">
                  Time of Birth (Local Time)
                </label>
                <input
                  id="birth-time"
                  type="time"
                  value={birthTimeStr}
                  onChange={(e) => {
                    setBirthTimeStr(e.target.value);
                    performCalculation(birthDateStr, targetDateStr, true, e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 focus:border-blue-600 rounded-lg text-slate-900 font-medium text-sm"
                />
              </div>

              {isCustomTarget && (
                <div>
                  <label htmlFor="target-time" className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Time
                  </label>
                  <input
                    id="target-time"
                    type="time"
                    value={targetTimeStr}
                    onChange={(e) => {
                      setTargetTimeStr(e.target.value);
                      performCalculation(birthDateStr, targetDateStr, true, birthTimeStr, e.target.value);
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 focus:border-blue-600 rounded-lg text-slate-900 font-medium text-sm"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-base font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow transition-all focus:ring-4 focus:ring-blue-100 cursor-pointer"
          >
            <Calendar className="w-5 h-5" />
            <span>Calculate Age</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      {/* Results Section */}
      {result && parsedBirthDate && (
        <div className="mt-8 space-y-6 animate-in fade-in duration-200">
          {/* Primary Result Banner */}
          <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200 rounded-2xl overflow-hidden">
            <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
              Your Exact Age
            </div>
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight font-mono">
                  {result.years}
                </span>
                <span className="text-sm sm:text-base font-bold text-blue-700">Years</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight font-mono">
                  {result.months}
                </span>
                <span className="text-sm sm:text-base font-bold text-blue-700">Months</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight font-mono">
                  {result.days}
                </span>
                <span className="text-sm sm:text-base font-bold text-blue-700">Days</span>
              </div>
            </div>

            <div className="mt-3 text-xs sm:text-sm text-slate-700 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>
                Born: <strong>{result.birthDateFormatted}</strong>
                {result.birthTimeFormatted ? ` at ${result.birthTimeFormatted}` : ''} ({result.dayOfWeekBorn})
              </span>
              <span>•</span>
              <span>
                Calculated on: <strong>{result.targetDateFormatted}</strong>
                {result.targetTimeFormatted ? ` at ${result.targetTimeFormatted}` : ''}
              </span>
            </div>
          </div>

          {/* LIVE MILLISECONDS ODOMETER & INTERACTIVE STATS */}
          <LiveAgeTicker
            birthDate={parsedBirthDate}
            birthTime={parsedBirthTime}
            targetDate={parsedTargetDate}
            isTodayTarget={isTodayTarget}
            years={result.years}
            months={result.months}
            days={result.days}
            daysUntilNextBirthday={result.daysUntilNextBirthday}
            ageTurningNext={result.ageTurningNext}
            birthDateFormatted={result.birthDateFormatted}
          />

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Next Birthday Card */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Next Birthday</span>
                <Cake className="w-4 h-4 text-pink-500" />
              </div>
              <div className="text-lg font-bold text-slate-900">
                {result.isBirthdayToday ? (
                  <span className="text-pink-600 font-extrabold flex items-center gap-1">
                    🎉 Happy Birthday Today!
                  </span>
                ) : (
                  formatDisplayDate(result.nextBirthdayDate)
                )}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                {result.isBirthdayToday ? (
                  <span>Turning {result.years} years old today!</span>
                ) : (
                  <span>
                    <strong>{result.daysUntilNextBirthday} days</strong> remaining (Turning {result.ageTurningNext} on {result.nextBirthdayDayOfWeek})
                  </span>
                )}
              </div>
            </div>

            {/* Total Days Card */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Days Lived</span>
                <CalendarDays className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-xl font-extrabold text-slate-900 font-mono">
                {result.totalDays.toLocaleString()} Days
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Exact calendar days lived
              </div>
            </div>

            {/* Total Weeks Card */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Weeks</span>
                <Clock className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-xl font-extrabold text-slate-900 font-mono">
                {result.totalWeeks.toLocaleString()} Weeks
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Plus {result.remainingDaysInWeek} day{result.remainingDaysInWeek === 1 ? '' : 's'}
              </div>
            </div>
          </div>

          {/* Time Breakdown Details Table */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Comprehensive Time Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                <div className="text-xs text-slate-500 font-medium">Total Months</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">
                  {result.years * 12 + result.months}
                  <span className="text-xs text-slate-500 font-normal ml-1">
                    (+{result.days}d)
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">Exact calendar months</div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                <div className="text-xs text-slate-500 font-medium">Total Hours</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5 font-mono">
                  {result.totalHours.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400">Total elapsed hours</div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                <div className="text-xs text-slate-500 font-medium">Total Minutes</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5 font-mono">
                  {result.totalMinutes.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400">Total elapsed minutes</div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200/80 min-w-0">
                <div className="text-xs text-slate-500 font-medium">Total Seconds</div>
                <div className="text-[clamp(13px,3.5vw,1.125rem)] font-bold text-slate-900 mt-0.5 font-mono whitespace-nowrap overflow-x-auto scrollbar-none">
                  {result.totalSeconds.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400">Total elapsed seconds</div>
              </div>
            </div>

            {/* Astrology / Fun facts */}
            <div className="mt-4 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div>
                Western Zodiac: <strong className="text-slate-800 font-semibold">{result.zodiacSign}</strong>
              </div>
              <div>
                Chinese Zodiac: <strong className="text-slate-800 font-semibold">{result.chineseZodiac}</strong>
              </div>
              <div>
                Day of Birth: <strong className="text-slate-800 font-semibold">{result.dayOfWeekBorn}</strong>
              </div>
            </div>
          </div>

          {/* Personalized Social Infographic Card */}
          <ShareAgeCard
            years={result.years}
            months={result.months}
            days={result.days}
            totalDays={result.totalDays}
            totalSeconds={result.totalSeconds}
            birthDate={parsedBirthDate}
            birthDateFormatted={result.birthDateFormatted}
            dayOfWeekBorn={result.dayOfWeekBorn}
            daysUntilNextBirthday={result.daysUntilNextBirthday}
            ageTurningNext={result.ageTurningNext}
            zodiacSign={result.zodiacSign}
          />

          {/* Social Share Box */}
          <SocialShare
            title="Age Calculator Result"
            resultText={`I am ${result.years} Years, ${result.months} Months, and ${result.days} Days old (${result.totalDays.toLocaleString()} total days lived)!`}
          />
        </div>
      )}
    </div>
  );
}
