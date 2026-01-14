"use client";

import { Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryDealCard } from "./CategoryDealCard";

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

interface DealsSectionProps {
  deals: Deal[];
  loading: boolean;
  locale: string;
  isRTL: boolean;
  localeCountry: string;
}

export function DealsSection({
  deals,
  loading,
  locale,
  isRTL,
  localeCountry,
}: DealsSectionProps) {
  return (
    <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-12">
      <div
        className={`flex items-center justify-between mb-8 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <h2
          className="text-[#111827]"
          style={{ fontSize: "24px", fontWeight: 700 }}
        >
          <Tag className={`inline h-6 w-6 ${isRTL ? "ml-2" : "mr-2"}`} />
          {isRTL ? "جميع العروض" : "All Deals"} ({deals.length})
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : deals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <CategoryDealCard
              key={deal.deals?.id}
              deal={deal.deals}
              locale={locale}
              isRTL={isRTL}
              localeCountry={localeCountry}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Tag className="h-16 w-16 text-[#9CA3AF] mx-auto mb-4" />
          <h3 className="text-xl text-[#111827] mb-2">
            {isRTL ? "لا توجد عروض" : "No deals found"}
          </h3>
          <p className="text-[#6B7280]">
            {isRTL
              ? "لا توجد عروض متاحة في هذا التصنيف حاليًا"
              : "No deals are currently available in this category"}
          </p>
        </div>
      )}
    </div>
  );
}
