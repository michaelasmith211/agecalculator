'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Clock, Menu, X, ChevronRight, Sparkles, Globe } from 'lucide-react';
import { MAIN_NAV_ITEMS, ALL_CALCULATORS } from '@/lib/constants';
import { detectLocale } from '@/i18n/locale-utils';
import { getLocaleConfig } from '@/i18n/config';
import { getTranslations } from '@/i18n/getTranslations';
import LanguageSelectorModal from '@/components/i18n/LanguageSelectorModal';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const pathname = usePathname() || '/';

  const locale = detectLocale(pathname);
  const config = getLocaleConfig(locale);
  const { t, raw } = getTranslations(locale);

  // Helper to resolve localized tool titles & descriptions
  const getToolTitle = (href: string, fallback: string) => {
    const slug = href.replace(/^\/+|\/+$/g, '');
    const tool = raw.tools?.[slug as keyof typeof raw.tools];
    return tool?.title || fallback;
  };

  const getToolDesc = (href: string, fallback: string) => {
    const slug = href.replace(/^\/+|\/+$/g, '');
    const tool = raw.tools?.[slug as keyof typeof raw.tools];
    return tool?.desc || fallback;
  };

  const getNavItemTitle = (item: { title: string; href: string }) => {
    const slug = item.href.replace(/^\/+|\/+$/g, '');
    if (slug === 'age-calculator') return t('navigation.ageCalculator', item.title);
    if (slug === 'birthday-calculator') return t('navigation.birthday', item.title);
    if (slug === 'age-difference-calculator') return t('navigation.ageDifference', item.title);
    if (slug === 'birthday-countdown') return getToolTitle(item.href, item.title);
    return getToolTitle(item.href, item.title);
  };

  // Helper to build localized internal links
  const getLocalizedLink = (href: string) => {
    if (href.startsWith('/#') || href.startsWith('#')) {
      return locale === 'en' ? (href.startsWith('/') ? href : `/${href}`) : `/${locale}${href.startsWith('/') ? href : `/${href}`}`;
    }
    const clean = href.replace(/^\/+|\/+$/g, '');
    if (locale === 'en') {
      return clean ? `/${clean}/` : '/';
    }
    return clean ? `/${locale}/${clean}/` : `/${locale}/`;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <Link href={getLocalizedLink('/')} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight text-slate-900 tracking-tight flex items-center gap-1.5">
                  {t('navigation.ageCalculator', 'Age Calculator')}
                </span>
                <span className="text-[11px] font-medium text-slate-500 leading-none">
                  agecalculators.dev
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {MAIN_NAV_ITEMS.map((item) => {
                const localizedHref = getLocalizedLink(item.href);
                const isActive = pathname === localizedHref || pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={localizedHref}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {getNavItemTitle(item)}
                  </Link>
                );
              })}

              {/* All Tools Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                  onBlur={() => setTimeout(() => setToolsDropdownOpen(false), 200)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
                  aria-expanded={toolsDropdownOpen}
                >
                  {t('navigation.moreTools', 'More Tools')}
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${toolsDropdownOpen ? 'rotate-90' : ''}`} />
                </button>

                {toolsDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {t('navigation.allAgeTools', 'All Age & Date Tools')}
                    </div>
                    {ALL_CALCULATORS.map((calc) => (
                      <Link
                        key={calc.href}
                        href={getLocalizedLink(calc.href)}
                        className="block px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        <div className="font-medium text-slate-900">{getToolTitle(calc.href, calc.title)}</div>
                        <div className="text-xs text-slate-500 truncate">{getToolDesc(calc.href, calc.description)}</div>
                      </Link>
                    ))}
                    <div className="pt-2 mt-2 border-t border-slate-100">
                      <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Guides & Formulas
                      </div>
                      <Link
                        href={getLocalizedLink('/how-to-calculate-age')}
                        className="block px-3 py-2 text-sm text-blue-700 hover:bg-blue-50 font-medium transition-colors"
                      >
                        <div className="font-semibold text-blue-700 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span>How to Calculate Age Guide</span>
                        </div>
                        <div className="text-xs text-slate-500 truncate">Formulas, leap years & calendar math</div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Action CTA & Language Selector */}
            <div className="hidden md:flex items-center gap-2.5">
              {/* Language Selector Button */}
              <button
                type="button"
                onClick={() => setLangModalOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer shadow-2xs"
                title="Select Language"
                aria-label={`Select language. Current language: ${config.nativeName}`}
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-medium">{config.nativeName}</span>
              </button>

              <Link
                href={getLocalizedLink('/#calculator')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <Clock className="w-4 h-4" />
                {t('navigation.calculateAge', 'Calculate Age')}
              </Link>
            </div>

            {/* Mobile Menu & Mobile Language Button */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLangModalOpen(true)}
                className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1 text-xs font-bold border border-slate-200"
                aria-label={`Current language: ${config.nativeName}. Click to change language.`}
              >
                <Globe className="w-3.5 h-3.5 text-slate-600" />
                <span>{locale.toUpperCase()}</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
            <div className="text-xs font-semibold text-slate-400 uppercase px-3 py-1">
              {t('navigation.mainTools', 'Main Tools')}
            </div>
            {MAIN_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={getLocalizedLink(item.href)}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-700"
              >
                {getNavItemTitle(item)}
              </Link>
            ))}
            <div className="border-t border-slate-100 my-2 pt-2">
              <div className="text-xs font-semibold text-slate-400 uppercase px-3 py-1">
                {t('navigation.moreCalculators', 'More Calculators')}
              </div>
              {ALL_CALCULATORS.slice(5).map((calc) => (
                <Link
                  key={calc.href}
                  href={getLocalizedLink(calc.href)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  {getToolTitle(calc.href, calc.title)}
                </Link>
              ))}
              <Link
                href={getLocalizedLink('/how-to-calculate-age')}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >
                📖 How to Calculate Age Guide
              </Link>
            </div>
            <div className="pt-2">
              <Link
                href={getLocalizedLink('/#calculator')}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                {t('navigation.calculateMyAgeNow', 'Calculate My Age Now')}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Accessible 3-Column Language Modal */}
      <LanguageSelectorModal
        isOpen={langModalOpen}
        onClose={() => setLangModalOpen(false)}
        currentLocale={locale}
      />
    </>
  );
}
