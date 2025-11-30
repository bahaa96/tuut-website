import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

// CDN configuration
const CDN_CONFIG = {
  // Primary CDN - GitHub Pages
  primary: 'https://tuut-shop.github.io/tuut-sitemap/sitemap.xml',
  // Fallback CDN - GitHub Gist (will be updated after sitemap generation)
  fallback: null
};

async function fetchFromCDN(url: string): Promise<Response | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TUUT-Sitemap-Proxy/1.0'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.warn(`CDN response not OK: ${response.status} ${response.statusText}`);
      return null;
    }

    return response;
  } catch (error) {
    console.warn(`Failed to fetch from CDN: ${url}`, error);
    return null;
  }
}

async function getFallbackCDNUrl(): Promise<string | null> {
  try {
    const fs = require('fs');
    const path = require('path');
    const cdnConfigPath = path.join(process.cwd(), 'sitemap-cdn-config.json');

    if (fs.existsSync(cdnConfigPath)) {
      const config = JSON.parse(fs.readFileSync(cdnConfigPath, 'utf8'));
      return config.cdnUrl;
    }
  } catch (error) {
    console.warn('Could not read CDN config:', error);
  }

  return null;
}

export async function GET() {
  // Try primary CDN first
  let cdnResponse = await fetchFromCDN(CDN_CONFIG.primary);

  if (cdnResponse) {
    const content = await cdnResponse.text();
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // Try fallback CDN if available
  const fallbackUrl = await getFallbackCDNUrl();
  if (fallbackUrl) {
    cdnResponse = await fetchFromCDN(fallbackUrl);

    if (cdnResponse) {
      const content = await cdnResponse.text();
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }

  // Fallback to local file if CDN fails
  try {
    const fs = require('fs');
    const path = require('path');
    const localSitemapPath = path.join(process.cwd(), 'public/sitemap.xml');

    if (fs.existsSync(localSitemapPath)) {
      const content = fs.readFileSync(localSitemapPath, 'utf8');
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=1800, s-maxage=1800', // Shorter cache for fallback
          'Access-Control-Allow-Origin': '*',
          'X-Sitemap-Source': 'local-fallback'
        }
      });
    }
  } catch (error) {
    console.error('Failed to read local sitemap:', error);
  }

  // If all else fails, return a basic sitemap
  const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tuut.shop/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

  return new NextResponse(basicSitemap, {
    status: 503, // Service Unavailable
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*',
      'X-Sitemap-Source': 'emergency-fallback'
    }
  });
}