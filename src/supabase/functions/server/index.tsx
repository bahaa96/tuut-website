import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-4f34ef25/health", (c) => {
  return c.json({ status: "ok" });
});

// Fetch countries for the frontend
app.get("/make-server-4f34ef25/countries", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data, error } = await supabase
      .from('countries')
      .select('*');

    if (error) {
      console.error('Error fetching countries:', error);
      return c.json({ 
        error: error.message,
        details: error,
      }, 500);
    }

    console.log('Countries data fetched:', data);

    return c.json({
      success: true,
      countries: data,
    });
  } catch (err) {
    console.error('Error in countries endpoint:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Unknown error',
    }, 500);
  }
});

// Fetch featured deals for the frontend with optional country filter
app.get("/make-server-4f34ef25/featured-deals", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get country parameter from query string
    const countryValue = c.req.query('country'); // e.g., "egypt"
    
    console.log('Fetching featured deals for country:', countryValue);

    // First, get the country ID if country is provided
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

    // First, get the list of featured deal IDs
    const { data: featuredDealsData, error: featuredError } = await supabase
      .from('featured_deals')
      .select('deal_id, sort_order, id')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (featuredError) {
      console.error('Error fetching featured_deals:', featuredError);
      return c.json({ 
        error: featuredError.message,
        details: featuredError,
      }, 500);
    }

    // If no featured deals, return empty array
    if (!featuredDealsData || featuredDealsData.length === 0) {
      console.log('No featured deals found');
      return c.json({
        success: true,
        deals: [],
        country: countryValue,
      });
    }

    // Get the deal IDs from featured_deals
    const featuredDealIds = featuredDealsData.map(fd => fd.deal_id);

    // Query deals that are in the featured list
    let dealsQuery = supabase
      .from('deals')
      .select('*, stores!deals_store_id_fkey(*)')
      .in('id', featuredDealIds);

    // Apply country filter at database level if country is specified
    if (countryId) {
      dealsQuery = dealsQuery.eq('country_id', countryId);
      console.log(`Filtering deals by country_id: ${countryId}`);
    }

    const { data: dealsData, error: dealsError } = await dealsQuery;

    if (dealsError) {
      console.error('Error fetching deals:', dealsError);
      console.error('Error details:', JSON.stringify(dealsError, null, 2));
      return c.json({ 
        error: dealsError.message,
        details: dealsError,
      }, 500);
    }

    // Create a map of deal_id to featured_deals entry for sorting
    const featuredMap = new Map();
    featuredDealsData.forEach(fd => {
      featuredMap.set(fd.deal_id, fd);
    });

    // Transform and sort the data to match the expected structure
    const featuredDeals = dealsData
      ?.map(deal => {
        const featuredInfo = featuredMap.get(deal.id);
        return {
          id: featuredInfo?.id || deal.id, // featured_deals table id
          deal_id: deal.id,
          sort_order: featuredInfo?.sort_order || 0,
          deals: deal, // The actual deal with stores nested
        };
      })
      .sort((a, b) => a.sort_order - b.sort_order) || [];
    
    if (featuredDeals && featuredDeals.length > 0) {
      console.log('First featured deal item:', JSON.stringify(featuredDeals[0], null, 2));
    }

    console.log(`Fetched ${featuredDeals?.length || 0} featured deals for country: ${countryValue || 'all'}`);

    return c.json({
      success: true,
      deals: featuredDeals || [],
      country: countryValue,
    });
  } catch (err) {
    console.error('Error in featured-deals endpoint:', err);
    console.error('Error stack:', err instanceof Error ? err.stack : 'No stack trace');
    return c.json({ 
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
    }, 500);
  }
});

// Fetch stores with optional country filter and pagination
app.get("/make-server-4f34ef25/stores", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const countryValue = c.req.query('country');
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit') as string) : undefined;
    const offset = c.req.query('offset') ? parseInt(c.req.query('offset') as string) : undefined;
    const search = c.req.query('search');
    
    console.log('Fetching stores for country:', countryValue, 'search:', search);

    let query = supabase
      .from('stores')
      .select('*', { count: 'exact' });

    // If country is provided, filter by it
    if (countryValue) {
      const { data: countryData } = await supabase
        .from('countries')
        .select('id')
        .eq('value', countryValue)
        .single();

      if (countryData) {
        query = query.eq('country_id', countryData.id);
      }
    }

    // Search filter
    if (search) {
      query = query.or(`store_name.ilike.%${search}%,title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Pagination
    if (offset !== undefined) {
      query = query.range(offset, offset + (limit || 20) - 1);
    } else if (limit) {
      query = query.limit(limit);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching stores:', error);
      return c.json({ 
        error: error.message,
        details: error,
      }, 500);
    }

    return c.json({
      success: true,
      stores: data,
      total: count,
      country: countryValue,
    });
  } catch (err) {
    console.error('Error in stores endpoint:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Unknown error',
    }, 500);
  }
});

// Fetch deals with optional country and filters
app.get("/make-server-4f34ef25/deals", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const countryValue = c.req.query('country');
    const storeId = c.req.query('store_id');
    const categoryId = c.req.query('category_id');
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit') as string) : undefined;
    
    console.log('Fetching deals for country:', countryValue, 'store:', storeId, 'category:', categoryId);

    let query = supabase
      .from('deals')
      .select('*, stores!deals_store_id_fkey(*)');

    // If country is provided, filter by it
    if (countryValue) {
      const { data: countryData } = await supabase
        .from('countries')
        .select('id')
        .eq('value', countryValue)
        .single();

      if (countryData) {
        query = query.eq('country_id', countryData.id);
      }
    }

    if (storeId) {
      query = query.eq('store_id', storeId);
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching deals:', error);
      return c.json({ 
        error: error.message,
        details: error,
      }, 500);
    }

    return c.json({
      success: true,
      deals: data,
      country: countryValue,
    });
  } catch (err) {
    console.error('Error in deals endpoint:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Unknown error',
    }, 500);
  }
});

// Fetch articles/blog posts with country filter
app.get("/make-server-4f34ef25/articles", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const countryValue = c.req.query('country');
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit') as string) : undefined;
    const offset = c.req.query('offset') ? parseInt(c.req.query('offset') as string) : undefined;
    
    console.log('Fetching articles for country:', countryValue);

    let query = supabase
      .from('articles')
      .select('*', { count: 'exact' });

    // ALWAYS filter by country - if country is provided, filter by it
    // This ensures articles are only shown for the selected country
    if (countryValue) {
      const { data: countryData, error: countryError } = await supabase
        .from('countries')
        .select('id')
        .eq('value', countryValue)
        .single();

      if (countryError) {
        console.error('Error fetching country:', countryError);
        // If country not found, return empty array
        return c.json({
          success: true,
          articles: [],
          total: 0,
          country: countryValue,
          message: 'Country not found'
        });
      }

      if (countryData) {
        console.log(`Filtering articles by country_id: ${countryData.id}`);
        // Filter by country_id - only show articles for this specific country
        query = query.eq('country_id', countryData.id);
      }
    } else {
      // If no country is selected, return empty array to enforce country selection
      console.log('No country selected, returning empty articles list');
      return c.json({
        success: true,
        articles: [],
        total: 0,
        country: null,
        message: 'No country selected'
      });
    }

    // Order by featured first, then by date
    query = query.order('is_featured', { ascending: false })
                 .order('published_at', { ascending: false });

    // Pagination
    if (offset !== undefined) {
      query = query.range(offset, offset + (limit || 20) - 1);
    } else if (limit) {
      query = query.limit(limit);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching articles:', error);
      return c.json({ 
        error: error.message,
        details: error,
      }, 500);
    }

    console.log(`Fetched ${data?.length || 0} articles for country: ${countryValue}`);

    return c.json({
      success: true,
      articles: data || [],
      total: count,
      country: countryValue,
    });
  } catch (err) {
    console.error('Error in articles endpoint:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Unknown error',
    }, 500);
  }
});

// Fetch a single article by slug
app.get("/make-server-4f34ef25/articles/:slug", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const slug = c.req.param('slug');
    
    console.log('Fetching article with slug:', slug);

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching article:', error);
      return c.json({ 
        error: error.message,
        details: error,
      }, 404);
    }

    console.log(`Fetched article: ${data?.title || data?.title_ar}`);

    return c.json({
      success: true,
      article: data,
    });
  } catch (err) {
    console.error('Error in article endpoint:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Unknown error',
    }, 500);
  }
});

// Fetch products with optional country and filters
app.get("/make-server-4f34ef25/products", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const countryValue = c.req.query('country');
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit') as string) : undefined;
    const offset = c.req.query('offset') ? parseInt(c.req.query('offset') as string) : undefined;
    const search = c.req.query('search');
    const category = c.req.query('category');
    
    console.log('Fetching products for country:', countryValue, 'search:', search, 'category:', category);

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });

    // If country is provided, filter by it
    if (countryValue) {
      const { data: countryData } = await supabase
        .from('countries')
        .select('id')
        .eq('value', countryValue)
        .single();

      if (countryData) {
        console.log(`Filtering products by country_id: ${countryData.id}`);
        query = query.eq('country_id', countryData.id);
      }
    }

    // Search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,name_ar.ilike.%${search}%,description.ilike.%${search}%,description_ar.ilike.%${search}%`);
    }

    // Category filter
    if (category && category !== 'all') {
      query = query.or(`category.eq.${category},category_ar.eq.${category}`);
    }

    // Order by created date (most recent first)
    query = query.order('created_at', { ascending: false });

    // Pagination
    if (offset !== undefined) {
      query = query.range(offset, offset + (limit || 20) - 1);
    } else if (limit) {
      query = query.limit(limit);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return c.json({ 
        error: error.message,
        details: error,
      }, 500);
    }

    console.log(`Fetched ${data?.length || 0} products for country: ${countryValue}`);

    return c.json({
      success: true,
      products: data || [],
      total: count,
      country: countryValue,
    });
  } catch (err) {
    console.error('Error in products endpoint:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Unknown error',
    }, 500);
  }
});

// Fetch a single product by ID or slug
app.get("/make-server-4f34ef25/product/:identifier", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const identifier = c.req.param('identifier');
    
    console.log('Fetching product with identifier:', identifier);

    // Try to fetch by ID first (if identifier is a number), then by slug
    let query;
    if (!isNaN(Number(identifier))) {
      query = supabase
        .from('products')
        .select('*')
        .eq('id', identifier)
        .single();
    } else {
      query = supabase
        .from('products')
        .select('*')
        .eq('slug', identifier)
        .single();
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching product:', error);
      return c.json({ 
        error: error.message,
        details: error,
      }, 404);
    }

    if (!data) {
      return c.json({ 
        error: 'Product not found',
      }, 404);
    }

    console.log('Product fetched successfully:', data.id);

    return c.json({
      success: true,
      product: data,
    });
  } catch (err) {
    console.error('Error in product detail endpoint:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Unknown error',
    }, 500);
  }
});

// Global search endpoint - search across stores, deals, products, and articles
app.get("/make-server-4f34ef25/search", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const query = c.req.query('q');
    const countryValue = c.req.query('country');
    
    if (!query || query.trim() === '') {
      return c.json({
        success: true,
        stores: [],
        deals: [],
        products: [],
        articles: [],
        totalResults: 0,
        message: 'No search query provided'
      });
    }

    console.log('Global search for:', query, 'country:', countryValue);

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

    // Search stores ONLY in translations table
    const { data: storeTranslations, error: storeTransError } = await supabase
      .from('translations')
      .select('entity_id')
      .eq('entity_type', 'store')
      .ilike('translated_value', `%${query}%`)
      .limit(50);

    console.log(`Store translations search result: ${storeTranslations?.length || 0} results`, storeTransError ? `Error: ${storeTransError.message}` : '');

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
        console.log(`Filtering stores by country_id: ${countryId}`);
      }

      const result = await storesQuery;
      storesData = result.data || [];
      storesError = result.error;
    }

    console.log(`Final stores result: ${storesData?.length || 0} stores`, storesError ? `Error: ${storesError.message}` : '');

    // Search deals ONLY in translations table
    const { data: dealTranslations, error: dealTransError } = await supabase
      .from('translations')
      .select('entity_id')
      .eq('entity_type', 'deal')
      .ilike('translated_value', `%${query}%`)
      .limit(50);

    console.log(`Deal translations search result: ${dealTranslations?.length || 0} results`, dealTransError ? `Error: ${dealTransError.message}` : '');

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
        console.log(`Filtering deals by country_id: ${countryId}`);
      }

      const result = await dealsQuery;
      dealsData = result.data || [];
      dealsError = result.error;
    }

    console.log(`Final deals result: ${dealsData?.length || 0} deals`, dealsError ? `Error: ${dealsError.message}` : '');

    // Products search removed - not searching products anymore
    const productsData = [];
    const productsError = null;

    // Search articles (shopping guides) - use only columns that exist
    let articlesQuery = supabase
      .from('articles')
      .select('*')
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .limit(10);

    if (countryId) {
      articlesQuery = articlesQuery.eq('country_id', countryId);
      console.log(`Searching articles with country_id: ${countryId}`);
    }

    const { data: articlesData, error: articlesError } = await articlesQuery;
    console.log(`Articles search result: ${articlesData?.length || 0} results`, articlesError ? `Error: ${articlesError.message}` : '');

    if (storesError) console.error('Error searching stores:', storesError.message, storesError.details);
    if (dealsError) console.error('Error searching deals:', dealsError.message, dealsError.details);
    if (productsError) console.error('Error searching products:', productsError.message, productsError.details);
    if (articlesError) console.error('Error searching articles:', articlesError.message, articlesError.details);

    const totalResults = (storesData?.length || 0) + (dealsData?.length || 0) + 
                        (productsData?.length || 0) + (articlesData?.length || 0);

    console.log(`Found ${totalResults} total results for query: ${query} (stores: ${storesData?.length || 0}, deals: ${dealsData?.length || 0}, products: ${productsData?.length || 0}, articles: ${articlesData?.length || 0})`);

    return c.json({
      success: true,
      query,
      stores: storesData || [],
      deals: dealsData || [],
      products: productsData || [],
      articles: articlesData || [],
      totalResults,
      country: countryValue,
    });
  } catch (err) {
    console.error('Error in search endpoint:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Unknown error',
      success: false,
    }, 500);
  }
});

// Diagnostic endpoint to check translations table schema
app.get("/make-server-4f34ef25/translations/inspect", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Fetch sample data from translations table
    const { data: translationsData, error: translationsError } = await supabase
      .from('translations')
      .select('*')
      .limit(20);

    console.log('Translations table query result:', { 
      rowCount: translationsData?.length || 0,
      error: translationsError 
    });

    if (translationsData && translationsData.length > 0) {
      console.log('Sample translation record:', translationsData[0]);
      console.log('Columns:', Object.keys(translationsData[0]));
    }

    return c.json({
      success: !translationsError,
      rowCount: translationsData?.length || 0,
      columns: translationsData && translationsData.length > 0 ? Object.keys(translationsData[0]) : [],
      sampleData: translationsData,
      error: translationsError?.message,
      errorDetails: translationsError
    });
  } catch (err) {
    console.error('Error inspecting translations table:', err);
    return c.json({ 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined
    }, 500);
  }
});

// Fetch featured deals schema and data
app.get("/make-server-4f34ef25/featured-deals/inspect", async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Fetch sample data from stores table
    const { data: storesData, error: storesError } = await supabase
      .from('stores')
      .select('*')
      .limit(2);

    if (storesError) {
      console.error('Error fetching stores table:', storesError);
    }

    // Fetch sample data from deals table
    const { data: dealsData, error: dealsError } = await supabase
      .from('deals')
      .select('*')
      .limit(2);

    if (dealsError) {
      console.error('Error fetching deals table:', dealsError);
    }

    // Fetch sample data from categories table
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(2);

    if (categoriesError) {
      console.error('Error fetching categories table:', categoriesError);
    }

    // Fetch sample data from countries table
    const { data: countriesData, error: countriesError } = await supabase
      .from('countries')
      .select('*');

    if (countriesError) {
      console.error('Error fetching countries table:', countriesError);
    }

    // Fetch sample data from translations table
    const { data: translationsData, error: translationsError } = await supabase
      .from('translations')
      .select('*')
      .limit(10);

    if (translationsError) {
      console.error('Error fetching translations table:', translationsError);
    }

    // Fetch sample data from featured_deals table with full join
    // Use deal_id and store_id foreign keys
    const { data: featuredData, error: featuredError } = await supabase
      .from('featured_deals')
      .select(`
        *,
        deals:deal_id (
          *,
          stores:store_id (*)
        )
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .limit(6);

    if (featuredError) {
      console.error('Error fetching featured_deals with join:', featuredError);
    }

    // Return the data so we can see the schema
    return c.json({
      success: true,
      storesTable: {
        columns: storesData && storesData.length > 0 ? Object.keys(storesData[0]) : [],
        sampleData: storesData,
        error: storesError?.message,
      },
      dealsTable: {
        columns: dealsData && dealsData.length > 0 ? Object.keys(dealsData[0]) : [],
        sampleData: dealsData,
        error: dealsError?.message,
      },
      categoriesTable: {
        columns: categoriesData && categoriesData.length > 0 ? Object.keys(categoriesData[0]) : [],
        sampleData: categoriesData,
        error: categoriesError?.message,
      },
      countriesTable: {
        columns: countriesData && countriesData.length > 0 ? Object.keys(countriesData[0]) : [],
        sampleData: countriesData,
        rowCount: countriesData?.length || 0,
        error: countriesError?.message,
      },
      translationsTable: {
        columns: translationsData && translationsData.length > 0 ? Object.keys(translationsData[0]) : [],
        sampleData: translationsData,
        rowCount: translationsData?.length || 0,
        error: translationsError?.message,
      },
      featuredDealsJoined: {
        rowCount: featuredData?.length || 0,
        sampleData: featuredData,
        error: featuredError?.message,
      }
    });
  } catch (err) {
    console.error('Error in featured-deals inspect:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
    }, 500);
  }
});

// Authentication Routes using D7 Network SMS OTP

// Simplified Authentication - Phone Number Only

// Sign in with phone number - save to customers table
app.post("/make-server-4f34ef25/auth/signin", async (c) => {
  console.log('🔵 /auth/signin endpoint hit');
  try {
    const body = await c.req.json();
    console.log('📦 Request body:', body);
    
    const { phone } = body;
    
    if (!phone) {
      console.log('❌ No phone number provided');
      return c.json({ error: 'Phone number is required' }, 400);
    }

    console.log('📞 Sign in request for phone:', phone);

    // Check if customer already exists in Supabase
    const { data: existingCustomer, error: fetchError } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .single();

    let customer;

    if (existingCustomer) {
      console.log('✅ Existing customer found:', existingCustomer.id);
      customer = existingCustomer;
    } else {
      // Create new customer in Supabase
      const { data: newCustomer, error: insertError } = await supabase
        .from('customers')
        .insert([{ phone }])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error creating customer:', insertError);
        return c.json({ error: 'Failed to save customer' }, 500);
      }

      console.log('✅ New customer created:', newCustomer.id);
      customer = newCustomer;
    }

    // Create session token
    const sessionToken = crypto.randomUUID();
    const sessionKey = `session:${sessionToken}`;
    const sessionData = {
      user_id: customer.id,
      phone: customer.phone,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    };
    
    await kv.set(sessionKey, sessionData);
    console.log('🎟️ Session created:', sessionToken);

    const response = { 
      success: true,
      access_token: sessionToken,
      user: {
        id: customer.id,
        phone: customer.phone,
      }
    };
    
    console.log('✅ Returning success response');
    return c.json(response);
  } catch (err) {
    console.error('❌ Error in signin endpoint:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Unknown error',
    }, 500);
  }
});

// Legacy OTP endpoints - removed, no longer in use

// Get user from session token
app.get("/make-server-4f34ef25/auth/user", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const sessionKey = `session:${accessToken}`;
    const session = await kv.get(sessionKey);

    if (!session) {
      return c.json({ error: 'Invalid session' }, 401);
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      await kv.del(sessionKey);
      return c.json({ error: 'Session expired' }, 401);
    }

    const userKey = `user:${session.phone}`;
    const user = await kv.get(userKey);

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ 
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
      }
    });
  } catch (err) {
    console.error('Error in get user endpoint:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Unknown error',
    }, 500);
  }
});

// Sign out
app.post("/make-server-4f34ef25/auth/signout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ success: true }); // Already signed out
    }

    const sessionKey = `session:${accessToken}`;
    await kv.del(sessionKey);
    console.log('Session deleted:', accessToken);

    return c.json({ success: true });
  } catch (err) {
    console.error('Error in signout endpoint:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Unknown error',
    }, 500);
  }
});

// Tracked Products Routes

// Get all tracked products for authenticated user
app.get("/make-server-4f34ef25/tracked-products", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Verify session
    const sessionKey = `session:${accessToken}`;
    const session = await kv.get(sessionKey);

    if (!session) {
      return c.json({ error: 'Invalid session' }, 401);
    }

    if (new Date(session.expires_at) < new Date()) {
      await kv.del(sessionKey);
      return c.json({ error: 'Session expired' }, 401);
    }

    // Get all tracked products for this user from KV store
    const productsPrefix = `tracked_product:${session.user_id}:`;
    const products = await kv.getByPrefix(productsPrefix);

    // Sort by created_at descending
    const sortedProducts = products.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return c.json({ success: true, products: sortedProducts });
  } catch (err) {
    console.error('Error in tracked-products GET endpoint:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Unknown error',
    }, 500);
  }
});

// Add a new tracked product
app.post("/make-server-4f34ef25/tracked-products", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Verify session
    const sessionKey = `session:${accessToken}`;
    const session = await kv.get(sessionKey);

    if (!session) {
      return c.json({ error: 'Invalid session' }, 401);
    }

    if (new Date(session.expires_at) < new Date()) {
      await kv.del(sessionKey);
      return c.json({ error: 'Session expired' }, 401);
    }

    const body = await c.req.json();
    const {
      product_url,
      product_title,
      current_price,
      currency,
      thumbnail_url,
      availability,
      price_drop_alert,
      restock_alert,
    } = body;

    // Check if product is already tracked
    const productsPrefix = `tracked_product:${session.user_id}:`;
    const existingProducts = await kv.getByPrefix(productsPrefix);
    const alreadyTracked = existingProducts.find(p => p.product_url === product_url);

    if (alreadyTracked) {
      return c.json({ error: 'Product already tracked' }, 400);
    }

    // Create new tracked product
    const productId = crypto.randomUUID();
    const product = {
      id: productId,
      user_id: session.user_id,
      product_url,
      product_title,
      current_price,
      currency,
      thumbnail_url,
      availability,
      price_drop_alert: price_drop_alert ?? false,
      restock_alert: restock_alert ?? false,
      created_at: new Date().toISOString(),
      last_checked_at: new Date().toISOString(),
    };

    const productKey = `tracked_product:${session.user_id}:${productId}`;
    await kv.set(productKey, product);

    console.log('Tracked product added:', productId);

    return c.json({ success: true, product });
  } catch (err) {
    console.error('Error in tracked-products POST endpoint:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Unknown error',
    }, 500);
  }
});

// Delete a tracked product
app.delete("/make-server-4f34ef25/tracked-products/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Verify session
    const sessionKey = `session:${accessToken}`;
    const session = await kv.get(sessionKey);

    if (!session) {
      return c.json({ error: 'Invalid session' }, 401);
    }

    if (new Date(session.expires_at) < new Date()) {
      await kv.del(sessionKey);
      return c.json({ error: 'Session expired' }, 401);
    }

    const productId = c.req.param('id');
    const productKey = `tracked_product:${session.user_id}:${productId}`;

    // Check if product exists and belongs to user
    const product = await kv.get(productKey);
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    await kv.del(productKey);
    console.log('Tracked product deleted:', productId);

    return c.json({ success: true });
  } catch (err) {
    console.error('Error in tracked-products DELETE endpoint:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Unknown error',
    }, 500);
  }
});

// Saved Deals Routes

// Get all saved deals for authenticated user
app.get("/make-server-4f34ef25/saved-deals", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const sessionKey = `session:${accessToken}`;
    const session = await kv.get(sessionKey);

    if (!session || new Date(session.expires_at) < new Date()) {
      return c.json({ error: 'Invalid or expired session' }, 401);
    }

    const savedDeals = await kv.getByPrefix(`saved_deal:${session.user_id}:`);
    return c.json({ success: true, saved_deals: savedDeals });
  } catch (err) {
    console.error('Error fetching saved deals:', err);
    return c.json({ error: 'Failed to fetch saved deals' }, 500);
  }
});

// Save a deal
app.post("/make-server-4f34ef25/saved-deals", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const sessionKey = `session:${accessToken}`;
    const session = await kv.get(sessionKey);

    if (!session || new Date(session.expires_at) < new Date()) {
      return c.json({ error: 'Invalid or expired session' }, 401);
    }

    const { deal_id, deal_title, deal_image, deal_discount, deal_store, deal_url } = await c.req.json();

    const savedDeal = {
      id: crypto.randomUUID(),
      user_id: session.user_id,
      deal_id,
      deal_title,
      deal_image,
      deal_discount,
      deal_store,
      deal_url,
      created_at: new Date().toISOString(),
    };

    const dealKey = `saved_deal:${session.user_id}:${deal_id}`;
    await kv.set(dealKey, savedDeal);

    return c.json({ success: true, saved_deal: savedDeal });
  } catch (err) {
    console.error('Error saving deal:', err);
    return c.json({ error: 'Failed to save deal' }, 500);
  }
});

// Delete a saved deal
app.delete("/make-server-4f34ef25/saved-deals/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const sessionKey = `session:${accessToken}`;
    const session = await kv.get(sessionKey);

    if (!session || new Date(session.expires_at) < new Date()) {
      return c.json({ error: 'Invalid or expired session' }, 401);
    }

    const dealId = c.req.param('id');
    const dealKey = `saved_deal:${session.user_id}:${dealId}`;

    const deal = await kv.get(dealKey);
    if (!deal) {
      return c.json({ error: 'Deal not found' }, 404);
    }

    await kv.del(dealKey);
    return c.json({ success: true });
  } catch (err) {
    console.error('Error deleting saved deal:', err);
    return c.json({ error: 'Failed to delete saved deal' }, 500);
  }
});

// Saved Stores Routes

// Get all saved stores for authenticated user
app.get("/make-server-4f34ef25/saved-stores", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const sessionKey = `session:${accessToken}`;
    const session = await kv.get(sessionKey);

    if (!session || new Date(session.expires_at) < new Date()) {
      return c.json({ error: 'Invalid or expired session' }, 401);
    }

    const savedStores = await kv.getByPrefix(`saved_store:${session.user_id}:`);
    return c.json({ success: true, saved_stores: savedStores });
  } catch (err) {
    console.error('Error fetching saved stores:', err);
    return c.json({ error: 'Failed to fetch saved stores' }, 500);
  }
});

// Save a store
app.post("/make-server-4f34ef25/saved-stores", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const sessionKey = `session:${accessToken}`;
    const session = await kv.get(sessionKey);

    if (!session || new Date(session.expires_at) < new Date()) {
      return c.json({ error: 'Invalid or expired session' }, 401);
    }

    const { store_id, store_name, store_logo } = await c.req.json();

    const savedStore = {
      id: crypto.randomUUID(),
      user_id: session.user_id,
      store_id,
      store_name,
      store_logo,
      created_at: new Date().toISOString(),
    };

    const storeKey = `saved_store:${session.user_id}:${store_id}`;
    await kv.set(storeKey, savedStore);

    return c.json({ success: true, saved_store: savedStore });
  } catch (err) {
    console.error('Error saving store:', err);
    return c.json({ error: 'Failed to save store' }, 500);
  }
});

// Delete a saved store
app.delete("/make-server-4f34ef25/saved-stores/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const sessionKey = `session:${accessToken}`;
    const session = await kv.get(sessionKey);

    if (!session || new Date(session.expires_at) < new Date()) {
      return c.json({ error: 'Invalid or expired session' }, 401);
    }

    const storeId = c.req.param('id');
    const storeKey = `saved_store:${session.user_id}:${storeId}`;

    const store = await kv.get(storeKey);
    if (!store) {
      return c.json({ error: 'Store not found' }, 404);
    }

    await kv.del(storeKey);
    return c.json({ success: true });
  } catch (err) {
    console.error('Error deleting saved store:', err);
    return c.json({ error: 'Failed to delete saved store' }, 500);
  }
});

// Scrape product data from URL
app.post("/make-server-4f34ef25/scrape-product", async (c) => {
  console.log('🔵 /scrape-product endpoint hit');
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Verify session
    const sessionKey = `session:${accessToken}`;
    const session = await kv.get(sessionKey);
    if (!session) {
      return c.json({ error: 'Invalid session' }, 401);
    }

    const body = await c.req.json();
    const { url } = body;

    if (!url) {
      return c.json({ error: 'URL is required' }, 400);
    }

    console.log('📦 Scraping product from URL:', url);

    // Use the scraping API
    const scrapingApiUrl = Deno.env.get('EXPO_PUBLIC_SCRAPING_API_URL');
    if (!scrapingApiUrl) {
      console.error('❌ EXPO_PUBLIC_SCRAPING_API_URL not configured');
      return c.json({ 
        error: 'Product scraping service not configured',
        success: false 
      }, 500);
    }

    const scrapingResponse = await fetch(scrapingApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!scrapingResponse.ok) {
      console.error('❌ Scraping API error:', scrapingResponse.status);
      const errorText = await scrapingResponse.text();
      console.error('Error details:', errorText);
      return c.json({ 
        error: 'Failed to scrape product data',
        success: false 
      }, 400);
    }

    const scrapedData = await scrapingResponse.json();
    console.log('✅ Product data scraped:', scrapedData);

    // Extract and format the data
    const productData = {
      title: scrapedData.title || scrapedData.name || 'Unknown Product',
      image: scrapedData.image || scrapedData.imageUrl || scrapedData.thumbnail || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      price: parseFloat(scrapedData.price || scrapedData.currentPrice || 0),
    };

    return c.json({
      success: true,
      product: productData,
    });
  } catch (err) {
    console.error('❌ Error in scrape-product endpoint:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Unknown error',
      success: false 
    }, 500);
  }
});

Deno.serve(app.fetch);