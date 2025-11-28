import { Calendar, User, Clock, ArrowLeft, BookOpen } from "lucide-react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { fetchArticleBySlug } from "../../../../lib/supabase-fetch";
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

export default async function GuidePage({ params }: GuidePageProps) {
  const resolvedParams = await params;
  const { localeCountry, slug } = resolvedParams;

  // Extract country and language from localeCountry (e.g., "en-EG" -> "en", "EG")
  const country = localeCountry.split('-')[1];
  const language = localeCountry.split('-')[0];
  const isArabic = language === 'ar';
  const isRTL = isArabic;

  const article = await getArticle(slug);

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
          className={`prose prose-lg max-w-none ${isRTL ? 'text-right' : 'text-left'}`}
          dir={isRTL ? 'rtl' : 'ltr'}
          style={{
            fontSize: '18px',
            lineHeight: '1.7',
          }}
          dangerouslySetInnerHTML={{ __html: snarkdown(content || '') }}
        />

        {/* Back to Guides Button */}
        <div className="mt-12 pt-8 border-t border-[#E5E7EB]">
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