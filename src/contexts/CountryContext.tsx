import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Country {
  id: string;
  label: {
    ar: string;
    en: string;
  };
  value: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  currency_code: {
    ar: string;
    en: string;
  };
  currency: {
    ar: string;
    en: string;
  };
}

interface CountryContextType {
  country: Country | null;
  countries: Country[];
  setCountry: (country: Country) => void;
  isLoading: boolean;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<Country | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setIsLoading(true);
      
      // Import API utility
      const { fetchCountries: fetchCountriesAPI } = await import('../utils/api');
      
      // Fetch countries from API
      const result = await fetchCountriesAPI();

      if (result.error) {
        console.error('Error fetching countries:', result.error);
        return;
      }

      const data = result.countries;

      if (data && data.length > 0) {
        console.log('Fetched countries from database:', data);
        setCountries(data);
        
        // Load saved country from localStorage using 'value' field
        const savedCountryValue = localStorage.getItem('tuut-country');
        if (savedCountryValue) {
          const savedCountry = data.find((c: Country) => c.value === savedCountryValue);
          if (savedCountry) {
            setCountryState(savedCountry);
          } else {
            // If saved country not found, use first country
            setCountryState(data[0]);
          }
        } else {
          // Default to first country if no saved preference
          setCountryState(data[0]);
        }
      }
    } catch (error) {
      console.error('Error in fetchCountries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setCountry = (newCountry: Country) => {
    setCountryState(newCountry);
    // Save the country value (e.g., "egypt")
    localStorage.setItem('tuut-country', newCountry.value);
  };

  return (
    <CountryContext.Provider value={{ country, countries, setCountry, isLoading }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
}
