// Direct search utility that queries Supabase directly from the client
// This bypasses the edge function for cases where deployment is having issues

import { createClient } from './supabase/client';

interface SearchOptions {
  query: string;
  countryValue?: string;
}

// Helper function to get existing searchable fields for a table
async function getSearchableFields(
  supabase: any,
  tableName: string,
  potentialFields: string[]
): Promise<string[]> {
  const { data: sample } = await supabase
    .from(tableName)
    .select('*')
    .limit(1)
    .single();
  
  if (sample) {
    const existing = potentialFields.filter(field => field in sample);
    console.log(`${tableName} available search fields:`, existing);
    return existing;
  }
  
  // Fallback to basic fields if no sample data
  return potentialFields.slice(0, 2);
}

// Helper function to build OR condition for search
function buildOrCondition(fields: string[], query: string): string {
  return fields.map(field => `${field}.ilike.%${query}%`).join(',');
}

export async function directSearch(options: SearchOptions) {
  const { query, countryValue } = options;
  
  if (!query || query.trim() === '') {
    return {
      success: true,
      stores: [],
      deals: [],
      products: [],
      articles: [],
      totalResults: 0,
      message: 'No search query provided'
    };
  }

  try {
    const supabase = createClient();
    
    console.log('Direct search for:', query, 'country:', countryValue);

    // Get country ID if country is provided
    let countryId = null;
    if (countryValue) {
      const { data: countryData, error: countryError } = await supabase
        .from('countries')
        .select('id')
        .eq('value', countryValue)
        .single();

      if (countryError) {
        console.error('Error fetching country:', countryError);
      } else if (countryData) {
        countryId = countryData.id;
        console.log(`Country ID for ${countryValue}: ${countryId}`);
      }
    }

    // ===== SEARCH STORES ONLY IN TRANSLATIONS TABLE =====
    // Try different possible column names for the translated text
    const { data: storeTranslations, error: storeTransError } = await supabase
      .from('translations')
      .select('entity_id')
      .eq('entity_type', 'store')
      .or(`translated_value.ilike.%${query}%,translation.ilike.%${query}%,text.ilike.%${query}%`)
      .limit(50);

    console.log(`Store translations search result: ${storeTranslations?.length || 0} results`);
    
    if (storeTransError) {
      console.error('Error searching store translations:', storeTransError.message, storeTransError.details);
    }

    let storesData = [];
    let storesError = storeTransError;

    if (storeTranslations && storeTranslations.length > 0) {
      const storeIds = [...new Set(storeTranslations.map(t => t.entity_id))];
      console.log(`Found ${storeIds.length} unique store IDs from translations`);
      
      let storesQuery = supabase
        .from('stores')
        .select('*')
        .in('id', storeIds)
        .limit(10);

      if (countryId) {
        storesQuery = storesQuery.eq('country_id', countryId);
      }

      const result = await storesQuery;
      storesData = result.data || [];
      storesError = result.error;
    }

    console.log(`Final stores result: ${storesData?.length || 0} stores`);
    
    if (storesError) {
      console.error('Error fetching stores:', storesError.message, storesError.details);
    }

    // ===== SEARCH DEALS ONLY IN TRANSLATIONS TABLE =====
    const { data: dealTranslations, error: dealTransError } = await supabase
      .from('translations')
      .select('entity_id')
      .eq('entity_type', 'deal')
      .or(`translated_value.ilike.%${query}%,translation.ilike.%${query}%,text.ilike.%${query}%`)
      .limit(50);

    console.log(`Deal translations search result: ${dealTranslations?.length || 0} results`);
    
    if (dealTransError) {
      console.error('Error searching deal translations:', dealTransError.message, dealTransError.details);
    }

    let dealsData = [];
    let dealsError = dealTransError;

    if (dealTranslations && dealTranslations.length > 0) {
      const dealIds = [...new Set(dealTranslations.map(t => t.entity_id))];
      console.log(`Found ${dealIds.length} unique deal IDs from translations`);
      
      let dealsQuery = supabase
        .from('deals')
        .select('*, stores!deals_store_id_fkey(*)')
        .in('id', dealIds)
        .limit(10);

      if (countryId) {
        dealsQuery = dealsQuery.eq('country_id', countryId);
      }

      const result = await dealsQuery;
      dealsData = result.data || [];
      dealsError = result.error;
    }

    console.log(`Final deals result: ${dealsData?.length || 0} deals`);
    
    if (dealsError) {
      console.error('Error fetching deals:', dealsError.message, dealsError.details);
    }

    // ===== PRODUCTS SEARCH REMOVED =====
    const productsData = [];
    const productsError = null;

    // ===== SEARCH ARTICLES =====
    const articlePotentialFields = [
      'title',
      'title_ar',
      'excerpt',
      'excerpt_ar',
      'content',
      'content_ar',
      'description',
      'description_ar'
    ];
    
    const articleFields = await getSearchableFields(supabase, 'articles', articlePotentialFields);
    const articleOrCondition = buildOrCondition(articleFields, query);
    
    let articlesQuery = supabase
      .from('articles')
      .select('*')
      .or(articleOrCondition)
      .limit(10);

    if (countryId) {
      articlesQuery = articlesQuery.eq('country_id', countryId);
    }

    const { data: articlesData, error: articlesError } = await articlesQuery;
    console.log(`Articles search result: ${articlesData?.length || 0} results`);
    
    if (articlesError) {
      console.error('Error searching articles:', articlesError.message, articlesError.details);
    }

    const totalResults = (storesData?.length || 0) + (dealsData?.length || 0) + 
                        (productsData?.length || 0) + (articlesData?.length || 0);

    console.log(`Found ${totalResults} total results for query: ${query} (stores: ${storesData?.length || 0}, deals: ${dealsData?.length || 0}, products: ${productsData?.length || 0}, articles: ${articlesData?.length || 0})`);

    return {
      success: true,
      query,
      stores: storesData || [],
      deals: dealsData || [],
      products: productsData || [],
      articles: articlesData || [],
      totalResults,
      country: countryValue,
    };
  } catch (err) {
    console.error('Error in direct search:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      stores: [],
      deals: [],
      products: [],
      articles: [],
      totalResults: 0,
    };
  }
}
