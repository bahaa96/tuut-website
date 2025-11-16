# Country-Based Filtering Implementation

This document describes how the Tuut application filters deals and stores based on the currently selected country.

## Architecture Overview

The application uses a three-tier architecture for country-based filtering:

1. **Frontend** - React components with CountryContext
2. **Server** - Supabase Edge Functions with Hono
3. **Database** - PostgreSQL with country relationships

## Database Schema

### Countries Table
```typescript
{
  id: string (UUID)
  label: { ar: string, en: string }
  value: string (e.g., "egypt")
  image_url: string (flag image URL)
  currency_code: { ar: string, en: string }
  currency: { ar: string, en: string }
  created_at: timestamp
  updated_at: timestamp
}
```

### Expected Relationships
- **deals table**: Should have a `country_id` column (UUID) referencing `countries.id`
- **stores table**: Should have a `country_id` column (UUID) referencing `countries.id`

## API Endpoints

### GET /make-server-4f34ef25/countries
Fetches all available countries.

**Response:**
```json
{
  "success": true,
  "countries": [...]
}
```

### GET /make-server-4f34ef25/featured-deals?country={value}
Fetches featured deals filtered by country.

**Parameters:**
- `country` (optional): Country value (e.g., "egypt")

**Response:**
```json
{
  "success": true,
  "deals": [...],
  "country": "egypt"
}
```

### GET /make-server-4f34ef25/deals?country={value}&store_id={id}&category_id={id}&limit={n}
Fetches regular deals with filters.

**Parameters:**
- `country` (optional): Country value
- `store_id` (optional): Filter by store
- `category_id` (optional): Filter by category
- `limit` (optional): Limit results

### GET /make-server-4f34ef25/stores?country={value}&limit={n}
Fetches stores filtered by country.

**Parameters:**
- `country` (optional): Country value
- `limit` (optional): Limit results

## Frontend Usage

### Using the CountryContext

```tsx
import { useCountry } from '../contexts/CountryContext';
import { getCountryValue, getCountryName } from '../utils/countryHelpers';

function MyComponent() {
  const { country, setCountry, countries } = useCountry();
  
  // Get country value for API calls
  const countryValue = getCountryValue(country); // "egypt"
  
  // Get country name in current language
  const countryName = getCountryName(country, 'en'); // "Egypt"
  
  return <div>{countryName}</div>;
}
```

### Using API Utilities

```tsx
import { fetchFeaturedDeals, fetchDeals, fetchStores } from '../utils/api';
import { useCountry } from '../contexts/CountryContext';
import { getCountryValue } from '../utils/countryHelpers';

async function loadData() {
  const { country } = useCountry();
  const countryValue = getCountryValue(country);
  
  // Fetch featured deals for current country
  const featuredDeals = await fetchFeaturedDeals({ country: countryValue });
  
  // Fetch all deals for current country
  const allDeals = await fetchDeals({ country: countryValue });
  
  // Fetch stores for current country
  const stores = await fetchStores({ country: countryValue, limit: 20 });
}
```

### Using Custom Hooks

```tsx
import { useFeaturedDeals, useDeals, useStores } from '../hooks/useCountryData';

function MyComponent() {
  // Automatically filters by current country
  const { data: featuredDeals, loading, error } = useFeaturedDeals();
  
  // With additional filters
  const { data: deals } = useDeals({ 
    storeId: 'store-id',
    categoryId: 'category-id',
    limit: 10 
  });
  
  const { data: stores } = useStores({ limit: 20 });
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Render data */}</div>;
}
```

## How It Works

1. **User selects a country** in the Header component
2. **CountryContext updates** and stores the selection in localStorage
3. **Components re-render** due to context change
4. **API calls include country filter** using the `country` query parameter
5. **Server fetches country ID** from the `value` field
6. **Server filters data** by `country_id` column
7. **Results returned** to the frontend

## Example: FeaturedDeals Component

```tsx
export function FeaturedDeals() {
  const { country } = useCountry();
  const { language } = useLanguage();
  const [deals, setDeals] = useState([]);
  
  useEffect(() => {
    async function fetchDeals() {
      const countryValue = getCountryValue(country);
      const result = await fetchFeaturedDeals({ 
        country: countryValue || undefined 
      });
      
      if (result.deals) {
        setDeals(result.deals);
      }
    }
    
    fetchDeals();
  }, [country, language]); // Refetch when country changes
  
  return <div>{/* Render deals */}</div>;
}
```

## Testing

To test country filtering:

1. Open the application
2. Select a country from the dropdown in the header
3. Observe that:
   - Featured deals update
   - Console logs show the country parameter
   - Data is filtered by the selected country

## Troubleshooting

### Deals/Stores not filtering by country

**Issue**: Data doesn't change when selecting a different country

**Possible causes:**
1. Database tables don't have `country_id` column
2. The `country_id` column isn't properly linked to `countries.id`
3. No data exists for the selected country

**Solution**: Check the database schema and ensure:
```sql
-- Deals table should have
ALTER TABLE deals ADD COLUMN country_id UUID REFERENCES countries(id);

-- Stores table should have
ALTER TABLE stores ADD COLUMN country_id UUID REFERENCES countries(id);
```

### Console errors

Check the browser console and server logs for error messages. The server logs will show:
- "Fetching featured deals for country: egypt"
- "Country ID: b599b0ac-4402-41bb-8652-9bfedf820e6b"
- "Fetched N featured deals"

## Future Enhancements

- [ ] Add country-specific pricing
- [ ] Support multiple countries per deal/store
- [ ] Add country-based deal recommendations
- [ ] Implement country-specific currencies in deal display
