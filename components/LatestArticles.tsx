import { BookOpen, ArrowRight, Calendar, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useCountry } from "../contexts/CountryContext";
import { getCountryValue } from "../utils/countryHelpers";
import Link from "next/link";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Article {
  id: string;
  title?: string;
  title_ar?: string;
  excerpt?: string;
  excerpt_ar?: string;
  featured_image?: string;
  featured_image_url?: string;
  image_url?: string;
  slug?: string;
  reading_time?: number;
  published_at?: string;
  created_at?: string;
}

export function LatestArticles() {
  const { t, isRTL, language } = useLanguage();
  const { country } = useCountry();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, [country, language]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const countryValue = getCountryValue(country);
      
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      const url = countryValue 
        ? `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/articles?country=${countryValue}&limit=3`
        : `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/articles?limit=3`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.articles && result.articles.length > 0) {
        setArticles(result.articles);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  function getArticleTitle(article: Article): string {
    if (language === 'ar') {
      return article.title_ar || article.title || 'Article';
    }
    return article.title || 'Article';
  }

  function getArticleExcerpt(article: Article): string {
    if (language === 'ar') {
      return article.excerpt_ar || article.excerpt || '';
    }
    return article.excerpt || '';
  }

  function getArticleImage(article: Article): string {
    return article.featured_image || article.featured_image_url || article.image_url || '';
  }

  function getArticleSlug(article: Article): string {
    const title = article.title || article.title_ar || '';
    return article.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (language === 'ar') {
      return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div className={`flex items-center justify-between mb-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className="mb-2 text-[#111827]" style={{ fontSize: '36px', fontWeight: 700 }}>
              {language === 'en' ? 'Latest from Blog' : 'أحدث المقالات'}
            </h2>
            <p className="text-[#6B7280]">
              {language === 'en' 
                ? 'Tips and insights to maximize your savings'
                : 'نصائح ورؤى لتعظيم مدخراتك'
              }
            </p>
          </div>
          <Link to="/guides">
            <Button 
              variant="outline" 
              className={`hidden md:flex border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {language === 'en' ? 'View All Articles' : 'عرض جميع المقالات'}
              <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-gray-100 rounded-2xl border-2 border-[#E5E7EB] animate-pulse"
              />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-[#9CA3AF] mx-auto mb-4" />
            <p className="text-[#6B7280]">
              {language === 'en' ? 'No articles available' : 'لا توجد مقالات متاحة'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((article) => {
                const title = getArticleTitle(article);
                const excerpt = getArticleExcerpt(article);
                const image = getArticleImage(article);
                const slug = getArticleSlug(article);
                const date = article.published_at || article.created_at;
                const readingTime = article.reading_time || 5;

                return (
                  <Link key={article.id} to={`/guides/${slug}`}>
                    <div className="group bg-white rounded-2xl border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all overflow-hidden h-full flex flex-col">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        {image ? (
                          <ImageWithFallback
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#E8F3E8] to-[#5FB57A] flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-white opacity-50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className={`p-6 flex-1 flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
                        <h3 className="mb-3 text-[#111827] group-hover:text-[#5FB57A] transition-colors line-clamp-2" style={{ fontSize: '18px', fontWeight: 600 }}>
                          {title}
                        </h3>
                        {excerpt && (
                          <p className="text-[#6B7280] text-sm mb-4 line-clamp-2 flex-1">
                            {excerpt}
                          </p>
                        )}
                        
                        {/* Meta */}
                        <div className={`flex flex-wrap items-center gap-3 text-xs text-[#6B7280] pt-4 border-t border-[#E5E7EB] ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(date)}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Clock className="h-3 w-3" />
                            <span>{readingTime} {language === 'en' ? 'min' : 'د'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile View All Button */}
            <div className="mt-8 flex justify-center md:hidden">
              <Link to="/guides">
                <Button 
                  variant="outline" 
                  className={`border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  {language === 'en' ? 'View All Articles' : 'عرض جميع المقالات'}
                  <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
