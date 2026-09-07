import { MetadataRoute } from 'next';
import { SITE_CONFIG, ALL_CALCULATORS, COMPANY_LINKS } from '@/lib/constants';
import { LANGUAGES } from '@/lib/i18n/languages';

export const dynamic = 'force-static';

function getAlternateLanguages(path: string, baseUrl: string): Record<string, string> {
  const languages: Record<string, string> = {
    'x-default': `${baseUrl}${path}`
  };
  for (const lang of LANGUAGES) {
    if (lang.code === 'en') {
      languages['en'] = `${baseUrl}${path}`;
    } else {
      languages[lang.code] = `${baseUrl}${path}?lang=${lang.code}`;
    }
  }
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.domain;
  const now = new Date();

  const allPaths: Array<{
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

  return allPaths.map((item) => ({
    url: `${baseUrl}${item.path}`,
    lastModified: now,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
    alternates: {
      languages: getAlternateLanguages(item.path, baseUrl)
    }
  }));
}
