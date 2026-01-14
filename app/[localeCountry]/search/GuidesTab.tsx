"use client";

import { FileText } from "lucide-react";
import { ArticleCard } from "./ArticleCard";

interface Article {
  id: string;
  title?: string;
  title_ar?: string;
  excerpt?: string;
  excerpt_ar?: string;
  image_url?: string;
  slug?: string;
  published_at?: string;
}

interface GuidesTabProps {
  articles: Article[];
  locale: string;
  isRTL: boolean;
  localeCountry: string;
}

export function GuidesTab({
  articles,
  locale,
  localeCountry,
}: GuidesTabProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-[#9CA3AF] mx-auto mb-4" />
        <p className="text-[#6B7280]">
          {locale === "ar" ? "لم يتم العثور على أدلة" : "No guides found"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          locale={locale}
          localeCountry={localeCountry}
        />
      ))}
    </div>
  );
}

