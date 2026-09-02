import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQAccordion from '@/components/ui/FAQAccordion';
import AgeReferenceTable from '@/components/ui/AgeReferenceTable';
import AdSlot from '@/components/AdSlot';
import { FaqJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'How to Calculate Age – Formulas, Leap Years & Math Guide',
  description:
    'Comprehensive guide on calculating age manually and digitally. Learn the exact mathematical formulas for year, month, and day subtraction with calendar borrow rules.',
  alternates: {
    canonical: '/how-to-calculate-age'
  }
};

const FAQS = [
  {
    question: 'Why can’t I just subtract birth year from current year?',
    answer:
      'Subtracting only the birth year (e.g. 2026 - 1990 = 36) assumes your birthday has already occurred this year. If your birthday is in November and today is September, you are still 35 years old. Full calendar subtraction is required.'
  },
  {
    question: 'How do you borrow days from preceding months when subtracting dates?',
    answer:
      'If the target day is smaller than the birth day, borrow 1 month from the target month and add the exact number of days from the month immediately before the target month (e.g. 31 days for August, 30 for April, 28/29 for February).'
  },
  {
    question: 'How do leap years affect age calculations?',
    answer:
      'Leap years add a 366th day (February 29) to the calendar every 4 years (unless the century year is not divisible by 400). This affects total days lived and the weekday on which your birthday falls.'
  }
];

export default function HowToCalculateAgePage() {
  return (
    <>
      <FaqJsonLd items={FAQS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: 'Resources', href: '/' },
            { name: 'How to Calculate Age', href: '/how-to-calculate-age' }
          ]}
        />

        <article className="max-w-4xl mx-auto mt-4 space-y-10">
          <header className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Authoritative Calculation Guide</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              How to Calculate Age
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
              A comprehensive mathematical reference explaining manual date subtraction, calendar borrowing algorithms, leap year adjustments, and precision time units.
            </p>
          </header>

          <AdSlot slotId="guide-top" format="horizontal" />

          {/* Section 1: The Core Formula */}
          <section id="guide" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              1. The Fundamental Age Calculation Formula
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              At its simplest, chronological age is the elapsed calendar duration between a starting date (Date of Birth) and an ending date (Reference Date / Today).
            </p>

            <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-sm overflow-x-auto">
              <code>
                Age = Target Date (Year, Month, Day) - Birth Date (Year, Month, Day)
              </code>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Because years, months, and days have non-uniform lengths, subtraction must proceed from right to left (Days → Months → Years), applying calendar borrowing when necessary.
            </p>
          </section>

          {/* Section 2: Step-by-Step Algorithm */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">
              2. The Step-by-Step Manual Subtraction Algorithm
            </h2>

            <div className="space-y-6">
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                  Step 1: Subtract Days
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Calculate <code>Target Day - Birth Day</code>:
                </p>
                <ul className="list-disc list-inside text-xs text-slate-600 pl-2 space-y-1">
                  <li>If <code>Target Day &gt;= Birth Day</code>, the day difference is positive.</li>
                  <li>
                    If <code>Target Day &lt; Birth Day</code>, subtract 1 from the Target Month and add the exact number of days in the month <em>preceding</em> the target month.
                  </li>
                </ul>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                  Step 2: Subtract Months
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Calculate <code>Target Month - Birth Month</code>:
                </p>
                <ul className="list-disc list-inside text-xs text-slate-600 pl-2 space-y-1">
                  <li>If <code>Target Month &gt;= Birth Month</code>, the month difference is positive.</li>
                  <li>
                    If <code>Target Month &lt; Birth Month</code>, subtract 1 from Target Year and add 12 to the Target Month.
                  </li>
                </ul>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                  Step 3: Subtract Years
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Calculate <code>Target Year - Birth Year</code> to find the completed full calendar years.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Detailed Real-World Example */}
          <section className="bg-blue-50/70 border border-blue-200 rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold text-blue-950">
              3. Worked Example: Birth Date Jan 15, 2000 to Sept 2, 2026
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm bg-white rounded-xl border border-blue-200">
                <thead>
                  <tr className="bg-blue-100 text-blue-900 font-bold border-b border-blue-200">
                    <th className="p-3">Component</th>
                    <th className="p-3">Calculation Target</th>
                    <th className="p-3">Birth Date</th>
                    <th className="p-3">Borrow Adjustment</th>
                    <th className="p-3">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  <tr>
                    <td className="p-3 font-semibold">Days</td>
                    <td className="p-3">2</td>
                    <td className="p-3">15</td>
                    <td className="p-3">Borrow 31 days (from August) → 2 + 31 = 33</td>
                    <td className="p-3 font-bold text-blue-700">18 Days (33 - 15)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Months</td>
                    <td className="p-3">9 (adjusted to 8)</td>
                    <td className="p-3">1</td>
                    <td className="p-3">No borrow needed</td>
                    <td className="p-3 font-bold text-blue-700">7 Months (8 - 1)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Years</td>
                    <td className="p-3">2026</td>
                    <td className="p-3">2000</td>
                    <td className="p-3">No borrow needed</td>
                    <td className="p-3 font-bold text-blue-700">26 Years (2026 - 2000)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm font-semibold text-blue-950 pt-2">
              Final Chronological Age: Exactly 26 Years, 7 Months, and 18 Days (9,727 Days).
            </p>
          </section>

          {/* Reference Table */}
          <AgeReferenceTable />

          {/* Section 4: Leap Years & February 29 */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              4. How Leap Years Affect Age
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              In the Gregorian calendar, a leap year occurs every year divisible by 4, except for end-of-century years which must be divisible by 400 (e.g. 2000 was a leap year, but 1900 and 2100 are not).
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              When counting total days lived, every passed February 29 adds an extra day to a person’s lifetime total. For leaplings born on February 29, in common years their official age increments on March 1 (or February 28 depending on local statutory law).
            </p>

            <div className="pt-4 flex items-center gap-3">
              <Link
                href="/age-calculator"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all text-sm"
              >
                <span>Calculate Your Exact Age Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          <FAQAccordion items={FAQS} />
        </article>
      </div>
    </>
  );
}
