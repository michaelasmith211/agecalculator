'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Clock, Sparkles, AlertCircle } from 'lucide-react';
import {
  calculateDaysBetweenDates,
  getTodayCalendarDate,
  parseDateString,
  toDateString
} from '@/lib/date-utils';
import { trackEvent } from '@/lib/analytics';
import { detectLocale } from '@/i18n/locale-utils';
import { getTranslations } from '@/i18n/getTranslations';
import { formatDateShort, formatNumber } from '@/lib/format-utils';

interface DateDifferenceDetails {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  totalMinutes: number;
  startFormatted: string;
  endFormatted: string;
}

interface DateDifferenceCalculatorProps {
  locale?: string;
}

export default function DateDifferenceCalculator({ locale: propLocale }: DateDifferenceCalculatorProps) {
  const pathname = usePathname() || '/';
  const locale = propLocale || detectLocale(pathname);
  const { t, raw } = getTranslations(locale);
  const c = raw.calculators?.dateDifference;

  const today = getTodayCalendarDate();
  const todayStr = toDateString(today);

  const [startDateStr, setStartDateStr] = useState('2020-03-15');
  const [endDateStr, setEndDateStr] = useState(todayStr);

  const compute = (s: string, e: string) => {
    const start = parseDateString(s);
    const end = parseDateString(e);
    if (!start || !end) {
      return { res: null, err: c?.errorInvalid || t('errors.invalidDate', 'Please select valid start and end dates.') };
    }
    try {
      const daysRes = calculateDaysBetweenDates(start, end, false);
      const startCal = daysRes.isEndBeforeStart ? end : start;
      const endCal = daysRes.isEndBeforeStart ? start : end;
      const startFormatted = formatDateShort(new Date(startCal.year, startCal.month - 1, startCal.day), locale);
      const endFormatted = formatDateShort(new Date(endCal.year, endCal.month - 1, endCal.day), locale);

      const details: DateDifferenceDetails = {
        years: daysRes.years,
        months: daysRes.months,
        days: daysRes.days,
        totalDays: daysRes.totalDays,
        totalWeeks: daysRes.totalWeeks,
        totalHours: daysRes.totalHours,
        totalMinutes: daysRes.totalHours * 60,
        startFormatted,
        endFormatted
      };
      return { res: details, err: null };
    } catch (err: unknown) {
      return { res: null, err: err instanceof Error ? err.message : t('errors.invalidDate', 'Calculation error') };
    }
  };

  const initial = compute('2020-03-15', todayStr);
  const [details, setDetails] = useState<DateDifferenceDetails | null>(initial.res);
  const [error, setError] = useState<string | null>(initial.err);

  const handleCalculate = (s: string, e: string) => {
    const data = compute(s, e);
    setDetails(data.res);
    setError(data.err);
    if (data.res) {
      trackEvent('date_difference_calculated', { total_days: data.res.totalDays });
    }
  };

  const calcTitle = c?.title || raw.tools?.['date-difference-calculator']?.title || 'Date Difference Calculator';
  const calcDesc = c?.desc || raw.tools?.['date-difference-calculator']?.desc || 'Find the exact duration between any two dates.';

  return (
    <div className="calculator-card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-800 flex items-center justify-center">
          <Clock className="w-5 h-5" />
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
          <label htmlFor="d1" className="block text-sm font-bold text-slate-800 mb-1">
            {c?.startDate || 'Start Date'}
          </label>
          <input
            id="d1"
            type="date"
            value={startDateStr}
            onChange={(e) => {
              setStartDateStr(e.target.value);
              if (e.target.value && endDateStr) handleCalculate(e.target.value, endDateStr);
            }}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
          />
        </div>

        <div>
          <label htmlFor="d2" className="block text-sm font-bold text-slate-800 mb-1">
            {c?.endDate || 'End Date'}
          </label>
          <input
            id="d2"
            type="date"
            value={endDateStr}
            onChange={(e) => {
              setEndDateStr(e.target.value);
              if (startDateStr && e.target.value) handleCalculate(startDateStr, e.target.value);
            }}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
          />
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={() => handleCalculate(startDateStr, endDateStr)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-violet-600 text-white hover:bg-violet-700 shadow-sm transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>{c?.btnCalculate || 'Calculate Difference'}</span>
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {details && (
        <div className="mt-8 space-y-6">
          <div className="p-6 bg-violet-50/70 border border-violet-200 rounded-2xl">
            <div className="text-xs font-bold text-violet-800 uppercase tracking-wider">
              {c?.resultTitle || 'Exact Calendar Duration'}
            </div>
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-violet-950">
                  {formatNumber(details.years, locale)}
                </span>
                <span className="text-base font-bold text-violet-800">{t('calculator.years', 'Years')}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-violet-950">
                  {formatNumber(details.months, locale)}
                </span>
                <span className="text-base font-bold text-violet-800">{t('calculator.months', 'Months')}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-violet-950">
                  {formatNumber(details.days, locale)}
                </span>
                <span className="text-base font-bold text-violet-800">{t('calculator.days', 'Days')}</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-600">
              {details.startFormatted} ➔ {details.endFormatted}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 uppercase">{c?.totalDays || 'Total Days'}</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{formatNumber(details.totalDays, locale)}</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 uppercase">{c?.totalWeeks || 'Total Weeks'}</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{formatNumber(details.totalWeeks, locale)}</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 uppercase">{c?.totalHours || 'Total Hours'}</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{formatNumber(details.totalHours, locale)}</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl min-w-0">
              <div className="text-xs font-semibold text-slate-500 uppercase">{c?.totalMinutes || 'Total Minutes'}</div>
              <div className="text-[clamp(14px,3.5vw,1.25rem)] font-bold text-slate-900 mt-1 whitespace-nowrap overflow-x-auto scrollbar-none">{formatNumber(details.totalMinutes, locale)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
