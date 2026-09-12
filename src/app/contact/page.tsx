import React from 'react';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import ContactForm from '@/components/ContactForm';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact Us – Age Calculator Support & Inquiries',
  description:
    'Contact the Age Calculator team for feedback, algorithm questions, calculation inquiries, or bug reports.',
  alternates: {
    canonical: `${SITE_CONFIG.domain}/contact/`
  },
  openGraph: {
    title: 'Contact Age Calculator – Feedback & Inquiries',
    description: 'Contact the Age Calculator team for questions, suggestions, or bug reports.',
    url: `${SITE_CONFIG.domain}/contact/`,
    type: 'website',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us – Age Calculator',
    description: 'Contact the Age Calculator team for feedback, questions, or bug reports.',
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
  }
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: '/' },
          { name: 'Contact', item: '/contact/' }
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { name: 'Company', href: '/' },
            { name: 'Contact', href: '/contact/' }
          ]}
        />
        <ContactForm />
      </div>
    </>
  );
}
