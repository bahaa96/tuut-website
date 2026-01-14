"use client";

import { Store as StoreIcon, Tag } from "lucide-react";
import { StoreCard } from "./StoreCard";

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

interface StoresTabProps {
  stores: Store[];
  locale: string;
  isRTL: boolean;
  localeCountry: string;
}

export function StoresTab({
  stores,
  locale,
  localeCountry,
}: StoresTabProps) {
  if (stores.length === 0) {
    return (
      <div className="text-center py-12">
        <StoreIcon className="h-12 w-12 text-[#9CA3AF] mx-auto mb-4" />
        <p className="text-[#6B7280]">
          {locale === "ar" ? "لم يتم العثور على متاجر" : "No stores found"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {stores.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          locale={locale}
          localeCountry={localeCountry}
        />
      ))}
    </div>
  );
}

