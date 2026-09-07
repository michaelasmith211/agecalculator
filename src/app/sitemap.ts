import { MetadataRoute } from 'next';
import { SITE_CONFIG, ALL_CALCULATORS, COMPANY_LINKS } from '@/lib/constants';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/languages';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.domain;
  const now = new Date();

  // Build complete language alternates map for sitemap
  const languageAlternates: Record<string, string> = {
    'x-default': `${baseUrl}/`,
    en: `${baseUrl}/`
  };

  SUPPORTED_LANGUAGES.forEach((l) => {
    if (l.code !== 'en') {
      languageAlternates[l.code] = `${baseUrl}/${l.code}/`;
    }
  });

  // Multilingual homepage routes for all languages
  const multilingualHomeRoutes: MetadataRoute.Sitemap = SUPPORTED_LANGUAGES.map((lang) => ({
    url: lang.code === 'en' ? `${baseUrl}/` : `${baseUrl}/${lang.code}/`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: lang.code === 'en' ? 1.0 : 0.9,
    alternates: {
      languages: languageAlternates
    }
  }));

  // Standard calculator and tool routes
  const routes: MetadataRoute.Sitemap = [
    ...multilingualHomeRoutes,
    ...ALL_CALCULATORS.map((calc) => ({
      url: `${baseUrl}${calc.href}/`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: calc.href === '/age-calculator' ? 0.95 : 0.85
    })),
    {
      url: `${baseUrl}/how-to-calculate-age/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8
    },
    ...COMPANY_LINKS.map((link) => ({
      url: `${baseUrl}${link.href}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5
    }))
  ];

  return routes;
}
