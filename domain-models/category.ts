export interface Category {
  id: number;
  name: string;
  category_name?: string;
  title?: string;
  description?: string;
  slug?: string;
  icon?: string;
  created_at?: string;
}

export interface CategoryFilters {
  searchQuery?: string;
  sortBy?: string;
}