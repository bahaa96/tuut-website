#!/usr/bin/env node

// Script to fix store-deal connections in Supabase
import { createClient } from '../utils/supabase/client';

async function fixStoreDealConnections() {
  console.log('🔧 Fixing Store-Deal Connections in Supabase...\n');

  const supabase = createClient();

  try {
    // 1. Get current state
    console.log('📊 Getting current state...');

    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('id, title, slug, total_offers, is_active')
      .eq('is_active', true)
      .order('title');

    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('id, title, store_id, country_slug')
      .order('title');

    if (storesError || dealsError) {
      console.error('❌ Error fetching data:', storesError || dealsError);
      return;
    }

    console.log(`✅ Found ${stores?.length || 0} active stores and ${deals?.length || 0} deals\n`);

    // 2. Create a mapping of store names to store IDs
    const storeNameMap = new Map<string, string>();
    stores?.forEach(store => {
      // Map multiple variations of store names
      const baseName = store.title.toLowerCase().replace(/\s+(kuwait|uae|egypt|qatar|oman|jordan|morocco)$/i, '').trim();
      storeNameMap.set(baseName, store.id);
      storeNameMap.set(store.title.toLowerCase(), store.id);
    });

    // 3. Group stores by base name (country-specific stores)
    const storesByBaseName = new Map<string, any[]>();
    stores?.forEach(store => {
      const baseName = store.title.toLowerCase().replace(/\s+(kuwait|uae|egypt|qatar|oman|jordan|morocco)$/i, '').trim();
      if (!storesByBaseName.has(baseName)) {
        storesByBaseName.set(baseName, []);
      }
      storesByBaseName.get(baseName)!.push(store);
    });

    // 4. Analyze deals and assign them to appropriate stores
    console.log('🔗 Analyzing and fixing deal assignments...\n');

    const dealsToFix = [];
    const unassignedDeals = [];

    deals?.forEach(deal => {
      if (!deal.store_id) {
        unassignedDeals.push(deal);
      } else {
        // Check if the deal's store_id matches a valid store
        const validStore = stores?.find(s => s.id === deal.store_id);
        if (!validStore) {
          dealsToFix.push(deal);
        }
      }
    });

    if (unassignedDeals.length === 0 && dealsToFix.length === 0) {
      console.log('✅ All deals are already properly assigned to stores!\n');
      return;
    }

    console.log(`📋 Found ${unassignedDeals.length} unassigned deals and ${dealsToFix.length} deals with invalid store_id\n`);

    // 5. Create sample deals for stores that have none
    const storesWithNoDeals = stores?.filter(store => {
      return !deals?.some(deal => deal.store_id === store.id);
    }) || [];

    if (storesWithNoDeals.length > 0) {
      console.log(`🏪 Creating sample deals for ${storesWithNoDeals.length} stores that have no deals...\n`);

      const sampleDeals = [];

      for (const store of storesWithNoDeals.slice(0, 10)) { // Limit to first 10 for safety
        const countrySlug = store.slug.split('-').pop() || 'uae';
        const baseDeal = {
          store_id: store.id,
          title: `${store.title} Exclusive Offer`,
          discount_percentage: 15,
          original_price: 100,
          discounted_price: 85,
          code: `${store.title.toUpperCase().replace(/\s+/g, '')}15`,
          country_slug: countrySlug,
          is_active: true,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        sampleDeals.push(baseDeal);
      }

      if (sampleDeals.length > 0) {
        console.log(`💾 Inserting ${sampleDeals.length} sample deals...`);

        const { error: insertError } = await supabase
          .from('deals')
          .insert(sampleDeals);

        if (insertError) {
          console.error('❌ Error inserting sample deals:', insertError);
        } else {
          console.log(`✅ Successfully inserted ${sampleDeals.length} sample deals\n`);
        }
      }
    }

    // 6. Fix unassigned deals by trying to match them to stores
    if (unassignedDeals.length > 0) {
      console.log(`🔧 Attempting to fix ${unassignedDeals.length} unassigned deals...\n`);

      for (const deal of unassignedDeals.slice(0, 5)) { // Limit to first 5 for safety
        // Try to extract store name from deal title
        const dealTitleLower = deal.title.toLowerCase();
        let matchedStoreId = null;

        // Look for store names in the deal title
        for (const [baseName, storeId] of storeNameMap.entries()) {
          if (dealTitleLower.includes(baseName)) {
            matchedStoreId = storeId;
            break;
          }
        }

        if (matchedStoreId) {
          console.log(`🎯 Assigning deal "${deal.title}" to store ID: ${matchedStoreId}`);

          const { error: updateError } = await supabase
            .from('deals')
            .update({ store_id: matchedStoreId })
            .eq('id', deal.id);

          if (updateError) {
            console.error(`❌ Error updating deal ${deal.id}:`, updateError);
          } else {
            console.log(`✅ Successfully updated deal ${deal.id}`);
          }
        } else {
          console.log(`⚠️  Could not find matching store for deal: "${deal.title}"`);
        }
      }
    }

    // 7. Update store total_offers counts
    console.log('\n📊 Updating store total_offers counts...');

    for (const store of stores || []) {
      const dealCount = deals?.filter(deal => deal.store_id === store.id).length || 0;

      if (store.total_offers !== dealCount) {
        console.log(`🔄 Updating ${store.title}: ${store.total_offers} → ${dealCount} deals`);

        const { error: updateError } = await supabase
          .from('stores')
          .update({ total_offers: dealCount })
          .eq('id', store.id);

        if (updateError) {
          console.error(`❌ Error updating store ${store.id}:`, updateError);
        }
      }
    }

    console.log('\n✅ Store-deal connection fixing completed!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the fix
fixStoreDealConnections();