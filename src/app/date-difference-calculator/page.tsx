import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import DateDifferenceCalculator from '@/components/calculators/DateDifferenceCalculator';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQAccordion from '@/components/ui/FAQAccordion';
import AdSlot from '@/components/AdSlot';
import SocialShare from '@/components/SocialShare';
import { WebApplicationJsonLd, FaqJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Date Difference Calculator – Calculate Exact Time Between Two Dates',
  description:
    'Find the exact difference between any two dates in years, months, days, weeks, hours, and minutes. Free online calendar duration calculator.',
  alternates: {
    canonical: '/date-difference-calculator/'
  },
  openGraph: {
    title: 'Date Difference Calculator – Time Duration Between Two Dates',
    description: 'Calculate duration between two dates across years, months, days, weeks, and hours.',
    url: `${SITE_CONFIG.domain}/date-difference-calculator/`,
    type: 'website',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Date Difference Calculator – Multi-Unit Duration',
    description: 'Calculate duration between two dates across years, months, days, weeks, and hours.',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  }
};

const FAQS = [
  {
    question: 'How does the Date Difference Calculator measure duration?',
    answer:
      'The calculator computes exact calendar duration by taking the earlier date and performing borrow-subtraction up to the later date, providing exact elapsed years, months, days, and total days.'
  },
  {
    question: 'Can I calculate the duration between past dates?',
    answer:
      'Yes. You can enter any two historical dates (e.g., historical event spans, anniversary dates, employment tenures) to measure exact duration.'
  },
  {
    question: 'Does this calculator handle reverse date entries?',
    answer:
      'Yes. If the end date is entered earlier than the start date, our engine automatically normalizes the interval and accurately calculates the positive span between them.'
  }
];

export default function DateDifferencePage() {
  return (
    <>
      <WebApplicationJsonLd
        name="Date Difference Calculator"
        description="Compute exact time and duration between two dates across multiple units."
        url="/date-difference-calculator/"
        applicationCategory="UtilityApplication"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Date Difference Calculator', item: '/date-difference-calculator/' }
        ]}
      />
      <FaqJsonLd items={FAQS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: 'Age Calculators', href: '/' },
            { name: 'Date Difference Calculator', href: '/date-difference-calculator/' }
          ]}
        />

        <div className="max-w-4xl mx-auto mt-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Date Difference Calculator
            </h1>
            <p className="mt-2 text-base text-slate-600 max-w-xl mx-auto">
              Find the exact time difference and duration between any two calendar dates in years, months, days, weeks, and hours.
            </p>
          </div>

          <DateDifferenceCalculator />

          <AdSlot slotId="datediff-mid" format="horizontal" />

          {/* Educational Content */}
          <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Why Calendar Intervals Matter
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              In business contracts, employment tenures, real estate leases, and legal statute of limitations, date differences must accurately reflect both true calendar components (such as 3 years and 4 months) and discrete day counts (such as 1,218 days). Our calculation engine guarantees full Gregorian fidelity.
            </p>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="text-slate-600">Want to measure age from birth date instead?</span>
              <Link
                href="/age-calculator/"
                className="font-bold text-violet-700 hover:text-violet-800 inline-flex items-center gap-1"
              >
                <span>Try Main Age Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <SocialShare
            title="Date Difference Calculator – Calculate Time Between Two Dates"
            url="/date-difference-calculator/"
            className="mt-6"
          />

          <FAQAccordion items={FAQS} />
        </div>
      </div>
    </>
  );
}
