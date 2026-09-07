'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Language, LANGUAGES, DEFAULT_LANGUAGE, getLanguageByCode } from './languages';
import { TranslationKey, getTranslation } from './dictionaries';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (code: string) => void;
  t: (key: TranslationKey, fallback?: string) => string;
  isRTL: boolean;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  allLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const COOKIE_NAME = 'NEXT_LOCALE';
const STORAGE_KEY = 'app_language';

function getLangFromPathname(pathname: string): Language | null {
  if (!pathname) return null;
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0) {
    const first = segments[0].toLowerCase();
    const found = LANGUAGES.find((l) => l.code === first);
    if (found) {
      return found;
    }
  }
  return null;
}

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  try {
    // 1. Check URL path (e.g. /de/ or /es/age-calculator/) - HIGHEST PRIORITY for SEO URLs
    const pathLang = getLangFromPathname(window.location.pathname);
    if (pathLang) {
      return pathLang;
    }

    // 2. Check URL query param ?lang=
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang');
    if (langParam) {
      return getLanguageByCode(langParam);
    }

    // 3. Check localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return getLanguageByCode(saved);
    }

    // 4. Check cookie
    const match = document.cookie.match(new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`));
    if (match && match[2]) {
      return getLanguageByCode(match[2]);
    }

    // 5. Check browser navigator.language
    if (navigator.language) {
      return getLanguageByCode(navigator.language);
    }
  } catch {
    // Fallback to default
  }

  return DEFAULT_LANGUAGE;
}

function applyGoogleTranslate(targetCode: string) {
  if (typeof window === 'undefined') return;

  const hostname = window.location.hostname;
  const isEn = targetCode === 'en';

  try {
    if (isEn) {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;
    } else {
      const val = `/en/${targetCode}`;
      document.cookie = `googtrans=${val}; path=/; max-age=31536000; SameSite=Lax;`;
      document.cookie = `googtrans=${val}; path=/; domain=${hostname}; max-age=31536000; SameSite=Lax;`;
      document.cookie = `googtrans=${val}; path=/; domain=.${hostname}; max-age=31536000; SameSite=Lax;`;
    }
  } catch {
    // Ignore cookie errors
  }

  const tryChangeCombo = (attempts: number) => {
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (combo) {
      if (combo.value !== (isEn ? 'en' : targetCode)) {
        combo.value = isEn ? 'en' : targetCode;
        combo.dispatchEvent(new Event('change'));
      }
    } else if (attempts > 0) {
      setTimeout(() => tryChangeCombo(attempts - 1), 250);
    }
  };

  tryChangeCombo(8);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return getInitialLanguage();
    }
    return DEFAULT_LANGUAGE;
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Synchronize document attributes on language change
    document.documentElement.lang = currentLanguage.code;
    document.documentElement.dir = currentLanguage.dir;
    applyGoogleTranslate(currentLanguage.code);
  }, [currentLanguage]);

  const setLanguage = useCallback((code: string) => {
    const lang = getLanguageByCode(code);
    setCurrentLanguageState(lang);

    try {
      localStorage.setItem(STORAGE_KEY, lang.code);
      document.cookie = `${COOKIE_NAME}=${lang.code};path=/;max-age=31536000;SameSite=Lax`;
      document.documentElement.lang = lang.code;
      document.documentElement.dir = lang.dir;

      applyGoogleTranslate(lang.code);

      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const segments = currentPath.split('/').filter(Boolean);
        let subPath = '';

        // If current URL already has a language code in the first segment, remove it
        if (segments.length > 0 && LANGUAGES.some((l) => l.code === segments[0].toLowerCase())) {
          subPath = '/' + segments.slice(1).join('/');
        } else {
          subPath = currentPath;
        }

        if (!subPath.startsWith('/')) subPath = '/' + subPath;
        if (subPath !== '/' && !subPath.endsWith('/')) subPath = subPath + '/';

        let targetUrl = '';
        if (lang.code === 'en') {
          targetUrl = subPath === '//' ? '/' : subPath;
        } else {
          targetUrl = `/${lang.code}${subPath === '/' ? '/' : subPath}`;
        }

        if (window.location.pathname !== targetUrl) {
          router.push(targetUrl);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, [router]);

  const t = useCallback(
    (key: TranslationKey, fallback?: string): string => {
      return getTranslation(currentLanguage.code, key, fallback);
    },
    [currentLanguage]
  );

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        isRTL: currentLanguage.dir === 'rtl',
        isModalOpen,
        openModal,
        closeModal,
        allLanguages: LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
