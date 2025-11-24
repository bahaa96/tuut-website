export interface Deal {
  id: number;
  slug?: string;
  title_en: string;
  title_ar?: string;
  description_en?: string;
  description_ar?: string;
  discount_percentage?: number;
  discount_amount?: number;
  original_price?: number;
  discounted_price?: number;
  code?: string;
  store_id?: string;
  store_slug?: string;
  store_name?: string;
  store_logo?: string;
  category_name?: string;
  expires_at?: string;
  is_verified?: boolean;
  featured?: boolean;
  created_at?: string;
}

export interface DealFilters {
  searchQuery?: string;
  selectedCategory?: string;
  selectedStore?: string;
  selectedDiscount?: string;
  sortBy?: string;
}

export interface DealWithStore extends Deal {
  store: {
    name: string;
    store_name?: string;
    title_en?: string;
    slug?: string;
    logo_url?: string;
  };
}