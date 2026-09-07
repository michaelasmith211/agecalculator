import { LOCALES, SUPPORTED_LOCALES, DEFAULT_LOCALE, isValidLocale } from './config';
import { SITE_CONFIG } from '../lib/constants';

/**
 * Detect the locale prefix from a pathname.
 * e.g. "/fr/birthday-calculator" -> "fr"
 * "/birthday-calculator" -> "en"
 */
export function detectLocale(pathname: string): string {
  if (!pathname) return DEFAULT_LOCALE;
  const [cleanPath] = pathname.split('?');
  const segments = cleanPath.split('/').filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0])) {
    return segments[0];
  }
  return DEFAULT_LOCALE;
}

/**
 * Strip the locale prefix from a pathname, returning the relative subpath.
 * e.g. "/es/age-calculator/" -> "age-calculator"
 * "/es/" -> ""
 * "/en" -> ""
 */
export function stripLocale(pathname: string): string {
  if (!pathname) return '';
  const [cleanPath] = pathname.split('?');
  const segments = cleanPath.split('/').filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0])) {
    segments.shift();
  }
  return segments.join('/');
}

/**
 * Switch the locale while strictly preserving the current page/path and query parameters.
 * e.g. target="de", current="/es/birthday-calculator?unit=days" -> "/de/birthday-calculator/?unit=days"
 */
export function getLocalizedPath(
  targetLocale: string,
  currentPathname: string,
  search?: string
): string {
  const [pathnameOnly, inlineSearch] = (currentPathname || '').split('?');
  const subpath = stripLocale(pathnameOnly);
  const locale = isValidLocale(targetLocale) ? targetLocale : DEFAULT_LOCALE;
  const base = subpath ? `/${locale}/${subpath}/` : `/${locale}/`;
  const finalSearch = search || (inlineSearch ? `?${inlineSearch}` : '');
  return finalSearch ? `${base}${finalSearch.startsWith('?') ? finalSearch : `?${finalSearch}`}` : base;
}

/**
 * Get canonical URL for a specific locale and slug.
 */
export function getCanonicalUrl(locale: string, slug?: string): string {
  const cleanLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  if (!slug) {
    return `${SITE_CONFIG.domain}/${cleanLocale}/`;
  }
  const cleanSlug = slug.replace(/^\/+|\/+$/g, '');
  return `${SITE_CONFIG.domain}/${cleanLocale}/${cleanSlug}/`;
}

/**
 * Generate full hreflang dictionary for metadata.alternates.languages.
 * Includes all 27 locales + "x-default" pointing to English.
 */
export function getHreflangAlternates(slug?: string): Record<string, string> {
  const cleanSlug = slug ? slug.replace(/^\/+|\/+$/g, '') : '';
  const alternates: Record<string, string> = {
    'x-default': cleanSlug
      ? `${SITE_CONFIG.domain}/${DEFAULT_LOCALE}/${cleanSlug}/`
      : `${SITE_CONFIG.domain}/${DEFAULT_LOCALE}/`
  };

  for (const code of SUPPORTED_LOCALES) {
    alternates[code] = cleanSlug
      ? `${SITE_CONFIG.domain}/${code}/${cleanSlug}/`
      : `${SITE_CONFIG.domain}/${code}/`;
  }

  return alternates;
}

/**
 * Get all localized URLs for language selector links.
 */
export function getAllLanguageLinks(currentPathname: string): Array<{
  code: string;
  nativeName: string;
  englishName: string;
  href: string;
  dir: 'ltr' | 'rtl';
}> {
  const [pathnameOnly, search] = (currentPathname || '').split('?');
  const subpath = stripLocale(pathnameOnly);
  return SUPPORTED_LOCALES.map((code) => {
    const config = LOCALES[code];
    const base = subpath ? `/${code}/${subpath}/` : `/${code}/`;
    return {
      code,
      nativeName: config.nativeName,
      englishName: config.englishName,
      href: search ? `${base}?${search}` : base,
      dir: config.direction
    };
  });
}
