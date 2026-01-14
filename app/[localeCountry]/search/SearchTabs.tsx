"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllResultsTab } from "./AllResultsTab";
import { StoresTab } from "./StoresTab";
import { DealsTab } from "./DealsTab";
import { ProductsTab } from "./ProductsTab";
import { GuidesTab } from "./GuidesTab";

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

interface SearchTabsProps {
  results: SearchResults;
  locale: string;
  isRTL: boolean;
  localeCountry: string;
}

export function SearchTabs({
  results,
  locale,
  isRTL,
  localeCountry,
}: SearchTabsProps) {
  return (
    <Tabs defaultValue="all" className="w-full" dir={isRTL ? "rtl" : "ltr"}>
      <TabsList className="mb-8">
        <TabsTrigger value="all">
          {locale === "ar" ? "الكل" : "All"} ({results.totalResults})
        </TabsTrigger>
        <TabsTrigger value="stores">
          {locale === "ar" ? "المتاجر" : "Stores"} ({results.stores.length})
        </TabsTrigger>
        <TabsTrigger value="deals">
          {locale === "ar" ? "العروض" : "Deals"} ({results.deals.length})
        </TabsTrigger>
        <TabsTrigger value="products">
          {locale === "ar" ? "المنتجات" : "Products"} ({results.products.length})
        </TabsTrigger>
        <TabsTrigger value="guides">
          {locale === "ar" ? "الأدلة" : "Guides"} ({results.articles.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <AllResultsTab
          results={results}
          locale={locale}
          isRTL={isRTL}
          localeCountry={localeCountry}
        />
      </TabsContent>

      <TabsContent value="stores">
        <StoresTab
          stores={results.stores}
          locale={locale}
          isRTL={isRTL}
          localeCountry={localeCountry}
        />
      </TabsContent>

      <TabsContent value="deals">
        <DealsTab
          deals={results.deals}
          locale={locale}
          isRTL={isRTL}
          localeCountry={localeCountry}
        />
      </TabsContent>

      <TabsContent value="products">
        <ProductsTab
          products={results.products}
          locale={locale}
          isRTL={isRTL}
          localeCountry={localeCountry}
        />
      </TabsContent>

      <TabsContent value="guides">
        <GuidesTab
          articles={results.articles}
          locale={locale}
          isRTL={isRTL}
          localeCountry={localeCountry}
        />
      </TabsContent>
    </Tabs>
  );
}

