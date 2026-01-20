# Supabase Migrations

This folder contains database migrations for the Tuut website.

## Migration: Subscription Orders Table

### File: `20260120_create_subscription_orders.sql`

This migration creates a new table to store orders for online subscriptions.

### Table: `subscription_orders`

Stores all orders placed by customers for online subscriptions.

#### Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `order_number` | INTEGER | Auto-incrementing numeric order identifier starting from 1 (e.g., 1, 2, 3...) |
| `subscription_id` | UUID | Reference to the subscription |
| `subscription_type_id` | UUID | Reference to the subscription type |
| `subscription_duration_id` | UUID | Reference to the subscription duration |
| `customer_whatsapp` | VARCHAR(50) | Customer's WhatsApp number |
| `customer_email` | VARCHAR(255) | Customer's email (optional) |
| `customer_name` | VARCHAR(255) | Customer's name (optional) |
| `price` | DECIMAL(10,2) | Order price |
| `currency` | VARCHAR(10) | Currency code |
| `country_slug` | VARCHAR(10) | Country code |
| `status` | VARCHAR(50) | Order status: `pending`, `confirmed`, `active`, `expired`, `cancelled`, `refunded` |
| `payment_status` | VARCHAR(50) | Payment status: `pending`, `paid`, `failed`, `refunded` |
| `start_date` | TIMESTAMP | Subscription start date |
| `end_date` | TIMESTAMP | Subscription end date |
| `notes` | TEXT | Customer notes |
| `admin_notes` | TEXT | Admin notes (internal) |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

#### Features

- **Automatic order number generation**: Sequential numeric order numbers starting from 1 (1, 2, 3...)
- **Database sequence**: Uses PostgreSQL sequence for guaranteed uniqueness and auto-increment
- **Indexes**: Optimized for searching by order number, customer, status, and date
- **Auto-updating timestamps**: `updated_at` automatically updates on row changes
- **Row Level Security (RLS)**: Enabled with policies for authenticated users
- **Check constraints**: Ensures only valid status values are stored

### How to Apply the Migration

#### Option 1: Using Supabase CLI (Recommended)

```bash
# Make sure you're in the project root
cd /Users/lina/projects/tuut-website

# Login to Supabase (if not already)
supabase login

# Link your project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# Apply the migration
supabase db push
```

#### Option 2: Using Supabase Dashboard

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Create a new query
5. Copy and paste the contents of `20260120_create_subscription_orders.sql`
6. Click **Run** to execute the migration

#### Option 3: Manual SQL Execution

1. Connect to your database using a PostgreSQL client
2. Execute the SQL file:

```bash
psql YOUR_DATABASE_CONNECTION_STRING -f supabase/migrations/20260120_create_subscription_orders.sql
```

### Verification

After applying the migration, verify the table was created:

```sql
-- Check if table exists
SELECT * FROM subscription_orders LIMIT 1;

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'subscription_orders';

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'subscription_orders';
```

### Code Integration

The following files were updated/created to support the orders system:

1. **Domain Model**: `/domain-models/SubscriptionOrder.ts`
   - TypeScript interface for orders
   - Order status and payment status types

2. **Network Layer**: `/network/onlineSubscriptions.ts`
   - `requestCreateSubscriptionOrder()` - Create new orders
   - `requestFetchSubscriptionOrder()` - Fetch order by ID
   - `requestFetchSubscriptionOrderByNumber()` - Fetch order by order number

3. **Checkout Page**: `/app/[localeCountry]/subscription-checkout/page.tsx`
   - Integrated order creation on form submission
   - Passes order details to success page

### Next Steps

Consider implementing:

1. **Admin Dashboard**: Create views to manage orders
2. **Email Notifications**: Send order confirmations via email
3. **WhatsApp Integration**: Automated messaging to customers
4. **Payment Gateway**: Integrate Stripe, PayPal, or local payment providers
5. **Order History**: Allow users to view their past orders
6. **Status Updates**: Automated status transitions based on payment/subscription lifecycle

### Rollback

If you need to rollback this migration:

```sql
-- Drop the table and all related objects
DROP TABLE IF EXISTS subscription_orders CASCADE;
DROP FUNCTION IF EXISTS update_subscription_orders_updated_at() CASCADE;
```

## Troubleshooting

### Permission Denied

If you get permission errors when creating the table, ensure you're connected as a superuser or have the necessary privileges:

```sql
GRANT ALL ON TABLE subscription_orders TO your_user;
```

### RLS Policies Not Working

Make sure your authentication is properly configured. You may need to adjust the RLS policies based on your auth setup:

```sql
-- Example: Allow all authenticated users to create orders
CREATE POLICY "Authenticated users can create orders"
  ON subscription_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
```
