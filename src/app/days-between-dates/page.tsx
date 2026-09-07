import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Briefcase, Sun, CalendarRange } from 'lucide-react';
import DaysBetweenDates from '@/components/calculators/DaysBetweenDates';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedCalculators from '@/components/RelatedCalculators';
import FAQAccordion from '@/components/ui/FAQAccordion';
import AdSlot from '@/components/AdSlot';
import SocialShare from '@/components/SocialShare';
import { WebApplicationJsonLd, FaqJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Days Between Dates Calculator – Count Days & Business Days',
  description:
    'Calculate the exact number of days, weeks, business days, and weekends between any two dates. Free online date interval calculator with inclusive counting options.',
  alternates: {
    canonical: '/days-between-dates/'
  },
  openGraph: {
    title: 'Days Between Dates Calculator – Date Interval & Business Days',
    description: 'Calculate total days, weeks, business days, and weekends between any two calendar dates.',
    url: `${SITE_CONFIG.domain}/days-between-dates/`,
    type: 'website',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Days Between Dates Calculator – Workdays & Intervals',
    description: 'Calculate total days, weeks, business days, and weekends between two dates.',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  }
};

const FAQS = [
  {
    question: 'What is the difference between inclusive and exclusive date counting?',
    answer:
      'Exclusive counting (standard) measures the exact duration elapsed from start to end without counting the final day itself (e.g., Monday to Tuesday is 1 day). Inclusive counting includes both the start and end dates (Monday to Tuesday is 2 days).'
  },
  {
    question: 'How are business days calculated?',
    answer:
      'Business days represent working days from Monday through Friday. Saturday and Sunday are categorized as weekend days and omitted from the business day count.'
  },
  {
    question: 'How many days are in a year with leap days?',
    answer:
      'A standard calendar year contains 365 days (52 weeks and 1 day), while a leap year contains 366 days (52 weeks and 2 days).'
  },
  {
    question: 'How do leap years affect the total day count between dates?',
    answer:
      'If the interval between your start and end dates spans February 29 of a leap year, an extra day is automatically added to the total calendar days.'
  }
];

export default function DaysBetweenDatesPage() {
  return (
    <>
      <WebApplicationJsonLd
        name="Days Between Dates Calculator"
        description="Calculate total days, weeks, business days, and duration between two dates."
        url="/days-between-dates/"
        applicationCategory="UtilityApplication"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Days Between Dates', item: '/days-between-dates/' }
        ]}
      />
      <FaqJsonLd items={FAQS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: 'Age Calculators', href: '/' },
            { name: 'Days Between Dates', href: '/days-between-dates/' }
          ]}
        />

        <div className="max-w-4xl mx-auto mt-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Days Between Dates Calculator
            </h1>
            <p className="mt-2 text-base text-slate-600 max-w-xl mx-auto">
              Calculate the total days, business days, weekends, and calendar span between two dates with optional inclusive counting.
            </p>
          </div>

          <DaysBetweenDates />

          <AdSlot slotId="days-mid" format="horizontal" />

          {/* Educational Guide */}
          <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Applications of Date Interval Math
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Measuring the exact number of days between two dates is essential for project management sprint planning, legal statutory filing deadlines, interest rate calculations, rent prorations, and personal event countdowns.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <span>Work & Project Deadlines</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Exclude Saturdays and Sundays to measure actionable business working days for deliverables.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-600" />
                  <span>Vacation & Event Duration</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Use the inclusive counting toggle to include both departure and return dates for complete trip days.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CalendarRange className="w-4 h-4 text-teal-600" />
                  <span>Contracts & Invoicing</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Determine exact payment net-30, net-60, or prorated billing periods with complete calendar precision.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="text-slate-600">Need full time breakdowns including hours and minutes?</span>
              <Link
                href="/date-difference-calculator/"
                className="font-bold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
              >
                <span>Date Difference Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <SocialShare
            title="Days Between Dates Calculator – Exact Interval & Business Days"
            url="/days-between-dates/"
            className="mt-6"
          />

          <FAQAccordion items={FAQS} />

          {/* Related Tools Internal Linking Grid */}
          <RelatedCalculators currentSlug="/days-between-dates" />
        </div>
      </div>
    </>
  );
}
