'use client';

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Cookie, Check, ShieldCheck, X } from 'lucide-react';
import { getCookieConsent, setCookieConsent } from '@/lib/cookie-utils';

const emptySubscribe = () => () => {};

export default function CookieBanner() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [dismissed, setDismissed] = useState(false);

  if (!isClient || dismissed) {
    return null;
  }

  const existingConsent = getCookieConsent();
  if (existingConsent) {
    return null;
  }

  const handleAcceptAll = () => {
    setCookieConsent('all');
    setDismissed(true);
  };

  const handleEssentialOnly = () => {
    setCookieConsent('essential');
    setDismissed(true);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl animate-in slide-in-from-bottom duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>Privacy & Cookie Preferences</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>100% Client-Side Safe</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              We use functional cookies to securely remember your birth date & time on your device so your age and countdowns are instantly ready when you return. We respect your privacy and never sell your data.{' '}
              <Link href="/privacy-policy/" className="text-blue-600 hover:text-blue-800 underline font-medium">
                Read our Privacy & Cookie Policy
              </Link>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleEssentialOnly}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={handleAcceptAll}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Accept All Cookies</span>
          </button>
          <button
            type="button"
            onClick={handleEssentialOnly}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer hidden sm:block"
            aria-label="Dismiss cookie notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
