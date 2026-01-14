"use client";

import { Tag } from "lucide-react";
import { DealCard } from "./DealCard";

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
}

interface DealsTabProps {
  deals: Deal[];
  locale: string;
  isRTL: boolean;
  localeCountry: string;
}

export function DealsTab({ deals, locale, localeCountry }: DealsTabProps) {
  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <Tag className="h-12 w-12 text-[#9CA3AF] mx-auto mb-4" />
        <p className="text-[#6B7280]">
          {locale === "ar" ? "لم يتم العثور على عروض" : "No deals found"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          deal={deal}
          locale={locale}
          localeCountry={localeCountry}
        />
      ))}
    </div>
  );
}

