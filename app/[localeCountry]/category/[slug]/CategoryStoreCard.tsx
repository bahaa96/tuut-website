"use client";

import Link from "next/link";
import { Store as StoreIcon, Tag } from "lucide-react";
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

interface CategoryStoreCardProps {
  store: StoreType;
  isRTL: boolean;
  localeCountry: string;
}

export function CategoryStoreCard({
  store,
  isRTL,
  localeCountry,
}: CategoryStoreCardProps) {
  const locale = getLocale();

  return (
    <Link
      href={`/${localeCountry}/store/${isRTL ? store.slug_ar : store.slug_en}`}
    >
      <div className="flex-shrink-0 w-[200px] bg-white rounded-xl p-4 border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer">
        <div className="h-16 w-16 mx-auto mb-3 rounded-lg border-2 border-[#E5E7EB] bg-white overflow-hidden flex items-center justify-center">
          {store.profile_picture_url ? (
            <ImageWithFallback
              src={store.profile_picture_url}
              alt={store.title_en || store.title_ar || ""}
              className="w-full h-full object-cover"
            />
          ) : (
            <StoreIcon className="h-8 w-8 text-[#9CA3AF]" />
          )}
        </div>

        <div className="text-center">
          <h3 className="text-sm font-semibold text-[#111827] mb-1 line-clamp-1">
            {store.title_en || store.title_ar || ""}
          </h3>
          <div className="flex items-center justify-center gap-1 text-xs text-[#5FB57A]">
            <Tag className="h-3 w-3" />
            <span>{store.total_offers || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
