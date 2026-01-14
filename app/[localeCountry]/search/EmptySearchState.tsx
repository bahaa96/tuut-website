"use client";

import { Search as SearchIcon } from "lucide-react";

interface EmptySearchStateProps {
  locale: string;
  isRTL: boolean;
  hasQuery?: boolean;
}

export function EmptySearchState({
  locale,
  isRTL,
  hasQuery = false,
}: EmptySearchStateProps) {
  return (
    <div className="text-center py-20">
      <SearchIcon className="h-16 w-16 text-[#9CA3AF] mx-auto mb-4" />
      <h2
        className="text-[#111827] mb-2"
        style={{ fontSize: "24px", fontWeight: 600 }}
      >
        {hasQuery
          ? locale === "ar"
            ? "لم يتم العثور على نتائج"
            : "No results found"
          : locale === "ar"
            ? "لا يوجد استعلام بحث"
            : "No search query"}
      </h2>
      <p className="text-[#6B7280]">
        {hasQuery
          ? locale === "ar"
            ? "حاول تعديل مصطلحات البحث أو تصفح فئاتنا"
            : "Try adjusting your search terms or browse our categories"
          : locale === "ar"
            ? "أدخل مصطلح البحث للعثور على المتاجر والعروض والمنتجات والأدلة"
            : "Enter a search term to find stores, deals, products, and guides"}
      </p>
    </div>
  );
}

