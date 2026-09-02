import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import AgeDifferenceCalculator from '@/components/calculators/AgeDifferenceCalculator';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQAccordion from '@/components/ui/FAQAccordion';
import AdSlot from '@/components/AdSlot';
import SocialShare from '@/components/SocialShare';
import { WebApplicationJsonLd, FaqJsonLd } from '@/components/JsonLd';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Age Difference Calculator – Calculate the Exact Age Difference',
  description:
    'Calculate the exact age difference between two people in years, months, and days. Accurate calendar calculation for couples, siblings, and friends.',
  alternates: {
    canonical: '/age-difference-calculator/'
  },
  openGraph: {
    title: 'Age Difference Calculator – Exact Gap in Years, Months & Days',
    description: 'Compare two birth dates to see who is older and calculate the exact difference in years, months, and days.',
    url: `${SITE_CONFIG.domain}/age-difference-calculator/`,
    type: 'website',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Age Difference Calculator – Compare Two Ages',
    description: 'Compare two birth dates to see who is older and calculate the exact difference in years, months, and days.',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  }
};

const FAQS = [
  {
    question: 'How is age difference calculated between two individuals?',
    answer:
      'The age difference is computed by determining which person was born earlier and then performing calendar subtraction from the later birth date to the earlier birth date. This produces an exact result in years, months, and days.'
  },
  {
    question: 'Can I calculate the age difference for couples or siblings?',
    answer:
      'Yes. Simply enter Person A’s and Person B’s dates of birth. You can also label their names for an easily readable and shareable report.'
  },
  {
    question: 'Does age difference change over time?',
    answer:
      'No. The absolute age difference in calendar days, months, and years remains constant throughout life because birth dates never change.'
  }
];

export default function AgeDifferencePage() {
  return (
    <>
      <WebApplicationJsonLd
        name="Age Difference Calculator"
        description="Calculate the exact age difference between two people in years, months, and days."
        url="/age-difference-calculator/"
        applicationCategory="UtilityApplication"
      />
      <FaqJsonLd items={FAQS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: 'Age Calculators', href: '/' },
            { name: 'Age Difference Calculator', href: '/age-difference-calculator/' }
          ]}
        />

        <div className="max-w-4xl mx-auto mt-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Age Difference Calculator
            </h1>
            <p className="mt-2 text-base text-slate-600 max-w-xl mx-auto">
              Compare two birth dates to find the exact age gap in years, months, days, and total days lived.
            </p>
          </div>

          <AgeDifferenceCalculator />

          <AdSlot slotId="diff-mid" format="horizontal" />

          {/* Educational Content */}
          <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Understanding Age Gap Arithmetic
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              When comparing two people’s ages, estimating by birth year alone can lead to an error of up to 11 months. For example, two people born in 1990 (one in January, one in December) have almost an entire year of age difference, even though simple year subtraction yields zero.
            </p>

            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2">
              <div className="font-bold text-indigo-900 text-sm">Example Calculation:</div>
              <p className="text-xs text-slate-700 leading-relaxed">
                If Person A was born on <strong>January 1, 1990</strong> and Person B was born on <strong>June 15, 1995</strong>, our engine calculates:
                <br />
                <strong>5 Years, 5 Months, and 14 Days</strong> (equal to 1,991 total days).
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="text-slate-600">Need to calculate date duration between non-birth dates?</span>
              <Link
                href="/date-difference-calculator/"
                className="font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                <span>Date Difference Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <SocialShare
            title="Age Difference Calculator"
            url="/age-difference-calculator/"
            className="mt-6"
          />

          <FAQAccordion items={FAQS} />
        </div>
      </div>
    </>
  );
}
