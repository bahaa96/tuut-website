export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'active' 
  | 'expired' 
  | 'cancelled' 
  | 'refunded';

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

interface SubscriptionOrder {
  id: string;
  order_number: number;
  
  // Subscription details
  subscription_id: string;
  subscription_type_id: string;
  subscription_duration_id: string;
  
  // Customer information
  customer_whatsapp: string;
  customer_email?: string;
  customer_name?: string;
  
  // Pricing
  price: number;
  currency: string;
  country_slug: string;
  
  // Order status
  status: OrderStatus;
  payment_status: PaymentStatus;
  
  // Subscription period
  start_date?: string;
  end_date?: string;
  
  // Additional information
  notes?: string;
  admin_notes?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export type { SubscriptionOrder };
