import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useCountry } from "../contexts/CountryContext";
import { useRouter } from "next/router";
import { getCountryValue } from "../utils/countryHelpers";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Package,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Star,
  ShoppingCart,
  ExternalLink,
  ChevronRight,
  Grid3x3,
  List,
  Tag as TagIcon,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: number | string;
  asin?: string;
  title?: string;
  name?: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  price?: number;
  original_price?: number;
  currency?: string;
  rating?: number;
  ratings_count?: number;
  available?: boolean;
  language?: string;
  store?: string;
  store_name?: string;
  url?: string;
  images?: string[] | string;
  image_url?: string;
  categories?: string[];
  category?: string;
  category_ar?: string;
  created_at?: string;
  updated_at?: string;
  country_id?: string;
  slug?: string;
  feature_bullets?: string[]  ;
  specs?: Record<string, string>;
  metadata?: Record<string, any>;
  price_history?: Array<{ date: string; price: number }>;
}

export default function ProductsPage() {
  const { language, isRTL } = useLanguage();
  const { country } = useCountry();
  // SSR data removed - will fetch client-side
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const itemsPerPage = 12;
  const observerTarget = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);
  const loadingMoreRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    loadingMoreRef.current = loadingMore;
  }, [loadingMore]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Define fetchProducts function
  const fetchProducts = async (reset = false) => {
    try {
      const currentOffsetValue = reset ? 0 : offsetRef.current;
      console.log(`fetchProducts called - reset: ${reset}, current offset: ${currentOffsetValue}`);
      
      if (reset) {
        setLoading(true);
        loadingRef.current = true; // Update ref immediately
        setOffset(0);
        offsetRef.current = 0;
      } else {
        // Prevent duplicate requests by checking and immediately setting the ref
        if (loadingMoreRef.current) {
          console.log('Already loading more, skipping duplicate request');
          return;
        }
        setLoadingMore(true);
        loadingMoreRef.current = true; // Update ref immediately to prevent race conditions
      }

      const countryValue = getCountryValue(country);
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      const currentOffset = currentOffsetValue;
      
      // Build URL with pagination parameters
      const params = new URLSearchParams();
      if (countryValue) params.append('country', countryValue);
      params.append('limit', itemsPerPage.toString());
      params.append('offset', currentOffset.toString());
      if (debouncedSearchQuery) params.append('search', debouncedSearchQuery);
      if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
      
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/products?${params.toString()}`;
      console.log('Fetching products from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`Received ${result.products?.length || 0} products`);
      
      if (result.products && result.products.length > 0) {
        if (reset) {
          setProducts(result.products);
        } else {
          // Filter out duplicates when appending new products
          setProducts(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newProducts = result.products.filter((p: Product) => !existingIds.has(p.id));
            console.log(`Appending ${newProducts.length} new products (filtered ${result.products.length - newProducts.length} duplicates)`);
            return [...prev, ...newProducts];
          });
        }
        
        // Check if there are more products to load
        const hasMoreProducts = result.products.length === itemsPerPage;
        const newOffset = currentOffset + result.products.length;
        setHasMore(hasMoreProducts);
        hasMoreRef.current = hasMoreProducts; // Update ref immediately
        setOffset(newOffset);
        offsetRef.current = newOffset; // Update ref immediately to prevent race conditions
        console.log(`Updated offset to ${newOffset}, hasMore: ${hasMoreProducts}`);
        
        // Extract unique categories from all products
        const uniqueCategories = Array.from(
          new Set(
            result.products
              .flatMap((p: Product) => {
                if (p.categories && Array.isArray(p.categories)) {
                  return p.categories;
                }
                if (language === 'ar' && p.category_ar) {
                  return [p.category_ar];
                }
                if (p.category) {
                  return [p.category];
                }
                return [];
              })
              .filter(Boolean)
          )
        ) as string[];
        setCategories(prev => {
          const combined = [...prev, ...uniqueCategories];
          return Array.from(new Set(combined));
        });
      } else {
        if (reset) {
          setProducts([]);
          setCategories([]);
        }
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error(language === 'en' ? 'Failed to load products' : 'فشل تحميل المنتجات');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      loadingRef.current = false; // Update ref immediately
      loadingMoreRef.current = false; // Update ref immediately
    }
  };

  // Define loadMore function with useCallback
  const loadMore = useCallback(() => {
    console.log('loadMore called', { 
      loadingMore: loadingMoreRef.current, 
      loading: loadingRef.current, 
      hasMore: hasMoreRef.current, 
      offset: offsetRef.current 
    });
    if (!loadingMoreRef.current && !loadingRef.current && hasMoreRef.current) {
      console.log('Fetching more products with offset:', offsetRef.current);
      fetchProducts(false);
    } else {
      console.log('Not fetching - conditions not met');
    }
  }, []);

  // Define filterAndSortProducts function
  const filterAndSortProducts = () => {
    // Since search and category filtering are done server-side,
    // we only need to do client-side sorting here
    let sorted = [...products];

    // Sort
    switch (sortBy) {
      case "featured":
        // Sort by rating as "featured" since we don't have is_featured
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "price-low":
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "discount":
        // Calculate discount based on original_price and price
        sorted.sort((a, b) => {
          const aDiscount = a.original_price && a.price 
            ? ((a.original_price - a.price) / a.original_price) * 100 
            : 0;
          const bDiscount = b.original_price && b.price 
            ? ((b.original_price - b.price) / b.original_price) * 100 
            : 0;
          return bDiscount - aDiscount;
        });
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
      default:
        // Default sorting by newest (already sorted by server, but we'll ensure it)
        sorted.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });
    }

    setFilteredProducts(sorted);
  };

  // Reset when filters change
  useEffect(() => {
    setProducts([]);
    setOffset(0);
    offsetRef.current = 0;
    setHasMore(true);
    hasMoreRef.current = true;
    fetchProducts(true);
  }, [country, debouncedSearchQuery, selectedCategory]);

  // Filter and sort when products or sortBy changes
  useEffect(() => {
    filterAndSortProducts();
  }, [products, sortBy]);

  // Infinite scroll observer
  useEffect(() => {
    // Don't set up observer if there are no products yet
    if (filteredProducts.length === 0) {
      console.log('Skipping observer setup - no products loaded yet');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        console.log('Observer triggered:', {
          isIntersecting: entries[0].isIntersecting,
          hasMore: hasMoreRef.current,
          loading: loadingRef.current,
          loadingMore: loadingMoreRef.current,
          offset: offsetRef.current
        });
        
        if (entries[0].isIntersecting && hasMoreRef.current && !loadingRef.current && !loadingMoreRef.current) {
          console.log('Intersection detected! Loading more products...');
          loadMore();
        } else if (entries[0].isIntersecting) {
          console.log('Intersection detected but conditions not met');
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
      console.log('Observer attached to target element');
    } else {
      console.log('Observer target not found!');
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, filteredProducts.length]);

  const getProductName = (product: Product): string => {
    if (language === 'ar' && product.name_ar) {
      return product.name_ar;
    }
    return product.title || product.name || (language === 'en' ? 'Unnamed Product' : 'منتج بدون اسم');
  };

  const getProductDescription = (product: Product): string => {
    if (language === 'ar' && product.description_ar) {
      return product.description_ar;
    }
    return product.description || '';
  };

  const getStoreName = (product: Product): string => {
    const store = product.store || product.store_name || '';
    // Capitalize store name
    return store.charAt(0).toUpperCase() + store.slice(1);
  };

  const getCategoryName = (product: Product): string => {
    if (product.categories && product.categories.length > 0) {
      return product.categories[0];
    }
    if (language === 'ar' && product.category_ar) {
      return product.category_ar;
    }
    return product.category || '';
  };

  const formatPrice = (price?: number, currency?: string): string => {
    if (!price) return '';
    return `${price.toFixed(2)} ${currency || 'SAR'}`;
  };

  return (
    <div className="min-h-screen bg-[#E8F3E8]">
      {/* Header Section */}
      <div className="bg-white border-b-2 border-[#111827]">
        <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className={`flex flex-col gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="p-3 bg-[#5FB57A] rounded-2xl border-2 border-[#111827]">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-[#111827]" style={{ fontSize: '48px', fontWeight: 700 }}>
                {language === 'en' ? 'Products' : 'المنتجات'}
              </h1>
            </div>
            <p className="text-[#6B7280] text-lg max-w-2xl">
              {language === 'en'
                ? 'Discover amazing products with exclusive deals and track prices from top brands'
                : 'اكتشف منتجات مذهلة مع عروض حصرية وتتبع الأسعار من أفضل العلامات التجارية'}
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search Section */}
      <div className="bg-white border-b-2 border-[#111827]">
        <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-6">
          <div className={`flex flex-col md:flex-row gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            {/* Search */}
            <div className="flex-1 relative">
              <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280] ${isRTL ? 'right-3' : 'left-3'}`} />
              <Input
                type="text"
                placeholder={language === 'en' ? 'Search products...' : 'ابحث عن المنتجات...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${isRTL ? 'pr-10 text-right' : 'pl-10'} h-12 border-2 border-[#111827] rounded-xl`}
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className={`w-full md:w-[200px] h-12 border-2 border-[#111827] rounded-xl ${isRTL ? 'text-right' : ''}`}>
                <SelectValue placeholder={language === 'en' ? 'Category' : 'الفئة'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {language === 'en' ? 'All Categories' : 'جميع الفئات'}
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className={`w-full md:w-[200px] h-12 border-2 border-[#111827] rounded-xl ${isRTL ? 'text-right' : ''}`}>
                <SelectValue placeholder={language === 'en' ? 'Sort by' : 'ترتيب حسب'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">
                  {language === 'en' ? 'Featured' : 'مميز'}
                </SelectItem>
                <SelectItem value="price-low">
                  {language === 'en' ? 'Price: Low to High' : 'السعر: من الأقل للأعلى'}
                </SelectItem>
                <SelectItem value="price-high">
                  {language === 'en' ? 'Price: High to Low' : 'السعر: من الأعلى للأقل'}
                </SelectItem>
                <SelectItem value="discount">
                  {language === 'en' ? 'Highest Discount' : 'أعلى خصم'}
                </SelectItem>
                <SelectItem value="rating">
                  {language === 'en' ? 'Highest Rated' : 'الأعلى تقييماً'}
                </SelectItem>
                <SelectItem value="newest">
                  {language === 'en' ? 'Newest' : 'الأحدث'}
                </SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className={`h-12 w-12 border-2 border-[#111827] rounded-xl ${
                  viewMode === "grid" ? 'bg-[#5FB57A] text-white' : ''
                }`}
              >
                <Grid3x3 className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className={`h-12 w-12 border-2 border-[#111827] rounded-xl ${
                  viewMode === "list" ? 'bg-[#5FB57A] text-white' : ''
                }`}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {loading ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-6"
          }>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border-2 border-[#111827] p-6">
                <Skeleton className="h-48 w-full mb-4 rounded-xl" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-8 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-[#9CA3AF] mx-auto mb-4" />
            <h2 className="text-2xl text-[#111827] mb-2" style={{ fontWeight: 600 }}>
              {language === 'en' ? 'No Products Found' : 'لا توجد منتجات'}
            </h2>
            <p className="text-[#6B7280]">
              {language === 'en'
                ? 'Try adjusting your filters or search query'
                : 'حاول تعديل الفلاتر أو كلمات البحث'}
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className={`mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="text-[#6B7280]">
                {language === 'en' 
                  ? `Showing ${filteredProducts.length} products${hasMore ? ' (scroll for more)' : ''}`
                  : `عرض ${filteredProducts.length} منتج${hasMore ? ' (مرر لرؤية المزيد)' : ''}`
                }
              </p>
            </div>

            {/* Products */}
            <div className={viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-6"
            }>
              {filteredProducts.map((product) => (
                viewMode === "grid" ? (
                  <ProductGridCard key={product.id} product={product} language={language} isRTL={isRTL} />
                ) : (
                  <ProductListCard key={product.id} product={product} language={language} isRTL={isRTL} />
                )
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            <div 
              ref={observerTarget} 
              className="h-20 mt-8 flex items-center justify-center border-2 border-dashed border-blue-300"
              style={{ minHeight: '20px' }}
            >
              {hasMore && !loadingMore && (
                <div className="text-xs text-[#9CA3AF]">
                  🔄 Scroll trigger (hasMore: {String(hasMore)}, loading: {String(loading)}, loadingMore: {String(loadingMore)}, offset: {offset})
                </div>
              )}
              {!hasMore && (
                <div className="text-xs text-red-500">
                  ❌ No more products (hasMore is false)
                </div>
              )}
            </div>

            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#5FB57A]" />
                <span className={`text-[#6B7280] ${isRTL ? 'mr-3' : 'ml-3'}`}>
                  {language === 'en' ? 'Loading more products...' : 'تحميل المزيد من المنتجات...'}
                </span>
              </div>
            )}

            {/* End of Results */}
            {!hasMore && filteredProducts.length > 0 && (
              <div className="text-center py-8">
                <p className="text-[#6B7280]">
                  {language === 'en' 
                    ? `You've reached the end! ${filteredProducts.length} products shown.`
                    : `لقد وصلت إلى النهاية! تم عرض ${filteredProducts.length} منتج.`
                  }
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Product Grid Card Component
function ProductGridCard({ product, language, isRTL }: { product: Product; language: string; isRTL: boolean }) {
  const router = useRouter();
  const name = language === 'ar' && product.name_ar ? product.name_ar : (product.title || product.name || (language === 'en' ? 'Unnamed Product' : 'منتج بدون اسم'));
  const description = language === 'ar' && product.description_ar ? product.description_ar : (product.description || '');
  const storeName = product.store || product.store_name || '';
  const category = product.categories?.[0] || (language === 'ar' && product.category_ar) || product.category || '';
  const imageUrl = Array.isArray(product.images) ? product.images[0] : (product.images || product.image_url || '');
  
  // Calculate discount percentage
  const discountPercentage = product.original_price && product.price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;
  const hasDiscount = discountPercentage > 0;

  const handleCardClick = () => {
    router.push(`/product/${product.slug || product.id}`);
  };

  return (
    <div 
      className="group bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] transition-all overflow-hidden flex flex-col h-full cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#E8F3E8] to-[#D1E7D1]">
        {imageUrl && imageUrl.trim() !== '' ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center ${imageUrl ? 'hidden' : ''}`}>
          <Package className="h-16 w-16 text-[#5FB57A] opacity-50" />
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            {product.rating && product.rating >= 4 && (
              <Badge className="bg-[#5FB57A] text-white border-0 rounded-lg">
                <Star className="h-3 w-3 mr-1" />
                {language === 'en' ? 'Top Rated' : 'الأعلى تقييماً'}
              </Badge>
            )}
            {product.available === false && (
              <Badge variant="destructive" className="border-0 rounded-lg">
                {language === 'en' ? 'Out of Stock' : 'غير متوفر'}
              </Badge>
            )}
          </div>
          {hasDiscount && (
            <Badge className="bg-[#EF4444] text-white border-0 rounded-lg">
              -{discountPercentage}%
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`p-5 flex-1 flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Store Name */}
        {storeName && (
          <div className={`flex items-center gap-2 mb-2 text-sm text-[#6B7280] ${isRTL ? 'flex-row-reverse' : ''}`}>
            <TagIcon className="h-3 w-3" />
            <span>{storeName}</span>
          </div>
        )}

        {/* Product Name */}
        <h3 
          className="mb-2 text-[#111827] line-clamp-2 flex-1 min-h-[3rem]" 
          style={{ fontSize: '18px', fontWeight: 600, lineHeight: '1.5' }}
          title={name}
        >
          {name}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-[#6B7280] text-sm mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Category */}
        {category && (
          <div className="mb-3">
            <Badge variant="outline" className="border-[#111827] rounded-lg">
              {category}
            </Badge>
          </div>
        )}

        {/* Rating */}
        {product.rating && (
          <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Star className="h-4 w-4 fill-[#FBBF24] text-[#FBBF24]" />
              <span style={{ fontWeight: 600 }}>{product.rating.toFixed(1)}</span>
            </div>
            {product.ratings_count && (
              <span className="text-sm text-[#6B7280]">
                ({product.ratings_count} {language === 'en' ? 'reviews' : 'تقييم'})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className={`mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-baseline gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-[#5FB57A]" style={{ fontSize: '24px', fontWeight: 700 }}>
              {product.price?.toFixed(2)} {product.currency || 'SAR'}
            </span>
            {hasDiscount && product.original_price && (
              <span className="text-[#9CA3AF] line-through">
                {product.original_price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            if (product.url) {
              window.open(product.url, '_blank');
            }
          }}
          disabled={product.available === false}
          className={`w-full bg-[#5FB57A] hover:bg-[#4FA56A] text-white border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
          style={{ fontWeight: 600 }}
        >
          <ShoppingCart className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {language === 'en' ? 'View Product' : 'عرض المنتج'}
        </Button>
      </div>
    </div>
  );
}

// Product List Card Component
function ProductListCard({ product, language, isRTL }: { product: Product; language: string; isRTL: boolean }) {
  const router = useRouter();
  const name = language === 'ar' && product.name_ar ? product.name_ar : (product.title || product.name || (language === 'en' ? 'Unnamed Product' : 'منتج بدون اسم'));
  const description = language === 'ar' && product.description_ar ? product.description_ar : (product.description || '');
  const storeName = product.store || product.store_name || '';
  const category = product.categories?.[0] || (language === 'ar' && product.category_ar) || product.category || '';
  const imageUrl = Array.isArray(product.images) ? product.images[0] : (product.images || product.image_url || '');
  
  // Calculate discount percentage
  const discountPercentage = product.original_price && product.price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;
  const hasDiscount = discountPercentage > 0;

  const handleCardClick = () => {
    router.push(`/product/${product.slug || product.id}`);
  };

  return (
    <div 
      className={`group bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] transition-all overflow-hidden cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}
      onClick={handleCardClick}
    >
      <div className={`flex flex-col md:flex-row gap-6 p-6 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        {/* Image */}
        <div className="relative w-full md:w-64 h-48 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#E8F3E8] to-[#D1E7D1]">
          {imageUrl && imageUrl.trim() !== '' ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-full h-full flex items-center justify-center ${imageUrl ? 'hidden' : ''}`}>
            <Package className="h-16 w-16 text-[#5FB57A] opacity-50" />
          </div>
          
          {/* Discount Badge */}
          {hasDiscount && (
            <Badge className="absolute top-3 right-3 bg-[#EF4444] text-white border-0 rounded-lg">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className={`flex-1 flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex-1">
              {/* Store and Badges */}
              <div className={`flex flex-wrap items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {storeName && (
                  <div className={`flex items-center gap-2 text-sm text-[#6B7280] ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <TagIcon className="h-3 w-3" />
                    <span>{storeName}</span>
                  </div>
                )}
                {product.rating && product.rating >= 4 && (
                  <Badge className="bg-[#5FB57A] text-white border-0 rounded-lg">
                    <Star className="h-3 w-3 mr-1" />
                    {language === 'en' ? 'Top Rated' : 'الأعلى تقييماً'}
                  </Badge>
                )}
                {product.available === false && (
                  <Badge variant="destructive" className="border-0 rounded-lg">
                    {language === 'en' ? 'Out of Stock' : 'غير متوفر'}
                  </Badge>
                )}
              </div>

              {/* Product Name */}
              <h3 
                className="mb-2 text-[#111827]" 
                style={{ fontSize: '24px', fontWeight: 600, lineHeight: '1.4' }}
                title={name}
              >
                {name}
              </h3>

              {/* Description */}
              {description && (
                <p className="text-[#6B7280] mb-3 line-clamp-2">
                  {description}
                </p>
              )}

              {/* Category and Rating */}
              <div className={`flex flex-wrap items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {category && (
                  <Badge variant="outline" className="border-[#111827] rounded-lg">
                    {category}
                  </Badge>
                )}
                {product.rating && (
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Star className="h-4 w-4 fill-[#FBBF24] text-[#FBBF24]" />
                      <span style={{ fontWeight: 600 }}>{product.rating.toFixed(1)}</span>
                    </div>
                    {product.ratings_count && (
                      <span className="text-sm text-[#6B7280]">
                        ({product.ratings_count})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Price and Action */}
            <div className={`flex flex-col items-end gap-3 ${isRTL ? 'md:items-start' : 'md:items-end'}`}>
              <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
                <div className="text-[#5FB57A] mb-1" style={{ fontSize: '32px', fontWeight: 700 }}>
                  {product.price?.toFixed(2)} {product.currency || 'SAR'}
                </div>
                {hasDiscount && product.original_price && (
                  <div className="text-[#9CA3AF] line-through">
                    {product.original_price.toFixed(2)}
                  </div>
                )}
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  if (product.url) {
                    window.open(product.url, '_blank');
                  }
                }}
                disabled={product.available === false}
                className={`bg-[#5FB57A] hover:bg-[#4FA56A] text-white border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
                style={{ fontWeight: 600 }}
              >
                <ShoppingCart className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {language === 'en' ? 'View Product' : 'عرض المنتج'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
