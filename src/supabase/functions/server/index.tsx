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

    // Build the query with proper joins
    // The featured_deals table has a deal_id foreign key
    let query = supabase
      .from('featured_deals')
      .select(`
        *,
        deals:deal_id (
          *,
          stores:store_id (*)
        )
      `)
      .eq('is_active', true);

    query = query.order('sort_order', { ascending: true });

    const { data, error } = await query;
    
    if (data && data.length > 0) {
      console.log('First featured deal item:', JSON.stringify(data[0], null, 2));
    }
    
    // If country is provided, filter the results after fetching
    let filteredData = data;
    if (countryValue && data) {
      // First, get the country ID from the value
      const { data: countryData, error: countryError } = await supabase
        .from('countries')
        .select('id')
        .eq('value', countryValue)
        .single();

      if (countryError) {
        console.error('Error fetching country:', countryError);
      } else if (countryData) {
        console.log('Country ID:', countryData.id);
        // Filter deals by country in memory
        filteredData = data.filter((item: any) => {
          const deal = item.deals;
          // Check if deal has country_id or store has country_id
          return deal?.country_id === countryData.id || 
                 deal?.stores?.country_id === countryData.id ||
                 !deal?.country_id; // Include deals without country restriction
        });
        console.log(`Filtered from ${data.length} to ${filteredData.length} deals for country ${countryValue}`);
      }
    }

    if (error) {
      console.error('Error fetching featured deals:', error);
      return c.json({ 
        error: error.message,
        details: error,
      }, 500);
    }

    console.log(`Fetched ${data?.length || 0} featured deals, returning ${filteredData?.length || 0} after country filter`);

    return c.json({
      success: true,
      deals: filteredData,
      country: countryValue,
    });
  } catch (err) {
    console.error('Error in featured-deals endpoint:', err);
    return c.json({ 
      error: err instanceof Error ? err.message : 'Unknown error',
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
      query = query.or(`name.ilike.%${search}%,store_name.ilike.%${search}%,title.ilike.%${search}%,description.ilike.%${search}%`);
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