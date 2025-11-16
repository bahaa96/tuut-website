export interface Store {
  id: number;
  name: string;
  store_name?: string;
  title?: string;
  slug?: string;
  logo_url?: string;
  description?: string;
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