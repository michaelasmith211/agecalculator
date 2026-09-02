import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ChronologicalAgeCalculator from '@/components/calculators/ChronologicalAgeCalculator';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQAccordion from '@/components/ui/FAQAccordion';
import AdSlot from '@/components/AdSlot';
import SocialShare from '@/components/SocialShare';
import { WebApplicationJsonLd, FaqJsonLd } from '@/components/JsonLd';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Chronological Age Calculator – Clinical & Academic Age',
  description:
    'Calculate exact chronological age in standardized assessment notation (Years;Months;Days) for psychological testing, speech therapy, and clinical evaluations with prematurity correction.',
  alternates: {
    canonical: '/chronological-age-calculator/'
  },
  openGraph: {
    title: 'Chronological Age Calculator – Clinical Testing & Assessment',
    description: 'Calculate clinical and academic age in standardized notation (YY;MM;DD) with gestational prematurity adjustments.',
    url: `${SITE_CONFIG.domain}/chronological-age-calculator/`,
    type: 'website',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chronological Age Calculator – Clinical Testing Notation',
    description: 'Calculate clinical and academic age in standardized notation (YY;MM;DD).',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  }
};

const FAQS = [
  {
    question: 'What is Chronological Age (CA) in testing and evaluation?',
    answer:
      'Chronological Age is the exact age of a person on the specific day they undergo developmental, psychological, educational, or medical testing. It is commonly formatted as "YY;MM;DD" or "YY-MM-DD".'
  },
  {
    question: 'What is Prematurity Correction (Adjusted Age)?',
    answer:
      'For infants and toddlers born before 37 weeks gestation, an adjusted or corrected age is calculated to ensure developmental milestones and standardized test scores (e.g. Bayley Scales, WPPSI) are evaluated against their expected biological maturity rather than chronological age.'
  },
  {
    question: 'How is clinical chronological age calculated manually?',
    answer:
      'Write the Testing Date on top (Year, Month, Day) and the Date of Birth below. Subtract days first (borrowing 30 days or preceding month days if needed), then subtract months (borrowing 12 months if needed), then subtract years.'
  }
];

export default function ChronologicalAgePage() {
  return (
    <>
      <WebApplicationJsonLd
        name="Chronological Age Calculator"
        description="Standardized clinical and academic chronological age calculator with gestational prematurity adjustment."
        url="/chronological-age-calculator/"
        applicationCategory="UtilityApplication"
      />
      <FaqJsonLd items={FAQS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: 'Age Calculators', href: '/' },
            { name: 'Chronological Age Calculator', href: '/chronological-age-calculator/' }
          ]}
        />

        <div className="max-w-4xl mx-auto mt-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Chronological Age Calculator
            </h1>
            <p className="mt-2 text-base text-slate-600 max-w-xl mx-auto">
              Standardized clinical age computation in standard format (YY;MM;DD) for psychological assessments, pediatric evaluations, and special education testing.
            </p>
          </div>

          <ChronologicalAgeCalculator />

          <AdSlot slotId="chrono-mid" format="horizontal" />

          {/* Educational Clinical Guide */}
          <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Clinical Assessment Standards
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Standardized assessment protocols (including Wechsler Intelligence Scales, Woodcock-Johnson Tests of Cognitive Abilities, Peabody Picture Vocabulary Test, and Vineland Adaptive Behavior Scales) require precise chronological age calculation to reference normed percentile ranks and standard scores.
            </p>

            <div className="p-4 bg-cyan-50/50 border border-cyan-100 rounded-xl space-y-2 text-sm text-slate-700">
              <div className="font-bold text-cyan-900">Notation Convention:</div>
              <p className="text-xs leading-relaxed">
                Standard reporting notation uses semicolons or colons to separate years, months, and days (e.g. <code>7;4;18</code> indicates a child is 7 years, 4 months, and 18 days old).
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="text-slate-600">Looking for general age and birthday tools?</span>
              <Link
                href="/age-calculator/"
                className="font-bold text-cyan-700 hover:text-cyan-800 inline-flex items-center gap-1"
              >
                <span>General Age Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <SocialShare
            title="Chronological Age Calculator – Clinical & Academic Testing"
            url="/chronological-age-calculator/"
            className="mt-6"
          />

          <FAQAccordion items={FAQS} />
        </div>
      </div>
    </>
  );
}
