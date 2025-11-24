import { useState, useEffect } from "react";
import { useParams, Link } from "next/navigation";
import { useLanguage } from "../contexts/LanguageContext";
import { createClient } from "../utils/supabase/client";
import { ArrowLeft, Store, ExternalLink } from "lucide-react";
import { Button } from "../components/ui/button";
import { DealCard } from "../components/DealCard";
import { Skeleton } from "../components/ui/skeleton";
import { toast } from "sonner";

// Helper function to generate slug from store name
function generateSlug(storeName: string): string {
  return storeName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Helper function to check if a string is a UUID
function isUUID(str: string): boolean {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(str);
}

interface Store {
  id: string;
  slug?: string;
  slug_en?: string;
  slug_ar?: string;
  title?: string;
  title_en?: string;
  title_ar?: string;
  store_name?: string;
  store_name_ar?: string;
  name?: string;
  name_ar?: string;
  logo_url?: string;
  profile_picture_url?: string;
  description?: string;
  description_en?: string;
  description_ar?: string;
  website_url?: string;
  redirect_url?: string;
  category?: string;
}

interface Deal {
  id: number;
  title: string;
  title_ar?: string;
  description_en?: string;
  description_ar?: string;
  discount_percentage?: number;
  discount_amount?: number;
  original_price?: number;
  discounted_price?: number;
  code?: string;
  store_id?: string;
  store_slug_en?: string;
  slug_ar?: string;
  store_name?: string;
  store_logo?: string;
  category_name?: string;
  expires_at?: string;
  is_verified?: boolean;
  featured?: boolean;
}

export default function StoreDetailsPage() {
  const { slug } = useParams();
  const { t, isRTL, language } = useLanguage();
  // SSR data removed - will fetch client-side
  const hasSSRData = ssrData && ssrData.store;
  const [store, setStore] = useState<Store | null>(hasSSRData ? ssrData.store : null);
  const [deals, setDeals] = useState<Deal[]>(hasSSRData ? (ssrData.deals || []) : []);
  const [loading, setLoading] = useState(!hasSSRData);
  const [savedDeals, setSavedDeals] = useState<Set<number>>(new Set());

  useEffect(() => {
    window.scrollTo(0, 0);
    // Only fetch if we don't have SSR data
    if (slug && !hasSSRData) {
      fetchStoreAndDeals(slug);
    }
  }, [slug, language, hasSSRData]);

  const fetchStoreAndDeals = async (storeSlug: string) => {
    try {
      setLoading(true);
      const supabase = createClient();

      // Try to fetch store details
      let storeData = null;
      let storeError = null;

      // Check if the slug is actually a UUID (store ID)
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (uuidPattern.test(storeSlug)) {
        // Attempt 1: Try by ID (UUID)
        console.log('Detected UUID, looking up by store ID:', storeSlug);
        const idResult = await supabase
          .from('stores')
          .select('*')
          .eq('id', storeSlug)
          .maybeSingle();

        if (idResult.data) {
          storeData = idResult.data;
          console.log('Found store by ID:', storeData.name || storeData.store_name);
        } else {
          console.error('Store not found with ID:', storeSlug);
          toast.error(isRTL ? 'المتجر غير موجود' : 'Store not found');
          setLoading(false);
          return;
        }
      } else {
        // Attempt 2: Try by slug_en first (localized slug)
        const slugEnResult = await supabase
          .from('stores')
          .select('*')
          .eq('slug_en', storeSlug)
          .maybeSingle();

        if (slugEnResult.data) {
          storeData = slugEnResult.data;
          console.log('Found store by slug_en column:', storeData.title_en || storeData.title);
        } else {
          // Attempt 3: Try by slug_ar (Arabic slug)
          const slugArResult = await supabase
            .from('stores')
            .select('*')
            .eq('slug_ar', storeSlug)
            .maybeSingle();

          if (slugArResult.data) {
            storeData = slugArResult.data;
            console.log('Found store by slug_ar column:', storeData.title_ar || storeData.title_en || storeData.title);
          } else {
            // Attempt 4: Try by legacy slug column
            const slugResult = await supabase
              .from('stores')
              .select('*')
              .eq('slug', storeSlug)
              .maybeSingle();

            if (slugResult.data) {
              storeData = slugResult.data;
              console.log('Found store by legacy slug column:', storeData.title_en || storeData.title || storeData.store_name || storeData.name);
            } else {
              // Attempt 5: Try by title_en first, then title (case-insensitive match)
              const searchName = storeSlug.replace(/-/g, ' ');
              const titleEnResult = await supabase
                .from('stores')
                .select('*')
                .ilike('title_en', searchName)
                .maybeSingle();

              if (titleEnResult.data) {
                storeData = titleEnResult.data;
                console.log('Found store by title_en column:', titleEnResult.data.title_en);
              } else {
                // Attempt 6: Try by legacy title (case-insensitive match)
                const titleResult = await supabase
                  .from('stores')
                  .select('*')
                  .ilike('title', searchName)
                  .maybeSingle();

                if (titleResult.data) {
                  storeData = titleResult.data;
                  console.log('Found store by legacy title column:', titleResult.data.title);
                } else {
                  // Attempt 7: Try by store_name (case-insensitive match)
                  const nameResult = await supabase
                    .from('stores')
                    .select('*')
                    .ilike('store_name', searchName)
                    .maybeSingle();

                  if (nameResult.data) {
                    storeData = nameResult.data;
                    console.log('Found store by store_name column:', storeData.store_name);
                  } else {
                    // Attempt 8: Try by name column (case-insensitive match)
                    const nameAltResult = await supabase
                      .from('stores')
                      .select('*')
                      .ilike('name', searchName)
                      .maybeSingle();

                    if (nameAltResult.data) {
                      storeData = nameAltResult.data;
                      console.log('Found store by name column:', storeData.name);
                    } else {
                      console.error('Store not found with slug:', storeSlug);
                      console.log('Tried:', { slug: storeSlug, searchName });
                      toast.error(isRTL ? 'المتجر غير موجود' : 'Store not found');
                      setLoading(false);
                      return;
                    }
                  }
                }
              }
            }
          }
        }
      }

      if (!storeData) {
        console.error('Store not found');
        toast.error(isRTL ? 'المتجر غير موجود' : 'Store not found');
        setLoading(false);
        return;
      }

      const storeName = storeData.title_en || storeData.title || storeData.store_name || storeData.name;
      const storeNameAr = storeData.title_ar || storeData.name_ar || storeData.store_name_ar || storeName;

      // Compute proper slug: prioritize localized slugs
      const computedStoreSlug = storeData.slug_en || storeData.slug_ar ||
        ((storeData.slug && !isUUID(storeData.slug)) ? storeData.slug : generateSlug(storeName));

      setStore({
        id: storeData.id,
        slug: computedStoreSlug,
        slug_en: storeData.slug_en,
        slug_ar: storeData.slug_ar,
        title: storeData.title_en || storeData.title || storeName,
        title_en: storeData.title_en || storeData.title || storeName,
        title_ar: storeData.title_ar || storeNameAr,
        store_name: storeName,
        store_name_ar: storeNameAr,
        name: storeName,
        name_ar: storeNameAr,
        logo_url: storeData.logo_url,
        profile_picture_url: storeData.profile_picture_url,
        description: storeData.description_en || storeData.description || '',
        description_en: storeData.description_en || storeData.description || '',
        description_ar: storeData.description_ar || '',
        website_url: storeData.website_url,
        redirect_url: storeData.redirect_url,
        category: storeData.category,
      });

      // Fetch all deals for this store
      const { data: dealsData, error: dealsError } = await supabase
        .from('deals')
        .select('*')
        .eq('store_id', storeData.id)
        .order('created_at', { ascending: false });

      if (dealsError) {
        console.error('Error fetching deals:', dealsError);
        setDeals([]);
        return;
      }

      // Format deals (reuse storeName and computed slug from above)
      
      const formattedDeals = dealsData.map((deal: any) => ({
        id: deal.id,
        title_en: deal.title_en,
        title_ar: deal.title_ar,
        description: deal.description,
        description_ar: deal.description_ar,
        discount_percentage: deal.discount_percentage,
        discount_amount: deal.discount_amount,
        original_price: deal.original_price,
        discounted_price: deal.discounted_price,
        code: deal.code,
        store_id: deal.store_id,
        store_slug: computedStoreSlug,
        store_name: storeName,
        store_logo: storeData.profile_picture_url || storeData.logo_url,
        category_name: deal.category_name,
        expires_at: deal.expires_at,
        is_verified: deal.is_verified,
        featured: deal.featured,
      }));

      setDeals(formattedDeals);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error(isRTL ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-[#E8F3E8] min-h-screen">
        <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <Skeleton className="h-12 w-48 mb-8" />
          <div className="bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-8 mb-8">
            <div className="flex items-start gap-6">
              <Skeleton className="h-24 w-24 rounded-xl" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!store) {
    return (
      <section className="py-12 md:py-16 bg-[#E8F3E8] min-h-screen">
        <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <div className="text-center py-12">
            <Store className="h-16 w-16 text-[#6B7280] mx-auto mb-4" />
            <h2 className="text-[#111827] mb-4" style={{ fontSize: '24px', fontWeight: 700 }}>
              {isRTL ? 'المتجر غير موجود' : 'Store not found'}
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

  const storeName = isRTL
    ? (store.title_ar || store.name_ar || store.store_name_ar || store.title || store.store_name)
    : (store.title_en || store.title || store.store_name || store.name);
  const storeDescription = isRTL && store.description_ar ? store.description_ar : (store.description_en || store.description);

  return (
    <section className="py-12 md:py-16 bg-[#E8F3E8] min-h-screen">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/deals" className="inline-flex items-center text-[#5FB57A] hover:text-[#4FA669] mb-8 transition-colors">
          <ArrowLeft className={`h-5 w-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
          {isRTL ? 'العودة إلى جميع العروض' : 'Back to All Deals'}
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
                isSaved={savedDeals.has(deal.id)}
                onToggleSave={toggleSave}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
