#!/usr/bin/env node

// Diagnostic script to check store-deal connections in Supabase
import { createClient } from '../utils/supabase/client';

async function checkStoreDealConnections() {
  console.log('🔍 Checking Store-Deal Connections in Supabase...\n');

  const supabase = createClient();

  try {
    // 1. Get all stores
    console.log('📊 Fetching all stores...');
    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('id, title, slug, total_offers, is_active')
      .order('title');

    if (storesError) {
      console.error('❌ Error fetching stores:', storesError);
      return;
    }

    console.log(`✅ Found ${stores?.length || 0} stores total\n`);

    // 2. Get all deals - check what columns actually exist
    console.log('📊 Fetching all deals...');
    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('id, store_id, title')
      .order('store_id');

    if (dealsError) {
      console.error('❌ Error fetching deals:', dealsError);
      return;
    }

    console.log(`✅ Found ${deals?.length || 0} deals total\n`);

    // 3. Analyze connections
    console.log('🔗 Analyzing store-deal connections...\n');

    // Create a map of store_id to deals
    const storeDealMap = new Map();
    const dealsWithInvalidStoreId = [];

    deals?.forEach(deal => {
      if (deal.store_id) {
        if (!storeDealMap.has(deal.store_id)) {
          storeDealMap.set(deal.store_id, []);
        }
        storeDealMap.get(deal.store_id).push(deal);
      } else {
        dealsWithInvalidStoreId.push(deal);
      }
    });

    // 4. Find stores with no deals
    const storesWithNoDeals = stores?.filter(store =>
      !storeDealMap.has(store.id.toString()) &&
      !storeDealMap.has(store.id)
    ) || [];

    // Find stores with deals
    const storesWithDeals = stores?.filter(store =>
      storeDealMap.has(store.id.toString()) ||
      storeDealMap.has(store.id)
    ) || [];

    console.log(`🏪 ${storesWithDeals.length} stores HAVE deals assigned:`);

    if (storesWithDeals.length > 0) {
      storesWithDeals.forEach(store => {
        const dealCount = storeDealMap.get(store.id.toString())?.length ||
                         storeDealMap.get(store.id)?.length || 0;
        console.log(`   • ${store.title || 'Untitled'} (${dealCount} deals, ID: ${store.id})`);
      });
      console.log('');
    }

    console.log(`🏪 ${storesWithNoDeals.length} stores have NO deals assigned:\n`);

    if (storesWithNoDeals.length > 0) {
      // Only show first 10 for readability
      const toShow = storesWithNoDeals.slice(0, 10);
      toShow.forEach(store => {
        console.log(`   • ${store.title || 'Untitled'} (ID: ${store.id}, Slug: ${store.slug})`);
        console.log(`     Active: ${store.is_active}, Total Offers: ${store.total_offers || 0}`);
      });

      if (storesWithNoDeals.length > 10) {
        console.log(`   ... and ${storesWithNoDeals.length - 10} more stores`);
      }
      console.log('');
    }

    // 5. Find deals with invalid store_id
    if (dealsWithInvalidStoreId.length > 0) {
      console.log(`⚠️  ${dealsWithInvalidStoreId.length} deals have INVALID or NULL store_id:\n`);
      dealsWithInvalidStoreId.forEach(deal => {
        console.log(`   • ${deal.title || 'Untitled'} (ID: ${deal.id})`);
        console.log(`     store_id: ${deal.store_id}\n`);
      });
    }

    // 6. Find deals pointing to non-existent stores
    const storeIds = new Set(stores?.map(s => s.id.toString()));
    const dealsWithNonExistentStore = deals?.filter(deal =>
      deal.store_id && !storeIds.has(deal.store_id.toString())
    ) || [];

    if (dealsWithNonExistentStore.length > 0) {
      console.log(`🚫 ${dealsWithNonExistentStore.length} deals point to NON-EXISTENT stores:\n`);
      dealsWithNonExistentStore.forEach(deal => {
        console.log(`   • ${deal.title || 'Untitled'} (ID: ${deal.id})`);
        console.log(`     store_id: ${deal.store_id}\n`);
      });
    }

    // 7. Summary statistics
    console.log('📈 Summary Statistics:');
    console.log(`   Total stores: ${stores?.length || 0}`);
    console.log(`   Stores with deals: ${stores?.length - storesWithNoDeals.length}`);
    console.log(`   Stores with no deals: ${storesWithNoDeals.length}`);
    console.log(`   Total deals: ${deals?.length || 0}`);
    console.log(`   Deals with valid store_id: ${deals?.length - dealsWithInvalidStoreId.length - dealsWithNonExistentStore.length}`);
    console.log(`   Deals with invalid store_id: ${dealsWithInvalidStoreId.length}`);
    console.log(`   Deals with non-existent store: ${dealsWithNonExistentStore.length}`);

    // 8. Recommendations
    console.log('\n💡 Recommendations:');

    if (storesWithNoDeals.length > 0) {
      console.log('   • For stores with no deals, consider:');
      console.log('     - Adding sample deals to test the connection');
      console.log('     - Marking inactive stores as is_active = false');
      console.log('     - Removing stores that should not exist');
    }

    if (dealsWithInvalidStoreId.length > 0) {
      console.log('   • For deals with invalid store_id:');
      console.log('     - Update deals to reference valid store IDs');
      console.log('     - Or remove deals that should not exist');
    }

    if (dealsWithNonExistentStore.length > 0) {
      console.log('   • For deals with non-existent store references:');
      console.log('     - Create missing stores');
      console.log('     - Or update deal store_id to reference existing stores');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the diagnostic
checkStoreDealConnections();