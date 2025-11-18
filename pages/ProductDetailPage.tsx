import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { useCountry } from '../contexts/CountryContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Card } from '../components/ui/card';
import { SignInModal } from '../components/SignInModal';
import { 
  ArrowLeft, 
  ExternalLink, 
  Star, 
  Package, 
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Store as StoreIcon,
  Tag as TagIcon,
  Calendar,
  CheckCircle,
  XCircle,
  Bell,
  RotateCcw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';
import { createClient } from '../utils/supabase/client';

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

export default function ProductDetailPage() {
  const { currentPath, navigate } = useRouter();
  const { language } = useLanguage();
  const { selectedCountry } = useCountry();
  const { user, isAuthenticated } = useAuth();
  const isRTL = language === 'ar';
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSignIn, setShowSignIn] = useState(false);
  const [tracking, setTracking] = useState(false);

  // Extract product ID/slug from URL
  const pathParts = currentPath.split('/').filter(Boolean);
  const productIdentifier = pathParts[pathParts.indexOf('product') + 1];

  useEffect(() => {
    if (productIdentifier) {
      fetchProduct(productIdentifier);
    }
  }, [productIdentifier]);

  const fetchProduct = async (identifier: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/product/${identifier}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const result = await response.json();
      setProduct(result.product);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(language === 'en' ? 'Failed to load product' : 'فشل تحميل المنتج');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const calculateDiscount = () => {
    if (!product?.original_price || !product?.price) return 0;
    return Math.round(((product.original_price - product.price) / product.original_price) * 100);
  };

  const formatPriceHistory = () => {
    if (!product?.price_history) return [];
    
    return product.price_history.map(item => ({
      date: new Date(item.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        month: 'short',
        day: 'numeric'
      }),
      price: item.price
    }));
  };

  const handleTrackProduct = async (priceDropAlert: boolean, restockAlert: boolean) => {
    if (!isAuthenticated) {
      setShowSignIn(true);
      return;
    }

    if (!product?.url) {
      toast.error(language === 'en' ? 'Product URL not available' : 'رابط المنتج غير متاح');
      return;
    }

    try {
      setTracking(true);
      const token = localStorage.getItem('auth_token');

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/tracked-products`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_url: product.url,
            product_title: product.title || 'Untitled Product',
            current_price: product.price || 0,
            currency: product.currency || 'USD',
            thumbnail_url: product.images?.[0] || '',
            availability: product.available || false,
            price_drop_alert: priceDropAlert,
            restock_alert: restockAlert,
          }),
        }
      );

      if (response.ok) {
        toast.success(language === 'en' ? 'Product added to tracking!' : 'تمت إضافة المنتج للتتبع!');
      } else {
        const error = await response.json();
        toast.error(error.error || (language === 'en' ? 'Failed to track product' : 'فشل في تتبع المنتج'));
      }
    } catch (error) {
      console.error('Error tracking product:', error);
      toast.error(language === 'en' ? 'An error occurred' : 'حدث خطأ');
    } finally {
      setTracking(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-[#E8F3E8] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5FB57A] mx-auto mb-4"></div>
            <p className="text-[#6B7280]">
              {language === 'en' ? 'Loading product...' : 'جاري تحميل المنتج...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={`min-h-screen bg-[#E8F3E8] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Package className="h-16 w-16 text-[#9CA3AF] mx-auto mb-4" />
            <h2 className="text-2xl mb-2">{language === 'en' ? 'Product Not Found' : 'المنتج غير موجود'}</h2>
            <p className="text-[#6B7280] mb-6">{error || (language === 'en' ? 'The product you are looking for does not exist.' : 'المنتج الذي تبحث عنه غير موجود.')}</p>
            <Button onClick={() => router.push('/products')}>
              {language === 'en' ? 'Browse Products' : 'تصفح المنتجات'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const discount = calculateDiscount();
  const priceHistoryData = formatPriceHistory();
  const storeName = product.store ? product.store.charAt(0).toUpperCase() + product.store.slice(1) : '';

  return (
    <div className={`min-h-screen bg-[#E8F3E8] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-4 py-4">
          <div className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => router.push('/')}
              className="text-[#6B7280] hover:text-[#5FB57A] transition-colors"
            >
              {language === 'en' ? 'Home' : 'الرئيسية'}
            </button>
            <span className="text-[#9CA3AF]">/</span>
            <button
              onClick={() => router.push('/products')}
              className="text-[#6B7280] hover:text-[#5FB57A] transition-colors"
            >
              {language === 'en' ? 'Products' : 'المنتجات'}
            </button>
            <span className="text-[#9CA3AF]">/</span>
            <span className="text-[#111827]">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/products')}
          className={`mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {language === 'en' ? 'Back to Products' : 'العودة للمنتجات'}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div>
            <Card className="p-0 overflow-hidden border-2 border-[#E5E7EB] rounded-xl">
              <div className="relative bg-gradient-to-br from-[#E8F3E8] to-[#D1E7D1] aspect-square">
                {product.images && product.images.length > 0 ? (
                  <>
                    <img
                      src={product.images[currentImageIndex]}
                      alt={product.title}
                      className="w-full h-full object-contain p-8"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '';
                        target.style.display = 'none';
                      }}
                    />
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all`}
                        >
                          {isRTL ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
                        </button>
                        <button
                          onClick={nextImage}
                          className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all`}
                        >
                          {isRTL ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-24 w-24 text-[#5FB57A] opacity-50" />
                  </div>
                )}

                {/* Badges */}
                <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} flex flex-col gap-2`}>
                  {discount > 0 && (
                    <Badge className="bg-red-500 text-white border-0 rounded-lg">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      {discount}% {language === 'en' ? 'OFF' : 'خصم'}
                    </Badge>
                  )}
                  {product.rating && product.rating >= 4 && (
                    <Badge className="bg-[#5FB57A] text-white border-0 rounded-lg">
                      <Star className="h-3 w-3 mr-1" />
                      {language === 'en' ? 'Top Rated' : 'الأعلى تقييماً'}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-6 gap-2 mt-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? 'border-[#5FB57A]'
                        : 'border-[#E5E7EB] hover:border-[#5FB57A]/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} - ${index + 1}`}
                      className="w-full h-full object-contain bg-gradient-to-br from-[#E8F3E8] to-[#D1E7D1] p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Store & Category */}
            <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {storeName && (
                <div className={`flex items-center gap-2 text-[#6B7280] ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <StoreIcon className="h-4 w-4" />
                  <span>{storeName}</span>
                </div>
              )}
              {product.categories && product.categories.length > 0 && (
                <div className={`flex items-center gap-2 text-[#6B7280] ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <TagIcon className="h-4 w-4" />
                  <span className="capitalize">{product.categories[0].replace(/-/g, ' ')}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className={`text-3xl mb-4 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontWeight: 700 }}>
              {product.title}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(product.rating || 0)
                          ? 'fill-[#FBBF24] text-[#FBBF24]'
                          : 'text-[#E5E7EB]'
                      }`}
                    />
                  ))}
                </div>
                <span style={{ fontWeight: 600 }}>{product.rating.toFixed(1)}</span>
                {product.ratings_count && (
                  <span className="text-[#6B7280]">
                    ({product.ratings_count} {language === 'en' ? 'reviews' : 'تقييم'})
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div className={`mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className={`flex items-baseline gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-[#5FB57A]" style={{ fontSize: '48px', fontWeight: 700 }}>
                  {product.price?.toFixed(2)} {product.currency || 'SAR'}
                </span>
                {discount > 0 && product.original_price && (
                  <span className="text-[#9CA3AF] line-through" style={{ fontSize: '24px' }}>
                    {product.original_price.toFixed(2)}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <p className="text-red-500" style={{ fontWeight: 600 }}>
                  {language === 'en' ? 'You save' : 'توفر'}: {(product.original_price! - product.price!).toFixed(2)} {product.currency || 'SAR'} ({discount}%)
                </p>
              )}
            </div>

            {/* Availability */}
            <div className={`flex items-center gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {product.available ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-green-600" style={{ fontWeight: 600 }}>
                    {language === 'en' ? 'In Stock' : 'متوفر'}
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-600" style={{ fontWeight: 600 }}>
                    {language === 'en' ? 'Out of Stock' : 'غير متوفر'}
                  </span>
                </>
              )}
            </div>

            <Separator className="my-6" />

            {/* Short Description */}
            {product.description && (
              <div className={`mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                <p className="text-[#4B5563] leading-relaxed">
                  {product.description.length > 300
                    ? product.description.substring(0, 300) + '...'
                    : product.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button
                size="lg"
                className="flex-1 bg-[#5FB57A] hover:bg-[#4FA569] text-white rounded-lg"
                onClick={() => {
                  if (product.url) {
                    window.open(product.url, '_blank');
                  }
                }}
                disabled={!product.available}
              >
                <ExternalLink className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {language === 'en' 
                  ? (storeName ? `View on ${storeName}` : 'View on Store')
                  : (storeName ? `عرض في ${storeName}` : 'عرض في المتجر')}
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <Calendar className="h-5 w-5 text-[#6B7280] mt-0.5" />
                <div>
                  <p className="text-sm text-[#6B7280]">
                    {language === 'en' ? 'Last updated' : 'آخر تحديث'}:{' '}
                    {new Date(product.updated_at || product.created_at || '').toLocaleDateString(
                      language === 'ar' ? 'ar-SA' : 'en-US',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <Card className="border-2 border-[#E5E7EB] rounded-xl p-6 mb-6">
          <h2 className={`text-2xl mb-4 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontWeight: 700 }}>
            {language === 'en' ? 'Description' : 'الوصف'}
          </h2>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <p className="text-[#4B5563] leading-relaxed whitespace-pre-line">
              {product.description || (language === 'en' ? 'No description available.' : 'لا يوجد وصف متاح.')}
            </p>
          </div>
        </Card>

        {/* Features Section */}
        {product.feature_bullets && product.feature_bullets.length > 0 && (
          <Card className="border-2 border-[#E5E7EB] rounded-xl p-6 mb-6">
            <h2 className={`text-2xl mb-4 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontWeight: 700 }}>
              {language === 'en' ? 'Features' : 'المميزات'}
            </h2>
            <ul className={`space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
              {product.feature_bullets.map((bullet, index) => (
                <li key={index} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <CheckCircle className="h-5 w-5 text-[#5FB57A] flex-shrink-0 mt-0.5" />
                  <span className="text-[#4B5563]">{bullet}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Specifications Section */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <Card className="border-2 border-[#E5E7EB] rounded-xl p-6 mb-6">
            <h2 className={`text-2xl mb-4 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontWeight: 700 }}>
              {language === 'en' ? 'Specifications' : 'المواصفات'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specs).map(([key, value]) => (
                <div
                  key={key}
                  className={`flex ${isRTL ? 'flex-row-reverse' : ''} p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]`}
                >
                  <span className={`text-[#6B7280] ${isRTL ? 'mr-auto' : 'mr-4'}`} style={{ fontWeight: 600 }}>
                    {key}:
                  </span>
                  <span className="text-[#111827]">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Price History Section */}
        {priceHistoryData.length > 1 && (
          <Card className="border-2 border-[#E5E7EB] rounded-xl p-6 mb-6">
            <h2 className={`text-2xl mb-4 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontWeight: 700 }}>
              {language === 'en' ? 'Price History' : 'سجل الأسعار'}
            </h2>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#5FB57A"
                    strokeWidth={2}
                    dot={{ fill: '#5FB57A' }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-sm text-[#6B7280] mt-4">
                {language === 'en' 
                  ? 'Price history shows how the product price has changed over time.'
                  : 'يوضح سجل الأسعار كيف تغير سعر المنتج مع مرور الوقت.'}
              </p>
            </div>
          </Card>
        )}

        {/* Product Tracking Section */}
        {product?.url && (
          <Card className="border-2 border-[#5FB57A] rounded-xl p-6 bg-gradient-to-br from-[#E8F3E8] to-white">
            <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="bg-[#5FB57A] p-3 rounded-lg">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className={`text-2xl mb-2 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontWeight: 700 }}>
                  {language === 'en' ? 'Track This Product' : 'تتبع هذا المنتج'}
                </h2>
                <p className={`text-[#6B7280] mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {language === 'en' 
                    ? 'Get notified when the price drops or when this product is back in stock.' 
                    : 'احصل على إشعار عندما ينخفض السعر أو عندما يتوفر المنتج مرة أخرى.'}
                </p>
                
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <Button
                    onClick={() => handleTrackProduct(true, false)}
                    disabled={tracking}
                    className="bg-[#5FB57A] hover:bg-[#4FA56A] text-white rounded-lg border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all"
                  >
                    <TrendingDown className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {language === 'en' ? 'Price Drop Alert' : 'تنبيه انخفاض السعر'}
                  </Button>
                  
                  <Button
                    onClick={() => handleTrackProduct(false, true)}
                    disabled={tracking}
                    className="bg-[#5FB57A] hover:bg-[#4FA56A] text-white rounded-lg border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all"
                  >
                    <RotateCcw className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {language === 'en' ? 'Restock Alert' : 'تنبيه إعادة التوفر'}
                  </Button>
                  
                  <Button
                    onClick={() => handleTrackProduct(true, true)}
                    disabled={tracking}
                    className="bg-[#111827] hover:bg-[#1F2937] text-white rounded-lg border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(95,181,122,1)] hover:shadow-[1px_1px_0px_0px_rgba(95,181,122,1)] transition-all"
                  >
                    <Bell className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {language === 'en' ? 'Track Both' : 'تتبع الاثنين'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Sign In Modal */}
      <SignInModal open={showSignIn} onOpenChange={setShowSignIn} />
    </div>
  );
}
