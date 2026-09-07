'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Users, Calendar, AlertCircle, Copy, Check } from 'lucide-react';
import {
  calculateAgeDifference,
  parseDateString,
  AgeDifferenceResult
} from '@/lib/date-utils';
import { trackEvent } from '@/lib/analytics';
import SocialShare from '@/components/SocialShare';
import { detectLocale } from '@/i18n/locale-utils';
import { getTranslations } from '@/i18n/getTranslations';
import { formatNumber } from '@/lib/format-utils';

interface AgeDifferenceCalculatorProps {
  locale?: string;
}

export default function AgeDifferenceCalculator({ locale: propLocale }: AgeDifferenceCalculatorProps) {
  const pathname = usePathname() || '/';
  const locale = propLocale || detectLocale(pathname);
  const { t, raw } = getTranslations(locale);
  const c = raw.calculators?.ageDifference;

  const [dobAStr, setDobAStr] = useState('1990-01-01');
  const [dobBStr, setDobBStr] = useState('1995-06-15');
  const [personAName, setPersonAName] = useState(c?.personA || 'Person A');
  const [personBName, setPersonBName] = useState(c?.personB || 'Person B');
  const [copied, setCopied] = useState(false);

  const compute = (dateA: string, dateB: string) => {
    const parsedA = parseDateString(dateA);
    const parsedB = parseDateString(dateB);
    if (!parsedA || !parsedB) {
      return { res: null, err: t('errors.invalidDate', 'Please enter valid dates of birth for both individuals.') };
    }
    try {
      return { res: calculateAgeDifference(parsedA, parsedB), err: null };
    } catch (e: unknown) {
      return { res: null, err: e instanceof Error ? e.message : t('errors.invalidDate', 'Calculation error') };
    }
  };

  const initial = compute('1990-01-01', '1995-06-15');
  const [result, setResult] = useState<AgeDifferenceResult | null>(initial.res);
  const [error, setError] = useState<string | null>(initial.err);

  const handleCalculate = (dateA: string, dateB: string) => {
    const data = compute(dateA, dateB);
    setResult(data.res);
    setError(data.err);
    if (data.res) {
      trackEvent('age_difference_calculated', {
        diff_years: data.res.differenceYears,
        diff_days: data.res.totalDaysDifference
      });
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calcTitle = c?.title || raw.tools?.['age-difference-calculator']?.title || 'Age Difference Calculator';
  const calcDesc = c?.desc || raw.tools?.['age-difference-calculator']?.desc || 'Compare two birth dates to find the exact age gap in years, months, and days.';

  return (
    <div className="calculator-card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
          <Users className="w-5 h-5" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Person A */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
            <span>{c?.personA || 'Person A'}</span>
            <input
              type="text"
              value={personAName}
              onChange={(e) => setPersonAName(e.target.value)}
              placeholder="Name"
              className="text-xs bg-white border border-slate-300 rounded px-2 py-1 w-32 font-normal"
            />
          </div>
          <div>
            <label htmlFor="dob-a" className="block text-xs font-semibold text-slate-600 mb-1">
              {c?.dobLabel || t('calculator.dobLabel', 'Date of Birth')}
            </label>
            <input
              id="dob-a"
              type="date"
              value={dobAStr}
              onChange={(e) => {
                setDobAStr(e.target.value);
                if (e.target.value && dobBStr) handleCalculate(e.target.value, dobBStr);
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-indigo-600 rounded-lg text-slate-900 font-medium text-sm"
            />
          </div>
        </div>

        {/* Person B */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
            <span>{c?.personB || 'Person B'}</span>
            <input
              type="text"
              value={personBName}
              onChange={(e) => setPersonBName(e.target.value)}
              placeholder="Name"
              className="text-xs bg-white border border-slate-300 rounded px-2 py-1 w-32 font-normal"
            />
          </div>
          <div>
            <label htmlFor="dob-b" className="block text-xs font-semibold text-slate-600 mb-1">
              {c?.dobLabel || t('calculator.dobLabel', 'Date of Birth')}
            </label>
            <input
              id="dob-b"
              type="date"
              value={dobBStr}
              onChange={(e) => {
                setDobBStr(e.target.value);
                if (dobAStr && e.target.value) handleCalculate(dobAStr, e.target.value);
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-indigo-600 rounded-lg text-slate-900 font-medium text-sm"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => handleCalculate(dobAStr, dobBStr)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all"
        >
          <Calendar className="w-4 h-4" />
          <span>{c?.btnCalculate || 'Calculate Age Difference'}</span>
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
          <div className="p-6 bg-indigo-50/70 border border-indigo-200 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                {c?.resultTitle || 'Age Difference Breakdown'}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (c?.copied || 'Copied') : (c?.copySummary || 'Copy Summary')}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mt-3">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-indigo-950">
                  {formatNumber(result.differenceYears, locale)}
                </span>
                <span className="text-base font-bold text-indigo-800">{t('calculator.years', 'Years')}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-indigo-950">
                  {formatNumber(result.differenceMonths, locale)}
                </span>
                <span className="text-base font-bold text-indigo-800">{t('calculator.months', 'Months')}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-indigo-950">
                  {formatNumber(result.differenceDays, locale)}
                </span>
                <span className="text-base font-bold text-indigo-800">{t('calculator.days', 'Days')}</span>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-700 leading-relaxed font-medium">
              {result.olderPerson === 'same' ? (
                c?.sameAge || 'Both individuals were born on the exact same date.'
              ) : (
                <>
                  <strong>{result.olderPerson === 'A' ? personAName : personBName}</strong>{' '}
                  {c?.olderThan || 'is older than'}{' '}
                  <strong>{result.olderPerson === 'A' ? personBName : personAName}</strong>{' '}
                  {c?.by || 'by'}{' '}
                  <strong>
                    {formatNumber(result.differenceYears, locale)} {t('calculator.years', 'years')},{' '}
                    {formatNumber(result.differenceMonths, locale)} {t('calculator.months', 'months')},{' '}
                    {formatNumber(result.differenceDays, locale)} {t('calculator.days', 'days')}
                  </strong>.
                </>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 uppercase">
                {c?.totalDaysDiff || 'Total Days Difference'}
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {formatNumber(result.totalDaysDifference, locale)} {t('calculator.days', 'Days')}
              </div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 uppercase">
                {c?.totalWeeksDiff || 'Total Weeks Difference'}
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {formatNumber(result.totalWeeksDifference, locale)} {t('calculator.weeks', 'Weeks')}
              </div>
            </div>
          </div>

          <SocialShare
            title={calcTitle}
            url={locale === 'en' ? '/age-difference-calculator' : `/${locale}/age-difference-calculator`}
            resultText={`${calcTitle}: ${formatNumber(result.differenceYears, locale)} ${t('calculator.years', 'Years')}, ${formatNumber(result.differenceMonths, locale)} ${t('calculator.months', 'Months')}, ${formatNumber(result.differenceDays, locale)} ${t('calculator.days', 'Days')}!`}
          />
        </div>
      )}
    </div>
  );
}
