"use client";

import Link from "next/link";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

interface Product {
  id: string;
  name?: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  price?: number;
  image_url?: string;
  slug?: string;
  category?: string;
}

interface ProductCardProps {
  product: Product;
  locale: string;
  localeCountry: string;
}

function getProductName(product: Product, locale: string): string {
  return locale === "ar"
    ? product.name_ar || product.name || ""
    : product.name || product.name_ar || "";
}

export function ProductCard({
  product,
  locale,
  localeCountry,
}: ProductCardProps) {
  return (
    <Link href={`/${localeCountry}/product/${product.slug || product.id}`}>
      <div className="group bg-white rounded-xl border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all overflow-hidden">
        {product.image_url && (
          <div className="aspect-square overflow-hidden border-b-2 border-[#111827]">
            <ImageWithFallback
              src={product.image_url}
              alt={getProductName(product, locale)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        )}
        <div className="p-4">
          <h3
            className="text-[#111827] mb-2 line-clamp-2"
            style={{ fontSize: "14px", fontWeight: 600 }}
          >
            {getProductName(product, locale)}
          </h3>
          {product.price && (
            <p className="text-[#5FB57A]" style={{ fontSize: "16px", fontWeight: 700 }}>
              ${product.price}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

