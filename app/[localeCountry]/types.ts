export interface Product {
  id: number;
  title?: string;
  description?: string;
  price?: number;
  original_price?: number;
  currency?: string;
  rating?: number;
  store?: string;
  url?: string;
  images?: string[];
  categories?: string[];
  available?: boolean;
  created_at?: string;
}