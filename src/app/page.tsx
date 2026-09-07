import React from 'react';
import { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import MainAgeCalculator from '@/components/calculators/MainAgeCalculator';
import FAQAccordion from '@/components/ui/FAQAccordion';
import AdSlot from '@/components/AdSlot';
import { WebApplicationJsonLd, FaqJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { SITE_CONFIG } from '@/lib/constants';
import { getPageData } from '@/lib/i18n/page-translations';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Age Calculator – Calculate Exact Age in Years, Months & Days',
  description:
    'Free online Age Calculator. Calculate your exact age in years, months, days, and live running seconds with full calendar precision.',
  alternates: {
    canonical: '/'
  }
};

export default function HomePage({ lang = 'en' }: { lang?: string }) {
  const data = getPageData('age-calculator', lang);

  return (
    <>
      <WebApplicationJsonLd
        name={data.heroTitle}
        description={data.description}
        url="/"
        image={`${SITE_CONFIG.domain}/images/age-calculator-how-it-works.jpg`}
        applicationCategory="UtilityApplication"
      />
      <BreadcrumbJsonLd items={[{ name: 'Home', item: '/' }]} />
      <FaqJsonLd items={data.faqs} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* HERO SECTION */}
        <section className="max-w-3xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Fast • Accurate • Free Online Tool</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {data.heroTitle}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {data.heroSubtitle}
          </p>
        </section>

        {/* MAIN CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <MainAgeCalculator />
        </section>

        <AdSlot slotId="home-top-banner" format="horizontal" />

        {/* VISUAL INFOGRAPHIC GUIDE */}
        <section className="my-16 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Visual Step-by-Step Guide</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              How the Age Calculator Works
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              Calculate your exact chronological age down to the second in 6 simple steps.
            </p>
          </div>

          <figure className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-50">
            <Image
              src="/images/age-calculator-how-it-works.jpg"
              alt="Age Calculator – How to calculate your exact age"
              width={1024}
              height={682}
              className="w-full h-auto object-cover rounded-2xl"
              sizes="(max-width: 1024px) 100vw, 1024px"
              loading="lazy"
            />
          </figure>
        </section>

        <FAQAccordion items={data.faqs} />
      </div>
    </>
  );
}
