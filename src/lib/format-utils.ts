import { getLocaleConfig } from '../i18n/config';

/**
 * Format a number using native Intl.NumberFormat based on locale.
 */
export function formatNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions
): string {
  const config = getLocaleConfig(locale);
  try {
    return new Intl.NumberFormat(config.intlLocale, options).format(value);
  } catch {
    return value.toLocaleString();
  }
}

/**
 * Format a full date (e.g. "September 7, 2026") using native Intl.DateTimeFormat.
 */
export function formatDate(
  date: Date,
  locale: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
): string {
  const config = getLocaleConfig(locale);
  try {
    return new Intl.DateTimeFormat(config.intlLocale, options).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

/**
 * Format a short date (e.g. "Sep 7, 2026").
 */
export function formatDateShort(date: Date, locale: string): string {
  return formatDate(date, locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format a weekday name (e.g. "Monday").
 */
export function formatWeekday(date: Date, locale: string): string {
  const config = getLocaleConfig(locale);
  try {
    return new Intl.DateTimeFormat(config.intlLocale, { weekday: 'long' }).format(date);
  } catch {
    return date.toLocaleDateString(undefined, { weekday: 'long' });
  }
}
