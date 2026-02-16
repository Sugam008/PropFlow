/**
 * Utility functions for PropFlow
 * Currency, date, and validation utilities for Indian market
 */

/**
 * Formats a number as Indian Rupees (INR)
 * Uses Indian numbering system: lakhs, crores
 * Example: 7200000 -> ₹72,00,000
 */
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats amount in lakhs (common Indian real estate format)
 * Example: 7200000 -> ₹72 Lakhs
 */
export const formatLakhs = (amount: number): string => {
  const lakhs = amount / 100000;
  return (
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(lakhs) + ' Lakhs'
  );
};

/**
 * Formats price per square foot
 * Example: 5000 -> ₹5,000/sq.ft
 */
export const formatPricePerSqFt = (price: number): string => {
  return (
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + '/sq.ft'
  );
};

/**
 * Formats a date string or object to a standard display format
 * Uses Indian date format: DD MMM YYYY
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
};

/**
 * Formats a date with time
 * Uses Indian format: DD MMM YYYY, HH:MM
 */
export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

/**
 * Formats a relative time (e.g., "2 hours ago", "in 3 days")
 */
export const formatRelative = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return formatDate(d);
};

/**
 * Formats ETA (Estimated Time of Arrival/Completion)
 * Returns a human-readable estimate
 */
export const formatETA = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffMs < 0) return 'Completed';
  if (diffHours < 1) return 'Less than an hour';
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''}`;

  return formatDate(d);
};

/**
 * Formats duration in minutes to human readable format
 * Example: 125 -> "2h 5m"
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

/**
 * Validates Indian phone number
 * Accepts: +91XXXXXXXXXX, 91XXXXXXXXXX, XXXXXXXXXX (10 digits)
 */
export const isValidIndianPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  const regex = /^(\+?91|0)?[6-9]\d{9}$/;
  return regex.test(cleaned);
};

/**
 * Validates Indian PIN code (6 digits)
 */
export const isValidPincode = (pincode: string): boolean => {
  const regex = /^[1-9]\d{5}$/;
  return regex.test(pincode);
};

/**
 * Validates OTP (6-digit numeric)
 */
export const isValidOTP = (otp: string): boolean => {
  const regex = /^\d{6}$/;
  return regex.test(otp);
};

/**
 * Validates property area (positive number, reasonable max)
 */
export const isValidArea = (area: number, maxSqFt: number = 100000): boolean => {
  return typeof area === 'number' && area > 0 && area <= maxSqFt;
};

/**
 * Validates email address
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Type guard to check if a value is defined
 */
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

/**
 * Truncates a string with ellipsis
 */
export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Calculates a percentage
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Formats a number with commas (Indian system)
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Parses a string to number, handling Indian format
 */
export const parseIndianNumber = (str: string): number => {
  return parseFloat(str.replace(/[,₹\s]/g, '')) || 0;
};

export { analytics, TRACKING_EVENTS } from './analytics';
