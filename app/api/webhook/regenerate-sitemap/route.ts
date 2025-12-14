import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { google } from 'googleapis';

const execAsync = promisify(exec);

// Environment variables
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tuut.shop';

// Verify required environment variables
function validateEnvironment() {
  const missing = [];
  if (!VERCEL_TOKEN) missing.push('VERCEL_TOKEN');
  if (!VERCEL_PROJECT_ID) missing.push('VERCEL_PROJECT_ID');
  if (!GOOGLE_CLIENT_EMAIL) missing.push('GOOGLE_CLIENT_EMAIL');
  if (!GOOGLE_PRIVATE_KEY) missing.push('GOOGLE_PRIVATE_KEY');

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

// Trigger Vercel deployment
async function triggerDeployment() {
  console.log('🚀 Triggering Vercel deployment...');

  const url = `https://api.vercel.com/v1/deployments${VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ''}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: VERCEL_PROJECT_ID,
      project: VERCEL_PROJECT_ID,
      target: 'production',
      gitSource: {
        type: 'github',
        repo: process.env.VERCEL_GITHUB_REPO || 'your-username/tuut-website',
        ref: 'main',
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to trigger deployment: ${error}`);
  }

  const deployment = await response.json();
  console.log(`✅ Deployment triggered: ${deployment.url}`);
  return deployment;
}

// Submit sitemap to Google Search Console
async function submitSitemapToGoogle() {
  console.log('📡 Submitting sitemap to Google Search Console...');

  try {
    // Create JWT client for Google API authentication
    const jwtClient = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      undefined,
      GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/webmasters'],
      undefined
    );

    // Create Search Console client
    const searchconsole = google.searchconsole({ version: 'v1', auth: jwtClient });

    // Submit the sitemap
    const sitemapUrl = `${SITE_URL}/sitemap.xml`;

    await searchconsole.sitemaps.submit({
      siteUrl: SITE_URL,
      feedpath: '/sitemap.xml',
    });

    console.log(`✅ Sitemap submitted to Google: ${sitemapUrl}`);
    return { success: true, url: sitemapUrl };
  } catch (error) {
    console.error('❌ Failed to submit sitemap to Google:', error);
    throw error;
  }
}

// Main webhook handler
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Get API key from Authorization header or query parameter
    const authHeader = request.headers.get('authorization');
    const queryKey = request.nextUrl.searchParams.get('key');
    const apiKey = authHeader?.replace('Bearer ', '') || queryKey;

    // Validate API key
    const expectedKey = process.env.SITEMAP_WEBHOOK_SECRET;
    if (!expectedKey || apiKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      );
    }

    console.log('🎯 Webhook triggered successfully');

    // Validate environment
    validateEnvironment();

    // Step 1: Generate new sitemap
    console.log('📝 Step 1: Generating sitemap...');
    const { stdout: sitemapOutput, stderr: sitemapError } = await execAsync('npm run generate-sitemap', {
      cwd: process.cwd(),
      timeout: 300000, // 5 minutes timeout
    });

    if (sitemapError) {
      console.error('Sitemap generation error:', sitemapError);
    }
    console.log('Sitemap output:', sitemapOutput);

    // Step 2: Trigger deployment
    console.log('📦 Step 2: Triggering deployment...');
    const deployment = await triggerDeployment();

    // Step 3: Submit to Google Search Console
    console.log('🔍 Step 3: Submitting to Google Search Console...');
    const googleSubmission = await submitSitemapToGoogle();

    const duration = Math.round((Date.now() - startTime) / 1000);

    const response = {
      success: true,
      message: 'Sitemap regenerated and deployed successfully',
      duration: `${duration} seconds`,
      steps: {
        sitemap: '✅ Generated',
        deployment: '✅ Triggered',
        google: '✅ Submitted'
      },
      deployment: {
        url: deployment.url,
        status: deployment.readyState,
      },
      google: googleSubmission,
      timestamp: new Date().toISOString(),
    };

    console.log('✅ All steps completed successfully');
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Webhook failed:', error);

    const duration = Math.round((Date.now() - startTime) / 1000);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: `${duration} seconds`,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({
    message: 'Sitemap regeneration webhook',
    usage: {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_WEBHOOK_SECRET',
      },
      or: {
        query: '?key=YOUR_WEBHOOK_SECRET',
      },
    },
  });
}