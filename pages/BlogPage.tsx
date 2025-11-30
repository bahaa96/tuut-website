import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Calendar, User, Clock, X, ChevronRight, BookOpen, Tag as TagIcon } from "lucide-react";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { useLanguage } from "../contexts/LanguageContext";
import { useCountry } from "../contexts/CountryContext";
import { getCountryValue } from "../utils/countryHelpers";
import Link from "next/link";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface Article {
  id: string;
  title?: string;
  title_ar?: string;
  content?: string;
  content_ar?: string;
  excerpt?: string;
  excerpt_ar?: string;
  featured_image?: string;
  featured_image_url?: string;
  image_url?: string;
  author?: string;
  author_ar?: string;
  author_avatar?: string;
  slug?: string;
  category_id?: string;
  category_name?: string;
  category_name_ar?: string;
  tags?: string[];
  reading_time?: number;
  views?: number;
  published_at?: string;
  created_at?: string;
  is_featured?: boolean;
  featured?: boolean;
}

export default function BlogPage() {
  const { t, isRTL, language } = useLanguage();
  const { country } = useCountry();
  const [articles, setArticles] = useState<Article[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const ITEMS_PER_PAGE = 12;

  // Fetch articles from API
  useEffect(() => {
    fetchArticles();
  }, [country, language]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const countryValue = getCountryValue(country);
      
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      const url = countryValue 
        ? `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/articles?country=${countryValue}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/articles`;
      
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
        setDisplayedArticles(result.articles.slice(0, ITEMS_PER_PAGE));
        setHasMore(result.articles.length > ITEMS_PER_PAGE);
      } else {
        setArticles([]);
        setDisplayedArticles([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      setArticles([]);
      setDisplayedArticles([]);
    } finally {
      setLoading(false);
      setPage(1);
    }
  };

  // Filter articles
  const getFilteredArticles = useCallback(() => {
    let filtered = [...articles];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((article) => {
        const title = getArticleTitle(article, language).toLowerCase();
        const excerpt = getArticleExcerpt(article, language).toLowerCase();
        const author = getArticleAuthor(article, language).toLowerCase();
        return title.includes(query) || excerpt.includes(query) || author.includes(query);
      });
    }

    // Sort by featured and date
    filtered.sort((a, b) => {
      const aFeatured = a.featured || a.is_featured ? 1 : 0;
      const bFeatured = b.featured || b.is_featured ? 1 : 0;
      
      if (aFeatured !== bFeatured) {
        return bFeatured - aFeatured;
      }
      
      const aDate = new Date(a.published_at || a.created_at || 0).getTime();
      const bDate = new Date(b.published_at || b.created_at || 0).getTime();
      return bDate - aDate;
    });

    return filtered;
  }, [articles, searchQuery, language]);

  // Update displayed articles when filters change
  useEffect(() => {
    const filtered = getFilteredArticles();
    setDisplayedArticles(filtered.slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setHasMore(filtered.length > ITEMS_PER_PAGE);
  }, [searchQuery, getFilteredArticles]);

  // Load more articles
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const filtered = getFilteredArticles();
    const nextPage = page + 1;
    const start = 0;
    const end = nextPage * ITEMS_PER_PAGE;
    
    setTimeout(() => {
      setDisplayedArticles(filtered.slice(start, end));
      setPage(nextPage);
      setHasMore(filtered.length > end);
      setLoadingMore(false);
    }, 500);
  }, [page, hasMore, loadingMore, getFilteredArticles]);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loadMore]);

  // Helper functions
  function getArticleTitle(article: Article, lang: string): string {
    if (lang === 'ar') {
      return article.title_ar || article.title || 'Article';
    }
    return article.title || 'Article';
  }

  function getArticleExcerpt(article: Article, lang: string): string {
    if (lang === 'ar') {
      return article.excerpt_ar || article.excerpt || '';
    }
    return article.excerpt || '';
  }

  function getArticleAuthor(article: Article, lang: string): string {
    if (lang === 'ar') {
      return article.author_ar || article.author || (language === 'en' ? 'Anonymous' : 'مجهول');
    }
    return article.author || 'Anonymous';
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
      return date.toLocaleDateString('ar-EG', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h1 className="mb-3 text-[#111827]" style={{ fontSize: '48px', fontWeight: 700 }}>
            {language === 'en' ? 'Shopping Guides' : 'أدلة التسوق'}
          </h1>
          <p className="text-[#6B7280] text-lg">
            {language === 'en' 
              ? 'Expert tips, tricks, and insights to help you save more'
              : 'نصائح الخبراء والحيل والرؤى لمساعدتك على توفير المزيد'
            }
          </p>
        </div>

        {/* Search Bar */}
        <div className={`mb-8 bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-4 md:p-6`}>
          <div className="relative">
            <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280] ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input
              type="text"
              placeholder={language === 'en' ? 'Search articles...' : 'ابحث عن المقالات...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} h-12 border-2 border-[#111827] rounded-xl`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'}`}
              >
                <X className="h-5 w-5 text-[#6B7280] hover:text-[#111827]" />
              </button>
            )}
          </div>

          {/* Active Filters */}
          {searchQuery && (
            <div className={`mt-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-sm text-[#6B7280]">
                {language === 'en' ? 'Searching for:' : 'البحث عن:'}
              </span>
              <Badge 
                variant="secondary" 
                className="bg-[#E8F3E8] text-[#111827] border border-[#5FB57A]"
              >
                {searchQuery}
                <button
                  onClick={() => setSearchQuery('')}
                  className={`${isRTL ? 'mr-2' : 'ml-2'} hover:text-[#EF4444]`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        ) : displayedArticles.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-[#9CA3AF] mx-auto mb-4" />
            <h3 className="text-xl text-[#111827] mb-2" style={{ fontWeight: 600 }}>
              {language === 'en' ? 'No articles found' : 'لم يتم العثور على مقالات'}
            </h3>
            <p className="text-[#6B7280]">
              {language === 'en' 
                ? 'Try adjusting your search'
                : 'حاول تعديل البحث'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Featured Article (First one) */}
            {displayedArticles.length > 0 && (displayedArticles[0].featured || displayedArticles[0].is_featured) && (
              <div className="mb-8">
                <ArticleCardFeatured
                  article={displayedArticles[0]}
                  language={language}
                  isRTL={isRTL}
                />
              </div>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedArticles.slice((displayedArticles[0].featured || displayedArticles[0].is_featured) ? 1 : 0).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  language={language}
                  isRTL={isRTL}
                />
              ))}
            </div>

            {/* Load More Trigger */}
            {hasMore && (
              <div ref={loadMoreRef} className="mt-8 flex justify-center">
                {loadingMore && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-96 rounded-2xl" />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Featured Article Card (Large, Full Width)
function ArticleCardFeatured({ 
  article, 
  language,
  isRTL 
}: { 
  article: Article; 
  language: string;
  isRTL: boolean;
}) {
  const title = language === 'ar' && article.title_ar ? article.title_ar : (article.title || 'Article');
  const excerpt = language === 'ar' && article.excerpt_ar ? article.excerpt_ar : (article.excerpt || '');
  const author = language === 'ar' && article.author_ar ? article.author_ar : (article.author || (language === 'en' ? 'Anonymous' : 'مجهول'));
  const image = article.featured_image || article.featured_image_url || article.image_url || '';
  const articleTitle = article.title || article.title_ar || '';
  const slug = article.slug || articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const date = article.published_at || article.created_at;
  const readingTime = article.reading_time || 5;

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (language === 'ar') {
      return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Link href={`/guides/${slug}`}>
      <div className={`group bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all overflow-hidden`}>
        <div className={`grid md:grid-cols-2 gap-0 ${isRTL ? 'md:grid-flow-dense' : ''}`}>
          {/* Image */}
          <div className={`relative h-64 md:h-full overflow-hidden ${isRTL ? 'md:col-start-2' : ''}`}>
            {image ? (
              <ImageWithFallback
                src={image}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#E8F3E8] to-[#5FB57A] flex items-center justify-center">
                <BookOpen className="h-24 w-24 text-white opacity-50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            
            {/* Featured Badge */}
            <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
              <Badge className="bg-[#F59E0B] text-white border-0">
                {language === 'en' ? 'Featured' : 'مميز'}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className={`p-8 flex flex-col justify-center ${isRTL ? 'md:col-start-1 text-right' : 'text-left'}`}>
            <h2 className="mb-4 text-[#111827] group-hover:text-[#5FB57A] transition-colors" style={{ fontSize: '32px', fontWeight: 700, lineHeight: '1.2' }}>
              {title}
            </h2>
            {excerpt && (
              <p className="text-[#6B7280] mb-6 line-clamp-3" style={{ fontSize: '18px' }}>
                {excerpt}
              </p>
            )}
            
            {/* Meta */}
            <div className={`flex flex-wrap items-center gap-4 text-sm text-[#6B7280] ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <User className="h-4 w-4" />
                <span>{author}</span>
              </div>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Calendar className="h-4 w-4" />
                <span>{formatDate(date)}</span>
              </div>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className="h-4 w-4" />
                <span>{readingTime} {language === 'en' ? 'min read' : 'دقيقة'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Regular Article Card
function ArticleCard({ 
  article, 
  language,
  isRTL 
}: { 
  article: Article; 
  language: string;
  isRTL: boolean;
}) {
  const title = language === 'ar' && article.title_ar ? article.title_ar : (article.title || 'Article');
  const excerpt = language === 'ar' && article.excerpt_ar ? article.excerpt_ar : (article.excerpt || '');
  const author = language === 'ar' && article.author_ar ? article.author_ar : (article.author || (language === 'en' ? 'Anonymous' : 'مجهول'));
  const image = article.featured_image || article.featured_image_url || article.image_url || '';
  const articleTitle = article.title || article.title_ar || '';
  const slug = article.slug || articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const date = article.published_at || article.created_at;
  const readingTime = article.reading_time || 5;

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (language === 'ar') {
      return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Link href={`/guides/${slug}`}>
      <div className="group bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all overflow-hidden h-full flex flex-col">
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
          <h3 className="mb-3 text-[#111827] group-hover:text-[#5FB57A] transition-colors line-clamp-2" style={{ fontSize: '20px', fontWeight: 600 }}>
            {title}
          </h3>
          {excerpt && (
            <p className="text-[#6B7280] text-sm mb-4 line-clamp-3 flex-1">
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
}
