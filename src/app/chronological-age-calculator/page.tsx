import React from 'react';
import { Metadata } from 'next';
import ChronologicalAgeCalculator from '@/components/calculators/ChronologicalAgeCalculator';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedCalculators from '@/components/RelatedCalculators';
import FAQAccordion from '@/components/ui/FAQAccordion';
import AdSlot from '@/components/AdSlot';
import { WebApplicationJsonLd, FaqJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { getPageData } from '@/lib/i18n/page-translations';

export const metadata: Metadata = {
  title: 'Chronological Age Calculator – Exact Clinical & Educational Age',
  description: 'Calculate exact chronological age in years, months, and days for school admissions, psychological tests, medical forms, and clinical assessments.',
  alternates: {
    canonical: '/chronological-age-calculator/'
  }
};

export default function ChronologicalAgeCalculatorPage({ lang = 'en' }: { lang?: string }) {
  const data = getPageData('chronological-age-calculator', lang);

  return (
    <>
      <WebApplicationJsonLd
        name={data.heroTitle}
        description={data.description}
        url="/chronological-age-calculator/"
        applicationCategory="UtilityApplication"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: data.breadcrumb, item: '/chronological-age-calculator/' }
        ]}
      />
      <FaqJsonLd items={data.faqs} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: 'Age Calculators', href: '/' },
            { name: data.breadcrumb, href: '/chronological-age-calculator/' }
          ]}
        />

        <div className="max-w-4xl mx-auto mt-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {data.heroTitle}
            </h1>
            <p className="mt-2 text-base text-slate-600 max-w-xl mx-auto">
              {data.heroSubtitle}
            </p>
          </div>

          <ChronologicalAgeCalculator />

          <AdSlot slotId="chrono-mid" format="horizontal" />

          <FAQAccordion items={data.faqs} />

          <RelatedCalculators currentSlug="/chronological-age-calculator" />
        </div>
      </div>
    </>
  );
}
