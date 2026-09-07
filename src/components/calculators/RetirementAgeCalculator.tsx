'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sunset, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';
import {
  calculateRetirement,
  getTodayCalendarDate,
  parseDateString,
  toDateString,
  RetirementResult
} from '@/lib/date-utils';
import { trackEvent } from '@/lib/analytics';
import { detectLocale } from '@/i18n/locale-utils';
import { getTranslations } from '@/i18n/getTranslations';
import { formatDateShort, formatNumber } from '@/lib/format-utils';

interface RetirementAgeCalculatorProps {
  locale?: string;
}

export default function RetirementAgeCalculator({ locale: propLocale }: RetirementAgeCalculatorProps) {
  const pathname = usePathname() || '/';
  const locale = propLocale || detectLocale(pathname);
  const { t, raw } = getTranslations(locale);
  const c = raw.calculators?.retirement;

  const today = getTodayCalendarDate();
  const todayStr = toDateString(today);

  const [birthDateStr, setBirthDateStr] = useState('1985-05-20');
  const [retireAge, setRetireAge] = useState(65);
  const [asOfDateStr, setAsOfDateStr] = useState(todayStr);

  const compute = (b: string, age: number, asOf: string) => {
    const birth = parseDateString(b);
    const asOfDate = parseDateString(asOf);
    if (!birth || !asOfDate) return { res: null, err: t('errors.invalidDate', 'Please provide valid birth and calculation dates.') };
    try {
      return { res: calculateRetirement(birth, age, asOfDate), err: null };
    } catch (err: unknown) {
      return { res: null, err: err instanceof Error ? err.message : t('errors.invalidDate', 'Calculation error') };
    }
  };

  const initial = compute('1985-05-20', 65, todayStr);
  const [result, setResult] = useState<RetirementResult | null>(initial.res);
  const [error, setError] = useState<string | null>(initial.err);

  const handleCalculate = (b: string, age: number, asOf: string) => {
    const data = compute(b, age, asOf);
    setResult(data.res);
    setError(data.err);
    if (data.res) {
      trackEvent('retirement_calculated', { target_age: age });
    }
  };

  const calcTitle = c?.title || raw.tools?.['retirement-age-calculator']?.title || 'Retirement Age Calculator';
  const calcDesc = c?.desc || raw.tools?.['retirement-age-calculator']?.desc || 'Estimate your projected retirement date and time remaining until your target retirement age.';

  const formattedRetirementDate = result
    ? formatDateShort(new Date(result.retirementDate.year, result.retirementDate.month - 1, result.retirementDate.day), locale)
    : '';

  return (
    <div className="calculator-card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center">
          <Sunset className="w-5 h-5" />
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
          <label htmlFor="r-dob" className="block text-sm font-bold text-slate-800 mb-1">
            {c?.birthDate || 'Date of Birth'}
          </label>
          <input
            id="r-dob"
            type="date"
            value={birthDateStr}
            onChange={(e) => {
              setBirthDateStr(e.target.value);
              if (e.target.value) handleCalculate(e.target.value, retireAge, asOfDateStr);
            }}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
          />
        </div>

        <div>
          <label htmlFor="r-age" className="block text-sm font-bold text-slate-800 mb-1">
            {c?.targetAge || 'Target Retirement Age'}
          </label>
          <input
            id="r-age"
            type="number"
            min="40"
            max="90"
            value={retireAge}
            onChange={(e) => {
              const val = Math.max(40, Math.min(90, parseInt(e.target.value, 10) || 65));
              setRetireAge(val);
              if (birthDateStr) handleCalculate(birthDateStr, val, asOfDateStr);
            }}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold text-sm"
          />
        </div>

        <div>
          <label htmlFor="r-asof" className="block text-sm font-bold text-slate-800 mb-1">
            {c?.asOfDate || 'Calculation Date'}
          </label>
          <input
            id="r-asof"
            type="date"
            value={asOfDateStr}
            onChange={(e) => {
              setAsOfDateStr(e.target.value);
              if (birthDateStr && e.target.value) handleCalculate(birthDateStr, retireAge, e.target.value);
            }}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
          />
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={() => handleCalculate(birthDateStr, retireAge, asOfDateStr)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-orange-600 text-white hover:bg-orange-700 shadow-sm transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>{c?.btnCalculate || 'Calculate Retirement'}</span>
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
          {result.isAlreadyRetired ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <div className="text-xl font-bold text-emerald-900">
                🎉 {c?.alreadyReached || 'Target retirement milestone reached.'}
              </div>
              <div className="text-sm text-emerald-700 mt-1">
                {c?.targetYear || 'Projected Retirement Date'}: {formattedRetirementDate}.
              </div>
            </div>
          ) : (
            <>
              <div className="p-6 bg-orange-50/70 border border-orange-200 rounded-2xl">
                <div className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-1">
                  {c?.yearsRemaining || 'Years Remaining'} ({c?.targetAge || 'Target Age'}: {formatNumber(retireAge, locale)})
                </div>
                <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold text-orange-950">
                      {formatNumber(result.yearsRemaining, locale)}
                    </span>
                    <span className="text-base font-bold text-orange-800">{t('calculator.years', 'Years')}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold text-orange-950">
                      {formatNumber(result.monthsRemaining, locale)}
                    </span>
                    <span className="text-base font-bold text-orange-800">{t('calculator.months', 'Months')}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold text-orange-950">
                      {formatNumber(result.daysRemaining, locale)}
                    </span>
                    <span className="text-base font-bold text-orange-800">{t('calculator.days', 'Days')}</span>
                  </div>
                </div>
                <div className="mt-3 text-sm text-slate-700">
                  {c?.targetYear || 'Projected Retirement Date'}: <strong>{formattedRetirementDate}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs font-semibold text-slate-500 uppercase">{c?.yearsRemaining || 'Total Days Remaining'}</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">
                    {formatNumber(result.totalDaysRemaining, locale)} {t('calculator.days', 'Days')}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs font-semibold text-slate-500 uppercase">{c?.workingDaysLeft || 'Estimated Working Days Left'}</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">
                    ~{formatNumber(result.workingDaysRemaining, locale)} {t('calculator.days', 'Days')}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-slate-500" />
              <span>{c?.title || 'Retirement Age Calculator'}</span>
            </div>
            <p>
              {c?.desc || 'Estimate your projected retirement date and time remaining until your target retirement age.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
