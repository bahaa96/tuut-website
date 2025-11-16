import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { SignInModal } from '../components/SignInModal';
import { Bell, BellOff, Plus, Search, Package, TrendingDown, RotateCcw, ExternalLink, Trash2, Loader2, Eye } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface TrackedProduct {
  id: string;
  product_url: string;
  product_title: string;
  current_price: number;
  currency: string;
  thumbnail_url: string;
  price_drop_alert: boolean;
  restock_alert: boolean;
  created_at: string;
  last_checked_at?: string;
  availability: boolean;
}

interface ProductPreview {
  title: string;
  price: string;
  currency: string;
  availability: boolean;
  thumbnailURL: string;
}

export function TrackedProductsPage() {
  const { user, isAuthenticated } = useAuth();
  const { isRTL } = useLanguage();
  const [showSignIn, setShowSignIn] = useState(false);
  const [trackedProducts, setTrackedProducts] = useState<TrackedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [productUrl, setProductUrl] = useState('');
  const [fetchingPreview, setFetchingPreview] = useState(false);
  const [productPreview, setProductPreview] = useState<ProductPreview | null>(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrackedProducts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  async function fetchTrackedProducts() {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setTrackedProducts([]);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/tracked-products`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTrackedProducts(data.products || []);
      } else {
        console.error('Failed to fetch tracked products');
      }
    } catch (error) {
      console.error('Error fetching tracked products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProductPreview() {
    if (!productUrl.trim()) {
      toast.error(isRTL ? 'الرجاء إدخال رابط المنتج' : 'Please enter a product URL');
      return;
    }

    try {
      setFetchingPreview(true);
      setProductPreview(null);
      
      const scrapingApiUrl = import.meta.env.VITE_EXPO_PUBLIC_SCRAPING_API_URL || 
                             process.env.EXPO_PUBLIC_SCRAPING_API_URL ||
                             'https://scraping-api.geekbahaa1.workers.dev';
      
      const response = await fetch(
        `${scrapingApiUrl}/scrape/product_preview?productURL=${encodeURIComponent(productUrl)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch product preview');
      }

      const data = await response.json();
      setProductPreview(data);
    } catch (error) {
      console.error('Error fetching product preview:', error);
      toast.error(isRTL ? 'فشل في جلب معلومات المنتج' : 'Failed to fetch product information');
    } finally {
      setFetchingPreview(false);
    }
  }

  async function handleAddProduct(priceDropAlert: boolean, restockAlert: boolean) {
    if (!productPreview) return;

    try {
      setAddingProduct(true);
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        toast.error(isRTL ? 'يرجى تسجيل الدخول' : 'Please sign in');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/tracked-products`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_url: productUrl,
            product_title: productPreview.title,
            current_price: parseFloat(productPreview.price),
            currency: productPreview.currency,
            thumbnail_url: productPreview.thumbnailURL,
            availability: productPreview.availability,
            price_drop_alert: priceDropAlert,
            restock_alert: restockAlert,
          }),
        }
      );

      if (response.ok) {
        toast.success(isRTL ? 'تمت إضافة المنتج بنجاح' : 'Product added successfully');
        setProductUrl('');
        setProductPreview(null);
        setShowAddForm(false);
        fetchTrackedProducts();
      } else {
        const error = await response.json();
        toast.error(error.error || (isRTL ? 'فشل في إضافة المنتج' : 'Failed to add product'));
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(isRTL ? 'حدث خطأ' : 'An error occurred');
    } finally {
      setAddingProduct(false);
    }
  }

  async function handleRemoveProduct(productId: string) {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        toast.error(isRTL ? 'يرجى تسجيل الدخول' : 'Please sign in');
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/tracked-products/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success(isRTL ? 'تمت إزالة المنتج' : 'Product removed');
        fetchTrackedProducts();
      } else {
        toast.error(isRTL ? 'فشل في إزالة المنتج' : 'Failed to remove product');
      }
    } catch (error) {
      console.error('Error removing product:', error);
      toast.error(isRTL ? 'حدث خطأ' : 'An error occurred');
    }
  }

  // How It Works section for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#E8F3E8] flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-white border-b-2 border-[#111827] py-12 md:py-16">
          <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
            <div className="text-center">
              <Eye className="h-16 w-16 text-[#5FB57A] mx-auto mb-4" />
              <h1 className="text-[#111827] mb-4">
                {isRTL ? 'المنتجات المتتبعة' : 'Tracked Products'}
              </h1>
              <p className="text-[#6B7280] max-w-2xl mx-auto">
                {isRTL 
                  ? 'تتبع المنتجات واحصل على تنبيهات عندما تنخفض الأسعار أو تتوفر مرة أخرى' 
                  : 'Track products and get alerts when prices drop or items are back in stock'}
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-12">
          {/* How It Works */}
          <Card className="p-8 md:p-12 border-2 border-[#111827] shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] mb-8">
            <h2 className="text-2xl font-bold text-[#111827] text-center mb-8">
              {isRTL ? 'كيف يعمل؟' : 'How It Works'}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-[#E8F3E8] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 border-2 border-[#111827]">
                  <Plus className="h-8 w-8 text-[#5FB57A]" />
                </div>
                <h3 className="font-bold text-[#111827] mb-2">
                  {isRTL ? '1. أضف منتج' : '1. Add a Product'}
                </h3>
                <p className="text-sm text-[#6B7280]">
                  {isRTL 
                    ? 'الصق رابط المنتج من متجرك المفضل' 
                    : 'Paste a product link from your favorite store'}
                </p>
              </div>

              <div className="text-center">
                <div className="bg-[#E8F3E8] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 border-2 border-[#111827]">
                  <Bell className="h-8 w-8 text-[#5FB57A]" />
                </div>
                <h3 className="font-bold text-[#111827] mb-2">
                  {isRTL ? '2. اختر التنبيهات' : '2. Choose Alerts'}
                </h3>
                <p className="text-sm text-[#6B7280]">
                  {isRTL 
                    ? 'حدد ما إذا كنت تريد تنبيهات انخفاض السعر أو إعادة التوفر' 
                    : 'Select whether you want price drop or restock alerts'}
                </p>
              </div>

              <div className="text-center">
                <div className="bg-[#E8F3E8] rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 border-2 border-[#111827]">
                  <TrendingDown className="h-8 w-8 text-[#5FB57A]" />
                </div>
                <h3 className="font-bold text-[#111827] mb-2">
                  {isRTL ? '3. احصل على التنبيهات' : '3. Get Notified'}
                </h3>
                <p className="text-sm text-[#6B7280]">
                  {isRTL 
                    ? 'سنتتبع المنتج ونخبرك عندما تتغير الأسعار' 
                    : "We'll track the product and notify you when prices change"}
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button
                onClick={() => setShowSignIn(true)}
                className="bg-[#5FB57A] hover:bg-[#4FA56A] text-white px-8 rounded-lg"
              >
                {isRTL ? 'تسجيل الدخول للبدء' : 'Sign In to Get Started'}
              </Button>
            </div>
          </Card>
        </div>

        <SignInModal open={showSignIn} onOpenChange={setShowSignIn} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8F3E8] flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white border-b-2 border-[#111827] py-12 md:py-16">
        <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div>
              <h1 className="text-[#111827] mb-2">
                {isRTL ? 'المنتجات المتتبعة' : 'Tracked Products'}
              </h1>
              <p className="text-[#6B7280]">
                {isRTL ? `${trackedProducts.length} منتج` : `${trackedProducts.length} products`}
              </p>
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#5FB57A] hover:bg-[#4FA56A] text-white rounded-lg"
            >
              <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'إضافة منتج' : 'Add Product'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-12">
        {/* Add Product Form */}
        {showAddForm && (
          <Card className="p-6 border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] mb-8">
            <h2 className="text-xl font-bold text-[#111827] mb-4">
              {isRTL ? 'إضافة منتج جديد' : 'Add New Product'}
            </h2>
            
            <div className="space-y-4">
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Input
                  placeholder={isRTL ? 'الصق رابط المنتج هنا...' : 'Paste product URL here...'}
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  className="flex-1"
                  dir="ltr"
                />
                <Button
                  onClick={fetchProductPreview}
                  disabled={fetchingPreview || !productUrl.trim()}
                  className="bg-[#5FB57A] hover:bg-[#4FA56A] text-white rounded-lg"
                >
                  {fetchingPreview ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Search className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {isRTL ? 'بحث' : 'Preview'}
                    </>
                  )}
                </Button>
              </div>

              {/* Product Preview */}
              {productPreview && (
                <Card className="p-4 border-2 border-[#E5E7EB]">
                  <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="flex-shrink-0">
                      <ImageWithFallback
                        src={productPreview.thumbnailURL}
                        alt={productPreview.title}
                        className="w-24 h-24 object-cover rounded-lg border-2 border-[#E5E7EB]"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#111827] mb-2 line-clamp-2">
                        {productPreview.title}
                      </h3>
                      <p className="text-2xl font-bold text-[#5FB57A] mb-2">
                        {productPreview.price} {productPreview.currency}
                      </p>
                      <Badge variant={productPreview.availability ? 'default' : 'destructive'}>
                        {productPreview.availability 
                          ? (isRTL ? 'متوفر' : 'In Stock') 
                          : (isRTL ? 'غير متوفر' : 'Out of Stock')}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t-2 border-[#E5E7EB]">
                    <p className="text-sm text-[#6B7280] mb-3">
                      {isRTL ? 'اختر نوع التنبيهات:' : 'Choose alert types:'}
                    </p>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Button
                        onClick={() => handleAddProduct(true, false)}
                        disabled={addingProduct}
                        className="flex-1 bg-[#5FB57A] hover:bg-[#4FA56A] text-white rounded-lg"
                      >
                        <TrendingDown className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {isRTL ? 'انخفاض السعر' : 'Price Drop'}
                      </Button>
                      <Button
                        onClick={() => handleAddProduct(false, true)}
                        disabled={addingProduct}
                        className="flex-1 bg-[#5FB57A] hover:bg-[#4FA56A] text-white rounded-lg"
                      >
                        <RotateCcw className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {isRTL ? 'إعادة التوفر' : 'Restock'}
                      </Button>
                      <Button
                        onClick={() => handleAddProduct(true, true)}
                        disabled={addingProduct}
                        className="flex-1 bg-[#5FB57A] hover:bg-[#4FA56A] text-white rounded-lg"
                      >
                        <Bell className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {isRTL ? 'كلاهما' : 'Both'}
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </Card>
        )}

        {/* Tracked Products List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : trackedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trackedProducts.map((product) => (
              <Card key={product.id} className="p-4 border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
                <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-shrink-0">
                    <ImageWithFallback
                      src={product.thumbnail_url}
                      alt={product.product_title}
                      className="w-24 h-24 object-cover rounded-lg border-2 border-[#E5E7EB]"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#111827] mb-2 line-clamp-2">
                      {product.product_title}
                    </h3>
                    <p className="text-xl font-bold text-[#5FB57A] mb-2">
                      {product.current_price} {product.currency}
                    </p>
                    <div className={`flex gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {product.price_drop_alert && (
                        <Badge variant="outline" className="text-xs">
                          <TrendingDown className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                          {isRTL ? 'انخفاض السعر' : 'Price Drop'}
                        </Badge>
                      )}
                      {product.restock_alert && (
                        <Badge variant="outline" className="text-xs">
                          <RotateCcw className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                          {isRTL ? 'إعادة التوفر' : 'Restock'}
                        </Badge>
                      )}
                      <Badge variant={product.availability ? 'default' : 'destructive'} className="text-xs">
                        {product.availability 
                          ? (isRTL ? 'متوفر' : 'In Stock') 
                          : (isRTL ? 'غير متوفر' : 'Out of Stock')}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className={`flex gap-2 mt-4 pt-4 border-t-2 border-[#E5E7EB] ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(product.product_url, '_blank')}
                    className="flex-1"
                  >
                    <ExternalLink className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'عرض المنتج' : 'View Product'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveProduct(product.id)}
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-[#9CA3AF] mx-auto mb-4" />
            <h3 className="text-xl text-[#111827] mb-2">
              {isRTL ? 'لا توجد منتجات متتبعة' : 'No tracked products'}
            </h3>
            <p className="text-[#6B7280] mb-4">
              {isRTL 
                ? 'ابدأ بإضافة منتجات لتتبع أسعارها' 
                : 'Start adding products to track their prices'}
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-[#5FB57A] hover:bg-[#4FA56A] text-white rounded-lg"
            >
              <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'إضافة منتج' : 'Add Product'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
