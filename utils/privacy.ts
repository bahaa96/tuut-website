// Privacy Consent Management Utility

export type USState = "CA" | "VA" | "CO" | "CT" | "UT" | "OTHER";

export type ConsentPreferences = {
  necessary: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  timestamp: number;
  region?: "eu" | "us" | "other";
  usState?: USState; // Specific US state for granular privacy laws
  doNotSell?: boolean; // US-specific (CCPA/CPRA)
};

const CONSENT_KEY = "tuut_privacy_consent";
const CONSENT_VERSION = "1.0";

// US States with privacy laws
export const US_PRIVACY_STATES = {
  CA: "California (CCPA/CPRA)", // California Consumer Privacy Act / California Privacy Rights Act
  VA: "Virginia (VCDPA)", // Virginia Consumer Data Protection Act
  CO: "Colorado (CPA)", // Colorado Privacy Act
  CT: "Connecticut (CTDPA)", // Connecticut Data Privacy Act
  UT: "Utah (UCPA)", // Utah Consumer Privacy Act
};

// Detect user region (simplified - in production, use geolocation API)
export function detectRegion(): "eu" | "us" | "other" {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // EU timezones (simplified list)
  const euTimezones = [
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Europe/Madrid",
    "Europe/Rome",
    "Europe/Amsterdam",
    "Europe/Brussels",
    "Europe/Vienna",
    "Europe/Stockholm",
    "Europe/Copenhagen",
    "Europe/Helsinki",
    "Europe/Dublin",
    "Europe/Lisbon",
    "Europe/Prague",
    "Europe/Warsaw",
    "Europe/Budapest",
    "Europe/Athens",
    "Europe/Bucharest",
    "Europe/Sofia",
    "Europe/Zagreb",
  ];

  // US timezones
  const usTimezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Phoenix",
    "America/Anchorage",
    "Pacific/Honolulu",
  ];

  if (euTimezones.some((tz) => timezone.includes(tz))) {
    return "eu";
  } else if (usTimezones.some((tz) => timezone.includes(tz))) {
    return "us";
  }

  return "other";
}

// Detect US state based on timezone (simplified)
export function detectUSState(): USState {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Map timezones to states with privacy laws
  if (
    timezone.includes("Los_Angeles") ||
    timezone.includes("America/Los_Angeles")
  ) {
    return "CA"; // California
  } else if (
    timezone.includes("Denver") ||
    timezone.includes("America/Denver")
  ) {
    return "CO"; // Colorado (Mountain Time)
  } else if (timezone.includes("New_York") && timezone.includes("Richmond")) {
    return "VA"; // Virginia
  } else if (timezone.includes("New_York") && timezone.includes("Hartford")) {
    return "CT"; // Connecticut
  } else if (timezone.includes("Denver") && timezone.includes("Salt_Lake")) {
    return "UT"; // Utah
  }

  // Note: This is a simplified detection. In production, you should use:
  // 1. IP-based geolocation API (e.g., MaxMind, ipapi.co)
  // 2. User's stored location preference
  // 3. Browser's Geolocation API (with permission)

  return "OTHER";
}

// Get stored consent preferences
export function getConsentPreferences(): ConsentPreferences | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored);

    // Check version compatibility
    if (data.version !== CONSENT_VERSION) {
      return null;
    }

    return data.preferences;
  } catch (error) {
    console.error("Error reading consent preferences:", error);
    return null;
  }
}

// Save consent preferences
export function saveConsentPreferences(preferences: ConsentPreferences): void {
  try {
    const data = {
      version: CONSENT_VERSION,
      preferences,
    };

    localStorage.setItem(CONSENT_KEY, JSON.stringify(data));

    // Trigger custom event for listeners
    window.dispatchEvent(
      new CustomEvent("consentUpdated", { detail: preferences })
    );
  } catch (error) {
    console.error("Error saving consent preferences:", error);
  }
}

// Check if user has made a consent choice
export function hasConsent(): boolean {
  return getConsentPreferences() !== null;
}

// Get default preferences based on region
export function getDefaultPreferences(
  region: "eu" | "us" | "other"
): ConsentPreferences {
  if (region === "eu") {
    // GDPR: Opt-in required for all non-essential cookies
    return {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
      timestamp: Date.now(),
      region,
    };
  } else if (region === "us") {
    // US: Opt-out model, but respect "Do Not Sell"
    return {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
      timestamp: Date.now(),
      region,
      doNotSell: false,
    };
  } else {
    // Other regions: Opt-in
    return {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
      timestamp: Date.now(),
      region,
    };
  }
}

// Accept all cookies
export function acceptAllCookies(region: "eu" | "us" | "other"): void {
  const preferences: ConsentPreferences = {
    necessary: true,
    analytics: true,
    marketing: true,
    personalization: true,
    timestamp: Date.now(),
    region,
    ...(region === "us" && { doNotSell: false }),
  };

  saveConsentPreferences(preferences);
  initializeAnalytics(preferences);
}

// Reject all non-essential cookies
export function rejectAllCookies(region: "eu" | "us" | "other"): void {
  const preferences: ConsentPreferences = {
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false,
    timestamp: Date.now(),
    region,
    ...(region === "us" && { doNotSell: true }),
  };

  saveConsentPreferences(preferences);
  disableAnalytics();
}

// US-specific: Opt out of sale/sharing
export function optOutOfSale(): void {
  const current = getConsentPreferences();
  if (current) {
    saveConsentPreferences({
      ...current,
      doNotSell: true,
      marketing: false,
      personalization: false,
      timestamp: Date.now(),
    });
  }
}

// Initialize analytics based on consent
export function initializeAnalytics(preferences: ConsentPreferences): void {
  if (preferences.analytics) {
    // Initialize analytics tracking (e.g., Google Analytics, etc.)
    console.log("✅ Analytics enabled");

    // Example: Initialize Google Analytics
    // window.gtag('consent', 'update', {
    //   'analytics_storage': 'granted'
    // });
  }
}

// Disable analytics
export function disableAnalytics(): void {
  console.log("❌ Analytics disabled");

  // Example: Disable Google Analytics
  // window.gtag('consent', 'update', {
  //   'analytics_storage': 'denied'
  // });
}

// Check if analytics is enabled
export function isAnalyticsEnabled(): boolean {
  const preferences = getConsentPreferences();
  return preferences?.analytics || false;
}

// Check if marketing is enabled
export function isMarketingEnabled(): boolean {
  const preferences = getConsentPreferences();
  return preferences?.marketing || false;
}

// Check if personalization is enabled
export function isPersonalizationEnabled(): boolean {
  const preferences = getConsentPreferences();
  return preferences?.personalization || false;
}
