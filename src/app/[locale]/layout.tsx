import React from 'react';
import { SUPPORTED_LANGUAGES, isValidLocale } from '@/lib/i18n/languages';

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.filter((l) => l.code !== 'en').map((lang) => ({
    locale: lang.code
  }));
}

export default async function LocalizedLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const valid = isValidLocale(locale);

  return (
    <div data-locale={valid ? locale : 'en'}>
      {children}
    </div>
  );
}
