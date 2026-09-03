import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar, Search, BookOpen } from 'lucide-react';
import DateOfBirthCalculator from '@/components/calculators/DateOfBirthCalculator';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedCalculators from '@/components/RelatedCalculators';
import FAQAccordion from '@/components/ui/FAQAccordion';
import AdSlot from '@/components/AdSlot';
import SocialShare from '@/components/SocialShare';
import { WebApplicationJsonLd, FaqJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Date of Birth Calculator – Find Your Birth Date From Age',
  description:
    'Estimate your possible date of birth by entering your age in years, months, and days. Fast, accurate reverse birthday lookup tool.',
  alternates: {
    canonical: '/date-of-birth-calculator/'
  },
  openGraph: {
    title: 'Date of Birth Calculator – Reverse Birth Date Lookup',
    description: 'Estimate date of birth from known age in years, months, and days with calendar borrow subtraction.',
    url: `${SITE_CONFIG.domain}/date-of-birth-calculator/`,
    type: 'website',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Date of Birth Calculator – Reverse Age Lookup',
    description: 'Estimate date of birth from known age in years, months, and days.',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  }
};

const FAQS = [
  {
    question: 'How does a Date of Birth Calculator estimate birth date from age?',
    answer:
      'The calculator performs reverse calendar subtraction by taking a reference date (such as today) and subtracting the specified number of days, months, and years while correctly borrowing calendar days from preceding months.'
  },
  {
    question: 'Why might an estimated birth date vary by one day?',
    answer:
      'Because months have variable lengths (28, 29, 30, and 31 days) and leap years occur quadrennially, subtracting an approximate age without knowing the exact calendar month boundaries can occasionally result in a 1-day variance. Our tool accounts for preceding month lengths accurately.'
  },
  {
    question: 'Can I find a birth date for someone whose exact birthday was forgotten?',
    answer:
      'Yes. If you know their age from a specific date (for example on a past medical record, legal document, or census entry), you can enter that age and reference date to find their exact birth date.'
  },
  {
    question: 'What is the reverse date calculation formula?',
    answer:
      'Birth Date = Reference Date - (Years, Months, Days). Subtraction starts with days (borrowing days from the previous month if necessary), then months (borrowing 12 months from the year if necessary), and finally years.'
  }
];

export default function DateOfBirthPage() {
  return (
    <>
      <WebApplicationJsonLd
        name="Date of Birth Calculator"
        description="Estimate date of birth from current age in years, months, and days."
        url="/date-of-birth-calculator/"
        applicationCategory="UtilityApplication"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Date of Birth Calculator', item: '/date-of-birth-calculator/' }
        ]}
      />
      <FaqJsonLd items={FAQS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: 'Age Calculators', href: '/' },
            { name: 'Date of Birth Calculator', href: '/date-of-birth-calculator/' }
          ]}
        />

        <div className="max-w-4xl mx-auto mt-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Date of Birth Calculator
            </h1>
            <p className="mt-2 text-base text-slate-600 max-w-xl mx-auto">
              Reverse age calculator: enter your known age in years, months, and days to calculate your estimated birth date.
            </p>
          </div>

          <DateOfBirthCalculator />

          <AdSlot slotId="dob-mid" format="horizontal" />

          {/* Educational Section */}
          <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              When Is a Reverse DOB Calculator Useful?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              A reverse date of birth calculator is invaluable in genealogy research, historical document analysis, medical intake forms, and legal record verification where only an age on a specific date is recorded rather than a complete date of birth.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-amber-600" />
                  <span>Genealogy & Ancestry</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Deduce exact birth years from gravestones, census records, and obituaries stating age in years/months.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Historical Documents</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Verify historical birth dates from old military enlistment papers or immigration manifests.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Medical Intake Forms</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cross-reference patient recorded ages against clinical registration dates for accuracy.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="text-slate-600">Want to calculate forward from date of birth instead?</span>
              <Link
                href="/age-calculator/"
                className="font-bold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1"
              >
                <span>Go to Age Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <SocialShare
            title="Date of Birth Calculator – Reverse Birth Date Lookup"
            url="/date-of-birth-calculator/"
            className="mt-6"
          />

          <FAQAccordion items={FAQS} />

          {/* Related Tools Internal Linking Grid */}
          <RelatedCalculators currentSlug="/date-of-birth-calculator" />
        </div>
      </div>
    </>
  );
}
