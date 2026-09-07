'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, ShieldCheck, Sparkles, Globe } from 'lucide-react';
import { ALL_CALCULATORS, COMPANY_LINKS, SITE_CONFIG } from '@/lib/constants';
import { detectLocale } from '@/i18n/locale-utils';
import { LOCALES, SUPPORTED_LOCALES } from '@/i18n/config';
import { getTranslations } from '@/i18n/getTranslations';

export default function Footer() {
  const pathname = usePathname() || '/';
  const locale = detectLocale(pathname);
  const { t } = getTranslations(locale);

  const getLocalizedLink = (href: string) => {
    const clean = href.replace(/^\/+|\/+$/g, '');
    if (locale === 'en') {
      return clean ? `/${clean}/` : '/';
    }
    return clean ? `/${locale}/${clean}/` : `/${locale}/`;
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          {/* Brand & Purpose Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-md">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t(
                'footer.brandDescription',
                'Free, accurate, and privacy-first online age calculator. Compute your exact age in years, months, and days with calendar precision.'
              )}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('footer.clientSideBadge', '100% Client-Side • Zero Data Stored')}</span>
            </div>
          </div>

          {/* Column 1: Core Calculators */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              {t('footer.coreCalculators', 'Age Calculators')}
            </h3>
            <ul className="space-y-2 text-sm">
              {ALL_CALCULATORS.slice(0, 6).map((calc) => (
                <li key={calc.href}>
                  <Link
                    href={getLocalizedLink(calc.href)}
                    className="text-slate-400 hover:text-white hover:underline transition-colors"
                  >
                    {calc.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Specialty Tools & Guides */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              {t('footer.specialtyTools', 'Specialty Tools')}
            </h3>
            <ul className="space-y-2 text-sm">
              {ALL_CALCULATORS.slice(6).map((calc) => (
                <li key={calc.href}>
                  <Link
                    href={getLocalizedLink(calc.href)}
                    className="text-slate-400 hover:text-white hover:underline transition-colors"
                  >
                    {calc.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={getLocalizedLink('/how-to-calculate-age')}
                  className="text-slate-400 hover:text-white hover:underline transition-colors flex items-center gap-1 text-blue-400"
                >
                  <Sparkles className="w-3 h-3" />
                  {t('footer.guide', 'Calculation Guide')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources & Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              {t('footer.company', 'Company & Legal')}
            </h3>
            <ul className="space-y-2 text-sm">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={getLocalizedLink(link.href)}
                    className="text-slate-400 hover:text-white hover:underline transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Multi-Language Global SEO Mesh */}
        <div className="py-8 border-b border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('footer.languages', 'Supported Languages & International Versions')}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            {SUPPORTED_LOCALES.map((code) => {
              const langConfig = LOCALES[code];
              const isCurrent = code === locale;
              return (
                <Link
                  key={code}
                  href={code === 'en' ? '/' : `/${code}/`}
                  dir={langConfig.direction}
                  className={`transition-colors ${
                    isCurrent
                      ? 'text-blue-400 font-bold underline'
                      : 'text-slate-400 hover:text-white hover:underline'
                  }`}
                  title={`${langConfig.englishName} (${langConfig.nativeName})`}
                >
                  {langConfig.nativeName}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {SITE_CONFIG.currentYear} {SITE_CONFIG.name} (agecalculators.dev).{' '}
            {t('footer.allRightsReserved', 'All rights reserved.')}
          </div>
          <div className="flex items-center gap-6">
            <Link href={getLocalizedLink('/privacy-policy')} className="hover:text-slate-300 transition-colors">
              {t('footer.privacy', 'Privacy')}
            </Link>
            <Link href={getLocalizedLink('/terms')} className="hover:text-slate-300 transition-colors">
              {t('footer.terms', 'Terms')}
            </Link>
            <Link href={getLocalizedLink('/contact')} className="hover:text-slate-300 transition-colors">
              {t('footer.contact', 'Contact')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
