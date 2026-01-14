"use client";

import { ShoppingBag } from "lucide-react";
import { ProductCard } from "./ProductCard";

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

interface ProductsTabProps {
  products: Product[];
  locale: string;
  isRTL: boolean;
  localeCountry: string;
}

export function ProductsTab({
  products,
  locale,
  localeCountry,
}: ProductsTabProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-12 w-12 text-[#9CA3AF] mx-auto mb-4" />
        <p className="text-[#6B7280]">
          {locale === "ar" ? "لم يتم العثور على منتجات" : "No products found"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          locale={locale}
          localeCountry={localeCountry}
        />
      ))}
    </div>
  );
}

