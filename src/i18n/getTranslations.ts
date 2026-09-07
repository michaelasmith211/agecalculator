import { DEFAULT_LOCALE, isRTL, isValidLocale, Direction } from './config';

import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';
import pt from '../locales/pt.json';
import it from '../locales/it.json';
import hi from '../locales/hi.json';
import mr from '../locales/mr.json';
import bn from '../locales/bn.json';
import ar from '../locales/ar.json';
import ru from '../locales/ru.json';
import ja from '../locales/ja.json';
import ko from '../locales/ko.json';
import zh from '../locales/zh.json';
import tr from '../locales/tr.json';
import id from '../locales/id.json';
import nl from '../locales/nl.json';
import pl from '../locales/pl.json';
import sv from '../locales/sv.json';
import da from '../locales/da.json';
import fi from '../locales/fi.json';
import no from '../locales/no.json';
import cs from '../locales/cs.json';
import el from '../locales/el.json';
import he from '../locales/he.json';
import fa from '../locales/fa.json';
import ur from '../locales/ur.json';

export type TranslationSchema = typeof en;

export const DICTIONARIES: Record<string, TranslationSchema> = {
  en,
  es,
  fr,
  de,
  pt,
  it,
  hi,
  mr,
  bn,
  ar,
  ru,
  ja,
  ko,
  zh,
  tr,
  id,
  nl,
  pl,
  sv,
  da,
  fi,
  no,
  cs,
  el,
  he,
  fa,
  ur
};

/**
 * Resolve a nested key such as "navigation.home" or "calculator.calculate"
 */
function resolveNestedKey(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== 'object') return undefined;
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (!current || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

export interface Translator {
  t: (key: string, fallback?: string) => string;
  raw: TranslationSchema;
  locale: string;
  dir: Direction;
}

export function getTranslations(locale: string = DEFAULT_LOCALE): Translator {
  const cleanLocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
  const dict = DICTIONARIES[cleanLocale] || DICTIONARIES[DEFAULT_LOCALE];
  const fallbackDict = DICTIONARIES[DEFAULT_LOCALE];
  const dir: Direction = isRTL(cleanLocale) ? 'rtl' : 'ltr';

  const t = (key: string, fallback?: string): string => {
    const value = resolveNestedKey(dict, key);
    if (typeof value === 'string') return value;

    // Fallback to English if missing in target locale
    const fallbackVal = resolveNestedKey(fallbackDict, key);
    if (typeof fallbackVal === 'string') return fallbackVal;

    return fallback !== undefined ? fallback : key;
  };

  return {
    t,
    raw: dict,
    locale: cleanLocale,
    dir
  };
}
