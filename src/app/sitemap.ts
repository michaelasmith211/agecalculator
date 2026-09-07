import { MetadataRoute } from 'next';
import { SITE_CONFIG, COMPANY_LINKS } from '@/lib/constants';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/languages';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.domain;
  const now = new Date();

  // Build complete language alternates map for homepage
  const homeLanguageAlternates: Record<string, string> = {
    'x-default': `${baseUrl}/`,
    en: `${baseUrl}/`
  };

  SUPPORTED_LANGUAGES.forEach((l) => {
    if (l.code !== 'en') {
      homeLanguageAlternates[l.code] = `${baseUrl}/${l.code}/`;
    }
  });

  // Multilingual homepage routes for all languages
  const multilingualHomeRoutes: MetadataRoute.Sitemap = SUPPORTED_LANGUAGES.map((lang) => ({
    url: lang.code === 'en' ? `${baseUrl}/` : `${baseUrl}/${lang.code}/`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: lang.code === 'en' ? 1.0 : 0.9,
    alternates: {
      languages: homeLanguageAlternates
    }
  }));

  // Calculator slugs
  const calculatorSlugs = [
    'age-calculator',
    'birthday-calculator',
    'age-difference-calculator',
    'birthday-countdown',
    'date-difference-calculator',
    'date-of-birth-calculator',
    'days-between-dates',
    'chronological-age-calculator',
    'retirement-age-calculator',
    'leap-year-age-calculator',
    'how-to-calculate-age'
  ];

  // Generate localized tool routes with full cross-language alternates
  const localizedToolRoutes: MetadataRoute.Sitemap = [];

  for (const slug of calculatorSlugs) {
    const slugAlternates: Record<string, string> = {
      'x-default': `${baseUrl}/${slug}/`,
      en: `${baseUrl}/${slug}/`
    };

    SUPPORTED_LANGUAGES.forEach((l) => {
      if (l.code !== 'en') {
        slugAlternates[l.code] = `${baseUrl}/${l.code}/${slug}/`;
      }
    });

    // English canonical tool route
    localizedToolRoutes.push({
      url: `${baseUrl}/${slug}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: slug === 'age-calculator' ? 0.95 : 0.85,
      alternates: {
        languages: slugAlternates
      }
    });

    // Localized subroutes for each language
    SUPPORTED_LANGUAGES.forEach((l) => {
      if (l.code !== 'en') {
        localizedToolRoutes.push({
          url: `${baseUrl}/${l.code}/${slug}/`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: {
            languages: slugAlternates
          }
        });
      }
    });
  }

  // Standard static pages
  const staticCompanyRoutes: MetadataRoute.Sitemap = COMPANY_LINKS.map((link) => ({
    url: `${baseUrl}${link.href}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5
  }));

  return [
    ...multilingualHomeRoutes,
    ...localizedToolRoutes,
    ...staticCompanyRoutes
  ];
}
