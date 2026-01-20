-- Reset order number sequence to start from 1
-- Run this if you want to ensure order numbers start from 1

-- Reset the sequence to 1
ALTER SEQUENCE subscription_order_number_seq RESTART WITH 1;

-- Verify the sequence value
SELECT last_value, is_called FROM subscription_order_number_seq;

-- Optional: If you have existing orders and want to renumber them starting from 1
-- WARNING: This will change existing order numbers!
-- Uncomment the block below if you want to renumber existing orders

/*
DO $$
DECLARE
  rec RECORD;
  counter INTEGER := 1;
BEGIN
  -- Temporarily remove the unique constraint
  ALTER TABLE subscription_orders DROP CONSTRAINT IF EXISTS subscription_orders_order_number_key;
  
  -- Renumber all existing orders starting from 1
  FOR rec IN SELECT id FROM subscription_orders ORDER BY created_at
  LOOP
    UPDATE subscription_orders 
    SET order_number = counter 
    WHERE id = rec.id;
    counter := counter + 1;
  END LOOP;
  
  -- Re-add the unique constraint
  ALTER TABLE subscription_orders ADD CONSTRAINT subscription_orders_order_number_key UNIQUE (order_number);
  
  -- Set sequence to continue from the last number
  PERFORM setval('subscription_order_number_seq', counter);
  
  RAISE NOTICE 'Renumbered % orders starting from 1', counter - 1;
END $$;
*/
