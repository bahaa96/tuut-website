"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Deal } from "../../../domain-models";
import { DealCard } from "../../../../components/DealCard";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface DealsClientFiltersProps {
  initialDeals: Deal[];
  categories: any[];
  stores: any[];
  language: string;
  isRTL: boolean;
  country: string;
}

export default function DealsClientFilters({
  initialDeals,
  categories,
  stores,
  language,
  isRTL,
  country
}: DealsClientFiltersProps) {
  // State for filters and UI
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>(initialDeals);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedDiscount, setSelectedDiscount] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [savedDeals, setSavedDeals] = useState<Set<number | string>>(new Set());

  // Ref for search input to avoid triggering re-renders
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Calculate if any filters are active
  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedStore !== "all" || selectedDiscount !== "all";

  // Function to toggle save deal
  const toggleSave = useCallback((dealId: number | string) => {
    setSavedDeals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dealId)) {
        newSet.delete(dealId);
        toast.success(isRTL ? "تمت إزالة العرض من المحفوظات" : "Deal removed from saved");
      } else {
        newSet.add(dealId);
        toast.success(isRTL ? "تم حفظ العرض" : "Deal saved successfully");
      }
      return newSet;
    });
  }, [isRTL]);

  // Function to clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStore("all");
    setSelectedDiscount("all");
    setSortBy("featured");
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  }, []);

  // Apply filters whenever dependencies change
  useEffect(() => {
    let filtered = [...deals];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(deal =>
        deal.title?.toLowerCase().includes(query) ||
        deal.description?.toLowerCase().includes(query) ||
        deal.store_name?.toLowerCase().includes(query) ||
        deal.category_name?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(deal => deal.category_name === selectedCategory);
    }

    // Store filter
    if (selectedStore !== "all") {
      filtered = filtered.filter(deal => deal.store_name === selectedStore);
    }

    // Discount filter
    if (selectedDiscount !== "all") {
      filtered = filtered.filter(deal => {
        if (selectedDiscount === "10+") {
          return (deal.discount_percentage || 0) >= 10;
        } else if (selectedDiscount === "25+") {
          return (deal.discount_percentage || 0) >= 25;
        } else if (selectedDiscount === "50+") {
          return (deal.discount_percentage || 0) >= 50;
        }
        return true;
      });
    }

    // Sort
    switch (sortBy) {
      case "discount-high":
        filtered.sort((a, b) => (b.discount_percentage || 0) - (a.discount_percentage || 0));
        break;
      case "discount-low":
        filtered.sort((a, b) => (a.discount_percentage || 0) - (b.discount_percentage || 0));
        break;
      case "price-low":
        filtered.sort((a, b) => (a.discounted_price || 0) - (b.discounted_price || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.discounted_price || 0) - (a.discounted_price || 0));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime());
        break;
      case "ending-soon":
        filtered.sort((a, b) => {
          const aTime = a.expires_at ? new Date(a.expires_at).getTime() : Infinity;
          const bTime = b.expires_at ? new Date(b.expires_at).getTime() : Infinity;
          return aTime - bTime;
        });
        break;
      default: // featured
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredDeals(filtered);
  }, [deals, searchQuery, selectedCategory, selectedStore, selectedDiscount, sortBy]);

  // Update deals when initialDeals changes (SSR data)
  useEffect(() => {
    setDeals(initialDeals);
    setFilteredDeals(initialDeals);
  }, [initialDeals]);

  // Filter Section Component
  const FilterSection = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className={`text-sm font-medium text-[#111827] mb-2 block ${isRTL ? 'text-right' : 'text-left'}`}>
          {isRTL ? 'البحث' : 'Search'}
        </label>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280] ${isRTL ? 'right-3 left-auto' : ''}`} />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder={isRTL ? 'ابحث عن العروض...' : 'Search deals...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 ${isRTL ? 'pr-10 pl-auto' : ''}`}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className={`text-sm font-medium text-[#111827] mb-2 block ${isRTL ? 'text-right' : 'text-left'}`}>
          {isRTL ? 'الفئة' : 'Category'}
        </label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className={`w-full ${isRTL ? 'text-right' : ''}`}>
            <SelectValue placeholder={isRTL ? 'اختر الفئة' : 'Select category'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL ? 'جميع الفئات' : 'All Categories'}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name || category.title || category.label}>
                {category.name || category.title || category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Store Filter */}
      <div>
        <label className={`text-sm font-medium text-[#111827] mb-2 block ${isRTL ? 'text-right' : 'text-left'}`}>
          {isRTL ? 'المتجر' : 'Store'}
        </label>
        <Select value={selectedStore} onValueChange={setSelectedStore}>
          <SelectTrigger className={`w-full ${isRTL ? 'text-right' : ''}`}>
            <SelectValue placeholder={isRTL ? 'اختر المتجر' : 'Select store'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL ? 'جميع المتاجر' : 'All Stores'}</SelectItem>
            {stores.map((store) => (
              <SelectItem key={store.id} value={store.name || store.store_name || store.title}>
                {store.name || store.store_name || store.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Discount Filter */}
      <div>
        <label className={`text-sm font-medium text-[#111827] mb-2 block ${isRTL ? 'text-right' : 'text-left'}`}>
          {isRTL ? 'الخصم' : 'Discount'}
        </label>
        <Select value={selectedDiscount} onValueChange={setSelectedDiscount}>
          <SelectTrigger className={`w-full ${isRTL ? 'text-right' : ''}`}>
            <SelectValue placeholder={isRTL ? 'اختر الخصم' : 'Select discount'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL ? 'جميع الخصومات' : 'All Discounts'}</SelectItem>
            <SelectItem value="10+">{isRTL ? '10% أو أكثر' : '10% or more'}</SelectItem>
            <SelectItem value="25+">{isRTL ? '25% أو أكثر' : '25% or more'}</SelectItem>
            <SelectItem value="50+">{isRTL ? '50% أو أكثر' : '50% or more'}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div>
        <label className={`text-sm font-medium text-[#111827] mb-2 block ${isRTL ? 'text-right' : 'text-left'}`}>
          {isRTL ? 'الترتيب' : 'Sort by'}
        </label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className={`w-full ${isRTL ? 'text-right' : ''}`}>
            <SelectValue placeholder={isRTL ? 'اختر الترتيب' : 'Select sort'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">{isRTL ? 'المميزة' : 'Featured'}</SelectItem>
            <SelectItem value="discount-high">{isRTL ? 'أعلى خصم' : 'Highest Discount'}</SelectItem>
            <SelectItem value="discount-low">{isRTL ? 'أقل خصم' : 'Lowest Discount'}</SelectItem>
            <SelectItem value="price-low">{isRTL ? 'أقل سعر' : 'Lowest Price'}</SelectItem>
            <SelectItem value="price-high">{isRTL ? 'أعلى سعر' : 'Highest Price'}</SelectItem>
            <SelectItem value="newest">{isRTL ? 'الأحدث' : 'Newest'}</SelectItem>
            <SelectItem value="ending-soon">{isRTL ? 'ينتهي قريباً' : 'Ending Soon'}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          onClick={clearFilters}
          className="w-full bg-white border-2 border-[#111827] text-[#111827] rounded-lg h-12 shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)]"
        >
          {isRTL ? 'إزالة الفلاتر' : 'Clear Filters'}
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
            <h3 className="text-[#111827]" style={{ fontSize: '20px', fontWeight: 700 }}>
              {isRTL ? 'الفلاتر' : 'Filters'}
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
              <SlidersHorizontal className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'الفلاتر' : 'Filters'}
              {hasActiveFilters && (
                <Badge className="bg-[#5FB57A] text-white ml-2 mr-2">
                  {isRTL ? 'نشط' : 'Active'}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side={isRTL ? "right" : "left"} className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>{isRTL ? 'الفلاتر' : 'Filters'}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterSection />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Deals Grid */}
      <div className="lg:col-span-3">
        {filteredDeals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
            <p className="text-[#6B7280] mb-4" style={{ fontSize: '18px' }}>
              {isRTL ? 'لم يتم العثور على عروض' : 'No deals found'}
            </p>
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                className="bg-[#5FB57A] hover:bg-[#4FA669] text-white border-2 border-[#111827] rounded-lg"
              >
                {isRTL ? 'إزالة الفلاتر' : 'Clear Filters'}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {filteredDeals.map((deal) => (
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