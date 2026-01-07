/**
 * Analytics Event Definitions
 * Centralized event definitions that can be used across different analytics adapters
 */

export interface AnalyticsEventData {
  // Common properties
  action: string;
  category: string;
  label?: string;
  value?: number;

  // Extended properties for rich data
  store_name?: string;
  store_id?: string;
  deal_id?: number;
  coupon_code?: string;
  deal_title?: string;
  discount_percentage?: number;
  user_location?: string;
  source?: string;
  destination_url?: string;
  currency?: string;
  price?: number;
  [key: string]: any;
}

export enum AnalyticsEventName {
  // Coupon Events
  COUPON_COPY = 'coupon_copy',
  COUPON_VIEW = 'coupon_view',
  COUPON_APPLY_SUCCESS = 'coupon_apply_success',
  COUPON_APPLY_FAILED = 'coupon_apply_failed',

  // Store Events
  STORE_LINK_CLICK = 'store_link_click',
  STORE_VIEW = 'store_view',
  STORE_SEARCH = 'store_search',

  // Deal Events
  DEAL_VIEW = 'deal_view',
  DEAL_CLICK = 'deal_click',
  DEAL_SAVE = 'deal_save',
  DEAL_UNSAVE = 'deal_unsave',
  DEAL_SHARE = 'deal_share',
  DEAL_EXPIRED_VIEW = 'deal_expired_view',

  // User Interaction Events
  SEARCH_PERFORMED = 'search_performed',
  FILTER_APPLIED = 'filter_applied',
  CATEGORY_BROWSE = 'category_browse',

  // Conversion Events
  CHECKOUT_INITIATED = 'checkout_initiated',
  PURCHASE_COMPLETED = 'purchase_completed',

  // Engagement Events
  PAGE_VIEW = 'page_view',
  SESSION_START = 'session_start',
  USER_SIGNUP = 'user_signup',
  USER_LOGIN = 'user_login'
}

export interface AnalyticsEventDefinition {
  name: AnalyticsEventName;
  category: string;
  description: string;
  requiredProperties: string[];
  optionalProperties: string[];
  conversionValue?: boolean;
}

export const ANALYTICS_EVENTS: Record<AnalyticsEventName, AnalyticsEventDefinition> = {
  [AnalyticsEventName.COUPON_COPY]: {
    name: AnalyticsEventName.COUPON_COPY,
    category: 'coupon',
    description: 'User copies a coupon code',
    requiredProperties: ['coupon_code'],
    optionalProperties: ['store_name', 'store_id', 'deal_id', 'deal_title', 'discount_percentage', 'source'],
    conversionValue: true
  },

  [AnalyticsEventName.COUPON_VIEW]: {
    name: AnalyticsEventName.COUPON_VIEW,
    category: 'coupon',
    description: 'User views a coupon code',
    requiredProperties: ['coupon_code'],
    optionalProperties: ['store_name', 'store_id', 'deal_id', 'deal_title']
  },

  [AnalyticsEventName.COUPON_APPLY_SUCCESS]: {
    name: AnalyticsEventName.COUPON_APPLY_SUCCESS,
    category: 'coupon',
    description: 'User successfully applies a coupon code',
    requiredProperties: ['coupon_code'],
    optionalProperties: ['store_name', 'store_id', 'deal_id', 'order_value', 'currency'],
    conversionValue: true
  },

  [AnalyticsEventName.COUPON_APPLY_FAILED]: {
    name: AnalyticsEventName.COUPON_APPLY_FAILED,
    category: 'coupon',
    description: 'User fails to apply a coupon code',
    requiredProperties: ['coupon_code', 'error_message'],
    optionalProperties: ['store_name', 'store_id', 'deal_id']
  },

  [AnalyticsEventName.STORE_LINK_CLICK]: {
    name: AnalyticsEventName.STORE_LINK_CLICK,
    category: 'store',
    description: 'User clicks on a store website link',
    requiredProperties: ['store_name', 'destination_url'],
    optionalProperties: ['store_id', 'source', 'deal_id'],
    conversionValue: true
  },

  [AnalyticsEventName.STORE_VIEW]: {
    name: AnalyticsEventName.STORE_VIEW,
    category: 'store',
    description: 'User views a store page',
    requiredProperties: ['store_name'],
    optionalProperties: ['store_id', 'store_category']
  },

  [AnalyticsEventName.STORE_SEARCH]: {
    name: AnalyticsEventName.STORE_SEARCH,
    category: 'store',
    description: 'User searches for stores',
    requiredProperties: ['search_query'],
    optionalProperties: ['results_count', 'filters_applied']
  },

  [AnalyticsEventName.DEAL_VIEW]: {
    name: AnalyticsEventName.DEAL_VIEW,
    category: 'deal',
    description: 'User views a deal details page',
    requiredProperties: ['deal_id', 'deal_title'],
    optionalProperties: ['store_name', 'store_id', 'discount_percentage', 'expires_at']
  },

  [AnalyticsEventName.DEAL_CLICK]: {
    name: AnalyticsEventName.DEAL_CLICK,
    category: 'deal',
    description: 'User clicks on a deal to get more details or visit store',
    requiredProperties: ['deal_id'],
    optionalProperties: ['deal_title', 'store_name', 'store_id', 'source'],
    conversionValue: true
  },

  [AnalyticsEventName.DEAL_SAVE]: {
    name: AnalyticsEventName.DEAL_SAVE,
    category: 'deal',
    description: 'User saves a deal for later',
    requiredProperties: ['deal_id'],
    optionalProperties: ['deal_title', 'store_name', 'store_id']
  },

  [AnalyticsEventName.DEAL_UNSAVE]: {
    name: AnalyticsEventName.DEAL_UNSAVE,
    category: 'deal',
    description: 'User removes a saved deal',
    requiredProperties: ['deal_id'],
    optionalProperties: ['deal_title', 'store_name', 'store_id']
  },

  [AnalyticsEventName.DEAL_SHARE]: {
    name: AnalyticsEventName.DEAL_SHARE,
    category: 'deal',
    description: 'User shares a deal',
    requiredProperties: ['deal_id', 'share_method'],
    optionalProperties: ['deal_title', 'store_name', 'store_id']
  },

  [AnalyticsEventName.DEAL_EXPIRED_VIEW]: {
    name: AnalyticsEventName.DEAL_EXPIRED_VIEW,
    category: 'deal',
    description: 'User views an expired deal',
    requiredProperties: ['deal_id'],
    optionalProperties: ['deal_title', 'store_name', 'store_id', 'expired_at']
  },

  [AnalyticsEventName.SEARCH_PERFORMED]: {
    name: AnalyticsEventName.SEARCH_PERFORMED,
    category: 'user_interaction',
    description: 'User performs a search',
    requiredProperties: ['search_query', 'search_type'],
    optionalProperties: ['results_count', 'filters_applied']
  },

  [AnalyticsEventName.FILTER_APPLIED]: {
    name: AnalyticsEventName.FILTER_APPLIED,
    category: 'user_interaction',
    description: 'User applies filters to deals/stores',
    requiredProperties: ['filter_type', 'filter_value'],
    optionalProperties: ['total_filters', 'results_count']
  },

  [AnalyticsEventName.CATEGORY_BROWSE]: {
    name: AnalyticsEventName.CATEGORY_BROWSE,
    category: 'user_interaction',
    description: 'User browses a specific category',
    requiredProperties: ['category_name'],
    optionalProperties: ['subcategory_name', 'item_count']
  },

  [AnalyticsEventName.CHECKOUT_INITIATED]: {
    name: AnalyticsEventName.CHECKOUT_INITIATED,
    category: 'conversion',
    description: 'User initiates checkout process',
    requiredProperties: ['store_name'],
    optionalProperties: ['cart_value', 'currency', 'item_count', 'coupon_used'],
    conversionValue: true
  },

  [AnalyticsEventName.PURCHASE_COMPLETED]: {
    name: AnalyticsEventName.PURCHASE_COMPLETED,
    category: 'conversion',
    description: 'User completes a purchase',
    requiredProperties: ['store_name', 'order_value', 'currency'],
    optionalProperties: ['order_id', 'item_count', 'coupon_used', 'coupon_code'],
    conversionValue: true
  },

  [AnalyticsEventName.PAGE_VIEW]: {
    name: AnalyticsEventName.PAGE_VIEW,
    category: 'engagement',
    description: 'Page view event',
    requiredProperties: ['page_path', 'page_title'],
    optionalProperties: ['page_location', 'page_referrer']
  },

  [AnalyticsEventName.SESSION_START]: {
    name: AnalyticsEventName.SESSION_START,
    category: 'engagement',
    description: 'User session starts',
    requiredProperties: [],
    optionalProperties: ['user_id', 'session_id', 'traffic_source']
  },

  [AnalyticsEventName.USER_SIGNUP]: {
    name: AnalyticsEventName.USER_SIGNUP,
    category: 'engagement',
    description: 'User signs up for an account',
    requiredProperties: ['signup_method'],
    optionalProperties: ['user_id'],
    conversionValue: true
  },

  [AnalyticsEventName.USER_LOGIN]: {
    name: AnalyticsEventName.USER_LOGIN,
    category: 'engagement',
    description: 'User logs into their account',
    requiredProperties: ['login_method'],
    optionalProperties: ['user_id']
  }
};

/**
 * Type-safe event builder for creating analytics events
 */
export class AnalyticsEventBuilder {
  private data: Partial<AnalyticsEventData> = {};

  constructor(private eventName: AnalyticsEventName) {}

  setStore(storeName: string, storeId?: string): this {
    this.data.store_name = storeName;
    this.data.store_id = storeId;
    return this;
  }

  setDeal(dealId: number, dealTitle?: string): this {
    this.data.deal_id = dealId;
    this.data.deal_title = dealTitle;
    return this;
  }

  setCoupon(couponCode: string, discountPercentage?: number): this {
    this.data.coupon_code = couponCode;
    this.data.discount_percentage = discountPercentage;
    return this;
  }

  setSource(source: string): this {
    this.data.source = source;
    return this;
  }

  setDestination(url: string): this {
    this.data.destination_url = url;
    return this;
  }

  setValue(value: number): this {
    this.data.value = value;
    return this;
  }

  setPrice(price: number, currency: string = 'USD'): this {
    this.data.price = price;
    this.data.currency = currency;
    return this;
  }

  setLocation(location: string): this {
    this.data.user_location = location;
    return this;
  }

  setCustomProperty(key: string, value: any): this {
    this.data[key] = value;
    return this;
  }

  build(): AnalyticsEventData {
    const definition = ANALYTICS_EVENTS[this.eventName];
    if (!definition) {
      throw new Error(`Unknown analytics event: ${this.eventName}`);
    }

    // Validate required properties
    for (const requiredProp of definition.requiredProperties) {
      if (!(requiredProp in this.data)) {
        throw new Error(`Missing required property '${requiredProp}' for event '${this.eventName}'`);
      }
    }

    return {
      action: this.eventName,
      category: definition.category,
      ...this.data
    } as AnalyticsEventData;
  }
}