import { describe, it, expect } from 'vitest';
import { SUPPORTED_LANGUAGES, getLanguage, isValidLocale } from '../lib/i18n/languages';
import { getTranslation } from '../lib/i18n/translations';

describe('Internationalization (i18n) Engine', () => {
  it('registers all 40 supported languages', () => {
    expect(SUPPORTED_LANGUAGES.length).toBe(40);
  });

  it('correctly flags RTL languages (ar, he, ur, fa)', () => {
    const rtlCodes = ['ar', 'he', 'ur', 'fa'];
    for (const code of rtlCodes) {
      const lang = getLanguage(code);
      expect(lang.dir).toBe('rtl');
    }
  });

  it('correctly flags LTR languages (en, es, fr, de, etc.)', () => {
    const ltrCodes = ['en', 'es', 'fr', 'de', 'pt', 'it', 'ja', 'hi', 'zh'];
    for (const code of ltrCodes) {
      const lang = getLanguage(code);
      expect(lang.dir).toBe('ltr');
    }
  });

  it('validates locales correctly', () => {
    expect(isValidLocale('es')).toBe(true);
    expect(isValidLocale('fr')).toBe(true);
    expect(isValidLocale('ar')).toBe(true);
    expect(isValidLocale('hi')).toBe(true);
    expect(isValidLocale('invalid-lang')).toBe(false);
  });

  it('generates complete translation dictionary for any supported language', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      const t = getTranslation(lang.code);
      expect(t.locale).toBe(lang.code);
      expect(t.pageTitle).toBeTruthy();
      expect(t.metaDescription).toBeTruthy();
      expect(t.h1).toBeTruthy();
      expect(t.calculateBtn).toBeTruthy();
      expect(t.years).toBeTruthy();
      expect(t.months).toBeTruthy();
      expect(t.days).toBeTruthy();
      expect(t.seconds).toBeTruthy();
      expect(t.faqs.length).toBeGreaterThan(0);
    }
  });

  it('provides native translations for major languages', () => {
    const es = getTranslation('es');
    expect(es.calculateBtn).toBe('Calcular Edad');
    expect(es.years).toBe('Años');

    const fr = getTranslation('fr');
    expect(fr.calculateBtn).toBe("Calculer l'Âge");
    expect(fr.years).toBe('Ans');

    const de = getTranslation('de');
    expect(de.calculateBtn).toBe('Alter Berechnen');
    expect(de.years).toBe('Jahre');

    const ar = getTranslation('ar');
    expect(ar.calculateBtn).toBe('احسب العمر');
    expect(ar.years).toBe('سنة');

    const hi = getTranslation('hi');
    expect(hi.calculateBtn).toBe('आयु की गणना करें');
    expect(hi.years).toBe('वर्ष');
  });
});
