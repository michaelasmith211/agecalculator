'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import {
  calculateAge,
  parseDateString,
  formatDisplayDate
} from '@/lib/date-utils';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function BirthdayCountdown() {
  const { t } = useLanguage();
  const [birthDateStr, setBirthDateStr] = useState('1996-10-25');
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    turningAge: number;
    nextBirthdayDateFormatted: string;
    isToday: boolean;
  } | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const birth = parseDateString(birthDateStr);
      if (!birth) return;

      const now = new Date();
      const today = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };

      try {
        const ageRes = calculateAge(birth, today);
        const nextBday = ageRes.nextBirthdayDate;

        const targetDate = new Date(nextBday.year, nextBday.month - 1, nextBday.day, 0, 0, 0, 0);
        let diffMs = targetDate.getTime() - now.getTime();

        if (ageRes.isBirthdayToday) {
          setTimeLeft({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            turningAge: ageRes.years,
            nextBirthdayDateFormatted: formatDisplayDate(nextBday),
            isToday: true
          });
          return;
        }

        if (diffMs < 0) {
          diffMs = 0;
        }

        const totalSecs = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSecs / (3600 * 24));
        const hours = Math.floor((totalSecs % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = totalSecs % 60;

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          turningAge: ageRes.ageTurningNext,
          nextBirthdayDateFormatted: formatDisplayDate(nextBday),
          isToday: false
        });
      } catch {
        // Invalid date
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [birthDateStr]);

  return (
    <div className="calculator-card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t('bdayCountdownTitle', 'Live Birthday Countdown Clock')}
          </h2>
          <p className="text-sm text-slate-600">
            {t('bdayCountdownSubtitle', 'Real-time live countdown ticking down the exact days, hours, minutes, and seconds to your next birthday.')}
          </p>
        </div>
      </div>

      <div className="mt-6 max-w-sm space-y-4">
        <div>
          <label htmlFor="bc-dob" className="block text-sm font-bold text-slate-800 mb-1">
            {t('dob', 'Date of Birth')}
          </label>
          <input
            id="bc-dob"
            type="date"
            value={birthDateStr}
            onChange={(e) => setBirthDateStr(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm"
          />
        </div>
      </div>

      {timeLeft && (
        <div className="mt-8 space-y-6">
          <div className="p-6 sm:p-8 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl shadow-md text-center">
            <div className="text-sm font-medium opacity-90 mb-4">
              {timeLeft.isToday
                ? t('happyBirthday', '🎉 Happy Birthday Today!')
                : `${t('turningAge', 'Turning')} ${timeLeft.turningAge} on ${timeLeft.nextBirthdayDateFormatted}`}
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 sm:p-4">
                <div className="text-2xl sm:text-4xl font-extrabold">{timeLeft.days}</div>
                <div className="text-xs uppercase tracking-wider mt-1 opacity-80">{t('countdownDays', 'Days')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 sm:p-4">
                <div className="text-2xl sm:text-4xl font-extrabold">{timeLeft.hours}</div>
                <div className="text-xs uppercase tracking-wider mt-1 opacity-80">{t('countdownHours', 'Hours')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 sm:p-4">
                <div className="text-2xl sm:text-4xl font-extrabold">{timeLeft.minutes}</div>
                <div className="text-xs uppercase tracking-wider mt-1 opacity-80">{t('countdownMins', 'Mins')}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 sm:p-4">
                <div className="text-2xl sm:text-4xl font-extrabold">{timeLeft.seconds}</div>
                <div className="text-xs uppercase tracking-wider mt-1 opacity-80">{t('countdownSecs', 'Secs')}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
