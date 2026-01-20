# RLS Policies Options for subscription_orders

## The Issue
You're getting: **"new row violates row-level security policy for table \"subscription_orders\""**

This happens because Row Level Security (RLS) is enabled but the policies don't allow public inserts.

## Quick Fix (Apply Now)

Run this SQL in your Supabase SQL Editor or via CLI:

```sql
-- Apply the fix
\i supabase/migrations/20260120_fix_subscription_orders_policies.sql
```

Or run directly:

```sql
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own orders" ON subscription_orders;
DROP POLICY IF EXISTS "Service role has full access" ON subscription_orders;

-- Allow anyone to create orders (for public checkout)
CREATE POLICY "Anyone can create orders"
  ON subscription_orders
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read orders
CREATE POLICY "Anyone can view orders"
  ON subscription_orders
  FOR SELECT
  USING (true);
```

## Policy Options

### Option 1: Public Access (Current - Recommended for MVP)
✅ Best for quick launch  
✅ Users don't need to be authenticated to place orders  
⚠️ Anyone can read all orders (but IDs are UUIDs, hard to guess)

```sql
-- Insert: Anyone can create
CREATE POLICY "Anyone can create orders"
  ON subscription_orders FOR INSERT
  WITH CHECK (true);

-- Select: Anyone can view
CREATE POLICY "Anyone can view orders"
  ON subscription_orders FOR SELECT
  USING (true);
```

### Option 2: Authenticated Users Only
✅ More secure  
⚠️ Requires users to sign in before ordering

```sql
-- Insert: Only authenticated users can create
CREATE POLICY "Authenticated users can create orders"
  ON subscription_orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Select: Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON subscription_orders FOR SELECT
  TO authenticated
  USING (auth.uid()::text = customer_email);
```

### Option 3: Users View Own Orders (By WhatsApp)
✅ Medium security  
✅ No auth required to create  
✅ Users can only view orders with their WhatsApp number

```sql
-- Insert: Anyone can create
CREATE POLICY "Anyone can create orders"
  ON subscription_orders FOR INSERT
  WITH CHECK (true);

-- Select: Requires matching WhatsApp or is authenticated admin
CREATE POLICY "Users can view orders with their WhatsApp"
  ON subscription_orders FOR SELECT
  USING (
    customer_whatsapp = current_setting('request.jwt.claims', true)::json->>'whatsapp'
    OR auth.jwt()->>'role' = 'admin'
  );
```

### Option 4: Admin Only Updates/Deletes (Recommended Addition)
Add this to any of the above:

```sql
-- Update: Only admins/service role
CREATE POLICY "Admins can update orders"
  ON subscription_orders FOR UPDATE
  USING (
    auth.jwt()->>'role' IN ('admin', 'service_role')
  );

-- Delete: Only admins/service role
CREATE POLICY "Admins can delete orders"
  ON subscription_orders FOR DELETE
  USING (
    auth.jwt()->>'role' IN ('admin', 'service_role')
  );
```

## Disable RLS Completely (Not Recommended)

If you want to disable RLS entirely (for development only):

```sql
ALTER TABLE subscription_orders DISABLE ROW LEVEL SECURITY;
```

⚠️ **WARNING**: This allows anyone with database access to read/write all orders. Only use in development!

## Verify Current Policies

Check what policies are currently active:

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'subscription_orders';
```

## Testing

After applying the fix, test with:

```sql
-- Test insert (should work)
INSERT INTO subscription_orders (
  order_number,
  subscription_id,
  subscription_type_id,
  subscription_duration_id,
  customer_whatsapp,
  price,
  currency,
  country_slug
) VALUES (
  'TEST-' || NOW()::text,
  'some-uuid',
  'some-uuid',
  'some-uuid',
  '+1234567890',
  99.99,
  'USD',
  'us'
);

-- Clean up test
DELETE FROM subscription_orders WHERE order_number LIKE 'TEST-%';
```

## Recommended Solution

For your use case (public subscription checkout), use **Option 1** with admin-only updates:

```sql
-- Public can create and view orders
CREATE POLICY "Anyone can create orders"
  ON subscription_orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view orders"
  ON subscription_orders FOR SELECT USING (true);

-- Only service role can modify
CREATE POLICY "Service role can update orders"
  ON subscription_orders FOR UPDATE
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can delete orders"
  ON subscription_orders FOR DELETE
  USING (auth.jwt()->>'role' = 'service_role');
```

This is already in `20260120_fix_subscription_orders_policies.sql` - just run it!
