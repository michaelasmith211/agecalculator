import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  Calculator,
  ArrowRight,
  Calendar,
  HelpCircle
} from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedCalculators from '@/components/RelatedCalculators';
import AgeReferenceTable from '@/components/ui/AgeReferenceTable';
import SocialShare from '@/components/SocialShare';
import { FaqJsonLd, ArticleJsonLd, HowToJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'How to Calculate Age – Formulas, Leap Years & Math Guide',
  description:
    'Comprehensive guide on calculating age manually and digitally. Learn the exact mathematical formulas for year, month, and day subtraction with calendar borrow rules.',
  alternates: {
    canonical: '/how-to-calculate-age/'
  },
  openGraph: {
    title: 'How to Calculate Age – Formulas, Step-by-Step Examples & Leap Years',
    description: 'Learn the exact mathematical formulas for calculating chronological age with month borrowing and leap day adjustments.',
    url: `${SITE_CONFIG.domain}/how-to-calculate-age/`,
    type: 'article',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Calculate Age – Step-by-Step Mathematical Guide',
    description: 'Master manual calendar subtraction, day borrowing, and leap year calculations.',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  }
};

const HOW_TO_STEPS = [
  {
    name: 'Subtract Days',
    text: 'Subtract the birth day from the target day. If target day is smaller, borrow 1 month and add the exact day count of the preceding calendar month (28, 29, 30, or 31).'
  },
  {
    name: 'Subtract Months',
    text: 'Subtract the birth month from the adjusted target month. If target month is smaller, borrow 1 year (12 months) from the target year.'
  },
  {
    name: 'Subtract Years',
    text: 'Subtract the birth year from the adjusted target year to determine the total completed calendar years.'
  }
];

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
  },
  {
    question: 'What is the formula for calculating total days lived?',
    answer:
      'Total Days = (Completed Common Years × 365) + (Completed Leap Years × 366) + (Days in Incomplete Year). Alternatively, subtract Julian Day Numbers (JDN).'
  }
];

export default function HowToCalculateAgePage() {
  return (
    <>
      <ArticleJsonLd
        headline="How to Calculate Age: Formulas, Step-by-Step Algorithm & Calendar Math"
        description="Comprehensive mathematical guide to manual date subtraction, calendar borrowing, leap year calculations, and precision time units."
        url="/how-to-calculate-age/"
      />
      <HowToJsonLd
        name="How to Calculate Exact Age Manually"
        description="Learn how to calculate exact chronological age in years, months, and days using standard calendar borrow subtraction."
        steps={HOW_TO_STEPS}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'How to Calculate Age', item: '/how-to-calculate-age/' }
        ]}
      />
      <FaqJsonLd items={FAQS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: 'Calculators & Guides', href: '/' },
            { name: 'How to Calculate Age', href: '/how-to-calculate-age/' }
          ]}
        />

        <article className="max-w-4xl mx-auto mt-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-10 shadow-xs">
          {/* Header */}
          <header className="space-y-4 text-center sm:text-left border-b border-slate-100 pb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Complete Educational Guide</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              How to Calculate Age: The Complete Mathematical Guide
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
              Master the exact calendar arithmetic formulas, month-borrowing rules, leap year logic, and manual algorithms used to compute exact chronological age.
            </p>
          </header>

          {/* Quick CTA to Calculator */}
          <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="font-bold text-slate-900 text-base">Want instant calculation without manual math?</div>
              <p className="text-xs text-slate-600">Our free online engine computes years, months, and days in under 1 millisecond.</p>
            </div>
            <Link
              href="/age-calculator/"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-xs transition-all inline-flex items-center gap-1.5 shrink-0"
            >
              <span>Use Online Calculator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Section 1: The Problem with Simple Subtraction */}
          <section className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              <span>1. Why Simple Year Subtraction Fails</span>
            </h2>
            <p>
              The most frequent error in age calculation is subtracting only the birth year from the current year (e.g. <code>2026 - 1990 = 36</code>). This equation assumes that the individual has already celebrated their birthday in the current calendar year.
            </p>
            <p>
              If a person was born on <strong>November 20, 1990</strong>, and today is <strong>September 2, 2026</strong>, their 36th birthday is still over two months away. They are strictly <strong>35 years, 9 months, and 13 days old</strong>.
            </p>
          </section>

          {/* Section 2: Step-by-Step Manual Algorithm */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calculator className="w-6 h-6 text-indigo-600" />
              <span>2. The 3-Step Manual Calculation Algorithm</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              To calculate age manually on paper, arrange the target date on top and the birth date below in <code>[Year] [Month] [Day]</code> columns, then subtract from right to left (Days → Months → Years):
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="text-blue-600 font-extrabold text-lg">Step 1: Days</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Subtract birth day from target day. If negative, borrow 1 month from the target month column and add the exact day count of the preceding month (28, 29, 30, or 31).
                </p>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="text-blue-600 font-extrabold text-lg">Step 2: Months</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Subtract birth month from adjusted target month. If negative, borrow 1 year from the target year column and add 12 to the month value.
                </p>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="text-blue-600 font-extrabold text-lg">Step 3: Years</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Subtract birth year from adjusted target year. The result gives the final exact age in completed years, months, and days.
                </p>
              </div>
            </div>

            {/* Worked Walkthrough Card */}
            <div className="p-6 bg-slate-900 text-slate-100 rounded-2xl space-y-4 font-mono text-xs sm:text-sm">
              <div className="text-emerald-400 font-bold uppercase tracking-wider text-xs">Worked Example</div>
              <div className="space-y-1">
                <div>Target Date: 2026 Sept 02  → (Adjusted: 2025 Years, 20 Months, 33 Days)</div>
                <div>Birth Date:  1998 Nov  15  → (1998 Years, 11 Months, 15 Days)</div>
                <div className="pt-2 border-t border-slate-700 text-amber-300 font-bold">
                  Difference:  27 Years, 9 Months, 18 Days
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Preceding Month Days Table */}
          <section className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-6 h-6 text-teal-600" />
              <span>3. Days Borrowed by Month Table</span>
            </h2>
            <p>
              When borrowing days in Step 1, you must look up the exact number of days in the month immediately preceding the target calculation month:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 font-bold text-slate-900">
                  <tr>
                    <th className="p-3 border-b border-slate-200">Target Month</th>
                    <th className="p-3 border-b border-slate-200">Preceding Month</th>
                    <th className="p-3 border-b border-slate-200">Days Borrowed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr><td className="p-3 font-medium">January</td><td className="p-3">December</td><td className="p-3 font-bold text-blue-600">31 Days</td></tr>
                  <tr><td className="p-3 font-medium">March</td><td className="p-3">February</td><td className="p-3 font-bold text-blue-600">28 Days (29 in Leap Year)</td></tr>
                  <tr><td className="p-3 font-medium">May</td><td className="p-3">April</td><td className="p-3 font-bold text-blue-600">30 Days</td></tr>
                  <tr><td className="p-3 font-medium">September</td><td className="p-3">August</td><td className="p-3 font-bold text-blue-600">31 Days</td></tr>
                  <tr><td className="p-3 font-medium">November</td><td className="p-3">October</td><td className="p-3 font-bold text-blue-600">31 Days</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Reference Lookup Table */}
          <AgeReferenceTable />

          <SocialShare
            title="How to Calculate Age – Formulas, Algorithms & Math Guide"
            url="/how-to-calculate-age/"
          />

          {/* Related Tools Internal Linking Grid */}
          <RelatedCalculators currentSlug="/how-to-calculate-age" />
        </article>
      </div>
    </>
  );
}
