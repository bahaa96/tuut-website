"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { useParams } from "next/navigation";
import * as m from "@/src/paraglide/messages";

interface FilterSectionProps {
  searchQuery?: string;
  selectedCategoryId?: string;
  selectedDiscount?: string;
  sortBy?: string;
  onSearchChange?: (value: string) => void;
  onCategoryChange?: (value: string) => void;
  onStoreChange?: (value: string) => void;
  onDiscountChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
  onClearFilters?: () => void;
}

export default function FilterSection({
  searchQuery = "",
  selectedCategoryId,
  selectedDiscount = "all",
  sortBy = "newest",
  onSearchChange = () => {},
  onCategoryChange = () => {},
  onDiscountChange = () => {},
  onSortChange = () => {},
  onClearFilters = () => {},
}: FilterSectionProps) {
  const params = useParams();
  const localeCountry = params?.localeCountry as string;
  const language = localeCountry?.split("-")[0];
  const isRTL = language === "ar";

  const categories = [
    { id: "all", name: language === "ar" ? "جميع الفئات" : "All Categories" },
    {
      id: "electronics",
      name: language === "ar" ? "إلكترونيات" : "Electronics",
    },
    { id: "fashion", name: language === "ar" ? "أزياء" : "Fashion" },
    {
      id: "home",
      name: language === "ar" ? "المنزل والحديقة" : "Home & Garden",
    },
    { id: "sports", name: language === "ar" ? "رياضة" : "Sports" },
    { id: "beauty", name: language === "ar" ? "جمال" : "Beauty" },
    { id: "toys", name: language === "ar" ? "ألعاب" : "Toys & Games" },
  ];

  const sortOptions = [
    { value: "newest", name: language === "ar" ? "الأحدث" : "Newest" },
    {
      value: "price-low",
      name: language === "ar" ? "السعر: من الأقل للأعلى" : "Price: Low to High",
    },
    {
      value: "price-high",
      name: language === "ar" ? "السعر: من الأعلى للأقل" : "Price: High to Low",
    },
    {
      value: "rating",
      name: language === "ar" ? "الأعلى تقييماً" : "Highest Rated",
    },
  ];

  const discountOptions = [
    { value: "all", name: language === "ar" ? "أي خصم" : "Any Discount" },
    { value: "10", name: language === "ar" ? "10% فأكثر" : "10% or more" },
    { value: "25", name: language === "ar" ? "25% فأكثر" : "25% or more" },
    { value: "50", name: language === "ar" ? "50% فأكثر" : "50% or more" },
    { value: "75", name: language === "ar" ? "75% فأكثر" : "75% or more" },
  ];

  const hasActiveFilters =
    searchQuery || selectedCategoryId || selectedDiscount !== "all";

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label
          className="block mb-2 text-[#111827]"
          style={{ fontSize: "14px", fontWeight: 600 }}
        >
          {m.SEARCH()}
        </label>
        <div className="relative">
          <Search
            className={`absolute ${
              isRTL ? "right-3" : "left-3"
            } top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]`}
          />
          <Input
            type="text"
            placeholder={m.SEARCH_FOR_PRODUCTS()}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`${
              isRTL ? "pr-10" : "pl-10"
            } border-2 border-[#111827] rounded-lg h-12`}
            dir={isRTL ? "rtl" : "ltr"}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label
          className="block mb-2 text-[#111827]"
          style={{ fontSize: "14px", fontWeight: 600 }}
        >
          {m.CATEGORY()}
        </label>
        <Select value={selectedCategoryId} onValueChange={onCategoryChange}>
          <SelectTrigger className="border-2 border-[#111827] rounded-lg h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Discount Filter */}
      <div>
        <label
          className="block mb-2 text-[#111827]"
          style={{ fontSize: "14px", fontWeight: 600 }}
        >
          {m.DISCOUNT()}
        </label>
        <Select value={selectedDiscount} onValueChange={onDiscountChange}>
          <SelectTrigger className="border-2 border-[#111827] rounded-lg h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {discountOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort By */}
      <div>
        <label
          className="block mb-2 text-[#111827]"
          style={{ fontSize: "14px", fontWeight: 600 }}
        >
          {m.SORT_BY()}
        </label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="border-2 border-[#111827] rounded-lg h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          onClick={onClearFilters}
          variant="outline"
          className="w-full border-2 border-[#111827] rounded-lg h-12"
        >
          <X className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`} />
          {m.CLEAR_FILTERS()}
        </Button>
      )}
    </div>
  );
}
