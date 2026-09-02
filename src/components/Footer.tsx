import React from 'react';
import Link from 'next/link';
import { Calendar, ShieldCheck, Sparkles } from 'lucide-react';
import { ALL_CALCULATORS, COMPANY_LINKS, SITE_CONFIG } from '@/lib/constants';

export default function Footer() {
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
              Free, accurate, and privacy-first online age calculator. Compute your exact age in years, months, and days, find your next birthday countdown, and calculate time differences with calendar precision.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Client-Side • Zero Data Stored</span>
            </div>
          </div>

          {/* Column 1: Core Calculators */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Age Calculators
            </h3>
            <ul className="space-y-2 text-sm">
              {ALL_CALCULATORS.slice(0, 6).map((calc) => (
                <li key={calc.href}>
                  <Link
                    href={calc.href}
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
              Specialty Tools
            </h3>
            <ul className="space-y-2 text-sm">
              {ALL_CALCULATORS.slice(6).map((calc) => (
                <li key={calc.href}>
                  <Link
                    href={calc.href}
                    className="text-slate-400 hover:text-white hover:underline transition-colors"
                  >
                    {calc.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/how-to-calculate-age"
                  className="text-slate-400 hover:text-white hover:underline transition-colors flex items-center gap-1 text-blue-400"
                >
                  <Sparkles className="w-3 h-3" />
                  Calculation Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources & Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Company & Legal
            </h3>
            <ul className="space-y-2 text-sm">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white hover:underline transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {SITE_CONFIG.currentYear} {SITE_CONFIG.name} (agecalculators.dev). All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
