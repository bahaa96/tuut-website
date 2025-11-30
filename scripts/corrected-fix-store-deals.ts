#!/usr/bin/env node

// Corrected fix: Create deals for country-specific stores using the correct schema
import { createClient } from '../utils/supabase/client';

async function correctedFixStoreDeals() {
  console.log('🔧 Corrected Fix: Creating Deals for Country-Specific Stores...\n');

  const supabase = createClient();

  try {
    // 1. Get all data
    console.log('📊 Fetching data...');

    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('id, title, slug, country_slug, is_active')
      .eq('is_active', true)
      .order('title');

    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false });

    if (storesError || dealsError) {
      console.error('❌ Error fetching data:', storesError || dealsError);
      return;
    }

    console.log(`✅ Found ${stores?.length || 0} stores and ${deals?.length || 0} deals\n`);

    // 2. Group stores by base name (remove country suffix from slug)
    const storesByBaseName = new Map<string, any[]>();

    stores?.forEach(store => {
      // Extract base name by removing country suffix
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

      storesByBaseName.get(baseName)!.push({
        ...store,
        baseName,
        isMainStore: !store.slug.includes('-'), // Main stores don't have country suffix
        country: store.country_slug
      });
    });

    // 3. Get existing deals by store ID
    const dealsByStoreId = new Map<string, any[]>();
    deals?.forEach(deal => {
      if (deal.store_id) {
        if (!dealsByStoreId.has(deal.store_id)) {
          dealsByStoreId.set(deal.store_id, []);
        }
        dealsByStoreId.get(deal.store_id)!.push(deal);
      }
    });

    // 4. Create deals for country-specific stores using CORRECT schema
    console.log('🔄 Creating deals for country-specific stores...\n');

    let totalDealsCreated = 0;
    let totalStoresUpdated = 0;

    for (const [baseName, storeGroup] of storesByBaseName.entries()) {
      const mainStore = storeGroup.find(s => s.isMainStore);
      const countryStores = storeGroup.filter(s => !s.isMainStore);

      if (mainStore && countryStores.length > 0) {
        const mainStoreDeals = dealsByStoreId.get(mainStore.id) || [];

        if (mainStoreDeals.length > 0) {
          console.log(`🏪 ${baseName}: Main store has ${mainStoreDeals.length} deals, creating for ${countryStores.length} country stores`);

          for (const countryStore of countryStores) {
            // Check if this country store already has deals
            if (!dealsByStoreId.has(countryStore.id)) {
              console.log(`   📍 Creating deals for ${countryStore.title} (${countryStore.country})`);

              // Create 3-5 deals for each country store using CORRECT schema
              const dealsToCreate = mainStoreDeals.slice(0, 5).map((deal, index) => {
                // Use the existing discount value or create a new one
                const discountValue = deal.discount || (15 + Math.random() * 20);
                const discountUnit = deal.discount_unit || '%';

                return {
                  store_id: countryStore.id,
                  title: `${deal.title} - ${countryStore.country.toUpperCase()} Exclusive`,
                  description: deal.description || `Exclusive offer for ${countryStore.title} customers in ${countryStore.country}`,
                  discount: Math.round(discountValue),
                  discount_unit: discountUnit,
                  code: `${baseName.toUpperCase().replace(/[^A-Z]/g, '')}${countryStore.country.toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
                  slug: `${deal.slug}-${countryStore.country.toLowerCase()}`,
                  country_slug: countryStore.country.toLowerCase(),
                  is_active: true,
                  is_verified: true, // Note: this might not exist in schema
                  is_featured: index === 0, // Make first deal featured
                  is_trending: false,
                  type: deal.type || 'discount',
                  view_count: 0,
                  expiry_date: new Date(Date.now() + (30 + Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };
              });

              // Remove potential problematic fields
              const cleanedDeals = dealsToCreate.map(deal => {
                const { is_verified, ...cleanedDeal } = deal;
                return cleanedDeal;
              });

              const { error: insertError } = await supabase
                .from('deals')
                .insert(cleanedDeals);

              if (insertError) {
                console.error(`❌ Error creating deals for ${countryStore.title}:`, insertError);
              } else {
                console.log(`   ✅ Created ${cleanedDeals.length} deals for ${countryStore.title}`);
                totalDealsCreated += cleanedDeals.length;
                totalStoresUpdated++;
              }
            } else {
              console.log(`   ℹ️  ${countryStore.title} already has ${dealsByStoreId.get(countryStore.id)!.length} deals`);
            }
          }
          console.log('');
        }
      }
    }

    // 5. Update total_offers for all stores
    console.log('📊 Updating total_offers counts...');

    const { data: allDeals } = await supabase
      .from('deals')
      .select('store_id')
      .eq('is_active', true);

    const dealCounts = new Map<string, number>();
    allDeals?.forEach(deal => {
      dealCounts.set(deal.store_id, (dealCounts.get(deal.store_id) || 0) + 1);
    });

    let storesUpdatedCount = 0;
    for (const store of stores || []) {
      const dealCount = dealCounts.get(store.id) || 0;

      const { error: updateError } = await supabase
        .from('stores')
        .update({ total_offers: dealCount })
        .eq('id', store.id);

      if (updateError) {
        console.error(`❌ Error updating ${store.title}:`, updateError);
      } else if (store.total_offers !== dealCount) {
        storesUpdatedCount++;
      }
    }

    console.log(`\n🎉 Fix Completed!`);
    console.log(`   ✅ Created ${totalDealsCreated} new deals`);
    console.log(`   ✅ Updated ${totalStoresUpdated} stores with deals`);
    console.log(`   ✅ Updated total_offers counts for ${storesUpdatedCount} stores`);
    console.log(`   🎯 Run 'npm run check-stores' to verify the fix`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the corrected fix
correctedFixStoreDeals();