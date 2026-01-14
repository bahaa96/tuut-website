"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useCountry } from "@/contexts/CountryContext";
import { getCountryValue } from "@/utils/countryHelpers";
import { directSearch } from "@/utils/directSearch";
import { projectId, publicAnonKey } from "@/utils/supabase/info";
import { SearchResultsHeader } from "./SearchResultsHeader";
import { SearchTabs } from "./SearchTabs";
import { EmptySearchState } from "./EmptySearchState";
import { LoadingState } from "./LoadingState";

interface Store {
  id: string;
  name?: string;
  store_name?: string;
  title?: string;
  name_ar?: string;
  store_name_ar?: string;
  logo?: string;
  logo_url?: string;
  profile_picture_url?: string;
  slug?: string;
  description?: string;
  total_offers?: number;
}

interface Deal {
  id: string;
  title?: string;
  description?: string;
  coupon_code?: string;
  discount_percentage?: number;
  discount_amount?: number;
  original_price?: number;
  discounted_price?: number;
  image_url?: string;
  slug?: string;
  stores?: Store;
}

interface Product {
  id: string;
  name?: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  price?: number;
  image_url?: string;
  slug?: string;
  category?: string;
}

interface Article {
  id: string;
  title?: string;
  title_ar?: string;
  excerpt?: string;
  excerpt_ar?: string;
  image_url?: string;
  slug?: string;
  published_at?: string;
}

interface SearchResults {
  stores: Store[];
  deals: Deal[];
  products: Product[];
  articles: Article[];
  totalResults: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const query = searchParams.get("q") || "";
  const localeCountry = pathname?.split("/")[1];
  const locale = localeCountry?.split("-")[0];
  const isRTL = locale === "ar";
  const { country } = useCountry();

  const [results, setResults] = useState<SearchResults>({
    stores: [],
    deals: [],
    products: [],
    articles: [],
    totalResults: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    } else {
      setLoading(false);
    }
  }, [query, country]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const countryValue = getCountryValue(country);

      const url = countryValue
        ? `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/search?q=${encodeURIComponent(query)}&country=${countryValue}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/search?q=${encodeURIComponent(query)}`;

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setResults({
              stores: result.stores || [],
              deals: result.deals || [],
              products: result.products || [],
              articles: result.articles || [],
              totalResults: result.totalResults || 0,
            });
            return;
          }
        }
      } catch (edgeFunctionError) {
        console.warn("Edge function search failed, using direct search");
      }

      const result = await directSearch({
        query,
        countryValue: countryValue || undefined,
      });

      setResults({
        stores: result.stores || [],
        deals: result.deals || [],
        products: result.products || [],
        articles: result.articles || [],
        totalResults: result.totalResults || 0,
      });
    } catch (err) {
      console.error("Error fetching search results:", err);
      setResults({
        stores: [],
        deals: [],
        products: [],
        articles: [],
        totalResults: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!query) {
    return <EmptySearchState locale={locale} isRTL={isRTL} />;
  }

  return (
    <div className="min-h-screen bg-white py-8 md:py-12">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <SearchResultsHeader
          query={query}
          loading={loading}
          totalResults={results.totalResults}
          locale={locale}
          isRTL={isRTL}
        />

        {loading ? (
          <LoadingState />
        ) : results.totalResults === 0 ? (
          <EmptySearchState locale={locale} isRTL={isRTL} hasQuery={true} />
        ) : (
          <SearchTabs
            results={results}
            locale={locale}
            isRTL={isRTL}
            localeCountry={localeCountry || ""}
          />
        )}
      </div>
    </div>
  );
}

