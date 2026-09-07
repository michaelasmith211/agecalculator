import React from 'react';
import { Metadata } from 'next';
import BirthdayCountdown from '@/components/calculators/BirthdayCountdown';
import Breadcrumbs from '@/components/Breadcrumbs';
import RelatedCalculators from '@/components/RelatedCalculators';
import FAQAccordion from '@/components/ui/FAQAccordion';
import AdSlot from '@/components/AdSlot';
import { WebApplicationJsonLd, FaqJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { getPageData } from '@/lib/i18n/page-translations';

export const metadata: Metadata = {
  title: 'Birthday Countdown – Real-Time Live Birthday Clock',
  description: 'Track the live countdown to your next birthday in days, hours, minutes, and seconds. Free online birthday countdown timer.',
  alternates: {
    canonical: '/birthday-countdown/'
  }
};

export default function BirthdayCountdownPage({ lang = 'en' }: { lang?: string }) {
  const data = getPageData('birthday-countdown', lang);

  return (
    <>
      <WebApplicationJsonLd
        name={data.heroTitle}
        description={data.description}
        url="/birthday-countdown/"
        applicationCategory="UtilityApplication"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: data.breadcrumb, item: '/birthday-countdown/' }
        ]}
      />
      <FaqJsonLd items={data.faqs} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: 'Age Calculators', href: '/' },
            { name: data.breadcrumb, href: '/birthday-countdown/' }
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

          <BirthdayCountdown />

          <AdSlot slotId="bdaycountdown-mid" format="horizontal" />

          <FAQAccordion items={data.faqs} />

          <RelatedCalculators currentSlug="/birthday-countdown" />
        </div>
      </div>
    </>
  );
}
