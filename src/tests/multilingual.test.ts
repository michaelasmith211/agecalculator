import { describe, it, expect } from 'vitest';
import { LOCALES, SUPPORTED_LOCALES, RTL_LOCALES, isRTL, getLocaleConfig } from '../i18n/config';
import { getTranslations, DICTIONARIES } from '../i18n/getTranslations';
import { getLocalizedPath, getCanonicalUrl, getHreflangAlternates, stripLocale, detectLocale } from '../i18n/locale-utils';
import { formatNumber, formatDate, formatWeekday } from '../lib/format-utils';

describe('Multilingual System (27 Locales)', () => {
  it('should support exactly 27 locales', () => {
    expect(SUPPORTED_LOCALES.length).toBe(27);
    expect(Object.keys(LOCALES).length).toBe(27);
    expect(Object.keys(DICTIONARIES).length).toBe(27);
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

  it('should preserve page paths and query parameters when switching languages', () => {
    expect(getLocalizedPath('fr', '/en/birthday-calculator/')).toBe('/fr/birthday-calculator/');
    expect(getLocalizedPath('de', '/es/age-difference-calculator/')).toBe('/de/age-difference-calculator/');
    expect(getLocalizedPath('ar', '/en/')).toBe('/ar/');
    expect(getLocalizedPath('hi', '/fr/days-between-dates/?start=2020')).toBe('/hi/days-between-dates/?start=2020');
  });

  it('should generate canonical URLs correctly per language', () => {
    expect(getCanonicalUrl('en')).toBe('https://agecalculators.dev/en/');
    expect(getCanonicalUrl('es', 'birthday-calculator')).toBe('https://agecalculators.dev/es/birthday-calculator/');
    expect(getCanonicalUrl('ar', 'age-difference-calculator')).toBe('https://agecalculators.dev/ar/age-difference-calculator/');
  });

  it('should generate complete hreflang alternates (27 languages + x-default = 28)', () => {
    const alternates = getHreflangAlternates('birthday-calculator');
    expect(Object.keys(alternates).length).toBe(28);
    expect(alternates['x-default']).toBe('https://agecalculators.dev/en/birthday-calculator/');
    expect(alternates['en']).toBe('https://agecalculators.dev/en/birthday-calculator/');
    expect(alternates['es']).toBe('https://agecalculators.dev/es/birthday-calculator/');
    expect(alternates['ar']).toBe('https://agecalculators.dev/ar/birthday-calculator/');
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
    expect(detectLocale('/invalid/page')).toBe('en');
    expect(stripLocale('/es/birthday-calculator/')).toBe('birthday-calculator');
    expect(stripLocale('/en/')).toBe('');
  });
});
