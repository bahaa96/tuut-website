// Diagnostic utility to debug store search issues
import { createClient } from './supabase/client';

export async function diagnoseStoreSearch(searchTerm: string, countryId?: number) {
  const supabase = createClient();
  
  console.log('=== STORE SEARCH DIAGNOSTIC ===');
  console.log('Search term:', searchTerm);
  console.log('Country ID filter:', countryId || 'none');
  
  // 1. Get ALL stores (no filter) to see what's in the database
  const { data: allStores, error: allError } = await supabase
    .from('stores')
    .select('*')
    .limit(100);
  
  console.log(`Total stores in database: ${allStores?.length || 0}`);
  if (allError) {
    console.error('Error fetching all stores:', allError);
  }
  
  // 2. Show field names from first store
  if (allStores && allStores.length > 0) {
    console.log('Store table fields:', Object.keys(allStores[0]));
    
    // 3. Find stores that might match "noon"
    const possibleMatches = allStores.filter(store => {
      const searchLower = searchTerm.toLowerCase();
      return Object.values(store).some(value => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchLower);
        }
        return false;
      });
    });
    
    console.log(`Stores containing "${searchTerm}":`, possibleMatches.length);
    possibleMatches.forEach(store => {
      console.log('Found store:', {
        id: store.id,
        store_name: store.store_name,
        name: store.name,
        title: store.title,
        store_name_ar: store.store_name_ar,
        name_ar: store.name_ar,
        country_id: store.country_id,
        allFields: Object.keys(store)
      });
    });
  }
  
  // 4. Try the exact search query we use (without country filter)
  // First check which fields actually exist
  const potentialSearchFields = [
    'store_name',
    'name', 
    'title',
    'description',
    'store_name_ar',
    'name_ar',
    'title_ar',
    'description_ar'
  ];
  
  const existingSearchFields = allStores && allStores.length > 0
    ? potentialSearchFields.filter(field => field in allStores[0])
    : ['name', 'description']; // fallback
  
  console.log('Existing searchable fields:', existingSearchFields);
  
  const storeOrCondition = existingSearchFields
    .map(field => `${field}.ilike.%${searchTerm}%`)
    .join(',');
    
  const { data: searchResults, error: searchError } = await supabase
    .from('stores')
    .select('*')
    .or(storeOrCondition)
    .limit(10);
  
  console.log(`Search query results (no country filter): ${searchResults?.length || 0}`);
  if (searchError) {
    console.error('Search error:', searchError);
  } else {
    console.log('Search results:', searchResults);
  }
  
  // 4b. Try with country filter if provided
  if (countryId) {
    const { data: countryFilteredResults, error: countryFilterError } = await supabase
      .from('stores')
      .select('*')
      .or(storeOrCondition)
      .eq('country_id', countryId)
      .limit(10);
    
    console.log(`Search query results (with country_id=${countryId}): ${countryFilteredResults?.length || 0}`);
    if (countryFilterError) {
      console.error('Search error with country filter:', countryFilterError);
    } else {
      console.log('Search results with country filter:', countryFilteredResults);
    }
  }
  
  // 5. Try individual field searches
  const fieldsToTest = ['store_name', 'name', 'title', 'description', 'store_name_ar', 'name_ar'];
  
  for (const field of fieldsToTest) {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .ilike(field, `%${searchTerm}%`)
      .limit(5);
    
    console.log(`Field "${field}" search: ${data?.length || 0} results`, error ? `Error: ${error.message}` : '');
    if (data && data.length > 0) {
      console.log(`  → First match in ${field}:`, data[0][field]);
    }
  }
  
  console.log('=== END DIAGNOSTIC ===');
  
  return {
    totalStores: allStores?.length || 0,
    searchResults: searchResults || [],
    possibleMatches: allStores?.filter(store => {
      const searchLower = searchTerm.toLowerCase();
      return Object.values(store).some(value => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchLower);
        }
        return false;
      });
    }) || []
  };
}
