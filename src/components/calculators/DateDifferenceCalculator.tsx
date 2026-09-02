'use client';

import React, { useState } from 'react';
import { Clock, Sparkles, AlertCircle } from 'lucide-react';
import {
  calculateDaysBetweenDates,
  getTodayCalendarDate,
  parseDateString,
  toDateString,
  formatDisplayDate
} from '@/lib/date-utils';
import { trackEvent } from '@/lib/analytics';

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

export default function DateDifferenceCalculator() {
  const today = getTodayCalendarDate();
  const todayStr = toDateString(today);

  const [startDateStr, setStartDateStr] = useState('2020-03-15');
  const [endDateStr, setEndDateStr] = useState(todayStr);

  const compute = (s: string, e: string) => {
    const start = parseDateString(s);
    const end = parseDateString(e);
    if (!start || !end) return { res: null, err: 'Please select valid start and end dates.' };
    try {
      const daysRes = calculateDaysBetweenDates(start, end, false);
      const startFormatted = formatDisplayDate(daysRes.isEndBeforeStart ? end : start);
      const endFormatted = formatDisplayDate(daysRes.isEndBeforeStart ? start : end);

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
      return { res: null, err: err instanceof Error ? err.message : 'Calculation error' };
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

  return (
    <div className="calculator-card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-800 flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Date Difference Calculator
          </h2>
          <p className="text-sm text-slate-600">
            Find the exact difference and duration between any two historical or future calendar dates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div>
          <label htmlFor="d1" className="block text-sm font-bold text-slate-800 mb-1">
            From Date (Start)
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
            To Date (End)
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
          <span>Calculate Difference</span>
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
              Exact Calendar Duration
            </div>
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-violet-950">
                  {details.years}
                </span>
                <span className="text-base font-bold text-violet-800">Years</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-violet-950">
                  {details.months}
                </span>
                <span className="text-base font-bold text-violet-800">Months</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-violet-950">
                  {details.days}
                </span>
                <span className="text-base font-bold text-violet-800">Days</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-600">
              Between {details.startFormatted} and {details.endFormatted}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 uppercase">Days</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{details.totalDays.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 uppercase">Weeks</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{details.totalWeeks.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 uppercase">Hours</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{details.totalHours.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 uppercase">Minutes</div>
              <div className="text-xl font-bold text-slate-900 mt-1 truncate">{details.totalMinutes.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
