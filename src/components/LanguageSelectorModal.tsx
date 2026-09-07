'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { X, Search, Globe, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES, getHrefForLocale } from '@/lib/i18n/languages';
import { trackEvent } from '@/lib/analytics';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocale: string;
}

export default function LanguageSelectorModal({
  isOpen,
  onClose,
  currentLocale
}: LanguageSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const filteredLanguages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return SUPPORTED_LANGUAGES;
    return SUPPORTED_LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q) ||
        lang.targetKeyword.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleSelectLanguage = (targetCode: string) => {
    trackEvent('age_calculator_used', { birth_year: 2000, calculated_age_years: 0, used_time: false });
    const targetUrl = getHrefForLocale(targetCode, pathname);
    onClose();
    router.push(targetUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Select Language</h3>
              <p className="text-xs text-slate-500">Choose your preferred language for the entire website</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 sm:px-6 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search language (e.g., Hindi, Español, Français)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-blue-600 rounded-xl text-sm font-medium text-slate-800 focus:outline-none transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Language Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredLanguages.map((lang) => {
            const isSelected = lang.code === currentLocale;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-600 text-blue-900 shadow-2xs'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">{lang.flag}</span>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5 truncate">
                      <span>{lang.nativeName}</span>
                      {lang.code !== 'en' && (
                        <span className="text-xs text-slate-500 font-normal">({lang.name})</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {lang.targetKeyword}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}

          {filteredLanguages.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 text-sm">
              No languages matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>100% Pre-Rendered Native Translations</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
