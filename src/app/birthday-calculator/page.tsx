import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles, CalendarDays, Heart } from 'lucide-react';
import BirthdayCalculator from '@/components/calculators/BirthdayCalculator';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedCalculators from '@/components/RelatedCalculators';
import FAQAccordion from '@/components/ui/FAQAccordion';
import AdSlot from '@/components/AdSlot';
import SocialShare from '@/components/SocialShare';
import { WebApplicationJsonLd, FaqJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Birthday Calculator – Find Your Next Birthday & Milestones',
  description:
    'Use our free Birthday Calculator to discover how many days remain until your next birthday, what day of the week you were born on, and key milestone ages.',
  alternates: {
    canonical: '/birthday-calculator/'
  },
  openGraph: {
    title: 'Birthday Calculator – Find Your Next Birthday & Milestones',
    description: 'Find days until your next birthday, your birth weekday, and a complete milestone calendar.',
    url: `${SITE_CONFIG.domain}/birthday-calculator/`,
    type: 'website',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Birthday Calculator – Next Birthday Countdown & Milestones',
    description: 'Find days until your next birthday, your birth weekday, and a complete milestone calendar.',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  }
};

const FAQS = [
  {
    question: 'How many days are left until my next birthday?',
    answer:
      'Our birthday calculator computes the exact number of calendar days between today and your next birthday, taking into account leap days and differing month lengths.'
  },
  {
    question: 'How do I find out what day of the week I was born on?',
    answer:
      'Enter your date of birth into the calculator above. The engine calculates the day of the week (Sunday through Saturday) using the Gregorian calendar index.'
  },
  {
    question: 'What are considered milestone birthdays?',
    answer:
      'Common milestone birthdays include ages 1, 16 (driving eligibility in many jurisdictions), 18 (adulthood), 21 (full legal adulthood), 30, 40, 50 (golden milestone), 60, 65 (traditional retirement), and 100 (centenarian).'
  },
  {
    question: 'Why does my birthday shift weekdays each year?',
    answer:
      'A standard calendar year contains 365 days, which equals 52 weeks plus 1 day. Therefore, your birthday advances by 1 day of the week each non-leap year. In a leap year (after February 28), it advances by 2 days.'
  }
];

export default function BirthdayCalculatorPage() {
  return (
    <>
      <WebApplicationJsonLd
        name="Birthday Calculator"
        description="Find days until your next birthday and see your complete milestone birthday schedule."
        url="/birthday-calculator/"
        applicationCategory="UtilityApplication"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Birthday Calculator', item: '/birthday-calculator/' }
        ]}
      />
      <FaqJsonLd items={FAQS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: 'Age Calculators', href: '/' },
            { name: 'Birthday Calculator', href: '/birthday-calculator/' }
          ]}
        />

        <div className="max-w-4xl mx-auto mt-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Birthday Calculator
            </h1>
            <p className="mt-2 text-base text-slate-600 max-w-xl mx-auto">
              Find your next birthday, countdown remaining days, discover your birth weekday, and plan future milestone celebrations.
            </p>
          </div>

          <BirthdayCalculator />

          <AdSlot slotId="bday-mid" format="horizontal" />

          {/* Educational Content */}
          <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Why Track Birthday Milestones?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every birthday marks the completion of another solar cycle around the sun. Tracking milestone birthdays helps individuals plan major life events, retirement transitions, legal age thresholds, and memorable celebrations with family and friends.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-pink-600" />
                  <span>Solar Alignment</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Because a solar year is ~365.2422 days, the astronomical moment of birth shifts by ~6 hours each non-leap year.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-indigo-600" />
                  <span>Weekday Rotation</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  In non-leap years, your birthday advances by 1 weekday. In leap years, it advances by 2 weekdays.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>Milestone Ages</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Plan ahead for key landmark celebrations at ages 18, 21, 30, 40, 50, 60, 65, and 100.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="font-medium text-slate-700">Looking for a live ticking timer?</span>
              <Link
                href="/birthday-countdown/"
                className="inline-flex items-center gap-1.5 font-bold text-pink-600 hover:text-pink-700"
              >
                <span>Try Live Birthday Countdown</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <SocialShare
            title="Birthday Calculator – Next Birthday & Milestones"
            url="/birthday-calculator/"
            className="mt-6"
          />

          <FAQAccordion items={FAQS} />

          {/* Related Tools Internal Linking Grid */}
          <RelatedCalculators currentSlug="/birthday-calculator" />
        </div>
      </div>
    </>
  );
}
