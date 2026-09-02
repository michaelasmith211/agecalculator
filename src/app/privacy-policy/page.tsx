import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy – 100% Client-Side Privacy Commitment',
  description:
    'Our privacy policy explains how Age Calculator processes all dates 100% locally in your web browser with zero server data storage.',
  alternates: {
    canonical: '/privacy-policy/'
  },
  openGraph: {
    title: 'Privacy Policy – 100% Client-Side Privacy Commitment',
    description: 'Learn how Age Calculator processes all dates 100% locally with zero server storage.',
    url: `${SITE_CONFIG.domain}/privacy-policy/`,
    type: 'website',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy – Age Calculator',
    description: 'Learn how Age Calculator processes all dates 100% locally with zero server storage.',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  }
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Privacy Policy', item: '/privacy-policy/' }
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: 'Company', href: '/' },
            { name: 'Privacy Policy', href: '/privacy-policy/' }
          ]}
        />

      <article className="max-w-3xl mx-auto mt-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-6 shadow-xs text-sm text-slate-600 leading-relaxed">
        <header className="space-y-2 border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy-First Guarantee</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: September 2026
          </p>
        </header>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            1. Zero Personal Data Collection
          </h2>
          <p>
            At {SITE_CONFIG.name} ({SITE_CONFIG.domain}), your personal privacy is our foundational commitment. All age calculations, dates of birth, target dates, and interval calculations are executed <strong>100% locally inside your web browser</strong> using client-side JavaScript.
          </p>
          <p>
            We do not transmit, collect, log, or store your dates of birth or calculator inputs on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            2. Local Browser Storage
          </h2>
          <p>
            The website does not create persistent user profiles. Any temporary state is stored only in your active browser session memory and disappears upon closing or refreshing your browser tab.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            3. Analytics & Performance Monitoring
          </h2>
          <p>
            We may collect anonymous, non-personally identifiable telemetry regarding site performance (such as page load speeds, Core Web Vitals, and aggregate calculator usage metrics) to improve user experience and ensure optimal speed. No personal identifiers or dates are included in performance metrics.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            4. Third-Party Advertising & Cookies
          </h2>
          <p>
            To keep our calculation tools freely accessible worldwide, non-intrusive third-party advertising partners may serve contextual advertisements. These partners may use cookies to deliver relevant advertisements in accordance with their privacy standards.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            5. Contact Us
          </h2>
          <p>
            If you have any questions regarding this Privacy Policy, please visit our <Link href="/contact/" className="text-blue-600 underline font-medium">Contact page</Link>.
          </p>
        </section>
      </article>
    </div>
    </>
  );
}
