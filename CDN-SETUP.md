
# TUUT Sitemap CDN Setup Instructions

## Prerequisites
- GitHub account with access to tuut-shop organization
- Git installed and configured

## Step 1: Create GitHub Repository
1. Go to https://github.com/organizations/tuut-shop/repositories/new
2. Repository name: `tuut-sitemap`
3. Description: `TUUT Shop Sitemap XML for SEO`
4. Make it **Public** (required for GitHub Pages)
5. Initialize with a README (optional)
6. Click "Create repository"

## Step 2: Enable GitHub Pages
1. In the new repository, go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: main, folder: /root
4. Click Save

## Step 5: Test the setup
Run: `npm run generate-sitemap`

## What this does
- The sitemap will be automatically uploaded to `https://tuut-shop.github.io/sitemap/sitemap.xml`
- Your Next.js app at `https://tuut.shop/sitemap.xml` will proxy this CDN URL
- This provides fast, reliable sitemap delivery without bloating your main repository

## Automatic Updates
The sitemap will be automatically updated whenever you run:
`npm run generate-sitemap`

You can also set up a GitHub Action or cron job to regenerate it regularly.
