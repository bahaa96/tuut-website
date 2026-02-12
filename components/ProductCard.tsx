"use client";

import { ExternalLink, Star, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Product } from "../app/[localeCountry]/types";
import { useParams } from "next/navigation";
import * as m from "@/src/paraglide/messages";
import priceWithCurrency from "@/utils/priceWithCurrency";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const params = useParams();
  const localeCountry = params?.localeCountry as string;
  const language = localeCountry.split("-")[0];
  const isRTL = language === "ar";

  const title = product.title || "Product";
  const description = product.description || "";
  const storeName = product.store || "Store";
  const imageUrl =
    product.images && product.images.length > 0 ? product.images[0] : null;

  // Calculate discount percentage
  const discountPercentage =
    product.price && product.original_price
      ? Math.round(
          ((product.original_price - product.price) / product.original_price) *
            100
        )
      : 0;
  const hasDiscount = discountPercentage > 0;

  return (
    <Link
      href={`/${localeCountry}/product/${product.slug}`}
      className="group bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] transition-all overflow-hidden flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-4"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className={`w-full h-full flex items-center justify-center ${
            imageUrl ? "hidden" : ""
          }`}
        >
          <ShoppingCart className="h-16 w-16 text-[#5FB57A] opacity-50" />
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-red-500 text-white border-0 rounded-lg px-2 py-1 text-xs font-semibold">
            -{discountPercentage}%
          </span>
        )}
      </div>

      {/* Content */}
      <div
        className={`p-5 flex-1 flex flex-col ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {/* Store Name */}
        {storeName && (
          <div
            className={`text-sm text-[#6B7280] mb-2 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {storeName}
          </div>
        )}

        {/* Product Name */}
        <h3
          className="mb-2 text-[#111827] line-clamp-2 flex-1 min-h-[3rem]"
          style={{ fontSize: "18px", fontWeight: 600, lineHeight: "1.5" }}
          title={title}
        >
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-[#6B7280] text-sm mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span style={{ fontWeight: 600 }}>
                {product.rating.toFixed(1)}
              </span>
            </div>
          </div>
        )}

        {/* Price */}
        <div className={`mb-4 ${isRTL ? "text-right" : "text-left"}`}>
          <div className="flex items-baseline gap-2">
            <span
              className="text-[#5FB57A]"
              style={{ fontSize: "24px", fontWeight: 700 }}
            >
              {product.price} {product.currency}
            </span>
            {hasDiscount && product.original_price && (
              <span className="text-[#6B7280] line-through">
                {product.original_price} {product.currency}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        {product.url && (
          <Button
            className={`w-full bg-[#5FB57A] hover:bg-[#4FA669] text-white border-2 border-[#111827] rounded-lg shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all ${
              isRTL ? "flex-row-reverse" : ""
            }`}
            style={{ fontWeight: 600 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(product.url, "_blank", "noopener,noreferrer");
            }}
          >
            <ExternalLink className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {m.VIEW_PRODUCT()}
          </Button>
        )}
      </div>
    </Link>
  );
}
