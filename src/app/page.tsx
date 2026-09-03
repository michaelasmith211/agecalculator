import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Calendar,
  Clock,
  Sparkles,
  Users,
  CalendarRange,
  Cake,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  Smartphone,
  Calculator,
  Globe2,
  Scale
} from 'lucide-react';
import MainAgeCalculator from '@/components/calculators/MainAgeCalculator';
import AgeReferenceTable from '@/components/ui/AgeReferenceTable';
import FAQAccordion from '@/components/ui/FAQAccordion';
import AdSlot from '@/components/AdSlot';
import { WebApplicationJsonLd, FaqJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Age Calculator – Calculate Exact Age in Years, Months & Days',
  description:
    'Free online Age Calculator. Calculate your exact age in years, months, days, and live running seconds. Features birthday countdown, total days lived, and stats.',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Age Calculator – Calculate Exact Age in Years, Months & Days',
    description:
      'Free online Age Calculator. Calculate your exact age in years, months, days, and live running seconds with full calendar precision.',
    url: `${SITE_CONFIG.domain}/`,
    type: 'website',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Age Calculator – Calculate Exact Age Online',
    description:
      'Free online Age Calculator. Calculate your exact age in years, months, days, and live running seconds.',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  }
};

const HOMEPAGE_FAQS = [
  {
    question: 'What is an online Age Calculator?',
    answer:
      'An online Age Calculator is a digital precision tool that computes the exact duration of time elapsed between a person’s date of birth and a reference date (such as today). It breaks down your life into completed calendar years, months, days, total weeks, hours, minutes, and live running seconds using true Gregorian calendar rules.'
  },
  {
    question: 'How do I calculate my exact age in years, months, and days?',
    answer:
      'To calculate your exact age, subtract your birth year, birth month, and birth day from today’s calendar date. If the current day or month is smaller than your birth day or month, you borrow the exact number of days from the preceding month (28, 29, 30, or 31) and 12 months from the preceding year. Our calculator automates this precision math instantly.'
  },
  {
    question: 'Can I calculate my age on a specific future or past date?',
    answer:
      'Yes! By clicking "Change Date" next to the "Age As Of Date" field in our calculator, you can select any historical date to see how old you were on a past milestone or choose any future date to find out how old you will be.'
  },
  {
    question: 'How many total days old am I?',
    answer:
      'Your total age in days is calculated by measuring the exact number of calendar days between your birth date and the target date, taking into account all intervening leap years (366 days) and common years (365 days). You can see this value in the "Total Days Lived" card.'
  },
  {
    question: 'How does this calculator handle leap years and February 29 birthdays?',
    answer:
      'Our calculation engine strictly follows Gregorian calendar leap rules (years divisible by 4, except century years unless divisible by 400). If you were born on February 29, our tool tracks your calendar age each year and identifies your quadrennial leap birthdays.'
  },
  {
    question: 'How do I calculate the age difference between two people?',
    answer:
      'To find the exact age gap between two people, use our Age Difference Calculator. Enter the birth dates of Person A and Person B, and our tool will determine who is older and calculate the precise gap in years, months, and days.'
  },
  {
    question: 'Are my date inputs stored or sent to a server?',
    answer:
      'No. All calculations execute 100% locally in your web browser. No personal dates or queries are ever sent to an external server or database.'
  },
  {
    question: 'What is the difference between Western Age and Traditional East Asian Age?',
    answer:
      'In the Western (international) system, a newborn is 0 years old and turns 1 year old on their first birthday. In traditional East Asian age reckoning (such as the former Korean age system), a baby was considered 1 year old at birth and gained a year on New Year’s Day. Our calculator uses the international standard.'
  }
];

export default function HomePage() {
  return (
    <>
      {/* Structured Data */}
      <WebApplicationJsonLd
        name="Age Calculator"
        description="Calculate your exact age in years, months, and days with calendar precision and live running seconds."
        url="/"
        applicationCategory="UtilityApplication"
      />
      <BreadcrumbJsonLd items={[{ name: 'Home', item: '/' }]} />
      <FaqJsonLd items={HOMEPAGE_FAQS} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* HERO SECTION */}
        <section className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Fast • Accurate • Free Online Tool</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Age Calculator
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Calculate your exact age in years, months, and days. Find your next birthday, total days lived, and explore detailed live running seconds.
          </p>
        </section>

        {/* MAIN CALCULATOR (Above the fold focus) */}
        <section className="max-w-4xl mx-auto">
          <MainAgeCalculator />
        </section>

        {/* Ad Placeholder (CLS Safe) */}
        <AdSlot slotId="home-top-banner" format="horizontal" />

        {/* POPULAR AGE CALCULATORS GRID */}
        <section className="my-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Popular Age & Date Tools
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Explore specialized calculators for birthdays, milestone timelines, age differences, and date intervals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Birthday Calculator */}
            <Link
              href="/birthday-calculator/"
              className="group p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md hover:border-pink-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Cake className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                  Birthday Calculator
                </h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Discover days remaining until your next birthday, what weekday it falls on, and track your milestone ages.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-pink-600 gap-1">
                <span>Explore Birthday Insights</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Age Difference */}
            <Link
              href="/age-difference-calculator/"
              className="group p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Age Difference Calculator
                </h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Compare two birth dates to see who is older and calculate the exact difference in years, months, and days.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600 gap-1">
                <span>Compare Two People</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Date of Birth Calculator */}
            <Link
              href="/date-of-birth-calculator/"
              className="group p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  Date of Birth Calculator
                </h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Reverse calculator: enter someone&apos;s age in years, months, and days to calculate their estimated birth date.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-amber-700 gap-1">
                <span>Estimate Birth Date</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: Days Between Dates */}
            <Link
              href="/days-between-dates/"
              className="group p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <CalendarRange className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  Days Between Dates
                </h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Calculate the total number of days, business days, and weekends between any two dates with inclusive options.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-teal-700 gap-1">
                <span>Count Days & Weeks</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 5: Date Difference */}
            <Link
              href="/date-difference-calculator/"
              className="group p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md hover:border-violet-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-700 transition-colors">
                  Date Difference Calculator
                </h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Compute the exact duration between any two points in time across years, months, days, and total hours.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-violet-700 gap-1">
                <span>Compute Duration</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 6: Chronological Age */}
            <Link
              href="/chronological-age-calculator/"
              className="group p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md hover:border-cyan-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                  Chronological Age Calculator
                </h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Clinical and academic age calculation in standard notation (YY;MM;DD) with premature birth corrections.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-cyan-700 gap-1">
                <span>Clinical Age Assessment</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

        {/* HOW AGE IS CALCULATED */}
        <section className="my-16 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Mathematical Methodology</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How Age Is Calculated Accurately
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Chronological age represents the precise measurement of time that has elapsed between a person’s date of birth and a specific target calculation date. While commonly simplified as subtracting the birth year from the current year, accurate calendar calculation requires taking into account the exact day, month, leap years, and month-borrowing adjustments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="text-blue-600 font-bold text-lg">1. Subtract Days</div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Subtract the birth day from the calculation day. If the calculation day is smaller, borrow the exact number of days from the preceding month (28, 29, 30, or 31 days).
              </p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="text-blue-600 font-bold text-lg">2. Subtract Months</div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Subtract the birth month from the calculation month. If the calculation month is smaller, borrow 12 months from the year value.
              </p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="text-blue-600 font-bold text-lg">3. Subtract Years</div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Subtract the birth year from the calculation year to obtain the completed full years of life.
              </p>
            </div>
          </div>

          {/* Complete Example Section */}
          <div className="mt-8 p-6 bg-blue-50/60 border border-blue-200 rounded-xl">
            <h3 className="text-base font-bold text-blue-900 mb-2">
              Step-by-Step Calculation Example
            </h3>
            <div className="text-sm text-slate-700 space-y-2 leading-relaxed">
              <p>
                Suppose a person was born on <strong>January 15, 2000</strong>, and we want to calculate their age on <strong>September 2, 2026</strong>:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-800">
                <li>
                  <strong>Days:</strong> 2 minus 15 is negative. We borrow 1 month from September (leaving 8 months). The preceding month (August) has 31 days: <code>2 + 31 - 15 = 18 Days</code>.
                </li>
                <li>
                  <strong>Months:</strong> 8 months minus 1 month = <code>7 Months</code>.
                </li>
                <li>
                  <strong>Years:</strong> 2026 minus 2000 = <code>26 Years</code>.
                </li>
              </ul>
              <div className="mt-3 pt-3 border-t border-blue-200 font-semibold text-blue-950">
                Result: Exactly 26 Years, 7 Months, and 18 Days (9,727 total days).
              </div>
            </div>
          </div>

          {/* Cultural & International Age Systems */}
          <div className="mt-8 pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <Globe2 className="w-4 h-4 text-blue-600" />
                <span>Western / International Age System</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Used in almost all countries. A person is considered 0 years old at birth and increments their age by 1 on each subsequent birthday milestone.
              </p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <Scale className="w-4 h-4 text-indigo-600" />
                <span>Legal & Official Age Thresholds</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                In statutory law, exact chronological age determines milestone eligibility: voting (18), driving (16), full adult rights (21), and pension retirement (65–67).
              </p>
            </div>
          </div>
        </section>

        {/* AGE REFERENCE LOOKUP TABLE */}
        <AgeReferenceTable />

        {/* KEY FEATURES */}
        <section className="my-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Why Choose Our Age Calculator?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Built for speed, mathematical accuracy, and maximum user privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Calendar-Accurate Precision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Handles varying month lengths (28, 29, 30, and 31 days), Gregorian leap years, and February 29 birthdays correctly.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">100% Client-Side Privacy</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                All calculations run locally inside your browser. No personal birth dates or queries are ever sent to a server.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Instant Multi-Unit Results</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                See your age in years, months, days, total weeks, hours, minutes, and seconds at a single glance.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                <Cake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Birthday Countdown & Weekday</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Instantly discover the weekday you were born on, days until your next birthday, and what age you will turn next.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-3">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Mobile-First Design</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Carefully optimized for smartphones, tablets, and desktop computers with large responsive inputs and zero horizontal scrolling.
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Completely Free Forever</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                No sign-up, no registration, and no hidden subscriptions. Access all 10+ calculators freely without limits.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <FAQAccordion items={HOMEPAGE_FAQS} />
      </div>
    </>
  );
}
