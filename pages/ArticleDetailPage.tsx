import { useState, useEffect } from "react";
import { useParams, Link } from "../router";
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Share2, 
  Bookmark,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { copyToClipboard } from "../utils/clipboard";
import { Skeleton } from "../components/ui/skeleton";
import { useLanguage } from "../contexts/LanguageContext";
import { useCountry } from "../contexts/CountryContext";
import { getCountryValue } from "../utils/countryHelpers";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";

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
  meta_description?: string;
  meta_description_ar?: string;
}

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, isRTL, language } = useLanguage();
  const { country } = useCountry();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchArticle();
      fetchRelatedArticles();
    } else {
      console.error('No slug provided in URL');
      setLoading(false);
    }
  }, [slug, language]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      console.log('Fetching article with slug:', slug);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/articles/${slug}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      console.log('Article response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Article fetch error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Article API result:', result);

      if (result.article) {
        setArticle(result.article);
      } else if (result.error) {
        console.error('Article not found:', result.error);
        // Set article to null to trigger "not found" view
        setArticle(null);
      } else {
        console.warn('No article in response');
        setArticle(null);
      }
    } catch (err) {
      console.error('Error fetching article:', err);
      toast.error(language === 'en' ? 'Failed to load article' : 'فشل تحميل المقال');
      // Important: Set article to null to stop loading state
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async () => {
    try {
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
        // Filter out the current article
        const related = result.articles.filter((a: Article) => a.slug !== slug).slice(0, 3);
        setRelatedArticles(related);
      }
    } catch (err) {
      console.error('Error fetching related articles:', err);
    }
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = getArticleTitle();
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        const success = await copyToClipboard(url);
        if (success) {
          setCopied(true);
          toast.success(language === 'en' ? 'Link copied!' : 'تم نسخ الرابط!');
          setTimeout(() => setCopied(false), 2000);
        } else {
          toast.error(language === 'en' ? 'Failed to copy link' : 'فشل نسخ الرابط');
        }
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const getArticleTitle = (): string => {
    if (!article) return '';
    return language === 'ar' && article.title_ar ? article.title_ar : (article.title || '');
  };

  const getArticleContent = (): string => {
    if (!article) return '';
    return language === 'ar' && article.content_ar ? article.content_ar : (article.content || '');
  };

  const getArticleExcerpt = (): string => {
    if (!article) return '';
    return language === 'ar' && article.excerpt_ar ? article.excerpt_ar : (article.excerpt || '');
  };

  const getArticleAuthor = (): string => {
    if (!article) return language === 'en' ? 'Anonymous' : 'مجهول';
    return language === 'ar' && article.author_ar ? article.author_ar : (article.author || (language === 'en' ? 'Anonymous' : 'مجهول'));
  };

  const getCategoryName = (): string => {
    if (!article) return '';
    return language === 'ar' && article.category_name_ar ? article.category_name_ar : (article.category_name || '');
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (language === 'ar') {
      return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8F3E8]">
        <div className="container mx-auto max-w-[900px] px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-64 w-full mb-8 rounded-2xl" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-2/3 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#E8F3E8] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-[#9CA3AF] mx-auto mb-4" />
          <h2 className="text-2xl text-[#111827] mb-2" style={{ fontWeight: 600 }}>
            {language === 'en' ? 'Article Not Found' : 'المقال غير موجود'}
          </h2>
          <p className="text-[#6B7280] mb-6">
            {language === 'en' 
              ? 'The article you are looking for does not exist.'
              : 'المقال الذي تبحث عنه غير موجود.'
            }
          </p>
          <Link to="/blog">
            <Button className="bg-[#5FB57A] hover:bg-[#4FA56A] text-white rounded-lg">
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
              {language === 'en' ? 'Back to Blog' : 'العودة للمدونة'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const title = getArticleTitle();
  const content = getArticleContent();
  const excerpt = getArticleExcerpt();
  const author = getArticleAuthor();
  const categoryName = getCategoryName();
  const image = article.featured_image || article.featured_image_url || article.image_url || '';
  const date = article.published_at || article.created_at;
  const readingTime = article.reading_time || 5;

  return (
    <div className="min-h-screen bg-[#E8F3E8]">
      {/* Back Button */}
      <div className="bg-white border-b-2 border-[#E5E7EB]">
        <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-4">
          <Link to="/blog">
            <Button 
              variant="ghost" 
              className={`text-[#111827] hover:text-[#5FB57A] ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
              {language === 'en' ? 'Back to Blog' : 'العودة للمدونة'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto max-w-[900px] px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Category Badge */}
        {categoryName && (
          <div className={`mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            <Badge className="bg-[#5FB57A] text-white border-0 rounded-lg px-4 py-1">
              {categoryName}
            </Badge>
          </div>
        )}

        {/* Title */}
        <h1 
          className={`mb-6 text-[#111827] ${isRTL ? 'text-right' : 'text-left'}`}
          style={{ fontSize: '48px', fontWeight: 700, lineHeight: '1.2' }}
        >
          {title}
        </h1>

        {/* Meta Information */}
        <div className={`flex flex-wrap items-center gap-6 mb-8 text-[#6B7280] ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {article.author_avatar ? (
              <ImageWithFallback
                src={article.author_avatar}
                alt={author}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#5FB57A] flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
            <span style={{ fontWeight: 500 }}>{author}</span>
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

        {/* Featured Image */}
        {image && (
          <div className="mb-8 rounded-2xl overflow-hidden border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
            <ImageWithFallback
              src={image}
              alt={title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Excerpt */}
        {excerpt && (
          <div className={`mb-8 p-6 bg-white rounded-2xl border-2 border-[#5FB57A] ${isRTL ? 'text-right' : 'text-left'}`}>
            <p className="text-[#111827] text-lg italic" style={{ fontWeight: 500 }}>
              {excerpt}
            </p>
          </div>
        )}

        {/* Share Buttons */}
        <div className={`flex flex-wrap items-center gap-3 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-[#6B7280]" style={{ fontWeight: 500 }}>
            {language === 'en' ? 'Share:' : 'مشاركة:'}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('facebook')}
            className="border-2 border-[#111827] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] rounded-lg"
          >
            <Facebook className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('twitter')}
            className="border-2 border-[#111827] hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] rounded-lg"
          >
            <Twitter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('linkedin')}
            className="border-2 border-[#111827] hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] rounded-lg"
          >
            <Linkedin className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('copy')}
            className="border-2 border-[#111827] hover:bg-[#5FB57A] hover:text-white hover:border-[#5FB57A] rounded-lg"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <Separator className="mb-8" />

        {/* Article Content */}
        <div 
          className={`prose prose-lg max-w-none mb-12 ${isRTL ? 'text-right' : 'text-left'}`}
          style={{ 
            color: '#374151',
            lineHeight: '1.8'
          }}
        >
          {content ? (
            <div 
              dangerouslySetInnerHTML={{ __html: content }}
              className="article-content"
            />
          ) : (
            <p className="text-[#6B7280]">
              {language === 'en' ? 'No content available.' : 'لا يوجد محتوى متاح.'}
            </p>
          )}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <>
            <Separator className="mb-8" />
            <div className={`mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h3 className="text-[#111827] mb-4" style={{ fontSize: '20px', fontWeight: 600 }}>
                {language === 'en' ? 'Tags' : 'الوسوم'}
              </h3>
              <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {article.tags.map((tag, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="border-2 border-[#111827] text-[#111827] rounded-lg px-3 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <>
            <Separator className="mb-8" />
            <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
              <h3 className="text-[#111827] mb-6" style={{ fontSize: '32px', fontWeight: 700 }}>
                {language === 'en' ? 'Related Articles' : 'مقالات ذات صلة'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <RelatedArticleCard
                    key={relatedArticle.id}
                    article={relatedArticle}
                    language={language}
                    isRTL={isRTL}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </article>
    </div>
  );
}

// Related Article Card Component
function RelatedArticleCard({ 
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
  const image = article.featured_image || article.featured_image_url || article.image_url || '';
  const articleTitle = article.title || article.title_ar || '';
  const slug = article.slug || articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const date = article.published_at || article.created_at;
  const readingTime = article.reading_time || 5;

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (language === 'ar') {
      return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Link to={`/blog/${slug}`}>
      <div className="group bg-white rounded-2xl border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative h-40 overflow-hidden">
          {image ? (
            <ImageWithFallback
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#E8F3E8] to-[#5FB57A] flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-white opacity-50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className={`p-5 flex-1 flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
          <h4 className="mb-2 text-[#111827] group-hover:text-[#5FB57A] transition-colors line-clamp-2" style={{ fontSize: '16px', fontWeight: 600 }}>
            {title}
          </h4>
          {excerpt && (
            <p className="text-[#6B7280] text-sm mb-3 line-clamp-2 flex-1">
              {excerpt}
            </p>
          )}
          
          {/* Meta */}
          <div className={`flex items-center gap-3 text-xs text-[#6B7280] pt-3 border-t border-[#E5E7EB] ${isRTL ? 'flex-row-reverse' : ''}`}>
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
