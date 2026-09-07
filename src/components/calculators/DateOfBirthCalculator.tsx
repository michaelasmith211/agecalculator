'use client';

import React, { useState } from 'react';
import { Calendar, Sparkles, AlertCircle } from 'lucide-react';
import {
  calculateDateOfBirthFromAge,
  getTodayCalendarDate,
  parseDateString,
  toDateString,
  ReverseDobResult
} from '@/lib/date-utils';
import { trackEvent } from '@/lib/analytics';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function DateOfBirthCalculator() {
  const { t } = useLanguage();
  const today = getTodayCalendarDate();
  const todayStr = toDateString(today);

  const [ageYears, setAgeYears] = useState<number>(26);
  const [ageMonths, setAgeMonths] = useState<number>(7);
  const [ageDays, setAgeDays] = useState<number>(18);
  const [asOfDateStr, setAsOfDateStr] = useState<string>(todayStr);

  const compute = (y: number, m: number, d: number, asOf: string) => {
    const parsedAsOf = parseDateString(asOf);
    if (!parsedAsOf) return { res: null, err: 'Please select a valid reference date.' };
    try {
      return { res: calculateDateOfBirthFromAge(y, m, d, parsedAsOf), err: null };
    } catch (e: unknown) {
      return { res: null, err: e instanceof Error ? e.message : 'Calculation error' };
    }
  };

  const initial = compute(26, 7, 18, todayStr);
  const [result, setResult] = useState<ReverseDobResult | null>(initial.res);
  const [error, setError] = useState<string | null>(initial.err);

  const handleCalculate = (y: number, m: number, d: number, asOfStr: string) => {
    const data = compute(y, m, d, asOfStr);
    setResult(data.res);
    setError(data.err);
    if (data.res) {
      trackEvent('dob_calculator_used', { age_years: y });
    }
  };

  return (
    <div className="calculator-card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t('dobCalcTitle', 'Date of Birth Calculator')}
          </h2>
          <p className="text-sm text-slate-600">
            {t('dobCalcSubtitle', 'Calculate your exact birth date if you know your age on a given reference date.')}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">
            {t('knownAge', 'Known Age (Years, Months, Days)')}
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <span className="text-xs text-slate-500 font-semibold mb-1 block">{t('years', 'Years')}</span>
              <input
                type="number"
                min="0"
                max="130"
                value={ageYears}
                onChange={(e) => {
                  const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                  setAgeYears(val);
                  handleCalculate(val, ageMonths, ageDays, asOfDateStr);
                }}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold text-center"
              />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold mb-1 block">{t('months', 'Months')}</span>
              <input
                type="number"
                min="0"
                max="11"
                value={ageMonths}
                onChange={(e) => {
                  const val = Math.max(0, Math.min(11, parseInt(e.target.value, 10) || 0));
                  setAgeMonths(val);
                  handleCalculate(ageYears, val, ageDays, asOfDateStr);
                }}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold text-center"
              />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold mb-1 block">{t('days', 'Days')}</span>
              <input
                type="number"
                min="0"
                max="30"
                value={ageDays}
                onChange={(e) => {
                  const val = Math.max(0, Math.min(30, parseInt(e.target.value, 10) || 0));
                  setAgeDays(val);
                  handleCalculate(ageYears, ageMonths, val, asOfDateStr);
                }}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold text-center"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="asof-input" className="block text-sm font-bold text-slate-800 mb-1">
            {t('asOfDate', 'As of Date')}
          </label>
          <input
            id="asof-input"
            type="date"
            value={asOfDateStr}
            onChange={(e) => {
              setAsOfDateStr(e.target.value);
              if (e.target.value) handleCalculate(ageYears, ageMonths, ageDays, e.target.value);
            }}
            className="w-full max-w-sm px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
          />
        </div>

        <button
          type="button"
          onClick={() => handleCalculate(ageYears, ageMonths, ageDays, asOfDateStr)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-amber-600 text-white hover:bg-amber-700 shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t('calcDobBtn', 'Calculate Date of Birth')}</span>
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
          <div className="p-6 bg-amber-50/70 border border-amber-200 rounded-2xl">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
              {t('estimatedDob', 'Calculated Date of Birth')}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-950 mt-1">
              {result.formattedDate}
            </div>
            <div className="mt-2 text-sm text-slate-700">
              {t('bornOn', 'Born on')} <strong>{result.dayOfWeek}</strong>.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
