"use client";

import { useState, useCallback, useRef } from "react";
import { Deal } from "@/domain-models";
import { DealCard } from "@/components/DealCard";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useAllCategories } from "./useAllCategories";
import { useAllStores } from "./useAllStores";
import { useAllDeals } from "./useAllDeals";

interface DealsClientProps {
  initialDeals: Deal[];
  language: string;
  isRTL: boolean;
  country: string;
}

export default function DealsClient({
  initialDeals,
  language,
  isRTL,
  country,
}: DealsClientProps) {
  const [savedDeals, setSavedDeals] = useState<Set<number>>(new Set());

  // Filter states
  const [selectedDiscount, setSelectedDiscount] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Pagination states for filters
  const [hasMoreCategories, setHasMoreCategories] = useState(true);
  const [hasMoreStores, setHasMoreStores] = useState(true);

  const categoryObserver = useRef<IntersectionObserver>();
  const storeObserver = useRef<IntersectionObserver>();

  const isRTLDir = isRTL ? "rtl" : "ltr";

  const {
    allCategories,
    isLoadingAllCategories,
    errorLoadingAllCategories,
    allCategoriesChangePage,
    allCategoriesCurrentPage,
  } = useAllCategories();
  const {
    allStores,
    isLoadingAllStores,
    errorLoadingAllStores,
    allStoresCurrentPage,
    allStoresChangePage,
    allStoresFilters,
    allStoresChangeFilters,
  } = useAllStores();

  const {
    allDeals,
    isLoadingAllDeals,
    errorLoadingAllDeals,
    allDealsCurrentPage,
    allDealsChangePage,
    allDealsFilters,
    allDealsChangeFilters,
  } = useAllDeals(initialDeals);

  const lastCategoryRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoadingAllCategories) return;
      if (categoryObserver.current) categoryObserver.current.disconnect();
      categoryObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreCategories) {
          allCategoriesChangePage(allCategoriesCurrentPage + 1);
        }
      });
      if (node) categoryObserver.current.observe(node);
    },
    [isLoadingAllCategories, hasMoreCategories, allCategoriesCurrentPage]
  );

  const lastStoreRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoadingAllStores) return;
      if (storeObserver.current) storeObserver.current.disconnect();
      storeObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreStores) {
          allStoresChangePage(allStoresCurrentPage + 1);
        }
      });
      if (node) storeObserver.current.observe(node);
    },
    [isLoadingAllStores, hasMoreStores, allStoresCurrentPage]
  );

  const toggleSave = (dealId: number) => {
    setSavedDeals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dealId)) {
        newSet.delete(dealId);
        toast.success(
          isRTL ? "تمت إزالة العرض من المحفوظات" : "Deal removed from saved"
        );
      } else {
        newSet.add(dealId);
        toast.success(isRTL ? "تم حفظ العرض" : "Deal saved successfully");
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    allDealsChangeFilters({
      searchText: "",
      categoryId: "",
      storeId: "",
    });
  };

  const hasActiveFilters =
    allDealsFilters.searchText ||
    allDealsFilters.categoryId !== "" ||
    allDealsFilters.storeId !== "" ||
    allDealsFilters.discount !== "all";

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label
          className="block mb-2 text-[#111827]"
          style={{ fontSize: "14px", fontWeight: 600 }}
        >
          {isRTL ? "البحث" : "Search"}
        </label>
        <div className="relative">
          <Search
            className={`absolute ${
              isRTL ? "right-3" : "left-3"
            } top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]`}
          />
          <Input
            type="text"
            placeholder={isRTL ? "ابحث عن عروض..." : "Search for deals..."}
            value={allDealsFilters.searchText}
            onChange={(e) =>
              allDealsChangeFilters({ searchText: e.target.value })
            }
            className={`${
              isRTL ? "pr-10" : "pl-10"
            } border-2 border-[#111827] rounded-lg h-12`}
            dir={isRTLDir}
          />
        </div>
      </div>

      {/* Category Filter with Pagination */}
      <div>
        <label
          className="block mb-2 text-[#111827]"
          style={{ fontSize: "14px", fontWeight: 600 }}
        >
          {isRTL ? "الفئة" : "Category"}
        </label>
        <Select
          value={allDealsFilters.categoryId}
          onValueChange={(value) =>
            allDealsChangeFilters({ categoryId: value })
          }
        >
          <SelectTrigger className="border-2 border-[#111827] rounded-lg h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {isRTL ? "جميع الفئات" : "All Categories"}
            </SelectItem>
            {allCategories.map((cat, index) => (
              <SelectItem
                key={cat.id}
                value={cat.id.toString()}
                ref={
                  index === allCategories.length - 1
                    ? lastCategoryRef
                    : undefined
                }
              >
                {isRTL ? cat.title_ar : cat.title_en}
              </SelectItem>
            ))}
            {isLoadingAllCategories && (
              <div className="p-2 text-center text-sm text-[#6B7280]">
                {isRTL ? "جاري التحميل..." : "Loading..."}
              </div>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Store Filter with Pagination */}
      <div>
        <label
          className="block mb-2 text-[#111827]"
          style={{ fontSize: "14px", fontWeight: 600 }}
        >
          {isRTL ? "المتجر" : "Store"}
        </label>
        <Select
          value={allDealsFilters.storeId}
          onValueChange={(value) => allDealsChangeFilters({ storeId: value })}
        >
          <SelectTrigger className="border-2 border-[#111827] rounded-lg h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {isRTL ? "جميع المتاجر" : "All Stores"}
            </SelectItem>
            {allStores.map((store, index) => (
              <SelectItem
                key={store.id}
                value={store.id.toString()}
                ref={index === allStores.length - 1 ? lastStoreRef : undefined}
              >
                {isRTL ? store.title_ar : store.title_en}
              </SelectItem>
            ))}
            {isLoadingAllStores && (
              <div className="p-2 text-center text-sm text-[#6B7280]">
                {isRTL ? "جاري التحميل..." : "Loading..."}
              </div>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Discount Filter */}
      <div>
        <label
          className="block mb-2 text-[#111827]"
          style={{ fontSize: "14px", fontWeight: 600 }}
        >
          {isRTL ? "نسبة الخصم" : "Discount"}
        </label>
        <Select value={selectedDiscount} onValueChange={setSelectedDiscount}>
          <SelectTrigger className="border-2 border-[#111827] rounded-lg h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {isRTL ? "أي خصم" : "Any Discount"}
            </SelectItem>
            <SelectItem value="10">
              {isRTL ? "10% فأكثر" : "10% or more"}
            </SelectItem>
            <SelectItem value="25">
              {isRTL ? "25% فأكثر" : "25% or more"}
            </SelectItem>
            <SelectItem value="50">
              {isRTL ? "50% فأكثر" : "50% or more"}
            </SelectItem>
            <SelectItem value="75">
              {isRTL ? "75% فأكثر" : "75% or more"}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort By */}
      <div>
        <label
          className="block mb-2 text-[#111827]"
          style={{ fontSize: "14px", fontWeight: 600 }}
        >
          {isRTL ? "ترتيب حسب" : "Sort By"}
        </label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="border-2 border-[#111827] rounded-lg h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">
              {isRTL ? "الأحدث" : "Newest"}
            </SelectItem>
            <SelectItem value="discount-high">
              {isRTL ? "أعلى خصم" : "Highest Discount"}
            </SelectItem>
            <SelectItem value="discount-low">
              {isRTL ? "أقل خصم" : "Lowest Discount"}
            </SelectItem>
            <SelectItem value="price-high">
              {isRTL ? "أعلى سعر" : "Highest Price"}
            </SelectItem>
            <SelectItem value="price-low">
              {isRTL ? "أقل سعر" : "Lowest Price"}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          onClick={clearFilters}
          variant="outline"
          className="w-full border-2 border-[#111827] rounded-lg h-12"
        >
          <X className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`} />
          {isRTL ? "إزالة الفلاتر" : "Clear Filters"}
        </Button>
      )}
    </div>
  );

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
              {isRTL ? "الفلاتر" : "Filters"}
            </h3>
            <SlidersHorizontal className="h-5 w-5 text-[#5FB57A]" />
          </div>
          <FilterSection />
        </div>
      </aside>

      {/* Mobile Filters */}
      <div className="lg:hidden mb-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="w-full bg-white border-2 border-[#111827] text-[#111827] rounded-lg h-12 shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)]">
              <SlidersHorizontal
                className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`}
              />
              {isRTL ? "الفلاتر" : "Filters"}
              {hasActiveFilters && (
                <Badge className="bg-[#5FB57A] text-white ml-2 mr-2">
                  {isRTL ? "نشط" : "Active"}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side={isRTL ? "right" : "left"}
            className="w-[300px] sm:w-[400px]"
          >
            <SheetHeader>
              <SheetTitle>{isRTL ? "الفلاتر" : "Filters"}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterSection />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Deals Grid */}
      <div className="lg:col-span-3">
        {allDeals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
            <p className="text-[#6B7280] mb-4" style={{ fontSize: "18px" }}>
              {isRTL ? "لم يتم العثور على عروض" : "No deals found"}
            </p>
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                className="bg-[#5FB57A] hover:bg-[#4FA669] text-white border-2 border-[#111827] rounded-lg"
              >
                {isRTL ? "إزالة الفلاتر" : "Clear Filters"}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {allDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                isRTL={isRTL}
                isSaved={savedDeals.has(deal.id)}
                onToggleSave={toggleSave}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
