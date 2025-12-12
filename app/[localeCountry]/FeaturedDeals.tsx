"use client";
import { Heart, Copy, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useCountry } from "@/contexts/CountryContext";
import { getCountryValue } from "@/utils/countryHelpers";
import { fetchFeaturedDeals } from "@/utils/api";
import Link from "next/link";
import { copyToClipboard } from "@/utils/clipboard";
import { usePathname } from "next/navigation";
import { requestFetchAllFeaturedDeals } from "@/network";
import * as m from "@/src/paraglide/messages";

interface Deal {
  id: number;
  title: string;
  title_ar?: string;
  store: string;
  store_ar?: string;
  discount: string;
  description: string;
  description_ar?: string;
  code?: string;
  type: "coupon" | "sale";
  color: string;
  slug?: string;
}

export function FeaturedDeals() {
  const pathname = usePathname();
  const localeCountry = pathname?.split("/")[1];
  const countrySlug = localeCountry?.split("-")[1];
  const locale = localeCountry?.split("-")[0];
  const isRTL = locale === "ar";
  const [savedDeals, setSavedDeals] = useState<Set<number>>(new Set());
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Fetch deals from server whenever country or language changes
  useEffect(() => {
    const fetchDealsData = async () => {
      try {
        setLoading(true);

        // Fetch deals with country filter
        const { data: allFeaturedDeals } = await requestFetchAllFeaturedDeals({
          countrySlug: countrySlug || "",
          currentPage: 1,
          pageSize: 10,
        });

        console.log("Featured deals API result:", allFeaturedDeals);
        console.log("First deal structure:", allFeaturedDeals?.[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchDealsData();
  }, [countrySlug]);

  useEffect(() => {
    checkScrollButtons();
  }, [scrollPosition, deals]);

  const checkScrollButtons = () => {
    const container = document.getElementById("deals-scroll-container");
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("deals-scroll-container");
    if (container) {
      const scrollAmount = 600;
      const newPosition =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });

      setTimeout(() => {
        setScrollPosition(container.scrollLeft);
      }, 300);
    }
  };

  const toggleSave = (dealId: number) => {
    setSavedDeals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dealId)) {
        newSet.delete(dealId);
        toast.success(m.DEAL_REMOVED_FROM_SAVED());
      } else {
        newSet.add(dealId);
        toast.success(m.DEAL_SAVED_SUCCESSFULLY());
      }
      return newSet;
    });
  };

  const copyCode = async (code: string, event?: React.MouseEvent) => {
    // Prevent card click navigation when clicking the copy button
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const success = await copyToClipboard(code);
    if (success) {
      toast.success(m.CODE_$CODE_COPIED({ code }));
    } else {
      toast.error(m.FAILED_TO_COPY_CODE());
    }
  };

  return (
    <section id="featured-deals" className="py-12 md:py-16 bg-background">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between mb-10 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div>
            <h2
              className="mb-2 text-[#111827]"
              style={{ fontSize: "36px", fontWeight: 700 }}
            >
              {m.FEATURED_DEALS()}
            </h2>
            <p className="text-[#6B7280]">
              {m.EXCLUSIVE_OFFERS_YOU_WONT_WANT_TO_MISS()}
            </p>
          </div>
          <Link href="/deals">
            <Button
              variant="outline"
              className="hidden md:flex border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white rounded-xl"
            >
              {m.VIEW_ALL()}
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-100 rounded-2xl border-2 border-[#111827] animate-pulse"
              />
            ))}
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6B7280] mb-4">
              {m.NO_DEALS_AVAILABLE_AT_THE_MOMENT()}
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Left Arrow */}
            {canScrollLeft && (
              <Button
                onClick={() => scroll(isRTL ? "right" : "left")}
                className={`absolute ${
                  isRTL ? "right-0" : "left-0"
                } top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all p-0 hidden md:flex items-center justify-center`}
                style={
                  isRTL ? { marginRight: "-24px" } : { marginLeft: "-24px" }
                }
              >
                {isRTL ? (
                  <ChevronRight className="h-6 w-6 text-[#111827]" />
                ) : (
                  <ChevronLeft className="h-6 w-6 text-[#111827]" />
                )}
              </Button>
            )}

            {/* Right Arrow */}
            {canScrollRight && (
              <Button
                onClick={() => scroll(isRTL ? "left" : "right")}
                className={`absolute ${
                  isRTL ? "left-0" : "right-0"
                } top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all p-0 hidden md:flex items-center justify-center`}
                style={
                  isRTL ? { marginLeft: "-24px" } : { marginRight: "-24px" }
                }
              >
                {isRTL ? (
                  <ChevronLeft className="h-6 w-6 text-[#111827]" />
                ) : (
                  <ChevronRight className="h-6 w-6 text-[#111827]" />
                )}
              </Button>
            )}

            {/* Scrollable Container */}
            <div
              id="deals-scroll-container"
              className="overflow-x-auto scrollbar-hide"
              onScroll={(e) => {
                setScrollPosition(e.currentTarget.scrollLeft);
                checkScrollButtons();
              }}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {/* Two-row grid */}
              <div className="grid grid-rows-2 grid-flow-col gap-6 pb-2">
                {deals.map((deal) => (
                  <Link
                    key={deal.id}
                    href={`/deal/${deal.slug || deal.id}`}
                    className="group relative bg-white rounded-2xl overflow-hidden border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all w-[320px] md:w-[360px] block"
                  >
                    {/* Left/Right Discount Bar with Perforated Edge */}
                    <div
                      className={`absolute ${
                        isRTL ? "right-0" : "left-0"
                      } top-0 bottom-0 w-[100px] flex items-center justify-center`}
                      style={{ backgroundColor: deal.color }}
                    >
                      {/* Perforated circles on edge */}
                      <div
                        className={`absolute ${
                          isRTL ? "left-0" : "right-0"
                        } top-0 bottom-0 w-2 flex flex-col justify-around`}
                      >
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 bg-white rounded-full ${
                              isRTL ? "-ml-1.5" : "-mr-1.5"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Vertical DISCOUNT text */}
                      <div
                        className="text-[#111827] tracking-[0.3em]"
                        style={{
                          writingMode: "vertical-rl",
                          textOrientation: "mixed",
                          fontSize: "18px",
                          fontWeight: 700,
                          transform: "rotate(180deg)",
                        }}
                      >
                        {m.DISCOUNT()}
                      </div>
                    </div>

                    {/* Main Content Area */}
                    <div
                      className={`${
                        isRTL ? "mr-[100px]" : "ml-[100px]"
                      } p-6 relative`}
                    >
                      {/* Heart Icon */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleSave(deal.id);
                        }}
                        className={`absolute top-4 ${
                          isRTL ? "left-4" : "right-4"
                        } p-2 rounded-full hover:bg-[#F0F7F0] transition-colors z-10`}
                      >
                        <Heart
                          className={`h-5 w-5 transition-colors ${
                            savedDeals.has(deal.id)
                              ? "fill-[#EF4444] text-[#EF4444]"
                              : "text-[#9CA3AF]"
                          }`}
                        />
                      </button>

                      {/* Content */}
                      <div className={`${isRTL ? "pl-8" : "pr-8"}`}>
                        <h3
                          className="mb-3 text-[#111827]"
                          style={{ fontSize: "20px", fontWeight: 600 }}
                        >
                          {isRTL && deal.title_ar ? deal.title_ar : deal.title}
                        </h3>

                        {deal.code && (
                          <div className="mb-4">
                            <div
                              className="text-[#111827] tracking-wide mb-3"
                              style={{ fontSize: "24px", fontWeight: 700 }}
                            >
                              {deal.code}
                            </div>
                          </div>
                        )}

                        <p className="text-[#6B7280] text-sm mb-2">
                          {isRTL && deal.description_ar
                            ? deal.description_ar
                            : deal.description}
                        </p>

                        <a
                          href="#"
                          className="text-sm text-[#5FB57A] hover:underline inline-block mb-6"
                        >
                          {m.TERMS_AND_CONDITIONS()}
                        </a>
                      </div>

                      {/* Copy Code Button */}
                      <Button
                        onClick={(e) => deal.code && copyCode(deal.code, e)}
                        className="w-full bg-white text-[#111827] border-2 border-[#111827] hover:bg-[#F0F7F0] rounded-xl"
                        style={{ fontWeight: 600 }}
                      >
                        <Copy
                          className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                        />
                        {m.APPLY_CODE()}
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
