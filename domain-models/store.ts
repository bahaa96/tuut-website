export interface Store {
  id: number;
  title_en?: string;
  title_ar?: string;
  slug_en?: string;
  slug_ar?: string;
  description_en?: string;
  description_ar?: string;
  website?: string;
  verified?: boolean;
  created_at?: string;
  profile_picture_url?: string;
  redirect_url?: string;
}

export interface StoreFilters {
  searchQuery?: string;
  selectedCategory?: string;
  verified?: boolean;
  sortBy?: string;
}
