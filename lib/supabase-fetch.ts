import { createClient } from '../utils/supabase/client';

// Example table types - adjust these based on your actual Supabase tables
interface Deal {
  id: string;
  title_en: string;
  description_en: string;
  price: number;
  original_price?: number;
  image_url?: string;
  category: string;
  store: string;
  expires_at?: string;
  created_at: string;
  user_id: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  preferences?: Record<string, any>;
  created_at: string;
}

interface Product {
  id: string | number;
  title?: string;
  title_ar?: string;
  name?: string;
  name_ar?: string;
  slug?: string;
  price?: number;
  rating?: number;
  ratings_count?: number;
  image_url?: string;
  store_name?: string;
  store_name_ar?: string;
}

// Direct Supabase data fetching functions
export async function fetchDeals(options?: {
  category?: string;
  store?: string;
  country_slug?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: Deal[]; error: Error | null }> {
  try {
    const supabase = createClient();

    let query = supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (options?.category) {
      query = query.eq('category', options.category);
    }

    if (options?.store) {
      query = query.eq('store', options.store);
    }

    if (options?.country_slug) {
      query = query.eq('country_slug', options.country_slug);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    return {
      data: data || [],
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// Fetch a single deal by ID
export async function fetchDealById(dealId: string): Promise<{ data: Deal | null; error: Error | null }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('id', dealId)
      .single();

    return {
      data,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// Fetch user profile
export async function fetchUserProfile(userId: string): Promise<{ data: UserProfile | null; error: Error | null }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    return {
      data,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// Create a new deal
export async function createDeal(deal: Omit<Deal, 'id' | 'created_at' | 'user_id'>): Promise<{ data: Deal | null; error: Error | null }> {
  try {
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    const newDeal = {
      ...deal,
      user_id: user.id,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('deals')
      .insert(newDeal)
      .select()
      .single();

    return {
      data,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// Update user preferences
export async function updateUserPreferences(preferences: Record<string, any>): Promise<{ success: boolean; error: Error | null }> {
  try {
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        preferences,
        updated_at: new Date().toISOString()
      });

    return {
      success: !error,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// Search deals by text
export async function searchDeals(searchTerm: string, options?: {
  category?: string;
  store?: string;
  country_slug?: string;
  limit?: number;
}): Promise<{ data: Deal[]; error: Error | null }> {
  try {
    const supabase = createClient();

    let query = supabase
      .from('deals')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .eq('country_slug', options?.country_slug || '');

    if (options?.category) {
      query = query.eq('category', options.category);
    }

    if (options?.store) {
      query = query.eq('store', options.store);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    return {
      data: data || [],
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// Real-time subscription to deals
export function subscribeToDeals(callback: (payload: { deal: Deal; type: 'INSERT' | 'UPDATE' | 'DELETE' }) => void) {
  const supabase = createClient();

  const channel = supabase
    .channel('deals-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'deals'
      },
      (payload) => {
        callback({
          deal: payload.new as Deal,
          type: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE'
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Fetch deals by country slug - optimized for the deals page
export async function fetchDealsByCountrySlug(countrySlug: string, options?: {
  category?: string;
  store?: string;
  limit?: number;
  offset?: number;
}): Promise<{ data: Deal[]; error: Error | null }> {
  try {
    const supabase = createClient();

    let query = supabase
      .from('deals')
      .select('*')
      .eq('country_slug', countrySlug)
      .order('created_at', { ascending: false });

    // Apply additional filters if provided
    if (options?.category) {
      query = query.eq('category_name', options.category);
    }

    if (options?.store) {
      query = query.eq('store_name', options.store);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      return {
        data: [],
        error: new Error(error.message)
      };
    }

    // Format deals without store join (store info should be included in deal data)
    const formattedDeals = data?.map((deal: any) => {
      return {
        id: deal.id,
        slug: deal.slug,
        title_en: deal.title_en,
        title_ar: deal.title_ar,
        description_en: deal.description_en,
        description_ar: deal.description_ar,
        discount_percentage: deal.discount_percentage,
        discount_amount: deal.discount_amount,
        original_price: deal.original_price,
        discounted_price: deal.discounted_price,
        code: deal.code,
        store_id: deal.store_id,
        store_slug: deal.store_slug,
        store_name: deal.store_name,
        store_logo: deal.store_logo,
        category_name: deal.category_name,
        expires_at: deal.expires_at,
        is_verified: deal.is_verified,
        featured: deal.featured,
        created_at: deal.created_at,
        country_slug: deal.country_slug,
      };
    }) || [];

    return {
      data: formattedDeals,
      error: null
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}


// Fetch countries for filtering
export async function fetchCountries(): Promise<{ data: any[]; error: Error | null }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name_en');

    if (error) {
      return {
        data: [],
        error: new Error(error.message)
      };
    }

    return {
      data: data || [],
      error: null
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// Fetch categories for filtering
export async function fetchCategories(): Promise<{ data: { id: number; name: string }[]; error: Error | null }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('title')
      .limit(10);

    if (error) {
      return {
        data: [],
        error: new Error(error.message)
      };
    }

    // Format categories with consistent name field
    const formattedCategories = data ? data.map((cat: any) => ({
      id: cat.id,
      name: cat.title || cat.category_name || cat.name || cat.label || 'Unknown Category',
      slug: cat.slug || cat.id,
    })) : [];

    return {
      data: formattedCategories,
      error: null
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// Fetch stores for filtering
export async function fetchStores(): Promise<{ data: { id: number; name: string }[]; error: Error | null }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('name');

    if (error) {
      return {
        data: [],
        error: new Error(error.message)
      };
    }

    // Format stores with consistent name field
    const formattedStores = data ? data.map((store: any) => ({
      id: store.id,
      name: store.store_name || store.name || store.title || 'Unknown Store',
    })) : [];

    return {
      data: formattedStores,
      error: null
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// Fetch featured deals for footer
export async function fetchFooterFeaturedDeals(countrySlug?: string): Promise<{ data: Deal[]; error: Error | null }> {
  try {
    const supabase = createClient();

    let query = supabase
      .from('featured_deals')
      .select(`
        deals (
          id,
          slug,
          title,
          discount,
          code
        )
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(5);

    // Filter by country if provided
    if (countrySlug) {
      query = query.eq('country_slug', countrySlug);
    }

    const { data, error } = await query;

    if (error) {
      return {
        data: [],
        error: new Error(error.message)
      };
    }

    // Extract deals directly from the nested structure
    const deals = data?.map((item: any) => item.deals).filter(Boolean) || [];

    return {
      data: deals,
      error: null
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// Fetch top stores for footer
export async function fetchFooterTopStores(countrySlug?: string): Promise<{ data: { id: string; name: string; slug: string }[]; error: Error | null }> {
  try {
    const supabase = createClient();

    let query = supabase
      .from('stores')
      .select('id, title, slug')
      .eq('is_active', true)
      .order('total_offers', { ascending: false, nullsFirst: false })
      .limit(10);

    // Filter by country if provided
    if (countrySlug) {
      query = query.eq('country_slug', countrySlug);
    }

    const { data, error } = await query;

    if (error) {
      return {
        data: [],
        error: new Error(error.message)
      };
    }

    // Format stores data
    const formattedStores = data ? data.map((store: any) => ({
      id: store.id,
      name: store.title || 'Store',
      slug: store.slug || store.id,
    })) : [];

    return {
      data: formattedStores,
      error: null
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// Fetch articles/guides for footer
export async function fetchFooterArticles(countrySlug?: string): Promise<{ data: { id: string; title_en: string; slug: string }[]; error: Error | null }> {
  try {
    const supabase = createClient();

    let query = supabase
      .from('articles')
      .select('id, title, slug')
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(6);

    // Filter by country if provided
    if (countrySlug) {
      query = query.eq('country_slug', countrySlug);
    }

    const { data, error } = await query;

    if (error) {
      return {
        data: [],
        error: new Error(error.message)
      };
    }

    return {
      data: data || [],
      error: null
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// Fetch best selling products for footer
export async function fetchFooterBestSellingProducts(countrySlug?: string): Promise<{ data: Product[]; error: Error | null }> {
  try {
    const supabase = createClient();

    let query = supabase
      .from('products')
      .select('id, title, slug, price, rating, ratings_count')
      .eq('available', true)
      .gt('ratings_count', 0) // Only get products with ratings
      .order('ratings_count', { ascending: false })
      .order('rating', { ascending: false })
      .limit(10);

    // Filter by country if provided
    if (countrySlug) {
      query = query.eq('country_slug', countrySlug);
    }

    const { data, error } = await query;

    if (error) {
      return {
        data: [],
        error: new Error(error.message)
      };
    }

    return {
      data: data || [],
      error: null
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// Fetch a single deal by slug
export async function fetchDealBySlug(dealSlug: string): Promise<{ data: any | null; error: Error | null }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('slug', dealSlug)
      .single();

    if (error) {
      return {
        data: null,
        error: new Error(error.message)
      };
    }

    // Fetch store information if store_id exists
    let storeInfo = null;
    if (data?.store_id) {
      const { data: storeData } = await supabase
        .from('stores')
        .select('id, title, slug')
        .eq('id', data.store_id)
        .single();

      storeInfo = storeData;
    }

    // Combine deal with store information and map to expected fields
    const dealWithStore = data ? {
      id: data.id,
      slug: data.slug,
      title: data.title,
      description: data.description,
      discount_percentage: data.discount_unit === 'percentage' ? data.discount : null,
      discount_amount: data.discount_unit === 'amount' ? data.discount : null,
      code: data.code,
      expiry_date: data.expiry_date,
      store_id: data.store_id,
      store_name: storeInfo?.title || 'Store',
      store_slug: storeInfo?.slug || data.store_id,
      country_slug: data.country_slug,
      is_active: data.is_active,
      is_featured: data.is_featured,
      is_trending: data.is_trending,
      type: data.type,
      view_count: data.view_count,
      created_at: data.created_at,
      updated_at: data.updated_at,
    } : null;

    return {
      data: dealWithStore,
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// Fetch all footer data at once for efficiency
export async function fetchFooterData(countrySlug?: string) {
  const [featuredDeals, topStores, articles, categories, bestSellingProducts] = await Promise.all([
    fetchFooterFeaturedDeals(countrySlug),
    fetchFooterTopStores(countrySlug),
    fetchFooterArticles(countrySlug),
    fetchCategories(),
    fetchFooterBestSellingProducts(countrySlug)
  ]);

  return {
    featuredDeals: featuredDeals.data,
    topStores: topStores.data,
    articles: articles.data,
    categories: categories.data,
    bestSellingProducts: bestSellingProducts.data,
    errors: {
      featuredDeals: featuredDeals.error,
      topStores: topStores.error,
      articles: articles.error,
      categories: categories.error,
      bestSellingProducts: bestSellingProducts.error,
    }
  };
}

// Fetch stores by country slug - optimized for the stores page
export async function fetchStoresByCountrySlug(countrySlug: string, options?: {
  limit?: number;
  offset?: number;
}): Promise<{ data: any[]; error: Error | null }> {
  try {
    const supabase = createClient();

    let query = supabase
      .from('stores')
      .select('*')
      .eq('country_slug', countrySlug)
      .eq('is_active', true)
      .order('total_offers', { ascending: false, nullsFirst: false });

    // Apply additional options if provided
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    }

    const { data, error } = await query;

    if (error) {
      return {
        data: [],
        error: new Error(error.message)
      };
    }

    // Format stores data to match expected interface
    const formattedStores = data?.map((store: any) => {
      return {
        id: store.id,
        name: store.title || 'Store',
        name_ar: '', // No Arabic name field in current schema
        store_name: store.title || 'Store',
        store_name_ar: '', // No Arabic name field in current schema
        title: store.title || 'Store',
        title_ar: '', // No Arabic name field in current schema
        description: store.description || '',
        description_ar: '', // No Arabic description field in current schema
        logo: store.profile_picture_url || '',
        profile_picture_url: store.profile_picture_url || '',
        profile_image: store.profile_picture_url || '',
        banner_image: store.cover_picture_url || '',
        slug: store.slug || '',
        deals_count: store.total_offers || 0,
        active_deals_count: store.total_offers || 0,
        total_offers: store.total_offers || 0,
        category_id: null, // No category_id in stores table
        country_id: store.country_id,
        featured: false, // No featured field in stores table
        is_featured: false, // No is_featured field in stores table
        rating: null, // No rating field in stores table
        total_savings: null, // No total_savings field in stores table
        is_active: store.is_active,
      };
    }) || [];

    return {
      data: formattedStores,
      error: null
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

// Example usage in a React component
export async function loadDealsAndDisplay() {
  console.log('Loading deals from Supabase...');

  // Fetch all deals
  const { data: deals, error } = await fetchDeals({ limit: 10 });

  if (error) {
    console.error('Error fetching deals:', error);
    return;
  }

  console.log(`Loaded ${deals.length} deals:`, deals);

  // Search for specific deals
  const { data: searchResults, error: searchError } = await searchDeals('iPhone', { limit: 5 });

  if (searchError) {
    console.error('Error searching deals:', searchError);
  } else {
    console.log(`Found ${searchResults.length} iPhone deals:`, searchResults);
  }

  return deals;
}