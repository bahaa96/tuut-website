"use client";

import { useState, useEffect } from "react";
import { Product } from "../types";
import ProductCard from "@/components/ProductCard";
import FilterSection from "@/components/FilterSection";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import * as m from "@/src/paraglide/messages";
import { useParams } from "next/navigation";
import useAllProducts from "./useAllProducts";

interface ProductsClientPageProps {
  initialProducts: Product[];
  initialSearchParams?: {
    search?: string;
    category?: string;
    store?: string;
    discount?: string;
    min_price?: string;
    max_price?: string;
    sort?: string;
    page?: string;
  };
}

export default function ProductsClientPage({
  initialProducts,
  initialSearchParams,
}: ProductsClientPageProps) {
  const [selectedDiscount, setSelectedDiscount] = useState(
    initialSearchParams?.discount || "all"
  );
  const [sortBy, setSortBy] = useState(initialSearchParams?.sort || "newest");

  const params = useParams();
  const localeCountry = params?.localeCountry as string;
  const language = localeCountry.split("-")[0];
  const isRTL = language === "ar";

  const {
    allProducts,
    isLoadingAllProducts,
    errorLoadingAllProducts,
    allProductsCurrentPage,
    allProductsPageSize,
    allProductsFilters,
    isAllProductsLoadingMore,
    allProductsChangePage,
    allProductsChangeFilters,
  } = useAllProducts(initialProducts);

  // Initialize filters from URL params
  useEffect(() => {
    if (initialSearchParams) {
      allProductsChangeFilters({
        searchText: initialSearchParams.search || "",
        categoryId: initialSearchParams.category || "",
      });

      // Set sort and discount from URL params
      if (initialSearchParams.sort) {
        setSortBy(initialSearchParams.sort);
      }
      if (initialSearchParams.discount) {
        setSelectedDiscount(initialSearchParams.discount);
      }
    }
  }, [initialSearchParams]);

  const clearFilters = () => {
    allProductsChangeFilters({
      searchText: "",
      categoryId: "",
    });
  };

  const hasActiveFilters =
    allProductsFilters.searchText || allProductsFilters.categoryId;

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Desktop Filters Sidebar */}
      <aside className="hidden lg:block">
        <div className="bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-6 sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h3
              className="text-[#111827]"
              style={{ fontSize: "20px", fontWeight: 700 }}
            >
              {m.FILTERS()}
            </h3>
            <SlidersHorizontal className="h-5 w-5 text-[#5FB57A]" />
          </div>
          <FilterSection
            searchQuery={allProductsFilters.searchText}
            selectedCategoryId={allProductsFilters.categoryId}
            selectedDiscount={selectedDiscount}
            sortBy={sortBy}
            onSearchChange={(value) =>
              allProductsChangeFilters({ searchText: value })
            }
            onCategoryChange={(value) =>
              allProductsChangeFilters({ categoryId: value })
            }
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
              <SlidersHorizontal
                className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`}
              />
              {language === "ar" ? "الفلاتر" : "Filters"}
              {hasActiveFilters && (
                <Badge className="bg-[#5FB57A] text-white ml-2 mr-2">
                  {language === "ar" ? "نشط" : "Active"}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side={isRTL ? "right" : "left"}
            className="w-[300px] sm:w-[400px]"
          >
            <SheetHeader>
              <SheetTitle>{m.FILTERS()}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterSection
                searchQuery={allProductsFilters.searchText}
                selectedCategoryId={allProductsFilters.categoryId}
                selectedDiscount={selectedDiscount}
                sortBy={sortBy}
                onSearchChange={(value) =>
                  allProductsChangeFilters({ searchText: value })
                }
                onCategoryChange={(value) =>
                  allProductsChangeFilters({ categoryId: value })
                }
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
        {allProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
            <p className="text-[#6B7280] mb-4" style={{ fontSize: "18px" }}>
              {isLoadingAllProducts
                ? m.LOADING_PRODUCTS()
                : m.NO_PRODUCTS_FOUND_MATCHING_SEARCH()}
            </p>
            {isLoadingAllProducts ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5FB57A] mx-auto"></div>
            ) : (
              hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  className="bg-[#5FB57A] hover:bg-[#4FA669] text-white border-2 border-[#111827] rounded-lg"
                >
                  {m.CLEAR_FILTERS()}
                </Button>
              )
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
