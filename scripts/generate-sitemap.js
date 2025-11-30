const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');
const zlib = require('zlib');

// Supabase configuration - you can update these if they change
const projectId = "oluyzqunbbqaxalodhdg";
const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sdXl6cXVuYmJxYXhhbG9kaGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTMwOTcsImV4cCI6MjA2MTAyOTA5N30.1SGmTzrAB4FLgPfOIP2DLP_ieNVqSQVtiBtjJ5eRJOM";

const SUPPORTED_LOCALES = [
  // English variants
  'en-EG', 'en-JO', 'en-SA', 'en-KW', 'en-MA', 'en-OM', 'en-QA', 'en-AE',
  // Arabic variants
  'ar-EG', 'ar-JO', 'ar-SA', 'ar-KW', 'ar-MA', 'ar-OM', 'ar-QA', 'ar-AE'
];

const BASE_URL = process.env.VITE_APP_URL || 'https://tuut.shop';

class SitemapGenerator {
  constructor() {
    this.supabase = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey
    );
    this.entries = [];
  }

  async uploadToCDN(xmlContent) {
    console.log('🚀 Uploading sitemap to CDN...');

    try {
      // Use the simple local repository approach
      console.log('📤 Using local sitemap-cdn repository...');
      execSync('node scripts/upload-sitemap-to-cdn.js', {
        stdio: 'inherit',
        timeout: 60000
      });
      return true;

    } catch (error) {
      console.error('❌ CDN upload failed:', error.message);
      console.log('🔄 Attempting fallback upload method...');
      return this.uploadToAlternativeCDN(xmlContent);
    }
  }

  async uploadToAlternativeCDN(xmlContent) {
    try {
      // Using jsdelivr.net as a CDN alternative
      // This creates a temporary GitHub Gist with the sitemap
      const postData = JSON.stringify({
        description: 'TUUT Shop Sitemap',
        public: true,
        files: {
          'sitemap.xml': {
            content: xmlContent
          }
        }
      });

      const response = await new Promise((resolve, reject) => {
        const req = https.request({
          hostname: 'api.github.com',
          port: 443,
          path: '/gists',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'User-Agent': 'TUUT-Sitemap-Generator'
          }
        }, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
      });

      if (response.html_url) {
        const rawUrl = response.files['sitemap.xml'].raw_url;
        console.log(`✅ Sitemap uploaded to alternative CDN!`);
        console.log(`📍 Raw URL: ${rawUrl}`);
        console.log(`🌐 This URL can be used for: https://tuut.shop/sitemap.xml`);

        // Save the CDN URL for reference
        const cdnConfigPath = path.join(__dirname, '../sitemap-cdn-config.json');
        fs.writeFileSync(cdnConfigPath, JSON.stringify({
          cdnUrl: rawUrl,
          timestamp: new Date().toISOString()
        }, null, 2));

        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Alternative CDN upload also failed:', error);
      return false;
    }
  }

  addEntry(url, options = {}) {
    const entry = {
      url,
      lastModified: options.lastModified || new Date().toISOString().split('T')[0],
      changeFrequency: options.changeFrequency || 'weekly',
      priority: options.priority || 0.7
    };
    this.entries.push(entry);
  }

  async getAllDeals() {
    console.log('🔄 Fetching all deals with pagination...');
    let allDeals = [];
    let page = 0;
    const pageSize = 1000;
    let hasMore = true;

    try {
      while (hasMore) {
        console.log(`📄 Fetching deals page ${page + 1}...`);

        const { data: deals, error, count } = await this.supabase
          .from('deals')
          .select('slug_en, slug_ar, country_slug, updated_at', { count: 'exact' })
          .range(page * pageSize, (page + 1) * pageSize - 1)
          .order('updated_at', { ascending: false });

        if (error) {
          console.error(`❌ Error fetching deals page ${page + 1}:`, error);
          break;
        }

        if (deals && deals.length > 0) {
          allDeals = allDeals.concat(deals);
          console.log(`✅ Fetched ${deals.length} deals (total: ${allDeals.length})`);
        }

        // If we got fewer results than page size, we're done
        hasMore = deals && deals.length === pageSize;
        page++;

        // Safety check to prevent infinite loops
        if (page > 100) {
          console.warn('⚠️  Safety limit reached, stopping pagination');
          break;
        }
      }

      // All deals are active
      console.log(`📊 Total deals found: ${allDeals.length}`);
      return allDeals;
    } catch (error) {
      console.error('❌ Error fetching deals:', error);
      return [];
    }
  }

  async getAllStores() {
    console.log('🔄 Fetching all stores with pagination...');
    let allStores = [];
    let page = 0;
    const pageSize = 1000;
    let hasMore = true;

    try {
      while (hasMore) {
        console.log(`📄 Fetching stores page ${page + 1}...`);

        const { data: stores, error } = await this.supabase
          .from('stores')
          .select('slug_en, slug_ar, country_slug, updated_at')
          .range(page * pageSize, (page + 1) * pageSize - 1)
          .order('updated_at', { ascending: false });

        if (error) {
          console.error(`❌ Error fetching stores page ${page + 1}:`, error);
          break;
        }

        if (stores && stores.length > 0) {
          allStores = allStores.concat(stores);
          console.log(`✅ Fetched ${stores.length} stores (total: ${allStores.length})`);
        }

        hasMore = stores && stores.length === pageSize;
        page++;

        if (page > 50) {
          console.warn('⚠️  Safety limit reached, stopping pagination');
          break;
        }
      }

      // All stores are active
      console.log(`📊 Total stores found: ${allStores.length}`);
      return allStores;
    } catch (error) {
      console.error('❌ Error fetching stores:', error);
      return [];
    }
  }

  async getAllProducts() {
    console.log('🔄 Fetching all products with pagination...');
    let allProducts = [];
    let page = 0;
    const pageSize = 500; // Smaller page size to avoid timeouts
    let hasMore = true;

    try {
      while (hasMore) {
        console.log(`📄 Fetching products page ${page + 1} (page size: ${pageSize})...`);

        // Add a timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Query timeout')), 30000); // 30 second timeout
        });

        const queryPromise = this.supabase
          .from('products')
          .select('slug, updated_at')
          .range(page * pageSize, (page + 1) * pageSize - 1)
          .order('updated_at', { ascending: false })
          .limit(pageSize);

        let products, error;
        try {
          const result = await Promise.race([queryPromise, timeoutPromise]);
          products = result.data;
          error = result.error;
        } catch (timeoutError) {
          console.error(`❌ Query timeout on page ${page + 1}:`, timeoutError);
          console.log(`📊 Using ${allProducts.length} products fetched so far and continuing...`);
          break;
        }

        if (error) {
          console.error(`❌ Error fetching products page ${page + 1}:`, error);
          console.log(`📊 Using ${allProducts.length} products fetched so far and continuing...`);
          break;
        }

        if (products && products.length > 0) {
          allProducts = allProducts.concat(products);
          console.log(`✅ Fetched ${products.length} products (total: ${allProducts.length})`);
        }

        hasMore = products && products.length === pageSize;
        page++;

        if (page > 100) { // Increased limit since we're using smaller pages
          console.warn('⚠️  Safety limit reached, stopping pagination');
          break;
        }

        // Small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`📊 Total products found: ${allProducts.length}`);
      return allProducts;
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      console.log(`📊 Using ${allProducts.length} products fetched so far...`);
      return allProducts; // Return what we have instead of empty array
    }
  }

  async getAllGuides() {
    console.log('🔄 Fetching all articles (guides) with pagination...');
    let allArticles = [];
    let page = 0;
    const pageSize = 1000;
    let hasMore = true;

    try {
      while (hasMore) {
        console.log(`📄 Fetching articles page ${page + 1}...`);

        const { data: articles, error } = await this.supabase
          .from('articles')
          .select('slug, updated_at, is_published')
          .range(page * pageSize, (page + 1) * pageSize - 1)
          .order('updated_at', { ascending: false });

        if (error) {
          console.error(`❌ Error fetching articles page ${page + 1}:`, error);
          break;
        }

        if (articles && articles.length > 0) {
          allArticles = allArticles.concat(articles);
          console.log(`✅ Fetched ${articles.length} articles (total: ${allArticles.length})`);
        }

        hasMore = articles && articles.length === pageSize;
        page++;

        if (page > 20) {
          console.warn('⚠️  Safety limit reached, stopping pagination');
          break;
        }
      }

      // Filter for published articles
      const publishedArticles = allArticles.filter(article =>
        article.is_published !== false
      );

      console.log(`📊 Total articles found: ${allArticles.length}, Published articles: ${publishedArticles.length}`);
      return publishedArticles;
    } catch (error) {
      console.error('❌ Error fetching articles:', error);
      return [];
    }
  }

  async getDynamicSlugs() {
    try {
      const deals = await this.getAllDeals();
      const stores = await this.getAllStores();
      const products = await this.getAllProducts();
      const guides = await this.getAllGuides();

      return {
        deals: deals,
        stores: stores,
        products: products,
        guides: guides
      };
    } catch (error) {
      console.error('❌ Error fetching dynamic slugs:', error);
      return { deals: [], stores: [], products: [], guides: [] };
    }
  }

  addStaticPages() {
    // Generate static routes for each locale
    for (const locale of SUPPORTED_LOCALES) {
      // Static pages with appropriate priorities and change frequencies
      this.addEntry(`${BASE_URL}/${locale}/`, {
        changeFrequency: 'daily',
        priority: 1.0
      });

      this.addEntry(`${BASE_URL}/${locale}/products/`, {
        changeFrequency: 'daily',
        priority: 0.9
      });

      this.addEntry(`${BASE_URL}/${locale}/shop/`, {
        changeFrequency: 'daily',
        priority: 0.9
      });

      this.addEntry(`${BASE_URL}/${locale}/stores/`, {
        changeFrequency: 'daily',
        priority: 0.8
      });

      this.addEntry(`${BASE_URL}/${locale}/deals/`, {
        changeFrequency: 'daily',
        priority: 0.8
      });

      this.addEntry(`${BASE_URL}/${locale}/guides/`, {
        changeFrequency: 'weekly',
        priority: 0.7
      });
    }
  }

  async addDynamicPages() {
    const { deals, stores, products, guides } = await this.getDynamicSlugs();

    // Store dynamic data for analysis
    this.dynamicData = {
      deals: deals,
      stores: stores,
      products: products,
      guides: guides
    };

    // Deal pages
    for (const deal of deals) {
      // Generate for both English and Arabic versions
      // English version - use en-{country_slug} format
      if (deal.slug_en) {
        this.addEntry(`${BASE_URL}/en-${deal.country_slug}/deal/${deal.slug_en}/`, {
          lastModified: deal.updated_at?.split('T')[0],
          changeFrequency: 'daily',
          priority: 0.6
        });
      }

      // Arabic version - use ar-{country_slug} format
      if (deal.slug_ar) {
        this.addEntry(`${BASE_URL}/ar-${deal.country_slug}/deal/${deal.slug_ar}/`, {
          lastModified: deal.updated_at?.split('T')[0],
          changeFrequency: 'daily',
          priority: 0.6
        });
      }
    }

    // Store pages
    for (const store of stores) {
      // Generate for both English and Arabic versions
      // English version - use en-{country_slug} format
      if (store.slug_en) {
        this.addEntry(`${BASE_URL}/en-${store.country_slug}/store/${store.slug_en}/`, {
          lastModified: store.updated_at?.split('T')[0],
          changeFrequency: 'weekly',
          priority: 0.6
        });
      }

      // Arabic version - use ar-{country_slug} format
      if (store.slug_ar) {
        this.addEntry(`${BASE_URL}/ar-${store.country_slug}/store/${store.slug_ar}/`, {
          lastModified: store.updated_at?.split('T')[0],
          changeFrequency: 'weekly',
          priority: 0.6
        });
      }
    }

    // Product pages
    for (const product of products) {
      // Generate product URLs for all supported locales since products don't have country-specific data
      for (const locale of SUPPORTED_LOCALES) {
        this.addEntry(`${BASE_URL}/${locale}/product/${product.slug}/`, {
          lastModified: product.updated_at?.split('T')[0],
          changeFrequency: 'weekly',
          priority: 0.5
        });
      }
    }

    // Guide pages (available in all locales)
    for (const guide of guides) {
      for (const locale of SUPPORTED_LOCALES) {
        this.addEntry(`${BASE_URL}/${locale}/guides/${guide.slug}/`, {
          lastModified: guide.updated_at?.split('T')[0],
          changeFrequency: 'monthly',
          priority: 0.5
        });
      }
    }
  }

  formatEntry(entry) {
    let xml = `  <url>\n`;
    xml += `    <loc>${entry.url}</loc>\n`;

    if (entry.lastModified) {
      xml += `    <lastmod>${entry.lastModified}</lastmod>\n`;
    }

    if (entry.changeFrequency) {
      xml += `    <changefreq>${entry.changeFrequency}</changefreq>\n`;
    }

    if (entry.priority !== undefined) {
      xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
    }

    xml += `  </url>\n`;
    return xml;
  }

  generateXML() {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const entry of this.entries) {
      xml += this.formatEntry(entry);
    }

    xml += `</urlset>\n`;
    return xml;
  }

  analyzeURLBreakdown() {
    console.log('\n📊 Detailed URL Breakdown Analysis:');
    console.log('=====================================');

    // Initialize counters
    const breakdown = {
      domains: {
        'tuut.shop': 0
      },
      countries: {},
      languages: {
        'en': 0,
        'ar': 0
      },
      types: {
        'static': 0,
        'deals': 0,
        'stores': 0,
        'products': 0,
        'guides': 0
      }
    };

    // Count by country from URL patterns
    const countryRegex = /\/([a-z]{2})-([a-z]{2})\//;

    for (const entry of this.entries) {
      const url = entry.url;

      // Domain counting (all should be tuut.shop)
      const domainMatch = url.match(/^https?:\/\/([^\/]+)/);
      if (domainMatch) {
        breakdown.domains[domainMatch[1]] = (breakdown.domains[domainMatch[1]] || 0) + 1;
      }

      // Country and language counting
      const localeMatch = url.match(countryRegex);
      if (localeMatch) {
        const lang = localeMatch[1];
        const country = localeMatch[2];

        breakdown.languages[lang] = (breakdown.languages[lang] || 0) + 1;
        breakdown.countries[country] = (breakdown.countries[country] || 0) + 1;
      }

      // Page type counting
      if (url.includes('/deal/')) {
        breakdown.types.deals++;
      } else if (url.includes('/store/')) {
        breakdown.types.stores++;
      } else if (url.includes('/product/')) {
        breakdown.types.products++;
      } else if (url.includes('/guides/')) {
        breakdown.types.guides++;
      } else {
        breakdown.types.static++;
      }
    }

    // Print domain breakdown
    console.log('\n🌐 By Domain:');
    for (const [domain, count] of Object.entries(breakdown.domains)) {
      const percentage = ((count / this.entries.length) * 100).toFixed(2);
      console.log(`   ${domain}: ${count.toLocaleString()} URLs (${percentage}%)`);
    }

    // Print country breakdown
    console.log('\n🌍 By Country:');
    const sortedCountries = Object.entries(breakdown.countries).sort((a, b) => b[1] - a[1]);
    for (const [country, count] of sortedCountries) {
      const percentage = ((count / this.entries.length) * 100).toFixed(2);
      console.log(`   ${country.toUpperCase()}: ${count.toLocaleString()} URLs (${percentage}%)`);
    }

    // Print language breakdown
    console.log('\n🗣️  By Language:');
    for (const [lang, count] of Object.entries(breakdown.languages)) {
      const percentage = ((count / this.entries.length) * 100).toFixed(2);
      const langName = lang === 'en' ? 'English' : 'Arabic';
      console.log(`   ${langName} (${lang}): ${count.toLocaleString()} URLs (${percentage}%)`);
    }

    // Print page type breakdown
    console.log('\n📄 By Page Type:');
    for (const [type, count] of Object.entries(breakdown.types)) {
      const percentage = ((count / this.entries.length) * 100).toFixed(2);
      console.log(`   ${type.charAt(0).toUpperCase() + type.slice(1)}: ${count.toLocaleString()} URLs (${percentage}%)`);
    }

    // Detailed analysis from dynamic data
    if (this.dynamicData) {
      console.log('\n🔍 Detailed Content Analysis:');
      console.log(`   • Total unique deals: ${this.dynamicData.deals.length.toLocaleString()}`);
      console.log(`   • Total unique stores: ${this.dynamicData.stores.length.toLocaleString()}`);
      console.log(`   • Total unique products: ${this.dynamicData.products.length.toLocaleString()}`);
      console.log(`   • Total unique guides: ${this.dynamicData.guides.length.toLocaleString()}`);

      // Country breakdown for deals
      const dealCountries = {};
      for (const deal of this.dynamicData.deals) {
        dealCountries[deal.country_slug] = (dealCountries[deal.country_slug] || 0) + 1;
      }
      if (Object.keys(dealCountries).length > 0) {
        console.log('\n   🛍️  Deals by Country:');
        const sortedDealCountries = Object.entries(dealCountries).sort((a, b) => b[1] - a[1]);
        for (const [country, count] of sortedDealCountries.slice(0, 10)) { // Top 10
          console.log(`      ${country.toUpperCase()}: ${count.toLocaleString()} deals`);
        }
        if (sortedDealCountries.length > 10) {
          console.log(`      ... and ${sortedDealCountries.length - 10} more countries`);
        }
      }

      // Country breakdown for stores
      const storeCountries = {};
      for (const store of this.dynamicData.stores) {
        storeCountries[store.country_slug] = (storeCountries[store.country_slug] || 0) + 1;
      }
      if (Object.keys(storeCountries).length > 0) {
        console.log('\n   🏪 Stores by Country:');
        const sortedStoreCountries = Object.entries(storeCountries).sort((a, b) => b[1] - a[1]);
        for (const [country, count] of sortedStoreCountries.slice(0, 10)) { // Top 10
          console.log(`      ${country.toUpperCase()}: ${count.toLocaleString()} stores`);
        }
        if (sortedStoreCountries.length > 10) {
          console.log(`      ... and ${sortedStoreCountries.length - 10} more countries`);
        }
      }
    }

    return breakdown;
  }

  async generate() {
    console.log('🚀 Starting sitemap generation...');

    console.log('📝 Adding static pages...');
    this.addStaticPages();

    console.log('🔍 Fetching dynamic content from Supabase...');
    await this.addDynamicPages();

    console.log('📄 Generating XML...');
    const xml = this.generateXML();

    // Write to public directory (regular XML)
    const outputPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(outputPath, xml);

    // Generate and write gzipped version
    console.log('🗜️  Generating gzipped sitemap...');
    const gzippedXml = zlib.gzipSync(xml, { level: 9 });
    const gzippedPath = path.join(__dirname, '../public/sitemap.xml.gz');
    fs.writeFileSync(gzippedPath, gzippedXml);

    // Get file sizes for comparison
    const xmlStats = fs.statSync(outputPath);
    const gzippedStats = fs.statSync(gzippedPath);
    const compressionRatio = ((1 - gzippedStats.size / xmlStats.size) * 100).toFixed(1);

    console.log(`✅ Sitemap generated successfully!`);
    console.log(`📍 Local location (XML): ${outputPath}`);
    console.log(`📍 Local location (GZIP): ${gzippedPath}`);
    console.log(`🔢 Total URLs: ${this.entries.length}`);
    console.log(`📊 File size (XML): ${(xmlStats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📊 File size (GZIP): ${(gzippedStats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`🗜️  Compression: ${compressionRatio}% smaller`);

    // Run detailed analysis
    this.analyzeURLBreakdown();

    // No longer uploading to CDN - serving directly from Vercel
    console.log('');
    console.log('✅ Sitemap generation complete!');
    console.log('🌐 The sitemap will be served directly from Vercel:');
    console.log('   • Regular sitemap: https://tuut.shop/sitemap.xml (rewrites to .gz version)');
    console.log('   • Direct gzipped: https://tuut.shop/sitemap.xml.gz');
    console.log('📦 Make sure to commit the .gz file to your repository');

    return xml;
  }
}

// Run the generator if this script is executed directly
if (require.main === module) {
  const generator = new SitemapGenerator();

  generator.generate()
    .then(() => {
      console.log('\n🎉 Sitemap generation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error generating sitemap:', error);
      process.exit(1);
    });
}

module.exports = SitemapGenerator;