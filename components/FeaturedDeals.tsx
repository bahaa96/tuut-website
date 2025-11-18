"use client";
import { Heart, Copy, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";
import { useCountry } from "../contexts/CountryContext";
import { getCountryValue } from "../utils/countryHelpers";
import { fetchFeaturedDeals } from "../utils/api";
import Link from "next/link";
import { copyToClipboard } from "../utils/clipboard";

// Import translations directly for deals content
const translations = {
  en: {
    featuredDeals: {
      deals: [
        { title: 'Flat 40% off*', store: 'Fashion Avenue', description: 'Save 40% on all fashion items.' },
        { title: 'Flat $60 off*', store: 'Tech Galaxy', description: 'Save $60 on all electronics.' },
        { title: 'Free Coffee*', store: 'Brew & Bites', description: 'Get free coffee with any order.' },
        { title: 'Buy 2 Get 1 Free*', store: 'Glow Cosmetics', description: 'Buy 2 beauty products, get 1 free.' },
        { title: 'Flat 50% off*', store: 'Audio Hub', description: 'Save 50% on premium headphones.' },
        { title: 'Shoes from $29*', store: 'Sports Pro', description: 'Athletic shoes starting at $29.' },
      ],
    },
  },
  ar: {
    featuredDeals: {
      deals: [
        { title: 'خصم 40% مباشر*', store: 'أزياء أفينيو', description: 'وفر 40% على جميع منتجات الأزياء.' },
        { title: 'خصم 60 دولار مباشر*', store: 'تك جالاكسي', description: 'وفر 60 دولار على جميع الأجهزة الإلكترونية.' },
        { title: 'قهوة مجانية*', store: 'بريو آند بايتس', description: 'احصل على قهوة مجانية مع أي طلب.' },
        { title: 'اشتري 2 واحصل على 1 مجاناً*', store: 'جلو كوزمتيكس', description: 'اشتري منتجين تجميل واحصل على واحد مجاناً.' },
        { title: 'خصم 50% مباشر*', store: 'أوديو هاب', description: 'وفر 50% على سماعات الرأس المميزة.' },
        { title: 'أحذية من 29 دولار*', store: 'سبورتس برو', description: 'أحذية رياضية تبدأ من 29 دولار.' },
      ],
    },
  },
};

interface Deal {
  id: number;
  title: string;
  title_ar?: string;
  store: string;
  store_ar?: string;
  discount: string;
  description: string;
  description_ar?: string;
  code?: string;
  type: "coupon" | "sale";
  color: string;
  slug?: string;
}

export function FeaturedDeals() {
  const { t, isRTL, language } = useLanguage();
  const { country } = useCountry();
  const [savedDeals, setSavedDeals] = useState<Set<number>>(new Set());
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Fetch deals from server whenever country or language changes
  useEffect(() => {
    const fetchDealsData = async () => {
      try {
        setLoading(true);
        
        // Get country value for filtering
        const countryValue = getCountryValue(country);
        
        console.log('Fetching featured deals for country:', countryValue);
        
        // Fetch deals with country filter
        const result = await fetchFeaturedDeals({ 
          country: countryValue || undefined 
        });

        console.log('Featured deals API result:', result);
        console.log('First deal structure:', result.deals?.[0]);

        if (result.error) {
          console.error('Error fetching featured deals:', result.error);
          setError(result.error);
          // Fall back to hardcoded deals on error
          const translatedDeals = translations[language].featuredDeals.deals;
          setDeals([
            {
              id: 1,
              title: translatedDeals[0].title,
              store: translatedDeals[0].store,
              discount: "40%",
              description: translatedDeals[0].description,
              code: "FASHION40",
              type: "coupon",
              color: "#7EC89A",
            },
            {
              id: 2,
              title: translatedDeals[1].title,
              store: translatedDeals[1].store,
              discount: "60%",
              description: translatedDeals[1].description,
              code: "TECH60",
              type: "coupon",
              color: "#5FB57A",
            },
            {
              id: 3,
              title: translatedDeals[2].title,
              store: translatedDeals[2].store,
              discount: "FREE",
              description: translatedDeals[2].description,
              code: "FREEBREW",
              type: "coupon",
              color: "#9DD9B3",
            },
            {
              id: 4,
              title: translatedDeals[3].title,
              store: translatedDeals[3].store,
              discount: "33%",
              description: translatedDeals[3].description,
              code: "BEAUTY3",
              type: "coupon",
              color: "#BCF0CC",
            },
            {
              id: 5,
              title: translatedDeals[4].title,
              store: translatedDeals[4].store,
              discount: "50%",
              description: translatedDeals[4].description,
              code: "AUDIO50",
              type: "coupon",
              color: "#7EC89A",
            },
            {
              id: 6,
              title: translatedDeals[5].title,
              store: translatedDeals[5].store,
              discount: "70%",
              description: translatedDeals[5].description,
              code: "SPORTS29",
              type: "coupon",
              color: "#5FB57A",
            },
          ]);
        } else if (result.deals && result.deals.length > 0) {
          // Transform the nested data structure to match our Deal interface
          const transformedDeals = result.deals
            .map((item: any, index: number) => {
              console.log(`Processing deal ${index}:`, item);
              
              const deal = item.deals;
              const store = deal?.stores;
              
              // Skip deals with missing critical data
              if (!deal) {
                console.warn(`Skipping deal ${index} - no deal data`);
                return null;
              }
              
              if (!deal.title && !deal.title_ar) {
                console.warn(`Skipping deal ${index} - no title`);
                return null;
              }
              
              return {
                id: item.id || index,
                title: deal?.title || deal?.title_ar || 'Special Deal',
                title_ar: deal?.title_ar || deal?.title || 'عرض خاص',
                store: store?.name || store?.name_ar || 'Store',
                store_ar: store?.name_ar || store?.name || 'متجر',
                discount: deal?.discount_percentage || deal?.discount_amount || '0%',
                description: deal?.description || deal?.description_ar || '',
                description_ar: deal?.description_ar || deal?.description || '',
                code: deal?.code || '',
                type: deal?.code ? 'coupon' : 'sale',
                color: ['#7EC89A', '#5FB57A', '#9DD9B3', '#BCF0CC'][index % 4],
                slug: deal?.slug || `deal-${item.id || index}`,
              };
            })
            .filter(Boolean); // Remove null entries
          
          console.log('Transformed deals:', transformedDeals);
          console.log(`Valid deals: ${transformedDeals.length} out of ${result.deals.length}`);
          
          // If we have valid transformed deals, use them
          if (transformedDeals.length > 0) {
            setDeals(transformedDeals);
            setError(null);
          } else {
            // No valid deals after transformation, use fallback
            console.log('No valid deals after transformation, using fallback');
            const translatedDeals = translations[language].featuredDeals.deals;
            setDeals([
              {
                id: 1,
                title: translatedDeals[0].title,
                store: translatedDeals[0].store,
                discount: "40%",
                description: translatedDeals[0].description,
                code: "FASHION40",
                type: "coupon",
                color: "#7EC89A",
              },
              {
                id: 2,
                title: translatedDeals[1].title,
                store: translatedDeals[1].store,
                discount: "60%",
                description: translatedDeals[1].description,
                code: "TECH60",
                type: "coupon",
                color: "#5FB57A",
              },
              {
                id: 3,
                title: translatedDeals[2].title,
                store: translatedDeals[2].store,
                discount: "FREE",
                description: translatedDeals[2].description,
                code: "FREEBREW",
                type: "coupon",
                color: "#9DD9B3",
              },
              {
                id: 4,
                title: translatedDeals[3].title,
                store: translatedDeals[3].store,
                discount: "33%",
                description: translatedDeals[3].description,
                code: "BEAUTY3",
                type: "coupon",
                color: "#BCF0CC",
              },
              {
                id: 5,
                title: translatedDeals[4].title,
                store: translatedDeals[4].store,
                discount: "50%",
                description: translatedDeals[4].description,
                code: "AUDIO50",
                type: "coupon",
                color: "#7EC89A",
              },
              {
                id: 6,
                title: translatedDeals[5].title,
                store: translatedDeals[5].store,
                discount: "70%",
                description: translatedDeals[5].description,
                code: "SPORTS29",
                type: "coupon",
                color: "#5FB57A",
              },
            ]);
          }
        } else {
          // No deals found, use fallback
          console.log('No deals returned from API, using fallback deals');
          const translatedDeals = translations[language].featuredDeals.deals;
          setDeals([
            {
              id: 1,
              title: translatedDeals[0].title,
              store: translatedDeals[0].store,
              discount: "40%",
              description: translatedDeals[0].description,
              code: "FASHION40",
              type: "coupon",
              color: "#7EC89A",
            },
            {
              id: 2,
              title: translatedDeals[1].title,
              store: translatedDeals[1].store,
              discount: "60%",
              description: translatedDeals[1].description,
              code: "TECH60",
              type: "coupon",
              color: "#5FB57A",
            },
            {
              id: 3,
              title: translatedDeals[2].title,
              store: translatedDeals[2].store,
              discount: "FREE",
              description: translatedDeals[2].description,
              code: "FREEBREW",
              type: "coupon",
              color: "#9DD9B3",
            },
            {
              id: 4,
              title: translatedDeals[3].title,
              store: translatedDeals[3].store,
              discount: "33%",
              description: translatedDeals[3].description,
              code: "BEAUTY3",
              type: "coupon",
              color: "#BCF0CC",
            },
            {
              id: 5,
              title: translatedDeals[4].title,
              store: translatedDeals[4].store,
              discount: "50%",
              description: translatedDeals[4].description,
              code: "AUDIO50",
              type: "coupon",
              color: "#7EC89A",
            },
            {
              id: 6,
              title: translatedDeals[5].title,
              store: translatedDeals[5].store,
              discount: "70%",
              description: translatedDeals[5].description,
              code: "SPORTS29",
              type: "coupon",
              color: "#5FB57A",
            },
          ]);
          setError(null);
        }
      } catch (err) {
        console.error('Error in fetchDeals:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        
        // Load fallback deals on error
        const translatedDeals = translations[language].featuredDeals.deals;
        setDeals([
          {
            id: 1,
            title: translatedDeals[0].title,
            store: translatedDeals[0].store,
            discount: "40%",
            description: translatedDeals[0].description,
            code: "FASHION40",
            type: "coupon",
            color: "#7EC89A",
          },
          {
            id: 2,
            title: translatedDeals[1].title,
            store: translatedDeals[1].store,
            discount: "60%",
            description: translatedDeals[1].description,
            code: "TECH60",
            type: "coupon",
            color: "#5FB57A",
          },
          {
            id: 3,
            title: translatedDeals[2].title,
            store: translatedDeals[2].store,
            discount: "FREE",
            description: translatedDeals[2].description,
            code: "FREEBREW",
            type: "coupon",
            color: "#9DD9B3",
          },
          {
            id: 4,
            title: translatedDeals[3].title,
            store: translatedDeals[3].store,
            discount: "33%",
            description: translatedDeals[3].description,
            code: "BEAUTY3",
            type: "coupon",
            color: "#BCF0CC",
          },
          {
            id: 5,
            title: translatedDeals[4].title,
            store: translatedDeals[4].store,
            discount: "50%",
            description: translatedDeals[4].description,
            code: "AUDIO50",
            type: "coupon",
            color: "#7EC89A",
          },
          {
            id: 6,
            title: translatedDeals[5].title,
            store: translatedDeals[5].store,
            discount: "70%",
            description: translatedDeals[5].description,
            code: "SPORTS29",
            type: "coupon",
            color: "#5FB57A",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDealsData();
  }, [language, country]);

  useEffect(() => {
    checkScrollButtons();
  }, [scrollPosition, deals]);

  const checkScrollButtons = () => {
    const container = document.getElementById('deals-scroll-container');
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('deals-scroll-container');
    if (container) {
      const scrollAmount = 600;
      const newPosition = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      
      setTimeout(() => {
        setScrollPosition(container.scrollLeft);
      }, 300);
    }
  };

  const toggleSave = (dealId: number) => {
    setSavedDeals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dealId)) {
        newSet.delete(dealId);
        toast.success(isRTL ? "تم إزالة العرض من المفضلة" : "Deal removed from favorites");
      } else {
        newSet.add(dealId);
        toast.success(isRTL ? "تم حفظ العرض في المفضلة!" : "Deal saved to favorites!");
      }
      return newSet;
    });
  };

  const copyCode = async (code: string, event?: React.MouseEvent) => {
    // Prevent card click navigation when clicking the copy button
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const success = await copyToClipboard(code);
    if (success) {
      toast.success(isRTL ? `تم نسخ الكود "${code}"!` : `Code "${code}" copied!`);
    } else {
      toast.error(isRTL ? `فشل نسخ الكود` : `Failed to copy code`);
    }
  };

  return (
    <section id="featured-deals" className="py-12 md:py-16 bg-background">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div className={`flex items-center justify-between mb-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className="mb-2 text-[#111827]" style={{ fontSize: '36px', fontWeight: 700 }}>
              {t('featuredDeals.title')}
            </h2>
            <p className="text-[#6B7280]">
              {t('featuredDeals.subtitle')}
            </p>
          </div>
          <Link to="/deals">
            <Button 
              variant="outline" 
              className="hidden md:flex border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white rounded-xl"
            >
              {t('featuredDeals.viewAll')}
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-100 rounded-2xl border-2 border-[#111827] animate-pulse"
              />
            ))}
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6B7280] mb-4">
              {isRTL ? 'لا توجد عروض متا��ة حالياً' : 'No deals available at the moment'}
            </p>
          </div>
        ) : (
        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <Button
              onClick={() => scroll(isRTL ? 'right' : 'left')}
              className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all p-0 hidden md:flex items-center justify-center`}
              style={isRTL ? { marginRight: '-24px' } : { marginLeft: '-24px' }}
            >
              {isRTL ? <ChevronRight className="h-6 w-6 text-[#111827]" /> : <ChevronLeft className="h-6 w-6 text-[#111827]" />}
            </Button>
          )}

          {/* Right Arrow */}
          {canScrollRight && (
            <Button
              onClick={() => scroll(isRTL ? 'left' : 'right')}
              className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all p-0 hidden md:flex items-center justify-center`}
              style={isRTL ? { marginLeft: '-24px' } : { marginRight: '-24px' }}
            >
              {isRTL ? <ChevronLeft className="h-6 w-6 text-[#111827]" /> : <ChevronRight className="h-6 w-6 text-[#111827]" />}
            </Button>
          )}

          {/* Scrollable Container */}
          <div
            id="deals-scroll-container"
            className="overflow-x-auto scrollbar-hide"
            onScroll={(e) => {
              setScrollPosition(e.currentTarget.scrollLeft);
              checkScrollButtons();
            }}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Two-row grid */}
            <div className="grid grid-rows-2 grid-flow-col gap-6 pb-2">
              {deals.map((deal) => (
            <Link
              key={deal.id}
              to={`/deal/${deal.slug || deal.id}`}
              className="group relative bg-white rounded-2xl overflow-hidden border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all w-[320px] md:w-[360px] block"
            >
              {/* Left/Right Discount Bar with Perforated Edge */}
              <div className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-0 bottom-0 w-[100px] flex items-center justify-center`} style={{ backgroundColor: deal.color }}>
                {/* Perforated circles on edge */}
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 bottom-0 w-2 flex flex-col justify-around`}>
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className={`w-3 h-3 bg-white rounded-full ${isRTL ? '-ml-1.5' : '-mr-1.5'}`} />
                  ))}
                </div>
                
                {/* Vertical DISCOUNT text */}
                <div
                  className="text-[#111827] tracking-[0.3em]"
                  style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    fontSize: '18px',
                    fontWeight: 700,
                    transform: 'rotate(180deg)',
                  }}
                >
                  {t('featuredDeals.discount')}
                </div>
              </div>

              {/* Main Content Area */}
              <div className={`${isRTL ? 'mr-[100px]' : 'ml-[100px]'} p-6 relative`}>
                {/* Heart Icon */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSave(deal.id);
                  }}
                  className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 rounded-full hover:bg-[#F0F7F0] transition-colors z-10`}
                >
                  <Heart
                    className={`h-5 w-5 transition-colors ${
                      savedDeals.has(deal.id)
                        ? "fill-[#EF4444] text-[#EF4444]"
                        : "text-[#9CA3AF]"
                    }`}
                  />
                </button>

                {/* Content */}
                <div className={`${isRTL ? 'pl-8' : 'pr-8'}`}>
                  <h3 className="mb-3 text-[#111827]" style={{ fontSize: '20px', fontWeight: 600 }}>
                    {isRTL && deal.title_ar ? deal.title_ar : deal.title}
                  </h3>
                  
                  {deal.code && (
                    <div className="mb-4">
                      <div 
                        className="text-[#111827] tracking-wide mb-3"
                        style={{ fontSize: '24px', fontWeight: 700 }}
                      >
                        {deal.code}
                      </div>
                    </div>
                  )}

                  <p className="text-[#6B7280] text-sm mb-2">
                    {isRTL && deal.description_ar ? deal.description_ar : deal.description}
                  </p>

                  <a 
                    href="#" 
                    className="text-sm text-[#5FB57A] hover:underline inline-block mb-6"
                  >
                    {t('featuredDeals.terms')}
                  </a>
                </div>

                {/* Copy Code Button */}
                <Button
                  onClick={(e) => deal.code && copyCode(deal.code, e)}
                  className="w-full bg-white text-[#111827] border-2 border-[#111827] hover:bg-[#F0F7F0] rounded-xl"
                  style={{ fontWeight: 600 }}
                >
                  <Copy className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('featuredDeals.applyCode')}
                </Button>
              </div>
            </Link>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
