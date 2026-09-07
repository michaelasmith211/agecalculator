'use client';

import React, { useState, useMemo } from 'react';
import { X, Search, Globe, Check } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { trackEvent } from '@/lib/analytics';

export default function LanguageSelectorModal() {
  const { currentLanguage, setLanguage, isModalOpen, closeModal, allLanguages, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return allLanguages;
    const q = searchQuery.toLowerCase().trim();
    return allLanguages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q)
    );
  }, [allLanguages, searchQuery]);

  if (!isModalOpen) return null;

  const handleSelect = (code: string) => {
    setLanguage(code);
    trackEvent('age_calculator_used', { language: code });
    closeModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 id="language-modal-title" className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t('selectLanguage', 'Choose Your Language')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Select your preferred language for instant full translation across all pages.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeModal}
            className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:px-6 bg-slate-50 border-b border-slate-200/80">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchLanguage', 'Search language... (e.g. Français, Español, हिन्दी)')}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 focus:border-blue-600 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* 3-Column Native Language Grid (Matching User Screenshot) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
            {filteredLanguages.map((lang) => {
              const isSelected = currentLanguage.code === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border transition-all text-left cursor-pointer group ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-600 text-blue-900 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                  dir={lang.dir}
                >
                  <div className="min-w-0">
                    <div
                      className={`text-base font-bold tracking-tight transition-colors ${
                        isSelected ? 'text-blue-900' : 'text-slate-800 group-hover:text-blue-600'
                      }`}
                    >
                      {lang.nativeName}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 truncate">{lang.name}</div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 ml-2 shadow-2xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              <Globe className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium">No language found matching &ldquo;{searchQuery}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>39 Global Languages Supported</span>
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-slate-700 transition-colors cursor-pointer"
          >
            {t('close', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
}
