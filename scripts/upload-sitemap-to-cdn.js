#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Uploading sitemap to CDN...');

const sitemapCdnDir = path.join(__dirname, '../sitemap-cdn');
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');

// Check if sitemap exists
if (!fs.existsSync(sitemapPath)) {
  console.error('❌ Sitemap not found. Run: npm run generate-sitemap');
  process.exit(1);
}

try {
  // Copy sitemap to CDN directory
  console.log('📝 Copying sitemap to CDN directory...');
  const cdnSitemapPath = path.join(sitemapCdnDir, 'sitemap.xml');
  fs.copyFileSync(sitemapPath, cdnSitemapPath);

  // Change to CDN directory
  process.chdir(sitemapCdnDir);

  // Configure git if not configured
  try {
    execSync('git config user.name', { stdio: 'ignore' });
  } catch (e) {
    console.log('⚙️  Configuring git user...');
    execSync('git config user.name "TUUT Bot"', { stdio: 'ignore' });
    execSync('git config user.email "bot@tuut.shop"', { stdio: 'ignore' });
  }

  // Add and commit
  console.log('📋 Adding sitemap to git...');
  execSync('git add sitemap.xml', { stdio: 'ignore' });

  try {
    execSync('git commit -m "Update sitemap - $(date \'+%Y-%m-%d %H:%M:%S\')"', { stdio: 'ignore' });
  } catch (commitError) {
    if (commitError.message.includes('nothing to commit')) {
      console.log('ℹ️  No changes to commit');
    } else {
      throw commitError;
    }
  }

  // Push to remote
  console.log('📤 Pushing to GitHub...');
  try {
    execSync('git push -u origin main', { stdio: 'inherit' });
  } catch (pushError) {
    // Try with --force if remote has different history
    console.log('⚠️  Push failed, trying with force...');
    execSync('git push -uf origin main', { stdio: 'inherit' });
  }

  console.log('✅ Sitemap uploaded to CDN successfully!');
  console.log('📍 Available at: https://tuut-shop.github.io/tuut-sitemap/sitemap.xml');
  console.log('🌐 Accessible via: https://tuut.shop/sitemap.xml');

} catch (error) {
  console.error('❌ Failed to upload to CDN:', error.message);
  console.log('💡 Make sure you have SSH keys set up for GitHub');
  console.log('   or run: ssh -T git@github.com');
  process.exit(1);
}