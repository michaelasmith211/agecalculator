import React from 'react';
import { Metadata } from 'next';
import DateOfBirthCalculator from '@/components/calculators/DateOfBirthCalculator';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedCalculators from '@/components/RelatedCalculators';
import FAQAccordion from '@/components/ui/FAQAccordion';
import AdSlot from '@/components/AdSlot';
import { WebApplicationJsonLd, FaqJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { getPageData } from '@/lib/i18n/page-translations';

export const metadata: Metadata = {
  title: 'Date of Birth Calculator – Find Birth Date from Age',
  description: 'Calculate your exact date of birth by entering your age in years, months, and days on a specific reference date.',
  alternates: {
    canonical: '/date-of-birth-calculator/'
  }
};

export default function DateOfBirthCalculatorPage({ lang = 'en' }: { lang?: string }) {
  const data = getPageData('date-of-birth-calculator', lang);

  return (
    <>
      <WebApplicationJsonLd
        name={data.heroTitle}
        description={data.description}
        url="/date-of-birth-calculator/"
        applicationCategory="UtilityApplication"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: data.breadcrumb, item: '/date-of-birth-calculator/' }
        ]}
      />
      <FaqJsonLd items={data.faqs} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: 'Age Calculators', href: '/' },
            { name: data.breadcrumb, href: '/date-of-birth-calculator/' }
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

          <DateOfBirthCalculator />

          <AdSlot slotId="dobcalc-mid" format="horizontal" />

          <FAQAccordion items={data.faqs} />

          <RelatedCalculators currentSlug="/date-of-birth-calculator" />
        </div>
      </div>
    </>
  );
}
