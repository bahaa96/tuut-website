/**
 * Analytics Adapters
 * Factory pattern implementation for different analytics providers
 */

import { AnalyticsEventData, AnalyticsEventName } from './events';

/**
 * Base interface for all analytics adapters
 */
export interface AnalyticsAdapter {
  /**
   * Initialize the analytics adapter
   */
  initialize(): Promise<void> | void;

  /**
   * Track an event with the given data
   */
  track(eventData: AnalyticsEventData): Promise<void> | void;

  /**
   * Identify a user with optional properties
   */
  identify?(userId: string, properties?: Record<string, any>): Promise<void> | void;

  /**
   * Set user properties that persist across sessions
   */
  setUserProperties?(properties: Record<string, any>): Promise<void> | void;

  /**
   * Track page view
   */
  page?(path: string, title?: string): Promise<void> | void;

  /**
   * Check if the adapter is ready to track events
   */
  isReady(): boolean;
}

/**
 * Google Analytics Adapter
 */
export class GoogleAnalyticsAdapter implements AnalyticsAdapter {
  private measurementId: string;
  private initialized = false;

  constructor(measurementId: string = 'G-QQQYHWZVFE') {
    this.measurementId = measurementId;
  }

  initialize(): void {
    if (typeof window !== 'undefined' && !this.initialized) {
      // Load gtag script if not already loaded
      if (!window.gtag) {
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
        script.async = true;
        document.head.appendChild(script);

        // Initialize gtag
        const configScript = document.createElement('script');
        configScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${this.measurementId}');
        `;
        document.head.appendChild(configScript);
      }
      this.initialized = true;
    }
  }

  track(eventData: AnalyticsEventData): void {
    if (!this.isReady()) return;

    if (window.gtag) {
      // Map our event data to Google Analytics format
      const gaEvent: any = {
        event_category: eventData.category,
        event_label: eventData.label,
        value: eventData.value,
        custom_map: {}
      };

      // Add custom parameters
      Object.keys(eventData).forEach(key => {
        if (!['action', 'category', 'label', 'value'].includes(key)) {
          gaEvent[key] = eventData[key];
        }
      });

      window.gtag('event', eventData.action, gaEvent);
    }
  }

  identify(userId: string, properties?: Record<string, any>): void {
    if (!this.isReady()) return;

    if (window.gtag) {
      window.gtag('config', this.measurementId, {
        user_id: userId,
        custom_map: properties
      });
    }
  }

  setUserProperties(properties: Record<string, any>): void {
    if (!this.isReady()) return;

    if (window.gtag) {
      window.gtag('config', this.measurementId, {
        custom_map: properties
      });
    }
  }

  page(path: string, title?: string): void {
    if (!this.isReady()) return;

    if (window.gtag) {
      window.gtag('config', this.measurementId, {
        page_path: path,
        page_title: title
      });
    }
  }

  isReady(): boolean {
    return typeof window !== 'undefined' &&
           window.gtag !== undefined &&
           this.initialized;
  }
}

/**
 * Facebook Pixel Adapter
 */
export class FacebookPixelAdapter implements AnalyticsAdapter {
  private pixelId: string;
  private initialized = false;

  constructor(pixelId: string) {
    this.pixelId = pixelId;
  }

  initialize(): void {
    if (typeof window !== 'undefined' && !this.initialized) {
      // Load Facebook Pixel script
      !(function(f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function() {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
        n.queue = []; t = b.createElement(e); t.async = !0;
        t.src = v; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

      if (window.fbq) {
        window.fbq('init', this.pixelId);
        window.fbq('track', 'PageView');
        this.initialized = true;
      }
    }
  }

  track(eventData: AnalyticsEventData): void {
    if (!this.isReady()) return;

    if (window.fbq) {
      // Map events to Facebook Pixel standard events
      const fbEvent = this.mapToFacebookEvent(eventData);

      if (fbEvent.standardEvent) {
        window.fbq('track', fbEvent.standardEvent, fbEvent.parameters);
      } else {
        window.fbq('trackCustom', eventData.action, eventData);
      }
    }
  }

  private mapToFacebookEvent(eventData: AnalyticsEventData) {
    switch (eventData.action) {
      case 'purchase_completed':
        return {
          standardEvent: 'Purchase',
          parameters: {
            value: eventData.price,
            currency: eventData.currency || 'USD',
            content_name: eventData.deal_title,
            content_category: eventData.category
          }
        };

      case 'checkout_initiated':
        return {
          standardEvent: 'InitiateCheckout',
          parameters: {
            value: eventData.price,
            currency: eventData.currency || 'USD'
          }
        };

      case 'store_link_click':
      case 'deal_click':
        return {
          standardEvent: 'Lead',
          parameters: {
            content_name: eventData.store_name || eventData.deal_title,
            content_category: eventData.category
          }
        };

      case 'user_signup':
        return {
          standardEvent: 'CompleteRegistration',
          parameters: {}
        };

      default:
        return { standardEvent: null, parameters: {} };
    }
  }

  isReady(): boolean {
    return typeof window !== 'undefined' &&
           window.fbq !== undefined &&
           this.initialized;
  }
}

/**
 * TikTok Pixel Adapter
 */
export class TikTokPixelAdapter implements AnalyticsAdapter {
  private pixelId: string;
  private initialized = false;

  constructor(pixelId: string) {
    this.pixelId = pixelId;
  }

  initialize(): void {
    if (typeof window !== 'undefined' && !this.initialized) {
      // Load TikTok Pixel script
      !(function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
      })(window, document, 'ttq');

      if (window.ttq) {
        window.ttq.load(this.pixelId);
        window.ttq.page();
        this.initialized = true;
      }
    }
  }

  track(eventData: AnalyticsEventData): void {
    if (!this.isReady()) return;

    if (window.ttq) {
      // Map events to TikTok standard events
      const ttEvent = this.mapToTikTokEvent(eventData);

      if (ttEvent.standardEvent) {
        window.ttq.track(ttEvent.standardEvent, ttEvent.parameters);
      } else {
        window.ttq.track(eventData.action, eventData);
      }
    }
  }

  private mapToTikTokEvent(eventData: AnalyticsEventData) {
    switch (eventData.action) {
      case 'purchase_completed':
        return {
          standardEvent: 'CompletePayment',
          parameters: {
            value: eventData.price,
            currency: eventData.currency || 'USD',
            content_name: eventData.deal_title,
            content_category: eventData.category
          }
        };

      case 'checkout_initiated':
        return {
          standardEvent: 'InitiateCheckout',
          parameters: {
            value: eventData.price,
            currency: eventData.currency || 'USD'
          }
        };

      case 'store_link_click':
      case 'deal_click':
        return {
          standardEvent: 'ViewContent',
          parameters: {
            content_name: eventData.store_name || eventData.deal_title,
            content_category: eventData.category
          }
        };

      case 'user_signup':
        return {
          standardEvent: 'CompleteRegistration',
          parameters: {}
        };

      default:
        return { standardEvent: null, parameters: {} };
    }
  }

  isReady(): boolean {
    return typeof window !== 'undefined' &&
           window.ttq !== undefined &&
           this.initialized;
  }
}

/**
 * Console Logger Adapter (for development/testing)
 */
export class ConsoleLoggerAdapter implements AnalyticsAdapter {
  private logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info';

  constructor(logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info') {
    this.logLevel = logLevel;
  }

  initialize(): void {
    console.log(`[Analytics] Console logger initialized with level: ${this.logLevel}`);
  }

  track(eventData: AnalyticsEventData): void {
    const logMethod = this.logLevel === 'debug' ? 'debug' : 'log';
    console[logMethod](`[Analytics Event]`, {
      action: eventData.action,
      category: eventData.category,
      timestamp: new Date().toISOString(),
      ...eventData
    });
  }

  identify(userId: string, properties?: Record<string, any>): void {
    console.log(`[Analytics] User identified:`, userId, properties);
  }

  setUserProperties(properties: Record<string, any>): void {
    console.log(`[Analytics] User properties set:`, properties);
  }

  page(path: string, title?: string): void {
    console.log(`[Analytics] Page view:`, { path, title });
  }

  isReady(): boolean {
    return true;
  }
}