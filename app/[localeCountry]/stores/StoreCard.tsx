import { Store } from "@/domain-models";
import { getLocale } from "@/src/paraglide/runtime";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Store as StoreIcon, Tag, Star, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import * as m from "@/src/paraglide/messages";

function StoreCard({
  store,
  viewMode,
}: {
  store: Store;
  viewMode: "grid" | "list";
}) {
  const language = getLocale();
  const isRTL = language === "ar";

  const name = language === "ar" ? store.title_ar : store.title_en;
  const description =
    language === "ar" ? store.description_ar : store.description_en;
  const logo = store.profile_picture_url;
  const dealsCount = store.total_offers;
  const isFeatured = store.featured || store.is_featured;
  const slug = language === "ar" ? store.slug_ar : store.slug_en;

  if (viewMode === "list") {
    return (
      <Link href={`/store/${slug}`}>
        <div
          className={`group bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all overflow-hidden`}
        >
          <div
            className={`flex ${
              isRTL ? "flex-row-reverse" : ""
            } items-center gap-6 p-6`}
          >
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="h-20 w-20 rounded-xl border-2 border-[#E5E7EB] bg-white overflow-hidden flex items-center justify-center p-2">
                {logo ? (
                  <ImageWithFallback
                    src={logo}
                    alt={`${name} ${m.LOGO()} - ${dealsCount}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <StoreIcon className="h-10 w-10 text-[#9CA3AF]" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
              <div
                className={`flex items-center gap-2 mb-2 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <h3
                  className="text-[#111827]"
                  style={{ fontSize: "20px", fontWeight: 600 }}
                >
                  {name}
                </h3>
                {isFeatured && (
                  <Badge className="bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]">
                    <Star
                      className={`h-3 w-3 ${
                        isRTL ? "ml-1" : "mr-1"
                      } fill-current`}
                    />
                    {language === "en" ? "Featured" : "مميز"}
                  </Badge>
                )}
              </div>
              {description && (
                <p className="text-[#6B7280] text-sm mb-3 line-clamp-2">
                  {description}
                </p>
              )}
              <div
                className={`flex items-center gap-4 text-sm ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <span className="text-[#5FB57A] flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  {dealsCount} {language === "en" ? "deals" : "عروض"}
                </span>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-[#E8F3E8] flex items-center justify-center group-hover:bg-[#5FB57A] transition-colors">
                <ChevronDown
                  className={`h-5 w-5 text-[#5FB57A] group-hover:text-white ${
                    isRTL ? "rotate-90" : "-rotate-90"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/store/${slug}`}>
      <div className="group bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all overflow-hidden">
        {/* Featured Badge */}
        {isFeatured && (
          <div
            className={`bg-[#FEF3C7] px-4 py-2 border-b-2 border-[#111827] ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            <Badge className="bg-[#F59E0B] text-white border-0">
              <Star
                className={`h-3 w-3 ${isRTL ? "ml-1" : "mr-1"} fill-current`}
              />
              {language === "en" ? "Featured Store" : "متجر مميز"}
            </Badge>
          </div>
        )}

        <div className="p-6">
          {/* Logo */}
          <div className="h-24 w-24 mx-auto mb-4 rounded-xl border-2 border-[#E5E7EB] bg-white overflow-hidden flex items-center justify-center p-0">
            {logo ? (
              <ImageWithFallback
                src={logo}
                alt={`${name} ${m.LOGO()} - ${dealsCount}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <StoreIcon className="h-12 w-12 text-[#9CA3AF]" />
            )}
          </div>

          {/* Content */}
          <div className="text-center">
            <h3
              className="mb-2 text-[#111827]"
              style={{ fontSize: "18px", fontWeight: 600 }}
            >
              {name}
            </h3>
            {description && (
              <p className="text-[#6B7280] text-sm mb-4 line-clamp-2">
                {description}
              </p>
            )}
            <div className="flex items-center justify-center gap-2 text-sm text-[#5FB57A]">
              <Tag className="h-4 w-4" />
              <span style={{ fontWeight: 600 }}>
                {dealsCount} {language === "en" ? "Active Deals" : "عروض نشطة"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default StoreCard;
