'use client';

import React, { useState } from 'react';
import { Stethoscope, Sparkles, AlertCircle } from 'lucide-react';
import {
  calculateChronologicalAge,
  getTodayCalendarDate,
  parseDateString,
  toDateString,
  ChronologicalAgeResult
} from '@/lib/date-utils';
import { trackEvent } from '@/lib/analytics';

const t = (_key: string, fallback: string) => fallback;

export default function ChronologicalAgeCalculator() {
  const today = getTodayCalendarDate();
  const todayStr = toDateString(today);

  const [birthDateStr, setBirthDateStr] = useState('2018-04-12');
  const [testDateStr, setTestDateStr] = useState(todayStr);
  const [weeksPremature, setWeeksPremature] = useState(0);

  const compute = (b: string, test: string, prem: number) => {
    const birth = parseDateString(b);
    const testDate = parseDateString(test);
    if (!birth || !testDate) return { res: null, err: 'Please provide valid birth and testing dates.' };
    try {
      return { res: calculateChronologicalAge(birth, testDate, prem), err: null };
    } catch (err: unknown) {
      return { res: null, err: err instanceof Error ? err.message : 'Calculation error' };
    }
  };

  const initial = compute('2018-04-12', todayStr, 0);
  const [result, setResult] = useState<ChronologicalAgeResult | null>(initial.res);
  const [error, setError] = useState<string | null>(initial.err);

  const handleCalculate = (b: string, test: string, prem: number) => {
    const data = compute(b, test, prem);
    setResult(data.res);
    setError(data.err);
    if (data.res) {
      trackEvent('chronological_age_calculated', {
        years: data.res.chronologicalYears,
        premature: prem > 0
      });
    }
  };

  return (
    <div className="calculator-card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
          <Stethoscope className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t('chronologicalTitle', 'Chronological Age Calculator')}
          </h2>
          <p className="text-sm text-slate-600">
            {t('chronologicalSubtitle', 'Calculate exact chronological age for clinical, school admission, demographic, and legal records.')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div>
          <label htmlFor="c-dob" className="block text-sm font-bold text-slate-800 mb-1">
            {t('dob', 'Date of Birth')}
          </label>
          <input
            id="c-dob"
            type="date"
            value={birthDateStr}
            onChange={(e) => {
              setBirthDateStr(e.target.value);
              if (e.target.value && testDateStr) handleCalculate(e.target.value, testDateStr, weeksPremature);
            }}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
          />
        </div>

        <div>
          <label htmlFor="c-test" className="block text-sm font-bold text-slate-800 mb-1">
            {t('testDate', 'Testing / Assessment Date')}
          </label>
          <input
            id="c-test"
            type="date"
            value={testDateStr}
            onChange={(e) => {
              setTestDateStr(e.target.value);
              if (birthDateStr && e.target.value) handleCalculate(birthDateStr, e.target.value, weeksPremature);
            }}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
          />
        </div>

        <div>
          <label htmlFor="prem" className="block text-sm font-bold text-slate-800 mb-1">
            Weeks Premature (0–16)
          </label>
          <input
            id="prem"
            type="number"
            min="0"
            max="16"
            value={weeksPremature}
            onChange={(e) => {
              const val = Math.max(0, parseInt(e.target.value, 10) || 0);
              setWeeksPremature(val);
              if (birthDateStr && testDateStr) handleCalculate(birthDateStr, testDateStr, val);
            }}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold text-sm"
          />
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={() => handleCalculate(birthDateStr, testDateStr, weeksPremature)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t('calcChronologicalBtn', 'Calculate Chronological Age')}</span>
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
          <div className="p-6 bg-cyan-50/70 border border-cyan-200 rounded-2xl">
            <div className="text-xs font-bold text-cyan-800 uppercase tracking-wider mb-2">
              {t('exactAge', 'Your Exact Age')}
            </div>
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-cyan-950">
                  {result.chronologicalYears}
                </span>
                <span className="text-base font-bold text-cyan-800">{t('years', 'Years')}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-cyan-950">
                  {result.chronologicalMonths}
                </span>
                <span className="text-base font-bold text-cyan-800">{t('months', 'Months')}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-cyan-950">
                  {result.chronologicalDays}
                </span>
                <span className="text-base font-bold text-cyan-800">{t('days', 'Days')}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 uppercase">{t('decimalAge', 'Decimal Age')}</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{(result.chronologicalYears + result.chronologicalMonths / 12).toFixed(2)} {t('years', 'Years')}</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 uppercase">{t('totalMonths', 'Total Months')}</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{(result.chronologicalYears * 12 + result.chronologicalMonths).toFixed(1)} {t('months', 'Months')}</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 uppercase">{t('totalDays', 'Total Days')}</div>
              <div className="text-xl font-bold text-slate-900 mt-1">{result.totalDays.toLocaleString()} {t('days', 'Days')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
