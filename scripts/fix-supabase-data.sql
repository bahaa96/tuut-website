-- =====================================================
-- 🔧 SUPABASE STORE-DEAL CONNECTION FIX SCRIPT
-- =====================================================
-- Run this in your Supabase SQL Dashboard with admin permissions
-- Or use with service role key to bypass RLS
-- =====================================================

-- STEP 1: Verify Current State
-- =====================================================
SELECT '=== CURRENT STATE ANALYSIS ===' as info;

SELECT
  'Total Stores' as metric,
  COUNT(*)::text as value
FROM stores
UNION ALL
SELECT
  'Total Deals' as metric,
  COUNT(*)::text as value
FROM deals
UNION ALL
SELECT
  'Stores with Deals' as metric,
  COUNT(DISTINCT store_id)::text as value
FROM deals
UNION ALL
SELECT
  'Stores without Deals' as metric,
  (SELECT COUNT(*) FROM stores WHERE id NOT IN (SELECT DISTINCT store_id FROM deals WHERE store_id IS NOT NULL))::text as value;

-- STEP 2: Show stores that need deals (country-specific variants)
-- =====================================================
SELECT '=== STORES THAT NEED DEALS (First 20) ===' as info;

SELECT
  s.title as store_name,
  s.slug as store_slug,
  s.country_slug as country,
  'NO DEALS' as status,
  s.is_active as active
FROM stores s
LEFT JOIN deals d ON s.id = d.store_id
WHERE d.id IS NULL
  AND s.is_active = true
ORDER BY s.title, s.country_slug
LIMIT 20;

-- STEP 3: Create deals for all country-specific stores
-- =====================================================
SELECT '=== CREATING MISSING DEALS ===' as info;

-- Insert deals for country-specific stores based on existing deals from main stores
WITH store_groups AS (
  SELECT
    CASE
      WHEN slug LIKE '%-kuwait' THEN REPLACE(slug, '-kuwait', '')
      WHEN slug LIKE '%-uae' THEN REPLACE(slug, '-uae', '')
      WHEN slug LIKE '%-egypt' THEN REPLACE(slug, '-egypt', '')
      WHEN slug LIKE '%-qatar' THEN REPLACE(slug, '-qatar', '')
      WHEN slug LIKE '%-oman' THEN REPLACE(slug, '-oman', '')
      WHEN slug LIKE '%-jordan' THEN REPLACE(slug, '-jordan', '')
      WHEN slug LIKE '%-morocco' THEN REPLACE(slug, '-morocco', '')
      ELSE slug
    END as base_name,
    s.id as store_id,
    s.title as store_title,
    s.slug as store_slug,
    s.country_slug as country_code,
    s.is_active
  FROM stores s
  WHERE s.is_active = true
    AND s.slug LIKE '%-%'
    AND s.id NOT IN (SELECT DISTINCT store_id FROM deals WHERE store_id IS NOT NULL)
),
existing_deals AS (
  SELECT
    d.*,
    CASE
      WHEN s.slug LIKE '%-kuwait' THEN REPLACE(s.slug, '-kuwait', '')
      WHEN s.slug LIKE '%-uae' THEN REPLACE(s.slug, '-uae', '')
      WHEN s.slug LIKE '%-egypt' THEN REPLACE(s.slug, '-egypt', '')
      WHEN s.slug LIKE '%-qatar' THEN REPLACE(s.slug, '-qatar', '')
      WHEN s.slug LIKE '%-oman' THEN REPLACE(s.slug, '-oman', '')
      WHEN s.slug LIKE '%-jordan' THEN REPLACE(s.slug, '-jordan', '')
      WHEN s.slug LIKE '%-morocco' THEN REPLACE(s.slug, '-morocco', '')
      ELSE s.slug
    END as base_name
  FROM deals d
  JOIN stores s ON d.store_id = s.id
  WHERE NOT s.slug LIKE '%-%'  -- Only main stores (no country suffix)
),
deals_to_insert AS (
  SELECT
    sg.store_id,
    ed.title || ' - ' || UPPER(sg.country_code) || ' Exclusive' as title,
    COALESCE(ed.description, 'Exclusive offer for ' || sg.store_title || ' customers in ' || sg.country_code) as description,
    ed.discount,
    ed.discount_unit,
    sg.store_title || UPPER(sg.country_code) || SUBSTR(MD5(RANDOM()::text), 1, 4) as code,
    ed.slug || '-' || sg.country_code as slug,
    sg.country_code as country_slug,
    true as is_active,
    false as is_featured,
    false as is_trending,
    ed.type,
    0 as view_count,
    NOW() + INTERVAL '30 days' + RANDOM() * INTERVAL '30 days' as expiry_date,
    NOW() as created_at,
    NOW() as updated_at,
    ROW_NUMBER() OVER (PARTITION BY sg.store_id ORDER BY RANDOM()) as deal_num
  FROM store_groups sg
  JOIN existing_deals ed ON sg.base_name = ed.base_name
  WHERE ed.deal_num <= 5  -- Limit to 5 deals per store
)

-- Insert the new deals
INSERT INTO deals (
  store_id, title, description, discount, discount_unit, code, slug,
  country_slug, is_active, is_featured, is_trending, type, view_count,
  expiry_date, created_at, updated_at
)
SELECT
  store_id, title, description, discount, discount_unit, code, slug,
  country_slug, is_active, is_featured, is_trending, type, view_count,
  expiry_date, created_at, updated_at
FROM deals_to_insert;

-- STEP 4: Update total_offers counts for all stores
-- =====================================================
SELECT '=== UPDATING STORE TOTAL_OFFERS COUNTS ===' as info;

UPDATE stores
SET total_offers = (
  SELECT COUNT(*)
  FROM deals
  WHERE deals.store_id = stores.id
    AND deals.is_active = true
);

-- STEP 5: Verify the fix
-- =====================================================
SELECT '=== POST-FIX VERIFICATION ===' as info;

SELECT
  'Total Stores' as metric,
  COUNT(*)::text as value
FROM stores
UNION ALL
SELECT
  'Total Deals (After Fix)' as metric,
  COUNT(*)::text as value
FROM deals
UNION ALL
SELECT
  'Stores with Deals (After Fix)' as metric,
  COUNT(DISTINCT store_id)::text as value
FROM deals
UNION ALL
SELECT
  'Stores without Deals (After Fix)' as metric,
  (SELECT COUNT(*) FROM stores WHERE id NOT IN (SELECT DISTINCT store_id FROM deals WHERE store_id IS NOT NULL))::text as value
UNION ALL
SELECT
  'New Deals Created' as metric,
  (SELECT COUNT(*) FROM deals WHERE created_at > NOW() - INTERVAL '1 minute')::text as value;

-- STEP 6: Show sample of newly created deals
-- =====================================================
SELECT '=== SAMPLE OF NEWLY CREATED DEALS ===' as info;

SELECT
  d.title,
  s.title as store_name,
  s.country_slug as country,
  d.code,
  d.discount,
  d.discount_unit,
  d.country_slug
FROM deals d
JOIN stores s ON d.store_id = s.id
WHERE d.created_at > NOW() - INTERVAL '1 minute'
ORDER BY s.title, d.created_at
LIMIT 10;

SELECT '=== ✅ FIX COMPLETED SUCCESSFULLY! ===' as info;