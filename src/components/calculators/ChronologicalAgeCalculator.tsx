'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Stethoscope, Sparkles, AlertCircle, FileText } from 'lucide-react';
import {
  calculateChronologicalAge,
  getTodayCalendarDate,
  parseDateString,
  toDateString,
  ChronologicalAgeResult
} from '@/lib/date-utils';
import { trackEvent } from '@/lib/analytics';
import { detectLocale } from '@/i18n/locale-utils';
import { getTranslations } from '@/i18n/getTranslations';
import { formatNumber } from '@/lib/format-utils';

interface ChronologicalAgeCalculatorProps {
  locale?: string;
}

export default function ChronologicalAgeCalculator({ locale: propLocale }: ChronologicalAgeCalculatorProps) {
  const pathname = usePathname() || '/';
  const locale = propLocale || detectLocale(pathname);
  const { t, raw } = getTranslations(locale);
  const c = raw.calculators?.chronological;

  const today = getTodayCalendarDate();
  const todayStr = toDateString(today);

  const [birthDateStr, setBirthDateStr] = useState('2018-04-12');
  const [testDateStr, setTestDateStr] = useState(todayStr);
  const [weeksPremature, setWeeksPremature] = useState(0);

  const compute = (b: string, testStr: string, prem: number) => {
    const birth = parseDateString(b);
    const test = parseDateString(testStr);
    if (!birth || !test) return { res: null, err: t('errors.invalidDate', 'Please provide valid birth and testing dates.') };
    try {
      return { res: calculateChronologicalAge(birth, test, prem), err: null };
    } catch (err: unknown) {
      return { res: null, err: err instanceof Error ? err.message : t('errors.invalidDate', 'Calculation error') };
    }
  };

  const initial = compute('2018-04-12', todayStr, 0);
  const [result, setResult] = useState<ChronologicalAgeResult | null>(initial.res);
  const [error, setError] = useState<string | null>(initial.err);

  const handleCalculate = (b: string, testStr: string, prem: number) => {
    const data = compute(b, testStr, prem);
    setResult(data.res);
    setError(data.err);
    if (data.res) {
      trackEvent('chronological_age_calculated', {
        years: data.res.chronologicalYears,
        premature: prem > 0
      });
    }
  };

  const calcTitle = c?.title || raw.tools?.['chronological-age-calculator']?.title || 'Chronological Age Calculator';
  const calcDesc = c?.desc || raw.tools?.['chronological-age-calculator']?.desc || 'Standardized clinical & academic age calculation.';

  return (
    <div className="calculator-card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
          <Stethoscope className="w-5 h-5" />
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div>
          <label htmlFor="c-dob" className="block text-sm font-bold text-slate-800 mb-1">
            {c?.birthDate || 'Date of Birth'}
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
            {c?.testDate || 'Date of Testing'}
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
            {c?.weeksPremature || 'Weeks Premature'}
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
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
          />
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={() => handleCalculate(birthDateStr, testDateStr, weeksPremature)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-cyan-700 text-white hover:bg-cyan-800 shadow-sm transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>{c?.btnCalculate || 'Calculate Chronological Age'}</span>
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
            <div className="text-xs font-bold text-cyan-800 uppercase tracking-wider mb-1">
              {c?.chronologicalAge || 'Chronological Age'}
            </div>
            <div className="text-4xl sm:text-5xl font-mono font-extrabold text-cyan-950 mt-1">
              {result.standardNotation}
            </div>
            <div className="text-sm font-semibold text-cyan-900 mt-2">
              {formatNumber(result.chronologicalYears, locale)} {t('calculator.years', 'Years')}, {formatNumber(result.chronologicalMonths, locale)} {t('calculator.months', 'Months')}, {formatNumber(result.chronologicalDays, locale)} {t('calculator.days', 'Days')} ({formatNumber(result.totalDays, locale)} {t('calculator.days', 'total days')})
            </div>
          </div>

          {result.adjustedAge && (
            <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                {c?.adjustedAge || 'Corrected / Adjusted Age'} ({c?.weeksPremature || 'Premature'}: {formatNumber(result.adjustedAge.weeksPremature, locale)})
              </div>
              <div className="text-3xl font-mono font-extrabold text-amber-950 mt-1">
                {result.adjustedAge.standardNotation}
              </div>
              <div className="text-sm text-amber-900 mt-1 font-medium">
                {formatNumber(result.adjustedAge.years, locale)} {t('calculator.years', 'Years')}, {formatNumber(result.adjustedAge.months, locale)} {t('calculator.months', 'Months')}, {formatNumber(result.adjustedAge.days, locale)} {t('calculator.days', 'Days')}
              </div>
            </div>
          )}

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>{c?.notation || 'Clinical Notation (Y;M;D)'}</span>
            </div>
            <p>
              {c?.desc || 'Standard assessment calculation with borrow adjustments.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
