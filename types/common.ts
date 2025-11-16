export interface BaseEntity {
  id: number | string;
  created_at?: string;
  updated_at?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LocaleCountry {
  locale: string;
  country: string;
  language: string;
  isRTL: boolean;
}

export interface FilterOptions {
  categories: string[];
  stores: string[];
  discounts: string[];
  sortOptions: string[];
}