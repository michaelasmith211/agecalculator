import React from 'react';
import { Metadata } from 'next';
import { FileText } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms of Service – Calculation Accuracy & Usage Guidelines',
  description:
    'Terms of service and usage conditions for Age Calculator (agecalculators.dev). Information regarding mathematical calculations and non-legal disclaimers.',
  alternates: {
    canonical: '/terms/'
  },
  openGraph: {
    title: 'Terms of Service – Age Calculator',
    description: 'Usage terms and conditions for Age Calculator online tools.',
    url: `${SITE_CONFIG.domain}/terms/`,
    type: 'website',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service – Age Calculator',
    description: 'Usage terms and conditions for Age Calculator online tools.',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  }
};

export default function TermsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Terms of Service', item: '/terms/' }
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <Breadcrumbs
        items={[
          { name: 'Company', href: '/' },
          { name: 'Terms of Service', href: '/terms/' }
        ]}
      />

      <article className="max-w-3xl mx-auto mt-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 space-y-6 shadow-xs text-sm text-slate-600 leading-relaxed">
        <header className="space-y-2 border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <FileText className="w-3.5 h-3.5" />
            <span>Usage Guidelines</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: September 2026
          </p>
        </header>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using {SITE_CONFIG.name} ({SITE_CONFIG.domain}), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue using the website.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            2. Purpose of Calculation Tools
          </h2>
          <p>
            The calculation tools and educational content on this website are provided for informational, educational, and personal planning purposes only.
          </p>
          <p>
            While our algorithms follow rigorous Gregorian calendar arithmetic and borrow rules, results should not be used as the sole basis for formal legal proceedings, contractual litigation, or statutory government retirement benefit claims without consulting official government records.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            3. Disclaimer of Warranties
          </h2>
          <p>
            The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether express or implied. We do not guarantee that the site will be uninterrupted or error-free at all times.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">
            4. Intellectual Property
          </h2>
          <p>
            All original editorial content, mathematical guides, website layouts, and brand assets are the intellectual property of {SITE_CONFIG.name}.
          </p>
        </section>
      </article>
    </div>
    </>
  );
}
