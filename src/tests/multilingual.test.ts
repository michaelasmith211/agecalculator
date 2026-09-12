import { describe, it, expect } from 'vitest';
import { LOCALES, SUPPORTED_LOCALES, NON_DEFAULT_LOCALES, RTL_LOCALES, isRTL, getLocaleConfig } from '../i18n/config';
import { getTranslations, DICTIONARIES } from '../i18n/getTranslations';
import { getLocalizedPath, getCanonicalUrl, getHreflangAlternates, stripLocale, detectLocale } from '../i18n/locale-utils';
import { formatNumber, formatDate, formatWeekday } from '../lib/format-utils';

describe('Multilingual System (40 Locales with Clean Root English)', () => {
  it('should support exactly 40 locales with 39 non-default locales', () => {
    expect(SUPPORTED_LOCALES.length).toBe(40);
    expect(NON_DEFAULT_LOCALES.length).toBe(39);
    expect(Object.keys(LOCALES).length).toBe(40);
    expect(Object.keys(DICTIONARIES).length).toBe(40);
  });

  it('should correctly configure RTL languages', () => {
    expect(RTL_LOCALES).toEqual(['ar', 'he', 'fa', 'ur']);
    for (const code of RTL_LOCALES) {
      expect(isRTL(code)).toBe(true);
      expect(getLocaleConfig(code).direction).toBe('rtl');
    }
    // Verify LTR languages
    expect(isRTL('en')).toBe(false);
    expect(isRTL('es')).toBe(false);
    expect(isRTL('hi')).toBe(false);
    expect(isRTL('th')).toBe(false);
    expect(isRTL('vi')).toBe(false);
  });

  it('should preserve native names without translation in selector config', () => {
    expect(getLocaleConfig('en').nativeName).toBe('English');
    expect(getLocaleConfig('es').nativeName).toBe('Español');
    expect(getLocaleConfig('fr').nativeName).toBe('Français');
    expect(getLocaleConfig('de').nativeName).toBe('Deutsch');
    expect(getLocaleConfig('hi').nativeName).toBe('हिन्दी');
    expect(getLocaleConfig('ar').nativeName).toBe('العربية');
    expect(getLocaleConfig('ja').nativeName).toBe('日本語');
    expect(getLocaleConfig('zh').nativeName).toBe('中文');
    expect(getLocaleConfig('az').nativeName).toBe('Azərbaycanca');
    expect(getLocaleConfig('bg').nativeName).toBe('Български');
    expect(getLocaleConfig('hr').nativeName).toBe('Hrvatski');
    expect(getLocaleConfig('hu').nativeName).toBe('Magyar');
    expect(getLocaleConfig('kk').nativeName).toBe('Қазақша');
    expect(getLocaleConfig('ms').nativeName).toBe('Bahasa Melayu');
    expect(getLocaleConfig('ro').nativeName).toBe('Română');
    expect(getLocaleConfig('sk').nativeName).toBe('Slovenčina');
    expect(getLocaleConfig('sr').nativeName).toBe('Српски');
    expect(getLocaleConfig('th').nativeName).toBe('ไทย');
    expect(getLocaleConfig('tl').nativeName).toBe('Tagalog');
    expect(getLocaleConfig('uz').nativeName).toBe('Oʻzbekcha');
    expect(getLocaleConfig('vi').nativeName).toBe('Tiếng Việt');
  });

  it('should load translation dictionary and translate nested keys for every locale', () => {
    for (const code of SUPPORTED_LOCALES) {
      const translator = getTranslations(code);
      expect(translator.locale).toBe(code);
      expect(translator.t('navigation.home')).toBeTruthy();
      expect(translator.t('calculator.calculate')).toBeTruthy();
      expect(translator.t('calculator.years')).toBeTruthy();
      expect(translator.t('meta.homeTitle')).toBeTruthy();
      expect(translator.t('meta.homeDescription')).toBeTruthy();
    }
  });

  it('should preserve page paths and query parameters when switching languages (English without /en)', () => {
    // Switching to English should route to clean root / or /[subpath]/
    expect(getLocalizedPath('en', '/es/birthday-calculator/')).toBe('/birthday-calculator/');
    expect(getLocalizedPath('en', '/fr/')).toBe('/');
    expect(getLocalizedPath('en', '/')).toBe('/');

    // Switching from clean English to other locales
    expect(getLocalizedPath('fr', '/birthday-calculator/')).toBe('/fr/birthday-calculator/');
    expect(getLocalizedPath('de', '/es/age-difference-calculator/')).toBe('/de/age-difference-calculator/');
    expect(getLocalizedPath('ar', '/')).toBe('/ar/');
    expect(getLocalizedPath('hi', '/fr/days-between-dates/?start=2020')).toBe('/hi/days-between-dates/?start=2020');
  });

  it('should generate canonical URLs correctly (clean root for English, prefixed for others)', () => {
    expect(getCanonicalUrl('en')).toBe('https://agecalculators.dev/');
    expect(getCanonicalUrl('en')).toMatch(/^https:\/\/agecalculators\.dev\//);
    expect(getCanonicalUrl('en', 'how-to-calculate-age')).toBe('https://agecalculators.dev/how-to-calculate-age/');
    expect(getCanonicalUrl('en', 'birthday-calculator')).toBe('https://agecalculators.dev/birthday-calculator/');
    expect(getCanonicalUrl('es', 'birthday-calculator')).toBe('https://agecalculators.dev/es/birthday-calculator/');
    expect(getCanonicalUrl('ar', 'age-difference-calculator')).toBe('https://agecalculators.dev/ar/age-difference-calculator/');
    // Verify HTTPS protocol is strictly enforced on all URLs
    expect(getCanonicalUrl('en').startsWith('https://')).toBe(true);
    expect(getCanonicalUrl('en').includes('http://')).toBe(false);
  });

  it('should generate complete hreflang alternates pointing to clean English for en & x-default', () => {
    const alternates = getHreflangAlternates('birthday-calculator');
    expect(Object.keys(alternates).length).toBe(41);
    expect(alternates['x-default']).toBe('https://agecalculators.dev/birthday-calculator/');
    expect(alternates['en']).toBe('https://agecalculators.dev/birthday-calculator/');
    expect(alternates['es']).toBe('https://agecalculators.dev/es/birthday-calculator/');
    expect(alternates['ar']).toBe('https://agecalculators.dev/ar/birthday-calculator/');
    expect(alternates['th']).toBe('https://agecalculators.dev/th/birthday-calculator/');
    expect(alternates['vi']).toBe('https://agecalculators.dev/vi/birthday-calculator/');

    const homeAlternates = getHreflangAlternates();
    expect(homeAlternates['x-default']).toBe('https://agecalculators.dev/');
    expect(homeAlternates['en']).toBe('https://agecalculators.dev/');
    expect(homeAlternates['fr']).toBe('https://agecalculators.dev/fr/');
    expect(homeAlternates['th']).toBe('https://agecalculators.dev/th/');
  });

  it('should correctly format numbers and dates using native Intl APIs', () => {
    expect(formatNumber(1000, 'en')).toBe('1,000');
    expect(formatNumber(1000, 'de')).toBe('1.000');
    const testDate = new Date('2026-09-07T12:00:00Z');
    expect(formatDate(testDate, 'en')).toBeTruthy();
    expect(formatWeekday(testDate, 'en')).toBe('Monday');
    expect(formatWeekday(testDate, 'fr')).toBe('lundi');
  });

  it('should detect and strip locale correctly from paths', () => {
    expect(detectLocale('/es/age-calculator/')).toBe('es');
    expect(detectLocale('/ar/')).toBe('ar');
    expect(detectLocale('/birthday-calculator/')).toBe('en');
    expect(detectLocale('/')).toBe('en');
    expect(detectLocale('/invalid/page')).toBe('en');
    expect(stripLocale('/es/birthday-calculator/')).toBe('birthday-calculator');
    expect(stripLocale('/birthday-calculator/')).toBe('birthday-calculator');
    expect(stripLocale('/')).toBe('');
  });
});
