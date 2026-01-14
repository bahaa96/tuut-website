"use client";

import { useState, useEffect } from "react";
import { Store, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryStoreCard } from "./CategoryStoreCard";

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

interface StoresCarouselProps {
  stores: StoreType[];
  locale: string;
  isRTL: boolean;
  localeCountry: string;
}

export function StoresCarousel({
  stores,
  locale,
  isRTL,
  localeCountry,
}: StoresCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollStores = (direction: "left" | "right") => {
    const container = document.getElementById("stores-carousel");
    if (!container) return;

    const scrollAmount = 300;
    const newPosition =
      direction === "left"
        ? scrollPosition - scrollAmount
        : scrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });

    setScrollPosition(newPosition);
  };

  return (
    <div className="bg-white border-b-2 border-[#111827] py-8">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between mb-6 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <h2
            className="text-[#111827]"
            style={{ fontSize: "24px", fontWeight: 700 }}
          >
            <Store className={`inline h-6 w-6 ${isRTL ? "ml-2" : "mr-2"}`} />
            {isRTL ? "المتاجر المميزة" : "Featured Stores"} ({stores.length})
          </h2>
          <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scrollStores("left")}
              className="h-10 w-10 rounded-lg border-2 border-[#111827]"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scrollStores("right")}
              className="h-10 w-10 rounded-lg border-2 border-[#111827]"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div
          id="stores-carousel"
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {stores.map((store) => (
            <CategoryStoreCard
              key={store.stores?.id}
              store={store.stores}
              locale={locale}
              isRTL={isRTL}
              localeCountry={localeCountry}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
