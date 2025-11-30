import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    // Serve the gzipped sitemap directly
    const gzippedSitemapPath = path.join(process.cwd(), 'public/sitemap.xml.gz');

    // Check if gzipped version exists
    try {
      const gzippedContent = await fs.readFile(gzippedSitemapPath);

      return new NextResponse(gzippedContent, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Content-Encoding': 'gzip',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
          'Access-Control-Allow-Origin': '*',
          'X-Sitemap-Source': 'local-gzipped'
        }
      });
    } catch (gzipError) {
      console.warn('Gzipped sitemap not found, falling back to XML:', gzipError);

      // Fallback to regular XML sitemap
      const xmlSitemapPath = path.join(process.cwd(), 'public/sitemap.xml');
      const xmlContent = await fs.readFile(xmlSitemapPath, 'utf8');

      return new NextResponse(xmlContent, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
          'Access-Control-Allow-Origin': '*',
          'X-Sitemap-Source': 'local-xml'
        }
      });
    }
  } catch (error) {
    console.error('Failed to serve sitemap:', error);

    // Emergency fallback - basic sitemap
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
      status: 503,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
        'X-Sitemap-Source': 'emergency-fallback'
      }
    });
  }
}