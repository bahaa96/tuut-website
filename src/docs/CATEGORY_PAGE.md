# Category Page Documentation

## Overview
The CategoryPage displays all stores and deals related to a specific category. Users can click on any category in the home page's CategoryGrid to navigate to the dedicated category page.

## Routes
- **URL Pattern**: `/category/:slug` or `/category/:id`
- **Examples**: 
  - `/category/electronics`
  - `/category/fashion`
  - `/category/1`

## Features

### 1. Category Header
- Displays category name (with Arabic support)
- Shows category description if available
- Shows count of stores and deals in the category

### 2. Tabbed Interface
- **Deals Tab**: Grid of all deals in the category
- **Stores Tab**: Grid of all stores in the category
- Shows count badges on each tab

### 3. Country Filtering
- Automatically filters stores and deals based on selected country
- Uses the CountryContext for consistent filtering across the app

### 4. Language Support
- Full RTL support for Arabic
- Uses language-specific field names (name_ar, description_ar, etc.)

### 5. Empty States
- Shows friendly messages when no stores or deals are found
- Displays appropriate icons and descriptive text

## Data Structure

### Category
```typescript
interface Category {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  slug?: string;
  color?: string;
  bg_color?: string;
}
```

### Store Display
- Logo/image
- Name with language support
- Description (truncated to 2 lines)
- Active deals count
- Links to store detail page

### Deal Display
- Uses the existing DealCard component
- Shows discount, coupon code, store info
- Links to deal detail page

## Database Queries

### Category Lookup
- First tries to find by `slug`
- Falls back to finding by `id`

### Stores Query
```sql
SELECT * FROM stores
WHERE category_id = :categoryId
  AND country_id = :countryId (if country selected)
ORDER BY active_deals_count DESC NULLS LAST
LIMIT 12
```

### Deals Query
```sql
SELECT *, stores!deals_store_id_fkey(*)
FROM deals
WHERE category_id = :categoryId
  AND country_id = :countryId (if country selected)
ORDER BY created_at DESC
LIMIT 12
```

## Navigation

### From HomePage
Categories in the CategoryGrid component are now clickable buttons that navigate to `/category/:slug` or `/category/:id`.

### To Store Details
Each store card in the Stores tab links to `/store/:slug` or `/store/:id`.

### To Deal Details
Each deal card in the Deals tab links to the deal detail page.

## Error Handling
- Shows error alert if category is not found
- Gracefully handles missing data
- Falls back to English fields if Arabic is not available
- Shows loading skeletons while fetching data

## Responsive Design
- Mobile: Single column grid
- Tablet: 2 column grid
- Desktop: 3 column grid
- Follows the Tuut design system with mint green theme

## Implementation Notes

### CategoryGrid Changes
- Added `onClick` handler to navigate to category page
- Uses router's `navigate()` function
- Added `cursor-pointer` class for better UX

### Router Updates
- Added 'category' to the list of supported route patterns in `useParams`
- Pattern: `/category/:slug` where slug can be either slug or id

### App.tsx Changes
- Added CategoryPage import
- Added route check for `/category/` paths
- Positioned before other dynamic routes for proper matching
