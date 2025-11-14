# 🚀 Vercel Deployment Guide

This guide will help you deploy your Tuut website SSR application to Vercel.

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ Node.js (v18 or higher)
- ✅ npm installed
- ✅ Vercel account
- ✅ Git repository connected to Vercel (optional but recommended)
- ✅ Supabase project with credentials

## ⚙️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Fill in your actual values in `.env`:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_SUPABASE_URL` - Same as SUPABASE_URL (for client-side)
- `VITE_SUPABASE_ANON_KEY` - Same as SUPABASE_ANON_KEY (for client-side)

### 3. Set Up Vercel Environment Variables

**Option A: Using Vercel CLI**
```bash
vercel env pull
```

**Option B: Using Vercel Dashboard**
1. Go to your Vercel project dashboard
2. Click on "Settings" → "Environment Variables"
3. Add the following variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `NODE_ENV` (set to `production`)

## 🚀 Deployment Methods

### Method 1: Using the Deployment Script (Recommended)

The easiest way to deploy is using our automated deployment script:

#### Deploy to Preview (Staging)
```bash
./deploy.sh deploy
```

#### Deploy to Production
```bash
./deploy.sh deploy --prod
```

#### Other Commands
```bash
./deploy.sh test          # Test locally
./deploy.sh build         # Build only
./deploy.sh cleanup       # Clean build artifacts
./deploy.sh check         # Check prerequisites
./deploy.sh help          # Show help
```

### Method 2: Manual Deployment

#### Step 1: Build the Project
```bash
npm run build:all
```

#### Step 2: Deploy to Preview
```bash
vercel
```

#### Step 3: Deploy to Production
```bash
vercel --prod
```

## 📁 File Structure Overview

```
tuut-website/
├── deploy.sh              # 🚀 Deployment script
├── vercel.json           # ⚙️ Vercel configuration
├── .env.example          # 📝 Environment variables template
├── DEPLOYMENT.md         # 📖 This file
├── src/                  # 📁 Source code
├── build/                # 🏗️ Build output (generated)
└── .vercel/             # 🏠 Vercel files (generated)
```

## ⚙️ Configuration Details

### vercel.json Configuration

Our `vercel.json` is optimized for SSR deployment:

- **Build Command**: `npm run build:vercel`
- **Output Directory**: `build/`
- **Runtime**: Node.js 18.x
- **Max Duration**: 30 seconds (suitable for SSR)
- **Caching**: Optimized for static assets
- **Security Headers**: Built-in security headers

### Build Scripts

The project includes several build scripts:

- `build:client` - Build client-side assets
- `build:ssr` - Build server-side bundle
- `build:all` - Build both client and server
- `build:vercel` - Alias for build:all

## 🧪 Testing Before Deployment

### Local Testing
Test your build locally before deploying:

```bash
# Test the build process
./deploy.sh build

# Test locally in production mode
NODE_ENV=production node build/server.js
```

### Preview Deployment
Always deploy to preview first:

```bash
./deploy.sh deploy
```

This creates a preview URL where you can test:
- ✅ SSR functionality
- ✅ Environment variables
- ✅ API connections
- ✅ Static assets
- ✅ Routing

## 🔧 Common Issues & Solutions

### Issue: Build Fails
**Solution**: Check your environment variables and dependencies
```bash
./deploy.sh check  # Run prerequisite checks
```

### Issue: SSR Data Not Loading
**Solution**: Verify Supabase credentials in Vercel environment variables

### Issue: Static Assets 404
**Solution**: Ensure assets are in the `build/client/` directory

### Issue: Timeouts
**Solution**: Increase `maxDuration` in `vercel.json` if needed

## 📊 Deployment Monitoring

### Vercel Dashboard
Monitor your deployment at:
- Build logs
- Function logs
- Performance metrics
- Error tracking

### Local Monitoring
Check function performance with:
```bash
vercel logs
```

## 🔄 CI/CD Integration

### Automatic Deployments

Set up automatic deployments by connecting your Git repository:

1. **Connect Repository**: Link your GitHub/GitLab repo to Vercel
2. **Configure Triggers**: Set up deployment triggers
3. **Environment Variables**: Configure in Vercel dashboard
4. **Deploy**: Push to trigger automatic deployment

### GitHub Actions Example

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🛠️ Advanced Configuration

### Custom Domains

1. **Add Domain**: In Vercel dashboard → Settings → Domains
2. **DNS**: Configure DNS records as instructed
3. **SSL**: Certificate is automatically provisioned

### Edge Functions (Optional)

For edge-specific functionality, you can add edge functions:

```json
{
  "functions": {
    "api/**/*.js": {
      "runtime": "edge"
    }
  }
}
```

### Environment-Specific Builds

You can have different configurations for different environments:

```json
{
  "buildCommand": "npm run build:$VERCEL_ENV"
}
```

## 📞 Support

If you encounter issues:

1. **Check Logs**: `vercel logs`
2. **Verify Config**: Ensure `vercel.json` is correct
3. **Environment**: Double-check environment variables
4. **Documentation**: [Vercel Docs](https://vercel.com/docs)
5. **Community**: [Vercel Discord](https://vercel.com/discord)

## 🎉 Success!

Once deployed, your application will be available at:
- **Preview**: `https://your-project-name-username.vercel.app`
- **Production**: `https://your-domain.com` (if configured)

Enjoy your blazing-fast SSR website on Vercel! 🚀