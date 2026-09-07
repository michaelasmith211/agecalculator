import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LANGUAGES, getLanguageByCode } from '@/lib/i18n/languages';
import { SITE_CONFIG } from '@/lib/constants';

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

const SLUG_MAP: Record<string, { component: React.ComponentType; title: string }> = {
  'age-calculator': { component: AgeCalculatorPage, title: 'Age Calculator' },
  'birthday-calculator': { component: BirthdayCalculatorPage, title: 'Birthday Calculator' },
  'birthday-countdown': { component: BirthdayCountdownPage, title: 'Birthday Countdown' },
  'chronological-age-calculator': { component: ChronologicalAgeCalculatorPage, title: 'Chronological Age Calculator' },
  'age-difference-calculator': { component: AgeDifferenceCalculatorPage, title: 'Age Difference Calculator' },
  'date-difference-calculator': { component: DateDifferenceCalculatorPage, title: 'Date Difference Calculator' },
  'date-of-birth-calculator': { component: DateOfBirthCalculatorPage, title: 'Date of Birth Calculator' },
  'days-between-dates': { component: DaysBetweenDatesPage, title: 'Days Between Dates' },
  'leap-year-age-calculator': { component: LeapYearAgeCalculatorPage, title: 'Leap Year Age Calculator' },
  'retirement-age-calculator': { component: RetirementAgeCalculatorPage, title: 'Retirement Age Calculator' },
  'how-to-calculate-age': { component: HowToCalculateAgePage, title: 'How to Calculate Age' },
  'about': { component: AboutPage, title: 'About Us' },
  'contact': { component: ContactPage, title: 'Contact Us' },
  'privacy-policy': { component: PrivacyPolicyPage, title: 'Privacy Policy' },
  'terms': { component: TermsPage, title: 'Terms of Service' }
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
  const language = getLanguageByCode(lang);
  const target = SLUG_MAP[slug];

  if (!target) {
    return {};
  }

  const title = `${target.title} (${language.nativeName}) – ${SITE_CONFIG.name}`;
  const description = `${target.title} in ${language.nativeName} (${language.name}). Free, fast, and 100% accurate date calculation tool.`;
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
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: alternatesLanguages
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      locale: lang,
      type: 'website',
      images: [`${SITE_CONFIG.domain}/images/age-calculator-how-it-works.jpg`]
    }
  };
}

import { LanguageProvider } from '@/lib/i18n/LanguageContext';

export default async function LocalizedSlugPage({ params }: LocalizedSlugPageProps) {
  const { lang, slug } = await params;
  const language = LANGUAGES.find((l) => l.code === lang);
  const target = SLUG_MAP[slug];

  if (!language || language.code === 'en' || !target) {
    notFound();
  }

  const PageComponent = target.component;
  return (
    <LanguageProvider initialLang={lang}>
      <PageComponent />
    </LanguageProvider>
  );
}
