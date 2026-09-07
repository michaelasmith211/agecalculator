import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { GlobalWebSiteJsonLd } from '@/components/JsonLd';
import { SITE_CONFIG } from '@/lib/constants';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import LanguageSelectorModal from '@/components/LanguageSelectorModal';
import GoogleTranslateScript from '@/components/GoogleTranslateScript';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.domain),
  title: {
    default: 'Age Calculator – Calculate Your Exact Age',
    template: `%s | ${SITE_CONFIG.name}`
  },
  description: SITE_CONFIG.description,
  keywords: [
    'age calculator',
    'calculate my age',
    'how old am I',
    'exact age calculator',
    'age in years months days',
    'calculate age from date of birth',
    'date of birth calculator',
    'birthday calculator',
    'age difference calculator',
    'how old will I be',
    'days between dates',
    'chronological age calculator',
    'leap year age calculator',
    'birthday countdown'
  ],
  authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.domain }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  alternates: {
    canonical: '/',
    languages: {
      'x-default': 'https://agecalculators.dev/',
      en: 'https://agecalculators.dev/',
      es: 'https://agecalculators.dev/?lang=es',
      fr: 'https://agecalculators.dev/?lang=fr',
      de: 'https://agecalculators.dev/?lang=de',
      pt: 'https://agecalculators.dev/?lang=pt',
      ar: 'https://agecalculators.dev/?lang=ar',
      hi: 'https://agecalculators.dev/?lang=hi',
      zh: 'https://agecalculators.dev/?lang=zh',
      ja: 'https://agecalculators.dev/?lang=ja',
      ru: 'https://agecalculators.dev/?lang=ru',
      it: 'https://agecalculators.dev/?lang=it',
      tr: 'https://agecalculators.dev/?lang=tr',
      nl: 'https://agecalculators.dev/?lang=nl',
      id: 'https://agecalculators.dev/?lang=id',
      ko: 'https://agecalculators.dev/?lang=ko',
      pl: 'https://agecalculators.dev/?lang=pl',
      no: 'https://agecalculators.dev/?lang=no',
      sv: 'https://agecalculators.dev/?lang=sv',
      da: 'https://agecalculators.dev/?lang=da',
      fi: 'https://agecalculators.dev/?lang=fi',
      vi: 'https://agecalculators.dev/?lang=vi',
      th: 'https://agecalculators.dev/?lang=th'
    }
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png'
      }
    ]
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Age Calculator – Calculate Your Exact Age',
    description: SITE_CONFIG.description,
    url: `${SITE_CONFIG.domain}/`,
    siteName: SITE_CONFIG.name,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${SITE_CONFIG.domain}/images/age-calculator-how-it-works.jpg`,
        width: 1024,
        height: 682,
        alt: 'Age Calculator – How to calculate your exact age in years, months, days and seconds on agecalculators.dev'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Age Calculator – Calculate Your Exact Age',
    description: SITE_CONFIG.description,
    creator: SITE_CONFIG.twitterHandle,
    site: SITE_CONFIG.twitterHandle,
    images: [`${SITE_CONFIG.domain}/images/age-calculator-how-it-works.jpg`]
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563eb'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="scroll-smooth bg-slate-50 text-slate-900">
      <head>
        <GoogleAnalytics />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <GlobalWebSiteJsonLd />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
        <LanguageProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <LanguageSelectorModal />
          <GoogleTranslateScript />
          <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}
