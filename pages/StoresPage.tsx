import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Grid, List, Filter, X, ChevronDown, Store as StoreIcon, Tag, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { useLanguage } from "../contexts/LanguageContext";
import { useCountry } from "../contexts/CountryContext";
import { getCountryValue } from "../utils/countryHelpers";
import Link from "next/link";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

interface Store {
  id: string;
  name?: string;
  store_name?: string;
  title?: string;
  name_ar?: string;
  store_name_ar?: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  logo?: string;
  logo_url?: string;
  image_url?: string;
  profile_image?: string;
  profile_image_url?: string;
  banner_image?: string;
  cover_image?: string;
  slug?: string;
  deals_count?: number;
  active_deals_count?: number;
  category_id?: string;
  country_id?: string;
  featured?: boolean;
  is_featured?: boolean;
  rating?: number;
  total_savings?: string;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'deals' | 'featured';

export default function StoresPage() {
  const { t, isRTL, language } = useLanguage();
  const { country } = useCountry();
  // SSR data removed - will fetch client-side
  const hasSSRData = ssrData && ssrData.stores;

  const [stores, setStores] = useState<Store[]>(hasSSRData ? ssrData.stores || [] : []);
  const [displayedStores, setDisplayedStores] = useState<Store[]>(hasSSRData ? (ssrData.stores || []).slice(0, 20) : []);
  const [loading, setLoading] = useState(!hasSSRData);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(hasSSRData ? (ssrData.stores || []).length > 20 : true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const ITEMS_PER_PAGE = 20;

  // Fetch stores from API only if no SSR data
  useEffect(() => {
    if (!hasSSRData) {
      fetchStores();
    }
  }, [country, language, hasSSRData]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const countryValue = getCountryValue(country);
      
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      const url = countryValue 
        ? `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/stores?country=${countryValue}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/stores`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.stores && result.stores.length > 0) {
        setStores(result.stores);
        setDisplayedStores(result.stores.slice(0, ITEMS_PER_PAGE));
        setHasMore(result.stores.length > ITEMS_PER_PAGE);
      } else {
        setStores([]);
        setDisplayedStores([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching stores:', err);
      setStores([]);
      setDisplayedStores([]);
    } finally {
      setLoading(false);
      setPage(1);
    }
  };

  // Filter and sort stores
  const getFilteredAndSortedStores = useCallback(() => {
    let filtered = [...stores];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((store) => {
        const name = getStoreName(store, language).toLowerCase();
        const description = getStoreDescription(store, language).toLowerCase();
        return name.includes(query) || description.includes(query);
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return getStoreName(a, language).localeCompare(getStoreName(b, language));
        case 'deals':
          const aDeals = a.active_deals_count || a.deals_count || 0;
          const bDeals = b.active_deals_count || b.deals_count || 0;
          return bDeals - aDeals;
        case 'featured':
        default:
          const aFeatured = a.featured || a.is_featured ? 1 : 0;
          const bFeatured = b.featured || b.is_featured ? 1 : 0;
          return bFeatured - aFeatured;
      }
    });

    return filtered;
  }, [stores, searchQuery, sortBy, language]);

  // Update displayed stores when filters change
  useEffect(() => {
    const filtered = getFilteredAndSortedStores();
    setDisplayedStores(filtered.slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setHasMore(filtered.length > ITEMS_PER_PAGE);
  }, [searchQuery, sortBy, getFilteredAndSortedStores]);

  // Load more stores
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const filtered = getFilteredAndSortedStores();
    const nextPage = page + 1;
    const start = 0;
    const end = nextPage * ITEMS_PER_PAGE;
    
    setTimeout(() => {
      setDisplayedStores(filtered.slice(start, end));
      setPage(nextPage);
      setHasMore(filtered.length > end);
      setLoadingMore(false);
    }, 500);
  }, [page, hasMore, loadingMore, getFilteredAndSortedStores]);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loadMore]);

  // Helper functions
  function getStoreName(store: Store, lang: string): string {
    if (lang === 'ar') {
      return store.name_ar || store.store_name_ar || store.title_ar || 
             store.name || store.store_name || store.title || 'Store';
    }
    return store.name || store.store_name || store.title || 'Store';
  }

  function getStoreDescription(store: Store, lang: string): string {
    if (lang === 'ar') {
      return store.description_ar || store.description || '';
    }
    return store.description || '';
  }

  function getStoreLogo(store: Store): string {
    return store.profile_picture_url || store.logo || store.logo_url || store.image_url || '';
  }

  function getStoreProfileImage(store: Store): string {
    return store.profile_image || store.profile_image_url || store.banner_image || store.cover_image || '';
  }

  function getStoreSlug(store: Store): string {
    const name = getStoreName(store, 'en');
    return store.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function getDealsCount(store: Store): number {
    return store.total_offers || store.active_deals_count || store.deals_count || 0;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h1 className="mb-3 text-[#111827]" style={{ fontSize: '48px', fontWeight: 700 }}>
            {language === 'en' ? 'All Stores' : 'جميع المتاجر'}
          </h1>
          <p className="text-[#6B7280] text-lg">
            {language === 'en' 
              ? `Discover ${stores.length} stores with exclusive deals and coupons`
              : `اكتشف ${stores.length} متجر مع عروض وكوبونات حصرية`
            }
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className={`mb-8 bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-4 md:p-6`}>
          <div className={`flex flex-col md:flex-row gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280] ${isRTL ? 'right-3' : 'left-3'}`} />
              <Input
                type="text"
                placeholder={language === 'en' ? 'Search stores...' : 'ابحث عن المتاجر...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} h-12 border-2 border-[#111827] rounded-xl`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'}`}
                >
                  <X className="h-5 w-5 text-[#6B7280] hover:text-[#111827]" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className={`h-12 border-2 border-[#111827] rounded-xl px-6 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Filter className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {language === 'en' ? 'Sort by' : 'ترتيب حسب'}
                  <ChevronDown className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <DropdownMenuItem onClick={() => setSortBy('featured')}>
                  {language === 'en' ? 'Featured' : 'مميز'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('name')}>
                  {language === 'en' ? 'Name (A-Z)' : 'الاسم (أ-ي)'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('deals')}>
                  {language === 'en' ? 'Most Deals' : 'الأكثر عروضاً'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                className={`h-12 w-12 p-0 border-2 border-[#111827] rounded-xl ${
                  viewMode === 'grid' ? 'bg-[#5FB57A] hover:bg-[#4fa66b]' : ''
                }`}
              >
                <Grid className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className={`h-12 w-12 p-0 border-2 border-[#111827] rounded-xl ${
                  viewMode === 'list' ? 'bg-[#5FB57A] hover:bg-[#4fa66b]' : ''
                }`}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {searchQuery && (
            <div className={`mt-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-sm text-[#6B7280]">
                {language === 'en' ? 'Searching for:' : 'البحث عن:'}
              </span>
              <Badge 
                variant="secondary" 
                className="bg-[#E8F3E8] text-[#111827] border border-[#5FB57A]"
              >
                {searchQuery}
                <button
                  onClick={() => setSearchQuery('')}
                  className={`${isRTL ? 'mr-2' : 'ml-2'} hover:text-[#EF4444]`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : displayedStores.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <StoreIcon className="h-16 w-16 text-[#9CA3AF] mx-auto mb-4" />
            <h3 className="text-xl text-[#111827] mb-2" style={{ fontWeight: 600 }}>
              {language === 'en' ? 'No stores found' : 'لم يتم العثور على متاجر'}
            </h3>
            <p className="text-[#6B7280]">
              {language === 'en' 
                ? 'Try adjusting your search or filters'
                : 'حاول تعديل البحث أو الفلاتر'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Stores Grid/List */}
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {displayedStores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  viewMode={viewMode}
                  language={language}
                  isRTL={isRTL}
                />
              ))}
            </div>

            {/* Load More Trigger */}
            {hasMore && (
              <div ref={loadMoreRef} className="mt-8 flex justify-center">
                {loadingMore && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-2">
                      <Skeleton className="h-64 w-64 rounded-2xl" />
                      <Skeleton className="h-64 w-64 rounded-2xl hidden md:block" />
                      <Skeleton className="h-64 w-64 rounded-2xl hidden lg:block" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Store Card Component
function StoreCard({ 
  store, 
  viewMode, 
  language,
  isRTL 
}: { 
  store: Store; 
  viewMode: ViewMode;
  language: string;
  isRTL: boolean;
}) {
  const name = language === 'ar' && store.name_ar ? store.name_ar : (store.name || store.store_name || store.title || 'Store');
  const description = language === 'ar' && store.description_ar ? store.description_ar : (store.description || '');
  const logo = store.profile_picture_url || store.logo || store.logo_url || store.image_url || '';
  const profileImage = store.profile_image || store.profile_image_url || store.banner_image || store.cover_image || '';
  const dealsCount = store.total_offers || store.active_deals_count || store.deals_count || 0;
  const isFeatured = store.featured || store.is_featured;
  const storeName = store.name || store.store_name || store.title || '';
  const slug = store.slug || storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  if (viewMode === 'list') {
    return (
      <Link to={`/store/${slug}`}>
        <div className={`group bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all overflow-hidden`}>
          {/* Profile Image Banner */}
          {profileImage && (
            <div className="relative h-32 w-full overflow-hidden">
              <ImageWithFallback
                src={profileImage}
                alt={name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
            </div>
          )}
          
          <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-6 p-6 ${profileImage ? '-mt-10 relative' : ''}`}>
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className={`h-20 w-20 rounded-xl border-2 overflow-hidden flex items-center justify-center p-2 ${profileImage ? 'border-white bg-white shadow-lg' : 'border-[#E5E7EB] bg-white'}`}>
                {logo ? (
                  <ImageWithFallback
                    src={logo}
                    alt={name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <StoreIcon className="h-10 w-10 text-[#9CA3AF]" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className="text-[#111827]" style={{ fontSize: '20px', fontWeight: 600 }}>
                  {name}
                </h3>
                {isFeatured && (
                  <Badge className="bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]">
                    <Star className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'} fill-current`} />
                    {language === 'en' ? 'Featured' : 'مميز'}
                  </Badge>
                )}
              </div>
              {description && (
                <p className="text-[#6B7280] text-sm mb-3 line-clamp-2">
                  {description}
                </p>
              )}
              <div className={`flex items-center gap-4 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-[#5FB57A] flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  {dealsCount} {language === 'en' ? 'deals' : 'عروض'}
                </span>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-[#E8F3E8] flex items-center justify-center group-hover:bg-[#5FB57A] transition-colors">
                <ChevronDown className={`h-5 w-5 text-[#5FB57A] group-hover:text-white ${isRTL ? 'rotate-90' : '-rotate-90'}`} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/store/${slug}`}>
      <div className="group bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all overflow-hidden">
        {/* Profile Image Banner */}
        {profileImage ? (
          <div className="relative h-32 w-full overflow-hidden">
            <ImageWithFallback
              src={profileImage}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
            {/* Featured Badge Overlay */}
            {isFeatured && (
              <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'}`}>
                <Badge className="bg-[#F59E0B] text-white border-0 shadow-lg">
                  <Star className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'} fill-current`} />
                  {language === 'en' ? 'Featured' : 'مميز'}
                </Badge>
              </div>
            )}
          </div>
        ) : (
          /* Featured Badge - No Profile Image */
          isFeatured && (
            <div className={`bg-[#FEF3C7] px-4 py-2 border-b-2 border-[#111827] ${isRTL ? 'text-right' : 'text-left'}`}>
              <Badge className="bg-[#F59E0B] text-white border-0">
                <Star className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'} fill-current`} />
                {language === 'en' ? 'Featured Store' : 'متجر مميز'}
              </Badge>
            </div>
          )
        )}

        <div className={`p-6 ${profileImage ? '-mt-8 relative' : ''}`}>
          {/* Logo */}
          <div className={`h-24 w-24 mx-auto mb-4 rounded-xl border-2 overflow-hidden flex items-center justify-center ${
            profileImage ? 'border-white bg-white shadow-lg p-0' : 'border-[#E5E7EB] bg-white p-0'
          }`}>
            {logo ? (
              <ImageWithFallback
                src={logo}
                alt={name}
                className="w-full h-full object-contain"
              />
            ) : (
              <StoreIcon className="h-12 w-12 text-[#9CA3AF]" />
            )}
          </div>

          {/* Content */}
          <div className="text-center">
            <h3 className="mb-2 text-[#111827]" style={{ fontSize: '18px', fontWeight: 600 }}>
              {name}
            </h3>
            {description && (
              <p className="text-[#6B7280] text-sm mb-4 line-clamp-2">
                {description}
              </p>
            )}
            <div className="flex items-center justify-center gap-2 text-sm text-[#5FB57A]">
              <Tag className="h-4 w-4" />
              <span style={{ fontWeight: 600 }}>
                {dealsCount} {language === 'en' ? 'Active Deals' : 'عروض نشطة'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
