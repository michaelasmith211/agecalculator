'use client';

import React, { useState } from 'react';
import { Calendar, Sparkles, AlertCircle, Compass } from 'lucide-react';
import {
  calculateLeapYearInfo,
  getTodayCalendarDate,
  parseDateString,
  formatDisplayDate,
  LeapYearBirthdayInfo
} from '@/lib/date-utils';
import { trackEvent } from '@/lib/analytics';

export default function LeapYearCalculator() {
  const today = getTodayCalendarDate();
  const [birthDateStr, setBirthDateStr] = useState('2000-02-29');

  const compute = (b: string) => {
    const birth = parseDateString(b);
    if (!birth) return { res: null, err: 'Please provide a valid date.' };
    try {
      return { res: calculateLeapYearInfo(birth, today), err: null };
    } catch (err: unknown) {
      return { res: null, err: err instanceof Error ? err.message : 'Calculation error' };
    }
  };

  const initial = compute('2000-02-29');
  const [result, setResult] = useState<LeapYearBirthdayInfo | null>(initial.res);
  const [error, setError] = useState<string | null>(initial.err);

  const handleCalculate = (b: string) => {
    const data = compute(b);
    setResult(data.res);
    setError(data.err);
    if (data.res) {
      trackEvent('leap_year_calculated', { is_leap_baby: data.res.isLeapYearBaby });
    }
  };

  return (
    <div className="calculator-card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Leap Year & Feb 29 Birthday Calculator
          </h2>
          <p className="text-sm text-slate-600">
            Discover your quadrennial &quot;leap age&quot; (actual February 29ths lived) and see all upcoming Leap Day birthdays.
          </p>
        </div>
      </div>

      <div className="mt-6 max-w-sm space-y-4">
        <div>
          <label htmlFor="ly-dob" className="block text-sm font-bold text-slate-800 mb-1">
            Date of Birth
          </label>
          <input
            id="ly-dob"
            type="date"
            value={birthDateStr}
            onChange={(e) => {
              setBirthDateStr(e.target.value);
              if (e.target.value) handleCalculate(e.target.value);
            }}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
          />
          <p className="text-xs text-slate-500 mt-1">
            Standard default is Leap Day (February 29).
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleCalculate(birthDateStr)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Calculate Leap Age</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                Calendar Age (Years Lived)
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold text-emerald-950 mt-1">
                {result.calendarAge} Years Old
              </div>
              <div className="text-xs text-emerald-800 mt-2">
                Standard chronological years elapsed
              </div>
            </div>

            <div className="p-6 bg-indigo-50/70 border border-indigo-200 rounded-2xl">
              <div className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1">
                Leap Year Age (Feb 29ths Celebrated)
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold text-indigo-950 mt-1">
                {result.leapYearAge} Leap Birthdays
              </div>
              <div className="text-xs text-indigo-800 mt-2">
                Exact number of leap days experienced
              </div>
            </div>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2">
            <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Next Official February 29 Birthday</span>
            </div>
            <div className="text-lg font-bold text-slate-900">
              {formatDisplayDate(result.nextFeb29Date)}
            </div>
            <div className="text-sm text-slate-600">
              Only <strong>{result.daysUntilNextFeb29.toLocaleString()} days</strong> until the next calendar leap day occurs!
            </div>
          </div>

          {result.upcomingCelebrations.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Next Leap Year Celebrations
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                {result.upcomingCelebrations.slice(0, 8).map((c) => (
                  <div key={c.year} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="font-bold text-slate-900">Year {c.year}</div>
                    <div className="text-xs text-slate-600 mt-0.5">Turns {c.milestoneAge} (Leap #{(c.milestoneAge / 4)})</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
