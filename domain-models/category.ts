export interface Category {
  id: number;
  title_en?: string;
  title_ar?: string;
  slug_en?: string;
  slug_ar?: string;
  description_en?: string;
  description_ar?: string;
  icon?: string;
  created_at?: string;
}

export interface CategoryFilters {
  searchQuery?: string;
  sortBy?: string;
}
