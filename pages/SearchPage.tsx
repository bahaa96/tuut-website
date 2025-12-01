import { useState, useEffect } from "react";
import { Search as SearchIcon, Store as StoreIcon, Tag, ShoppingBag, FileText, ArrowRight } from "lucide-react";
import { useSearchParams, Link } from "next/navigation";
import { useCountry } from "../contexts/CountryContext";
import { getCountryValue } from "../utils/countryHelpers";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { directSearch } from "../utils/directSearch";
import { checkDatabaseContent } from "../utils/databaseDiagnostic";
import { diagnoseStoreSearch } from "../utils/storeSearchDiagnostic";

interface Store {
  id: string;
  name?: string;
  store_name?: string;
  title_en?: string;
  name_ar?: string;
  store_name_ar?: string;
  logo?: string;
  logo_url?: string;
  profile_picture_url?: string;
  slug_en?: string;
  slug_ar?: string;
  description_en?: string;
  total_offers?: number;
}

interface Deal {
  id: string;
  title_en?: string;
  description_en?: string;
  coupon_code?: string;
  discount_percentage?: number;
  discount_amount?: number;
  original_price?: number;
  discounted_price?: number;
  image_url?: string;
  slug_en?: string;
  slug_ar?: string;
  stores?: Store;
}

interface Product {
  id: string;
  name?: string;
  name_ar?: string;
  description_en?: string;
  description_ar?: string;
  price?: number;
  image_url?: string;
  slug_en?: string;
  slug_ar?: string;
  category?: string;
}

interface Article {
  id: string;
  title_en?: string;
  title_ar?: string;
  excerpt?: string;
  excerpt_ar?: string;
  image_url?: string;
  slug_en?: string;
  slug_ar?: string;
  published_at?: string;
}

interface SearchResults {
  stores: Store[];
  deals: Deal[];
  products: Product[];
  articles: Article[];
  totalResults: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const language = 'en'; // TODO: Replace with proper locale detection
  const isRTL = language === 'ar';
  const { country } = useCountry();
  
  const [results, setResults] = useState<SearchResults>({
    stores: [],
    deals: [],
    products: [],
    articles: [],
    totalResults: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    } else {
      setLoading(false);
    }
  }, [query, country]);

  // Log when component mounts to help debug
  useEffect(() => {
    console.log('SearchPage mounted with query:', query, 'country:', country);
    // Run database diagnostic on first load to check if tables have data
    checkDatabaseContent();
  }, []);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const countryValue = getCountryValue(country);
      
      console.log('Search query:', query, 'Country:', countryValue);
      
      // Run diagnostic for debugging (helps identify field issues)
      if (query.toLowerCase().includes('noon') || query.toLowerCase().includes('نون')) {
        console.log('🔍 Running store search diagnostic for:', query);
        
        // Get country ID for diagnostic
        let diagnosticCountryId = null;
        if (countryValue) {
          const supabase = (await import('../utils/supabase/client')).createClient();
          const { data: countryData } = await supabase
            .from('countries')
            .select('id')
            .eq('value', countryValue)
            .single();
          diagnosticCountryId = countryData?.id || null;
        }
        
        await diagnoseStoreSearch(query, diagnosticCountryId);
      }
      
      // Try edge function first, fallback to direct search if it fails
      try {
        const { projectId, publicAnonKey } = await import('../utils/supabase/info');
        
        const url = countryValue 
          ? `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/search?q=${encodeURIComponent(query)}&country=${countryValue}`
          : `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/search?q=${encodeURIComponent(query)}`;
        
        console.log('Trying edge function search with URL:', url);
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn('Edge function search failed:', response.status, errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Edge function search response:', result);

        if (result.success) {
          const searchResults = {
            stores: result.stores || [],
            deals: result.deals || [],
            products: result.products || [],
            articles: result.articles || [],
            totalResults: result.totalResults || 0,
          };
          console.log('Setting search results from edge function:', searchResults);
          setResults(searchResults);
          return;
        }
      } catch (edgeFunctionError) {
        console.warn('Edge function search failed, falling back to direct search:', edgeFunctionError);
        
        // Fallback to direct search
        console.log('Using direct Supabase search...');
        const result = await directSearch({
          query,
          countryValue: countryValue || undefined,
        });
        
        console.log('Direct search response:', result);
        
        const searchResults = {
          stores: result.stores || [],
          deals: result.deals || [],
          products: result.products || [],
          articles: result.articles || [],
          totalResults: result.totalResults || 0,
        };
        console.log('Setting search results from direct search:', searchResults);
        setResults(searchResults);
      }
    } catch (err) {
      console.error('Error fetching search results:', err);
      setResults({
        stores: [],
        deals: [],
        products: [],
        articles: [],
        totalResults: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStoreName = (store: Store): string => {
    if (language === 'ar') {
      return store.name_ar || store.store_name_ar || store.name || store.store_name || store.title || 'Store';
    }
    return store.name || store.store_name || store.title || 'Store';
  };

  const getStoreLogo = (store: Store): string => {
    return store.profile_picture_url || store.logo || store.logo_url || '';
  };

  const getStoreSlug = (store: Store): string => {
    const name = store.name || store.store_name || store.title || '';
    return store.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const getProductName = (product: Product): string => {
    return language === 'ar' ? (product.name_ar || product.name || '') : (product.name || product.name_ar || '');
  };

  const getArticleTitle = (article: Article): string => {
    return language === 'ar' ? (article.title_ar || article.title || '') : (article.title || article.title_ar || '');
  };

  const getArticleExcerpt = (article: Article): string => {
    return language === 'ar' ? (article.excerpt_ar || article.excerpt || '') : (article.excerpt || article.excerpt_ar || '');
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <div className="text-center py-20">
            <SearchIcon className="h-16 w-16 text-[#9CA3AF] mx-auto mb-4" />
            <h2 className="text-[#111827] mb-2" style={{ fontSize: '24px', fontWeight: 600 }}>
              {language === 'en' ? 'No search query' : 'لا يوجد استعلام بحث'}
            </h2>
            <p className="text-[#6B7280]">
              {language === 'en' 
                ? 'Enter a search term to find stores, deals, products, and guides' 
                : 'أدخل مصطلح البحث للعثور على المتاجر والعروض والمنتجات والأدلة'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 md:py-12">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        {/* Search Header */}
        <div className={`mb-8 ${isRTL ? 'text-right' : ''}`}>
          <h1 className="text-[#111827] mb-2" style={{ fontSize: '36px', fontWeight: 700 }}>
            {language === 'en' ? 'Search Results' : 'نتائج البحث'}
          </h1>
          <p className="text-[#6B7280]" style={{ fontSize: '18px' }}>
            {loading ? (
              language === 'en' ? 'Searching...' : 'جاري البحث...'
            ) : (
              <>
                {results.totalResults} {language === 'en' ? 'results for' : 'نتيجة لـ'} <span className="text-[#5FB57A]">"{query}"</span>
              </>
            )}
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-100 rounded-xl border-2 border-[#E5E7EB] animate-pulse"
              />
            ))}
          </div>
        ) : results.totalResults === 0 ? (
          <div className="text-center py-20">
            <SearchIcon className="h-16 w-16 text-[#9CA3AF] mx-auto mb-4" />
            <h2 className="text-[#111827] mb-2" style={{ fontSize: '24px', fontWeight: 600 }}>
              {language === 'en' ? 'No results found' : 'لم يتم العثور على نتائج'}
            </h2>
            <p className="text-[#6B7280]">
              {language === 'en' 
                ? 'Try adjusting your search terms or browse our categories' 
                : 'حاول تعديل مصطلحات البحث أو تصفح فئاتنا'}
            </p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
            <TabsList className="mb-8">
              <TabsTrigger value="all">
                {language === 'en' ? 'All' : 'الكل'} ({results.totalResults})
              </TabsTrigger>
              <TabsTrigger value="stores">
                {language === 'en' ? 'Stores' : 'المتاجر'} ({results.stores.length})
              </TabsTrigger>
              <TabsTrigger value="deals">
                {language === 'en' ? 'Deals' : 'العروض'} ({results.deals.length})
              </TabsTrigger>
              <TabsTrigger value="products">
                {language === 'en' ? 'Products' : 'المنتجات'} ({results.products.length})
              </TabsTrigger>
              <TabsTrigger value="guides">
                {language === 'en' ? 'Guides' : 'الأدلة'} ({results.articles.length})
              </TabsTrigger>
            </TabsList>

            {/* All Results */}
            <TabsContent value="all" className="space-y-8">
              {results.stores.length > 0 && (
                <div>
                  <h2 className="text-[#111827] mb-4 flex items-center gap-2" style={{ fontSize: '24px', fontWeight: 600 }}>
                    <StoreIcon className="h-6 w-6" />
                    {language === 'en' ? 'Stores' : 'المتاجر'}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {results.stores.slice(0, 4).map((store) => (
                      <Link key={store.id} to={`/store/${getStoreSlug(store)}`}>
                        <div className="group bg-white rounded-xl border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all p-6 text-center">
                          <div className="h-16 w-16 mx-auto mb-4 rounded-lg border-2 border-[#E5E7EB] bg-white overflow-hidden flex items-center justify-center">
                            {getStoreLogo(store) ? (
                              <ImageWithFallback
                                src={getStoreLogo(store)}
                                alt={getStoreName(store)}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <StoreIcon className="h-8 w-8 text-[#9CA3AF]" />
                            )}
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: 600 }} className="text-[#111827] line-clamp-1">
                            {getStoreName(store)}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.deals.length > 0 && (
                <div>
                  <h2 className="text-[#111827] mb-4 flex items-center gap-2" style={{ fontSize: '24px', fontWeight: 600 }}>
                    <Tag className="h-6 w-6" />
                    {language === 'en' ? 'Deals' : 'العروض'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.deals.slice(0, 4).map((deal) => (
                      <Link key={deal.id} to={`/deal/${isRTL && deal.slug_ar ? deal.slug_ar : deal.slug_en || deal.id}`}>
                        <div className="group bg-white rounded-xl border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all overflow-hidden">
                          {deal.image_url && (
                            <div className="aspect-video overflow-hidden border-b-2 border-[#111827]">
                              <ImageWithFallback
                                src={deal.image_url}
                                alt={deal.title_en || ''}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                          )}
                          <div className="p-6">
                            <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="text-[#111827] mb-2 line-clamp-2">
                              {isRTL && deal.title_ar ? deal.title_ar : deal.title_en}
                            </h3>
                            {deal.description && (
                              <p className="text-[#6B7280] text-sm line-clamp-2 mb-3">
                                {deal.description}
                              </p>
                            )}
                            {deal.coupon_code && (
                              <div className="inline-block bg-[#E8F3E8] text-[#5FB57A] px-3 py-1 rounded-lg text-sm border-2 border-[#5FB57A]" style={{ fontWeight: 600 }}>
                                {deal.coupon_code}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.products.length > 0 && (
                <div>
                  <h2 className="text-[#111827] mb-4 flex items-center gap-2" style={{ fontSize: '24px', fontWeight: 600 }}>
                    <ShoppingBag className="h-6 w-6" />
                    {language === 'en' ? 'Products' : 'المنتجات'}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {results.products.slice(0, 4).map((product) => (
                      <Link key={product.id} to={`/product/${product.slug || product.id}`}>
                        <div className="group bg-white rounded-xl border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all overflow-hidden">
                          {product.image_url && (
                            <div className="aspect-square overflow-hidden border-b-2 border-[#111827]">
                              <ImageWithFallback
                                src={product.image_url}
                                alt={getProductName(product)}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <h3 className="text-[#111827] mb-2 line-clamp-2" style={{ fontSize: '14px', fontWeight: 600 }}>
                              {getProductName(product)}
                            </h3>
                            {product.price && (
                              <p className="text-[#5FB57A]" style={{ fontSize: '16px', fontWeight: 700 }}>
                                ${product.price}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.articles.length > 0 && (
                <div>
                  <h2 className="text-[#111827] mb-4 flex items-center gap-2" style={{ fontSize: '24px', fontWeight: 600 }}>
                    <FileText className="h-6 w-6" />
                    {language === 'en' ? 'Shopping Guides' : 'أدلة التسوق'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.articles.slice(0, 4).map((article) => (
                      <Link key={article.id} to={`/guides/${article.slug}`}>
                        <div className="group bg-white rounded-xl border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all overflow-hidden">
                          {article.image_url && (
                            <div className="aspect-video overflow-hidden border-b-2 border-[#111827]">
                              <ImageWithFallback
                                src={article.image_url}
                                alt={getArticleTitle(article)}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                          )}
                          <div className="p-6">
                            <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="text-[#111827] mb-2 line-clamp-2">
                              {getArticleTitle(article)}
                            </h3>
                            {getArticleExcerpt(article) && (
                              <p className="text-[#6B7280] text-sm line-clamp-2">
                                {getArticleExcerpt(article)}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Stores Tab */}
            <TabsContent value="stores">
              {results.stores.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {results.stores.map((store) => (
                    <Link key={store.id} to={`/store/${getStoreSlug(store)}`}>
                      <div className="group bg-white rounded-xl border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all p-6 text-center">
                        <div className="h-16 w-16 mx-auto mb-4 rounded-lg border-2 border-[#E5E7EB] bg-white overflow-hidden flex items-center justify-center">
                          {getStoreLogo(store) ? (
                            <ImageWithFallback
                              src={getStoreLogo(store)}
                              alt={getStoreName(store)}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <StoreIcon className="h-8 w-8 text-[#9CA3AF]" />
                          )}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 600 }} className="text-[#111827] mb-2 line-clamp-1">
                          {getStoreName(store)}
                        </div>
                        {store.total_offers !== undefined && (
                          <div className="text-xs text-[#5FB57A] flex items-center justify-center gap-1">
                            <Tag className="h-3 w-3" />
                            {store.total_offers} {language === 'en' ? 'deals' : 'عروض'}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <StoreIcon className="h-12 w-12 text-[#9CA3AF] mx-auto mb-4" />
                  <p className="text-[#6B7280]">
                    {language === 'en' ? 'No stores found' : 'لم يتم العثور على متاجر'}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Deals Tab */}
            <TabsContent value="deals">
              {results.deals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.deals.map((deal) => (
                    <Link key={deal.id} to={`/deal/${isRTL && deal.slug_ar ? deal.slug_ar : deal.slug_en || deal.id}`}>
                      <div className="group bg-white rounded-xl border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all overflow-hidden">
                        {deal.image_url && (
                          <div className="aspect-video overflow-hidden border-b-2 border-[#111827]">
                            <ImageWithFallback
                              src={deal.image_url}
                              alt={deal.title_en || ''}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="text-[#111827] mb-2 line-clamp-2">
                            {isRTL && deal.title_ar ? deal.title_ar : deal.title_en}
                          </h3>
                          {deal.description && (
                            <p className="text-[#6B7280] text-sm line-clamp-2 mb-3">
                              {deal.description}
                            </p>
                          )}
                          {deal.coupon_code && (
                            <div className="inline-block bg-[#E8F3E8] text-[#5FB57A] px-3 py-1 rounded-lg text-sm border-2 border-[#5FB57A]" style={{ fontWeight: 600 }}>
                              {deal.coupon_code}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Tag className="h-12 w-12 text-[#9CA3AF] mx-auto mb-4" />
                  <p className="text-[#6B7280]">
                    {language === 'en' ? 'No deals found' : 'لم يتم العثور على عروض'}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products">
              {results.products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {results.products.map((product) => (
                    <Link key={product.id} to={`/product/${product.slug || product.id}`}>
                      <div className="group bg-white rounded-xl border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all overflow-hidden">
                        {product.image_url && (
                          <div className="aspect-square overflow-hidden border-b-2 border-[#111827]">
                            <ImageWithFallback
                              src={product.image_url}
                              alt={getProductName(product)}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="text-[#111827] mb-2 line-clamp-2" style={{ fontSize: '14px', fontWeight: 600 }}>
                            {getProductName(product)}
                          </h3>
                          {product.price && (
                            <p className="text-[#5FB57A]" style={{ fontSize: '16px', fontWeight: 700 }}>
                              ${product.price}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 text-[#9CA3AF] mx-auto mb-4" />
                  <p className="text-[#6B7280]">
                    {language === 'en' ? 'No products found' : 'لم يتم العثور على منتجات'}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Guides Tab */}
            <TabsContent value="guides">
              {results.articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.articles.map((article) => (
                    <Link key={article.id} to={`/guides/${article.slug}`}>
                      <div className="group bg-white rounded-xl border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all overflow-hidden">
                        {article.image_url && (
                          <div className="aspect-video overflow-hidden border-b-2 border-[#111827]">
                            <ImageWithFallback
                              src={article.image_url}
                              alt={getArticleTitle(article)}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 style={{ fontSize: '18px', fontWeight: 600 }} className="text-[#111827] mb-2 line-clamp-2">
                            {getArticleTitle(article)}
                          </h3>
                          {getArticleExcerpt(article) && (
                            <p className="text-[#6B7280] text-sm line-clamp-2">
                              {getArticleExcerpt(article)}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-[#9CA3AF] mx-auto mb-4" />
                  <p className="text-[#6B7280]">
                    {language === 'en' ? 'No guides found' : 'لم يتم العثور على أدلة'}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
