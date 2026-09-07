import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HomePage from '@/app/page';
import { LANGUAGES } from '@/lib/i18n/languages';
import { SITE_CONFIG } from '@/lib/constants';
import { getPageData } from '@/lib/i18n/page-translations';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

interface LangPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return LANGUAGES.filter((l) => l.code !== 'en').map((lang) => ({
    lang: lang.code
  }));
}

export async function generateMetadata({ params }: LangPageProps): Promise<Metadata> {
  const { lang } = await params;
  const data = getPageData('age-calculator', lang);
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
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
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

  return (
    <LanguageProvider initialLang={lang}>
      <HomePage lang={lang} />
    </LanguageProvider>
  );
}
