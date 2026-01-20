-- Create sequence for short numeric order numbers (starts from 1)
CREATE SEQUENCE IF NOT EXISTS subscription_order_number_seq START WITH 1;

-- Create subscription_orders table
CREATE TABLE IF NOT EXISTS subscription_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number INTEGER UNIQUE NOT NULL DEFAULT nextval('subscription_order_number_seq'),
  
  -- Subscription details
  subscription_id UUID NOT NULL,
  subscription_type_id UUID NOT NULL,
  subscription_duration_id UUID NOT NULL,
  
  -- Customer information
  customer_whatsapp VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  
  -- Pricing
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  country_slug VARCHAR(10) NOT NULL,
  
  -- Order status
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'expired', 'cancelled', 'refunded')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  
  -- Subscription period
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  
  -- Additional information
  notes TEXT,
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_subscription_orders_order_number ON subscription_orders(order_number);
CREATE INDEX idx_subscription_orders_customer_whatsapp ON subscription_orders(customer_whatsapp);
CREATE INDEX idx_subscription_orders_status ON subscription_orders(status);
CREATE INDEX idx_subscription_orders_subscription_id ON subscription_orders(subscription_id);
CREATE INDEX idx_subscription_orders_created_at ON subscription_orders(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscription_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER subscription_orders_updated_at
  BEFORE UPDATE ON subscription_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_orders_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE subscription_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow anyone to create orders (for public checkout)
CREATE POLICY "Anyone can create orders"
  ON subscription_orders
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read all orders (adjust based on your needs)
CREATE POLICY "Anyone can view orders"
  ON subscription_orders
  FOR SELECT
  USING (true);

-- Only allow service role to update orders
CREATE POLICY "Service role can update orders"
  ON subscription_orders
  FOR UPDATE
  USING (auth.jwt()->>'role' = 'service_role');

-- Only allow service role to delete orders
CREATE POLICY "Service role can delete orders"
  ON subscription_orders
  FOR DELETE
  USING (auth.jwt()->>'role' = 'service_role');

-- Comment on table and columns
COMMENT ON TABLE subscription_orders IS 'Stores orders for online subscription purchases';
COMMENT ON COLUMN subscription_orders.order_number IS 'Auto-incrementing numeric order identifier starting from 1 (e.g., 1, 2, 3, etc.)';
COMMENT ON COLUMN subscription_orders.status IS 'Order lifecycle status';
COMMENT ON COLUMN subscription_orders.payment_status IS 'Payment processing status';
