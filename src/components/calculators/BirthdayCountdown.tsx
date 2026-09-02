'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import {
  calculateAge,
  parseDateString,
  formatDisplayDate
} from '@/lib/date-utils';

export default function BirthdayCountdown() {
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

        // Target timestamp for next birthday at midnight local time
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
            Live Birthday Countdown Clock
          </h2>
          <p className="text-sm text-slate-600">
            Real-time live countdown ticking down the exact days, hours, minutes, and seconds to your next birthday.
          </p>
        </div>
      </div>

      <div className="mt-6 max-w-sm space-y-4">
        <div>
          <label htmlFor="bc-dob" className="block text-sm font-bold text-slate-800 mb-1">
            Your Date of Birth
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
          {timeLeft.isToday ? (
            <div className="p-8 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl text-center shadow-md">
              <div className="text-4xl sm:text-5xl font-extrabold mb-2">
                🎉 Happy Birthday! 🎂
              </div>
              <p className="text-lg font-medium opacity-90">
                You are turning {timeLeft.turningAge} years old today! Wishing you a wonderful year ahead.
              </p>
            </div>
          ) : (
            <div className="p-6 sm:p-8 bg-purple-50/70 border border-purple-200 rounded-2xl text-center">
              <div className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-2">
                Countdown to {timeLeft.nextBirthdayDateFormatted} (Turning {timeLeft.turningAge})
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-xl mx-auto my-4">
                <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-2xs">
                  <div className="text-3xl sm:text-5xl font-extrabold text-purple-950 font-mono">
                    {timeLeft.days}
                  </div>
                  <div className="text-xs font-semibold text-purple-700 uppercase mt-1">Days</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-2xs">
                  <div className="text-3xl sm:text-5xl font-extrabold text-purple-950 font-mono">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-xs font-semibold text-purple-700 uppercase mt-1">Hours</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-2xs">
                  <div className="text-3xl sm:text-5xl font-extrabold text-purple-950 font-mono">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-xs font-semibold text-purple-700 uppercase mt-1">Minutes</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-2xs">
                  <div className="text-3xl sm:text-5xl font-extrabold text-purple-950 font-mono">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-xs font-semibold text-purple-700 uppercase mt-1">Seconds</div>
                </div>
              </div>

              <div className="text-xs text-purple-800 mt-2">
                Next birthday falls on <strong>{timeLeft.nextBirthdayDateFormatted}</strong>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
