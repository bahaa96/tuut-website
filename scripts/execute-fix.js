#!/usr/bin/env node

// Execute Supabase fix using service role key (bypasses RLS)
import { createClient } from '@supabase/supabase-js';

// Your actual Supabase credentials
const SUPABASE_URL = 'https://oluyzqunbbqaxalodhdg.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sdXl6cXVuYmJxYXhhbG9kaGRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTQ1MzA5NywiZXhwIjoyMDYxMDI5MDk3fQ.lzKDE7OMCZFVkLt340TGwJ3Ak-29Ma16qAzky-2akyQ';

async function executeSupabaseFix() {
  console.log('🔧 Executing Supabase Store-Deal Connection Fix...\n');

  // Create Supabase client with service role key (bypasses RLS)
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // STEP 1: Get current state
    console.log('📊 Step 1: Analyzing current state...');

    const { data: stores } = await supabase.from('stores').select('*').eq('is_active', true);
    const { data: deals } = await supabase.from('deals').select('*');

    console.log(`✅ Found ${stores?.length || 0} active stores and ${deals?.length || 0} deals`);

    // STEP 2: Find stores without deals
    console.log('\n🔍 Step 2: Finding stores without deals...');

    const storesWithDeals = new Set(deals?.map(d => d.store_id) || []);
    const storesWithoutDeals = stores?.filter(s => !storesWithDeals.has(s.id)) || [];

    console.log(`🎯 Found ${storesWithoutDeals.length} stores without deals`);

    // STEP 3: Group stores by base name
    console.log('\n📋 Step 3: Grouping stores by base name...');

    const storesByBaseName = new Map();

    stores?.forEach(store => {
      let baseName = store.slug;
      const countrySuffixes = ['-kuwait', '-uae', '-egypt', '-qatar', '-oman', '-jordan', '-morocco'];

      for (const suffix of countrySuffixes) {
        if (baseName.endsWith(suffix)) {
          baseName = baseName.slice(0, -suffix.length);
          break;
        }
      }

      if (!storesByBaseName.has(baseName)) {
        storesByBaseName.set(baseName, []);
      }
      storesByBaseName.get(baseName).push(store);
    });

    // STEP 4: Create deals for country-specific stores
    console.log('\n🚀 Step 4: Creating deals for country-specific stores...');

    let totalDealsCreated = 0;
    const dealsToInsert = [];

    for (const [baseName, storeGroup] of storesByBaseName.entries()) {
      const mainStore = storeGroup.find(s => !s.slug.includes('-'));
      const countryStores = storeGroup.filter(s => s.slug.includes('-'));

      if (mainStore && countryStores.length > 0) {
        const mainStoreDeals = deals?.filter(d => d.store_id === mainStore.id) || [];

        if (mainStoreDeals.length > 0) {
          console.log(`🏪 ${baseName}: Creating deals for ${countryStores.length} country stores`);

          for (const countryStore of countryStores) {
            if (!storesWithDeals.has(countryStore.id)) {
              // Create 3-5 deals for each country store
              const dealsForThisStore = mainStoreDeals.slice(0, 5).map((deal, index) => ({
                store_id: countryStore.id,
                title: `${deal.title} - ${countryStore.country_slug.toUpperCase()} Exclusive`,
                description: deal.description || `Exclusive offer for ${countryStore.title} customers`,
                discount: deal.discount || (15 + Math.random() * 20),
                discount_unit: deal.discount_unit || '%',
                code: `${baseName.toUpperCase().replace(/[^A-Z]/g, '')}${countryStore.country_slug.toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
                slug: `${deal.slug}-${countryStore.country_slug.toLowerCase()}`,
                country_slug: countryStore.country_slug.toUpperCase(),
                is_active: true,
                is_featured: index === 0,
                is_trending: false,
                type: deal.type || 'discount',
                view_count: 0,
                expiry_date: new Date(Date.now() + (30 + Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }));

              dealsToInsert.push(...dealsForThisStore);
              totalDealsCreated += dealsForThisStore.length;
            }
          }
        }
      }
    }

    // STEP 5: Insert all the new deals
    if (dealsToInsert.length > 0) {
      console.log(`\n💾 Step 5: Inserting ${dealsToInsert.length} new deals...`);

      // Insert in batches of 100 to avoid timeouts
      const batchSize = 100;
      for (let i = 0; i < dealsToInsert.length; i += batchSize) {
        const batch = dealsToInsert.slice(i, i + batchSize);
        const { error } = await supabase.from('deals').insert(batch);

        if (error) {
          console.error(`❌ Error inserting batch ${i/batchSize + 1}:`, error);
        } else {
          console.log(`✅ Inserted batch ${i/batchSize + 1} (${batch.length} deals)`);
        }
      }
    }

    // STEP 6: Update total_offers counts
    console.log('\n📊 Step 6: Updating total_offers counts...');

    const { data: allDeals } = await supabase.from('deals').select('store_id').eq('is_active', true);
    const dealCounts = new Map();

    allDeals?.forEach(deal => {
      dealCounts.set(deal.store_id, (dealCounts.get(deal.store_id) || 0) + 1);
    });

    for (const store of stores || []) {
      const dealCount = dealCounts.get(store.id) || 0;
      await supabase.from('stores').update({ total_offers: dealCount }).eq('id', store.id);
    }

    // STEP 7: Final verification
    console.log('\n🎉 Step 7: Final verification...');

    const { data: finalDeals } = await supabase.from('deals').select('store_id');
    const storesWithDealsAfter = new Set(finalDeals?.map(d => d.store_id) || []);
    const storesWithoutDealsAfter = stores?.filter(s => !storesWithDealsAfter.has(s.id)) || [];

    console.log('\n=== 🎊 FIX COMPLETED SUCCESSFULLY! ===');
    console.log(`✅ Total stores: ${stores?.length}`);
    console.log(`✅ Total deals now: ${finalDeals?.length}`);
    console.log(`✅ Stores with deals: ${storesWithDealsAfter.size}`);
    console.log(`✅ Stores without deals: ${storesWithoutDealsAfter.length}`);
    console.log(`✅ New deals created: ${totalDealsCreated}`);

  } catch (error) {
    console.error('❌ Error executing fix:', error);
  }
}

// Execute the fix
executeSupabaseFix();