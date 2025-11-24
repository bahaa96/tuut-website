#!/usr/bin/env node

// Script to distribute deals across country-specific store instances
import { createClient } from '../utils/supabase/client';

async function distributeDealsAcrossCountries() {
  console.log('🌍 Distributing Deals Across Country-Specific Store Instances...\n');

  const supabase = createClient();

  try {
    // 1. Get all stores and deals
    console.log('📊 Fetching data...');

    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('id, title, slug, country_slug, is_active')
      .eq('is_active', true)
      .order('title');

    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('*')
      .order('title');

    if (storesError || dealsError) {
      console.error('❌ Error fetching data:', storesError || dealsError);
      return;
    }

    console.log(`✅ Found ${stores?.length || 0} stores and ${deals?.length || 0} deals\n`);

    // 2. Group stores by base name (extract country from slug)
    const storesByBaseName = new Map<string, any[]>();

    stores?.forEach(store => {
      // Extract base name by removing country from slug
      const slugParts = store.slug.split('-');
      const country = slugParts.pop(); // Remove last part (country)
      const baseName = slugParts.join('-');

      if (!storesByBaseName.has(baseName)) {
        storesByBaseName.set(baseName, []);
      }
      storesByBaseName.get(baseName)!.push({
        ...store,
        baseName,
        country: country || store.slug
      });
    });

    // 3. Find stores that have deals and their country variants
    const dealsByStoreId = new Map<string, any[]>();
    deals?.forEach(deal => {
      if (deal.store_id) {
        if (!dealsByStoreId.has(deal.store_id)) {
          dealsByStoreId.set(deal.store_id, []);
        }
        dealsByStoreId.get(deal.store_id)!.push(deal);
      }
    });

    // 4. Create deals for country-specific store variants
    console.log('🔄 Distributing deals to country-specific stores...\n');

    let dealsCreated = 0;
    let storesUpdated = 0;

    for (const [baseName, countryStores] of storesByBaseName.entries()) {
      // Find if any of these stores already have deals
      const storesWithDeals = countryStores.filter(store =>
        dealsByStoreId.has(store.id)
      );

      const storesWithoutDeals = countryStores.filter(store =>
        !dealsByStoreId.has(store.id)
      );

      if (storesWithDeals.length > 0 && storesWithoutDeals.length > 0) {
        console.log(`🏪 ${baseName}: ${storesWithDeals.length} stores have deals, ${storesWithoutDeals.length} need deals`);

        // Get deals from existing stores
        const existingDeals = storesWithDeals.flatMap(store =>
          dealsByStoreId.get(store.id) || []
        );

        // Distribute deals to stores without them
        for (const targetStore of storesWithoutDeals.slice(0, 3)) { // Limit to first 3 for safety
          console.log(`   📍 Creating deals for ${targetStore.title} (${targetStore.country})`);

          // Create up to 5 deals for each store
          const dealsToCreate = existingDeals.slice(0, 5).map((deal, index) => ({
            store_id: targetStore.id,
            title: `${deal.title}`,
            description: deal.description || `Exclusive offer for ${targetStore.title}`,
            discount_percentage: deal.discount_percentage || 15,
            original_price: deal.original_price || 100,
            discounted_price: deal.discounted_price || 85,
            code: `${targetStore.country.toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            country_slug: targetStore.country,
            is_active: true,
            is_verified: true,
            featured: index === 0, // Make first deal featured
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));

          if (dealsToCreate.length > 0) {
            const { error: insertError } = await supabase
              .from('deals')
              .insert(dealsToCreate);

            if (insertError) {
              console.error(`❌ Error creating deals for ${targetStore.title}:`, insertError);
            } else {
              console.log(`   ✅ Created ${dealsToCreate.length} deals for ${targetStore.title}`);
              dealsCreated += dealsToCreate.length;
              storesUpdated++;
            }
          }
        }
        console.log('');
      }
    }

    // 5. Update store total_offers counts
    console.log('📊 Updating store total_offers counts...');

    const { data: updatedDeals } = await supabase
      .from('deals')
      .select('store_id')
      .eq('is_active', true);

    const dealCounts = new Map<string, number>();
    updatedDeals?.forEach(deal => {
      dealCounts.set(deal.store_id, (dealCounts.get(deal.store_id) || 0) + 1);
    });

    for (const store of stores || []) {
      const dealCount = dealCounts.get(store.id) || 0;

      const { error: updateError } = await supabase
        .from('stores')
        .update({ total_offers: dealCount })
        .eq('id', store.id);

      if (updateError) {
        console.error(`❌ Error updating ${store.title}:`, updateError);
      }
    }

    console.log(`\n🎉 Summary:`);
    console.log(`   ✅ Created ${dealsCreated} new deals`);
    console.log(`   ✅ Updated ${storesUpdated} stores with deals`);
    console.log(`   ✅ Updated total_offers counts for all stores`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the distribution
distributeDealsAcrossCountries();