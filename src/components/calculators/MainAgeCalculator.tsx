'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  Clock,
  RotateCcw,
  Cake,
  CalendarDays,
  Copy,
  Check,
  AlertCircle,
  Printer,
  BookmarkCheck,
  Trash2,
  Users,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import {
  AgeResult,
  calculateAge,
  getTodayCalendarDate,
  getCurrentSystemTime,
  parseDateString,
  parseTimeString,
  toDateString,
  formatDisplayDate
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
import { detectLocale } from '@/i18n/locale-utils';
import { getTranslations } from '@/i18n/getTranslations';
import { formatNumber } from '@/lib/format-utils';

interface MainAgeCalculatorProps {
  initialBirthDate?: string;
  initialTargetDate?: string;
  locale?: string;
}

const emptySubscribe = () => () => {};

export default function MainAgeCalculator({
  initialBirthDate = '2000-01-15',
  initialTargetDate,
  locale: propLocale
}: MainAgeCalculatorProps) {
  const pathname = usePathname() || '/';
  const locale = propLocale || detectLocale(pathname);
  const { t } = getTranslations(locale);

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
    const tDate = parseDateString(initialTargetDate || todayStr);
    if (b && tDate) {
      try {
        return calculateAge(b, tDate);
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
      setError(t('errors.requiredDate', 'Please select or enter your Date of Birth.'));
      setResult(null);
      return;
    }

    const bDate = parseDateString(bStr);
    if (!bDate) {
      setError(t('errors.invalidDate', 'Invalid Date of Birth. Please enter a valid calendar date.'));
      setResult(null);
      return;
    }

    const tDate = parseDateString(tStr);
    if (!tDate) {
      setError(t('errors.invalidDate', 'Invalid Target Date.'));
      setResult(null);
      return;
    }

    const bTime = useTime && bTimeStr ? parseTimeString(bTimeStr) || undefined : undefined;
    const tTime = useTime && tTimeStr ? parseTimeString(tTimeStr) || undefined : undefined;

    try {
      const calculated = calculateAge(bDate, tDate, bTime, tTime);
      setResult(calculated);
      saveUserBirthday(bStr, useTime ? bTimeStr : undefined, useTime);

      trackEvent('age_calculator_used', {
        birth_year: bDate.year,
        calculated_age_years: calculated.years,
        used_time: useTime
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      setError(msg || t('errors.futureDate', 'Birth date cannot be in the future of target date.'));
      setResult(null);
    }
  };

  const handleReset = () => {
    setBirthDateStr('');
    setTargetDateStr(todayStr);
    setIsCustomTarget(false);
    setIncludeTime(false);
    setBirthTimeStr('08:30');
    setResult(null);
    setError(null);
    setIsAutoLoaded(false);
  };

  const handleClearSaved = () => {
    clearSavedUserBirthday();
    setIsAutoLoaded(false);
  };

  const handleCopySummary = async () => {
    if (!result) return;
    const summary = `${t('calculator.yourExactAge', 'Your Exact Age')}: ${result.years} ${t('calculator.years', 'Years')}, ${result.months} ${t('calculator.months', 'Months')}, ${result.days} ${t('calculator.days', 'Days')}. (${formatNumber(result.totalDays, locale)} ${t('calculator.totalDaysLived', 'Total Days Lived')})`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const parsedBirthDate = parseDateString(birthDateStr);
  const parsedTargetDate = parseDateString(targetDateStr) || today;
  const isTodayTarget = targetDateStr === todayStr;
  const parsedBirthTime = includeTime ? parseTimeString(birthTimeStr) || undefined : undefined;

  const getLocalizedLink = (href: string) => {
    const clean = href.replace(/^\/+|\/+$/g, '');
    if (locale === 'en') {
      return clean ? `/${clean}/` : '/';
    }
    return clean ? `/${locale}/${clean}/` : `/${locale}/`;
  };

  return (
    <div id="calculator" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
      {/* Cookie Auto-Saved Notification */}
      {isAutoLoaded && savedData && (
        <div className="mb-6 p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Restored your saved birth date: <strong>{savedData.dob}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handleClearSaved}
            className="text-blue-700 hover:text-blue-900 font-semibold underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('calculator.clear', 'Clear')}</span>
          </button>
        </div>
      )}

      {/* Form Inputs */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          performCalculation(birthDateStr, targetDateStr);
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date of Birth Input */}
          <div className="space-y-2">
            <label htmlFor="dob-input" className="block text-sm font-bold text-slate-800">
              {t('calculator.dobLabel', 'Date of Birth')} <span className="text-rose-500">*</span>
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
            <p id="dob-helper" className="text-xs text-slate-600 font-medium">
              {t('calculator.dobHelper', 'Select your birth day, month, and year (DD / MM / YYYY).')}
            </p>
          </div>

          {/* Age As Of Date Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="target-input" className="block text-sm font-bold text-slate-800">
                {t('calculator.targetDateLabel', 'Age As Of Date')}
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
                {isCustomTarget ? t('calculator.useToday', 'Use Today') : t('calculator.changeDate', 'Change Date')}
              </button>
            </div>
            <div className="relative">
              <input
                id="target-input"
                type="date"
                value={targetDateStr}
                suppressHydrationWarning
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
                    : 'bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed'
                }`}
              />
            </div>
            <p className="text-xs text-slate-600 font-medium">
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
                <span>{t('calculator.includeTime', 'Include Exact Birth Time (Optional)')}</span>
              </span>
            </label>
            <span className="text-[11px] text-slate-600 font-medium">
              {t('calculator.includeTimeHelper', 'For down-to-the-minute precision')}
            </span>
          </div>

          {includeTime && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/80 animate-in fade-in duration-150">
              <div>
                <label htmlFor="birth-time" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('calculator.birthTimeLabel', 'Time of Birth (Local Time)')}
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
            <span>{t('calculator.calculate', 'Calculate Age')}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('calculator.reset', 'Reset')}</span>
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
          <h2 className="sr-only">
            {t('calculator.resultsTitle', 'Age Calculation Results and Real-Time Statistics')}
          </h2>

          {/* Primary Result Banner */}
          <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                {t('calculator.yourExactAge', 'Your Exact Age')}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? t('calculator.copied', 'Copied!') : t('calculator.copy', 'Copy')}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t('calculator.print', 'Print')}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mt-2" suppressHydrationWarning>
              <div className="flex items-baseline gap-1" suppressHydrationWarning>
                <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight font-mono" suppressHydrationWarning>
                  {formatNumber(result.years, locale)}
                </span>
                <span className="text-sm sm:text-base font-bold text-blue-700">
                  {t('calculator.years', 'Years')}
                </span>
              </div>
              <div className="flex items-baseline gap-1" suppressHydrationWarning>
                <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight font-mono" suppressHydrationWarning>
                  {formatNumber(result.months, locale)}
                </span>
                <span className="text-sm sm:text-base font-bold text-blue-700">
                  {t('calculator.months', 'Months')}
                </span>
              </div>
              <div className="flex items-baseline gap-1" suppressHydrationWarning>
                <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight font-mono" suppressHydrationWarning>
                  {formatNumber(result.days, locale)}
                </span>
                <span className="text-sm sm:text-base font-bold text-blue-700">
                  {t('calculator.days', 'Days')}
                </span>
              </div>
            </div>

            <div className="mt-3 text-xs sm:text-sm text-slate-700 flex flex-wrap items-center gap-x-3 gap-y-1" suppressHydrationWarning>
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
            locale={locale}
          />

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Next Birthday Card */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-slate-700 font-semibold mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {t('calculator.nextBirthday', 'Next Birthday')}
                </span>
                <Cake className="w-4 h-4 text-pink-500" />
              </div>
              <div className="text-lg font-bold text-slate-900">
                {result.isBirthdayToday ? (
                  <span className="text-pink-600 font-extrabold flex items-center gap-1">
                    {t('calculator.happyBirthday', '🎉 Happy Birthday Today!')}
                  </span>
                ) : (
                  formatDisplayDate(result.nextBirthdayDate)
                )}
              </div>
              <div className="text-xs text-slate-700 font-medium mt-1">
                {result.isBirthdayToday ? (
                  <span>Turning {result.years} years old today!</span>
                ) : (
                  <span>
                    <strong>{formatNumber(result.daysUntilNextBirthday, locale)} {t('calculator.daysRemaining', 'days remaining')}</strong> ({t('calculator.turning', 'Turning')} {result.ageTurningNext})
                  </span>
                )}
              </div>
            </div>

            {/* Total Days Card */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-slate-700 font-semibold mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {t('calculator.totalDaysLived', 'Total Days Lived')}
                </span>
                <CalendarDays className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-xl font-extrabold text-slate-900 font-mono">
                {formatNumber(result.totalDays, locale)} {t('calculator.days', 'Days')}
              </div>
              <div className="text-xs text-slate-700 font-medium mt-1">
                Exact calendar days lived
              </div>
            </div>

            {/* Total Weeks Card */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-slate-700 font-semibold mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {t('calculator.totalWeeks', 'Total Weeks')}
                </span>
                <Clock className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-xl font-extrabold text-slate-900 font-mono">
                {formatNumber(result.totalWeeks, locale)} Weeks
              </div>
              <div className="text-xs text-slate-700 font-medium mt-1">
                Plus {result.remainingDaysInWeek} days
              </div>
            </div>
          </div>

          {/* Time Breakdown Details Table */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              {t('calculator.timeBreakdown', 'Comprehensive Time Breakdown')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                <div className="text-xs text-slate-700 font-semibold">Total Months</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">
                  {formatNumber(result.years * 12 + result.months, locale)}
                  <span className="text-xs text-slate-600 font-medium ml-1">
                    (+{result.days}d)
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 font-medium">Exact calendar months</div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                <div className="text-xs text-slate-700 font-semibold">Total Hours</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5 font-mono">
                  {formatNumber(result.totalHours, locale)}
                </div>
                <div className="text-[11px] text-slate-600 font-medium">Total elapsed hours</div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                <div className="text-xs text-slate-700 font-semibold">Total Minutes</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5 font-mono">
                  {formatNumber(result.totalMinutes, locale)}
                </div>
                <div className="text-[11px] text-slate-600 font-medium">Total elapsed minutes</div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200/80 min-w-0">
                <div className="text-xs text-slate-700 font-semibold">
                  {t('calculator.seconds', 'Total Seconds')}
                </div>
                <div className="text-[clamp(13px,3.5vw,1.125rem)] font-bold text-slate-900 mt-0.5 font-mono whitespace-nowrap overflow-x-auto scrollbar-none">
                  {formatNumber(result.totalSeconds, locale)}
                </div>
                <div className="text-[11px] text-slate-600 font-medium">Total elapsed seconds</div>
              </div>
            </div>

            {/* Astrology / Fun facts */}
            <div className="mt-4 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div>
                {t('calculator.zodiacSign', 'Western Zodiac')}: <strong className="text-slate-800 font-semibold">{result.zodiacSign}</strong>
              </div>
              <div>
                {t('calculator.chineseZodiac', 'Chinese Zodiac')}: <strong className="text-slate-800 font-semibold">{result.chineseZodiac}</strong>
              </div>
              <div>
                {t('calculator.dayBorn', 'Day of Birth')}: <strong className="text-slate-800 font-semibold">{result.dayOfWeekBorn}</strong>
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
            resultText={`I am ${result.years} Years, ${result.months} Months, and ${result.days} Days old (${formatNumber(result.totalDays, locale)} total days lived)!`}
          />

          {/* Contextual Next Steps & Related Calculations */}
          <div className="mt-8 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Explore Next Steps & Related Calculations
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href={getLocalizedLink('/age-difference-calculator')}
                className="p-3.5 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      Age Difference Calculator
                    </div>
                    <div className="text-[11px] text-slate-500">Compare two birth dates</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href={getLocalizedLink('/date-difference-calculator')}
                className="p-3.5 bg-white border border-slate-200 hover:border-violet-300 rounded-xl flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                      Date Difference Calculator
                    </div>
                    <div className="text-[11px] text-slate-500">Days & hours between any 2 dates</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-600 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href={getLocalizedLink('/date-of-birth-calculator')}
                className="p-3.5 bg-white border border-slate-200 hover:border-amber-300 rounded-xl flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                      Date of Birth Calculator
                    </div>
                    <div className="text-[11px] text-slate-500">Find birth date from age</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href={getLocalizedLink('/how-to-calculate-age')}
                className="p-3.5 bg-white border border-slate-200 hover:border-blue-300 rounded-xl flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      How to Calculate Age
                    </div>
                    <div className="text-[11px] text-slate-500">Learn the math & leap rules</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
