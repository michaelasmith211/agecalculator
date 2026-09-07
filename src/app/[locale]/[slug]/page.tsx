import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/constants';
import { SUPPORTED_LANGUAGES, isValidLocale, getLanguage } from '@/lib/i18n/languages';
import { getTranslation } from '@/lib/i18n/translations';
import { WebApplicationJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import RelatedCalculators from '@/components/RelatedCalculators';

// Import all calculators
import MainAgeCalculator from '@/components/calculators/MainAgeCalculator';
import BirthdayCalculator from '@/components/calculators/BirthdayCalculator';
import AgeDifferenceCalculator from '@/components/calculators/AgeDifferenceCalculator';
import BirthdayCountdown from '@/components/calculators/BirthdayCountdown';
import DateDifferenceCalculator from '@/components/calculators/DateDifferenceCalculator';
import DateOfBirthCalculator from '@/components/calculators/DateOfBirthCalculator';
import DaysBetweenDates from '@/components/calculators/DaysBetweenDates';
import ChronologicalAgeCalculator from '@/components/calculators/ChronologicalAgeCalculator';
import RetirementAgeCalculator from '@/components/calculators/RetirementAgeCalculator';
import LeapYearCalculator from '@/components/calculators/LeapYearCalculator';

export const VALID_SLUGS = [
  'age-calculator',
  'birthday-calculator',
  'age-difference-calculator',
  'birthday-countdown',
  'date-difference-calculator',
  'date-of-birth-calculator',
  'days-between-dates',
  'chronological-age-calculator',
  'retirement-age-calculator',
  'leap-year-age-calculator',
  'how-to-calculate-age'
] as const;

export type ValidSlug = typeof VALID_SLUGS[number];

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const nonEnglish = SUPPORTED_LANGUAGES.filter((l) => l.code !== 'en');
  const params: Array<{ locale: string; slug: string }> = [];

  for (const lang of nonEnglish) {
    for (const slug of VALID_SLUGS) {
      params.push({
        locale: lang.code,
        slug
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale) || !VALID_SLUGS.includes(slug as ValidSlug)) {
    return {};
  }

  const lang = getLanguage(locale);
  const t = getTranslation(locale);
  const tool = t.tools[slug] || t.tools['age-calculator'];

  const languageAlternates: Record<string, string> = {
    'x-default': `${SITE_CONFIG.domain}/${slug}/`,
    en: `${SITE_CONFIG.domain}/${slug}/`
  };

  SUPPORTED_LANGUAGES.forEach((l) => {
    if (l.code !== 'en') {
      languageAlternates[l.code] = `${SITE_CONFIG.domain}/${l.code}/${slug}/`;
    }
  });

  const pageTitle = `${tool.title} – ${SITE_CONFIG.name}`;
  const pageDesc = `${tool.desc} Free, instant, and 100% accurate on ${SITE_CONFIG.name}.`;

  return {
    title: pageTitle,
    description: pageDesc,
    keywords: [
      tool.title,
      lang.targetKeyword,
      'age calculator',
      'exact age calculator',
      'date calculation'
    ],
    alternates: {
      canonical: `${SITE_CONFIG.domain}/${locale}/${slug}/`,
      languages: languageAlternates
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: `${SITE_CONFIG.domain}/${locale}/${slug}/`,
      siteName: SITE_CONFIG.name,
      locale,
      type: 'website',
      images: [
        {
          url: `${SITE_CONFIG.domain}/images/age-calculator-how-it-works.jpg`,
          width: 1024,
          height: 682,
          alt: `${tool.title} – ${SITE_CONFIG.name}`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDesc,
      images: [`${SITE_CONFIG.domain}/images/age-calculator-how-it-works.jpg`]
    }
  };
}

export default async function LocalizedToolPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale) || !VALID_SLUGS.includes(slug as ValidSlug)) {
    notFound();
  }

  const lang = getLanguage(locale);
  const t = getTranslation(locale);
  const tool = t.tools[slug] || t.tools['age-calculator'];

  const renderCalculator = () => {
    switch (slug) {
      case 'birthday-calculator':
        return <BirthdayCalculator />;
      case 'age-difference-calculator':
        return <AgeDifferenceCalculator />;
      case 'birthday-countdown':
        return <BirthdayCountdown />;
      case 'date-difference-calculator':
        return <DateDifferenceCalculator />;
      case 'date-of-birth-calculator':
        return <DateOfBirthCalculator />;
      case 'days-between-dates':
        return <DaysBetweenDates />;
      case 'chronological-age-calculator':
        return <ChronologicalAgeCalculator />;
      case 'retirement-age-calculator':
        return <RetirementAgeCalculator />;
      case 'leap-year-age-calculator':
        return <LeapYearCalculator />;
      case 'how-to-calculate-age':
      case 'age-calculator':
      default:
        return <MainAgeCalculator />;
    }
  };

  return (
    <>
      <WebApplicationJsonLd
        name={`${tool.title} – ${SITE_CONFIG.name}`}
        description={tool.desc}
        url={`/${locale}/${slug}/`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: `/${locale}/` },
          { name: tool.title, item: `/${locale}/${slug}/` }
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10" dir={lang.dir}>
        {/* Hero */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <span>{lang.nativeName} ({lang.name})</span>
            <span>•</span>
            <span>100% Free Tool</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            {tool.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {tool.desc}
          </p>
        </div>

        {/* Calculator Component */}
        <div>
          {renderCalculator()}
        </div>

        {/* Related Calculators Cross Linking Mesh */}
        <RelatedCalculators currentSlug={slug} />
      </div>
    </>
  );
}
