export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  targetKeyword: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr', targetKeyword: 'Age Calculator' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr', targetKeyword: 'आयु कैलकुलेटर' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr', targetKeyword: 'Calculadora de Edad' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr', targetKeyword: 'Calculateur d\'Âge' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr', targetKeyword: 'Altersrechner' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', dir: 'ltr', targetKeyword: 'Calculadora de Idade' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl', targetKeyword: 'حاسبة العمر' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', dir: 'rtl', targetKeyword: 'מחשבון גיל' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', dir: 'rtl', targetKeyword: 'عمر کیلکولیٹر' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', dir: 'rtl', targetKeyword: 'محاسبه سن' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr', targetKeyword: 'Kalkulator Usia' },
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳', dir: 'ltr', targetKeyword: '年龄计算器' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr', targetKeyword: 'Калькулятор Возраста' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr', targetKeyword: '年齢計算機' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', dir: 'ltr', targetKeyword: 'বয়স ক্যালকুলেটর' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', dir: 'ltr', targetKeyword: 'వయస్సు కాలిక్యులేటర్' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', dir: 'ltr', targetKeyword: 'வயது கால்குலேட்டர்' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', dir: 'ltr', targetKeyword: 'वय कॅल्क्युलेटर' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', dir: 'ltr', targetKeyword: 'Calcolo Età' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', dir: 'ltr', targetKeyword: 'Yaş Hesaplama' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', dir: 'ltr', targetKeyword: '나이 계산기' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', dir: 'ltr', targetKeyword: 'Tính Tuổi' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', dir: 'ltr', targetKeyword: 'คำนวณอายุ' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', dir: 'ltr', targetKeyword: 'Kalkulator Wieku' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', dir: 'ltr', targetKeyword: 'Leeftijd Berekenen' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', dir: 'ltr', targetKeyword: 'Калькулятор Віку' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', dir: 'ltr', targetKeyword: 'Kira Umur' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', dir: 'ltr', targetKeyword: 'Calculator Vârstă' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷', dir: 'ltr', targetKeyword: 'Υπολογισμός Ηλικίας' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', dir: 'ltr', targetKeyword: 'Kalkulačka Věku' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪', dir: 'ltr', targetKeyword: 'Räkna Ut Ålder' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺', dir: 'ltr', targetKeyword: 'Életkor Számítás' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', dir: 'ltr', targetKeyword: 'ਉਮਰ ਕੈਲਕੁਲੇਟਰ' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', dir: 'ltr', targetKeyword: 'ઉંમર કેલ્ક્યુલેટર' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', dir: 'ltr', targetKeyword: 'ವಯಸ್ಸಿನ ಕ್ಯಾಲ್ಕುಲೇಟರ್' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', dir: 'ltr', targetKeyword: 'പ്രായ കാൽക്കുലേറ്റർ' },
  { code: 'fil', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭', dir: 'ltr', targetKeyword: 'Kalkulator ng Edad' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰', dir: 'ltr', targetKeyword: 'Beregn Alder' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮', dir: 'ltr', targetKeyword: 'Ikälaskuri' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴', dir: 'ltr', targetKeyword: 'Beregne Alder' }
];

export const DEFAULT_LANGUAGE: LanguageConfig = SUPPORTED_LANGUAGES[0];

export function isValidLocale(code: string): boolean {
  return SUPPORTED_LANGUAGES.some((lang) => lang.code === code);
}

export function getLanguage(code: string): LanguageConfig {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code) || DEFAULT_LANGUAGE;
}

export function getHrefForLocale(targetLocale: string, currentPathname: string): string {
  const parts = currentPathname.split('/').filter(Boolean);

  if (parts.length > 0 && isValidLocale(parts[0])) {
    parts.shift();
  }

  const subpath = parts.join('/');

  if (targetLocale === 'en') {
    return subpath ? `/${subpath}/` : '/';
  }

  return subpath ? `/${targetLocale}/${subpath}/` : `/${targetLocale}/`;
}
