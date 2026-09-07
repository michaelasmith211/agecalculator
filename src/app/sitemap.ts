import { MetadataRoute } from 'next';
import { SITE_CONFIG, ALL_CALCULATORS, COMPANY_LINKS } from '@/lib/constants';
import { SUPPORTED_LOCALES } from '@/i18n/config';
import { getHreflangAlternates } from '@/i18n/locale-utils';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.domain;
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [];

  // Homepages across all 27 locales
  for (const locale of SUPPORTED_LOCALES) {
    routes.push({
      url: `${baseUrl}/${locale}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: locale === 'en' ? 1.0 : 0.9,
      alternates: {
        languages: getHreflangAlternates()
      }
    });
  }

  // Calculator pages across all 27 locales
  for (const calc of ALL_CALCULATORS) {
    const slug = calc.href.replace(/^\//, '');
    for (const locale of SUPPORTED_LOCALES) {
      routes.push({
        url: `${baseUrl}/${locale}/${slug}/`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: slug === 'age-calculator' ? 0.95 : 0.85,
        alternates: {
          languages: getHreflangAlternates(slug)
        }
      });
    }
  }

  // How to calculate age guide across all 27 locales
  for (const locale of SUPPORTED_LOCALES) {
    routes.push({
      url: `${baseUrl}/${locale}/how-to-calculate-age/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: getHreflangAlternates('how-to-calculate-age')
      }
    });
  }

  // Static company/legal pages
  for (const link of COMPANY_LINKS) {
    routes.push({
      url: `${baseUrl}${link.href}/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5
    });
  }

  return routes;
}
