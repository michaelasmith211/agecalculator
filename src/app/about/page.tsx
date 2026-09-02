import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Zap, Award, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About Us – Precision Age & Date Calculation Engine',
  description:
    'Learn about Age Calculator (agecalculators.dev), our commitment to mathematical precision, 100% client-side privacy, and fast utility calculators.',
  alternates: {
    canonical: '/about/'
  },
  openGraph: {
    title: 'About Age Calculator – Standards & Calculation Methodology',
    description: 'Learn about our commitment to mathematical precision and client-side privacy.',
    url: `${SITE_CONFIG.domain}/about/`,
    type: 'website',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Age Calculator',
    description: 'Learn about our commitment to mathematical precision and client-side privacy.',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  }
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <Breadcrumbs
        items={[
          { name: 'Company', href: '/' },
          { name: 'About Us', href: '/about/' }
        ]}
      />

      <article className="max-w-3xl mx-auto mt-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-8 shadow-xs">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            <Award className="w-3.5 h-3.5" />
            <span>Our Mission & Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About Age Calculator
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            {SITE_CONFIG.name} (available at {SITE_CONFIG.domain}) is an independent, academic-grade date and age calculation utility created to provide the most accurate, private, and accessible online time tools.
          </p>
        </header>

        <section className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">
            Why We Built Age Calculator
          </h2>
          <p>
            Many online age calculators rely on oversimplified mathematical formulas—such as dividing total days by 365 or approximating months as 30 days. These approximations introduce cumulative errors when calculating exact age in years, months, and days.
          </p>
          <p>
            We built our calculation platform from the ground up using strict Gregorian calendar arithmetic, accurate month-borrowing rules, full leap-year support, and complete timezone isolation.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>100% Client-Side Privacy</span>
            </div>
            <p className="text-xs text-slate-600">
              Your dates of birth and queries never touch an external server or database. All algorithms run locally inside your web browser.
            </p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
              <Zap className="w-5 h-5 text-amber-600" />
              <span>Zero-Lag Performance</span>
            </div>
            <p className="text-xs text-slate-600">
              Engineered with modern Next.js static architecture for instant page loads and immediate calculation results without unnecessary scripts.
            </p>
          </div>
        </section>

        <section className="pt-6 border-t border-slate-100 flex items-center justify-between text-sm">
          <span className="text-slate-600">Have feedback or suggestions?</span>
          <Link
            href="/contact/"
            className="font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </article>
    </div>
  );
}
