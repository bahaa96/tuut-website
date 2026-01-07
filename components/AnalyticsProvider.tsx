"use client";

import { useEffect } from "react";
import { initializeAnalytics, analytics } from "@/lib/analytics";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  useEffect(() => {
    // Initialize analytics on client side
    const initAnalytics = async () => {
      try {
        await initializeAnalytics({
          providers: ['google'], // Add 'facebook', 'tiktok' as needed
          googleMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-QQQYHWZVFE',
          facebookPixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
          tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
          enableDevelopmentMode: process.env.NODE_ENV === 'development',
          consoleLogLevel: 'debug'
        });

        // Track initial page view
        analytics.trackPageView(window.location.pathname, document.title);

        console.log('[Analytics] Analytics provider initialized successfully');
      } catch (error) {
        console.error('[Analytics] Failed to initialize analytics:', error);
      }
    };

    // Initialize analytics after a short delay to ensure page is fully loaded
    const timer = setTimeout(initAnalytics, 1000);

    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
}