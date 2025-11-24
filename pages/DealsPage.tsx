import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { createClient } from "../utils/supabase/client";
import { Search, SlidersHorizontal, X, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { DealCard } from "../components/DealCard";

// Helper function to generate slug from store name
function generateSlug(storeName: string): string {
  return storeName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Helper function to check if a string is a UUID
function isUUID(str: string): boolean {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(str);
}

interface Deal {
  id: number;
  slug_en?: string;
  slug_ar?: string;
  title_en: string;
  title_ar?: string;
  description_en?: string;
  description_ar?: string;
  discount_percentage?: number;
  discount_amount?: number;
  original_price?: number;
  discounted_price?: number;
  code?: string;
  store_id?: string;
  store_slug_en?: string;
  slug_ar?: string;
  store_name?: string;
  store_logo?: string;
  category_name?: string;
  expires_at?: string;
  is_verified?: boolean;
  featured?: boolean;
}

interface Category {
  id: number;
  name: string;
}

interface Store {
  id: number;
  name: string;
}

export default function DealsPage() {
  const { t, isRTL, language } = useLanguage();
  // SSR data removed - will fetch client-side

  // Check if SSR data is available
  const hasSSRData = ssrData && ssrData.deals;

  // Initialize state with SSR data when available
  const [deals, setDeals] = useState<Deal[]>(hasSSRData ? ssrData.deals || [] : []);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>(hasSSRData ? ssrData.deals || [] : []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(!hasSSRData);
  const [savedDeals, setSavedDeals] = useState<Set<number>>(new Set());
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [selectedDiscount, setSelectedDiscount] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);

    // Only fetch on client side if we don't have SSR data
    if (!hasSSRData) {
      fetchDeals();
    }
    fetchCategories();
    fetchStores();
  }, [language]);

  useEffect(() => {
    applyFilters();
  }, [deals, searchQuery, selectedCategory, selectedStore, selectedDiscount, sortBy]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      
      // Fetch all deals and stores separately to avoid complex joins
      const { data: dealsData, error: dealsError } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (dealsError) {
        console.error('Error fetching deals:', dealsError);
        setDeals([]);
        return;
      }

      if (!dealsData || dealsData.length === 0) {
        console.log('No deals found in database');
        setDeals([]);
        return;
      }

      console.log('Successfully fetched deals:', dealsData.length);

      // Fetch all stores to map store_id to store data
      const { data: storesData } = await supabase
        .from('stores')
        .select('*');

      // Create a map of store_id to store data
      const storesMap = new Map();
      if (storesData) {
        storesData.forEach((store: any) => {
          storesMap.set(store.id, store);
        });
      }

      // Format deals with store data
      const formattedDeals = dealsData.map((deal: any) => {
        const store = storesMap.get(deal.store_id);
        const storeName = store?.store_name || store?.name || store?.title;
        
        // Generate slug: use store.slug if available and it's not a UUID, otherwise generate from name
        let storeSlug: string | undefined;
        if (store?.slug && !isUUID(store.slug)) {
          // Use the slug from database only if it's not a UUID
          storeSlug = store.slug;
        } else if (storeName) {
          // Generate a proper slug from the store name
          storeSlug = generateSlug(storeName);
        } else {
          // If we can't find store data, don't include a slug so the link won't be created
          storeSlug = undefined;
        }
        
        return {
          id: deal.id,
          slug: deal.slug,
          title_en: deal.title_en,
          title_ar: deal.title_ar,
          description: deal.description,
          description_ar: deal.description_ar,
          discount_percentage: deal.discount_percentage,
          discount_amount: deal.discount_amount,
          original_price: deal.original_price,
          discounted_price: deal.discounted_price,
          code: deal.code,
          store_id: deal.store_id,
          store_slug: storeSlug,
          store_name: storeName,
          store_logo: store?.logo_url,
          category_name: deal.category_name,
          expires_at: deal.expires_at,
          is_verified: deal.is_verified,
          featured: deal.featured,
        };
      });
      
      setDeals(formattedDeals);
    } catch (error) {
      console.error('Unexpected error fetching deals:', error);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const supabase = createClient();
      
      // Try to fetch from categories table first
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (!categoriesError && categoriesData && categoriesData.length > 0) {
        console.log('Fetched categories from categories table:', categoriesData.length);
        console.log('Category columns:', Object.keys(categoriesData[0]));
        
        const formattedCategories = categoriesData.map((cat: any) => ({
          id: cat.id,
          name: cat.category_name || cat.name || cat.title || 'Unknown Category',
        })).sort((a, b) => a.name.localeCompare(b.name));
        
        setCategories(formattedCategories);
      } else {
        // Fallback: Extract unique categories from deals
        console.log('Extracting categories from deals data');
        const { data: dealsData } = await supabase
          .from('deals')
          .select('category_name');
        
        if (dealsData) {
          const uniqueCategories = Array.from(
            new Set(dealsData.map((d: any) => d.category_name).filter(Boolean))
          ).map((name, index) => ({ id: index + 1, name: name as string }))
            .sort((a, b) => a.name.localeCompare(b.name));
          
          setCategories(uniqueCategories);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchStores = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('stores')
        .select('*');

      if (!error && data && data.length > 0) {
        console.log('Fetched stores:', data.length);
        console.log('Store columns:', Object.keys(data[0]));
        
        const formattedStores = data.map((store: any) => ({
          id: store.id,
          name: store.store_name || store.name || store.title || 'Unknown Store',
        })).sort((a, b) => a.name.localeCompare(b.name));
        
        setStores(formattedStores);
      } else {
        console.warn('Stores table error:', error?.message);
        setStores([]);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      setStores([]);
    }
  };

  const applyFilters = () => {
    let filtered = [...deals];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(deal => {
        const title = isRTL && deal.title_ar ? deal.title_ar : deal.title_en;
        const description = isRTL && deal.description_ar ? deal.description_ar : deal.description;
        return (
          title?.toLowerCase().includes(query) ||
          description?.toLowerCase().includes(query) ||
          deal.store_name?.toLowerCase().includes(query) ||
          deal.category_name?.toLowerCase().includes(query)
        );
      });
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(deal => deal.category_name === selectedCategory);
    }

    // Store filter
    if (selectedStore !== "all") {
      filtered = filtered.filter(deal => deal.store_name === selectedStore);
    }

    // Discount filter
    if (selectedDiscount !== "all") {
      const discountValue = parseInt(selectedDiscount);
      filtered = filtered.filter(deal => {
        const discount = deal.discount_percentage || 0;
        return discount >= discountValue;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "discount-high":
          return (b.discount_percentage || 0) - (a.discount_percentage || 0);
        case "discount-low":
          return (a.discount_percentage || 0) - (b.discount_percentage || 0);
        case "price-high":
          return (b.discounted_price || 0) - (a.discounted_price || 0);
        case "price-low":
          return (a.discounted_price || 0) - (b.discounted_price || 0);
        case "newest":
        default:
          return 0; // Already sorted by created_at
      }
    });

    setFilteredDeals(filtered);
  };

  const toggleSave = (dealId: number) => {
    setSavedDeals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dealId)) {
        newSet.delete(dealId);
        toast.success(isRTL ? "تمت إزالة العرض من المحفوظات" : "Deal removed from saved");
      } else {
        newSet.add(dealId);
        toast.success(isRTL ? "تم حفظ العرض" : "Deal saved successfully");
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStore("all");
    setSelectedDiscount("all");
    setSortBy("newest");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedStore !== "all" || selectedDiscount !== "all";

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block mb-2 text-[#111827]" style={{ fontSize: '14px', fontWeight: 600 }}>
          {isRTL ? 'البحث' : 'Search'}
        </label>
        <div className="relative">
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]`} />
          <Input
            type="text"
            placeholder={isRTL ? 'ابحث عن عروض...' : 'Search for deals...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${isRTL ? 'pr-10' : 'pl-10'} border-2 border-[#111827] rounded-lg h-12`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block mb-2 text-[#111827]" style={{ fontSize: '14px', fontWeight: 600 }}>
          {isRTL ? 'الفئة' : 'Category'}
        </label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="border-2 border-[#111827] rounded-lg h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL ? 'جميع الفئات' : 'All Categories'}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Store Filter */}
      <div>
        <label className="block mb-2 text-[#111827]" style={{ fontSize: '14px', fontWeight: 600 }}>
          {isRTL ? 'المتجر' : 'Store'}
        </label>
        <Select value={selectedStore} onValueChange={setSelectedStore}>
          <SelectTrigger className="border-2 border-[#111827] rounded-lg h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL ? 'جميع المتاجر' : 'All Stores'}</SelectItem>
            {stores.map((store) => (
              <SelectItem key={store.id} value={store.name}>
                {store.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Discount Filter */}
      <div>
        <label className="block mb-2 text-[#111827]" style={{ fontSize: '14px', fontWeight: 600 }}>
          {isRTL ? 'نسبة الخصم' : 'Discount'}
        </label>
        <Select value={selectedDiscount} onValueChange={setSelectedDiscount}>
          <SelectTrigger className="border-2 border-[#111827] rounded-lg h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL ? 'أي خصم' : 'Any Discount'}</SelectItem>
            <SelectItem value="10">{isRTL ? '10% فأكثر' : '10% or more'}</SelectItem>
            <SelectItem value="25">{isRTL ? '25% فأكثر' : '25% or more'}</SelectItem>
            <SelectItem value="50">{isRTL ? '50% فأكثر' : '50% or more'}</SelectItem>
            <SelectItem value="75">{isRTL ? '75% فأكثر' : '75% or more'}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort By */}
      <div>
        <label className="block mb-2 text-[#111827]" style={{ fontSize: '14px', fontWeight: 600 }}>
          {isRTL ? 'ترتيب حسب' : 'Sort By'}
        </label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="border-2 border-[#111827] rounded-lg h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{isRTL ? 'الأحدث' : 'Newest'}</SelectItem>
            <SelectItem value="discount-high">{isRTL ? 'أعلى خصم' : 'Highest Discount'}</SelectItem>
            <SelectItem value="discount-low">{isRTL ? 'أقل خصم' : 'Lowest Discount'}</SelectItem>
            <SelectItem value="price-high">{isRTL ? 'أعلى سعر' : 'Highest Price'}</SelectItem>
            <SelectItem value="price-low">{isRTL ? 'أقل سعر' : 'Lowest Price'}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          onClick={clearFilters}
          variant="outline"
          className="w-full border-2 border-[#111827] rounded-lg h-12"
        >
          <X className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {isRTL ? 'إزالة الفلاتر' : 'Clear Filters'}
        </Button>
      )}
    </div>
  );

  return (
    <section className="py-12 md:py-16 bg-[#E8F3E8] min-h-screen">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          <Link to="/" className="inline-flex items-center text-[#5FB57A] hover:text-[#4FA669] mb-4 transition-colors">
            <ArrowLeft className={`h-5 w-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
            {isRTL ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}
          </Link>
          <h1 className="text-[#111827] mb-4" style={{ fontSize: '36px', fontWeight: 700 }}>
            {isRTL ? 'جميع العروض' : 'All Deals'}
          </h1>
          <p className="text-[#6B7280]">
            {isRTL 
              ? `اكتشف ${filteredDeals.length} عرض متاح`
              : `Discover ${filteredDeals.length} available deals`}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block">
            <div className="bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#111827]" style={{ fontSize: '20px', fontWeight: 700 }}>
                  {isRTL ? 'الفلاتر' : 'Filters'}
                </h3>
                <SlidersHorizontal className="h-5 w-5 text-[#5FB57A]" />
              </div>
              <FilterSection />
            </div>
          </aside>

          {/* Mobile Filters */}
          <div className="lg:hidden mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button className="w-full bg-white border-2 border-[#111827] text-[#111827] rounded-lg h-12 shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)]">
                  <SlidersHorizontal className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {isRTL ? 'الفلاتر' : 'Filters'}
                  {hasActiveFilters && (
                    <Badge className="bg-[#5FB57A] text-white ml-2 mr-2">
                      {isRTL ? 'نشط' : 'Active'}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side={isRTL ? "right" : "left"} className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>{isRTL ? 'الفلاتر' : 'Filters'}</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSection />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Deals Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 bg-white rounded-2xl border-2 border-[#111827] animate-pulse"
                  />
                ))}
              </div>
            ) : filteredDeals.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
                <p className="text-[#6B7280] mb-4" style={{ fontSize: '18px' }}>
                  {isRTL ? 'لم يتم العثور على عروض' : 'No deals found'}
                </p>
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    className="bg-[#5FB57A] hover:bg-[#4FA669] text-white border-2 border-[#111827] rounded-lg"
                  >
                    {isRTL ? 'إزالة الفلاتر' : 'Clear Filters'}
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                {filteredDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    isRTL={isRTL}
                    isSaved={savedDeals.has(deal.id)}
                    onToggleSave={toggleSave}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
