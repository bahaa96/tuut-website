import { useState, useEffect } from "react";
import { useParams, Link } from "../router";
import { useLanguage } from "../contexts/LanguageContext";
import { createClient } from "../utils/supabase/client";
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  ExternalLink, 
  Calendar, 
  Tag, 
  Store as StoreIcon,
  TrendingUp,
  Clock,
  BadgeCheck,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Link as LinkIcon
} from "lucide-react";
import { Button } from "../components/ui/button";
import { DealCard } from "../components/DealCard";
import { Skeleton } from "../components/ui/skeleton";
import { toast } from "sonner@2.0.3";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { copyToClipboard } from "../utils/clipboard";

interface Deal {
  id: number;
  slug?: string;
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  discount_percentage?: number;
  discount_amount?: number;
  original_price?: number;
  discounted_price?: number;
  code?: string;
  store_id?: string;
  store_name?: string;
  store_name_ar?: string;
  store_logo?: string;
  category_name?: string;
  expires_at?: string;
  is_verified?: boolean;
  featured?: boolean;
  redirect_url?: string;
  terms_conditions?: string;
  terms_conditions_ar?: string;
}

interface Store {
  id: string;
  store_name?: string;
  store_name_ar?: string;
  profile_picture_url?: string;
  logo_url?: string;
  redirect_url?: string;
  website_url?: string;
}

export function DealDetailPage() {
  const { slug } = useParams();
  const { t, isRTL, language } = useLanguage();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [relatedDeals, setRelatedDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [savedDeals, setSavedDeals] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      fetchDealDetails(slug);
    }
  }, [slug, language]);

  useEffect(() => {
    if (deal?.expires_at) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(deal.expires_at!).getTime();
        const distance = expiry - now;

        if (distance < 0) {
          setTimeLeft(language === 'en' ? 'Expired' : 'منتهي');
          clearInterval(timer);
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          
          if (days > 0) {
            setTimeLeft(language === 'en' ? `${days}d ${hours}h` : `${days} يوم ${hours} ساعة`);
          } else if (hours > 0) {
            setTimeLeft(language === 'en' ? `${hours}h ${minutes}m` : `${hours} ساعة ${minutes} دقيقة`);
          } else {
            setTimeLeft(language === 'en' ? `${minutes}m` : `${minutes} دقيقة`);
          }
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [deal, language]);

  const fetchDealDetails = async (dealSlug: string) => {
    try {
      setLoading(true);
      const supabase = createClient();

      // Fetch deal details by slug
      const { data: dealData, error: dealError } = await supabase
        .from('deals')
        .select('*')
        .eq('slug', dealSlug)
        .single();

      if (dealError || !dealData) {
        console.error('Error fetching deal:', dealError);
        toast.error(isRTL ? 'العرض غير موجود' : 'Deal not found');
        setLoading(false);
        return;
      }

      console.log('=== DEAL DATA ===');
      console.log('Full deal object:', dealData);
      console.log('Deal ID:', dealData.id);
      console.log('Deal Title:', dealData.title);
      console.log('Deal store_id:', dealData.store_id);
      console.log('Deal store_name:', dealData.store_name);
      console.log('Deal store_name_ar:', dealData.store_name_ar);
      console.log('Deal store_slug:', dealData.store_slug);

      // Fetch store details
      if (dealData.store_id) {
        const { data: storeData } = await supabase
          .from('stores')
          .select('*')
          .eq('id', dealData.store_id)
          .single();

        console.log('=== STORE DATA ===');
        console.log('Full store object:', storeData);
        if (storeData) {
          console.log('Store ID:', storeData.id);
          console.log('Store title:', storeData.title);
          console.log('Store title_ar:', storeData.title_ar);
          console.log('Store slug:', storeData.slug);
          console.log('Store profile_picture_url:', storeData.profile_picture_url);
          console.log('Store redirect_url:', storeData.redirect_url);
          
          setStore(storeData);
          
          // Fetch related deals from the same store
          const { data: relatedData } = await supabase
            .from('deals')
            .select('*')
            .eq('store_id', dealData.store_id)
            .neq('slug', dealSlug)
            .limit(4);

          if (relatedData) {
            setRelatedDeals(relatedData.map(d => ({
              ...d,
              store_name: storeData.title,
              store_name_ar: storeData.title_ar,
              store_logo: storeData.profile_picture_url,
            })));
          }
        }
      }

      setDeal(dealData);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error(isRTL ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (deal?.code) {
      const success = await copyToClipboard(deal.code);
      if (success) {
        setCopied(true);
        toast.success(isRTL ? 'تم نسخ الكود' : 'Code copied!');
        setTimeout(() => setCopied(false), 2000);
      } else {
        toast.error(isRTL ? 'فشل نسخ الكود' : 'Failed to copy code');
      }
    }
  };

  const handleGetDeal = () => {
    const url = deal?.redirect_url || store?.redirect_url || store?.website_url;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const toggleSave = (dealId: number) => {
    setSavedDeals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dealId)) {
        newSet.delete(dealId);
        toast.success(isRTL ? "تمت إزالة العرض من المحفوظات" : "Deal removed from saved");
      } else {
        newSet.add(dealId);
        toast.success(isRTL ? "تم حفظ العرض" : "Deal saved successfully");
      }
      return newSet;
    });
  };

  const copyDealLink = async () => {
    const url = window.location.href;
    const success = await copyToClipboard(url);
    if (success) {
      setLinkCopied(true);
      toast.success(isRTL ? 'تم نسخ الرابط' : 'Link copied!');
      setTimeout(() => setLinkCopied(false), 2000);
    } else {
      toast.error(isRTL ? 'فشل نسخ الرابط' : 'Failed to copy link');
    }
  };

  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const url = window.location.href;
    const text = dealTitle || 'Check out this deal!';
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const url = window.location.href;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const text = dealTitle || 'Check out this deal!';
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-[#E8F3E8] min-h-screen">
        <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <Skeleton className="h-12 w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 rounded-2xl mb-8" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!deal) {
    return (
      <section className="py-12 md:py-16 bg-[#E8F3E8] min-h-screen">
        <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <div className="text-center py-12">
            <Tag className="h-16 w-16 text-[#6B7280] mx-auto mb-4" />
            <h2 className="text-[#111827] mb-4" style={{ fontSize: '24px', fontWeight: 700 }}>
              {isRTL ? 'العرض غير موجود' : 'Deal not found'}
            </h2>
            <Link to="/deals">
              <Button className="bg-[#5FB57A] hover:bg-[#4FA669] text-white border-2 border-[#111827] rounded-lg">
                {isRTL ? 'العودة إلى العروض' : 'Back to Deals'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const dealTitle = isRTL && deal.title_ar ? deal.title_ar : deal.title;
  const dealDescription = isRTL && deal.description_ar ? deal.description_ar : deal.description;
  
  // Get store name with proper fallbacks (using 'title' field from stores table)
  const getStoreName = (): string => {
    if (store) {
      // The stores table uses 'title' field, not 'name' or 'store_name'
      if (isRTL) {
        return store.title_ar || store.title || 'Store';
      }
      return store.title || 'Store';
    }
    // Fallback to deal's store name if store object not available
    if (isRTL) {
      return deal.store_name_ar || deal.store_name || 'Store';
    }
    return deal.store_name || 'Store';
  };
  
  const storeName = getStoreName();
  const termsConditions = isRTL && deal.terms_conditions_ar ? deal.terms_conditions_ar : deal.terms_conditions;
  
  // Get store slug for navigation - use actual slug or generate from store name
  const getStoreSlug = (): string => {
    if (store?.slug) return store.slug;
    if (deal.store_slug) return deal.store_slug;
    
    // Generate slug from store name if not available
    const fallbackName = storeName || store?.title || '';
    return fallbackName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };
  
  const storeSlug = getStoreSlug();
  
  console.log('=== NAVIGATION DATA ===');
  console.log('Store Name:', storeName);
  console.log('Store Slug:', storeSlug);
  console.log('Store Object Slug:', store?.slug);
  console.log('Navigation URL:', `/store/${storeSlug}`);

  return (
    <section className="py-12 md:py-16 bg-[#E8F3E8] min-h-screen">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/deals" className="inline-flex items-center text-[#5FB57A] hover:text-[#4FA669] mb-8 transition-colors">
          <ArrowLeft className={`h-5 w-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
          {isRTL ? 'العودة إلى جميع العروض' : 'Back to All Deals'}
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Deal Card */}
            <div className="bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-8 mb-8">
              {/* Store Header */}
              <Link 
                to={`/store/${storeSlug}`}
                className={`flex items-center gap-4 mb-6 pb-6 border-b-2 border-[#E5E7EB] ${isRTL ? 'flex-row-reverse' : ''} group cursor-pointer hover:bg-[#F9FAFB] -mx-8 -mt-8 px-8 pt-8 rounded-t-2xl transition-colors`}
              >
                {store && store.profile_picture_url ? (
                  <ImageWithFallback
                    src={store.profile_picture_url}
                    alt={storeName || ''}
                    className="h-16 w-16 object-contain rounded-lg border-2 border-[#E5E7EB] p-2 group-hover:border-[#5FB57A] transition-colors"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-[#E8F3E8] border-2 border-[#111827] flex items-center justify-center group-hover:border-[#5FB57A] transition-colors">
                    <StoreIcon className="h-8 w-8 text-[#5FB57A]" />
                  </div>
                )}
                <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className="text-[#6B7280] text-sm mb-1">
                    {isRTL ? 'متجر' : 'Store'}
                  </div>
                  <div className="text-[#111827] group-hover:text-[#5FB57A] transition-colors" style={{ fontSize: '20px', fontWeight: 700 }}>
                    {storeName}
                  </div>
                </div>
                <ExternalLink className={`h-5 w-5 text-[#6B7280] group-hover:text-[#5FB57A] transition-colors ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Link>

              {/* Badges */}
              <div className={`flex flex-wrap gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {deal.is_verified && (
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#E8F3E8] text-[#5FB57A] text-sm border-2 border-[#5FB57A]">
                    <BadgeCheck className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'موثوق' : 'Verified'}
                  </span>
                )}
                {deal.featured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#FEF3C7] text-[#F59E0B] text-sm border-2 border-[#F59E0B]">
                    <TrendingUp className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'مميز' : 'Featured'}
                  </span>
                )}
                {deal.category_name && (
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-white text-[#111827] text-sm border-2 border-[#111827]">
                    {deal.category_name}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-[#111827] mb-4" style={{ fontSize: '32px', fontWeight: 700 }} dir={isRTL ? 'rtl' : 'ltr'}>
                {dealTitle}
              </h1>

              {/* Description */}
              {dealDescription && (
                <p className="text-[#6B7280] mb-6" style={{ fontSize: '18px' }} dir={isRTL ? 'rtl' : 'ltr'}>
                  {dealDescription}
                </p>
              )}

              {/* Discount Display */}
              {deal.discount_percentage && (
                <div className="bg-[#E8F3E8] rounded-xl border-2 border-[#5FB57A] p-6 mb-6">
                  <div className="text-center">
                    <div className="text-[#5FB57A]" style={{ fontSize: '48px', fontWeight: 700 }}>
                      {deal.discount_percentage}%
                    </div>
                    <div className="text-[#111827]" style={{ fontSize: '20px', fontWeight: 600 }}>
                      {isRTL ? 'خصم' : 'OFF'}
                    </div>
                  </div>
                </div>
              )}

              {/* Coupon Code */}
              {deal.code && (
                <div className="mb-6">
                  <div className={`text-[#111827] mb-2 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontSize: '16px', fontWeight: 600 }}>
                    {isRTL ? 'كود الكوبون:' : 'Coupon Code:'}
                  </div>
                  <div 
                    onClick={copyCode}
                    className="bg-white border-2 border-[#111827] rounded-xl p-6 flex items-center justify-between cursor-pointer hover:bg-[#E8F3E8] transition-colors group"
                  >
                    <div className="text-[#111827]" style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '2px' }}>
                      {deal.code}
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyCode();
                      }}
                      className="bg-[#5FB57A] hover:bg-[#4FA669] text-white border-2 border-[#111827] rounded-lg shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                      {copied ? (
                        <>
                          <Check className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {isRTL ? 'تم النسخ' : 'Copied'}
                        </>
                      ) : (
                        <>
                          <Copy className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {isRTL ? 'نسخ' : 'Copy'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <Button
                onClick={handleGetDeal}
                className="w-full bg-[#5FB57A] hover:bg-[#4FA669] text-white border-2 border-[#111827] rounded-xl shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all py-6"
                style={{ fontSize: '20px', fontWeight: 700 }}
              >
                <ExternalLink className={`h-6 w-6 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                {isRTL ? 'احصل على العرض الآن' : 'Get This Deal Now'}
              </Button>

              {/* Terms & Conditions */}
              {termsConditions && (
                <div className="mt-8 pt-6 border-t-2 border-[#E5E7EB]">
                  <h3 className={`text-[#111827] mb-3 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontSize: '18px', fontWeight: 700 }}>
                    {isRTL ? 'الشروط والأحكام' : 'Terms & Conditions'}
                  </h3>
                  <p className="text-[#6B7280] text-sm" dir={isRTL ? 'rtl' : 'ltr'}>
                    {termsConditions}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Expiration Timer */}
            {deal.expires_at && (
              <div className="bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-6 mb-6">
                <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Clock className="h-6 w-6 text-[#F59E0B]" />
                  <div className="text-[#111827]" style={{ fontSize: '18px', fontWeight: 700 }}>
                    {isRTL ? 'ينتهي خلال' : 'Expires in'}
                  </div>
                </div>
                <div className="text-center bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-xl p-4">
                  <div className="text-[#F59E0B]" style={{ fontSize: '32px', fontWeight: 700 }}>
                    {timeLeft}
                  </div>
                  <div className="text-[#92400E] text-sm">
                    {new Date(deal.expires_at).toLocaleDateString(isRTL ? 'ar' : 'en', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Price Info */}
            {(deal.original_price || deal.discounted_price) && (
              <div className="bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-6 mb-6">
                <div className={`text-[#111827] mb-4 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontSize: '18px', fontWeight: 700 }}>
                  {isRTL ? 'تفاصيل السعر' : 'Price Details'}
                </div>
                {deal.original_price && (
                  <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[#6B7280]">{isRTL ? 'السعر الأصلي' : 'Original Price'}</span>
                    <span className="text-[#6B7280] line-through">${deal.original_price}</span>
                  </div>
                )}
                {deal.discounted_price && (
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[#111827]" style={{ fontWeight: 600 }}>{isRTL ? 'السعر بعد الخصم' : 'Discounted Price'}</span>
                    <span className="text-[#5FB57A]" style={{ fontSize: '24px', fontWeight: 700 }}>${deal.discounted_price}</span>
                  </div>
                )}
              </div>
            )}

            {/* Share Widget */}
            <div className="bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-6">
              <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Share2 className="h-5 w-5 text-[#5FB57A]" />
                <div className={`text-[#111827] ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontSize: '18px', fontWeight: 700 }}>
                  {isRTL ? 'شارك هذا العرض' : 'Share This Deal'}
                </div>
              </div>
              <p className="text-[#6B7280] text-sm mb-4 text-center">
                {isRTL ? 'شارك هذا العرض مع أصدقائك' : 'Share this deal with your friends'}
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Facebook */}
                <button
                  onClick={shareOnFacebook}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#1877F2] hover:bg-[#166FE5] text-white transition-colors border-2 border-[#111827] shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                  <span className="text-sm" style={{ fontWeight: 600 }}>Facebook</span>
                </button>

                {/* Twitter */}
                <button
                  onClick={shareOnTwitter}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#000000] hover:bg-[#1a1a1a] text-white transition-colors border-2 border-[#111827] shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="h-4 w-4" />
                  <span className="text-sm" style={{ fontWeight: 600 }}>Twitter</span>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={shareOnLinkedIn}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0A66C2] hover:bg-[#095196] text-white transition-colors border-2 border-[#111827] shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                  <span className="text-sm" style={{ fontWeight: 600 }}>LinkedIn</span>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={shareOnWhatsApp}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#25D366] hover:bg-[#20BD5B] text-white transition-colors border-2 border-[#111827] shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                  aria-label="Share on WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm" style={{ fontWeight: 600 }}>WhatsApp</span>
                </button>
              </div>

              {/* Copy Link Button */}
              <button
                onClick={copyDealLink}
                className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white hover:bg-[#E8F3E8] text-[#5FB57A] transition-colors border-2 border-[#5FB57A]"
              >
                {linkCopied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="text-sm" style={{ fontWeight: 600 }}>
                      {isRTL ? 'تم نسخ الرابط' : 'Link Copied'}
                    </span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-4 w-4" />
                    <span className="text-sm" style={{ fontWeight: 600 }}>
                      {isRTL ? 'نسخ الرابط' : 'Copy Link'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Related Deals */}
        {relatedDeals.length > 0 && (
          <div className="mt-12">
            <h2 className={`text-[#111827] mb-6 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontSize: '28px', fontWeight: 700 }}>
              {isRTL ? 'عروض ذات صلة من نفس المتجر' : 'More Deals from This Store'}
            </h2>
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {relatedDeals.map((relatedDeal) => (
                <DealCard
                  key={relatedDeal.id}
                  deal={relatedDeal}
                  isRTL={isRTL}
                  isSaved={savedDeals.has(relatedDeal.id)}
                  onToggleSave={toggleSave}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
