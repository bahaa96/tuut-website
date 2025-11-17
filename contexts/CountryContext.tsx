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

        // Fetch countries with translations using the view we created
        const { data: countriesData, error } = await supabase
          .from('countries_with_translations')
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
            // Try to get country from localStorage or use first country as default
            const savedCountry = localStorage.getItem('selectedCountry');
            let defaultCountry = countriesData[0];

            if (savedCountry) {
              const found = countriesData.find(c => c.slug === savedCountry);
              if (found) defaultCountry = found;
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

  const value: CountryContextType = {
    country,
    countries,
    setCountry: handleSetCountry,
    isLoading,
  };

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  );
}