'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Cake, Sparkles, AlertCircle, Award } from 'lucide-react';
import {
  calculateAge,
  getTodayCalendarDate,
  parseDateString,
  CalendarDate
} from '@/lib/date-utils';
import { trackEvent } from '@/lib/analytics';
import SocialShare from '@/components/SocialShare';
import { detectLocale } from '@/i18n/locale-utils';
import { getTranslations } from '@/i18n/getTranslations';
import { formatDateShort, formatWeekday, formatNumber } from '@/lib/format-utils';

interface MilestoneRow {
  age: number;
  year: number;
  dateStr: string;
  dayOfWeek: string;
  passed: boolean;
}

interface NextBdayInfo {
  date: CalendarDate;
  formatted: string;
  dayOfWeek: string;
  daysUntil: number;
  turningAge: number;
  currentAgeYears: number;
}

interface BirthdayCalculatorProps {
  locale?: string;
}

export default function BirthdayCalculator({ locale: propLocale }: BirthdayCalculatorProps) {
  const pathname = usePathname() || '/';
  const locale = propLocale || detectLocale(pathname);
  const { t, raw } = getTranslations(locale);
  const c = raw.calculators?.birthday;

  const today = getTodayCalendarDate();
  const [birthDateStr, setBirthDateStr] = useState('1998-06-15');

  const computeData = (bStr: string) => {
    const bDate = parseDateString(bStr);
    if (!bDate) return { info: null, milestones: [], error: t('errors.invalidDate', 'Please enter a valid Date of Birth.') };
    try {
      const ageRes = calculateAge(bDate, today);
      const nextBdayJsDate = new Date(ageRes.nextBirthdayDate.year, ageRes.nextBirthdayDate.month - 1, ageRes.nextBirthdayDate.day);
      const info: NextBdayInfo = {
        date: ageRes.nextBirthdayDate,
        formatted: formatDateShort(nextBdayJsDate, locale),
        dayOfWeek: formatWeekday(nextBdayJsDate, locale),
        daysUntil: ageRes.daysUntilNextBirthday,
        turningAge: ageRes.ageTurningNext,
        currentAgeYears: ageRes.years
      };

      const keyAges = [1, 5, 10, 16, 18, 21, 25, 30, 40, 50, 60, 65, 70, 75, 80, 90, 100];
      const milestoneList: MilestoneRow[] = keyAges.map((age) => {
        const year = bDate.year + age;
        const mDate: CalendarDate = { year, month: bDate.month, day: bDate.day === 29 && bDate.month === 2 ? 28 : bDate.day };
        const jsDate = new Date(mDate.year, mDate.month - 1, mDate.day);
        const dayOfWeek = formatWeekday(jsDate, locale);
        const passed = ageRes.years > age || (ageRes.years === age && !ageRes.isBirthdayToday);
        return {
          age,
          year,
          dateStr: formatDateShort(jsDate, locale),
          dayOfWeek,
          passed
        };
      });

      return { info, milestones: milestoneList, error: null };
    } catch (err: unknown) {
      return { info: null, milestones: [], error: err instanceof Error ? err.message : t('errors.invalidDate', 'Invalid date.') };
    }
  };

  const initial = computeData('1998-06-15');
  const [milestones, setMilestones] = useState<MilestoneRow[]>(initial.milestones);
  const [nextBdayInfo, setNextBdayInfo] = useState<NextBdayInfo | null>(initial.info);
  const [error, setError] = useState<string | null>(initial.error);

  const handleUpdate = (bStr: string) => {
    const data = computeData(bStr);
    setNextBdayInfo(data.info);
    setMilestones(data.milestones);
    setError(data.error);
    if (data.info) {
      trackEvent('birthday_calculator_used', { birth_year: parseInt(bStr.split('-')[0], 10) });
    }
  };

  const calcTitle = c?.title || raw.tools?.['birthday-calculator']?.title || 'Birthday Calculator';
  const calcDesc = c?.desc || raw.tools?.['birthday-calculator']?.desc || 'Discover when your next birthday is...';

  return (
    <div className="calculator-card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
          <Cake className="w-4 h-4" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          {calcTitle}
        </h2>
      </div>
      <p className="text-sm text-slate-600 mb-6">
        {calcDesc}
      </p>

      <div className="space-y-4 max-w-md">
        <div>
          <label htmlFor="bday-input" className="block text-sm font-bold text-slate-800 mb-1">
            {c?.dobLabel || t('calculator.dobLabel', 'Your Date of Birth')}
          </label>
          <input
            id="bday-input"
            type="date"
            value={birthDateStr}
            onChange={(e) => {
              setBirthDateStr(e.target.value);
              if (e.target.value) handleUpdate(e.target.value);
            }}
            className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-300 focus:border-pink-600 rounded-xl text-slate-900 font-medium text-base transition-all"
          />
        </div>

        <button
          type="button"
          onClick={() => handleUpdate(birthDateStr)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold bg-pink-600 text-white hover:bg-pink-700 shadow-sm transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>{c?.btnCalculate || 'Find Birthday Insights'}</span>
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {nextBdayInfo && (
        <div className="mt-8 space-y-6">
          <div className="p-6 bg-pink-50/70 border border-pink-200 rounded-2xl">
            <div className="text-xs font-bold text-pink-700 uppercase tracking-wider mb-1">
              {c?.nextCountdown || 'Next Birthday Countdown'}
            </div>
            <div className="flex flex-wrap items-baseline gap-3 mt-1">
              <span className="text-4xl sm:text-5xl font-extrabold text-pink-900">
                {nextBdayInfo.daysUntil === 0 ? (c?.todayBday || 'Today!') : `${formatNumber(nextBdayInfo.daysUntil, locale)} ${c?.daysUntil || t('calculator.days', 'Days')}`}
              </span>
              <span className="text-base text-pink-700 font-semibold">
                {c?.turning || 'until you turn'} <strong>{formatNumber(nextBdayInfo.turningAge, locale)}</strong>
              </span>
            </div>
            <div className="mt-3 text-sm text-slate-700">
              {c?.onDate || 'Your next birthday falls on'} <strong>{nextBdayInfo.formatted}</strong> ({nextBdayInfo.dayOfWeek}).
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-pink-600" />
              <span>{c?.milestoneTitle || 'Milestone Birthdays'}</span>
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                    <th className="py-3 px-4">{c?.age || 'Milestone Age'}</th>
                    <th className="py-3 px-4">{c?.date || 'Date'}</th>
                    <th className="py-3 px-4">{c?.dayOfWeek || 'Day of Week'}</th>
                    <th className="py-3 px-4">{c?.status || 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {milestones.map((m) => (
                    <tr key={m.age} className={m.passed ? 'bg-slate-50/30' : 'bg-white hover:bg-pink-50/40'}>
                      <td className="py-3 px-4 font-bold text-slate-900">{formatNumber(m.age, locale)} {t('calculator.years', 'Years')}</td>
                      <td className="py-3 px-4 text-slate-700">{m.dateStr}</td>
                      <td className="py-3 px-4 text-slate-600">{m.dayOfWeek}</td>
                      <td className="py-3 px-4">
                        {m.passed ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                            {c?.passed || 'Completed'}
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-700">
                            {c?.upcoming || 'Upcoming'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <SocialShare
            title={calcTitle}
            url={locale === 'en' ? '/birthday-calculator' : `/${locale}/birthday-calculator`}
            resultText={nextBdayInfo.daysUntil === 0
              ? `${c?.todayBday || 'Happy Birthday!'} ${c?.turning || 'Turning'} ${nextBdayInfo.turningAge}!`
              : `${nextBdayInfo.daysUntil} ${c?.daysUntil || 'days'} ${c?.turning || 'until'} ${nextBdayInfo.turningAge}!`}
          />
        </div>
      )}
    </div>
  );
}
