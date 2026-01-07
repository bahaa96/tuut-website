/**
 * Analytics Factory
 * Factory pattern implementation for managing multiple analytics adapters
 */

import { AnalyticsAdapter, GoogleAnalyticsAdapter, FacebookPixelAdapter, TikTokPixelAdapter, ConsoleLoggerAdapter } from './adapters';
import { AnalyticsEventData, AnalyticsEventBuilder, AnalyticsEventName } from './events';

export type AnalyticsProvider = 'google' | 'facebook' | 'tiktok' | 'console';

export interface AnalyticsConfig {
  providers: AnalyticsProvider[];
  googleMeasurementId?: string;
  facebookPixelId?: string;
  tiktokPixelId?: string;
  consoleLogLevel?: 'debug' | 'info' | 'warn' | 'error';
  enableDevelopmentMode?: boolean;
}

/**
 * Analytics Factory Class
 * Manages multiple analytics adapters and provides a unified interface
 */
export class AnalyticsFactory {
  private adapters: Map<AnalyticsProvider, AnalyticsAdapter> = new Map();
  private config: AnalyticsConfig;
  private initialized = false;

  constructor(config: AnalyticsConfig) {
    this.config = {
      enableDevelopmentMode: process.env.NODE_ENV === 'development',
      ...config
    };
  }

  /**
   * Initialize all configured analytics adapters
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Always add console logger in development mode
    if (this.config.enableDevelopmentMode && !this.config.providers.includes('console')) {
      this.config.providers.push('console');
    }

    for (const provider of this.config.providers) {
      try {
        const adapter = this.createAdapter(provider);
        await adapter.initialize();
        this.adapters.set(provider, adapter);
        console.log(`[Analytics] Initialized adapter: ${provider}`);
      } catch (error) {
        console.error(`[Analytics] Failed to initialize adapter ${provider}:`, error);
      }
    }

    this.initialized = true;
  }

  /**
   * Create an analytics adapter based on provider type
   */
  private createAdapter(provider: AnalyticsProvider): AnalyticsAdapter {
    switch (provider) {
      case 'google':
        return new GoogleAnalyticsAdapter(this.config.googleMeasurementId);

      case 'facebook':
        if (!this.config.facebookPixelId) {
          throw new Error('Facebook Pixel ID is required for Facebook analytics provider');
        }
        return new FacebookPixelAdapter(this.config.facebookPixelId);

      case 'tiktok':
        if (!this.config.tiktokPixelId) {
          throw new Error('TikTok Pixel ID is required for TikTok analytics provider');
        }
        return new TikTokPixelAdapter(this.config.tiktokPixelId);

      case 'console':
        return new ConsoleLoggerAdapter(this.config.consoleLogLevel);

      default:
        throw new Error(`Unknown analytics provider: ${provider}`);
    }
  }

  /**
   * Track an event across all initialized adapters
   */
  track(eventData: AnalyticsEventData): void {
    if (!this.initialized) {
      console.warn('[Analytics] Factory not initialized. Event not tracked:', eventData);
      return;
    }

    for (const [provider, adapter] of this.adapters) {
      if (adapter.isReady()) {
        try {
          adapter.track(eventData);
        } catch (error) {
          console.error(`[Analytics] Failed to track event with ${provider}:`, error);
        }
      }
    }
  }

  /**
   * Track an event using the event builder pattern
   */
  trackEvent(eventName: AnalyticsEventName, builderFn?: (builder: AnalyticsEventBuilder) => void): void {
    const builder = new AnalyticsEventBuilder(eventName);

    if (builderFn) {
      builderFn(builder);
    }

    try {
      const eventData = builder.build();
      this.track(eventData);
    } catch (error) {
      console.error(`[Analytics] Failed to build event ${eventName}:`, error);
    }
  }

  /**
   * Identify user across all adapters that support it
   */
  identify(userId: string, properties?: Record<string, any>): void {
    for (const [provider, adapter] of this.adapters) {
      if (adapter.isReady() && adapter.identify) {
        try {
          adapter.identify(userId, properties);
        } catch (error) {
          console.error(`[Analytics] Failed to identify user with ${provider}:`, error);
        }
      }
    }
  }

  /**
   * Set user properties across all adapters that support it
   */
  setUserProperties(properties: Record<string, any>): void {
    for (const [provider, adapter] of this.adapters) {
      if (adapter.isReady() && adapter.setUserProperties) {
        try {
          adapter.setUserProperties(properties);
        } catch (error) {
          console.error(`[Analytics] Failed to set user properties with ${provider}:`, error);
        }
      }
    }
  }

  /**
   * Track page view across all adapters that support it
   */
  page(path: string, title?: string): void {
    for (const [provider, adapter] of this.adapters) {
      if (adapter.isReady() && adapter.page) {
        try {
          adapter.page(path, title);
        } catch (error) {
          console.error(`[Analytics] Failed to track page with ${provider}:`, error);
        }
      }
    }
  }

  /**
   * Get a specific adapter
   */
  getAdapter(provider: AnalyticsProvider): AnalyticsAdapter | undefined {
    return this.adapters.get(provider);
  }

  /**
   * Check if the factory is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get list of active adapters
   */
  getActiveAdapters(): AnalyticsProvider[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * Add a new adapter at runtime
   */
  addAdapter(provider: AnalyticsProvider, adapter: AnalyticsAdapter): void {
    this.adapters.set(provider, adapter);
  }

  /**
   * Remove an adapter at runtime
   */
  removeAdapter(provider: AnalyticsProvider): boolean {
    return this.adapters.delete(provider);
  }
}

/**
 * Default analytics factory instance
 * This will be initialized with environment-based configuration
 */
let defaultAnalyticsFactory: AnalyticsFactory | null = null;

/**
 * Initialize the default analytics factory
 */
export async function initializeAnalytics(config?: Partial<AnalyticsConfig>): Promise<AnalyticsFactory> {
  if (defaultAnalyticsFactory) {
    return defaultAnalyticsFactory;
  }

  const defaultConfig: AnalyticsConfig = {
    providers: ['google'],
    googleMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-QQQYHWZVFE',
    facebookPixelId: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
    tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
    consoleLogLevel: 'info',
    enableDevelopmentMode: process.env.NODE_ENV === 'development',
    ...config
  };

  defaultAnalyticsFactory = new AnalyticsFactory(defaultConfig);
  await defaultAnalyticsFactory.initialize();

  return defaultAnalyticsFactory;
}

/**
 * Get the default analytics factory instance
 */
export function getAnalytics(): AnalyticsFactory {
  if (!defaultAnalyticsFactory) {
    throw new Error('Analytics not initialized. Call initializeAnalytics() first.');
  }
  return defaultAnalyticsFactory;
}

/**
 * Convenience functions for tracking common events
 */
export const analytics = {
  /**
   * Track coupon copy event
   */
  trackCouponCopy: (couponCode: string, storeName?: string, dealId?: number) => {
    getAnalytics().trackEvent(AnalyticsEventName.COUPON_COPY, (builder) => {
      builder.setCoupon(couponCode);
      if (storeName) builder.setStore(storeName);
      if (dealId) builder.setDeal(dealId);
      builder.setSource('website');
    });
  },

  /**
   * Track store link click event
   */
  trackStoreLinkClick: (storeName: string, storeUrl: string, source: string, storeId?: string) => {
    getAnalytics().trackEvent(AnalyticsEventName.STORE_LINK_CLICK, (builder) => {
      builder.setStore(storeName, storeId);
      builder.setDestination(storeUrl);
      builder.setSource(source);
    });
  },

  /**
   * Track deal interaction events
   */
  trackDealView: (dealId: number, dealTitle?: string, storeName?: string) => {
    getAnalytics().trackEvent(AnalyticsEventName.DEAL_VIEW, (builder) => {
      builder.setDeal(dealId, dealTitle);
      if (storeName) builder.setStore(storeName);
      builder.setSource('deal_page');
    });
  },

  trackDealClick: (dealId: number, dealTitle?: string, storeName?: string, source?: string) => {
    getAnalytics().trackEvent(AnalyticsEventName.DEAL_CLICK, (builder) => {
      builder.setDeal(dealId, dealTitle);
      if (storeName) builder.setStore(storeName);
      builder.setSource(source || 'deal_card');
    });
  },

  trackDealSave: (dealId: number, dealTitle?: string, storeName?: string) => {
    getAnalytics().trackEvent(AnalyticsEventName.DEAL_SAVE, (builder) => {
      builder.setDeal(dealId, dealTitle);
      if (storeName) builder.setStore(storeName);
    });
  },

  trackDealUnsave: (dealId: number, dealTitle?: string, storeName?: string) => {
    getAnalytics().trackEvent(AnalyticsEventName.DEAL_UNSAVE, (builder) => {
      builder.setDeal(dealId, dealTitle);
      if (storeName) builder.setStore(storeName);
    });
  },

  /**
   * Track search events
   */
  trackSearch: (query: string, type: string = 'deals', resultCount?: number) => {
    getAnalytics().trackEvent(AnalyticsEventName.SEARCH_PERFORMED, (builder) => {
      builder.setCustomProperty('search_query', query);
      builder.setCustomProperty('search_type', type);
      if (resultCount !== undefined) {
        builder.setCustomProperty('results_count', resultCount);
      }
    });
  },

  /**
   * Track page views
   */
  trackPageView: (path: string, title?: string) => {
    getAnalytics().page(path, title);
  },

  /**
   * Identify user
   */
  identify: (userId: string, properties?: Record<string, any>) => {
    getAnalytics().identify(userId, properties);
  },

  /**
   * Set user properties
   */
  setUserProperties: (properties: Record<string, any>) => {
    getAnalytics().setUserProperties(properties);
  }
};