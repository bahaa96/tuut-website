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
        message: 'No search query provided'
      });
    }

    console.log('Global search for:', query, 'country:', countryValue);

    // Get country ID if country is provided
    let countryId = null;
    if (countryValue) {
      const { data: countryData } = await supabase
        .from('countries')
        .select('id')
        .eq('value', countryValue)
        .single();

      if (countryData) {
        countryId = countryData.id;
      }
    }

    // Search stores
    let storesQuery = supabase
      .from('stores')
      .select('*')
      .or(`store_name.ilike.%${query}%,title.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(10);

    if (countryId) {
      storesQuery = storesQuery.eq('country_id', countryId);
    }

    const { data: storesData, error: storesError } = await storesQuery;

    // Search deals
    let dealsQuery = supabase
      .from('deals')
      .select('*, stores!deals_store_id_fkey(*)')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,coupon_code.ilike.%${query}%`)
      .limit(10);

    if (countryId) {
      dealsQuery = dealsQuery.eq('country_id', countryId);
    }

    const { data: dealsData, error: dealsError } = await dealsQuery;

    // Search products
    let productsQuery = supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,name_ar.ilike.%${query}%,description.ilike.%${query}%,description_ar.ilike.%${query}%`)
      .limit(10);

    if (countryId) {
      productsQuery = productsQuery.eq('country_id', countryId);
    }

    const { data: productsData, error: productsError } = await productsQuery;

    // Search articles (shopping guides)
    let articlesQuery = supabase
      .from('articles')
      .select('*')
      .or(`title.ilike.%${query}%,title_ar.ilike.%${query}%,excerpt.ilike.%${query}%,excerpt_ar.ilike.%${query}%`)
      .limit(10);

    if (countryId) {
      articlesQuery = articlesQuery.eq('country_id', countryId);
    }

    const { data: articlesData, error: articlesError } = await articlesQuery;

    if (storesError) console.error('Error searching stores:', storesError);
    if (dealsError) console.error('Error searching deals:', dealsError);
    if (productsError) console.error('Error searching products:', productsError);
    if (articlesError) console.error('Error searching articles:', articlesError);

    const totalResults = (storesData?.length || 0) + (dealsData?.length || 0) + 
                        (productsData?.length || 0) + (articlesData?.length || 0);

    console.log(`Found ${totalResults} total results for query: ${query}`);

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

Deno.serve(app.fetch);