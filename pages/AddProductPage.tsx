import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, ArrowLeft, Sparkles, Bell, TrendingDown, CheckCircle2, ExternalLink, Package } from 'lucide-react';
import { projectId } from '../utils/supabase/info';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';

export default function AddProductPage() {
  const { isAuthenticated } = useAuth();
  const { isRTL } = useLanguage();
  const router = useRouter();
  
  const [productUrl, setProductUrl] = useState('');
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationType, setNotificationType] = useState<'price_drop' | 'restock'>('price_drop');
  const [error, setError] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualData, setManualData] = useState({
    title: '',
    image: '',
    price: ''
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

  const handleFetchProduct = async () => {
    if (!productUrl.trim()) {
      setError(isRTL ? 'الرجاء إدخال رابط المنتج' : 'Please enter a product URL');
      return;
    }

    setError('');
    setIsFetching(true);
    setFetchedData(null);

    try {
      const token = localStorage.getItem('session_token');
      console.log('🔍 Fetching product data from URL:', productUrl);
      console.log('🔑 Using token:', token?.substring(0, 10) + '...');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/scrape-product`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: productUrl }),
        }
      );

      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📦 Response data:', data);

      if (response.ok && data.success) {
        setFetchedData(data.product);
        setShowManualEntry(false);
        toast.success(isRTL ? 'تم جلب بيانات المنتج بنجاح!' : 'Product data fetched successfully!');
      } else {
        const errorMsg = data.error || (isRTL ? 'فشل جلب بيانات المنتج' : 'Failed to fetch product data');
        console.error('❌ Scraping failed:', errorMsg);
        setError(errorMsg);
        
        // Show manual entry option
        setShowManualEntry(true);
        toast.error(isRTL ? 'يمكنك إدخال البيانات يدوياً' : 'You can enter the details manually');
      }
    } catch (err: any) {
      console.error('❌ Error fetching product:', err);
      setError(isRTL ? 'حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.' : 'Error occurred while fetching data. Please try again.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async () => {
    // Validate we have either fetched data or manual data
    const productData = fetchedData || (showManualEntry ? {
      title: manualData.title,
      image: manualData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      price: parseFloat(manualData.price)
    } : null);

    if (!productData || !productData.title || !productData.price) {
      setError(isRTL ? 'الرجاء إدخال جميع البيانات المطلوبة' : 'Please enter all required data');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('session_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/tracked-products`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: `manual-${Date.now()}`,
            product_url: productUrl,
            product_title: productData.title,
            product_image: productData.image,
            product_price: productData.price,
            notify_on_price_drop: notificationType === 'price_drop',
            notify_on_restock: notificationType === 'restock',
          }),
        }
      );

      if (response.ok) {
        toast.success(isRTL ? 'تمت إضافة المنتج بنجاح!' : 'Product added successfully!');
        router.push('/wishlist');
      } else {
        const data = await response.json();
        setError(data.error || (isRTL ? 'فشل إضافة المنتج' : 'Failed to add product'));
      }
    } catch (err: any) {
      console.error('Error adding product:', err);
      setError(isRTL ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F3E8]" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto max-w-[800px] px-4 md:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/wishlist')}
          className={`mb-6 hover:bg-white/50 ${isRTL ? '' : ''}`}
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
          {isRTL ? 'العودة إلى الرادار' : 'Back to Radar'}
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[#111827] mb-4 text-5xl md:text-6xl">
            {isRTL ? 'تتبع منتج جديد' : 'Track a New Product'}
          </h1>
          <p className="text-[#111827] opacity-70 max-w-md mx-auto text-lg">
            {isRTL 
              ? 'أضف رابط المنتج وسنقوم بمراقبة السعر أو التوفر وإرسال إشعار لك'
              : 'Add a product link and we\'ll monitor the price or availability and notify you'
            }
          </p>
        </div>

        {/* Main Card */}
        <Card className="p-8 border-4 border-[#111827] rounded-2xl bg-white shadow-[6px_6px_0px_0px_rgba(17,24,39,1)]">
          {/* Step 1: Enter URL */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-[#5FB57A] text-white rounded-full border-2 border-[#111827]">
                1
              </div>
              <h2 className="text-[#111827]">
                {isRTL ? 'أدخل رابط المنتج' : 'Enter Product URL'}
              </h2>
            </div>
            
            <div className="flex gap-3">
              <Input
                type="url"
                placeholder="https://www.amazon.com/product/..."
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFetchProduct()}
                className="flex-1 border-2 border-[#111827] rounded-xl h-12"
                disabled={isFetching}
              />
              <Button
                onClick={handleFetchProduct}
                disabled={isFetching || !productUrl.trim()}
                className="bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl h-12 px-6 shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all"
              >
                {isFetching ? (
                  <>
                    <Loader2 className={`w-4 h-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'جاري الجلب...' : 'Fetching...'}
                  </>
                ) : (
                  <>
                    <Sparkles className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'جلب البيانات' : 'Fetch Data'}
                  </>
                )}
              </Button>
            </div>

            <p className="text-sm text-[#111827] opacity-60 mt-2">
              {isRTL 
                ? 'ندعم معظم متاجر التسوق الإلكتروني الشهيرة'
                : 'We support most popular e-commerce stores'
              }
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6 border-2 border-red-500">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Manual Entry Form - shown if fetch fails */}
          {showManualEntry && !fetchedData && (
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-[#5FB57A] text-white rounded-full border-2 border-[#111827]">
                  2
                </div>
                <h2 className="text-[#111827]">
                  {isRTL ? 'أدخل التفاصيل يدوياً' : 'Enter Details Manually'}
                </h2>
              </div>

              <Card className="p-6 border-2 border-[#111827] rounded-xl bg-white space-y-4">
                <div>
                  <Label htmlFor="manual-title" className="mb-2 block">
                    {isRTL ? 'اسم المنتج *' : 'Product Title *'}
                  </Label>
                  <Input
                    id="manual-title"
                    value={manualData.title}
                    onChange={(e) => setManualData({ ...manualData, title: e.target.value })}
                    placeholder={isRTL ? 'مثال: آيفون 15 برو ماكس' : 'e.g., iPhone 15 Pro Max'}
                    className="border-2 border-[#111827] rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="manual-price" className="mb-2 block">
                    {isRTL ? 'السعر الحالي *' : 'Current Price *'}
                  </Label>
                  <Input
                    id="manual-price"
                    type="number"
                    step="0.01"
                    value={manualData.price}
                    onChange={(e) => setManualData({ ...manualData, price: e.target.value })}
                    placeholder="99.99"
                    className="border-2 border-[#111827] rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="manual-image" className="mb-2 block">
                    {isRTL ? 'رابط الصورة (اختياري)' : 'Image URL (optional)'}
                  </Label>
                  <Input
                    id="manual-image"
                    type="url"
                    value={manualData.image}
                    onChange={(e) => setManualData({ ...manualData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="border-2 border-[#111827] rounded-xl"
                  />
                </div>

                <Button
                  onClick={() => {
                    if (manualData.title && manualData.price) {
                      setFetchedData({
                        title: manualData.title,
                        price: parseFloat(manualData.price),
                        image: manualData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
                      });
                      setShowManualEntry(false);
                    } else {
                      setError(isRTL ? 'الرجاء إدخال الاسم والسعر على الأقل' : 'Please enter at least title and price');
                    }
                  }}
                  className="w-full bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl"
                >
                  {isRTL ? 'متابعة' : 'Continue'}
                </Button>
              </Card>
            </div>
          )}

          {/* Step 2: Review Product */}
          {fetchedData && (
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-[#5FB57A] text-white rounded-full border-2 border-[#111827]">
                  2
                </div>
                <h2 className="text-[#111827]">
                  {isRTL ? 'مراجعة المنتج' : 'Review Product'}
                </h2>
              </div>

              <Card className="p-6 border-2 border-[#111827] rounded-xl bg-[#E8F3E8]">
                <div className={`flex gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <ImageWithFallback
                      src={fetchedData.image}
                      alt={fetchedData.title}
                      className="w-32 h-32 rounded-xl object-cover border-2 border-[#111827]"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="text-[#111827] mb-3 line-clamp-2">
                      {fetchedData.title}
                    </h3>
                    
                    <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg border-2 border-[#111827]">
                        <TrendingDown className="w-5 h-5 text-[#5FB57A]" />
                        <span className="text-[#111827]">
                          ${fetchedData.price}
                        </span>
                      </div>
                    </div>

                    <a
                      href={productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-[#5FB57A] hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {isRTL ? 'عرض المنتج الأصلي' : 'View original product'}
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Step 3: Choose Notification Type */}
          {fetchedData && (
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-[#5FB57A] text-white rounded-full border-2 border-[#111827]">
                  3
                </div>
                <h2 className="text-[#111827]">
                  {isRTL ? 'نوع الإشعار' : 'Notification Type'}
                </h2>
              </div>

              <Card className="p-6 border-2 border-[#111827] rounded-xl bg-gradient-to-br from-[#5FB57A]/10 to-transparent">
                <RadioGroup 
                  value={notificationType} 
                  onValueChange={(value) => setNotificationType(value as 'price_drop' | 'restock')}
                  className="space-y-4"
                >
                  {/* Price Drop Option */}
                  <div className={`flex items-start gap-4 p-4 bg-white rounded-xl border-2 border-[#111827] cursor-pointer hover:shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] transition-all ${notificationType === 'price_drop' ? 'ring-2 ring-[#5FB57A]' : ''}`}>
                    <RadioGroupItem 
                      value="price_drop" 
                      id="price_drop" 
                      className="mt-1 border-2 border-[#111827] text-[#5FB57A]"
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor="price_drop" 
                        className="text-[#111827] cursor-pointer flex items-center gap-2 mb-2"
                      >
                        <TrendingDown className="w-5 h-5 text-[#5FB57A]" />
                        <span>{isRTL ? 'إشعار عند انخفاض السعر' : 'Price Drop Alert'}</span>
                      </Label>
                      <p className="text-sm text-[#111827] opacity-70">
                        {isRTL 
                          ? 'سنرسل لك رسالة نصية على رقم هاتفك في كل مرة ينخفض فيها سعر هذا المنتج'
                          : 'Get a text message every time the price of this product drops'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Restock Option */}
                  <div className={`flex items-start gap-4 p-4 bg-white rounded-xl border-2 border-[#111827] cursor-pointer hover:shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] transition-all ${notificationType === 'restock' ? 'ring-2 ring-[#5FB57A]' : ''}`}>
                    <RadioGroupItem 
                      value="restock" 
                      id="restock" 
                      className="mt-1 border-2 border-[#111827] text-[#5FB57A]"
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor="restock" 
                        className="text-[#111827] cursor-pointer flex items-center gap-2 mb-2"
                      >
                        <Package className="w-5 h-5 text-[#5FB57A]" />
                        <span>{isRTL ? 'إشعار عند توفر المنتج' : 'Restock Alert'}</span>
                      </Label>
                      <p className="text-sm text-[#111827] opacity-70">
                        {isRTL 
                          ? 'سنرسل لك رسالة نصية على رقم هاتفك عندما يصبح هذا المنتج متاحاً مرة أخرى'
                          : 'Get a text message when this product becomes available again'
                        }
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </Card>
            </div>
          )}

          {/* Submit Button */}
          {fetchedData && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full h-14 bg-[#5FB57A] hover:bg-[#4FA569] text-white border-4 border-[#111827] rounded-xl shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] hover:shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className={`w-5 h-5 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'جاري الإضافة...' : 'Adding Product...'}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isRTL ? 'ابدأ التتبع الآن' : 'Start Tracking Now'}
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>

        {/* Benefits Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="p-6 border-2 border-[#111827] rounded-xl bg-white text-center">
            <div className="w-12 h-12 bg-[#5FB57A] rounded-xl border-2 border-[#111827] flex items-center justify-center mx-auto mb-4">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-[#111827] mb-2">
              {isRTL ? 'إشعارات فورية' : 'Instant Alerts'}
            </h3>
            <p className="text-sm text-[#111827] opacity-70">
              {isRTL 
                ? 'احصل على رسالة نصية فورية عند انخفاض السعر'
                : 'Get instant SMS when the price drops'
              }
            </p>
          </Card>

          <Card className="p-6 border-2 border-[#111827] rounded-xl bg-white text-center">
            <div className="w-12 h-12 bg-[#5FB57A] rounded-xl border-2 border-[#111827] flex items-center justify-center mx-auto mb-4">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-[#111827] mb-2">
              {isRTL ? 'مراقبة مستمرة' : 'Always Watching'}
            </h3>
            <p className="text-sm text-[#111827] opacity-70">
              {isRTL 
                ? 'نراقب الأسعار على مدار الساعة'
                : 'We monitor prices 24/7 for you'
              }
            </p>
          </Card>

          <Card className="p-6 border-2 border-[#111827] rounded-xl bg-white text-center">
            <div className="w-12 h-12 bg-[#5FB57A] rounded-xl border-2 border-[#111827] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-[#111827] mb-2">
              {isRTL ? 'مجاني تماماً' : 'Completely Free'}
            </h3>
            <p className="text-sm text-[#111827] opacity-70">
              {isRTL 
                ? 'بدون رسوم أو اشتراكات مخفية'
                : 'No fees or hidden subscriptions'
              }
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
