import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import RetirementAgeCalculator from '@/components/calculators/RetirementAgeCalculator';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQAccordion from '@/components/ui/FAQAccordion';
import AdSlot from '@/components/AdSlot';
import SocialShare from '@/components/SocialShare';
import { WebApplicationJsonLd, FaqJsonLd } from '@/components/JsonLd';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Retirement Age Calculator – Plan Your Retirement Timeline',
  description:
    'Estimate your projected retirement date and calculate the exact years, months, total days, and working days remaining until your target retirement age.',
  alternates: {
    canonical: '/retirement-age-calculator/'
  },
  openGraph: {
    title: 'Retirement Age Calculator – Plan Your Timeline & Countdown',
    description: 'Estimate your target retirement date and calculate remaining years, months, and working days.',
    url: `${SITE_CONFIG.domain}/retirement-age-calculator/`,
    type: 'website',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Retirement Age Calculator – Retirement Timeline',
    description: 'Estimate your target retirement date and calculate remaining years, months, and working days.',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  }
};

const FAQS = [
  {
    question: 'How is the retirement date calculated?',
    answer:
      'The calculator determines your projected retirement date by adding your chosen retirement age (e.g., 65 or 67) to your birth year and matching your birth month and day.'
  },
  {
    question: 'How are remaining working days estimated?',
    answer:
      'Estimated working days represent typical 5-day workweeks (Monday through Friday) between today and your projected retirement milestone, excluding weekends.'
  },
  {
    question: 'Does this calculator guarantee pension or government benefit eligibility?',
    answer:
      'No. Government pension eligibility rules (such as US Social Security Full Retirement Age, UK State Pension Age, or Australian Age Pension) vary by birth year, legislative changes, and work credit history. This tool provides a personal timeline planning estimation.'
  }
];

export default function RetirementAgePage() {
  return (
    <>
      <WebApplicationJsonLd
        name="Retirement Age Calculator"
        description="Estimate retirement milestone date and count down remaining time."
        url="/retirement-age-calculator/"
        applicationCategory="UtilityApplication"
      />
      <FaqJsonLd items={FAQS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: 'Age Calculators', href: '/' },
            { name: 'Retirement Age Calculator', href: '/retirement-age-calculator/' }
          ]}
        />

        <div className="max-w-4xl mx-auto mt-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Retirement Age Calculator
            </h1>
            <p className="mt-2 text-base text-slate-600 max-w-xl mx-auto">
              Plan your personal timeline: estimate your milestone retirement date and calculate remaining years, months, days, and working days.
            </p>
          </div>

          <RetirementAgeCalculator />

          <AdSlot slotId="retire-mid" format="horizontal" />

          {/* Educational Content & Disclaimer */}
          <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Planning Your Retirement Milestone Timeline
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tracking your exact timeline to retirement enables strategic milestone planning, personal savings pacing, career transition roadmaps, and work-life balance adjustments as you approach your target retirement years.
            </p>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-2.5 text-xs text-slate-700">
              <ShieldAlert className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <strong>Non-Financial Disclaimer:</strong> This calculator is an educational utility tool designed for calendar countdowns and milestone planning. It does not calculate financial returns, annuity payouts, social security benefits, or tax implications. Consult a certified financial planner for individual retirement advice.
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="text-slate-600">Want to calculate your exact current age instead?</span>
              <Link
                href="/age-calculator/"
                className="font-bold text-orange-700 hover:text-orange-800 inline-flex items-center gap-1"
              >
                <span>Main Age Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <SocialShare
            title="Retirement Age Calculator – Retirement Timeline"
            url="/retirement-age-calculator/"
            className="mt-6"
          />

          <FAQAccordion items={FAQS} />
        </div>
      </div>
    </>
  );
}
