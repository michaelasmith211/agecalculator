'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { CalendarRange, CheckSquare, Square, AlertCircle, Briefcase, Sun, Sparkles } from 'lucide-react';
import {
  calculateDaysBetweenDates,
  getTodayCalendarDate,
  parseDateString,
  toDateString,
  DateDifferenceResult
} from '@/lib/date-utils';
import { trackEvent } from '@/lib/analytics';
import { detectLocale } from '@/i18n/locale-utils';
import { getTranslations } from '@/i18n/getTranslations';
import { formatNumber } from '@/lib/format-utils';

interface DaysBetweenDatesProps {
  locale?: string;
}

export default function DaysBetweenDates({ locale: propLocale }: DaysBetweenDatesProps) {
  const pathname = usePathname() || '/';
  const locale = propLocale || detectLocale(pathname);
  const { t, raw } = getTranslations(locale);
  const c = raw.calculators?.daysBetween;

  const today = getTodayCalendarDate();
  const todayStr = toDateString(today);

  const [startDateStr, setStartDateStr] = useState('2026-01-01');
  const [endDateStr, setEndDateStr] = useState(todayStr);
  const [inclusive, setInclusive] = useState(false);

  const compute = (s: string, e: string, inc: boolean) => {
    const start = parseDateString(s);
    const end = parseDateString(e);
    if (!start || !end) return { res: null, err: t('errors.invalidDate', 'Please provide valid start and end dates.') };
    try {
      return { res: calculateDaysBetweenDates(start, end, inc), err: null };
    } catch (err: unknown) {
      return { res: null, err: err instanceof Error ? err.message : t('errors.invalidDate', 'Calculation error') };
    }
  };

  const initial = compute('2026-01-01', todayStr, false);
  const [result, setResult] = useState<DateDifferenceResult | null>(initial.res);
  const [error, setError] = useState<string | null>(initial.err);

  const handleCalculate = (s: string, e: string, inc: boolean) => {
    const data = compute(s, e, inc);
    setResult(data.res);
    setError(data.err);
    if (data.res) {
      trackEvent('days_between_calculated', { total_days: data.res.totalDays });
    }
  };

  const calcTitle = c?.title || raw.tools?.['days-between-dates']?.title || 'Days Between Dates Calculator';
  const calcDesc = c?.desc || raw.tools?.['days-between-dates']?.desc || 'Count the exact number of days, weeks, business days, and weekends between two dates.';

  return (
    <div className="calculator-card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
          <CalendarRange className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {calcTitle}
          </h2>
          <p className="text-sm text-slate-600">
            {calcDesc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div>
          <label htmlFor="start-date" className="block text-sm font-bold text-slate-800 mb-1">
            {c?.startDate || 'Start Date'}
          </label>
          <input
            id="start-date"
            type="date"
            value={startDateStr}
            onChange={(e) => {
              setStartDateStr(e.target.value);
              if (e.target.value && endDateStr) handleCalculate(e.target.value, endDateStr, inclusive);
            }}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
          />
        </div>

        <div>
          <label htmlFor="end-date" className="block text-sm font-bold text-slate-800 mb-1">
            {c?.endDate || 'End Date'}
          </label>
          <input
            id="end-date"
            type="date"
            value={endDateStr}
            onChange={(e) => {
              setEndDateStr(e.target.value);
              if (startDateStr && e.target.value) handleCalculate(startDateStr, e.target.value, inclusive);
            }}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
          />
        </div>
      </div>

      {/* Inclusive Toggle */}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            const next = !inclusive;
            setInclusive(next);
            handleCalculate(startDateStr, endDateStr, next);
          }}
          className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
        >
          {inclusive ? (
            <CheckSquare className="w-5 h-5 text-teal-600" />
          ) : (
            <Square className="w-5 h-5 text-slate-400" />
          )}
          <span>{c?.includeEndDay || 'Include end date in calculation (add 1 day)'}</span>
        </button>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => handleCalculate(startDateStr, endDateStr, inclusive)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>{c?.btnCalculate || 'Calculate Days'}</span>
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          <div className="p-6 bg-teal-50/70 border border-teal-200 rounded-2xl">
            <div className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              {c?.totalDays || 'Total Duration'}
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-teal-950 mt-1">
              {formatNumber(result.totalDays, locale)} {t('calculator.days', 'Days')}
            </div>
            <div className="text-sm font-semibold text-teal-800 mt-2">
              {formatNumber(result.totalWeeks, locale)} {t('calculator.weeks', 'Weeks')} + {formatNumber(result.remainingDays, locale)} {t('calculator.days', 'Days')}
              {result.years > 0 || result.months > 0 ? ` (${formatNumber(result.years, locale)} ${t('calculator.years', 'Years')}, ${formatNumber(result.months, locale)} ${t('calculator.months', 'Months')})` : ''}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase">{c?.businessDays || 'Business Days (Mon-Fri)'}</div>
                <div className="text-xl font-bold text-slate-900">{formatNumber(result.businessDays, locale)} {t('calculator.days', 'Days')}</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase">{c?.weekendDays || 'Weekend Days'}</div>
                <div className="text-xl font-bold text-slate-900">{formatNumber(result.weekendDays, locale)} {t('calculator.days', 'Days')}</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
                <CalendarRange className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase">{c?.totalWeeks || 'Total Weeks'}</div>
                <div className="text-xl font-bold text-slate-900">{formatNumber(result.totalWeeks, locale)} {t('calculator.weeks', 'Weeks')}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
