import React from 'react';
import { SITE_CONFIG } from '@/lib/constants';

interface WebApplicationSchemaProps {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  features?: string[];
  image?: string;
}

export function WebApplicationJsonLd({
  name,
  description,
  url,
  applicationCategory = 'UtilityApplication',
  image = `${SITE_CONFIG.domain}/images/age-calculator-how-it-works.jpg`,
  features = [
    'Exact calendar years, months, and days calculation',
    'Total days, weeks, hours, minutes, and seconds breakdown',
    'Next birthday countdown and birth weekday detection',
    '100% private client-side processing without data storage',
    'Real-time live running seconds and milliseconds ticker',
    'Device cookie auto-save and zero-click restoration'
  ]
}: WebApplicationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${SITE_CONFIG.domain}${url}#webapp`,
    name,
    description,
    url: `${SITE_CONFIG.domain}${url}`,
    applicationCategory,
    applicationSubCategory: 'Age & Date Calculation Tool',
    operatingSystem: 'All (Web Browser, iOS, Android, macOS, Windows, Linux)',
    browserRequirements: 'Requires JavaScript. Works on all modern web browsers.',
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    featureList: features,
    image,
    screenshot: image,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1850',
      bestRating: '5',
      worstRating: '1'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.domain,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.domain}/icon.svg`,
        width: 512,
        height: 512
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  if (!items || items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.item.startsWith('http') ? crumb.item : `${SITE_CONFIG.domain}${crumb.item}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqJsonLdProps {
  items: FaqItem[];
}

export function FaqJsonLd({ items }: FaqJsonLdProps) {
  if (!items || items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

interface HowToJsonLdProps {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
}

export function HowToJsonLd({ name, description, steps, totalTime = 'PT1M' }: HowToJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    totalTime,
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Online Age Calculator'
      }
    ],
    step: steps.map((step, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: step.name,
      text: step.text,
      url: `${SITE_CONFIG.domain}/how-to-calculate-age/#step-${idx + 1}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ArticleJsonLdProps {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}

export function ArticleJsonLd({
  headline,
  description,
  url,
  datePublished = '2026-01-01T00:00:00Z',
  dateModified = '2026-09-02T00:00:00Z'
}: ArticleJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline,
    description,
    url: `${SITE_CONFIG.domain}${url}`,
    datePublished,
    dateModified,
    inLanguage: 'en-US',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.domain}${url}`
    },
    author: {
      '@type': 'Organization',
      name: `${SITE_CONFIG.name} Research Team`,
      url: SITE_CONFIG.domain
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.domain,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.domain}/icon.svg`,
        width: 512,
        height: 512
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function GlobalWebSiteJsonLd() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.domain}/#website`,
    name: SITE_CONFIG.name,
    alternateName: ['AgeCalculator', 'Age Calculators', 'Online Age Calculator', 'Age Calculator Pro'],
    url: `${SITE_CONFIG.domain}/`,
    description: SITE_CONFIG.description,
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_CONFIG.domain}/#organization`,
      name: SITE_CONFIG.name,
      url: `${SITE_CONFIG.domain}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.domain}/icon.svg`,
        width: 512,
        height: 512
      }
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.domain}/age-calculator/?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_CONFIG.domain}/#organization`,
    name: SITE_CONFIG.name,
    url: `${SITE_CONFIG.domain}/`,
    logo: `${SITE_CONFIG.domain}/icon.svg`,
    description: SITE_CONFIG.description,
    foundingDate: '2026',
    sameAs: []
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
    </>
  );
}
