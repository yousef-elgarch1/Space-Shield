import i18n from '../translations/i18n';

/**
 * Format a date according to the current locale
 * @param date Date to format
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  const locale = i18n.language;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return new Intl.DateTimeFormat(
    locale, 
    options || defaultOptions
  ).format(date);
}

/**
 * Format a number according to the current locale
 * @param number Number to format
 * @param options Intl.NumberFormatOptions
 * @returns Formatted number string
 */
export function formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
  const locale = i18n.language;
  
  return new Intl.NumberFormat(
    locale, 
    options
  ).format(number);
}

/**
 * Format time according to the current locale
 * @param date Date to format
 * @param options Intl.DateTimeFormatOptions for time
 * @returns Formatted time string
 */
export function formatTime(date: Date, options?: Intl.DateTimeFormatOptions): string {
  const locale = i18n.language;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  
  return new Intl.DateTimeFormat(
    locale, 
    options || defaultOptions
  ).format(date);
}

/**
 * Format a relative time (e.g., "2 days ago")
 * @param value The number of units
 * @param unit The unit of time
 * @returns Formatted relative time string
 */
export function formatRelativeTime(
  value: number,
  unit: 'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'
): string {
  const locale = i18n.language;
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  return rtf.format(value, unit);
}