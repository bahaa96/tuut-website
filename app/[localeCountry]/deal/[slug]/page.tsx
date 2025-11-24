import { fetchDealBySlug } from "../../../../lib/supabase-fetch";
import DealClientInteractions from "./DealClientInteractions";
import DealSidebar from "./DealSidebar";
import Link from "next/link";
import { Deal } from "../../../../domain-models";
import {
  ArrowLeft,
  TrendingUp,
  BadgeCheck,
  Store as StoreIcon,
  Tag,
} from "lucide-react";
import { ImageWithFallback } from "../../../../components/figma/ImageWithFallback";
import RelatedDealsSection from "./RelatedDealsSection";

interface DealDetailPageProps {
  params: Promise<{
    localeCountry: string;
    slug: string;
  }>;
}

export default async function DealDetailPage({ params }: DealDetailPageProps) {
  // Await params as required by Next.js 15
  const resolvedParams = await params;

  // Extract country from localeCountry (e.g., "en-EG" -> "EG")
  const country = resolvedParams.localeCountry.split('-')[1];
  const language = resolvedParams.localeCountry.split('-')[0];
  const isRTL = language === 'ar';
  const dealSlug = resolvedParams.slug;

  // Fetch deal data server-side
  let deal: Deal | null = null;
  let store: any = null;
  let relatedDeals: Deal[] = [];

  try {
    // Fetch deal details
    const dealResult = await fetchDealBySlug(dealSlug);

    if (!dealResult.error && dealResult.data) {
      deal = dealResult.data;

      // Fetch store details if store_id exists
      if (dealResult.data?.store_id) {
        const { createClient } = await import("../../../../utils/supabase/client");
        const supabase = createClient();

        // Fetch store details
        const { data: storeData } = await supabase
          .from('stores')
          .select('*')
          .eq('id', dealResult.data.store_id)
          .single();

        if (storeData) {
          store = storeData;
        }

        // Fetch related deals from the same store
        const { data: relatedData } = await supabase
          .from('deals')
          .select('*')
          .eq('store_id', dealResult.data.store_id)
          .neq('slug_en', dealSlug)
          .neq('slug_ar', dealSlug)
          .limit(4);

        if (relatedData) {
          relatedDeals = relatedData.map((d: any) => ({
            ...d,
            store_name: store?.title || store?.store_name || dealResult.data.store_name,
            store_name_ar: store?.title_ar || store?.store_name_ar || dealResult.data.store_name_ar,
            store_logo: store?.profile_picture_url || store?.logo_url || dealResult.data.store_logo,
          }));
        }
      }
    }

  } catch (error) {
    console.error('Error fetching deal data:', error);
  }

  // If no deal found, show 404
  if (!deal) {
    return (
      <section className="py-12 md:py-16 bg-[#E8F3E8] min-h-screen">
        <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <div className="text-center py-12">
            <Tag className="h-16 w-16 text-[#6B7280] mx-auto mb-4" />
            <h2 className="text-[#111827] mb-4" style={{ fontSize: '24px', fontWeight: 700 }}>
              {isRTL ? 'العرض غير موجود' : 'Deal not found'}
            </h2>
            <Link href="/deals" className="inline-flex items-center bg-white text-[#111827] border-2 border-[#111827] hover:bg-[#F0F7F0] px-6 py-3 rounded-xl font-medium transition-all shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)]">
              {isRTL ? 'العودة إلى العروض' : 'Back to Deals'}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const dealTitle = isRTL && deal.title_ar ? deal.title_ar : deal.title_en;
  const dealDescription = isRTL && deal.description_ar ? deal.description_ar : deal.description_en;

  // Get store name with proper fallbacks
  const getStoreName = (): string => {
    if (store) {
      if (isRTL) {
        return store.title_ar || store.name_ar || store.store_name_ar || store.title_en || store.title || store.store_name || store.name || 'Store';
      }
      return store.title_en || store.title || store.store_name || store.name || 'Store';
    }
    if (isRTL) {
      return deal.store_name_ar || deal.store_name || 'Store';
    }
    return deal.store_name || 'Store';
  };

  const storeName = getStoreName();

  // Get store slug for navigation
  const getStoreSlug = (): string => {
    // Use localized slug based on language
    if (isRTL && store?.slug_ar) return store.slug_ar;
    if (!isRTL && store?.slug_en) return store.slug_en;

    // Fallback to any available slug
    if (store?.slug_en) return store.slug_en;
    if (store?.slug_ar) return store.slug_ar;
    if (deal.store_slug) return deal.store_slug;

    const fallbackName = storeName || store?.title_en || store?.title || '';
    return fallbackName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const storeSlug = getStoreSlug();
  const termsConditions = isRTL && deal.terms_conditions_ar ? deal.terms_conditions_ar : deal.terms_conditions;

  return (
    <section className="py-12 md:py-16 bg-[#E8F3E8] min-h-screen">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/deals" className="inline-flex items-center text-[#5FB57A] hover:text-[#4FA669] mb-8 transition-colors">
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
                href={`/store/${storeSlug}`}
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
                <div className={`h-5 w-5 text-[#6B7280] group-hover:text-[#5FB57A] transition-colors ${isRTL ? 'mr-2' : 'ml-2'}`} style={{ transform: 'rotate(-45deg)' }}>
                  →
                </div>
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

              {/* Client-side interactive components */}
              <DealClientInteractions
                deal={deal}
                store={store}
                isRTL={isRTL}
                language={language}
              />

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
            <DealSidebar
              deal={deal}
              store={store}
              isRTL={isRTL}
              language={language}
            />
          </div>
        </div>

        {/* Related Deals */}
        {relatedDeals.length > 0 && (
          <div className="mt-12">
            <h2 className={`text-[#111827] mb-6 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontSize: '28px', fontWeight: 700 }}>
              {isRTL ? 'عروض ذات صلة من نفس المتجر' : 'More Deals from This Store'}
            </h2>
            <RelatedDealsSection deals={relatedDeals} isRTL={isRTL} />
          </div>
        )}
      </div>
    </section>
  );
}