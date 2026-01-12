"use client";
import { Store as StoreIcon, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store } from "@/domain-models";

interface PopularStoresProps {
  initialPopularStores: Store[];
}

export function PopularStores({ initialPopularStores }: PopularStoresProps) {
  const pathname = usePathname();
  const localeCountry = pathname?.split("/")[1];
  const locale = localeCountry?.split("-")[0];
  const isRTL = locale === "ar";

  function getStoreName(store: Store): string {
    if (isRTL) {
      return store.title_ar ?? "Store";
    }
    return store.title_en ?? "Store";
  }

  function getStoreLogo(store: Store): string {
    return store.profile_picture_url || "";
  }

  function getStoreSlug(store: Store): string {
    const slug = isRTL
      ? store.slug_ar ?? store.slug_en
      : store.slug_en ?? store.slug_ar;
    return slug || store.id.toString();
  }

  function getDealsCount(store: Store): number {
    // Default to 0 since Store model doesn't have deals_count
    return store.total_offers ?? 0;
  }

  return (
    <section className="py-12 md:py-16 bg-white">
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
              {locale === "en" ? "Popular Stores" : "المتاجر الشائعة"}
            </h2>
            <p className="text-[#6B7280]">
              {locale === "en"
                ? "Shop from your favorite brands and save more"
                : "تسوق من علاماتك التجارية المفضلة ووفر أكثر"}
            </p>
          </div>
          <Link href="/stores">
            <Button
              variant="outline"
              className={`hidden md:flex border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white rounded-xl ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              {locale === "en" ? "View All Stores" : "عرض جميع المتاجر"}
              <ArrowRight
                className={`h-4 w-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`}
              />
            </Button>
          </Link>
        </div>

        {!initialPopularStores || initialPopularStores.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-100 rounded-xl border-2 border-[#E5E7EB] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {initialPopularStores.map((store) => {
                const name = getStoreName(store);
                const logo = getStoreLogo(store);
                const slug = getStoreSlug(store);
                const dealsCount = getDealsCount(store);

                return (
                  <Link key={store.id} href={`/store/${slug}`}>
                    <div className="group bg-white rounded-xl border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all p-6 text-center">
                      <div className="h-16 w-16 mx-auto mb-4 rounded-lg border-2 border-[#E5E7EB] bg-white overflow-hidden flex items-center justify-center">
                        {logo ? (
                          <ImageWithFallback
                            src={logo}
                            alt={name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <StoreIcon className="h-8 w-8 text-[#9CA3AF]" />
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                        }}
                        className="text-[#111827] mb-2 line-clamp-1"
                      >
                        {name}
                      </div>
                      <div className="text-xs text-[#5FB57A] flex items-center justify-center gap-1">
                        <Tag className="h-3 w-3" />
                        {dealsCount} {locale === "en" ? "deals" : "عروض"}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile View All Button */}
            <div className="mt-8 flex justify-center md:hidden">
              <Link href="/stores">
                <Button
                  variant="outline"
                  className={`border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white rounded-xl ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  {locale === "en" ? "View All Stores" : "عرض جميع المتاجر"}
                  <ArrowRight
                    className={`h-4 w-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`}
                  />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
