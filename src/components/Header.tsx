'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Clock, Menu, X, ChevronRight, Sparkles, Globe } from 'lucide-react';
import { MAIN_NAV_ITEMS, ALL_CALCULATORS } from '@/lib/constants';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { TranslationKey } from '@/lib/i18n/dictionaries';

const NAV_TITLE_MAP: Record<string, TranslationKey> = {
  '/': 'appName',
  '/age-calculator': 'appName',
  '/birthday-calculator': 'bdayTitle',
  '/birthday-countdown': 'bdayCountdownTitle',
  '/chronological-age-calculator': 'chronologicalTitle',
  '/age-difference-calculator': 'ageDiffTitle',
  '/date-difference-calculator': 'dateDiffTitle',
  '/date-of-birth-calculator': 'dobCalcTitle',
  '/days-between-dates': 'daysBetweenTitle',
  '/leap-year-age-calculator': 'leapYearTitle',
  '/retirement-age-calculator': 'retirementTitle',
  '/how-to-calculate-age': 'guideTitle'
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { currentLanguage, openModal, t, getLocalizedPath } = useLanguage();

  const getNavTitle = (href: string, fallback: string) => {
    const key = NAV_TITLE_MAP[href];
    return key ? t(key, fallback) : fallback;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href={getLocalizedPath('/')} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight text-slate-900 tracking-tight flex items-center gap-1.5">
                {t('appName', 'Age Calculator')}
              </span>
              <span className="text-[11px] font-medium text-slate-500 leading-none">
                agecalculators.dev
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {MAIN_NAV_ITEMS.map((item) => {
              const localizedHref = getLocalizedPath(item.href);
              const isActive = pathname === item.href || pathname === localizedHref;
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
                  {getNavTitle(item.href, item.title)}
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
                {t('moreTools', 'More Tools')}
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${toolsDropdownOpen ? 'rotate-90' : ''}`} />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {t('allCalculators', 'All Age & Date Tools')}
                  </div>
                  {ALL_CALCULATORS.map((calc) => (
                    <Link
                      key={calc.href}
                      href={getLocalizedPath(calc.href)}
                      className="block px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <div className="font-medium text-slate-900">{getNavTitle(calc.href, calc.title)}</div>
                      <div className="text-xs text-slate-500 truncate">{calc.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Action CTA & Language Selector Button */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Language Selector Button */}
            <button
              type="button"
              onClick={openModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-200 transition-all cursor-pointer shadow-2xs notranslate"
              translate="no"
              title="Change Language (39 languages supported)"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="notranslate" translate="no" suppressHydrationWarning>{currentLanguage.nativeName}</span>
            </button>

            <Link
              href={getLocalizedPath('/#calculator')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <Clock className="w-4 h-4" />
              {t('calculateBtn', 'Calculate Age')}
            </Link>
          </div>

          {/* Mobile Navigation Header */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={openModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer notranslate"
              translate="no"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span className="notranslate" translate="no" suppressHydrationWarning>{currentLanguage.code.toUpperCase()}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
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
          <div className="text-xs font-semibold text-slate-400 uppercase px-3 py-1">{t('moreTools', 'Main Tools')}</div>
          {MAIN_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={getLocalizedPath(item.href)}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-blue-50 hover:text-blue-700"
            >
              {getNavTitle(item.href, item.title)}
            </Link>
          ))}
          <div className="border-t border-slate-100 my-2 pt-2">
            <div className="text-xs font-semibold text-slate-400 uppercase px-3 py-1">{t('allCalculators', 'More Calculators')}</div>
            {ALL_CALCULATORS.slice(5).map((calc) => (
              <Link
                key={calc.href}
                href={getLocalizedPath(calc.href)}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                {getNavTitle(calc.href, calc.title)}
              </Link>
            ))}
          </div>
          <div className="pt-2">
            <Link
              href={getLocalizedPath('/#calculator')}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-base font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              {t('calculateBtn', 'Calculate Age')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
