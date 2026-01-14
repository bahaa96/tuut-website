"use client";

import Link from "next/link";
import { Store as StoreIcon, Tag } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

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

interface StoreCardProps {
  store: Store;
  locale: string;
  localeCountry: string;
}

function getStoreName(store: Store, locale: string): string {
  if (locale === "ar") {
    return (
      store.name_ar ||
      store.store_name_ar ||
      store.name ||
      store.store_name ||
      store.title ||
      "Store"
    );
  }
  return store.name || store.store_name || store.title || "Store";
}

function getStoreLogo(store: Store): string {
  return store.profile_picture_url || store.logo || store.logo_url || "";
}

function getStoreSlug(store: Store): string {
  const name = store.name || store.store_name || store.title || "";
  return store.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function StoreCard({ store, locale, localeCountry }: StoreCardProps) {
  return (
    <Link href={`/${localeCountry}/store/${getStoreSlug(store)}`}>
      <div className="group bg-white rounded-xl border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all p-6 text-center">
        <div className="h-16 w-16 mx-auto mb-4 rounded-lg border-2 border-[#E5E7EB] bg-white overflow-hidden flex items-center justify-center">
          {getStoreLogo(store) ? (
            <ImageWithFallback
              src={getStoreLogo(store)}
              alt={getStoreName(store, locale)}
              className="w-full h-full object-cover"
            />
          ) : (
            <StoreIcon className="h-8 w-8 text-[#9CA3AF]" />
          )}
        </div>
        <div
          style={{ fontSize: "16px", fontWeight: 600 }}
          className="text-[#111827] mb-2 line-clamp-1"
        >
          {getStoreName(store, locale)}
        </div>
        {store.total_offers !== undefined && (
          <div className="text-xs text-[#5FB57A] flex items-center justify-center gap-1">
            <Tag className="h-3 w-3" />
            {store.total_offers} {locale === "ar" ? "عروض" : "deals"}
          </div>
        )}
      </div>
    </Link>
  );
}

