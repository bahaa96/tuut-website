"use client";

import Link from "next/link";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

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

interface DealCardProps {
  deal: Deal;
  locale: string;
  localeCountry: string;
}

export function DealCard({ deal, locale, localeCountry }: DealCardProps) {
  return (
    <Link href={`/${localeCountry}/deal/${deal.slug || deal.id}`}>
      <div className="group bg-white rounded-xl border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all overflow-hidden">
        {deal.image_url && (
          <div className="aspect-video overflow-hidden border-b-2 border-[#111827]">
            <ImageWithFallback
              src={deal.image_url}
              alt={deal.title || ""}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        )}
        <div className="p-6">
          <h3
            style={{ fontSize: "18px", fontWeight: 600 }}
            className="text-[#111827] mb-2 line-clamp-2"
          >
            {deal.title}
          </h3>
          {deal.description && (
            <p className="text-[#6B7280] text-sm line-clamp-2 mb-3">
              {deal.description}
            </p>
          )}
          {deal.coupon_code && (
            <div
              className="inline-block bg-[#E8F3E8] text-[#5FB57A] px-3 py-1 rounded-lg text-sm border-2 border-[#5FB57A]"
              style={{ fontWeight: 600 }}
            >
              {deal.coupon_code}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

