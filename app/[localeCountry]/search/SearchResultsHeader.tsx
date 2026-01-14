"use client";

interface SearchResultsHeaderProps {
  query: string;
  loading: boolean;
  totalResults: number;
  locale: string;
  isRTL: boolean;
}

export function SearchResultsHeader({
  query,
  loading,
  totalResults,
  locale,
  isRTL,
}: SearchResultsHeaderProps) {
  return (
    <div className={`mb-8 ${isRTL ? "text-right" : ""}`}>
      <h1
        className="text-[#111827] mb-2"
        style={{ fontSize: "36px", fontWeight: 700 }}
      >
        {locale === "ar" ? "نتائج البحث" : "Search Results"}
      </h1>
      <p className="text-[#6B7280]" style={{ fontSize: "18px" }}>
        {loading ? (
          locale === "ar" ? "جاري البحث..." : "Searching..."
        ) : (
          <>
            {totalResults}{" "}
            {locale === "ar" ? "نتيجة لـ" : "results for"}{" "}
            <span className="text-[#5FB57A]">"{query}"</span>
          </>
        )}
      </p>
    </div>
  );
}

