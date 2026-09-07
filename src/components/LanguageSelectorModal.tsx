'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, X, Search, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageInfo } from '@/lib/i18n/languages';

interface LanguageSelectorModalProps {
  currentLocale?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageSelectorModal({
  currentLocale = 'en',
  isOpen,
  onClose
}: LanguageSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredLanguages: LanguageInfo[] = SUPPORTED_LANGUAGES.filter((lang) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 id="language-modal-title" className="text-lg sm:text-xl font-bold text-slate-900">
                Choose Language / Idioma / Langue
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Select your preferred language for calculations and share cards.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Close language selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-5 sm:px-6 pt-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search language (e.g., Français, Español, Hindi, 日本語)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-400"
              autoFocus
            />
          </div>
        </div>

        {/* Language Grid (Matching User Screenshot Layout) */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {filteredLanguages.map((lang) => {
              const isSelected = currentLocale === lang.code;
              const href = lang.code === 'en' ? '/' : `/${lang.code}/`;

              return (
                <Link
                  key={lang.code}
                  href={href}
                  onClick={onClose}
                  className={`flex items-center justify-between p-3.5 rounded-2xl text-sm font-semibold transition-all border ${
                    isSelected
                      ? 'bg-blue-50 border-blue-200 text-blue-900 font-bold shadow-2xs'
                      : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                  }`}
                  dir={lang.dir}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base truncate">{lang.nativeName}</span>
                    {lang.name !== lang.nativeName && (
                      <span className="text-xs text-slate-400 font-normal truncate">
                        ({lang.name})
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                  )}
                </Link>
              );
            })}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">
              No language matching &quot;{searchQuery}&quot; found.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500 flex items-center justify-between px-6">
          <span>{SUPPORTED_LANGUAGES.length} Languages Supported</span>
          <span className="font-semibold text-slate-700">100% Free & Fast</span>
        </div>
      </div>
    </div>
  );
}
