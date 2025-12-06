import { Search, Calendar, User, Clock, X, ChevronRight, BookOpen, Tag as TagIcon } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import { getCountryValue } from "../../../utils/countryHelpers";
import { fetchArticles } from "../../../lib/supabase-fetch";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import Link from "next/link";
import { Metadata } from "next";
import { getCountryNameFromCode } from "@/utils/getCountryNameFromCode";
import {
  CollectionStructuredData,
  BreadcrumbStructuredData,
  WebsiteStructuredData
} from "@/components/StructuredData";

interface Article {
  id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featured_image_url?: string;
  author_name?: string;
  author_avatar_url?: string;
  read_time_minutes?: number;
  is_featured?: boolean;
  is_published?: boolean;
  published_at?: string;
  created_at?: string;
  view_count?: number;
  like_count?: number;
  country_slug?: string;
}

interface GuidesPageProps {
  params: Promise<{
    localeCountry: string;
  }>;
  searchParams: Promise<{
    search?: string;
  }>;
}

export async function generateMetadata({ params, searchParams }: GuidesPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { localeCountry } = resolvedParams;
  const { search } = resolvedSearchParams;

  // Extract language and country from localeCountry
  const language = localeCountry.split('-')[0];
  const country = localeCountry.split('-')[1];
  const isArabic = language === 'ar';
  const countryName = getCountryNameFromCode(country);

  // Build title
  const baseTitle = isArabic ? 'أدلة التسوق' : 'Shopping Guides';
  const siteName = 'Tuut';

  let title = isArabic
    ? `${baseTitle} في ${countryName} | ${siteName}`
    : `${baseTitle} in ${countryName} | ${siteName}`;

  if (search) {
    title = isArabic
      ? `البحث: "${search}" | ${title}`
      : `Search: "${search}" | ${title}`;
  }

  // Build description
  let description = isArabic
    ? `اكتشف نصائح الخبراء والحيل والرؤى لمساعدتك على توفير المزيد في ${countryName}. أدلة التسوق الشاملة والعروض الحصرية.`
    : `Discover expert tips, tricks, and insights to help you save more in ${countryName}. Comprehensive shopping guides and exclusive deals.`;

  if (search) {
    description = isArabic
      ? `نتائج البحث عن "${search}" في أدلة التسوق. ${description}`
      : `Search results for "${search}" in shopping guides. ${description}`;
  }

  // Build canonical URL
  const baseUrl = `https://tuut.shop/${localeCountry}/guides`;
  const canonicalUrl = search ? `${baseUrl}?search=${encodeURIComponent(search)}` : baseUrl;

  return {
    title,
    description,
    keywords: [
      isArabic ? 'أدلة التسوق' : 'shopping guides',
      isArabic ? 'نصائح التسوق' : 'shopping tips',
      isArabic ? 'عروض' : 'deals',
      isArabic ? 'خصومات' : 'discounts',
      isArabic ? 'توفير المال' : 'save money',
      isArabic ? 'نصائح الخبراء' : 'expert tips',
      isArabic ? 'أفضل الصفقات' : 'best deals',
      countryName,
      search && search.toLowerCase(),
    ].filter(Boolean).join(", "),
    authors: [{ name: "Tuut" }],
    creator: "Tuut",
    publisher: "Tuut",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: generateHreflangTags(localeCountry, search),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: "Tuut",
      images: [
        {
          url: "https://tuut.shop/og-guides.jpg",
          width: 1200,
          height: 630,
          alt: isArabic ? "أدلة التسوق في Tuut" : "Shopping Guides on Tuut",
          type: "image/jpeg",
        },
      ],
      locale: localeCountry,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://tuut.shop/og-guides.jpg"],
      creator: "@tuutapp",
      site: "@tuutapp",
    },
  };
}

function generateHreflangTags(localeCountry: string, search?: string): Record<string, string> {
  const languages = ["en", "ar"];
  const hreflangs: Record<string, string> = {};

  const searchParam = search ? `?search=${encodeURIComponent(search)}` : '';

  // Generate combinations for the current country
  languages.forEach(lang => {
    const locale = `${lang}-${localeCountry.split("-")[1]}`;
    hreflangs[locale] = `https://tuut.shop/${locale}/guides${searchParam}`;
  });

  // Default language
  hreflangs["x-default"] = `https://tuut.shop/en-${localeCountry.split("-")[1]}/guides${searchParam}`;

  return hreflangs;
}

async function getArticles(countryValue: string, searchQuery?: string): Promise<Article[]> {
  try {
    const { data, error } = await fetchArticles(countryValue, searchQuery);

    if (error) {
      console.error('Error fetching articles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export default async function GuidesPage({ params, searchParams }: GuidesPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const { localeCountry } = resolvedParams;
  const { search } = resolvedSearchParams;

  // Extract country from localeCountry (e.g., "en-EG" -> "EG") - same pattern as other pages
  const country = localeCountry.split('-')[1];
  const language = localeCountry.split('-')[0];
  const isArabic = language === 'ar';
  const isRTL = isArabic;

  // Convert to uppercase for API call - same pattern as deals/stores pages
  const countrySlug = country.toUpperCase();

  const articles = await getArticles(countrySlug, search);

  // Filter articles client-side for search (as fallback)
  const filteredArticles = search
    ? articles.filter(article => {
        const query = search.toLowerCase();
        const title = (article.title || '').toLowerCase();
        const excerpt = (article.excerpt || '').toLowerCase();
        const content = (article.content || '').toLowerCase();
        return title.includes(query) || excerpt.includes(query) || content.includes(query);
      })
    : articles;

  function getArticleTitle(article: Article): string {
    return article.title || 'Article';
  }

  function getArticleExcerpt(article: Article): string {
    return article.excerpt || '';
  }

  function getArticleAuthor(article: Article): string {
    return article.author_name || (language === 'en' ? 'Tuut Team' : 'فريق توت');
  }

  function getArticleImage(article: Article): string {
    return article.featured_image_url || '';
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

  // Build structured data
  const baseUrl = `https://tuut.shop/${localeCountry}/guides`;
  const searchParam = search ? `?search=${encodeURIComponent(search)}` : '';
  const currentUrl = `${baseUrl}${searchParam}`;

  const pageTitle = isArabic ? 'أدلة التسوق' : 'Shopping Guides';
  const pageDescription = isArabic
    ? 'نصائح الخبراء والحيل والرؤى لمساعدتك على توفير المزيد'
    : 'Expert tips, tricks, and insights to help you save more';

  // Breadcrumb items
  const breadcrumbItems = [
    { name: isArabic ? 'الرئيسية' : 'Home', url: `https://tuut.shop/${localeCountry}` },
    {
      name: isArabic ? 'أدلة التسوق' : 'Shopping Guides',
      url: currentUrl
    },
  ];

  // Add search to breadcrumb
  if (search) {
    breadcrumbItems.push({
      name: isArabic ? `بحث: ${search}` : `Search: ${search}`,
      url: currentUrl,
    });
  }

  return (
    <>
      {/* Structured Data */}
      <CollectionStructuredData
        items={filteredArticles.map(article => ({
          name: article.title || 'Article',
          description: article.excerpt || '',
          url: `https://tuut.shop/${localeCountry}/guides/${article.slug || article.id}`,
          image: article.featured_image_url,
          datePublished: article.published_at || article.created_at,
          author: article.author_name || (isArabic ? 'فريق توت' : 'Tuut Team'),
        }))}
        url={currentUrl}
        name={pageTitle}
        description={pageDescription}
        language={language}
        country={countryName}
        itemType="Article"
      />

      <BreadcrumbStructuredData items={breadcrumbItems} />

      <WebsiteStructuredData
        url={`https://tuut.shop/${localeCountry}`}
        name="Tuut"
        description={isArabic ? 'اكتشف أفضل المنتجات والعروض' : 'Discover the best products and deals'}
      />

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
        <form className={`mb-8 bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-4 md:p-6`}>
          <div className="relative">
            <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280] ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input
              type="text"
              name="search"
              placeholder={language === 'en' ? 'Search articles...' : 'ابحث عن المقالات...'}
              defaultValue={search || ''}
              className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} h-12 border-2 border-[#111827] rounded-xl`}
            />
            {search && (
              <Link
                href="/guides"
                className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'}`}
              >
                <X className="h-5 w-5 text-[#6B7280] hover:text-[#111827]" />
              </Link>
            )}
          </div>

          {/* Active Filters */}
          {search && (
            <div className={`mt-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-sm text-[#6B7280]">
                {language === 'en' ? 'Searching for:' : 'البحث عن:'}
              </span>
              <Badge
                variant="secondary"
                className="bg-[#E8F3E8] text-[#111827] border border-[#5FB57A]"
              >
                {search}
                <Link
                  href="/guides"
                  className={`${isRTL ? 'mr-2' : 'ml-2'} hover:text-[#EF4444]`}
                >
                  <X className="h-3 w-3" />
                </Link>
              </Badge>
            </div>
          )}
        </form>

        {/* Loading State - Only show for initial load without articles */}
        {!articles && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Articles Content */}
        {filteredArticles.length === 0 ? (
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
            {filteredArticles.length > 0 && filteredArticles[0].is_featured && (
              <div className="mb-8">
                <ArticleCardFeatured
                  article={filteredArticles[0]}
                  language={language}
                  isRTL={isRTL}
                />
              </div>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.slice((filteredArticles[0]?.is_featured ? 1 : 0)).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  language={language}
                  isRTL={isRTL}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
    </>
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
  const title = getArticleTitle(article);
  const excerpt = getArticleExcerpt(article);
  const author = getArticleAuthor(article);
  const image = getArticleImage(article);
  const slug = article.slug || article.id;
  const date = article.published_at || article.created_at;
  const readingTime = article.read_time_minutes || 5;

  function getArticleTitle(article: Article): string {
    return article.title || 'Article';
  }

  function getArticleExcerpt(article: Article): string {
    return article.excerpt || '';
  }

  function getArticleAuthor(article: Article): string {
    return article.author_name || (language === 'en' ? 'Tuut Team' : 'فريق توت');
  }

  function getArticleImage(article: Article): string {
    return article.featured_image_url || '';
  }

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
  const title = getArticleTitle(article);
  const excerpt = getArticleExcerpt(article);
  const author = getArticleAuthor(article);
  const image = getArticleImage(article);
  const slug = article.slug || article.id;
  const date = article.published_at || article.created_at;
  const readingTime = article.read_time_minutes || 5;

  function getArticleTitle(article: Article): string {
    return article.title || 'Article';
  }

  function getArticleExcerpt(article: Article): string {
    return article.excerpt || '';
  }

  function getArticleAuthor(article: Article): string {
    return article.author_name || (language === 'en' ? 'Tuut Team' : 'فريق توت');
  }

  function getArticleImage(article: Article): string {
    return article.featured_image_url || '';
  }

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