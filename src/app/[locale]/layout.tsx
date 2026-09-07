import React from 'react';
import { NON_DEFAULT_LOCALES, isRTL, isValidLocale, DEFAULT_LOCALE } from '@/i18n/config';
import HtmlLangSync from '@/components/HtmlLangSync';

export function generateStaticParams() {
  return NON_DEFAULT_LOCALES.map((locale) => ({
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
  if (!isValidLocale(rawLocale) || rawLocale === DEFAULT_LOCALE) {
    // English is served at the root URL (/) without /en prefix
    return <>{children}</>;
  }
  const locale = rawLocale;
  const dir = isRTL(locale) ? 'rtl' : 'ltr';

  return (
    <div data-locale={locale} dir={dir} className={`min-h-screen ${dir === 'rtl' ? 'rtl text-right' : 'ltr text-left'}`}>
      <HtmlLangSync locale={locale} dir={dir} />
      {children}
    </div>
  );
}
