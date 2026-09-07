import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/constants';
import { getHreflangAlternates } from '@/i18n/locale-utils';

export const metadata: Metadata = {
  title: 'Age Calculator – Calculate Exact Age Online',
  description: 'Free online Age Calculator. Calculate your exact age in years, months, days, and live running seconds.',
  alternates: {
    canonical: `${SITE_CONFIG.domain}/en/`,
    languages: getHreflangAlternates()
  }
};

export default function RootPage() {
  redirect('/en/');
}
