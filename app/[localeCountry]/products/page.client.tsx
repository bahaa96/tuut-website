"use client";

import { useState } from "react";
import { Product } from "../types";
import ProductCard from "@/components/ProductCard";
import FilterSection from "@/components/FilterSection";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface ProductsClientPageProps {
  initialProducts: Product[];
  language: string;
  isRTL: boolean;
  country: string;
}

export default function ProductsClientPage({
  initialProducts,
  language,
  isRTL,
  country
}: ProductsClientPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDiscount, setSelectedDiscount] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Filter products based on search and filters
  const filteredProducts = initialProducts.filter(product => {
    const matchesSearch = !searchQuery.trim() ||
      product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.store?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "all" ||
      product.categories?.includes(selectedCategory);

    const matchesDiscount = selectedDiscount === "all" ||
      (product.price && product.original_price &&
        Math.round(((product.original_price - product.price) / product.original_price) * 100) >= parseInt(selectedDiscount));

    return matchesSearch && matchesCategory && matchesDiscount;
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.price || 0) - (b.price || 0);
      case "price-high":
        return (b.price || 0) - (a.price || 0);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "newest":
      default:
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    }
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDiscount("all");
    setSortBy("newest");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedDiscount !== "all";

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Desktop Filters Sidebar */}
      <aside className="hidden lg:block">
        <div className="bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-6 sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#111827]" style={{ fontSize: '20px', fontWeight: 700 }}>
              {language === 'ar' ? 'الفلاتر' : 'Filters'}
            </h3>
            <SlidersHorizontal className="h-5 w-5 text-[#5FB57A]" />
          </div>
          <FilterSection
            language={language}
            isRTL={isRTL}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            selectedDiscount={selectedDiscount}
            sortBy={sortBy}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            onDiscountChange={setSelectedDiscount}
            onSortChange={setSortBy}
            onClearFilters={clearFilters}
          />
        </div>
      </aside>

      {/* Mobile Filters */}
      <div className="lg:hidden mb-6 col-span-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="w-full bg-white border-2 border-[#111827] text-[#111827] rounded-lg h-12 shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)]">
              <SlidersHorizontal className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {language === 'ar' ? 'الفلاتر' : 'Filters'}
              {hasActiveFilters && (
                <Badge className="bg-[#5FB57A] text-white ml-2 mr-2">
                  {language === 'ar' ? 'نشط' : 'Active'}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side={isRTL ? "right" : "left"} className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>{language === 'ar' ? 'الفلاتر' : 'Filters'}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterSection
                language={language}
                isRTL={isRTL}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                selectedDiscount={selectedDiscount}
                sortBy={sortBy}
                onSearchChange={setSearchQuery}
                onCategoryChange={setSelectedCategory}
                onDiscountChange={setSelectedDiscount}
                onSortChange={setSortBy}
                onClearFilters={clearFilters}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Products Grid */}
      <div className="lg:col-span-3">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
            <p className="text-[#6B7280] mb-4" style={{ fontSize: '18px' }}>
              {language === 'ar' ? 'لم يتم العثور على منتجات' : 'No products found'}
            </p>
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                className="bg-[#5FB57A] hover:bg-[#4FA669] text-white border-2 border-[#111827] rounded-lg"
              >
                {language === 'ar' ? 'إزالة الفلاتر' : 'Clear Filters'}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                language={language}
                isRTL={isRTL}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}