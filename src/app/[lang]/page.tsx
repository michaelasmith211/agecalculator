import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HomePage from '@/app/page';
import { LANGUAGES, getLanguageByCode } from '@/lib/i18n/languages';
import { SITE_CONFIG } from '@/lib/constants';

interface LangPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export const dynamic = 'force-static';

export async function generateStaticParams() {
  // Generate static pages for all 38 international languages (excluding default 'en')
  return LANGUAGES.filter((l) => l.code !== 'en').map((lang) => ({
    lang: lang.code
  }));
}

export async function generateMetadata({ params }: LangPageProps): Promise<Metadata> {
  const { lang } = await params;
  const language = getLanguageByCode(lang);

  const title = `Age Calculator (${language.nativeName}) – Calculate Exact Age`;
  const description = `Free online Age Calculator in ${language.nativeName} (${language.name}). Calculate your exact age in years, months, days, and live running seconds.`;
  const canonicalUrl = `${SITE_CONFIG.domain}/${lang}/`;

  const alternatesLanguages: Record<string, string> = {
    'x-default': `${SITE_CONFIG.domain}/`,
    en: `${SITE_CONFIG.domain}/`
  };
  for (const l of LANGUAGES) {
    if (l.code !== 'en') {
      alternatesLanguages[l.code] = `${SITE_CONFIG.domain}/${l.code}/`;
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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_CONFIG.domain}/images/age-calculator-how-it-works.jpg`]
    }
  };
}

export default async function LocalizedHomePage({ params }: LangPageProps) {
  const { lang } = await params;
  const language = LANGUAGES.find((l) => l.code === lang);

  if (!language || language.code === 'en') {
    notFound();
  }

  return <HomePage />;
}
