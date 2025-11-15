import { Hono } from 'hono'
import { renderToString } from 'react-dom/server'
import { readFile, stat } from 'fs/promises'
import { extname } from 'path'
import App from './src/App'
import { LanguageProvider } from './src/contexts/LanguageContext'
import { CountryProvider } from './src/contexts/CountryContext'
import { AuthProvider } from './src/contexts/AuthContext'
import { SSRDataProvider, setGlobalSSRData } from './src/contexts/SSRDataContext'
import { RouterProvider } from './src/router'
import { getPageForPath } from './src/utils/ssr-routing'
import { Header } from './src/components/Header'
import { Footer } from './src/components/Footer'
import { projectId, publicAnonKey } from './src/utils/supabase/info'

const app = new Hono()

// Custom static file handler
const mimeTypes = {
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json'
}

// Serve static files
app.get('/assets/*', async (c) => {
  const filePath = c.req.path
  const localPath = `./build${filePath}`

  try {
    const fileStats = await stat(localPath)
    if (!fileStats.isFile()) {
      return c.notFound()
    }

    const content = await readFile(localPath)
    const ext = extname(filePath)
    const mimeType = mimeTypes[ext] || 'application/octet-stream'

    return c.body(content, 200, {
      'Content-Type': mimeType,
      'Cache-Control': 'public, max-age=31536000' // 1 year
    })
  } catch (error) {
    return c.notFound()
  }
})

// Serve favicon and other static files
const staticFiles = ['favicon.svg', 'favicon-32x32.png', 'favicon-16x16.png', 'apple-touch-icon.png', 'site.webmanifest']
staticFiles.forEach(file => {
  app.get(`/${file}`, async (c) => {
    try {
      const content = await readFile(`./build/${file}`)
      const ext = extname(file)
      const mimeType = mimeTypes[ext] || 'application/octet-stream'

      return c.body(content, 200, {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000'
      })
    } catch (error) {
      return c.notFound()
    }
  })
})

// Mock data fetching functions (replace with your actual API calls)
async function fetchStoresData() {
  try {
    // Fetch stores from Supabase directly
    const { createClient } = await import('./src/utils/supabase/client.js')
    const supabase = createClient()

    let storesQuery = supabase
      .from('stores')
      .select('*')
      .limit(50); // Get more stores for the stores page

    const { data: storesData, error } = await storesQuery;

    if (error) {
      console.error('Error fetching stores data:', error);
      return [];
    }

    return storesData || [];
  } catch (error) {
    console.error('Error in fetchStoresData:', error);
    return [];
  }
}

async function fetchDealsData() {
  try {
    // Fetch deals from Supabase directly
    const { createClient } = await import('./src/utils/supabase/client.js')
    const supabase = createClient()

    const { data: dealsData, error } = await supabase
      .from('deals')
      .select('*')
      .limit(50)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching deals data:', error);
      return { deals: [], total: 0 };
    }

    return { deals: dealsData || [], total: dealsData?.length || 0 };
  } catch (error) {
    console.error('Error in fetchDealsData:', error);
    return { deals: [], total: 0 };
  }
}

async function fetchProductsData() {
  try {
    // Fetch products from Supabase directly
    const { createClient } = await import('./src/utils/supabase/client.js')
    const supabase = createClient()

    const { data: productsData, error } = await supabase
      .from('products')
      .select('*')
      .limit(50)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products data:', error);
      return [];
    }

    return productsData || [];
  } catch (error) {
    console.error('Error in fetchProductsData:', error);
    return [];
  }
}

async function fetchGuidesData() {
  try {
    // Fetch guides/articles from Supabase directly
    const { createClient } = await import('./src/utils/supabase/client.js')
    const supabase = createClient()

    const { data: guidesData, error } = await supabase
      .from('articles')
      .select('*')
      .limit(50)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching guides data:', error);
      return [];
    }

    return guidesData || [];
  } catch (error) {
    console.error('Error in fetchGuidesData:', error);
    return [];
  }
}

async function fetchProductData(slug: string) {
  // Mock product data - replace with your actual API calls
  const products = {
    "samsung-galaxy-s24": {
      id: 1,
      title: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24",
      description: "Samsung Galaxy S24 Ultra with 256GB storage, 200MP camera, S Pen included. Features a stunning 6.8-inch Dynamic AMOLED display and powerful Snapdragon processor.",
      price: 599.99,
      original_price: 1199.99,
      currency: "USD",
      store: "Amazon",
      available: true,
      images: [
        "https://via.placeholder.com/600x600",
        "https://via.placeholder.com/600x600/alt"
      ],
      rating: 4.5,
      ratings_count: 2847,
      sku: "B0CJHJFQ2B",
      features: ["256GB Storage", "200MP Camera", "S Pen Included", "6.8\" Display"]
    }
  }
  return products[slug as keyof typeof products] || null
}

async function fetchFooterData(country?: string) {
  try {
    // Fetch featured deals from Supabase Edge Function
    const dealsResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/featured-deals${country ? `?country=${country}` : ''}`,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      }
    );

    let featuredDeals = [];
    if (dealsResponse.ok) {
      const dealsData = await dealsResponse.json();
      // Extract the actual deal data from the nested structure
      featuredDeals = (dealsData.deals || []).map(item => item.deals).filter(Boolean).slice(0, 5);
    }

    // Fetch stores from Supabase directly
    const { createClient } = await import('./src/utils/supabase/client.js')
    const supabase = createClient()

    let storesQuery = supabase
      .from('stores')
      .select('*')
      .limit(20);

    // Apply country filter if provided
    if (country) {
      const { data: countryData } = await supabase
        .from('countries')
        .select('id')
        .eq('value', country)
        .single();

      if (countryData) {
        storesQuery = storesQuery.eq('country_id', countryData.id);
      }
    }

    const { data: storesData } = await storesQuery;
    const topStores = (storesData || []).slice(0, 10);

    // Fetch categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .limit(10);

    const categories = categoriesData || [];

    // Fetch guides/articles
    const { data: guidesData } = await supabase
      .from('articles')
      .select('*')
      .limit(5);

    const guides = guidesData || [];

    return {
      featuredDeals,
      topStores,
      categories,
      guides
    };
  } catch (error) {
    console.warn('⚠️ Could not fetch footer data:', error.message);
    return {
      featuredDeals: [],
      topStores: [],
      categories: [],
      guides: []
    };
  }
}

async function fetchDealData(slug: string) {
  try {
    // Fetch from Supabase
    const { createClient } = await import('./src/utils/supabase/client.js')
    const supabase = createClient()

    // Fetch deal details
    const { data: dealData, error: dealError } = await supabase
      .from('deals')
      .select('*')
      .eq('slug', slug)
      .single()

    if (dealError) throw dealError
    if (!dealData) return null

    // Fetch store details if store_id exists
    let storeData = null
    if (dealData.store_id) {
      const { data: store } = await supabase
        .from('stores')
        .select('*')
        .eq('id', dealData.store_id)
        .single()
      storeData = store
    }

    // Fetch related deals from the same store
    let relatedDeals = []
    if (dealData.store_id) {
      const { data: related } = await supabase
        .from('deals')
        .select('*')
        .eq('store_id', dealData.store_id)
        .neq('slug', slug)
        .limit(4)

      if (related) {
        relatedDeals = related.map(deal => ({
          ...deal,
          store_name: storeData?.title || dealData.store_name,
          store_name_ar: storeData?.title_ar || dealData.store_name_ar,
          store_logo: storeData?.profile_picture_url || dealData.store_logo,
        }))
      }
    }

    // Return comprehensive deal data
    return {
      ...dealData,
      store: storeData,
      related_deals: relatedDeals
    }
  } catch (error) {
    console.warn(`⚠️ Could not fetch deal "${slug}" from Supabase:`, error.message)
    return null
  }
}

async function fetchStoreData(slug: string) {
  try {
    // Fetch from Supabase
    const { createClient } = await import('./src/utils/supabase/client.js')
    const supabase = createClient()

    // Helper function to check if a string is a UUID
    const isUUID = (str: string): boolean => {
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidPattern.test(str);
    }

    let storeData = null

    // Try to fetch store by slug first, then by ID (UUID)
    if (isUUID(slug)) {
      // Fetch by ID (UUID)
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('id', slug)
        .single()

      if (!storeError && store) {
        storeData = store
      }
    } else {
      // Fetch by slug
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', slug)
        .single()

      if (!storeError && store) {
        storeData = store
      }
    }

    // If still not found, try to match by generated slug from store name
    if (!storeData) {
      const { data: allStores } = await supabase
        .from('stores')
        .select('id, title, title_ar, slug')

      if (allStores) {
        const matchedStore = allStores.find(store => {
          const storeName = store.title || store.title_ar || ''
          const generatedSlug = storeName
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
          return generatedSlug === slug || store.id === slug
        })

        if (matchedStore) {
          const { data: finalStore } = await supabase
            .from('stores')
            .select('*')
            .eq('id', matchedStore.id)
            .single()
          storeData = finalStore
        }
      }
    }

    if (!storeData) {
      console.warn(`⚠️ Store "${slug}" not found in Supabase`)
      return null
    }

    // Fetch deals for this store
    const { data: storeDeals, error: dealsError } = await supabase
      .from('deals')
      .select('*')
      .eq('store_id', storeData.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (dealsError) {
      console.warn(`⚠️ Could not fetch deals for store "${slug}":`, dealsError.message)
    }

    // Return comprehensive store data
    return {
      ...storeData,
      deals: storeDeals || []
    }
  } catch (error) {
    console.warn(`⚠️ Could not fetch store "${slug}" from Supabase:`, error.message)
    return null
  }
}

// Generate SEO metadata based on route and data
function generateMetadata(route: string, data: any) {
  const baseMetadata = {
    charset: 'UTF-8',
    viewport: 'width=device-width, initial-scale=1.0',
    themeColor: '#5FB57A',
    robots: 'index, follow',
    googlebot: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    author: 'Tuut - Smart Deal Finder',
    publisher: 'Tuut',
    applicationName: 'Tuut',
    keywords: 'deals, discounts, coupons, savings, offers, shopping, e-commerce, best prices',
    language: 'en',
    rating: 'general',
    distribution: 'global',
    revisitAfter: '1 day',
    documentState: 'dynamic'
  }

  switch (true) {
    case route === '/':
      return {
        ...baseMetadata,
        title: 'Tuut - Smart Deal Finder | Save Up to 80% on Electronics, Fashion & More',
        description: 'Tuut is your ultimate deal finder platform. Discover verified coupons, flash sales, and exclusive discounts from 1000+ top retailers. Save big on electronics, fashion, home goods, travel, and more. Updated daily with AI-powered deal matching.',
        ogType: 'website',
        ogImage: '/og-image-home.jpg',
        siteName: 'Tuut',
        category: 'shopping,deals,savings',
        subject: 'Online Shopping Deals and Discounts'
      }

    case route === '/deals':
      return {
        ...baseMetadata,
        title: `Hot Deals & Flash Sales - ${data.total || 500}+ Active Offers | Tuut`,
        description: `Explore ${data.total || 500}+ verified deals and limited-time offers from top retailers. Tuut curates the best discounts on electronics, fashion, home goods, and more. Save up to 80% with AI-powered deal recommendations updated in real-time.`,
        ogType: 'website',
        ogImage: '/og-image-deals.jpg',
        siteName: 'Tuut',
        category: 'deals,shopping,savings,flash-sales',
        subject: 'Current Deals and Discount Offers'
      }

    case route.startsWith('/deal/'):
      const product = data?.product
      if (!product) {
        // No deal data available - return generic deal page metadata
        return {
          ...baseMetadata,
          title: 'Exclusive Deals & Discount Codes | Tuut Smart Deals',
          description: 'Find the best verified deals and discount codes from top retailers. Save money on your favorite brands with Tuut.',
          ogType: 'website',
          ogImage: '/og-image.jpg',
          siteName: 'Tuut',
          category: 'deals,shopping,savings,discounts',
          subject: 'Current Deals and Offers'
        }
      }

      const discount = product.original_price && product.price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : 0

      return {
        ...baseMetadata,
        title: `${product.title} - ${discount > 0 ? `${discount}% Off | ` : ''}Tuut`,
        description: product.description?.substring(0, 160) || `Get ${product.title} for $${product.price}${discount > 0 ? ` (${discount}% off)` : ''}. ${product.available ? 'In stock' : 'Out of stock'} at ${product.store}.`,
        ogType: 'product',
        ogImage: product.images?.[0] || '/product-placeholder.jpg',
        productPriceAmount: product.price,
        productPriceCurrency: product.currency || 'USD',
        productAvailability: product.available ? 'in stock' : 'out of stock',
        productBrand: product.store || '',
      }

    case route.startsWith('/store/'):
      return {
        ...baseMetadata,
        title: `Amazon Deals & Coupons - Tuut`,
        description: 'Find the latest Amazon deals, coupons, and discount codes. Save money on electronics, books, fashion, and more with verified Amazon offers.',
        ogType: 'website',
        ogImage: '/og-image-store.jpg',
      }

    default:
      return {
        ...baseMetadata,
        title: 'Tuut - Best Deals & Discounts',
        description: 'Discover the best deals and discounts from top stores. Save up to 80% today.',
        ogType: 'website',
      }
  }

  return baseMetadata
}

// Generate structured data (JSON-LD)
function generateStructuredData(route: string, data: any) {
  switch (true) {
    case route === '/deals':
      return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Hot Deals and Flash Sales on Tuut',
        description: 'Discover verified deals, discounts, and exclusive offers from 1000+ top retailers curated by Tuut AI',
        url: `https://tuut.com${route}`,
        provider: {
          '@type': 'Organization',
          name: 'Tuut',
          url: 'https://tuut.com',
          logo: 'https://tuut.com/logo.png',
          description: 'Tuut is the smart deal finder platform that helps shoppers save money with AI-powered deal recommendations and verified discount codes.',
          sameAs: [
            'https://facebook.com/tuutdeals',
            'https://twitter.com/tuutdeals',
            'https://instagram.com/tuutdeals'
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: 'support@tuut.com'
          }
        },
        mainEntity: {
          '@type': 'ItemList',
          name: 'Current Active Deals and Discounts',
          description: 'Hand-picked deals from verified retailers with significant savings',
          numberOfItems: data.total || 0,
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          itemListElement: data.deals?.slice(0, 10).map((deal: any, index: number) => ({
            '@type': 'Offer',
            position: index + 1,
            name: deal.title,
            description: deal.description,
            url: `https://tuut.com/deal/${deal.slug}`,
            price: deal.discounted_price,
            priceCurrency: 'USD',
            discount: deal.original_price ? `${Math.round(((deal.original_price - deal.discounted_price) / deal.original_price) * 100)}%` : undefined,
            availability: deal.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            validFrom: new Date().toISOString(),
            seller: {
              '@type': 'Organization',
              name: deal.store_name,
              url: `https://tuut.com/store/${deal.store_name?.toLowerCase() || 'unknown'}`
            },
            provider: {
              '@type': 'Organization',
              name: 'Tuut',
              url: 'https://tuut.com'
            }
          }))
        }
      }

    case route.startsWith('/deal/'):
      const deal = data?.product
      if (!deal) {
        // Generic structured data when no deal data is available
        return null
      }

      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: deal.title,
        description: deal.description,
        image: deal.image_url ? [deal.image_url] : [],
        brand: {
          '@type': 'Brand',
          name: deal.store_name || 'Tuut'
        },
        offers: {
          '@type': 'Offer',
          url: `https://tuut.com${route}`,
          priceCurrency: 'USD', // Deal prices are typically in the local currency
          price: deal.discounted_price || deal.original_price,
          availability: deal.available !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: deal.store_name || 'Tuut'
          },
          ...(deal.original_price && deal.discounted_price && {
            highPrice: deal.original_price,
            discount: Math.round(((deal.original_price - deal.discounted_price) / deal.original_price) * 100) + '%'
          })
        },
        // Deal items typically don't have ratings like products
        ...(deal.is_verified && {
          review: {
            '@type': 'Review',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: '5',
              bestRating: '5'
            },
            author: {
              '@type': 'Organization',
              name: 'Tuut Verification Team'
            }
          }
        })
      }

    case route === '/guides' || route === '/blog':
      return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Shopping Guides and Tips - Tuut',
        description: 'Expert shopping guides, tips, and insights to help you save more and shop smarter',
        url: `https://tuut.com${route}`,
        provider: {
          '@type': 'Organization',
          name: 'Tuut',
          url: 'https://tuut.com'
        },
        mainEntity: {
          '@type': 'ItemList',
          name: 'Shopping Guides',
          description: 'Expert tips and insights for smart shopping',
          numberOfItems: data.articles?.length || 0,
          itemListElement: data.articles?.slice(0, 10).map((article: any, index: number) => ({
            '@type': 'Article',
            position: index + 1,
            name: article.title || article.title_ar || 'Untitled Article',
            description: article.excerpt || article.excerpt_ar || '',
            url: `https://tuut.com/guides/${article.slug || article.id}`,
            datePublished: article.created_at,
            author: {
              '@type': 'Person',
              name: article.author || article.author_ar || 'Tuut Team'
            }
          })) || []
        }
      }

    default:
      return null
  }
}

// Main route handler
app.get('*', async (c) => {
  try {
    const url = new URL(c.req.url)
    const path = url.pathname

    // Fetch data based on route
    let data = {}
    try {
      // Always fetch footer data for all routes
      const urlSearchParams = url.searchParams
      const country = urlSearchParams.get('country') || undefined
      const footerData = await fetchFooterData(country)

      if (path === '/deals') {
        data = {
          ...(await fetchDealsData()),
          footer: footerData
        }
      } else if (path.startsWith('/deal/')) {
        const slug = path.split('/')[2]
        const dealData = await fetchDealData(slug)
        if (dealData) {
          data = {
            product: dealData,
            store: dealData.store,
            related_deals: dealData.related_deals,
            footer: footerData
          }
        } else {
          data = { footer: footerData }
        }
      } else if (path.startsWith('/store/')) {
        const slug = path.split('/')[2]
        const storeData = await fetchStoreData(slug)
        if (storeData) {
          data = {
            store: storeData,
            deals: storeData.deals || [],
            footer: footerData
          }
        } else {
          data = { footer: footerData }
        }
      } else if (path.startsWith('/product/')) {
        const slug = path.split('/')[2]
        data = {
          product: await fetchProductData(slug),
          footer: footerData
        }
      } else if (path === '/stores') {
        data = {
          stores: await fetchStoresData(),
          footer: footerData
        }
      } else if (path === '/products') {
        data = {
          products: await fetchProductsData(),
          footer: footerData
        }
      } else if (path === '/guides' || path === '/blog') {
        data = {
          articles: await fetchGuidesData(),
          footer: footerData
        }
      } else {
        // For all other routes, include footer data
        data = { footer: footerData }
      }
    } catch (error) {
      console.error('Error fetching route data:', error)
    }

    // Generate metadata
    const metadata = generateMetadata(path, data)
    const structuredData = generateStructuredData(path, data)

    // Set global SSR data for server-side component access
    setGlobalSSRData(data)

    // Render specific page component for no-JavaScript support using shared routing
    const PageComponent = getPageForPath(path)

    const pageContent = (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <PageComponent />
        </main>
        <Footer />
      </div>
    )

    // Render the page with data
    const appHtml = renderToString(
      <RouterProvider initialPath={path}>
        <LanguageProvider>
          <CountryProvider>
            <AuthProvider>
              <SSRDataProvider data={data}>
                {pageContent}
              </SSRDataProvider>
            </AuthProvider>
          </CountryProvider>
        </LanguageProvider>
      </RouterProvider>
    )

    // Generate complete HTML with comprehensive meta tags
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <!-- Basic Meta -->
          <meta charset="${metadata.charset}" />
          <meta name="viewport" content="${metadata.viewport}" />
          <title>${metadata.title}</title>
          <meta name="description" content="${metadata.description}" />
          <meta name="keywords" content="${metadata.keywords}" />
          <meta name="author" content="${metadata.author}" />
          <meta name="publisher" content="${metadata.publisher}" />
          <meta name="application-name" content="${metadata.applicationName}" />
          <meta name="language" content="${metadata.language}" />
          <meta name="rating" content="${metadata.rating}" />
          <meta name="distribution" content="${metadata.distribution}" />
          <meta name="revisit-after" content="${metadata.revisitAfter}" />
          <meta name="document-state" content="${metadata.documentState}" />

          <!-- Advanced SEO -->
          <meta name="robots" content="${metadata.robots}" />
          <meta name="googlebot" content="${metadata.googlebot}" />
          <meta name="theme-color" content="${metadata.themeColor}" />
          <meta name="msapplication-TileColor" content="${metadata.themeColor}" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Tuut" />

          <!-- Category and Subject -->
          ${metadata.category ? `<meta name="category" content="${metadata.category}" />` : ''}
          ${metadata.subject ? `<meta name="subject" content="${metadata.subject}" />` : ''}
          ${metadata.siteName ? `<meta name="site" content="${metadata.siteName}" />` : ''}

          <!-- Canonical and Alternate URLs -->
          <link rel="canonical" href="https://tuut.com${path}" />
          <link rel="alternate" hreflang="en" href="https://tuut.com${path}" />
          <link rel="alternate" hreflang="x-default" href="https://tuut.com${path}" />

          <!-- Open Graph / Facebook -->
          <meta property="og:title" content="${metadata.title}" />
          <meta property="og:description" content="${metadata.description}" />
          <meta property="og:type" content="${metadata.ogType}" />
          <meta property="og:url" content="https://tuut.com${path}" />
          <meta property="og:image" content="https://tuut.com${metadata.ogImage}" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="${metadata.title}" />
          <meta property="og:site_name" content="Tuut" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:locale:alternate" content="en_GB" />

          <!-- Twitter Card -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${metadata.title}" />
          <meta name="twitter:description" content="${metadata.description}" />
          <meta name="twitter:image" content="https://tuut.com${metadata.ogImage}" />
          <meta name="twitter:image:alt" content="${metadata.title}" />
          <meta name="twitter:site" content="@tuutdeals" />
          <meta name="twitter:creator" content="@tuutdeals" />
          <meta name="twitter:domain" content="tuut.com" />

          <!-- E-commerce Specific Meta -->
          ${metadata.productPriceAmount ? `
            <meta name="product:price:amount" content="${metadata.productPriceAmount}" />
            <meta name="product:price:currency" content="${metadata.productPriceCurrency}" />
            <meta name="product:availability" content="${metadata.productAvailability}" />
            <meta name="product:brand" content="${metadata.productBrand}" />
            <meta name="product:condition" content="${metadata.condition}" />
            <meta name="product:retailer_item_id" content="${metadata.sku}" />
            <meta property="product:price:amount" content="${metadata.productPriceAmount}" />
            <meta property="product:price:currency" content="${metadata.productPriceCurrency}" />
            <meta property="product:availability" content="${metadata.productAvailability}" />
            <meta property="product:brand" content="${metadata.productBrand}" />
            <meta property="product:condition" content="${metadata.condition}" />
            <meta property="product:retailer_item_id" content="${metadata.sku}" />
          ` : ''}

          <!-- Rich Snippets Validation -->
          <meta name="google-site-verification" content="your-google-verification-code" />
          <meta name="msvalidate.01" content="your-bing-verification-code" />
          <meta name="yandex-verification" content="your-yandex-verification-code" />

          <!-- Business Information -->
          <meta name="business:contact_data:street_address" content="123 Shopping Street" />
          <meta name="business:contact_data:locality" content="Cairo" />
          <meta name="business:contact_data:region" content="Cairo" />
          <meta name="business:contact_data:postal_code" content="12345" />
          <meta name="business:contact_data:country_name" content="Egypt" />
          <meta name="business:contact_data:email" content="support@tuut.com" />
          <meta name="business:contact_data:phone_number" content="+20 123 456 7890" />
          <meta name="business:contact_data:website" content="https://tuut.com" />

          <!-- Performance and CDN -->
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link rel="preconnect" href="https://api.tuut.com" />
          <link rel="dns-prefetch" href="//cdn.tuut.com" />
          <link rel="dns-prefetch" href="//analytics.tuut.com" />

          <!-- Critical CSS -->
          <style>
            /* Critical CSS for above-the-fold content */
            body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            #root { min-height: 100vh; }
          </style>

          <!-- Stylesheets -->
          <link rel="stylesheet" href="/assets/index-1UyPdu-j.css" />

          <!-- Icons and Manifest -->
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="${metadata.themeColor}" />

          <!-- Structured Data (JSON-LD) -->
          ${structuredData ? `
            <script type="application/ld+json">
            ${JSON.stringify(structuredData).replace(/</g, '\\u003c')}
            </script>
          ` : ''}

          <!-- Analytics (placeholder) -->
          <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          </script>
        </head>
        <body>
          <div id="root">${appHtml}</div>

          <!-- Built client bundle (PRODUCTION version) -->
          <script type="module" src="/assets/index-HlZX9iwz.js" defer></script>

          <!-- Initial data for client-side hydration -->
          <script>
            window.__INITIAL_DATA__ = ${JSON.stringify(data)};
            window.__TUUT_CONFIG__ = {
              apiEndpoint: 'https://api.tuut.com',
              version: '1.0.0',
              environment: 'production'
            };
          </script>

          <!-- Performance Monitoring (placeholder) -->
          <script>
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          </script>
        </body>
      </html>
    `

    // Set comprehensive SEO and performance headers
    c.header('Content-Type', 'text/html; charset=utf-8')
    c.header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400') // Cache for 1 hour, serve stale for 24h
    c.header('X-Content-Type-Options', 'nosniff')
    c.header('X-Frame-Options', 'SAMEORIGIN')
    c.header('X-XSS-Protection', '1; mode=block')
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
    c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()')
    c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload') // HTTPS only
    c.header('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.tuut.com https://analytics.google.com https://oluyzqunbbqaxalodhdg.supabase.co https://oluyzqunbbqaxalodhdg.supabase.co/rest/v1 https://oluyzqunbbqaxalodhdg.supabase.co/functions/v1; frame-src 'self' https://www.youtube.com")

    // SEO-specific headers
    c.header('X-Robots-Tag', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')
    c.header('X-UA-Compatible', 'IE=edge')

    // Performance headers
    c.header('Vary', 'Accept-Encoding, Accept-Language')
    c.header('Accept-Ranges', 'bytes')

    return c.html(html.trim())
  } catch (error) {
    console.error('SSR Error:', error)

    // Fallback error page
    return c.html(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Tuut - Error</title>
        </head>
        <body>
          <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
            <h1>Something went wrong</h1>
            <p>Please refresh the page or try again later.</p>
          </div>
        </body>
      </html>
    `, 500)
  }
})

// Vercel handler for production deployment
export default app

// For local development with hot reload via nodemon
const port = 3000

// Use a dedicated environment variable for development mode
const isDev = process.env.DEV_MODE === 'true' || (!process.env.VERCEL && process.env.NODE_ENV !== 'production')

// Only start the server if in development mode
if (isDev) {
  ;(async () => {
    try {
      const { serve } = await import('@hono/node-server')
      console.log(`🚀 SSR server running at http://localhost:${port}`)
      console.log('🔄 Hot reload enabled - modify any file to rebuild')

      serve({
        fetch: app.fetch,
        port
      })
    } catch (error) {
      console.error('❌ Failed to start server:', error)
      console.log('Falling back to direct export mode...')
    }
  })()
}