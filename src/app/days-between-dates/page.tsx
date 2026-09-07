import React from 'react';
import { Metadata } from 'next';
import DaysBetweenDates from '@/components/calculators/DaysBetweenDates';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedCalculators from '@/components/RelatedCalculators';
import FAQAccordion from '@/components/ui/FAQAccordion';
import AdSlot from '@/components/AdSlot';
import { WebApplicationJsonLd, FaqJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { getPageData } from '@/lib/i18n/page-translations';

export const metadata: Metadata = {
  title: 'Days Between Dates – Calendar & Business Day Counter',
  description: 'Count total calendar days, business weekdays, and weekend days between any two dates with optional end date inclusion.',
  alternates: {
    canonical: '/days-between-dates/'
  }
};

export default function DaysBetweenDatesPage({ lang = 'en' }: { lang?: string }) {
  const data = getPageData('days-between-dates', lang);

  return (
    <>
      <WebApplicationJsonLd
        name={data.heroTitle}
        description={data.description}
        url="/days-between-dates/"
        applicationCategory="UtilityApplication"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: data.breadcrumb, item: '/days-between-dates/' }
        ]}
      />
      <FaqJsonLd items={data.faqs} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: 'Age Calculators', href: '/' },
            { name: data.breadcrumb, href: '/days-between-dates/' }
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

          <DaysBetweenDates />

          <AdSlot slotId="daysbetween-mid" format="horizontal" />

          <FAQAccordion items={data.faqs} />

          <RelatedCalculators currentSlug="/days-between-dates" />
        </div>
      </div>
    </>
  );
}
