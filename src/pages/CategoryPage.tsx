import { useEffect, useState } from 'react';
import { useParams } from '../router';
import { createClient } from '../utils/supabase/client';
import { DealCard } from '../components/DealCard';
import { useLanguage } from '../contexts/LanguageContext';
import { useCountry } from '../contexts/CountryContext';
import { Skeleton } from '../components/ui/skeleton';
import { Store, Tag, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/ui/button';
import { Link } from '../router';

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
  const [error, setError] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

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
          console.log('Selected country ID for filtering:', countryId, 'Country value:', country);
        } else {
          console.log('Country data not found for:', country);
        }
      } else {
        console.log('No country selected, showing all stores/deals');
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

      // Fetch stores in this category from store_categories junction table
      let storesQuery = supabase
        .from('store_categories')
        .select('stores!inner(*)')
        .eq('category_id', categoryData.id);

      // Filter by country at database level if country is selected
      if (countryId) {
        storesQuery = storesQuery.eq('stores.country_id', countryId);
        console.log('Applying country filter to stores query with country_id:', countryId);
      }

      const { data: storeCategoriesData, error: storesError } = await storesQuery;

      if (storesError) {
        console.error('Error fetching stores:', storesError);
        setStores([]);
      } else {
        // Extract stores from junction table
        let storesArray = storeCategoriesData
          ?.map((sc: any) => sc.stores)
          .filter(Boolean) || [];
        
        console.log('Total stores from store_categories (after database filter):', storesArray.length);
        
        // Sort by active deals count
        storesArray.sort((a: any, b: any) => {
          const aCount = a.active_deals_count ?? a.deals_count ?? 0;
          const bCount = b.active_deals_count ?? b.deals_count ?? 0;
          return bCount - aCount;
        });
        
        console.log('Final stores count after sorting:', storesArray.length);
        setStores(storesArray);
      }

      // Fetch deals in this category from deal_categories junction table
      let dealsQuery = supabase
        .from('deal_categories')
        .select('deals!inner(*, stores!deals_store_id_fkey(*))')
        .eq('category_id', categoryData.id);

      // Filter by country at database level if country is selected
      if (countryId) {
        dealsQuery = dealsQuery.eq('deals.country_id', countryId);
        console.log('Applying country filter to deals query with country_id:', countryId);
      }

      const { data: dealCategoriesData, error: dealsError } = await dealsQuery;

      if (dealsError) {
        console.error('Error fetching deals:', dealsError);
        setDeals([]);
      } else {
        // Extract deals from junction table
        let dealsArray = dealCategoriesData
          ?.map((dc: any) => dc.deals)
          .filter(Boolean) || [];
        
        console.log('Total deals from deal_categories (after database filter):', dealsArray.length);
        
        // Sort by created_at
        dealsArray.sort((a: any, b: any) => {
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        });
        
        console.log('Final deals count after sorting:', dealsArray.length);
        setDeals(dealsArray);
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

  const scrollStores = (direction: 'left' | 'right') => {
    const container = document.getElementById('stores-carousel');
    if (!container) return;
    
    const scrollAmount = 300;
    const newPosition = direction === 'left' 
      ? scrollPosition - scrollAmount 
      : scrollPosition + scrollAmount;
    
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    
    setScrollPosition(newPosition);
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

        {/* Stores Carousel Section */}
        {!loading && stores.length > 0 && (
          <div className="bg-white border-b-2 border-[#111827] py-8">
            <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
              <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h2 className="text-[#111827]" style={{ fontSize: '24px', fontWeight: 700 }}>
                  <Store className={`inline h-6 w-6 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? 'المتاجر المميزة' : 'Featured Stores'} ({stores.length})
                </h2>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scrollStores('left')}
                    className="h-10 w-10 rounded-lg border-2 border-[#111827]"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scrollStores('right')}
                    className="h-10 w-10 rounded-lg border-2 border-[#111827]"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Horizontal Scrolling Container */}
              <div
                id="stores-carousel"
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {stores.map((store) => (
                  <Link
                    key={store.id}
                    to={`/store/${store.slug || store.id}`}
                  >
                    <div className="flex-shrink-0 w-[200px] bg-white rounded-xl p-4 border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer">
                      {/* Logo */}
                      <div className="h-16 w-16 mx-auto mb-3 rounded-lg border-2 border-[#E5E7EB] bg-white overflow-hidden flex items-center justify-center">
                        {getStoreLogo(store) ? (
                          <ImageWithFallback
                            src={getStoreLogo(store)}
                            alt={getStoreName(store)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Store className="h-8 w-8 text-[#9CA3AF]" />
                        )}
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-sm font-semibold text-[#111827] mb-1 line-clamp-1">
                          {getStoreName(store)}
                        </h3>
                        <div className="flex items-center justify-center gap-1 text-xs text-[#5FB57A]">
                          <Tag className="h-3 w-3" />
                          <span>{getStoreDealsCount(store)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Deals Section */}
        <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-12">
          <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h2 className="text-[#111827]" style={{ fontSize: '24px', fontWeight: 700 }}>
              <Tag className={`inline h-6 w-6 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'جميع العروض' : 'All Deals'} ({deals.length})
            </h2>
          </div>

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
        </div>
    </div>
  );
}
