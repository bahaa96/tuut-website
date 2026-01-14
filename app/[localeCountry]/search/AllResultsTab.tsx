"use client";

import { Store as StoreIcon, Tag, ShoppingBag, FileText } from "lucide-react";
import { StoreCard } from "./StoreCard";
import { DealCard } from "./DealCard";
import { ProductCard } from "./ProductCard";
import { ArticleCard } from "./ArticleCard";

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

interface AllResultsTabProps {
  results: SearchResults;
  locale: string;
  isRTL: boolean;
  localeCountry: string;
}

export function AllResultsTab({
  results,
  locale,
  isRTL,
  localeCountry,
}: AllResultsTabProps) {
  return (
    <div className="space-y-8">
      {results.stores.length > 0 && (
        <div>
          <h2
            className="text-[#111827] mb-4 flex items-center gap-2"
            style={{ fontSize: "24px", fontWeight: 600 }}
          >
            <StoreIcon className="h-6 w-6" />
            {locale === "ar" ? "المتاجر" : "Stores"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {results.stores.slice(0, 4).map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                locale={locale}
                localeCountry={localeCountry}
              />
            ))}
          </div>
        </div>
      )}

      {results.deals.length > 0 && (
        <div>
          <h2
            className="text-[#111827] mb-4 flex items-center gap-2"
            style={{ fontSize: "24px", fontWeight: 600 }}
          >
            <Tag className="h-6 w-6" />
            {locale === "ar" ? "العروض" : "Deals"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.deals.slice(0, 4).map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                locale={locale}
                localeCountry={localeCountry}
              />
            ))}
          </div>
        </div>
      )}

      {results.products.length > 0 && (
        <div>
          <h2
            className="text-[#111827] mb-4 flex items-center gap-2"
            style={{ fontSize: "24px", fontWeight: 600 }}
          >
            <ShoppingBag className="h-6 w-6" />
            {locale === "ar" ? "المنتجات" : "Products"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {results.products.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                localeCountry={localeCountry}
              />
            ))}
          </div>
        </div>
      )}

      {results.articles.length > 0 && (
        <div>
          <h2
            className="text-[#111827] mb-4 flex items-center gap-2"
            style={{ fontSize: "24px", fontWeight: 600 }}
          >
            <FileText className="h-6 w-6" />
            {locale === "ar" ? "أدلة التسوق" : "Shopping Guides"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.articles.slice(0, 4).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                locale={locale}
                localeCountry={localeCountry}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

