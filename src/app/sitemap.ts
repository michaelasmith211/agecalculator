import { MetadataRoute } from 'next';
import { SITE_CONFIG, ALL_CALCULATORS, COMPANY_LINKS } from '@/lib/constants';
import { LANGUAGES } from '@/lib/i18n/languages';

export const dynamic = 'force-static';

function getAlternateLanguages(cleanPath: string, baseUrl: string): Record<string, string> {
  const normalizedPath = cleanPath === '/' ? '' : cleanPath.endsWith('/') ? cleanPath.slice(0, -1) : cleanPath;
  const languages: Record<string, string> = {
    'x-default': `${baseUrl}${normalizedPath}/`,
    en: `${baseUrl}${normalizedPath}/`
  };
  for (const lang of LANGUAGES) {
    if (lang.code !== 'en') {
      languages[lang.code] = `${baseUrl}/${lang.code}${normalizedPath}/`;
    }
  }
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.domain;
  const now = new Date();

  const basePaths: Array<{
    path: string;
    priority: number;
    changeFrequency: 'daily' | 'weekly' | 'monthly';
  }> = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' },
    ...ALL_CALCULATORS.map((calc) => ({
      path: `${calc.href}/`,
      priority: calc.href === '/age-calculator' ? 0.95 : 0.85,
      changeFrequency: 'weekly' as const
    })),
    { path: '/how-to-calculate-age/', priority: 0.8, changeFrequency: 'monthly' },
    ...COMPANY_LINKS.map((link) => ({
      path: `${link.href}/`,
      priority: 0.5,
      changeFrequency: 'monthly' as const
    }))
  ];

  const routes: MetadataRoute.Sitemap = [];

  for (const item of basePaths) {
    const normalizedPath = item.path === '/' ? '' : item.path.endsWith('/') ? item.path.slice(0, -1) : item.path;
    const alternates = {
      languages: getAlternateLanguages(item.path, baseUrl)
    };

    // Default English URL
    routes.push({
      url: `${baseUrl}${normalizedPath}/`,
      lastModified: now,
      changeFrequency: item.changeFrequency,
      priority: item.priority,
      alternates
    });

    // All 38 clean localized URLs (e.g. https://agecalculators.dev/de/ or https://agecalculators.dev/de/age-calculator/)
    for (const lang of LANGUAGES) {
      if (lang.code !== 'en') {
        routes.push({
          url: `${baseUrl}/${lang.code}${normalizedPath}/`,
          lastModified: now,
          changeFrequency: item.changeFrequency,
          priority: Math.max(0.4, Number((item.priority * 0.9).toFixed(2))),
          alternates
        });
      }
    }
  }

  return routes;
}
