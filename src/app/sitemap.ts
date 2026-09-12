import { MetadataRoute } from 'next';
import { SITE_CONFIG, ALL_CALCULATORS, COMPANY_LINKS } from '@/lib/constants';
import { NON_DEFAULT_LOCALES } from '@/i18n/config';
import { getHreflangAlternates } from '@/i18n/locale-utils';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.domain;
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [];

  // English Root Homepage
  routes.push({
    url: `${baseUrl}/`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 1.0,
    alternates: {
      languages: getHreflangAlternates()
    }
  });

  // Non-English Homepages (26 languages)
  for (const locale of NON_DEFAULT_LOCALES) {
    routes.push({
      url: `${baseUrl}/${locale}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: getHreflangAlternates()
      }
    });
  }

  // High priority calculators specifically flagged for fast Googlebot indexation
  const HIGH_PRIORITY_SLUGS = [
    'age-difference-calculator',
    'date-difference-calculator',
    'date-of-birth-calculator'
  ];

  // English Calculator Pages
  for (const calc of ALL_CALCULATORS) {
    const slug = calc.href.replace(/^\//, '');
    let priority = 0.85;
    if (slug === 'age-calculator') {
      priority = 0.95;
    } else if (HIGH_PRIORITY_SLUGS.includes(slug)) {
      priority = 0.9;
    }

    routes.push({
      url: `${baseUrl}/${slug}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority,
      alternates: {
        languages: getHreflangAlternates(slug)
      }
    });
  }

  // Non-English Calculator Pages (39 languages × 11 calculators)
  for (const calc of ALL_CALCULATORS) {
    const slug = calc.href.replace(/^\//, '');
    const priority = HIGH_PRIORITY_SLUGS.includes(slug) ? 0.85 : 0.8;
    for (const locale of NON_DEFAULT_LOCALES) {
      routes.push({
        url: `${baseUrl}/${locale}/${slug}/`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority,
        alternates: {
          languages: getHreflangAlternates(slug)
        }
      });
    }
  }

  // English How to calculate age guide (Direct 0.9 priority signal for Googlebot)
  routes.push({
    url: `${baseUrl}/how-to-calculate-age/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
    alternates: {
      languages: getHreflangAlternates('how-to-calculate-age')
    }
  });

  // Non-English How to calculate age guide
  for (const locale of NON_DEFAULT_LOCALES) {
    routes.push({
      url: `${baseUrl}/${locale}/how-to-calculate-age/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
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
