export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  flag?: string;
  targetKeyword: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', targetKeyword: 'Age Calculator' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr', targetKeyword: 'Calculadora de Edad' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr', targetKeyword: "Calculateur d'Âge" },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr', targetKeyword: 'Altersrechner' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', dir: 'ltr', targetKeyword: 'Calculadora de Idade' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', dir: 'ltr', targetKeyword: 'Calcolatore di Età' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', dir: 'ltr', targetKeyword: 'Leeftijdscalculator' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', dir: 'ltr', targetKeyword: 'Kalkulator Wieku' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', dir: 'ltr', targetKeyword: 'Калькулятор возраста' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', dir: 'ltr', targetKeyword: '年齢計算機' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', dir: 'ltr', targetKeyword: '나이 계산기' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', dir: 'ltr', targetKeyword: '年龄计算器' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr', targetKeyword: 'आयु कैलकुलेटर' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', targetKeyword: 'حاسبة العمر' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', dir: 'rtl', targetKeyword: 'מחשבון גיל' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', dir: 'ltr', targetKeyword: 'Yaş Hesaplayıcı' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', dir: 'ltr', targetKeyword: 'Kalkulator Usia' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', dir: 'ltr', targetKeyword: 'Máy tính tuổi' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', dir: 'ltr', targetKeyword: 'เครื่องคำนวณอายุ' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', dir: 'ltr', targetKeyword: 'Åldersräknare' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', dir: 'ltr', targetKeyword: 'Aldersberegner' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk bokmål', dir: 'ltr', targetKeyword: 'Alderskalkulator' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', dir: 'ltr', targetKeyword: 'Ikälaskuri' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', dir: 'ltr', targetKeyword: 'Věková kalkulačka' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', dir: 'ltr', targetKeyword: 'Calculator de Vârstă' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', dir: 'ltr', targetKeyword: 'Életkorkalkulátor' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', dir: 'ltr', targetKeyword: 'Υπολογιστής Ηλικίας' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', dir: 'ltr', targetKeyword: 'বয়স ক্যালকুলেটর' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', dir: 'rtl', targetKeyword: 'عمر کا کیلکولیٹر' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', dir: 'rtl', targetKeyword: 'ماشین حساب سن' },
  { code: 'tl', name: 'Tagalog', nativeName: 'Tagalog', dir: 'ltr', targetKeyword: 'Calculator ng Edad' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', dir: 'ltr', targetKeyword: 'Kalkulator Umur' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', dir: 'ltr', targetKeyword: 'Калькулятор віку' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', dir: 'ltr', targetKeyword: 'Калкулатор за възраст' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', dir: 'ltr', targetKeyword: 'Kalkulator Dobi' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', dir: 'ltr', targetKeyword: 'Kalkulačka Veku' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', dir: 'ltr', targetKeyword: 'Калкулатор година' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycanca', dir: 'ltr', targetKeyword: 'Yaş Kalkulyatoru' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша', dir: 'ltr', targetKeyword: 'Жас калькуляторы' },
  { code: 'uz', name: 'Uzbek', nativeName: "O'zbekcha", dir: 'ltr', targetKeyword: 'Yosh Kalkulyatori' }
];

export const LANGUAGE_MAP = new Map<string, LanguageInfo>(
  SUPPORTED_LANGUAGES.map((lang) => [lang.code, lang])
);

export function getLanguage(code: string): LanguageInfo {
  return LANGUAGE_MAP.get(code) || SUPPORTED_LANGUAGES[0];
}

export function isValidLocale(code: string): boolean {
  return LANGUAGE_MAP.has(code);
}
