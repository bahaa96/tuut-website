-- Add a short numeric order number column
-- This creates a sequence that generates unique, short order numbers

-- Create a sequence for order numbers starting from 1
CREATE SEQUENCE IF NOT EXISTS subscription_order_number_seq START WITH 1;

-- Drop the existing order_number column to replace it with numeric version
ALTER TABLE subscription_orders 
  DROP COLUMN IF EXISTS order_number;

-- Add new short numeric order_number column
ALTER TABLE subscription_orders 
  ADD COLUMN order_number INTEGER UNIQUE NOT NULL DEFAULT nextval('subscription_order_number_seq');

-- Create index on the new order_number
CREATE INDEX idx_subscription_orders_order_number_new ON subscription_orders(order_number);

-- Optional: Update existing rows to have sequential numbers starting from 1
-- (Only if you already have data)
DO $$
DECLARE
  rec RECORD;
  counter INTEGER := 1;
BEGIN
  FOR rec IN SELECT id FROM subscription_orders ORDER BY created_at
  LOOP
    UPDATE subscription_orders 
    SET order_number = counter 
    WHERE id = rec.id;
    counter := counter + 1;
  END LOOP;
  
  -- Update the sequence to continue from the last number
  IF counter > 1 THEN
    PERFORM setval('subscription_order_number_seq', counter);
  END IF;
END $$;

-- Comment on the column
COMMENT ON COLUMN subscription_orders.order_number IS 'Auto-incrementing numeric order identifier starting from 1 (e.g., 1, 2, 3, etc.)';
