export interface Product {
  id: number;
  title?: string;
  description?: string;
  price?: number;
  original_price?: number;
  currency?: string;
  rating?: number;
  store?: string;
  store_id?: number;
  url?: string;
  images?: string[];
  categories?: string[];
  available?: boolean;
  created_at?: string;
  slug?: string;
}

export interface ProductFilters {
  searchQuery?: string;
  selectedCategory?: string;
  selectedStore?: string;
  selectedDiscount?: string;
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductWithStore extends Product {
  store_data?: {
    name: string;
    logo_url?: string;
    slug?: string;
  };
}