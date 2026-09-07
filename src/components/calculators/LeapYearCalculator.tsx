'use client';

import React, { useState } from 'react';
import { Calendar, Sparkles, AlertCircle } from 'lucide-react';
import {
  calculateLeapYearInfo,
  getTodayCalendarDate,
  parseDateString,
  
  LeapYearBirthdayInfo
} from '@/lib/date-utils';
import { trackEvent } from '@/lib/analytics';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function LeapYearCalculator() {
  const { t } = useLanguage();
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
            {t('leapYearTitle', 'Leap Year Age Calculator')}
          </h2>
          <p className="text-sm text-slate-600">
            {t('leapYearSubtitle', 'Calculate birthdays and true quadrennial milestones for Leap Day (February 29) babies.')}
          </p>
        </div>
      </div>

      <div className="mt-6 max-w-sm space-y-4">
        <div>
          <label htmlFor="ly-dob" className="block text-sm font-bold text-slate-800 mb-1">
            {t('dob', 'Date of Birth')}
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
        </div>

        <button
          type="button"
          onClick={() => handleCalculate(birthDateStr)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t('calculateBtn', 'Calculate Age')}</span>
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
                {t('exactAge', 'Calendar Age')}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-950">
                {result.calendarAge} {t('years', 'Years')}
              </div>
            </div>

            <div className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                {t('leapMilestones', 'Quadrennial Leap Birthdays')}
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-950">
                {result.leapYearAge} {t('days', 'Leap Birthdays')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
