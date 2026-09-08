export type Direction = 'ltr' | 'rtl';

export interface LocaleConfig {
  code: string;
  nativeName: string;
  englishName: string;
  direction: Direction;
  intlLocale: string;
  ogLocale: string;
  enabled: boolean;
  default?: boolean;
}

export const DEFAULT_LOCALE = 'en';

export const LOCALES: Record<string, LocaleConfig> = {
  en: {
    code: 'en',
    nativeName: 'English',
    englishName: 'English',
    direction: 'ltr',
    intlLocale: 'en-US',
    ogLocale: 'en_US',
    enabled: true,
    default: true
  },
  es: {
    code: 'es',
    nativeName: 'Español',
    englishName: 'Spanish',
    direction: 'ltr',
    intlLocale: 'es-ES',
    ogLocale: 'es_ES',
    enabled: true
  },
  fr: {
    code: 'fr',
    nativeName: 'Français',
    englishName: 'French',
    direction: 'ltr',
    intlLocale: 'fr-FR',
    ogLocale: 'fr_FR',
    enabled: true
  },
  de: {
    code: 'de',
    nativeName: 'Deutsch',
    englishName: 'German',
    direction: 'ltr',
    intlLocale: 'de-DE',
    ogLocale: 'de_DE',
    enabled: true
  },
  pt: {
    code: 'pt',
    nativeName: 'Português',
    englishName: 'Portuguese',
    direction: 'ltr',
    intlLocale: 'pt-BR',
    ogLocale: 'pt_BR',
    enabled: true
  },
  it: {
    code: 'it',
    nativeName: 'Italiano',
    englishName: 'Italian',
    direction: 'ltr',
    intlLocale: 'it-IT',
    ogLocale: 'it_IT',
    enabled: true
  },
  hi: {
    code: 'hi',
    nativeName: 'हिन्दी',
    englishName: 'Hindi',
    direction: 'ltr',
    intlLocale: 'hi-IN',
    ogLocale: 'hi_IN',
    enabled: true
  },
  mr: {
    code: 'mr',
    nativeName: 'मराठी',
    englishName: 'Marathi',
    direction: 'ltr',
    intlLocale: 'mr-IN',
    ogLocale: 'mr_IN',
    enabled: true
  },
  bn: {
    code: 'bn',
    nativeName: 'বাংলা',
    englishName: 'Bengali',
    direction: 'ltr',
    intlLocale: 'bn-BD',
    ogLocale: 'bn_BD',
    enabled: true
  },
  ar: {
    code: 'ar',
    nativeName: 'العربية',
    englishName: 'Arabic',
    direction: 'rtl',
    intlLocale: 'ar-SA',
    ogLocale: 'ar_AR',
    enabled: true
  },
  ru: {
    code: 'ru',
    nativeName: 'Русский',
    englishName: 'Russian',
    direction: 'ltr',
    intlLocale: 'ru-RU',
    ogLocale: 'ru_RU',
    enabled: true
  },
  ja: {
    code: 'ja',
    nativeName: '日本語',
    englishName: 'Japanese',
    direction: 'ltr',
    intlLocale: 'ja-JP',
    ogLocale: 'ja_JP',
    enabled: true
  },
  ko: {
    code: 'ko',
    nativeName: '한국어',
    englishName: 'Korean',
    direction: 'ltr',
    intlLocale: 'ko-KR',
    ogLocale: 'ko_KR',
    enabled: true
  },
  zh: {
    code: 'zh',
    nativeName: '中文',
    englishName: 'Chinese',
    direction: 'ltr',
    intlLocale: 'zh-CN',
    ogLocale: 'zh_CN',
    enabled: true
  },
  tr: {
    code: 'tr',
    nativeName: 'Türkçe',
    englishName: 'Turkish',
    direction: 'ltr',
    intlLocale: 'tr-TR',
    ogLocale: 'tr_TR',
    enabled: true
  },
  id: {
    code: 'id',
    nativeName: 'Bahasa Indonesia',
    englishName: 'Indonesian',
    direction: 'ltr',
    intlLocale: 'id-ID',
    ogLocale: 'id_ID',
    enabled: true
  },
  nl: {
    code: 'nl',
    nativeName: 'Nederlands',
    englishName: 'Dutch',
    direction: 'ltr',
    intlLocale: 'nl-NL',
    ogLocale: 'nl_NL',
    enabled: true
  },
  pl: {
    code: 'pl',
    nativeName: 'Polski',
    englishName: 'Polish',
    direction: 'ltr',
    intlLocale: 'pl-PL',
    ogLocale: 'pl_PL',
    enabled: true
  },
  sv: {
    code: 'sv',
    nativeName: 'Svenska',
    englishName: 'Swedish',
    direction: 'ltr',
    intlLocale: 'sv-SE',
    ogLocale: 'sv_SE',
    enabled: true
  },
  da: {
    code: 'da',
    nativeName: 'Dansk',
    englishName: 'Danish',
    direction: 'ltr',
    intlLocale: 'da-DK',
    ogLocale: 'da_DK',
    enabled: true
  },
  fi: {
    code: 'fi',
    nativeName: 'Suomi',
    englishName: 'Finnish',
    direction: 'ltr',
    intlLocale: 'fi-FI',
    ogLocale: 'fi_FI',
    enabled: true
  },
  no: {
    code: 'no',
    nativeName: 'Norsk bokmål',
    englishName: 'Norwegian',
    direction: 'ltr',
    intlLocale: 'nb-NO',
    ogLocale: 'nb_NO',
    enabled: true
  },
  cs: {
    code: 'cs',
    nativeName: 'Čeština',
    englishName: 'Czech',
    direction: 'ltr',
    intlLocale: 'cs-CZ',
    ogLocale: 'cs_CZ',
    enabled: true
  },
  el: {
    code: 'el',
    nativeName: 'Ελληνικά',
    englishName: 'Greek',
    direction: 'ltr',
    intlLocale: 'el-GR',
    ogLocale: 'el_GR',
    enabled: true
  },
  he: {
    code: 'he',
    nativeName: 'עברית',
    englishName: 'Hebrew',
    direction: 'rtl',
    intlLocale: 'he-IL',
    ogLocale: 'he_IL',
    enabled: true
  },
  fa: {
    code: 'fa',
    nativeName: 'فارسی',
    englishName: 'Persian',
    direction: 'rtl',
    intlLocale: 'fa-IR',
    ogLocale: 'fa_IR',
    enabled: true
  },
  ur: {
    code: 'ur',
    nativeName: 'اردو',
    englishName: 'Urdu',
    direction: 'rtl',
    intlLocale: 'ur-PK',
    ogLocale: 'ur_PK',
    enabled: true
  },
  az: {
    code: 'az',
    nativeName: 'Azərbaycanca',
    englishName: 'Azerbaijani',
    direction: 'ltr',
    intlLocale: 'az-AZ',
    ogLocale: 'az_AZ',
    enabled: true
  },
  bg: {
    code: 'bg',
    nativeName: 'Български',
    englishName: 'Bulgarian',
    direction: 'ltr',
    intlLocale: 'bg-BG',
    ogLocale: 'bg_BG',
    enabled: true
  },
  hr: {
    code: 'hr',
    nativeName: 'Hrvatski',
    englishName: 'Croatian',
    direction: 'ltr',
    intlLocale: 'hr-HR',
    ogLocale: 'hr_HR',
    enabled: true
  },
  hu: {
    code: 'hu',
    nativeName: 'Magyar',
    englishName: 'Hungarian',
    direction: 'ltr',
    intlLocale: 'hu-HU',
    ogLocale: 'hu_HU',
    enabled: true
  },
  kk: {
    code: 'kk',
    nativeName: 'Қазақша',
    englishName: 'Kazakh',
    direction: 'ltr',
    intlLocale: 'kk-KZ',
    ogLocale: 'kk_KZ',
    enabled: true
  },
  ms: {
    code: 'ms',
    nativeName: 'Bahasa Melayu',
    englishName: 'Malay',
    direction: 'ltr',
    intlLocale: 'ms-MY',
    ogLocale: 'ms_MY',
    enabled: true
  },
  ro: {
    code: 'ro',
    nativeName: 'Română',
    englishName: 'Romanian',
    direction: 'ltr',
    intlLocale: 'ro-RO',
    ogLocale: 'ro_RO',
    enabled: true
  },
  sk: {
    code: 'sk',
    nativeName: 'Slovenčina',
    englishName: 'Slovak',
    direction: 'ltr',
    intlLocale: 'sk-SK',
    ogLocale: 'sk_SK',
    enabled: true
  },
  sr: {
    code: 'sr',
    nativeName: 'Српски',
    englishName: 'Serbian',
    direction: 'ltr',
    intlLocale: 'sr-RS',
    ogLocale: 'sr_RS',
    enabled: true
  },
  th: {
    code: 'th',
    nativeName: 'ไทย',
    englishName: 'Thai',
    direction: 'ltr',
    intlLocale: 'th-TH',
    ogLocale: 'th_TH',
    enabled: true
  },
  tl: {
    code: 'tl',
    nativeName: 'Tagalog',
    englishName: 'Tagalog',
    direction: 'ltr',
    intlLocale: 'tl-PH',
    ogLocale: 'fil_PH',
    enabled: true
  },
  uz: {
    code: 'uz',
    nativeName: 'Oʻzbekcha',
    englishName: 'Uzbek',
    direction: 'ltr',
    intlLocale: 'uz-UZ',
    ogLocale: 'uz_UZ',
    enabled: true
  },
  vi: {
    code: 'vi',
    nativeName: 'Tiếng Việt',
    englishName: 'Vietnamese',
    direction: 'ltr',
    intlLocale: 'vi-VN',
    ogLocale: 'vi_VN',
    enabled: true
  }
};

export const SUPPORTED_LOCALES = Object.keys(LOCALES);
export const NON_DEFAULT_LOCALES = SUPPORTED_LOCALES.filter((code) => code !== DEFAULT_LOCALE);

export const RTL_LOCALES = ['ar', 'he', 'fa', 'ur'];

export function isValidLocale(code: string): boolean {
  return Object.prototype.hasOwnProperty.call(LOCALES, code);
}

export function getLocaleConfig(code: string): LocaleConfig {
  return LOCALES[code] || LOCALES[DEFAULT_LOCALE];
}

export function isRTL(code: string): boolean {
  return getLocaleConfig(code).direction === 'rtl';
}
