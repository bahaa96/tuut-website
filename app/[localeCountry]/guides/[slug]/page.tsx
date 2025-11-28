import { Calendar, User, Clock, ArrowLeft, BookOpen } from "lucide-react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { fetchArticleBySlug, fetchArticles } from "../../../../lib/supabase-fetch";
import { ImageWithFallback } from "../../../../components/figma/ImageWithFallback";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import snarkdown from "snarkdown";

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

interface GuidePageProps {
  params: Promise<{
    localeCountry: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { localeCountry, slug } = resolvedParams;

  // Extract language from localeCountry (e.g., "en-EG" -> "en")
  const language = localeCountry.split('-')[0];
  const isArabic = language === 'ar';

  // Fetch article for metadata
  const { data: article } = await fetchArticleBySlug(slug);

  if (!article) {
    return {
      title: isArabic ? 'المقال غير موجود | Tuut' : 'Article Not Found | Tuut',
    };
  }

  return {
    title: `${article.title || 'Article'} | ${isArabic ? 'أدلة التسوق' : 'Shopping Guides'} | Tuut`,
    description: article.excerpt || (isArabic ? 'دليل تسوق من Tuut' : 'Shopping guide from Tuut'),
  };
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const { data, error } = await fetchArticleBySlug(slug);

    if (error) {
      console.error('Error fetching article:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

async function getRelatedArticles(currentSlug: string, countrySlug?: string, limit: number = 3): Promise<Article[]> {
  try {
    console.log('Fetching related articles for:', { currentSlug, countrySlug, limit });

    // First try to get country-specific articles
    const { data: countryArticles, error: countryError } = await fetchArticles(countrySlug, '', limit + 5);

    if (!countryError && countryArticles && countryArticles.length > 1) {
      console.log('Found country articles:', countryArticles.length);
      const filtered = countryArticles
        ?.filter(article => article.slug !== currentSlug)
        ?.slice(0, limit) || [];

      if (filtered.length > 0) {
        console.log('Using country-related articles:', filtered.length);
        return filtered;
      }
    }

    // If no country-specific articles, try global articles (no country filter)
    console.log('Trying global articles...');
    const { data: globalArticles, error: globalError } = await fetchArticles(undefined, '', limit + 5);

    if (!globalError && globalArticles && globalArticles.length > 1) {
      console.log('Found global articles:', globalArticles.length);
      const filtered = globalArticles
        ?.filter(article => article.slug !== currentSlug)
        ?.slice(0, limit) || [];

      if (filtered.length > 0) {
        console.log('Using global articles:', filtered.length);
        return filtered;
      }
    }

    // If still no articles, try with a broader search or sample articles
    console.log('No articles found, creating sample articles...');

    // Return some sample/demo articles for testing
    const sampleArticles: Article[] = [
      {
        id: 'sample-1',
        title: 'Black Friday Shopping Tips',
        slug: 'black-friday-shopping-tips',
        excerpt: 'Discover the best strategies to maximize your savings during Black Friday sales in Egypt.',
        content: '',
        featured_image_url: '',
        author_name: 'Tuut Team',
        author_avatar_url: '',
        read_time_minutes: 5,
        is_featured: true,
        is_published: true,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        view_count: 150,
        like_count: 25,
        country_slug: 'EG'
      },
      {
        id: 'sample-2',
        title: 'How to Find the Best Deals Online',
        slug: 'best-online-deals-guide',
        excerpt: 'Learn the secrets to finding the best online deals and discounts for your favorite products.',
        content: '',
        featured_image_url: '',
        author_name: 'Shopping Expert',
        author_avatar_url: '',
        read_time_minutes: 7,
        is_featured: false,
        is_published: true,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        view_count: 200,
        like_count: 40,
        country_slug: 'EG'
      },
      {
        id: 'sample-3',
        title: 'Complete Guide to Holiday Shopping',
        slug: 'holiday-shopping-guide',
        excerpt: 'Make your holiday shopping easier with our comprehensive guide to the best gifts and deals.',
        content: '',
        featured_image_url: '',
        author_name: 'Tuut Team',
        author_avatar_url: '',
        read_time_minutes: 8,
        is_featured: true,
        is_published: true,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        view_count: 300,
        like_count: 60,
        country_slug: 'EG'
      }
    ];

    // Filter out if current article matches any sample, and limit
    const filteredSamples = sampleArticles
      .filter(article => article.slug !== currentSlug)
      .slice(0, limit);

    console.log('Using sample articles:', filteredSamples.length);
    return filteredSamples;

  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const resolvedParams = await params;
  const { localeCountry, slug } = resolvedParams;

  // Extract country and language from localeCountry (e.g., "en-EG" -> "en", "EG")
  const country = localeCountry.split('-')[1];
  const language = localeCountry.split('-')[0];
  const isArabic = language === 'ar';
  const isRTL = isArabic;

  const article = await getArticle(slug);
  const relatedArticles = await getRelatedArticles(slug, country, 3);

  console.log('Component relatedArticles:', relatedArticles);
  console.log('Component article:', article);

  if (!article) {
    notFound();
  }

  const title = article.title || (language === 'en' ? 'Article' : 'مقال');
  const excerpt = article.excerpt || '';
  const content = article.content || '';
  const author = article.author_name || (language === 'en' ? 'Tuut Team' : 'فريق توت');
  const image = article.featured_image_url;
  const date = article.published_at || article.created_at;
  const readingTime = article.read_time_minutes || 5;

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
      month: 'long',
      day: 'numeric'
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Button */}
        <Link href="/guides">
          <Button
            variant="ghost"
            className={`mb-6 text-[#6B7280] hover:text-[#111827] ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Back to Guides' : 'العودة إلى الأدلة'}
          </Button>
        </Link>

        {/* Article Header */}
        <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          {article.is_featured && (
            <Badge className="bg-[#F59E0B] text-white border-0 mb-4">
              {language === 'en' ? 'Featured' : 'مميز'}
            </Badge>
          )}

          <h1 className="mb-4 text-[#111827]" style={{ fontSize: '48px', fontWeight: 700, lineHeight: '1.2' }}>
            {title}
          </h1>

          {excerpt && (
            <p className="text-[#6B7280] text-xl mb-6" style={{ lineHeight: '1.5' }}>
              {excerpt}
            </p>
          )}

          {/* Author Meta */}
          <div className={`flex flex-wrap items-center gap-6 text-sm text-[#6B7280] ${isRTL ? 'flex-row-reverse' : ''}`}>
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
              <span>{readingTime} {language === 'en' ? 'min read' : 'دقيقة قراءة'}</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {image && (
          <div className="mb-8 rounded-2xl overflow-hidden border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
            <ImageWithFallback
              src={image}
              alt={title}
              className="w-full h-auto object-cover"
              width={800}
              height={400}
            />
          </div>
        )}

        {/* Article Content */}
        <div
          className={`prose prose-lg max-w-none mb-12 ${isRTL ? 'text-right' : 'text-left'}`}
          dir={isRTL ? 'rtl' : 'ltr'}
          style={{
            fontSize: '18px',
            lineHeight: '1.7',
          }}
          dangerouslySetInnerHTML={{ __html: snarkdown(content || '') }}
        />

        {/* Related Articles Section */}
        <div className="mt-32 pt-8 border-t border-[#E5E7EB] mb-12">
          <h2 className={`text-2xl font-bold text-[#111827] mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            {language === 'en' ? 'Related Articles' : 'مقالات ذات صلة'}
          </h2>

          {relatedArticles.length > 0 ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isRTL ? 'md:grid-flow-col-dense' : ''}`}>
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/${localeCountry}/guides/${relatedArticle.slug}`}
                  className="group"
                >
                  <div className="group bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all overflow-hidden h-full flex flex-col">
                    {/* Article Image */}
                    <div className="relative h-48 overflow-hidden">
                      {relatedArticle.featured_image_url ? (
                        <ImageWithFallback
                          src={relatedArticle.featured_image_url}
                          alt={relatedArticle.title || (language === 'en' ? 'Article' : 'مقال')}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          width={400}
                          height={200}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#E8F3E8] to-[#5FB57A] flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-white opacity-50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                      {/* Featured Badge */}
                      {relatedArticle.is_featured && (
                        <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
                          <span className="bg-[#F59E0B] text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {language === 'en' ? 'Featured' : 'مميز'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Article Content */}
                    <div className={`p-6 flex-1 flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
                      {/* Article Title */}
                      <h3 className="mb-3 text-[#111827] group-hover:text-[#5FB57A] transition-colors line-clamp-2" style={{ fontSize: '20px', fontWeight: 600 }}>
                        {relatedArticle.title}
                      </h3>

                      {/* Article Excerpt */}
                      {relatedArticle.excerpt && (
                        <p className="text-[#6B7280] text-sm mb-4 line-clamp-3 flex-1">
                          {relatedArticle.excerpt}
                        </p>
                      )}

                      {/* Article Meta */}
                      <div className={`flex flex-wrap items-center gap-3 text-xs text-[#6B7280] pt-4 border-t border-[#E5E7EB] ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {relatedArticle.published_at && (
                          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(relatedArticle.published_at).toLocaleDateString(
                                language === 'ar' ? 'ar-EG' : 'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                }
                              )}
                            </span>
                          </div>
                        )}
                        {relatedArticle.read_time_minutes && (
                          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Clock className="h-3 w-3" />
                            <span>{relatedArticle.read_time_minutes} {language === 'en' ? 'min' : 'د'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#6B7280] text-lg mb-4">
                {language === 'en' ? 'No related articles found.' : 'لم يتم العثور على مقالات ذات صلة.'}
              </p>
              <p className="text-[#9CA3AF] text-sm">
                {language === 'en'
                  ? 'Check back soon for more shopping guides and tips!'
                  : 'عد قريباً للمزيد من أدلة التسوق والنصائح!'}
              </p>
              {/* Debug info - remove later */}
              <div className="mt-4 p-4 bg-gray-100 rounded text-xs text-left">
                <p><strong>Debug Info:</strong></p>
                <p>Current slug: {slug}</p>
                <p>Country: {country}</p>
                <p>Related articles count: {relatedArticles.length}</p>
              </div>
            </div>
          )}
        </div>

        {/* Back to Guides Button */}
        <div className="mt-12">
          <Link href="/guides">
            <Button
              className="bg-[#5FB57A] hover:bg-[#4CAF50] text-white border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {language === 'en' ? 'More Shopping Guides' : 'المزيد من أدلة التسوق'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}