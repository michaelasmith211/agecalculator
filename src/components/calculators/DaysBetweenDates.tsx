'use client';

import React, { useState } from 'react';
import { CalendarRange, CheckSquare, Square, AlertCircle, Briefcase, Sun } from 'lucide-react';
import {
  calculateDaysBetweenDates,
  getTodayCalendarDate,
  parseDateString,
  toDateString,
  DateDifferenceResult
} from '@/lib/date-utils';
import { trackEvent } from '@/lib/analytics';

export default function DaysBetweenDates() {
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
            Days Between Dates Calculator
          </h2>
          <p className="text-sm text-slate-600">
            Count the exact number of days, weeks, business days, and weekends between two dates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div>
          <label htmlFor="start-date" className="block text-sm font-bold text-slate-800 mb-1">
            Start Date
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
            End Date
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
          className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          {inclusive ? (
            <CheckSquare className="w-5 h-5 text-teal-600" />
          ) : (
            <Square className="w-5 h-5 text-slate-400" />
          )}
          <span>Include end date in calculation (add 1 day)</span>
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
              Total Duration
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold text-teal-950 mt-1">
              {result.totalDays.toLocaleString()} Days
            </div>
            <div className="text-sm font-semibold text-teal-800 mt-2">
              Equivalent to {result.totalWeeks} weeks and {result.remainingDays} days
              {result.years > 0 || result.months > 0 ? ` (approx. ${result.years}y ${result.months}m ${result.days}d)` : ''}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase">Business Days</div>
                <div className="text-xl font-bold text-slate-900">{result.businessDays} Days</div>
                <div className="text-[11px] text-slate-400">Monday – Friday</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase">Weekend Days</div>
                <div className="text-xl font-bold text-slate-900">{result.weekendDays} Days</div>
                <div className="text-[11px] text-slate-400">Saturday & Sunday</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
                <CalendarRange className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase">Total Hours</div>
                <div className="text-xl font-bold text-slate-900">{result.totalHours.toLocaleString()} Hours</div>
                <div className="text-[11px] text-slate-400">24 hours / day</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
