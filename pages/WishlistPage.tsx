import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from 'next/router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Loader2, TrendingDown, Package, Tag, Store, Trash2, ExternalLink, Plus } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';

interface TrackedProduct {
  id: string;
  user_id: string;
  product_id: string;
  product_title: string;
  product_image: string;
  product_price: number;
  product_url: string;
  notify_on_price_drop: boolean;
  notify_on_restock: boolean;
  target_price?: number;
  created_at: string;
}

interface SavedDeal {
  id: string;
  user_id: string;
  deal_id: string;
  deal_title: string;
  deal_image: string;
  deal_discount: string;
  deal_store: string;
  deal_url: string;
  created_at: string;
}

interface SavedStore {
  id: string;
  user_id: string;
  store_id: string;
  store_name: string;
  store_logo: string;
  created_at: string;
}

export default function WishlistPage() {
  const { user, isAuthenticated } = useAuth();
  const { isRTL, language } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [trackedProducts, setTrackedProducts] = useState<TrackedProduct[]>([]);
  const [savedDeals, setSavedDeals] = useState<SavedDeal[]>([]);
  const [savedStores, setSavedStores] = useState<SavedStore[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    fetchWishlistData();
  }, [isAuthenticated]);

  const fetchWishlistData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('session_token');
      if (!token) return;

      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      // Fetch tracked products
      const productsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/tracked-products`,
        { headers }
      );
      if (productsRes.ok) {
        const data = await productsRes.json();
        setTrackedProducts(data.tracked_products || []);
      }

      // Fetch saved deals
      const dealsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/saved-deals`,
        { headers }
      );
      if (dealsRes.ok) {
        const data = await dealsRes.json();
        setSavedDeals(data.saved_deals || []);
      }

      // Fetch saved stores
      const storesRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/saved-stores`,
        { headers }
      );
      if (storesRes.ok) {
        const data = await storesRes.json();
        setSavedStores(data.saved_stores || []);
      }
    } catch (error) {
      console.error('Error fetching wishlist data:', error);
      toast.error(isRTL ? 'فشل تحميل البيانات' : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTrackedProduct = async (productId: string) => {
    try {
      const token = localStorage.getItem('session_token');
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
        setTrackedProducts(trackedProducts.filter(p => p.id !== productId));
        toast.success(isRTL ? 'تم إزالة المنتج من التتبع' : 'Product removed from tracking');
      }
    } catch (error) {
      console.error('Error removing tracked product:', error);
      toast.error(isRTL ? 'فشل إزالة المنتج' : 'Failed to remove product');
    }
  };

  const handleRemoveSavedDeal = async (dealId: string) => {
    try {
      const token = localStorage.getItem('session_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/saved-deals/${dealId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSavedDeals(savedDeals.filter(d => d.id !== dealId));
        toast.success(isRTL ? 'تم إزالة العرض' : 'Deal removed');
      }
    } catch (error) {
      console.error('Error removing saved deal:', error);
      toast.error(isRTL ? 'فشل إزالة العرض' : 'Failed to remove deal');
    }
  };

  const handleRemoveSavedStore = async (storeId: string) => {
    try {
      const token = localStorage.getItem('session_token');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/saved-stores/${storeId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSavedStores(savedStores.filter(s => s.id !== storeId));
        toast.success(isRTL ? 'تم إزالة المتجر' : 'Store removed');
      }
    } catch (error) {
      console.error('Error removing saved store:', error);
      toast.error(isRTL ? 'فشل إزالة المتجر' : 'Failed to remove store');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8F3E8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5FB57A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8F3E8]" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-[#111827] mb-2">
              {isRTL ? 'رادار التوفير' : 'Savings Radar'}
            </h1>
            <p className="text-[#111827] opacity-70">
              {isRTL 
                ? 'تتبع المنتجات والعروض والمتاجر المفضلة لديك'
                : 'Track your favorite products, deals, and stores'
              }
            </p>
          </div>
          <Button
            onClick={() => router.push('/add-product')}
            className="bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-lg shadow-[3px_3px_0px_0px_rgba(17,24,39,1)]"
          >
            <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? 'إضافة منتج' : 'Add Product'}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white border-2 border-[#111827] rounded-xl p-1">
            <TabsTrigger 
              value="products" 
              className="rounded-lg data-[state=active]:bg-[#5FB57A] data-[state=active]:text-white"
            >
              <Package className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'المنتجات المتتبعة' : 'Tracked Products'} ({trackedProducts.length})
            </TabsTrigger>
            <TabsTrigger 
              value="deals"
              className="rounded-lg data-[state=active]:bg-[#5FB57A] data-[state=active]:text-white"
            >
              <Tag className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'العروض المحفوظة' : 'Saved Deals'} ({savedDeals.length})
            </TabsTrigger>
            <TabsTrigger 
              value="stores"
              className="rounded-lg data-[state=active]:bg-[#5FB57A] data-[state=active]:text-white"
            >
              <Store className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'المتاجر المحفوظة' : 'Saved Stores'} ({savedStores.length})
            </TabsTrigger>
          </TabsList>

          {/* Tracked Products */}
          <TabsContent value="products" className="space-y-4">
            {trackedProducts.length === 0 ? (
              <Card className="p-12 text-center border-2 border-[#111827] rounded-xl">
                <Package className="w-16 h-16 mx-auto mb-4 text-[#5FB57A]" />
                <h3 className="text-[#111827] mb-2">
                  {isRTL ? 'لا توجد منتجات متتبعة' : 'No tracked products'}
                </h3>
                <p className="text-[#111827] opacity-70 mb-6">
                  {isRTL 
                    ? 'ابدأ بتتبع المنتجات للحصول على إشعارات عند انخفاض الأسعار'
                    : 'Start tracking products to get notified when prices drop'
                  }
                </p>
                <Button 
                  onClick={() => router.push('/products')}
                  className="bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)]"
                >
                  {isRTL ? 'تصفح المنتجات' : 'Browse Products'}
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trackedProducts.map((product) => (
                  <Card key={product.id} className="p-4 border-2 border-[#111827] rounded-xl bg-white">
                    <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <ImageWithFallback
                        src={product.product_image}
                        alt={product.product_title}
                        className="w-24 h-24 rounded-lg object-cover border-2 border-[#111827]"
                      />
                      <div className="flex-1">
                        <h3 className="text-[#111827] mb-2 line-clamp-2">
                          {product.product_title}
                        </h3>
                        <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-[#5FB57A]">
                            ${product.product_price}
                          </span>
                          {product.target_price && (
                            <Badge variant="secondary" className="text-xs">
                              <TrendingDown className="w-3 h-3 mr-1" />
                              Target: ${product.target_price}
                            </Badge>
                          )}
                        </div>
                        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(product.product_url, '_blank')}
                            className="border-2 border-[#111827] rounded-lg"
                          >
                            <ExternalLink className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                            {isRTL ? 'عرض' : 'View'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveTrackedProduct(product.id)}
                            className="border-2 border-[#111827] rounded-lg"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Saved Deals */}
          <TabsContent value="deals" className="space-y-4">
            {savedDeals.length === 0 ? (
              <Card className="p-12 text-center border-2 border-[#111827] rounded-xl">
                <Tag className="w-16 h-16 mx-auto mb-4 text-[#5FB57A]" />
                <h3 className="text-[#111827] mb-2">
                  {isRTL ? 'لا توجد عروض محفوظة' : 'No saved deals'}
                </h3>
                <p className="text-[#111827] opacity-70 mb-6">
                  {isRTL 
                    ? 'احفظ العروض المفضلة لديك للوصول إليها بسرعة'
                    : 'Save your favorite deals for quick access'
                  }
                </p>
                <Button 
                  onClick={() => router.push('/deals')}
                  className="bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)]"
                >
                  {isRTL ? 'تصفح العروض' : 'Browse Deals'}
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedDeals.map((deal) => (
                  <Card key={deal.id} className="p-4 border-2 border-[#111827] rounded-xl bg-white">
                    <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <ImageWithFallback
                        src={deal.deal_image}
                        alt={deal.deal_title}
                        className="w-24 h-24 rounded-lg object-cover border-2 border-[#111827]"
                      />
                      <div className="flex-1">
                        <h3 className="text-[#111827] mb-2 line-clamp-2">
                          {deal.deal_title}
                        </h3>
                        <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Badge className="bg-[#FF6B6B] text-white border-2 border-[#111827]">
                            {deal.deal_discount}
                          </Badge>
                          <span className="text-sm text-[#111827] opacity-70">
                            {deal.deal_store}
                          </span>
                        </div>
                        <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(deal.deal_url, '_blank')}
                            className="border-2 border-[#111827] rounded-lg"
                          >
                            <ExternalLink className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                            {isRTL ? 'عرض' : 'View'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveSavedDeal(deal.id)}
                            className="border-2 border-[#111827] rounded-lg"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Saved Stores */}
          <TabsContent value="stores" className="space-y-4">
            {savedStores.length === 0 ? (
              <Card className="p-12 text-center border-2 border-[#111827] rounded-xl">
                <Store className="w-16 h-16 mx-auto mb-4 text-[#5FB57A]" />
                <h3 className="text-[#111827] mb-2">
                  {isRTL ? 'لا توجد متاجر محفوظة' : 'No saved stores'}
                </h3>
                <p className="text-[#111827] opacity-70 mb-6">
                  {isRTL 
                    ? 'احفظ المتاجر المفضلة لديك للوصول السريع إلى عروضها'
                    : 'Save your favorite stores for quick access to their deals'
                  }
                </p>
                <Button 
                  onClick={() => router.push('/stores')}
                  className="bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)]"
                >
                  {isRTL ? 'تصفح المتاجر' : 'Browse Stores'}
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {savedStores.map((store) => (
                  <Card key={store.id} className="p-4 border-2 border-[#111827] rounded-xl bg-white text-center">
                    <ImageWithFallback
                      src={store.store_logo}
                      alt={store.store_name}
                      className="w-16 h-16 mx-auto mb-3 rounded-lg object-contain"
                    />
                    <h3 className="text-[#111827] mb-3">
                      {store.store_name}
                    </h3>
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/store/${store.store_id}`)}
                        className="border-2 border-[#111827] rounded-lg flex-1"
                      >
                        {isRTL ? 'عرض' : 'View'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveSavedStore(store.id)}
                        className="border-2 border-[#111827] rounded-lg"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
