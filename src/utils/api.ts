// API utility functions for fetching data with country filtering

import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25`;

interface FetchOptions {
  country?: string;
  storeId?: string;
  categoryId?: string;
  limit?: number;
  offset?: number;
  search?: string;
}

export async function fetchFeaturedDeals(options: FetchOptions = {}) {
  const params = new URLSearchParams();
  if (options.country) params.append('country', options.country);
  
  const url = `${BASE_URL}/featured-deals${params.toString() ? '?' + params.toString() : ''}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function fetchDeals(options: FetchOptions = {}) {
  const params = new URLSearchParams();
  if (options.country) params.append('country', options.country);
  if (options.storeId) params.append('store_id', options.storeId);
  if (options.categoryId) params.append('category_id', options.categoryId);
  if (options.limit) params.append('limit', options.limit.toString());
  
  const url = `${BASE_URL}/deals${params.toString() ? '?' + params.toString() : ''}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function fetchStores(options: FetchOptions = {}) {
  const params = new URLSearchParams();
  if (options.country) params.append('country', options.country);
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.offset !== undefined) params.append('offset', options.offset.toString());
  if (options.search) params.append('search', options.search);
  
  const url = `${BASE_URL}/stores${params.toString() ? '?' + params.toString() : ''}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function fetchCountries() {
  const url = `${BASE_URL}/countries`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
