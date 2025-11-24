#!/usr/bin/env node

// Debug script to understand store naming and country structure
import { createClient } from '../utils/supabase/client';

async function debugStoreStructure() {
  console.log('🔍 Debugging Store Structure...\n');

  const supabase = createClient();

  try {
    // 1. Get all stores
    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('id, title, slug, country_slug, total_offers')
      .order('title')
      .limit(20);

    const { data: deals, error: dealsError } = await supabase
      .from('deals')
      .select('store_id, title')
      .limit(10);

    if (storesError || dealsError) {
      console.error('❌ Error:', storesError || dealsError);
      return;
    }

    console.log('📊 Store Structure Analysis:\n');

    // Show sample stores
    console.log('🏪 Sample stores:');
    stores?.forEach((store, index) => {
      console.log(`   ${index + 1}. "${store.title}"`);
      console.log(`      Slug: ${store.slug}`);
      console.log(`      Country slug: ${store.country_slug}`);
      console.log(`      Total offers: ${store.total_offers}`);
      console.log(`      ID: ${store.id}\n`);
    });

    console.log('🎯 Sample deals:');
    deals?.forEach((deal, index) => {
      console.log(`   ${index + 1}. "${deal.title}"`);
      console.log(`      Store ID: ${deal.store_id}\n`);
    });

    // Analyze slug patterns
    console.log('🔍 Slug Pattern Analysis:');
    const slugPatterns = new Map<string, number>();
    stores?.forEach(store => {
      const pattern = store.slug.includes('-') ? 'HAS_HYPHENS' : 'NO_HYPHENS';
      slugPatterns.set(pattern, (slugPatterns.get(pattern) || 0) + 1);
    });

    slugPatterns.forEach((count, pattern) => {
      console.log(`   ${pattern}: ${count} stores`);
    });

    // Check if there are duplicate store names
    console.log('\n🔄 Store Name Grouping:');
    const nameGroups = new Map<string, any[]>();
    stores?.forEach(store => {
      const baseName = store.title.toLowerCase().replace(/\s+/g, ' ').trim();
      if (!nameGroups.has(baseName)) {
        nameGroups.set(baseName, []);
      }
      nameGroups.get(baseName)!.push(store);
    });

    nameGroups.forEach((group, name) => {
      if (group.length > 1) {
        console.log(`   "${name}" appears ${group.length} times:`);
        group.forEach(store => {
          console.log(`      - ${store.slug} (${store.country_slug})`);
        });
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugStoreStructure();