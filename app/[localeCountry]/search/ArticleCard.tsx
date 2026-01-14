"use client";

import Link from "next/link";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

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

interface ArticleCardProps {
  article: Article;
  locale: string;
  localeCountry: string;
}

function getArticleTitle(article: Article, locale: string): string {
  return locale === "ar"
    ? article.title_ar || article.title || ""
    : article.title || article.title_ar || "";
}

function getArticleExcerpt(article: Article, locale: string): string {
  return locale === "ar"
    ? article.excerpt_ar || article.excerpt || ""
    : article.excerpt || article.excerpt_ar || "";
}

export function ArticleCard({
  article,
  locale,
  localeCountry,
}: ArticleCardProps) {
  return (
    <Link href={`/${localeCountry}/guides/${article.slug}`}>
      <div className="group bg-white rounded-xl border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all overflow-hidden">
        {article.image_url && (
          <div className="aspect-video overflow-hidden border-b-2 border-[#111827]">
            <ImageWithFallback
              src={article.image_url}
              alt={getArticleTitle(article, locale)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        )}
        <div className="p-6">
          <h3
            style={{ fontSize: "18px", fontWeight: 600 }}
            className="text-[#111827] mb-2 line-clamp-2"
          >
            {getArticleTitle(article, locale)}
          </h3>
          {getArticleExcerpt(article, locale) && (
            <p className="text-[#6B7280] text-sm line-clamp-2">
              {getArticleExcerpt(article, locale)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

