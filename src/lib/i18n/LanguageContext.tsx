'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { Language, LANGUAGES, DEFAULT_LANGUAGE, getLanguageByCode } from './languages';
import { TranslationKey, getTranslation } from './dictionaries';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (code: string) => void;
  getLocalizedPath: (path: string) => string;
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

function subscribeLanguage(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('popstate', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener('storage', callback);
  };
}

export function LanguageProvider({
  children,
  initialLang
}: {
  children: React.ReactNode;
  initialLang?: string;
}) {
  const router = useRouter();
  const [explicitLang, setExplicitLang] = useState<string | null>(initialLang || null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const syncedCode = useSyncExternalStore(
    subscribeLanguage,
    () => {
      if (explicitLang) return explicitLang;
      return getInitialLanguage().code;
    },
    () => initialLang || DEFAULT_LANGUAGE.code
  );

  const activeCode = explicitLang || syncedCode;
  const currentLanguage = useMemo(() => getLanguageByCode(activeCode), [activeCode]);

  useEffect(() => {
    // Synchronize document attributes on language change
    document.documentElement.lang = currentLanguage.code;
    document.documentElement.dir = currentLanguage.dir;
  }, [currentLanguage]);

  const setLanguage = useCallback((code: string) => {
    const lang = getLanguageByCode(code);
    setExplicitLang(lang.code);

    try {
      localStorage.setItem(STORAGE_KEY, lang.code);
      document.cookie = `${COOKIE_NAME}=${lang.code};path=/;max-age=31536000;SameSite=Lax`;
      document.documentElement.lang = lang.code;
      document.documentElement.dir = lang.dir;

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

  const getLocalizedPath = useCallback(
    (rawPath: string): string => {
      const [pathPart, hashPart] = rawPath.split('#');
      const hashSuffix = hashPart !== undefined ? `#${hashPart}` : '';

      const segments = pathPart.split('/').filter(Boolean);
      let subPath = '';

      // If first segment is already a language code, remove it
      if (segments.length > 0 && LANGUAGES.some((l) => l.code === segments[0].toLowerCase())) {
        subPath = '/' + segments.slice(1).join('/');
      } else {
        subPath = pathPart;
      }

      if (!subPath.startsWith('/')) subPath = '/' + subPath;
      if (subPath !== '/' && !subPath.endsWith('/')) subPath = subPath + '/';

      if (currentLanguage.code === 'en') {
        const cleanEn = subPath === '//' ? '/' : subPath;
        return `${cleanEn}${hashSuffix}`;
      }

      const localized = `/${currentLanguage.code}${subPath === '/' ? '/' : subPath}`;
      return `${localized}${hashSuffix}`;
    },
    [currentLanguage]
  );

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
        getLocalizedPath,
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
