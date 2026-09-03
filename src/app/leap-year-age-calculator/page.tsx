import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Compass, Calendar, Award } from 'lucide-react';
import LeapYearCalculator from '@/components/calculators/LeapYearCalculator';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedCalculators from '@/components/RelatedCalculators';
import FAQAccordion from '@/components/ui/FAQAccordion';
import AdSlot from '@/components/AdSlot';
import SocialShare from '@/components/SocialShare';
import { WebApplicationJsonLd, FaqJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Leap Year Age Calculator – Calculate Feb 29 Birthday & Leap Age',
  description:
    'Calculate your quadrennial leap age (number of February 29ths lived) and discover all upcoming Leap Day birthday celebrations for leap year babies.',
  alternates: {
    canonical: '/leap-year-age-calculator/'
  },
  openGraph: {
    title: 'Leap Year Age Calculator – Feb 29 Birthday & Quadrennial Age',
    description: 'Calculate leap year birthday milestones and quadrennial age for February 29 leaplings.',
    url: `${SITE_CONFIG.domain}/leap-year-age-calculator/`,
    type: 'website',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leap Year Age Calculator – February 29 Leaplings',
    description: 'Calculate leap year birthday milestones and quadrennial age for February 29 leaplings.',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  }
};

const FAQS = [
  {
    question: 'What is a "Leapling" or Leap Year Baby?',
    answer:
      'A leapling (or leap year baby) is someone born on February 29 during a leap year. Because February 29 occurs only once every 4 years in the Gregorian calendar, leaplings celebrate their exact calendar date of birth quadrennially.'
  },
  {
    question: 'When is a February 29 birthday celebrated in non-leap years?',
    answer:
      'In common (non-leap) years, leaplings typically celebrate their birthday on either February 28 or March 1. Legally, many jurisdictions recognize age advancement on March 1, while others recognize the final day of February.'
  },
  {
    question: 'How do you calculate Leap Year Age?',
    answer:
      'Leap Year Age is calculated by counting only the actual February 29ths that have elapsed since your birth year. For example, someone turning 28 in 2028 has experienced 7 actual Leap Day birthdays.'
  },
  {
    question: 'What is the Gregorian 400-Year Leap Rule?',
    answer:
      'A year is a leap year if divisible by 4, except for end-of-century years (ending in 00), which are only leap years if evenly divisible by 400 (e.g. 2000 was a leap year, but 1900 was not, and 2100 will not be).'
  }
];

export default function LeapYearAgePage() {
  return (
    <>
      <WebApplicationJsonLd
        name="Leap Year Age Calculator"
        description="Calculate leap year birthday milestones and true quadrennial age."
        url="/leap-year-age-calculator/"
        applicationCategory="UtilityApplication"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Leap Year Age Calculator', item: '/leap-year-age-calculator/' }
        ]}
      />
      <FaqJsonLd items={FAQS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: 'Age Calculators', href: '/' },
            { name: 'Leap Year Age Calculator', href: '/leap-year-age-calculator/' }
          ]}
        />

        <div className="max-w-4xl mx-auto mt-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Leap Year Age Calculator
            </h1>
            <p className="mt-2 text-base text-slate-600 max-w-xl mx-auto">
              Specialized calculator for February 29 leap day babies to compare calendar age against true quadrennial leap birthdays.
            </p>
          </div>

          <LeapYearCalculator />

          <AdSlot slotId="leap-mid" format="horizontal" />

          {/* Educational Content */}
          <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              The Science of Leap Years and Feb 29
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              The Earth takes approximately 365.2422 days to complete an orbit around the Sun. To keep our calendar synchronized with the astronomical seasons, an extra intercalary leap day (February 29) is added to the calendar in years divisible by 4 (with the exception of century years not divisible by 400).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-emerald-600" />
                  <span>Astronomical Drift</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Without leap years, our calendar would drift by approximately 24 days every century.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>1 in 1,461 Odds</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The mathematical probability of being born on February 29 is roughly 1 in 1,461.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Quadrennial Milestone</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every 4 solar years corresponds to exactly one genuine February 29 celebration.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="text-slate-600">Want to see all milestone birthdays?</span>
              <Link
                href="/birthday-calculator/"
                className="font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
              >
                <span>Birthday Milestone Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <SocialShare
            title="Leap Year Age Calculator – February 29 Leap Day Baby"
            url="/leap-year-age-calculator/"
            className="mt-6"
          />

          <FAQAccordion items={FAQS} />

          {/* Related Tools Internal Linking Grid */}
          <RelatedCalculators currentSlug="/leap-year-age-calculator" />
        </div>
      </div>
    </>
  );
}
