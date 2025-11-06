// Custom hook for fetching country-filtered data

import { useState, useEffect } from 'react';
import { useCountry } from '../contexts/CountryContext';
import { getCountryValue } from '../utils/countryHelpers';
import { fetchFeaturedDeals, fetchDeals, fetchStores } from '../utils/api';

interface UseCountryDataOptions {
  enabled?: boolean;
  storeId?: string;
  categoryId?: string;
  limit?: number;
}

export function useFeaturedDeals(options: UseCountryDataOptions = {}) {
  const { enabled = true } = options;
  const { country } = useCountry();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const countryValue = getCountryValue(country);
        const result = await fetchFeaturedDeals({ 
          country: countryValue || undefined 
        });
        
        if (result.error) {
          setError(result.error);
        } else {
          setData(result);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [country, enabled]);

  return { data, loading, error };
}

export function useDeals(options: UseCountryDataOptions = {}) {
  const { enabled = true, storeId, categoryId, limit } = options;
  const { country } = useCountry();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const countryValue = getCountryValue(country);
        const result = await fetchDeals({ 
          country: countryValue || undefined,
          storeId,
          categoryId,
          limit,
        });
        
        if (result.error) {
          setError(result.error);
        } else {
          setData(result);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [country, storeId, categoryId, limit, enabled]);

  return { data, loading, error };
}

export function useStores(options: UseCountryDataOptions = {}) {
  const { enabled = true, limit } = options;
  const { country } = useCountry();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetch = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const countryValue = getCountryValue(country);
        const result = await fetchStores({ 
          country: countryValue || undefined,
          limit,
        });
        
        if (result.error) {
          setError(result.error);
        } else {
          setData(result);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [country, limit, enabled]);

  return { data, loading, error };
}
