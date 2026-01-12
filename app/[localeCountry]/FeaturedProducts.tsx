import {
  Heart,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Star,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getLocale } from "@/src/paraglide/runtime";
import { getCountryValue } from "@/utils/countryHelpers";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Translations for the featured products section
const translations = {
  en: {
    featuredProducts: {
      title: "Featured Products",
      subtitle: "Hot products with exclusive deals from top brands",
      viewAll: "View All Products",
      shopNow: "Shop Now",
      outOfStock: "Out of Stock",
      topRated: "Top Rated",
    },
  },
  ar: {
    featuredProducts: {
      title: "منتجات مميزة",
      subtitle: "منتجات مميزة مع عروض حصرية من أفضل العلامات التجارية",
      viewAll: "عرض جميع المنتجات",
      shopNow: "تسوق الآن",
      outOfStock: "غير متوفر",
      topRated: "الأعلى تقييماً",
    },
  },
};

interface Product {
  id: number | string;
  asin?: string;
  title?: string;
  name?: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  price?: number;
  original_price?: number;
  currency?: string;
  rating?: number;
  ratings_count?: number;
  available?: boolean;
  store?: string;
  store_name?: string;
  url?: string;
  images?: string[] | string;
  image_url?: string;
  category?: string;
  category_ar?: string;
  slug?: string;
}

interface FeaturedProductsProps {
  initialFeaturedProducts: Product[];
}

export function FeaturedProducts({
  initialFeaturedProducts,
}: FeaturedProductsProps) {
  const pathname = usePathname();
  const localeCountry = pathname?.split("/")[1];
  const country = localeCountry?.split("-")[1];
  const language = getLocale();
  const isRTL = language === "ar";

  const [savedProducts, setSavedProducts] = useState<Set<number | string>>(
    new Set()
  );
  const [error, setError] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    checkScrollButtons();
  }, [scrollPosition, initialFeaturedProducts]);

  const checkScrollButtons = () => {
    const container = document.getElementById("products-scroll-container");
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("products-scroll-container");
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

  const toggleSave = (productId: number | string) => {
    setSavedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
        toast.success(
          isRTL
            ? "تم إزالة المنتج من المفضلة"
            : "Product removed from favorites"
        );
      } else {
        newSet.add(productId);
        toast.success(
          isRTL ? "تم حفظ المنتج في المفضلة!" : "Product saved to favorites!"
        );
      }
      return newSet;
    });
  };

  const getProductName = (product: Product): string => {
    if (isRTL && product.name_ar) {
      return product.name_ar;
    }
    return (
      product.title ||
      product.name ||
      (isRTL ? "منتج بدون اسم" : "Unnamed Product")
    );
  };

  const getProductDescription = (product: Product): string => {
    if (isRTL && product.description_ar) {
      return product.description_ar;
    }
    return product.description || "";
  };

  const getImageUrl = (product: Product): string => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    if (typeof product.images === "string") {
      return product.images;
    }
    return product.image_url || "";
  };

  return (
    <section className="py-12 md:py-16 bg-background">
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
              {translations[language].featuredProducts.title}
            </h2>
            <p className="text-[#6B7280]">
              {translations[language].featuredProducts.subtitle}
            </p>
          </div>
          <Link href="/products">
            <Button
              variant="outline"
              className="hidden md:flex border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white rounded-xl"
            >
              {translations[language].featuredProducts.viewAll}
            </Button>
          </Link>
        </div>

        {/* {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-gray-100 rounded-2xl border-2 border-[#111827] animate-pulse"
              />
            ))}
          </div>
        ) : ( */}
        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <Button
              onClick={() => scroll(isRTL ? "right" : "left")}
              className={`absolute ${
                isRTL ? "right-0" : "left-0"
              } top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all p-0 flex items-center justify-center`}
              style={isRTL ? { marginRight: "-24px" } : { marginLeft: "-24px" }}
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
              } top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all p-0 flex items-center justify-center`}
              style={isRTL ? { marginLeft: "-24px" } : { marginRight: "-24px" }}
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
            id="products-scroll-container"
            className="overflow-x-auto scrollbar-hide -mx-2 px-2"
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
            {/* Grid */}
            <div className="inline-flex gap-6 pb-2 items-stretch">
              {initialFeaturedProducts.map((product) => {
                const imageUrl = getImageUrl(product);
                const name = getProductName(product);
                const description = getProductDescription(product);
                const discountPercentage =
                  product.original_price && product.price
                    ? Math.round(
                        ((product.original_price - product.price) /
                          product.original_price) *
                          100
                      )
                    : 0;
                const hasDiscount = discountPercentage > 0;

                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug || product.id}`}
                    className="group bg-white rounded-2xl overflow-hidden border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] transition-all flex flex-col w-[320px] flex-shrink-0"
                  >
                    {/* Image */}
                    <div className="relative h-40 md:h-56 overflow-hidden bg-gradient-to-br from-[#E8F3E8] to-[#D1E7D1]">
                      {imageUrl && imageUrl.trim() !== "" ? (
                        <img
                          src={imageUrl}
                          alt={name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const fallback =
                              target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-full h-full flex items-center justify-center ${
                          imageUrl ? "hidden" : ""
                        }`}
                      >
                        <Package className="h-16 w-16 text-[#5FB57A] opacity-50" />
                      </div>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                          {product.rating && product.rating >= 4 && (
                            <Badge className="bg-[#5FB57A] text-white border-0 rounded-lg">
                              <Star className="h-3 w-3 mr-1 fill-white" />
                              {translations[language].featuredProducts.topRated}
                            </Badge>
                          )}
                          {product.available === false && (
                            <Badge
                              variant="destructive"
                              className="border-0 rounded-lg"
                            >
                              {
                                translations[language].featuredProducts
                                  .outOfStock
                              }
                            </Badge>
                          )}
                        </div>
                        {hasDiscount && (
                          <Badge className="bg-[#EF4444] text-white border-0 rounded-lg">
                            -{discountPercentage}%
                          </Badge>
                        )}
                      </div>

                      {/* Heart Icon */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleSave(product.id);
                        }}
                        className={`absolute bottom-3 ${
                          isRTL ? "left-3" : "right-3"
                        } p-2 rounded-full bg-white/90 hover:bg-white border-2 border-[#111827] transition-colors z-10`}
                      >
                        <Heart
                          className={`h-5 w-5 transition-colors ${
                            savedProducts.has(product.id)
                              ? "fill-[#EF4444] text-[#EF4444]"
                              : "text-[#9CA3AF]"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Content */}
                    <div
                      className={`p-5 flex-1 flex flex-col ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {/* Store Name */}
                      {(product.store || product.store_name) && (
                        <div className="mb-2">
                          <span className="text-sm text-[#6B7280]">
                            {product.store || product.store_name}
                          </span>
                        </div>
                      )}

                      {/* Product Name */}
                      <h3
                        className="mb-2 text-[#111827] line-clamp-2 flex-1"
                        style={{ fontSize: "18px", fontWeight: 600 }}
                        title={name}
                      >
                        {name}
                      </h3>

                      {/* Description */}
                      {description && (
                        <p className="text-[#6B7280] text-sm mb-3 line-clamp-2">
                          {description}
                        </p>
                      )}

                      {/* Rating */}
                      {product.rating && (
                        <div
                          className={`flex items-center gap-2 mb-3 ${
                            isRTL ? "flex-row-reverse" : ""
                          }`}
                        >
                          <div
                            className={`flex items-center gap-1 ${
                              isRTL ? "flex-row-reverse" : ""
                            }`}
                          >
                            <Star className="h-4 w-4 fill-[#FBBF24] text-[#FBBF24]" />
                            <span style={{ fontWeight: 600 }}>
                              {product.rating.toFixed(1)}
                            </span>
                          </div>
                          {product.ratings_count && (
                            <span className="text-sm text-[#6B7280]">
                              ({product.ratings_count})
                            </span>
                          )}
                        </div>
                      )}

                      {/* Price */}
                      <div
                        className={`mb-4 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        <div
                          className={`flex items-baseline gap-2 ${
                            isRTL ? "flex-row-reverse" : ""
                          }`}
                        >
                          <span
                            className="text-[#5FB57A]"
                            style={{ fontSize: "24px", fontWeight: 700 }}
                          >
                            {product.price?.toFixed(2)}{" "}
                            {product.currency || "SAR"}
                          </span>
                          {hasDiscount && product.original_price && (
                            <span className="text-[#9CA3AF] line-through text-sm">
                              {product.original_price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Shop Now Button */}
                      <Button
                        className="w-full bg-[#5FB57A] text-white border-2 border-[#111827] hover:bg-[#4FA56A] rounded-xl shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] transition-all"
                        style={{ fontWeight: 600 }}
                      >
                        <TrendingUp
                          className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                        />
                        {translations[language].featuredProducts.shopNow}
                      </Button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        {/* )} */}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
