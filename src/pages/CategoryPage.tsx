import { useEffect, useState } from 'react';
import { useParams } from '../router';
import { createClient } from '../utils/supabase/client';
import { DealCard } from '../components/DealCard';
import { useLanguage } from '../contexts/LanguageContext';
import { useCountry } from '../contexts/CountryContext';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Store, Tag, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface Category {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  color?: string;
  bg_color?: string;
}

interface StoreType {
  id: string;
  name: string;
  name_ar?: string;
  title?: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  logo?: string;
  logo_url?: string;
  image_url?: string;
  profile_image?: string;
  profile_image_url?: string;
  active_deals_count?: number;
  deals_count?: number;
  slug?: string;
}

interface Deal {
  id: string;
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  discount_amount?: string;
  discount_percentage?: number;
  coupon_code?: string;
  code?: string;
  image_url?: string;
  stores?: StoreType;
  created_at?: string;
  expires_at?: string;
}

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, language, isRTL } = useLanguage();
  const { country } = useCountry();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('deals');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategoryData();
  }, [slug, country]);

  async function fetchCategoryData() {
    try {
      setLoading(true);
      setError(null);
      const supabase = createClient();

      // Get country ID if country is selected
      let countryId = null;
      if (country) {
        const { data: countryData } = await supabase
          .from('countries')
          .select('id')
          .eq('value', country)
          .single();
        
        if (countryData) {
          countryId = countryData.id;
        }
      }

      // Fetch category details by slug or id
      let categoryQuery = supabase
        .from('categories')
        .select('*');

      // Try to find by slug first, then by id
      if (isNaN(Number(slug))) {
        categoryQuery = categoryQuery.eq('slug', slug);
      } else {
        categoryQuery = categoryQuery.eq('id', slug);
      }

      const { data: categoryData, error: categoryError } = await categoryQuery.single();

      if (categoryError || !categoryData) {
        console.error('Error fetching category:', categoryError);
        setError(isRTL ? 'لم يتم العثور على التصنيف' : 'Category not found');
        setLoading(false);
        return;
      }

      setCategory(categoryData);

      // Fetch stores in this category
      let storesQuery = supabase
        .from('stores')
        .select('*')
        .eq('category_id', categoryData.id)
        .order('active_deals_count', { ascending: false, nullsLast: true })
        .limit(12);

      if (countryId) {
        storesQuery = storesQuery.eq('country_id', countryId);
      }

      const { data: storesData, error: storesError } = await storesQuery;

      if (storesError) {
        console.error('Error fetching stores:', storesError);
      } else {
        setStores(storesData || []);
      }

      // Fetch deals in this category
      let dealsQuery = supabase
        .from('deals')
        .select('*, stores!deals_store_id_fkey(*)')
        .eq('category_id', categoryData.id)
        .order('created_at', { ascending: false })
        .limit(12);

      if (countryId) {
        dealsQuery = dealsQuery.eq('country_id', countryId);
      }

      const { data: dealsData, error: dealsError } = await dealsQuery;

      if (dealsError) {
        console.error('Error fetching deals:', dealsError);
      } else {
        setDeals(dealsData || []);
      }

    } catch (err) {
      console.error('Error in fetchCategoryData:', err);
      setError(isRTL ? 'حدث خطأ أثناء تحميل البيانات' : 'An error occurred while loading data');
    } finally {
      setLoading(false);
    }
  }

  const getCategoryName = () => {
    if (!category) return '';
    if (isRTL && category.name_ar) return category.name_ar;
    return category.name;
  };

  const getCategoryDescription = () => {
    if (!category) return '';
    if (isRTL && category.description_ar) return category.description_ar;
    return category.description || '';
  };

  const getStoreName = (store: StoreType) => {
    if (isRTL) {
      return store.name_ar || store.title_ar || store.name || store.title || 'Unnamed Store';
    }
    return store.name || store.title || store.name_ar || 'Unnamed Store';
  };

  const getStoreDescription = (store: StoreType) => {
    if (isRTL) {
      return store.description_ar || store.description || '';
    }
    return store.description || store.description_ar || '';
  };

  const getStoreLogo = (store: StoreType) => {
    return store.profile_image_url || store.profile_image || store.logo || store.logo_url || store.image_url || '';
  };

  const getStoreDealsCount = (store: StoreType) => {
    const count = store.active_deals_count ?? store.deals_count ?? 0;
    if (isRTL) {
      return `${count} ${count === 1 ? 'عرض' : 'عروض'}`;
    }
    return `${count} ${count === 1 ? 'deal' : 'deals'}`;
  };

  return (
    <div className="min-h-screen bg-[#E8F3E8] flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Category Header */}
        <div className="bg-white border-b-2 border-[#111827] py-12 md:py-16">
          <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
            {loading ? (
              <div className="text-center">
                <Skeleton className="h-12 w-64 mx-auto mb-4" />
                <Skeleton className="h-6 w-96 mx-auto" />
              </div>
            ) : error ? (
              <Alert variant="destructive" className="max-w-2xl mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="text-center">
                <h1 className="text-[#111827] mb-4">{getCategoryName()}</h1>
                {getCategoryDescription() && (
                  <p className="text-[#6B7280] max-w-2xl mx-auto">
                    {getCategoryDescription()}
                  </p>
                )}
                <div className="flex items-center justify-center gap-6 mt-6 text-sm text-[#6B7280]">
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    <span>{stores.length} {isRTL ? 'متاجر' : 'stores'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    <span>{deals.length} {isRTL ? 'عروض' : 'deals'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Tabs */}
        <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="deals" className="text-lg">
                <Tag className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'العروض' : 'Deals'} ({deals.length})
              </TabsTrigger>
              <TabsTrigger value="stores" className="text-lg">
                <Store className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'المتاجر' : 'Stores'} ({stores.length})
              </TabsTrigger>
            </TabsList>

            {/* Deals Tab */}
            <TabsContent value="deals">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-64 rounded-xl" />
                  ))}
                </div>
              ) : deals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {deals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Tag className="h-16 w-16 text-[#9CA3AF] mx-auto mb-4" />
                  <h3 className="text-xl text-[#111827] mb-2">
                    {isRTL ? 'لا توجد عروض' : 'No deals found'}
                  </h3>
                  <p className="text-[#6B7280]">
                    {isRTL 
                      ? 'لا توجد عروض متاحة في هذا التصنيف حاليًا' 
                      : 'No deals are currently available in this category'}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Stores Tab */}
            <TabsContent value="stores">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-48 rounded-xl" />
                  ))}
                </div>
              ) : stores.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stores.map((store) => {
                    return (
                      <a
                        key={store.id}
                        href={`/store/${store.slug || store.id}`}
                        className="group bg-white rounded-xl p-6 border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-center"
                      >
                        {/* Logo / Profile Picture */}
                        <div className="h-20 w-20 mx-auto mb-4 rounded-xl border-2 border-[#E5E7EB] bg-white overflow-hidden flex items-center justify-center">
                          {getStoreLogo(store) ? (
                            <ImageWithFallback
                              src={getStoreLogo(store)}
                              alt={getStoreName(store)}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Store className="h-10 w-10 text-[#9CA3AF]" />
                          )}
                        </div>
                        
                        <div className="text-center">
                          <h3 className="text-xl font-semibold text-[#111827] mb-2 line-clamp-1">
                            {getStoreName(store)}
                          </h3>
                          {getStoreDescription(store) && (
                            <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">
                              {getStoreDescription(store)}
                            </p>
                          )}
                          <div className="flex items-center justify-center gap-2 text-sm text-[#5FB57A]">
                            <Tag className="h-4 w-4" />
                            <span>{getStoreDealsCount(store)}</span>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Store className="h-16 w-16 text-[#9CA3AF] mx-auto mb-4" />
                  <h3 className="text-xl text-[#111827] mb-2">
                    {isRTL ? 'لا توجد متاجر' : 'No stores found'}
                  </h3>
                  <p className="text-[#6B7280]">
                    {isRTL 
                      ? 'لا توجد متاجر متاحة في هذا التصنيف حاليًا' 
                      : 'No stores are currently available in this category'}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
    </div>
  );
}
