import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useCountry } from "../contexts/CountryContext";
import { useRouter } from "../router";
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
  Tag as TagIcon
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Product {
  id: number | string;
  asin?: string;
  title?: string;
  description?: string;
  price?: number;
  original_price?: number;
  currency?: string;
  rating?: number;
  ratings_count?: number;
  available?: boolean;
  language?: string;
  store?: string;
  url?: string;
  images?: string[];
  categories?: string[];
  created_at?: string;
  updated_at?: string;
  country_id?: string;
  slug?: string;
  feature_bullets?: string[];
  specs?: Record<string, string>;
  metadata?: Record<string, any>;
  price_history?: Array<{ date: string; price: number }>;
}

export function ProductsPage() {
  const { language, isRTL } = useLanguage();
  const { country } = useCountry();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, [country]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, sortBy, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const countryValue = getCountryValue(country);
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      const url = countryValue 
        ? `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/products?country=${countryValue}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/products`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.products && result.products.length > 0) {
        setProducts(result.products);
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(
            result.products
              .flatMap((p: Product) => p.categories || [])
              .filter(Boolean)
          )
        ) as string[];
        setCategories(uniqueCategories);
      } else {
        setProducts([]);
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error(language === 'en' ? 'Failed to load products' : 'فشل تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((product) => {
        const title = product.title || '';
        const description = product.description || '';
        const store = product.store || '';
        
        const searchLower = searchQuery.toLowerCase();
        return (
          title.toLowerCase().includes(searchLower) ||
          description.toLowerCase().includes(searchLower) ||
          store.toLowerCase().includes(searchLower)
        );
      });
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((product) => {
        return product.categories?.includes(selectedCategory);
      });
    }

    // Sort
    switch (sortBy) {
      case "featured":
        // Sort by rating as "featured" since we don't have is_featured
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "discount":
        // Calculate discount based on original_price and price
        filtered.sort((a, b) => {
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
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        filtered.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });
        break;
      default:
        // Default sorting by newest
        filtered.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });
    }

    setFilteredProducts(filtered);
  };

  const getProductName = (product: Product): string => {
    return product.title || (language === 'en' ? 'Unnamed Product' : 'منتج بدون اسم');
  };

  const getProductDescription = (product: Product): string => {
    return product.description || '';
  };

  const getStoreName = (product: Product): string => {
    const store = product.store || '';
    // Capitalize store name
    return store.charAt(0).toUpperCase() + store.slice(1);
  };

  const getCategoryName = (product: Product): string => {
    return product.categories?.[0] || '';
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
                  ? `Showing ${filteredProducts.length} products`
                  : `عرض ${filteredProducts.length} منتج`
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
          </>
        )}
      </div>
    </div>
  );
}

// Product Grid Card Component
function ProductGridCard({ product, language, isRTL }: { product: Product; language: string; isRTL: boolean }) {
  const { navigate } = useRouter();
  const name = product.title || (language === 'en' ? 'Unnamed Product' : 'منتج بدون اسم');
  const description = product.description || '';
  const storeName = product.store ? product.store.charAt(0).toUpperCase() + product.store.slice(1) : '';
  const category = product.categories?.[0] || '';
  const imageUrl = product.images?.[0] || '';
  
  // Calculate discount percentage
  const discountPercentage = product.original_price && product.price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;
  const hasDiscount = discountPercentage > 0;

  const handleCardClick = () => {
    navigate(`/product/${product.slug || product.id}`);
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
  const { navigate } = useRouter();
  const name = product.title || (language === 'en' ? 'Unnamed Product' : 'منتج بدون اسم');
  const description = product.description || '';
  const storeName = product.store ? product.store.charAt(0).toUpperCase() + product.store.slice(1) : '';
  const category = product.categories?.[0] || '';
  const imageUrl = product.images?.[0] || '';
  
  // Calculate discount percentage
  const discountPercentage = product.original_price && product.price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;
  const hasDiscount = discountPercentage > 0;

  const handleCardClick = () => {
    navigate(`/product/${product.slug || product.id}`);
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
