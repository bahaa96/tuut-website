// Database diagnostic utility to check if tables have data
import { createClient } from './supabase/client';

export async function checkDatabaseContent() {
  try {
    const supabase = createClient();
    
    console.log('=== DATABASE DIAGNOSTIC ===');
    
    // Check stores table
    const { data: stores, error: storesError, count: storesCount } = await supabase
      .from('stores')
      .select('*', { count: 'exact', head: false })
      .limit(5);
    
    console.log('📦 STORES TABLE:');
    console.log(`  - Total count: ${storesCount}`);
    console.log(`  - Sample data:`, stores);
    if (storesError) console.error('  - Error:', storesError);
    
    // Check deals table
    const { data: deals, error: dealsError, count: dealsCount } = await supabase
      .from('deals')
      .select('*', { count: 'exact', head: false })
      .limit(5);
    
    console.log('🏷️ DEALS TABLE:');
    console.log(`  - Total count: ${dealsCount}`);
    console.log(`  - Sample data:`, deals);
    if (dealsError) console.error('  - Error:', dealsError);
    
    // Check products table
    const { data: products, error: productsError, count: productsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: false })
      .limit(5);
    
    console.log('🛍️ PRODUCTS TABLE:');
    console.log(`  - Total count: ${productsCount}`);
    console.log(`  - Sample data:`, products);
    if (productsError) console.error('  - Error:', productsError);
    
    // Check articles table
    const { data: articles, error: articlesError, count: articlesCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: false })
      .limit(5);
    
    console.log('📝 ARTICLES TABLE:');
    console.log(`  - Total count: ${articlesCount}`);
    console.log(`  - Sample data:`, articles);
    if (articlesError) console.error('  - Error:', articlesError);
    
    // Check countries table
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('*');
    
    console.log('🌍 COUNTRIES TABLE:');
    console.log(`  - Total count: ${countries?.length || 0}`);
    console.log(`  - Countries:`, countries?.map(c => c.name || c.value).join(', '));
    if (countriesError) console.error('  - Error:', countriesError);
    
    console.log('=== END DIAGNOSTIC ===');
    
    return {
      stores: { count: storesCount, sample: stores, error: storesError },
      deals: { count: dealsCount, sample: deals, error: dealsError },
      products: { count: productsCount, sample: products, error: productsError },
      articles: { count: articlesCount, sample: articles, error: articlesError },
      countries: { count: countries?.length || 0, data: countries, error: countriesError },
    };
  } catch (err) {
    console.error('Error running database diagnostic:', err);
    return null;
  }
}
