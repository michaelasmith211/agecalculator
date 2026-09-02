/**
 * Lightweight Analytics Dispatcher
 * Client-side event logging without external blocking scripts or performance overhead.
 */

type EventName =
  | 'age_calculator_used'
  | 'birthday_calculator_used'
  | 'age_difference_calculated'
  | 'date_difference_calculated'
  | 'dob_calculator_used'
  | 'days_between_calculated'
  | 'chronological_age_calculated'
  | 'retirement_calculated'
  | 'leap_year_calculated'
  | 'reset_calculator';

export function trackEvent(eventName: EventName, params?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return;

  try {
    // Custom event dispatch for optional Google Analytics / Tag Manager integration
    const windowWithGtag = window as unknown as { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] };
    if (typeof windowWithGtag.gtag === 'function') {
      windowWithGtag.gtag('event', eventName, params);
    } else if (Array.isArray(windowWithGtag.dataLayer)) {
      windowWithGtag.dataLayer.push({ event: eventName, ...params });
    }

    // Also dispatch as custom DOM event for testing or local monitoring
    window.dispatchEvent(
      new CustomEvent('app_analytics_event', {
        detail: { eventName, params, timestamp: new Date().toISOString() }
      })
    );
  } catch {
    // Silent fail to ensure zero impact on user experience
  }
}
