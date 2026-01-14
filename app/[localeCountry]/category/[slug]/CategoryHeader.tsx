"use client";

import { Store, Tag, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Category {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
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

interface CategoryHeaderProps {
  category: Category | null;
  stores: StoreType[];
  deals: Deal[];
  loading: boolean;
  error: string | null;
  locale: string;
  isRTL: boolean;
}

function getCategoryName(category: Category | null, isRTL: boolean): string {
  if (!category) return "";
  if (isRTL && category.title_ar) return category.title_ar;
  return category.title_en;
}

function getCategoryDescription(
  category: Category | null,
  isRTL: boolean
): string {
  if (!category) return "";
  if (isRTL && category.description_ar) return category.description_ar;
  return category.description_en || "";
}

export function CategoryHeader({
  category,
  stores,
  deals,
  loading,
  error,
  locale,
  isRTL,
}: CategoryHeaderProps) {
  return (
    <div className="bg-white border-b-2 border-[#111827] py-12 md:py-16">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        {loading ? (
          <div className="text-center">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        ) : error ? (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="text-center">
            <h1
              className="text-[#111827] mb-4"
              style={{ fontSize: "36px", fontWeight: 700 }}
            >
              {getCategoryName(category, isRTL)}
            </h1>
            {getCategoryDescription(category, isRTL) && (
              <p className="text-[#6B7280] max-w-2xl mx-auto">
                {getCategoryDescription(category, isRTL)}
              </p>
            )}
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-[#6B7280]">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                <span>
                  {stores.length} {isRTL ? "متاجر" : "stores"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                <span>
                  {deals.length} {isRTL ? "عروض" : "deals"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
