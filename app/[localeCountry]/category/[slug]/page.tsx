"use client";

import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { useCountry } from "@/contexts/CountryContext";
import { CategoryHeader } from "./CategoryHeader";
import { StoresCarousel } from "./StoresCarousel";
import { DealsSection } from "./DealsSection";
import {
  requestFetchAllDealsByCategoryId,
  requestFetchSingleCategoryBySlug,
} from "@/network";
import { requestFetchAllStoresByCategoryId } from "@/network/stores";

interface Category {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  color?: string;
  bg_color?: string;
}

interface StoreType {
  id: string;
  name?: string;
  name_ar?: string;
  title?: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  logo?: string;
  logo_url?: string;
  image_url?: string;
  profile_image?: string;
  profile_image_url?: string;
  active_deals_count?: number;
  deals_count?: number;
  slug?: string;
}

interface Deal {
  id: string;
  title?: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  discount_amount?: string;
  discount_percentage?: number;
  coupon_code?: string;
  code?: string;
  image_url?: string;
  stores?: StoreType;
  created_at?: string;
  expires_at?: string;
  slug?: string;
}

export default function CategoryPage() {
  const params = useParams();
  const pathname = usePathname();
  const slug = params.slug as string;
  const localeCountry = pathname?.split("/")[1];
  const locale = localeCountry?.split("-")[0];
  const isRTL = locale === "ar";
  const { country } = useCountry();

  const [category, setCategory] = useState<Category | null>(null);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategoryData();
  }, [slug, country]);

  async function fetchCategoryData() {
    try {
      setLoading(true);
      setError(null);

      const { data: categoryData } = await requestFetchSingleCategoryBySlug({
        slug: slug,
      });

      setCategory(categoryData);

      if (!categoryData) {
        setError(isRTL ? "لم يتم العثور على التصنيف" : "Category not found");
        setLoading(false);
        return;
      }

      const { data: categoryStoresData } =
        await requestFetchAllStoresByCategoryId({
          categoryId: categoryData.id,
          countrySlug: country?.slug,
          currentPage: 1,
          pageSize: 10,
        });

      setStores(categoryStoresData);

      const { data: categoryDealsData } =
        await requestFetchAllDealsByCategoryId({
          categoryId: categoryData.id,
          countrySlug: country?.slug,
          currentPage: 1,
          pageSize: 10,
        });

      setDeals(categoryDealsData);
    } catch (err) {
      console.error("Error in fetchCategoryData:", err);
      setError(
        isRTL
          ? "حدث خطأ أثناء تحميل البيانات"
          : "An error occurred while loading data"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-[#E8F3E8] flex flex-col"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <CategoryHeader
        category={category}
        stores={stores}
        deals={deals}
        loading={loading}
        error={error}
        locale={locale}
        isRTL={isRTL}
      />

      {!loading && stores.length > 0 && (
        <StoresCarousel
          stores={stores}
          locale={locale}
          isRTL={isRTL}
          localeCountry={localeCountry || ""}
        />
      )}

      <DealsSection
        deals={deals}
        loading={loading}
        locale={locale}
        isRTL={isRTL}
        localeCountry={localeCountry || ""}
      />
    </div>
  );
}
