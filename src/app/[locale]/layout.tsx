import React from 'react';
import { SUPPORTED_LOCALES, isRTL, isValidLocale, DEFAULT_LOCALE } from '@/i18n/config';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({
    locale
  }));
}

export default async function LocalizedLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const dir = isRTL(locale) ? 'rtl' : 'ltr';

  return (
    <div data-locale={locale} dir={dir} className={`min-h-screen ${dir === 'rtl' ? 'rtl text-right' : 'ltr text-left'}`}>
      {children}
    </div>
  );
}
