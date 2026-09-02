/**
 * Client-Side Cookie & Local Persistence Utilities
 * Compliant with GDPR/CCPA, safe fallback, timezone-independent.
 */

import { isValidDate, parseDateString } from './date-utils';

export interface SavedBirthdayData {
  dob: string;
  tob?: string;
  includeTime?: boolean;
}

export type CookieConsentType = 'all' | 'essential' | null;

/**
 * Set a browser cookie with standard security attributes
 */
export function setCookie(name: string, value: string, days = 365): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 86400 * 1000).toUTCString();
  const encodedValue = encodeURIComponent(value);
  document.cookie = `${name}=${encodedValue}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Get a browser cookie by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Delete a browser cookie
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

/**
 * Save user birth date & time to cookies + localStorage
 */
export function saveUserBirthday(dob: string, tob?: string, includeTime = false): void {
  if (!dob) return;
  const parsed = parseDateString(dob);
  if (!parsed || !isValidDate(parsed.year, parsed.month, parsed.day)) return;

  // Save to Cookies
  setCookie('agecalc_dob', dob, 365);
  if (tob) {
    setCookie('agecalc_tob', tob, 365);
  } else {
    deleteCookie('agecalc_tob');
  }
  setCookie('agecalc_with_time', includeTime ? '1' : '0', 365);

  // Sync to localStorage as fallback
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem('agecalc_saved_birthday', JSON.stringify({
        dob,
        tob: tob || '',
        includeTime
      }));
    } catch {
      // Ignore private mode storage quota errors
    }
  }
}

/**
 * Retrieve saved user birth date & time from cookies or localStorage
 */
export function getSavedUserBirthday(): SavedBirthdayData | null {
  if (typeof document === 'undefined') return null;

  // Try reading from Cookies first
  const cookieDob = getCookie('agecalc_dob');
  const cookieTob = getCookie('agecalc_tob') || undefined;
  const cookieWithTime = getCookie('agecalc_with_time') === '1';

  if (cookieDob) {
    const parsed = parseDateString(cookieDob);
    if (parsed && isValidDate(parsed.year, parsed.month, parsed.day)) {
      return {
        dob: cookieDob,
        tob: cookieTob,
        includeTime: cookieWithTime
      };
    }
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = localStorage.getItem('agecalc_saved_birthday');
      if (stored) {
        const parsedJson = JSON.parse(stored);
        if (parsedJson.dob) {
          const parsed = parseDateString(parsedJson.dob);
          if (parsed && isValidDate(parsed.year, parsed.month, parsed.day)) {
            return {
              dob: parsedJson.dob,
              tob: parsedJson.tob || undefined,
              includeTime: !!parsedJson.includeTime
            };
          }
        }
      }
    } catch {
      // Storage unavailable
    }
  }

  return null;
}

/**
 * Clear saved user birth date from cookies and localStorage
 */
export function clearSavedUserBirthday(): void {
  deleteCookie('agecalc_dob');
  deleteCookie('agecalc_tob');
  deleteCookie('agecalc_with_time');

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem('agecalc_saved_birthday');
    } catch {
      // Ignore
    }
  }
}

/**
 * Cookie Consent Management
 */
export function getCookieConsent(): CookieConsentType {
  const consent = getCookie('agecalc_consent');
  if (consent === 'all' || consent === 'essential') {
    return consent;
  }
  return null;
}

export function setCookieConsent(type: 'all' | 'essential'): void {
  setCookie('agecalc_consent', type, 365);
}
