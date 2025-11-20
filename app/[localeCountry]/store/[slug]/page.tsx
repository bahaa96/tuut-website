import { ArrowLeft, Store, ExternalLink } from "lucide-react";
import Link from "next/link";
import { DealCard } from "@/components/DealCard";

interface Store {
  id: string;
  slug?: string;
  title?: string;
  title_ar?: string;
  store_name?: string;
  store_name_ar?: string;
  logo_url?: string;
  profile_picture_url?: string;
  description?: string;
  description_ar?: string;
  website_url?: string;
  redirect_url?: string;
  category?: string;
  deals?: any[];
}

interface Deal {
  id: number;
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
  store_slug?: string;
  store_name?: string;
  store_logo?: string;
  category_name?: string;
  expires_at?: string;
  is_verified?: boolean;
  featured?: boolean;
}

interface StoreDetailPageProps {
  params: Promise<{
    localeCountry: string;
    slug: string;
  }>;
}

export default async function StoreDetailPage({ params }: StoreDetailPageProps) {
  // Await params as required by Next.js 15
  const resolvedParams = await params;

  // Extract country from localeCountry (e.g., "en-EG" -> "EG")
  const country = resolvedParams.localeCountry.split('-')[1];
  const language = resolvedParams.localeCountry.split('-')[0];
  const isRTL = language === 'ar';
  const storeSlug = resolvedParams.slug;

  // Fetch store data server-side
  let store: Store | null = null;
  let deals: Deal[] = [];

  try {
    // Direct Supabase client queries following deal details page pattern
    const { createClient } = await import("../../../../utils/supabase/client");
    const supabase = createClient();

    // Fetch store by slug
    const { data: storeData } = await supabase
      .from('stores')
      .select('*')
      .eq('slug', storeSlug)
      .single();

    if (storeData) {
      // Format store data to match expected interface
      store = {
        id: storeData.id,
        name: storeData.title || storeData.store_name || storeData.name || 'Store',
        name_ar: storeData.title_ar || storeData.name_ar || '',
        store_name: storeData.title || storeData.store_name || storeData.name || 'Store',
        store_name_ar: storeData.title_ar || storeData.name_ar || '',
        title: storeData.title || storeData.store_name || storeData.name || 'Store',
        title_ar: storeData.title_ar || storeData.name_ar || '',
        description: storeData.description || '',
        description_ar: storeData.description_ar || '',
        logo: storeData.profile_picture_url || '',
        profile_picture_url: storeData.profile_picture_url || '',
        website_url: storeData.website_url || '',
        redirect_url: storeData.redirect_url || '',
        category: storeData.category || '',
        slug: storeData.slug || '',
      };

      // Fetch deals for this store
      const { data: dealsData } = await supabase
        .from('deals')
        .select('*')
        .eq('store_id', storeData.id)
        .order('created_at', { ascending: false });

      if (dealsData) {
        deals = dealsData.map((deal: any) => ({
          id: deal.id,
          title: deal.title,
          title_ar: deal.title_ar,
          description: deal.description,
          description_ar: deal.description_ar,
          discount_percentage: deal.discount_percentage,
          discount_amount: deal.discount_amount,
          original_price: deal.original_price,
          discounted_price: deal.discounted_price,
          code: deal.code,
          store_id: deal.store_id,
          store_slug: deal.store_slug,
          store_name: storeData.title || storeData.store_name || deal.store_name,
          store_logo: storeData.profile_picture_url || deal.store_logo,
          category_name: deal.category_name,
          expires_at: deal.expires_at,
          is_verified: deal.is_verified,
          featured: deal.featured,
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching store data:', error);
  }

  // If no store found, show 404
  if (!store) {
    return (
      <section className="py-12 md:py-16 bg-[#E8F3E8] min-h-screen">
        <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <div className="text-center py-12">
            <Store className="h-16 w-16 text-[#6B7280] mx-auto mb-4" />
            <h2 className="text-[#111827] mb-4" style={{ fontSize: '24px', fontWeight: 700 }}>
              {isRTL ? 'المتجر غير موجود' : 'Store not found'}
            </h2>
            <Link href="/stores" className="inline-flex items-center bg-white text-[#111827] border-2 border-[#111827] hover:bg-[#F0F7F0] px-6 py-3 rounded-xl font-medium transition-all shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)]">
              {isRTL ? 'العودة إلى المتاجر' : 'Back to Stores'}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const storeName = isRTL
    ? (store.title_ar || store.store_name_ar || store.title || store.store_name)
    : (store.title || store.store_name);
  const storeDescription = isRTL && store.description_ar ? store.description_ar : store.description;

  return (
    <section className="py-12 md:py-16 bg-[#E8F3E8] min-h-screen">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/stores" className="inline-flex items-center text-[#5FB57A] hover:text-[#4FA669] mb-8 transition-colors">
          <ArrowLeft className={`h-5 w-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
          {isRTL ? 'العودة إلى جميع المتاجر' : 'Back to All Stores'}
        </Link>

        {/* Store Header Card */}
        <div className="bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-8 mb-8">
          <div className={`flex flex-col md:flex-row items-start gap-6 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            {/* Store Logo */}
            {(store.profile_picture_url || store.logo_url) ? (
              <img
                src={store.profile_picture_url || store.logo_url}
                alt={storeName}
                className="h-24 w-24 object-contain rounded-xl bg-[#F9FAFB] p-4 border-2 border-[#E5E7EB]"
              />
            ) : (
              <div className="h-24 w-24 rounded-xl bg-[#E8F3E8] border-2 border-[#111827] flex items-center justify-center">
                <Store className="h-12 w-12 text-[#5FB57A]" />
              </div>
            )}

            {/* Store Info */}
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h1 className="text-[#111827] mb-3" style={{ fontSize: '32px', fontWeight: 700 }} dir={isRTL ? 'rtl' : 'ltr'}>
                {storeName}
              </h1>

              {storeDescription && (
                <p className="text-[#6B7280] mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
                  {storeDescription}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                {store.category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#E8F3E8] text-[#5FB57A] text-sm border-2 border-[#5FB57A]">
                    {store.category}
                  </span>
                )}

                {(store.redirect_url || store.website_url) && (
                  <a
                    href={store.redirect_url || store.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-[#5FB57A] text-white border-2 border-[#111827] shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                  >
                    <ExternalLink className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'زيارة المتجر' : 'Visit Store'}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Deals Section */}
        <div className={`mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h2 className="text-[#111827]" style={{ fontSize: '24px', fontWeight: 700 }}>
            {isRTL ? `جميع العروض (${deals.length})` : `All Deals (${deals.length})`}
          </h2>
        </div>

        {/* Deals Grid */}
        {deals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
            <p className="text-[#6B7280]" style={{ fontSize: '18px' }}>
              {isRTL ? 'لا توجد عروض متاحة حالياً' : 'No deals available at the moment'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {deals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                isRTL={isRTL}
                isSaved={false} // Server-side can't determine saved state
                onToggleSave={() => {}} // No-op for server-side
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}