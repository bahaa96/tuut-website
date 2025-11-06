# Store Schema Documentation

This document describes the expected schema for the `stores` table in the Supabase database.

## Stores Table Schema

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier for the store |
| `name` | Text | Store name in English |
| `created_at` | Timestamp | Record creation timestamp |

### Optional Fields

#### Store Information
| Field | Type | Description |
|-------|------|-------------|
| `name_ar` | Text | Store name in Arabic |
| `store_name` | Text | Alternative field for store name |
| `store_name_ar` | Text | Alternative field for store name in Arabic |
| `title` | Text | Alternative field for store title |
| `title_ar` | Text | Alternative field for store title in Arabic |
| `description` | Text | Store description in English |
| `description_ar` | Text | Store description in Arabic |

#### Images
| Field | Type | Description |
|-------|------|-------------|
| `logo` | Text (URL) | Store logo URL |
| `logo_url` | Text (URL) | Alternative field for logo URL |
| `image_url` | Text (URL) | Alternative field for image URL |
| `profile_image` | Text (URL) | **Store profile/banner image URL** |
| `profile_image_url` | Text (URL) | Alternative field for profile image |
| `banner_image` | Text (URL) | Alternative field for banner image |
| `cover_image` | Text (URL) | Alternative field for cover image |

#### Metadata
| Field | Type | Description |
|-------|------|-------------|
| `slug` | Text | URL-friendly store identifier |
| `deals_count` | Integer | Total number of deals |
| `active_deals_count` | Integer | Number of currently active deals |
| `category_id` | UUID | Reference to categories table |
| `country_id` | UUID | Reference to countries table |
| `featured` | Boolean | Whether store is featured |
| `is_featured` | Boolean | Alternative field for featured status |
| `rating` | Numeric | Store rating (0-5) |
| `total_savings` | Text | Total savings amount display |

## Image Guidelines

### Logo Image
- **Recommended size**: 200x200px to 400x400px
- **Format**: PNG with transparent background preferred
- **Aspect ratio**: Square (1:1)
- **Usage**: Displayed in cards, headers, and thumbnails
- **Should contain**: Brand logo or icon only

### Profile/Banner Image
- **Recommended size**: 1200x400px minimum
- **Format**: JPG or PNG
- **Aspect ratio**: Wide (3:1 or 16:5)
- **Usage**: Displayed as banner/cover on store cards and detail pages
- **Should contain**: Brand imagery, products, or promotional graphics

## Field Priority

The application checks for fields in the following order:

### Store Name
1. `name_ar` (if Arabic language selected)
2. `store_name_ar` (if Arabic language selected)
3. `title_ar` (if Arabic language selected)
4. `name`
5. `store_name`
6. `title`

### Logo
1. `logo`
2. `logo_url`
3. `image_url`

### Profile Image
1. `profile_image`
2. `profile_image_url`
3. `banner_image`
4. `cover_image`

### Deals Count
1. `active_deals_count`
2. `deals_count`

### Featured Status
1. `featured`
2. `is_featured`

## Example Store Record

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Amazon",
  "name_ar": "أمازون",
  "description": "Online shopping from the world's largest selection.",
  "description_ar": "التسوق عبر الإنترنت من أكبر مجموعة في العالم.",
  "logo": "https://example.com/logos/amazon-logo.png",
  "profile_image": "https://example.com/banners/amazon-banner.jpg",
  "slug": "amazon",
  "active_deals_count": 42,
  "country_id": "b599b0ac-4402-41bb-8652-9bfedf820e6b",
  "featured": true,
  "rating": 4.5,
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Visual Layout

### Grid View with Profile Image
```
┌────────────────────────┐
│  Profile Banner Image  │  ← profile_image (covers top)
│   (gradient overlay)   │
├────────────────────────┤
│       ┌──────┐         │
│       │ Logo │         │  ← logo (overlaps banner)
│       └──────┘         │
│                        │
│     Store Name         │
│   Description text     │
│                        │
│   🏷️ 42 Active Deals   │
└────────────────────────┘
```

### List View with Profile Image
```
┌─────────────────────────────────────────────┐
│       Full-width Profile Banner             │  ← profile_image
│          (gradient overlay)                 │
├────┬────────────────────────────────────────┤
│    │  Store Name                Featured ⭐ │
│Logo│  Description text here...              │  ← logo overlaps
│    │  🏷️ 42 deals                            │
└────┴────────────────────────────────────────┘
```

## Database Migration

If you need to add the profile image field to your existing stores table:

```sql
-- Add profile_image column
ALTER TABLE stores 
ADD COLUMN profile_image TEXT;

-- Add index for faster queries
CREATE INDEX idx_stores_profile_image 
ON stores(profile_image) 
WHERE profile_image IS NOT NULL;
```

## Best Practices

1. **Always provide both logo and profile image** for the best visual experience
2. **Use consistent image sizes** across all stores for uniform appearance
3. **Optimize images** before uploading (compress JPG/PNG files)
4. **Use CDN URLs** for better performance
5. **Provide fallbacks** - the app gracefully handles missing images
6. **Test both languages** - ensure Arabic text displays correctly with images

## Image Storage Recommendations

- Store images in Supabase Storage buckets
- Use signed URLs for private content
- Organize images by store slug: `/stores/amazon/logo.png`, `/stores/amazon/banner.jpg`
- Keep original high-resolution versions
- Generate optimized versions for web display
