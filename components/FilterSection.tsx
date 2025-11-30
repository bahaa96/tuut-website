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

interface FilterSectionProps {
  language: string;
  isRTL: boolean;
  searchQuery?: string;
  selectedCategory?: string;
  selectedStore?: string;
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
  language,
  isRTL,
  searchQuery = "",
  selectedCategory = "all",
  selectedStore = "all",
  selectedDiscount = "all",
  sortBy = "newest",
  onSearchChange = () => {},
  onCategoryChange = () => {},
  onStoreChange = () => {},
  onDiscountChange = () => {},
  onSortChange = () => {},
  onClearFilters = () => {}
}: FilterSectionProps) {
  const categories = [
    { id: 'all', name: language === 'ar' ? 'جميع الفئات' : 'All Categories' },
    { id: 'electronics', name: language === 'ar' ? 'إلكترونيات' : 'Electronics' },
    { id: 'fashion', name: language === 'ar' ? 'أزياء' : 'Fashion' },
    { id: 'home', name: language === 'ar' ? 'المنزل والحديقة' : 'Home & Garden' },
    { id: 'sports', name: language === 'ar' ? 'رياضة' : 'Sports' },
    { id: 'beauty', name: language === 'ar' ? 'جمال' : 'Beauty' },
    { id: 'toys', name: language === 'ar' ? 'ألعاب' : 'Toys & Games' },
  ];

  const sortOptions = [
    { value: 'newest', name: language === 'ar' ? 'الأحدث' : 'Newest' },
    { value: 'price-low', name: language === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High' },
    { value: 'price-high', name: language === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low' },
    { value: 'rating', name: language === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated' },
  ];

  const discountOptions = [
    { value: 'all', name: language === 'ar' ? 'أي خصم' : 'Any Discount' },
    { value: '10', name: language === 'ar' ? '10% فأكثر' : '10% or more' },
    { value: '25', name: language === 'ar' ? '25% فأكثر' : '25% or more' },
    { value: '50', name: language === 'ar' ? '50% فأكثر' : '50% or more' },
    { value: '75', name: language === 'ar' ? '75% فأكثر' : '75% or more' },
  ];

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedStore !== "all" || selectedDiscount !== "all";

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block mb-2 text-[#111827]" style={{ fontSize: '14px', fontWeight: 600 }}>
          {language === 'ar' ? 'البحث' : 'Search'}
        </label>
        <div className="relative">
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]`} />
          <Input
            type="text"
            placeholder={language === 'ar' ? 'ابحث عن منتجات...' : 'Search for products...'}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`${isRTL ? 'pr-10' : 'pl-10'} border-2 border-[#111827] rounded-lg h-12`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block mb-2 text-[#111827]" style={{ fontSize: '14px', fontWeight: 600 }}>
          {language === 'ar' ? 'الفئة' : 'Category'}
        </label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
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
        <label className="block mb-2 text-[#111827]" style={{ fontSize: '14px', fontWeight: 600 }}>
          {language === 'ar' ? 'نسبة الخصم' : 'Discount'}
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
        <label className="block mb-2 text-[#111827]" style={{ fontSize: '14px', fontWeight: 600 }}>
          {language === 'ar' ? 'ترتيب حسب' : 'Sort By'}
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
          <X className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {language === 'ar' ? 'إزالة الفلاتر' : 'Clear Filters'}
        </Button>
      )}
    </div>
  );
}