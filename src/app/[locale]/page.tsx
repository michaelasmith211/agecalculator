import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Calendar,
  Sparkles,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { NON_DEFAULT_LOCALES, isValidLocale, getLocaleConfig, DEFAULT_LOCALE } from '@/i18n/config';
import { getTranslations } from '@/i18n/getTranslations';
import { getCanonicalUrl, getHreflangAlternates } from '@/i18n/locale-utils';
import MainAgeCalculator from '@/components/calculators/MainAgeCalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import { WebApplicationJsonLd, FaqJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.map((locale) => ({
    locale
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale) || locale === DEFAULT_LOCALE) return {};

  const config = getLocaleConfig(locale);
  const { t } = getTranslations(locale);

  const title = t('meta.homeTitle', 'Age Calculator – Calculate Exact Age in Years, Months & Days');
  const description = t('meta.homeDescription', 'Free online Age Calculator. Calculate your exact age in years, months, days, and live running seconds.');

  return {
    title,
    description,
    keywords: [
      t('navigation.ageCalculator', 'Age Calculator'),
      config.nativeName,
      'age calculator',
      'exact age calculator',
      'birthday calculator',
      'calculate age online'
    ],
    alternates: {
      canonical: getCanonicalUrl(locale),
      languages: getHreflangAlternates()
    },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl(locale),
      siteName: SITE_CONFIG.name,
      locale: config.ogLocale,
      type: 'website',
      images: [
        {
          url: `${SITE_CONFIG.domain}/images/age-calculator-how-it-works.jpg`,
          width: 1024,
          height: 682,
          alt: `${title} – ${SITE_CONFIG.name}`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_CONFIG.domain}/images/age-calculator-how-it-works.jpg`]
    }
  };
}

export default async function LocalizedHomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale) || locale === DEFAULT_LOCALE) {
    notFound();
  }

  const { t, raw } = getTranslations(locale);
  const homeTitle = t('meta.homeH1', 'Online Age Calculator');
  const homeSubtitle = t('meta.homeSubtitle', 'Calculate your exact chronological age in years, months, days, hours, and live running seconds with millisecond Gregorian calendar precision.');

  const faqItems = raw.faq?.items || [];
  const faqSchemaData = faqItems.map((item) => ({
    question: item.question,
    answer: item.answer
  }));

  return (
    <>
      <WebApplicationJsonLd
        name={`${homeTitle} – ${SITE_CONFIG.name}`}
        description={t('meta.homeDescription')}
        url={`/${locale}/`}
      />
      <BreadcrumbJsonLd
        items={[{ name: t('breadcrumbs.home', 'Home'), item: `/${locale}/` }]}
      />
      {faqSchemaData.length > 0 && <FaqJsonLd items={faqSchemaData} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Hero Section */}
        <section className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('calculator.badge', 'Instant Calendar & Time Precision Calculation')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {homeTitle}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {homeSubtitle}
          </p>
        </section>

        {/* Main Calculator */}
        <section className="max-w-4xl mx-auto" aria-labelledby="calculator-heading">
          <h2 id="calculator-heading" className="sr-only">
            {t('calculator.title', 'Interactive Age Calculator & Real-Time Statistics')}
          </h2>
          <MainAgeCalculator locale={locale} />
        </section>

        {/* Infographic Walkthrough Guide */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {t('howItWorks.title', 'How the Age Calculator Works')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              {t('howItWorks.subtitle', 'A transparent breakdown of how our algorithm calculates calendar days, handles month borrowing, and tracks live seconds.')}
            </p>
          </div>

          <figure className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
            <Image
              src="/images/age-calculator-how-it-works.webp"
              alt={`${homeTitle} – How to calculate your exact age in years, months, days and seconds on agecalculators.dev`}
              title={`${homeTitle} Guide – Step-by-step how to calculate exact age and live running seconds`}
              width={1024}
              height={682}
              className="w-full h-auto object-cover rounded-2xl"
              loading="lazy"
            />
          </figure>
        </section>

        {/* Key Value Propositions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto" aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">
            {t('features.title', 'Core Features and Gregorian Calendar Precision')}
          </h2>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {t('features.gregorianPrecisionTitle', 'Gregorian Precision')}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('features.gregorianPrecisionDesc', 'Accounts for leap years, 30/31-day months, and February leap days down to the second.')}
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {t('features.liveSecondsTitle', 'Live Running Seconds')}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('features.liveSecondsDesc', 'Real-time live age odometer synchronized with your device clock.')}
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {t('features.privateAndFreeTitle', '100% Private & Free')}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {t('features.privateAndFreeDesc', 'No registration or server uploads. All calculations run strictly in your browser.')}
            </p>
          </div>
        </section>

        {/* Localized FAQ Accordion */}
        {faqItems.length > 0 && (
          <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs max-w-4xl mx-auto">
            <div className="flex items-center gap-2.5 mb-6">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">
                {t('faq.title', 'Frequently Asked Questions')}
              </h2>
            </div>

            <div className="divide-y divide-slate-200">
              {faqItems.map((item, index) => (
                <details key={index} className="group py-4 cursor-pointer" open={index === 0}>
                  <summary className="flex items-center justify-between font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors list-none">
                    <span>{item.question}</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed pl-1">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Localized Related Calculators */}
        <div className="max-w-4xl mx-auto">
          <RelatedCalculators currentSlug="" locale={locale} />
        </div>
      </div>
    </>
  );
}
