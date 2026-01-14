"use client";

import Link from "next/link";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { getLocale } from "@/src/paraglide/runtime";

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

interface CategoryDealCardProps {
  deal: Deal;
  localeCountry: string;
}

export function CategoryDealCard({
  deal,

  localeCountry,
}: CategoryDealCardProps) {
  const locale = getLocale();
  const isRTL = locale === "ar";
  const title = isRTL ? deal.title_ar : deal.title_en || "";
  const description = isRTL ? deal.description_ar : deal.description_en || "";
  const slug = isRTL ? deal.slug_ar : deal.slug_en || "";
  return (
    <Link href={`/${localeCountry}/deal/${slug}`}>
      <div className="group bg-white rounded-xl border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all overflow-hidden">
        {deal.image_url && (
          <div className="aspect-video overflow-hidden border-b-2 border-[#111827]">
            <ImageWithFallback
              src={deal.image_url}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        )}
        <div className="p-6">
          <h3
            style={{ fontSize: "18px", fontWeight: 600 }}
            className="text-[#111827] mb-2 line-clamp-2"
          >
            {title}
          </h3>
          {description && (
            <p className="text-[#6B7280] text-sm line-clamp-2 mb-3">
              {description}
            </p>
          )}
          {deal.code && (
            <div
              className="inline-block bg-[#E8F3E8] text-[#5FB57A] px-3 py-1 rounded-lg text-sm border-2 border-[#5FB57A]"
              style={{ fontWeight: 600 }}
            >
              {deal.code}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
