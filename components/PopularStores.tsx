import { Store as StoreIcon, ArrowRight, Tag } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useCountry } from "../contexts/CountryContext";
import { getCountryValue } from "../utils/countryHelpers";
import Link from "next/link";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Store {
  id: string;
  name?: string;
  store_name?: string;
  title?: string;
  name_ar?: string;
  store_name_ar?: string;
  logo?: string;
  logo_url?: string;
  image_url?: string;
  profile_image?: string;
  profile_image_url?: string;
  profile_picture_url?: string;
  banner_image?: string;
  cover_image?: string;
  slug?: string;
  deals_count?: number;
  active_deals_count?: number;
  total_offers?: number;
}

export function PopularStores() {
  const { t, isRTL, language } = useLanguage();
  const { country } = useCountry();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, [country, language]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const countryValue = getCountryValue(country);
      
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      const url = countryValue 
        ? `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/stores?country=${countryValue}&limit=8`
        : `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/stores?limit=8`;
      
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
      }
    } catch (err) {
      console.error('Error fetching stores:', err);
    } finally {
      setLoading(false);
    }
  };

  function getStoreName(store: Store): string {
    if (language === 'ar') {
      return store.name_ar || store.store_name_ar || store.name || store.store_name || store.title || 'Store';
    }
    return store.name || store.store_name || store.title || 'Store';
  }

  function getStoreLogo(store: Store): string {
    return store.profile_picture_url || store.logo || store.logo_url || store.image_url || '';
  }

  function getStoreSlug(store: Store): string {
    const name = store.name || store.store_name || store.title || '';
    return store.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function getDealsCount(store: Store): number {
    return store.total_offers || store.active_deals_count || store.deals_count || 0;
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div className={`flex items-center justify-between mb-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className="mb-2 text-[#111827]" style={{ fontSize: '36px', fontWeight: 700 }}>
              {language === 'en' ? 'Popular Stores' : 'المتاجر الشائعة'}
            </h2>
            <p className="text-[#6B7280]">
              {language === 'en' 
                ? 'Shop from your favorite brands and save more'
                : 'تسوق من علاماتك التجارية المفضلة ووفر أكثر'
              }
            </p>
          </div>
          <Link href="/stores">
            <Button 
              variant="outline" 
              className={`hidden md:flex border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {language === 'en' ? 'View All Stores' : 'عرض جميع المتاجر'}
              <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-100 rounded-xl border-2 border-[#E5E7EB] animate-pulse"
              />
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-12">
            <StoreIcon className="h-12 w-12 text-[#9CA3AF] mx-auto mb-4" />
            <p className="text-[#6B7280]">
              {language === 'en' ? 'No stores available' : 'لا توجد متاجر متاحة'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {stores.map((store) => {
                const name = getStoreName(store);
                const logo = getStoreLogo(store);
                const slug = getStoreSlug(store);
                const dealsCount = getDealsCount(store);

                return (
                  <Link key={store.id} href={`/store/${slug}`}>
                    <div className="group bg-white rounded-xl border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all p-6 text-center">
                      <div className="h-16 w-16 mx-auto mb-4 rounded-lg border-2 border-[#E5E7EB] bg-white overflow-hidden flex items-center justify-center">
                        {logo ? (
                          <ImageWithFallback
                            src={logo}
                            alt={name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <StoreIcon className="h-8 w-8 text-[#9CA3AF]" />
                        )}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 600 }} className="text-[#111827] mb-2 line-clamp-1">
                        {name}
                      </div>
                      <div className="text-xs text-[#5FB57A] flex items-center justify-center gap-1">
                        <Tag className="h-3 w-3" />
                        {dealsCount} {language === 'en' ? 'deals' : 'عروض'}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile View All Button */}
            <div className="mt-8 flex justify-center md:hidden">
              <Link href="/stores">
                <Button 
                  variant="outline" 
                  className={`border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  {language === 'en' ? 'View All Stores' : 'عرض جميع المتاجر'}
                  <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
