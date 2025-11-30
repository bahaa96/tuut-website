#!/usr/bin/env node

// Check the actual schema of the deals table
import { createClient } from '../utils/supabase/client';

async function checkDealSchema() {
  console.log('🔍 Checking Deals Table Schema...\n');

  const supabase = createClient();

  try {
    // Get a sample deal to see the actual columns
    const { data: sampleDeals, error } = await supabase
      .from('deals')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error fetching sample deal:', error);
      return;
    }

    if (sampleDeals && sampleDeals.length > 0) {
      const sampleDeal = sampleDeals[0];
      console.log('📋 Actual deals table columns:');
      Object.keys(sampleDeal).forEach(key => {
        console.log(`   • ${key}: ${typeof sampleDeal[key]} (${sampleDeal[key]})`);
      });

      console.log('\n🎯 Sample deal data:');
      console.log(JSON.stringify(sampleDeal, null, 2));
    } else {
      console.log('⚠️  No deals found in the table');
    }

    // Try to get table info from information_schema
    console.log('\n🔍 Trying to get column info...');

    // Use raw SQL to get column information
    const { data: columns, error: colError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'deals')
      .eq('table_schema', 'public');

    if (colError) {
      console.log('⚠️  Could not access information_schema:', colError.message);
    } else {
      console.log('📋 Table columns from schema:');
      columns?.forEach(col => {
        console.log(`   • ${col.column_name}: ${col.data_type}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkDealSchema();