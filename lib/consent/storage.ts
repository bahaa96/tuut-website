/**
 * Consent Storage Utility
 * Manages user privacy consent preferences for GDPR and US state regulations
 */

export type ConsentType = 'necessary' | 'analytics' | 'marketing' | 'preferences';

export interface ConsentPreferences {
  necessary: boolean; // Always true, required for site functionality
  analytics: boolean; // Google Analytics, tracking
  marketing: boolean; // Facebook Pixel, TikTok Pixel, ads
  preferences: boolean; // User preferences, personalization
  timestamp: number;
  version: string; // Privacy policy version
}

export interface PrivacyRegion {
  type: 'gdpr' | 'ccpa' | 'other';
  requiresConsent: boolean;
  allowsOptOut: boolean;
}

const CONSENT_KEY = 'tuut_privacy_consent';
const CONSENT_VERSION = '1.0'; // Update this when privacy policy changes

/**
 * Default consent state (all denied except necessary)
 */
export const DEFAULT_CONSENT: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
  timestamp: Date.now(),
  version: CONSENT_VERSION,
};

/**
 * Get stored consent preferences
 */
export function getConsent(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;

    const consent: ConsentPreferences = JSON.parse(stored);

    // Check if consent is for current version
    if (consent.version !== CONSENT_VERSION) {
      return null; // Require new consent if version changed
    }

    return consent;
  } catch (error) {
    console.error('[Consent] Error reading consent:', error);
    return null;
  }
}

/**
 * Save consent preferences
 */
export function saveConsent(preferences: Partial<ConsentPreferences>): void {
  if (typeof window === 'undefined') return;

  try {
    const consent: ConsentPreferences = {
      ...DEFAULT_CONSENT,
      ...preferences,
      necessary: true, // Always true
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };

    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));

    // Dispatch custom event so other components can react
    window.dispatchEvent(new CustomEvent('consentChanged', { detail: consent }));
  } catch (error) {
    console.error('[Consent] Error saving consent:', error);
  }
}

/**
 * Check if user has given consent for a specific type
 */
export function hasConsent(type: ConsentType): boolean {
  const consent = getConsent();
  if (!consent) return false;
  return consent[type] === true;
}

/**
 * Accept all consent types
 */
export function acceptAll(): void {
  saveConsent({
    necessary: true,
    analytics: true,
    marketing: true,
    preferences: true,
  });
}

/**
 * Reject all except necessary
 */
export function rejectAll(): void {
  saveConsent({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });
}

/**
 * Clear all consent (for testing or privacy reset)
 */
export function clearConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONSENT_KEY);
  window.dispatchEvent(new CustomEvent('consentChanged', { detail: null }));
}

/**
 * Check if consent banner should be shown
 */
export function shouldShowConsentBanner(): boolean {
  return getConsent() === null;
}

/**
 * Detect user's privacy region based on various signals
 * This is a best-effort detection - for production, consider using a geolocation API
 */
export function detectPrivacyRegion(): PrivacyRegion {
  if (typeof window === 'undefined') {
    return { type: 'other', requiresConsent: true, allowsOptOut: true };
  }

  // Check timezone for basic region detection
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // EU/EEA timezones (GDPR applies)
  const euTimezones = [
    'Europe/', 'Atlantic/Reykjavik', 'Atlantic/Canary', 'Atlantic/Faroe',
    'Atlantic/Madeira', 'Atlantic/Azores'
  ];

  const isEU = euTimezones.some(tz => timezone.startsWith(tz));

  if (isEU) {
    return {
      type: 'gdpr',
      requiresConsent: true, // GDPR requires opt-in consent
      allowsOptOut: true,
    };
  }

  // US timezones (CCPA/state laws apply)
  const usTimezones = ['America/New_York', 'America/Chicago', 'America/Denver',
                       'America/Los_Angeles', 'America/Phoenix', 'America/Anchorage',
                       'Pacific/Honolulu'];

  const isUS = usTimezones.some(tz => timezone === tz);

  if (isUS) {
    return {
      type: 'ccpa',
      requiresConsent: false, // CCPA allows opt-out rather than opt-in
      allowsOptOut: true,
    };
  }

  // Default: show consent banner to be safe
  return {
    type: 'other',
    requiresConsent: true,
    allowsOptOut: true,
  };
}

/**
 * US states with privacy regulations
 */
export const US_PRIVACY_STATES = [
  'California', // CCPA/CPRA
  'Virginia', // VCDPA
  'Colorado', // CPA
  'Connecticut', // CTDPA
  'Utah', // UCPA
  'Nevada', // Nevada Privacy Law
  'Montana', // MCDPA
  'Oregon', // OCPA
  'Texas', // TDPSA
  'Delaware', // DPDPA
  'Iowa', // Iowa Privacy Law
  'Tennessee', // TIPA
];
