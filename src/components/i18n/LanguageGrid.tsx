'use client';

import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { getAllLanguageLinks } from '@/i18n/locale-utils';

interface LanguageGridProps {
  currentLocale: string;
  currentPathname: string;
  onSelect?: () => void;
  filterQuery?: string;
}

export default function LanguageGrid({
  currentLocale,
  currentPathname,
  onSelect,
  filterQuery = ''
}: LanguageGridProps) {
  const allLanguages = getAllLanguageLinks(currentPathname);

  const query = filterQuery.toLowerCase().trim();
  const filtered = query
    ? allLanguages.filter(
        (lang) =>
          lang.nativeName.toLowerCase().includes(query) ||
          lang.englishName.toLowerCase().includes(query) ||
          lang.code.toLowerCase().includes(query)
      )
    : allLanguages;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
      {filtered.map((lang) => {
        const isSelected = lang.code === currentLocale;

        return (
          <Link
            key={lang.code}
            href={lang.href}
            onClick={onSelect}
            dir={lang.dir}
            className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              isSelected
                ? 'bg-blue-50/70 border-blue-600 text-blue-900 shadow-2xs font-bold'
                : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 text-slate-800'
            }`}
          >
            <div className="flex flex-col min-w-0">
              <span
                className={`text-base tracking-tight truncate ${
                  isSelected ? 'font-bold text-slate-900' : 'font-medium text-slate-800 group-hover:text-slate-900'
                }`}
              >
                {lang.nativeName}
              </span>
              <span className="text-xs text-slate-500 truncate mt-0.5">
                {lang.englishName} ({lang.code.toUpperCase()})
              </span>
            </div>

            {isSelected && (
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 ml-2">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </Link>
        );
      })}

      {filtered.length === 0 && (
        <div className="col-span-full py-10 text-center text-slate-500 text-sm">
          No languages matching &quot;{filterQuery}&quot;
        </div>
      )}
    </div>
  );
}
