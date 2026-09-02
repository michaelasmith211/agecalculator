import { MetadataRoute } from 'next';
import { SITE_CONFIG, ALL_CALCULATORS, COMPANY_LINKS } from '@/lib/constants';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.domain;
  const now = new Date();

  // Root & Primary pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0
    },
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
