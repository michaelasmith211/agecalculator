'use client';

import React, { useState } from 'react';
import { Users, Calendar, AlertCircle, Copy, Check } from 'lucide-react';
import {
  calculateAgeDifference,
  parseDateString,
  AgeDifferenceResult
} from '@/lib/date-utils';
import { trackEvent } from '@/lib/analytics';
import SocialShare from '@/components/SocialShare';

export default function AgeDifferenceCalculator() {
  const [dobAStr, setDobAStr] = useState('1990-01-01');
  const [dobBStr, setDobBStr] = useState('1995-06-15');
  const [personAName, setPersonAName] = useState('Person A');
  const [personBName, setPersonBName] = useState('Person B');
  const [copied, setCopied] = useState(false);

  const compute = (dateA: string, dateB: string) => {
    const parsedA = parseDateString(dateA);
    const parsedB = parseDateString(dateB);
    if (!parsedA || !parsedB) {
      return { res: null, err: 'Please enter valid dates of birth for both individuals.' };
    }
    try {
      return { res: calculateAgeDifference(parsedA, parsedB), err: null };
    } catch (e: unknown) {
      return { res: null, err: e instanceof Error ? e.message : 'Calculation error' };
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

  return (
    <div className="calculator-card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Age Difference Calculator
          </h2>
          <p className="text-sm text-slate-600">
            Compare two birth dates to find the exact age gap in years, months, and days.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Person A */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
            <span>First Person</span>
            <input
              type="text"
              value={personAName}
              onChange={(e) => setPersonAName(e.target.value)}
              placeholder="Name (Optional)"
              className="text-xs bg-white border border-slate-300 rounded px-2 py-1 w-32 font-normal"
            />
          </div>
          <div>
            <label htmlFor="dob-a" className="block text-xs font-semibold text-slate-600 mb-1">
              Date of Birth
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
            <span>Second Person</span>
            <input
              type="text"
              value={personBName}
              onChange={(e) => setPersonBName(e.target.value)}
              placeholder="Name (Optional)"
              className="text-xs bg-white border border-slate-300 rounded px-2 py-1 w-32 font-normal"
            />
          </div>
          <div>
            <label htmlFor="dob-b" className="block text-xs font-semibold text-slate-600 mb-1">
              Date of Birth
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
          <span>Calculate Difference</span>
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
                Age Gap Summary
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mt-3">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-indigo-950">
                  {result.differenceYears}
                </span>
                <span className="text-base font-bold text-indigo-800">Years</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-indigo-950">
                  {result.differenceMonths}
                </span>
                <span className="text-base font-bold text-indigo-800">Months</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-indigo-950">
                  {result.differenceDays}
                </span>
                <span className="text-base font-bold text-indigo-800">Days</span>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-700 leading-relaxed font-medium">
              {result.olderPerson === 'same' ? (
                'Both individuals were born on the exact same date. The age difference is 0 days.'
              ) : (
                <>
                  <strong>{result.olderPerson === 'A' ? personAName : personBName}</strong> is older than{' '}
                  <strong>{result.olderPerson === 'A' ? personBName : personAName}</strong> by{' '}
                  <strong>{result.differenceYears} years, {result.differenceMonths} months, and {result.differenceDays} days</strong>.
                </>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 uppercase">Total Difference in Days</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {result.totalDaysDifference.toLocaleString()} Days
              </div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-500 uppercase">Total Difference in Weeks</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {result.totalWeeksDifference.toLocaleString()} Weeks
              </div>
            </div>
          </div>

          <SocialShare
            title="Age Difference Calculator"
            url="/age-difference-calculator"
            resultText={`Age Difference: ${result.differenceYears} Years, ${result.differenceMonths} Months, and ${result.differenceDays} Days (${result.totalDaysDifference.toLocaleString()} total days)!`}
          />
        </div>
      )}
    </div>
  );
}
