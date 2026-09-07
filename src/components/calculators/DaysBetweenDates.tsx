'use client';

import React, { useState } from 'react';
import { CalendarRange, CheckSquare, Square, AlertCircle } from 'lucide-react';
import {
  calculateDaysBetweenDates,
  getTodayCalendarDate,
  parseDateString,
  toDateString,
  DateDifferenceResult
} from '@/lib/date-utils';
import { trackEvent } from '@/lib/analytics';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function DaysBetweenDates() {
  const { t } = useLanguage();
  const today = getTodayCalendarDate();
  const todayStr = toDateString(today);

  const [startDateStr, setStartDateStr] = useState('2026-01-01');
  const [endDateStr, setEndDateStr] = useState(todayStr);
  const [inclusive, setInclusive] = useState(false);

  const compute = (s: string, e: string, inc: boolean) => {
    const start = parseDateString(s);
    const end = parseDateString(e);
    if (!start || !end) return { res: null, err: 'Please provide valid start and end dates.' };
    try {
      return { res: calculateDaysBetweenDates(start, end, inc), err: null };
    } catch (err: unknown) {
      return { res: null, err: err instanceof Error ? err.message : 'Calculation error' };
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

  return (
    <div className="calculator-card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
          <CalendarRange className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t('daysBetweenTitle', 'Days Between Dates Calculator')}
          </h2>
          <p className="text-sm text-slate-600">
            {t('daysBetweenSubtitle', 'Count the exact number of calendar days, business days, and weekend days between any two dates.')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div>
          <label htmlFor="start-date" className="block text-sm font-bold text-slate-800 mb-1">
            {t('startDate', 'From Date (Start)')}
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
            {t('endDate', 'To Date (End)')}
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

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            const nextInc = !inclusive;
            setInclusive(nextInc);
            if (startDateStr && endDateStr) handleCalculate(startDateStr, endDateStr, nextInc);
          }}
          className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
        >
          {inclusive ? <CheckSquare className="w-4 h-4 text-teal-600" /> : <Square className="w-4 h-4 text-slate-400" />}
          <span>{t('includeEndDay', 'Include End Date in Count (+1 day)')}</span>
        </button>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={() => handleCalculate(startDateStr, endDateStr, inclusive)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition-all cursor-pointer"
        >
          <CalendarRange className="w-4 h-4" />
          <span>{t('calcDaysBtn', 'Calculate Days')}</span>
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
          <div className="p-6 bg-teal-50/70 border border-teal-200 rounded-2xl text-center sm:text-left">
            <div className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-1">
              {t('calendarDays', 'Calendar Days')}
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-teal-950">
              {result.totalDays.toLocaleString()} {t('days', 'Days')}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 uppercase">{t('totalWeeks', 'Total Weeks')}</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{result.totalWeeks.toLocaleString()} {t('weeks', 'Weeks')}</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 uppercase">{t('weekdaysCount', 'Business Days (Mon–Fri)')}</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{result.businessDays.toLocaleString()} {t('days', 'Days')}</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 uppercase">{t('weekendDaysCount', 'Weekend Days (Sat–Sun)')}</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{result.weekendDays.toLocaleString()} {t('days', 'Days')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
