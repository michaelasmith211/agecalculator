import React from 'react';
import { Metadata } from 'next';
import BirthdayCalculator from '@/components/calculators/BirthdayCalculator';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedCalculators from '@/components/RelatedCalculators';
import FAQAccordion from '@/components/ui/FAQAccordion';
import AdSlot from '@/components/AdSlot';
import SocialShare from '@/components/SocialShare';
import { WebApplicationJsonLd, FaqJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { SITE_CONFIG } from '@/lib/constants';
import { getPageData } from '@/lib/i18n/page-translations';

export const metadata: Metadata = {
  title: 'Birthday Calculator – Find Your Next Birthday & Milestones',
  description:
    'Use our free Birthday Calculator to discover how many days remain until your next birthday, what day of the week you were born on, and key milestone ages.',
  alternates: {
    canonical: '/birthday-calculator/'
  }
};

export default function BirthdayCalculatorPage({ lang = 'en' }: { lang?: string }) {
  const data = getPageData('birthday-calculator', lang);

  return (
    <>
      <WebApplicationJsonLd
        name={data.heroTitle}
        description={data.description}
        url="/birthday-calculator/"
        applicationCategory="UtilityApplication"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: data.breadcrumb, item: '/birthday-calculator/' }
        ]}
      />
      <FaqJsonLd items={data.faqs} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: 'Age Calculators', href: '/' },
            { name: data.breadcrumb, href: '/birthday-calculator/' }
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

          <BirthdayCalculator />

          <AdSlot slotId="bday-mid" format="horizontal" />

          <SocialShare
            title={`${data.heroTitle} – ${SITE_CONFIG.name}`}
            url="/birthday-calculator/"
            className="mt-6"
          />

          <FAQAccordion items={data.faqs} />

          <RelatedCalculators currentSlug="/birthday-calculator" />
        </div>
      </div>
    </>
  );
}
