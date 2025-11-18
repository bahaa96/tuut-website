"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';

interface Country {
  id: string;
  value: string;
  slug: string;
  image_url: string;
  currency_code: { ar: string; en: string };
  name_en?: string;
  name_ar?: string;
  created_at: string;
  updated_at: string;
}

interface CountryContextType {
  country: Country | null;
  countries: Country[];
  setCountry: (country: Country) => void;
  isLoading: boolean;
  initializeCountryFromCode: (countryCode: string) => Promise<void>;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
}

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountry] = useState<Country | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const supabase = createClient();

        // Fetch countries from the countries table
        const { data: countriesData, error } = await supabase
          .from('countries')
          .select('*')
          .order('slug');

        if (error) {
          console.error('Error fetching countries:', error);
          return;
        }

        if (countriesData) {
          setCountries(countriesData);

          // Set default country if none is selected
          if (!country && countriesData.length > 0) {
            let defaultCountry = countriesData[0];

            // Try to get country from URL locale first
            if (typeof window !== 'undefined') {
              const pathname = window.location.pathname;
              const pathnameParts = pathname.split('/');
              if (pathnameParts.length > 1) {
                const potentialLocale = pathnameParts[1];
                if (potentialLocale.includes('-')) {
                  const countrySlug = potentialLocale.split('-')[1].toUpperCase();
                  const countryFromUrl = countriesData.find(c => c.slug === countrySlug);
                  if (countryFromUrl) {
                    defaultCountry = countryFromUrl;
                    localStorage.setItem('selectedCountry', countryFromUrl.slug);
                  }
                }
              }
            }

            // If no country from URL, try localStorage
            if (!defaultCountry || defaultCountry === countriesData[0]) {
              const savedCountry = localStorage.getItem('selectedCountry');
              if (savedCountry) {
                const found = countriesData.find(c => c.slug === savedCountry);
                if (found) defaultCountry = found;
              }
            }

            setCountry(defaultCountry);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, [country]);

  const handleSetCountry = (selectedCountry: Country) => {
    setCountry(selectedCountry);
    localStorage.setItem('selectedCountry', selectedCountry.slug);
  };

  const initializeCountryFromCode = async (countryCode: string) => {
    try {
      const supabase = createClient();
      const { data: countryData, error } = await supabase
        .from('countries')
        .select('*')
        .eq('slug', countryCode.toUpperCase())
        .single();

      if (error) {
        console.error('Error fetching country:', error);
        return;
      }

      if (countryData) {
        setCountry(countryData);
        localStorage.setItem('selectedCountry', countryData.slug);
      }
    } catch (error) {
      console.error('Error initializing country:', error);
    }
  };

  const value: CountryContextType = {
    country,
    countries,
    setCountry: handleSetCountry,
    isLoading,
    initializeCountryFromCode,
  };

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  );
}