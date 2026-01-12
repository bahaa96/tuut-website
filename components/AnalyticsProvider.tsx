"use client";

import { useEffect, useState } from "react";
import { initializeAnalytics, analytics } from "@/lib/analytics";
import { getConsent, hasConsent } from "@/lib/consent/storage";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [analyticsInitialized, setAnalyticsInitialized] = useState(false);

  useEffect(() => {
    // Initialize analytics on client side - only if user has given consent
    const initAnalytics = async () => {
      try {
        const consent = getConsent();

        // Wait for consent before initializing analytics
        if (!consent) {
          console.log('[Analytics] Waiting for user consent before initializing analytics');
          return;
        }

        // Check if user has consented to analytics
        if (!hasConsent('analytics')) {
          console.log('[Analytics] User has not consented to analytics tracking');
          return;
        }

        // Determine which providers to enable based on consent
        const providers: string[] = [];

        if (hasConsent('analytics')) {
          providers.push('google');
        }

        if (hasConsent('marketing')) {
          // Only enable marketing pixels if user consented to marketing
          if (process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID) {
            providers.push('facebook');
          }
          if (process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID) {
            providers.push('tiktok');
          }
        }

        if (providers.length === 0) {
          console.log('[Analytics] No analytics providers enabled based on consent');
          return;
        }

        await initializeAnalytics({
          providers,
          googleMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-QQQYHWZVFE',
          facebookPixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
          tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
          enableDevelopmentMode: process.env.NODE_ENV === 'development',
          consoleLogLevel: 'debug'
        });

        // Track initial page view
        analytics.trackPageView(window.location.pathname, document.title);

        setAnalyticsInitialized(true);
        console.log('[Analytics] Analytics provider initialized successfully with consent');
      } catch (error) {
        console.error('[Analytics] Failed to initialize analytics:', error);
      }
    };

    // Initialize analytics after a short delay to ensure page is fully loaded
    const timer = setTimeout(initAnalytics, 1000);

    // Listen for consent changes
    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const newConsent = customEvent.detail;

      if (newConsent && hasConsent('analytics') && !analyticsInitialized) {
        // User just gave consent, initialize analytics
        initAnalytics();
      } else if (newConsent && !hasConsent('analytics') && analyticsInitialized) {
        // User revoked consent, reload page to clear analytics
        console.log('[Analytics] User revoked analytics consent, page reload recommended');
        // Note: Properly removing analytics scripts requires page reload
        window.location.reload();
      }
    };

    window.addEventListener('consentChanged', handleConsentChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('consentChanged', handleConsentChange);
    };
  }, [analyticsInitialized]);

  return <>{children}</>;
}