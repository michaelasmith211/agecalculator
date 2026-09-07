import { LOCALES, SUPPORTED_LOCALES, NON_DEFAULT_LOCALES, DEFAULT_LOCALE, isValidLocale } from './config';
import { SITE_CONFIG } from '../lib/constants';

/**
 * Detect the locale prefix from a pathname.
 * e.g. "/fr/birthday-calculator" -> "fr"
 * "/birthday-calculator" -> "en"
 * "/es/" -> "es"
 * "/" -> "en"
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
 * "/age-calculator/" -> "age-calculator"
 * "/es/" -> ""
 * "/" -> ""
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
 * English does not use an /en prefix; it lives at root / and /[slug]/.
 * e.g. target="en", current="/es/birthday-calculator" -> "/birthday-calculator/"
 * e.g. target="es", current="/birthday-calculator" -> "/es/birthday-calculator/"
 * e.g. target="en", current="/es/" -> "/"
 * e.g. target="fr", current="/" -> "/fr/"
 */
export function getLocalizedPath(
  targetLocale: string,
  currentPathname: string,
  search?: string
): string {
  const [pathnameOnly, inlineSearch] = (currentPathname || '').split('?');
  const subpath = stripLocale(pathnameOnly);
  const locale = isValidLocale(targetLocale) ? targetLocale : DEFAULT_LOCALE;

  let base: string;
  if (locale === DEFAULT_LOCALE) {
    base = subpath ? `/${subpath}/` : '/';
  } else {
    base = subpath ? `/${locale}/${subpath}/` : `/${locale}/`;
  }

  const finalSearch = search || (inlineSearch ? `?${inlineSearch}` : '');
  return finalSearch ? `${base}${finalSearch.startsWith('?') ? finalSearch : `?${finalSearch}`}` : base;
}

/**
 * Get canonical URL for a specific locale and slug.
 * English uses clean root paths without /en.
 */
export function getCanonicalUrl(locale: string, slug?: string): string {
  const cleanLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const cleanSlug = slug ? slug.replace(/^\/+|\/+$/g, '') : '';

  if (cleanLocale === DEFAULT_LOCALE) {
    return cleanSlug ? `${SITE_CONFIG.domain}/${cleanSlug}/` : `${SITE_CONFIG.domain}/`;
  }

  return cleanSlug
    ? `${SITE_CONFIG.domain}/${cleanLocale}/${cleanSlug}/`
    : `${SITE_CONFIG.domain}/${cleanLocale}/`;
}

/**
 * Generate full hreflang dictionary for metadata.alternates.languages.
 * Includes all 27 locales + "x-default" pointing to English root / or /[slug]/.
 */
export function getHreflangAlternates(slug?: string): Record<string, string> {
  const cleanSlug = slug ? slug.replace(/^\/+|\/+$/g, '') : '';
  const enUrl = cleanSlug
    ? `${SITE_CONFIG.domain}/${cleanSlug}/`
    : `${SITE_CONFIG.domain}/`;

  const alternates: Record<string, string> = {
    'x-default': enUrl,
    'en': enUrl
  };

  for (const code of NON_DEFAULT_LOCALES) {
    alternates[code] = cleanSlug
      ? `${SITE_CONFIG.domain}/${code}/${cleanSlug}/`
      : `${SITE_CONFIG.domain}/${code}/`;
  }

  return alternates;
}

/**
 * Get all localized URLs for language selector links.
 * English links to clean root / or /[subpath]/.
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
    let base: string;
    if (code === DEFAULT_LOCALE) {
      base = subpath ? `/${subpath}/` : '/';
    } else {
      base = subpath ? `/${code}/${subpath}/` : `/${code}/`;
    }

    return {
      code,
      nativeName: config.nativeName,
      englishName: config.englishName,
      href: search ? `${base}?${search}` : base,
      dir: config.direction
    };
  });
}
