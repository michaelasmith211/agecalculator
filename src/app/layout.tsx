import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { GlobalWebSiteJsonLd } from '@/components/JsonLd';
import { SITE_CONFIG } from '@/lib/constants';

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
    canonical: '/'
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' }
    ],
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
      { url: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }
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
        url: `${SITE_CONFIG.domain}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: 'Age Calculator – Fast, Accurate & Free Online Tool'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Age Calculator – Calculate Your Exact Age',
    description: SITE_CONFIG.description,
    creator: SITE_CONFIG.twitterHandle,
    site: SITE_CONFIG.twitterHandle,
    images: [`${SITE_CONFIG.domain}/og-image.svg`]
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
  themeColor: '#ffffff'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="scroll-smooth bg-slate-50 text-slate-900">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon" />
        <GlobalWebSiteJsonLd />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
