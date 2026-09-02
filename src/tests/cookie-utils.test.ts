import { describe, it, expect, beforeEach } from 'vitest';
import {
  setCookie,
  getCookie,
  deleteCookie,
  saveUserBirthday,
  getSavedUserBirthday,
  clearSavedUserBirthday,
  getCookieConsent,
  setCookieConsent
} from '../lib/cookie-utils';

describe('Cookie & Storage Utilities', () => {
  let cookieStore: Record<string, string> = {};
  let storageStore: Record<string, string> = {};

  beforeEach(() => {
    cookieStore = {};
    storageStore = {};

    // Mock document.cookie for Node test environment
    Object.defineProperty(global, 'document', {
      value: {
        get cookie() {
          return Object.entries(cookieStore)
            .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
            .join('; ');
        },
        set cookie(str: string) {
          const [pair] = str.split(';');
          const [key, val] = pair.split('=');
          if (str.includes('expires=Thu, 01 Jan 1970')) {
            delete cookieStore[key.trim()];
          } else {
            cookieStore[key.trim()] = decodeURIComponent(val || '');
          }
        }
      },
      writable: true,
      configurable: true
    });

    // Mock window.localStorage
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: (k: string) => storageStore[k] || null,
        setItem: (k: string, v: string) => { storageStore[k] = v; },
        removeItem: (k: string) => { delete storageStore[k]; },
        clear: () => { storageStore = {}; }
      },
      writable: true,
      configurable: true
    });
  });

  it('sets, gets and deletes a cookie safely', () => {
    setCookie('test_key', 'test_value', 1);
    expect(getCookie('test_key')).toBe('test_value');

    deleteCookie('test_key');
    expect(getCookie('test_key')).toBeNull();
  });

  it('saves and restores user birthday and time', () => {
    saveUserBirthday('1995-06-15', '14:30', true);
    const saved = getSavedUserBirthday();

    expect(saved).not.toBeNull();
    expect(saved?.dob).toBe('1995-06-15');
    expect(saved?.tob).toBe('14:30');
    expect(saved?.includeTime).toBe(true);
  });

  it('clears saved user birthday from cookies and storage', () => {
    saveUserBirthday('1995-06-15', '14:30', true);
    clearSavedUserBirthday();

    const saved = getSavedUserBirthday();
    expect(saved).toBeNull();
  });

  it('manages cookie consent status properly', () => {
    expect(getCookieConsent()).toBeNull();

    setCookieConsent('all');
    expect(getCookieConsent()).toBe('all');

    setCookieConsent('essential');
    expect(getCookieConsent()).toBe('essential');
  });
});
