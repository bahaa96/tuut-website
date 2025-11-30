export interface Store {
  id: number;
  name: string;
  name_ar?: string;
  store_name?: string;
  store_name_ar?: string;
  title?: string;
  title_en?: string;
  title_ar?: string;
  slug?: string;
  slug_en?: string;
  slug_ar?: string;
  logo_url?: string;
  description?: string;
  description_en?: string;
  description_ar?: string;
  website?: string;
  verified?: boolean;
  created_at?: string;
}

export interface StoreFilters {
  searchQuery?: string;
  selectedCategory?: string;
  verified?: boolean;
  sortBy?: string;
}