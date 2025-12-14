# Sitemap Regeneration Webhook Setup

This webhook automatically regenerates your sitemap, triggers a Vercel deployment, and submits it to Google Search Console.

## Required Environment Variables

Add these to your Vercel environment variables:

### For Vercel Deployment:
- `VERCEL_TOKEN` - Your Vercel API token (Create at https://vercel.com/account/tokens)
- `VERCEL_PROJECT_ID` - Your Vercel project ID
- `VERCEL_TEAM_ID` (Optional) - Your Vercel team ID if using a team account
- `VERCEL_GITHUB_REPO` - Your GitHub repository in format `username/repo-name`

### For Google Search Console:
- `GOOGLE_CLIENT_EMAIL` - Google service account email
- `GOOGLE_PRIVATE_KEY` - Google service account private key
- `NEXT_PUBLIC_SITE_URL` - Your site URL (default: https://tuut.shop)

### Webhook Security:
- `SITEMAP_WEBHOOK_SECRET` - Secret key to secure your webhook

## Google Search Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Google Search Console API"
4. Create a Service Account:
   - Go to IAM & Admin → Service Accounts
   - Click "Create Service Account"
   - Give it a name (e.g., "sitemap-submitter")
   - Grant it the role of "Viewer"
   - Create and download the JSON key file
5. Add your service account email to Google Search Console:
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Select your property
   - Go to Settings → Users and permissions
   - Add the service account email with "Full" permission

## Usage

Trigger the webhook with a POST request:

```bash
curl -X POST https://tuut.shop/api/webhook/regenerate-sitemap \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET"
```

Or using query parameter:
```bash
curl -X POST "https://tuut.shop/api/webhook/regenerate-sitemap?key=YOUR_WEBHOOK_SECRET"
```

## Webhook Response

Success response:
```json
{
  "success": true,
  "message": "Sitemap regenerated and deployed successfully",
  "duration": "120 seconds",
  "steps": {
    "sitemap": "✅ Generated",
    "deployment": "✅ Triggered",
    "google": "✅ Submitted"
  },
  "deployment": {
    "url": "https://deployment-url.vercel.app",
    "status": "READY"
  },
  "google": {
    "success": true,
    "url": "https://tuut.shop/sitemap.xml"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Automating the Webhook

You can trigger this webhook from various sources:

1. **GitHub Actions**: Trigger on content updates
2. **CMS Webhooks**: Trigger when content changes
3. **Scheduled Jobs**: Run daily/weekly via cron
4. **Manual**: Trigger from admin dashboard

### Example: GitHub Action

Create `.github/workflows/sitemap.yml`:

```yaml
name: Regenerate Sitemap

on:
  workflow_dispatch:  # Manual trigger
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  regenerate-sitemap:
    runs-on: ubuntu-latest
    steps:
      - name: Call Webhook
        run: |
          curl -X POST https://tuut.shop/api/webhook/regenerate-sitemap \
            -H "Authorization: Bearer ${{ secrets.SITEMAP_WEBHOOK_SECRET }}"
```