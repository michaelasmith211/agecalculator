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
import { SUPPORTED_LANGUAGES, isValidLocale, getLanguage } from '@/lib/i18n/languages';
import { getTranslation } from '@/lib/i18n/translations';
import LocalizedAgeCalculator from '@/components/calculators/LocalizedAgeCalculator';
import RelatedCalculators from '@/components/RelatedCalculators';
import { WebApplicationJsonLd, FaqJsonLd } from '@/components/JsonLd';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.filter((l) => l.code !== 'en').map((lang) => ({
    locale: lang.code
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};

  const lang = getLanguage(locale);
  const t = getTranslation(locale);

  // Build complete hreflang language dictionary
  const languageAlternates: Record<string, string> = {
    'x-default': `${SITE_CONFIG.domain}/`,
    en: `${SITE_CONFIG.domain}/`
  };

  SUPPORTED_LANGUAGES.forEach((l) => {
    if (l.code !== 'en') {
      languageAlternates[l.code] = `${SITE_CONFIG.domain}/${l.code}/`;
    }
  });

  return {
    title: t.pageTitle,
    description: t.metaDescription,
    keywords: [
      lang.targetKeyword,
      'age calculator',
      'exact age calculator',
      'birthday calculator',
      'chronological age calculator'
    ],
    alternates: {
      canonical: `${SITE_CONFIG.domain}/${locale}/`,
      languages: languageAlternates
    },
    openGraph: {
      title: t.pageTitle,
      description: t.metaDescription,
      url: `${SITE_CONFIG.domain}/${locale}/`,
      siteName: SITE_CONFIG.name,
      locale: locale,
      type: 'website',
      images: [
        {
          url: `${SITE_CONFIG.domain}/images/age-calculator-how-it-works.jpg`,
          width: 1024,
          height: 682,
          alt: `${lang.targetKeyword} – ${SITE_CONFIG.name}`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: t.pageTitle,
      description: t.metaDescription,
      images: [`${SITE_CONFIG.domain}/images/age-calculator-how-it-works.jpg`]
    }
  };
}

export default async function LocalizedHomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }

  const lang = getLanguage(locale);
  const t = getTranslation(locale);

  const faqSchemaData = t.faqs.map((f) => ({
    question: f.q,
    answer: f.a
  }));

  return (
    <>
      <WebApplicationJsonLd
        name={`${lang.targetKeyword} – ${SITE_CONFIG.name}`}
        description={t.metaDescription}
        url={`${SITE_CONFIG.domain}/${locale}/`}
      />
      <FaqJsonLd items={faqSchemaData} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12" dir={lang.dir}>
        {/* Header Hero */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free • Multi-Language Precision</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.h1}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Localized Calculator Component */}
        <LocalizedAgeCalculator t={t} dir={lang.dir} />

        {/* Infographic Walkthrough Section */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {t.howItWorksTitle}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {t.howItWorksSubtitle}
            </p>
          </div>

          <figure className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <Image
              src="/images/age-calculator-how-it-works.jpg"
              alt={`${lang.targetKeyword} – How to calculate your exact age in years, months, days and seconds on agecalculators.dev`}
              title={`${lang.targetKeyword} Guide – Step-by-step how to calculate exact age and live running seconds`}
              width={1024}
              height={682}
              className="w-full h-auto object-cover rounded-2xl"
              loading="lazy"
            />
          </figure>
        </section>

        {/* Trust and Key Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Gregorian Precision</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Accounts for leap years, 30/31-day months, and February leap days down to the second.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Live Running Seconds</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Real-time live age odometer synchronized with your device clock.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">100% Private & Free</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              No registration or server uploads. All calculations run strictly in your browser.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">
              {t.faqTitle}
            </h2>
          </div>

          <div className="divide-y divide-slate-200">
            {t.faqs.map((faq, index) => (
              <details key={index} className="group py-4 cursor-pointer" open={index === 0}>
                <summary className="flex items-center justify-between font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors list-none">
                  <span>{faq.q}</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed pl-1">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Related Calculators Linking Mesh */}
        <RelatedCalculators currentSlug="" />
      </div>
    </>
  );
}
