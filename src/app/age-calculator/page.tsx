import React from 'react';
import { Metadata } from 'next';
import { CheckCircle2 } from 'lucide-react';
import MainAgeCalculator from '@/components/calculators/MainAgeCalculator';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQAccordion from '@/components/ui/FAQAccordion';
import AdSlot from '@/components/AdSlot';
import SocialShare from '@/components/SocialShare';
import { WebApplicationJsonLd, FaqJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Age Calculator – Calculate Age in Years, Months & Days',
  description:
    'Calculate your exact age in years, months, and days from your date of birth. View detailed breakdown in weeks, days, hours, and minutes with custom target date options.',
  alternates: {
    canonical: '/age-calculator/'
  },
  openGraph: {
    title: 'Age Calculator – Calculate Age in Years, Months & Days',
    description: 'Calculate your exact age in years, months, and days with full calendar precision.',
    url: `${SITE_CONFIG.domain}/age-calculator/`,
    type: 'website',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Age Calculator – Calculate Age in Years, Months & Days',
    description: 'Calculate your exact age in years, months, and days with full calendar precision.',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  }
};

const FAQS = [
  {
    question: 'How does the Age Calculator compute age in years, months, and days?',
    answer:
      'The calculator computes exact age by subtracting your birth date from the calculation date using true calendar arithmetic. When borrowing days, it uses the exact day count of the preceding month (accounting for leap years) rather than a fixed 30-day approximation.'
  },
  {
    question: 'Can I find how old I will be on a specific future date?',
    answer:
      'Yes. Toggle "Change Date" next to the Age As Of Date input and select any future milestone date (for example, your retirement year, graduation day, or an anniversary).'
  },
  {
    question: 'Why do some age calculators show different day counts?',
    answer:
      'Many basic calculators divide total elapsed days by 365.25 or 30.41, which creates fractional errors. Our calculator performs true calendar-date subtraction, guaranteeing 100% calendar accuracy.'
  }
];

export default function AgeCalculatorPage() {
  return (
    <>
      <WebApplicationJsonLd
        name="Age Calculator – Years, Months & Days"
        description="Calculate your exact age in years, months, and days with custom calculation dates."
        url="/age-calculator/"
        applicationCategory="UtilityApplication"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Age Calculator', item: '/age-calculator/' }
        ]}
      />
      <FaqJsonLd items={FAQS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: 'Age Calculators', href: '/' },
            { name: 'Age Calculator', href: '/age-calculator/' }
          ]}
        />

        <div className="max-w-4xl mx-auto mt-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Age Calculator
            </h1>
            <p className="mt-2 text-base text-slate-600 max-w-xl mx-auto">
              Calculate your precise age from date of birth with full calendar accuracy. Compute age as of today or on any custom target date.
            </p>
          </div>

          <MainAgeCalculator />

          <AdSlot slotId="age-calc-mid" format="horizontal" />

          {/* Educational Content */}
          <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Understanding Accurate Age Calculation
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              When answering the question &quot;How old am I?&quot;, most people state only their completed years. However, in legal, medical, educational, and international contexts (such as visa applications, school admissions, and clinical trials), exact age in years, months, and days is required.
            </p>

            <h3 className="text-base font-bold text-slate-800">
              Key Factors in Precision Date Math
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Varying Month Lengths:</strong> Months have 28, 29, 30, or 31 days. Subtraction requires borrowing from the exact preceding month.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Leap Years:</strong> A Gregorian leap year contains 366 days instead of 365, occurring every 4 years (unless the century year is not divisible by 400).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Timezone Independence:</strong> Calculations are date-only calendar values to avoid daylight savings shifts.
                </span>
              </li>
            </ul>
          </div>

          <SocialShare
            title="Age Calculator – Exact Years, Months & Days"
            url="/age-calculator/"
            className="mt-6"
          />

          <FAQAccordion items={FAQS} />
        </div>
      </div>
    </>
  );
}
