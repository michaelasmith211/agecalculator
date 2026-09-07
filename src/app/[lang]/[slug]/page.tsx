import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LANGUAGES } from '@/lib/i18n/languages';
import { SITE_CONFIG } from '@/lib/constants';
import { getPageData } from '@/lib/i18n/page-translations';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

import AgeCalculatorPage from '@/app/age-calculator/page';
import BirthdayCalculatorPage from '@/app/birthday-calculator/page';
import BirthdayCountdownPage from '@/app/birthday-countdown/page';
import ChronologicalAgeCalculatorPage from '@/app/chronological-age-calculator/page';
import AgeDifferenceCalculatorPage from '@/app/age-difference-calculator/page';
import DateDifferenceCalculatorPage from '@/app/date-difference-calculator/page';
import DateOfBirthCalculatorPage from '@/app/date-of-birth-calculator/page';
import DaysBetweenDatesPage from '@/app/days-between-dates/page';
import LeapYearAgeCalculatorPage from '@/app/leap-year-age-calculator/page';
import RetirementAgeCalculatorPage from '@/app/retirement-age-calculator/page';
import HowToCalculateAgePage from '@/app/how-to-calculate-age/page';
import AboutPage from '@/app/about/page';
import ContactPage from '@/app/contact/page';
import PrivacyPolicyPage from '@/app/privacy-policy/page';
import TermsPage from '@/app/terms/page';

interface LocalizedSlugPageProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}

export const dynamic = 'force-static';

const SLUG_MAP: Record<string, React.ComponentType<{ lang?: string }>> = {
  'age-calculator': AgeCalculatorPage,
  'birthday-calculator': BirthdayCalculatorPage,
  'birthday-countdown': BirthdayCountdownPage,
  'chronological-age-calculator': ChronologicalAgeCalculatorPage,
  'age-difference-calculator': AgeDifferenceCalculatorPage,
  'date-difference-calculator': DateDifferenceCalculatorPage,
  'date-of-birth-calculator': DateOfBirthCalculatorPage,
  'days-between-dates': DaysBetweenDatesPage,
  'leap-year-age-calculator': LeapYearAgeCalculatorPage,
  'retirement-age-calculator': RetirementAgeCalculatorPage,
  'how-to-calculate-age': HowToCalculateAgePage,
  'about': AboutPage,
  'contact': ContactPage,
  'privacy-policy': PrivacyPolicyPage,
  'terms': TermsPage
};

export async function generateStaticParams() {
  const languages = LANGUAGES.filter((l) => l.code !== 'en');
  const slugs = Object.keys(SLUG_MAP);

  const params: Array<{ lang: string; slug: string }> = [];
  for (const lang of languages) {
    for (const slug of slugs) {
      params.push({ lang: lang.code, slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: LocalizedSlugPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const target = SLUG_MAP[slug];

  if (!target) {
    return {};
  }

  const data = getPageData(slug, lang);
  const canonicalUrl = `${SITE_CONFIG.domain}/${lang}/${slug}/`;

  const alternatesLanguages: Record<string, string> = {
    'x-default': `${SITE_CONFIG.domain}/${slug}/`,
    en: `${SITE_CONFIG.domain}/${slug}/`
  };
  for (const l of LANGUAGES) {
    if (l.code !== 'en') {
      alternatesLanguages[l.code] = `${SITE_CONFIG.domain}/${l.code}/${slug}/`;
    }
  }

  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: canonicalUrl,
      languages: alternatesLanguages
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: canonicalUrl,
      locale: lang,
      type: 'website',
      images: [`${SITE_CONFIG.domain}/images/age-calculator-how-it-works.jpg`]
    }
  };
}

export default async function LocalizedSlugPage({ params }: LocalizedSlugPageProps) {
  const { lang, slug } = await params;
  const language = LANGUAGES.find((l) => l.code === lang);
  const PageComponent = SLUG_MAP[slug];

  if (!language || language.code === 'en' || !PageComponent) {
    notFound();
  }

  return (
    <LanguageProvider initialLang={lang}>
      <PageComponent lang={lang} />
    </LanguageProvider>
  );
}
