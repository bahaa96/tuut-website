-- Fix RLS policies for subscription_orders table
-- Run this if you get "new row violates row-level security policy" error

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own orders" ON subscription_orders;
DROP POLICY IF EXISTS "Service role has full access" ON subscription_orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON subscription_orders;
DROP POLICY IF EXISTS "Anyone can view orders" ON subscription_orders;
DROP POLICY IF EXISTS "Service role can update orders" ON subscription_orders;
DROP POLICY IF EXISTS "Service role can delete orders" ON subscription_orders;

-- Create new policies
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

-- Verify RLS is enabled
ALTER TABLE subscription_orders ENABLE ROW LEVEL SECURITY;
