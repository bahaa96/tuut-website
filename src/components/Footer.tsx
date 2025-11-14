import { useState, useEffect } from "react";
import { Facebook, Twitter, Instagram, Youtube, Mail, Tag, Smartphone, Chrome } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "../router";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { useCountry } from "../contexts/CountryContext";
import { createClient } from "../utils/supabase/client";
import { useSSRData } from "../contexts/SSRDataContext";

// TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface Deal {
  id: string | number;
  slug?: string;
  title?: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  name?: string;
  name_ar?: string;
  discount_value?: string;
  discount_percentage?: number;
  discount_amount?: number;
  stores?: any; // Could be an object or array based on the API response
  store_name?: string;
  store_name_ar?: string;
  code?: string;
  original_price?: number;
  discounted_price?: number;
}

interface Store {
  id: string;
  name: string;
  slug: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
}

interface Category {
  id: number;
  category_name?: string;
  name?: string;
  label?: string;
  title?: string;
  slug?: string;
  [key: string]: any; // Allow any other fields from the database
}

interface Product {
  id: string | number;
  name?: string;
  name_ar?: string;
  title?: string;
  title_ar?: string;
  slug?: string;
  price?: number;
  rating?: number;
  ratings_count?: number;
  image_url?: string;
  store_name?: string;
  store_name_ar?: string;
}

export function Footer() {
  const { t, isRTL } = useLanguage();
  const { country } = useCountry();
  const { data: ssrData } = useSSRData();

  // Check if SSR footer data is available
  const hasSSRData = ssrData && ssrData.footer;

  // Initialize state with SSR data if available
  const [featuredDeals, setFeaturedDeals] = useState<Deal[]>(hasSSRData ? ssrData.footer.featuredDeals || [] : []);
  const [topStores, setTopStores] = useState<Store[]>(hasSSRData ? ssrData.footer.topStores || [] : []);
  const [guides, setGuides] = useState<Article[]>(hasSSRData ? ssrData.footer.guides || [] : []);
  const [categories, setCategories] = useState<Category[]>(hasSSRData ? ssrData.footer.categories || [] : []);
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Only fetch on client side if we don't have SSR data
    if (!hasSSRData) {
      fetchFooterData();
    } else {
      // On client side, still fetch to get the most recent data
      fetchFooterData();
    }
  }, [country]);

  const fetchFooterData = async () => {
    try {
      // Fetch featured deals from Supabase
      const dealsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/featured-deals${country?.value ? `?country=${country.value}` : ''}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      
      if (dealsResponse.ok) {
        const dealsData = await dealsResponse.json();

        // Extract the actual deal data from the nested structure
        const actualDeals = (dealsData.deals || []).map(item => item.deals).filter(Boolean);
        setFeaturedDeals(actualDeals.slice(0, 5));
      } else {
        console.error('Error fetching featured deals:', dealsResponse.status);
      }

      // Fetch random 10 stores directly from Supabase
      const supabaseClient = createClient();

      try {
        let storesQuery = supabaseClient
          .from('stores')
          .select('*')
          .limit(20); // Fetch more than we need so we can randomly select

        // Apply country filter if a country is selected
        if (country) {
          // First get the country ID
          const { data: countryData } = await supabaseClient
            .from('countries')
            .select('id')
            .eq('value', country.value)
            .single();

          if (countryData) {
            storesQuery = storesQuery.eq('country_id', countryData.id);
            console.log('Filtering stores by country_id:', countryData.id);
          }
        }

        const { data: storesData, error: storesError } = await storesQuery;

        if (storesError) {
          console.error('Error fetching stores:', storesError);
          setTopStores([]);
        } else if (storesData && storesData.length > 0) {
          console.log('Fetched', storesData.length, 'stores, selecting 10 random ones');

          // Randomly select 10 stores
          const shuffled = [...storesData].sort(() => 0.5 - Math.random());
          const selectedStores = shuffled.slice(0, 10);

          setTopStores(selectedStores.map(store => ({
            id: store.id,
            name: store.name || store.store_name || store.title || 'Store',
            slug: store.slug || store.id,
          })));
        } else {
          console.log('No stores found');
          setTopStores([]);
        }
      } catch (error) {
        console.error('Error in stores fetch:', error);
        setTopStores([]);
      }

      // Fetch shopping guides (articles) from Supabase based on selected country
      if (country) {
        const articlesResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/articles?limit=8&country=${country.value}`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );
        
        if (articlesResponse.ok) {
          const articlesData = await articlesResponse.json();
          setGuides((articlesData.articles || []).slice(0, 6));
        } else {
          console.error('Error fetching articles:', articlesResponse.status);
          setGuides([]);
        }
      } else {
        // If no country is selected, fetch all articles
        const supabaseClient = createClient();
        const { data: articlesData, error: articlesError } = await supabaseClient
          .from('articles')
          .select('id, title, slug')
          .order('is_featured', { ascending: false })
          .order('published_at', { ascending: false })
          .limit(8);

        if (!articlesError && articlesData) {
          setGuides(articlesData.slice(0, 6));
        } else {
          console.error('Error fetching articles:', articlesError);
          setGuides([]);
        }
      }

      // Fetch categories from Supabase
      const supabase = createClient();
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: true })
        .limit(10);
      
      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
      } else if (categoriesData) {
        setCategories(categoriesData);
      }

      // Fetch best selling products (highest ratings_count)
      const productsUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/products${country?.value ? `?country=${country.value}&sort=ratings_count&limit=10` : '?sort=ratings_count&limit=10'}`;

      console.log('Fetching best selling products from:', productsUrl);

      try {
        const productsResponse = await fetch(productsUrl, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });

        console.log('Products response status:', productsResponse.status);

        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          console.log('Products API response:', productsData);
          console.log('Products data length:', productsData.products?.length || 0);

          if (productsData.products && productsData.products.length > 0) {
            console.log('Best selling products fetched:', productsData.products.length);
            const productsToSet = productsData.products.slice(0, 10);
            console.log('Setting bestSellingProducts to:', productsToSet);
            setBestSellingProducts(productsToSet);
          } else {
            console.log('No products found in API response');
            console.log('Full API response structure:', productsData);
          }
        } else {
          console.error('Products API error:', productsResponse.status, productsResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching best selling products:', error);
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
    }
  };
  
  const footerLinks = {
    company: [
      { label: t('footer.about'), href: "#" },
      { label: isRTL ? "كيف يعمل" : "How It Works", href: "#" },
      { label: t('footer.careers'), href: "#" },
      { label: isRTL ? "المدونة" : "Blog", href: "/guides" },
      { label: isRTL ? "سياسة الخصوصية" : "Privacy Policy", href: "/privacy" },
      { label: isRTL ? "الشروط والأحكام" : "Terms of Use", href: "/terms" },
    ],
    browse: [
      { label: isRTL ? "جميع الكوبونات" : "All Coupons", href: "/deals" },
      { label: isRTL ? "أفضل المتاجر" : "Top Stores", href: "/stores" },
      { label: isRTL ? "الفئات" : "Categories", href: "/#categories" },
      { label: isRTL ? "عروض جديدة" : "New Deals", href: "/deals" },
    ],
    support: [
      { label: t('footer.help'), href: "#" },
      { label: t('footer.faq'), href: "#" },
      { label: t('footer.contact'), href: "#" },
      { label: isRTL ? "إرسال عرض" : "Submit a Deal", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: TikTokIcon, href: "#", label: "TikTok" },
  ];

  return (
    <footer className="bg-white border-t-2 border-[#111827]">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className={`mb-12 ${isRTL ? 'text-right' : ''}`}>
          {/* Brand Section - Full Width */}
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            <div className="lg:w-1/4">
              <div className={`mb-4 ${isRTL ? 'flex justify-end' : ''}`}>
                <img
                  src="https://i.ibb.co/XZV7bXh3/Tuut.png"
                  alt="Tuut"
                  className="h-12 w-auto"
                />
              </div>
              <p className="text-[#6B7280] mb-6 max-w-[280px]">
                {t('footer.tagline')}
              </p>

              {/* Contact Info */}
              <div className="space-y-3 text-sm text-[#6B7280]">
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Mail className="h-4 w-4" />
                  <span>support@tuut.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Links Grid - 4 Columns Per Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Row 1 - 4 Columns */}
            {/* Company Links */}
            <div>
              <h3 className="mb-4 text-[#111827]" style={{ fontWeight: 600 }}>{t('footer.company')}</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    {link.href.startsWith('#') ? (
                      <a
                        href={link.href}
                        className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm underline underline-offset-2 hover:underline-offset-4"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm underline underline-offset-2 hover:underline-offset-4"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Browse Links */}
            <div>
              <h3 className="mb-4 text-[#111827]" style={{ fontWeight: 600 }}>{isRTL ? 'تصفح' : 'Browse'}</h3>
              <ul className="space-y-2">
                {footerLinks.browse.map((link, index) => (
                  <li key={index}>
                    {link.href.startsWith('/#') ? (
                      <a
                        href={link.href}
                        className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm underline underline-offset-2 hover:underline-offset-4"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm underline underline-offset-2 hover:underline-offset-4"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Featured Deals */}
            <div>
              <h3 className="mb-4 text-[#111827]" style={{ fontWeight: 600 }}>
                {t('footer.featuredDeals')}
              </h3>
              <ul className="space-y-2">
                {featuredDeals.length > 0 ? (
                  featuredDeals.slice(0, 5).map((deal) => {
                    // Get the title using multiple possible field names
                    const getTitle = () => {
                      // Try direct title fields first
                      if (isRTL) {
                        if (deal.title_ar) return deal.title_ar;
                        if (deal.name_ar) return deal.name_ar;
                        if (deal.title) return deal.title;
                        if (deal.name) return deal.name;
                      } else {
                        if (deal.title) return deal.title;
                        if (deal.name) return deal.name;
                      }

                      // Create a title from other available data
                      const storeName = isRTL
                        ? (deal.store_name_ar || deal.stores?.name_ar || deal.stores?.name || 'متجر')
                        : (deal.store_name || deal.stores?.name || deal.stores?.name_ar || 'Store');

                      const discount = deal.discount_percentage
                        ? `${deal.discount_percentage}% off`
                        : deal.discount_amount
                        ? `$${deal.discount_amount} off`
                        : deal.code
                        ? `Code: ${deal.code}`
                        : 'Special Offer';

                      return isRTL
                        ? `${discount} من ${storeName}`
                        : `${discount} at ${storeName}`;
                    };

                    const title = getTitle();

                    return (
                      <li key={deal.id}>
                        <Link
                          to={`/deal/${deal.slug || deal.id}`}
                          className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm underline underline-offset-2 hover:underline-offset-4"
                        >
                          {title}
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <li className="text-[#6B7280] text-sm">{isRTL ? 'قريباً...' : 'Coming soon...'}</li>
                )}
                {featuredDeals.length > 0 && (
                  <li className="pt-2">
                    <Link
                      to="/deals"
                      className="text-[#5FB57A] hover:text-[#4a9561] text-sm transition-colors underline underline-offset-2 hover:underline-offset-4"
                      style={{ fontWeight: 500 }}
                    >
                      {t('footer.viewAll')} {!isRTL && '→'}
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Row 2 - 3 Columns */}
            {/* Shopping Guides */}
            <div>
              <h3 className="mb-4 text-[#111827]" style={{ fontWeight: 600 }}>
                {t('footer.shoppingGuides')}
              </h3>
              <ul className="space-y-2">
                {guides.length > 0 ? (
                  <>
                    {guides.map((guide) => (
                      <li key={guide.id}>
                        <Link
                          to={`/guides/${guide.slug}`}
                          className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm line-clamp-1 underline underline-offset-2 hover:underline-offset-4"
                        >
                          {guide.title}
                        </Link>
                      </li>
                    ))}
                    <li className="pt-2">
                      <Link
                        to="/guides"
                        className="text-[#5FB57A] hover:text-[#4a9561] text-sm transition-colors underline underline-offset-2 hover:underline-offset-4"
                        style={{ fontWeight: 500 }}
                      >
                        {t('footer.viewAll')} {!isRTL && '→'}
                      </Link>
                    </li>
                  </>
                ) : (
                  <li className="text-[#6B7280] text-sm">{isRTL ? 'قريباً...' : 'Coming soon...'}</li>
                )}
              </ul>
            </div>

            {/* Top Stores */}
            <div>
              <h3 className="mb-4 text-[#111827]" style={{ fontWeight: 600 }}>
                {t('footer.topStores')}
              </h3>
              <ul className="space-y-2">
                {topStores.length > 0 ? (
                  <>
                    {topStores.map((store) => (
                      <li key={store.id}>
                        <Link
                          to={`/store/${store.slug}`}
                          className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm underline underline-offset-2 hover:underline-offset-4"
                        >
                          {store.name}
                        </Link>
                      </li>
                    ))}
                    <li className="pt-2">
                      <Link
                        to="/stores"
                        className="text-[#5FB57A] hover:text-[#4a9561] text-sm transition-colors underline underline-offset-2 hover:underline-offset-4"
                        style={{ fontWeight: 500 }}
                      >
                        {t('footer.viewAll')} {!isRTL && '→'}
                      </Link>
                    </li>
                  </>
                ) : (
                  <li className="text-[#6B7280] text-sm">{isRTL ? 'قريباً...' : 'Coming soon...'}</li>
                )}
              </ul>
            </div>

            {/* Browse by Category */}
            <div>
              <h3 className="mb-4 text-[#111827]" style={{ fontWeight: 600 }}>
                {isRTL ? 'تصفح حسب الفئة' : 'Browse by Category'}
              </h3>
              <ul className="space-y-2">
                {categories.length > 0 ? (
                  categories.map((category) => {
                    const categoryName = category.category_name || category.name || category.label || category.title || 'Category';
                    const categoryUrl = `/category/${category.slug || category.id}`;
                    return (
                      <li key={category.id}>
                        <Link
                          to={categoryUrl}
                          className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm underline underline-offset-2 hover:underline-offset-4"
                        >
                          {categoryName}
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <li className="text-[#6B7280] text-sm">{isRTL ? 'قريباً...' : 'Coming soon...'}</li>
                )}
              </ul>
            </div>

            {/* Best Selling Products */}
            <div>
              <h3 className="mb-4 text-[#111827]" style={{ fontWeight: 600 }}>
                {isRTL ? 'أفضل المنتجات مبيعًا' : 'Best Selling Products'}
              </h3>
              <ul className="space-y-2">
                {bestSellingProducts.length > 0 ? (
                  <>
                    {bestSellingProducts.map((product) => {
                      const getTitle = () => {
                        if (isRTL) {
                          return product.title_ar || product.name_ar || product.title || product.name || 'منتج';
                        }
                        return product.title || product.name || product.name_ar || product.title_ar || 'Product';
                      };

                      const title = getTitle();

                      return (
                        <li key={product.id}>
                          <Link
                            to={`/products/${product.slug || product.id}`}
                            className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm line-clamp-1 underline underline-offset-2 hover:underline-offset-4"
                          >
                            {title}
                          </Link>
                        </li>
                      );
                    })}
                    <li className="pt-2">
                      <Link
                        to="/products"
                        className="text-[#5FB57A] hover:text-[#4a9561] text-sm transition-colors underline underline-offset-2 hover:underline-offset-4"
                        style={{ fontWeight: 500 }}
                      >
                        {t('footer.viewAll')} {!isRTL && '→'}
                      </Link>
                    </li>
                  </>
                ) : (
                  <li className="text-[#6B7280] text-sm">{isRTL ? 'قريباً...' : 'Coming soon...'}</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Download Our App Section */}
        <div className="mb-8 pb-8 border-b-2 border-[#E5E7EB]">
          <div className="flex flex-col items-center">
            <h3 className="text-[#111827] mb-6 text-center" style={{ fontWeight: 600 }}>
              {t('testimonials.downloadApp')}
            </h3>
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              {/* App Store Button */}
              <a
                href="#"
                className={`group flex items-center gap-3 bg-white border-2 border-[#111827] rounded-xl px-4 py-2.5 transition-all hover:shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <svg className="w-7 h-7 text-[#111827]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className="text-xs text-[#111827]/70">{t('testimonials.downloadOn')}</div>
                  <div className="text-[#111827]" style={{ fontWeight: 600 }}>{t('testimonials.appStore')}</div>
                </div>
              </a>

              {/* Google Play Button */}
              <a
                href="#"
                className={`group flex items-center gap-3 bg-white border-2 border-[#111827] rounded-xl px-4 py-2.5 transition-all hover:shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <svg className="w-7 h-7 text-[#111827]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className="text-xs text-[#111827]/70">{t('testimonials.getItOn')}</div>
                  <div className="text-[#111827]" style={{ fontWeight: 600 }}>{t('testimonials.googlePlay')}</div>
                </div>
              </a>

              {/* Chrome Extension Button */}
              <a
                href="#"
                className={`group flex items-center gap-3 bg-white border-2 border-[#111827] rounded-xl px-4 py-2.5 transition-all hover:shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Chrome className="w-7 h-7 text-[#111827]" />
                <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className="text-xs text-[#111827]/70">{isRTL ? 'أضف إلى' : 'Add to'}</div>
                  <div className="text-[#111827]" style={{ fontWeight: 600 }}>Chrome</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8">
          <div className={`flex flex-col md:flex-row items-center justify-between gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            {/* Copyright */}
            <div className="text-sm text-[#6B7280]">
              {t('footer.copyright')}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#6B7280] mr-2">{t('footer.followUs')}</span>
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="h-10 w-10 rounded-full border-2 border-[#111827] hover:bg-[#5FB57A] flex items-center justify-center transition-colors"
                  >
                    {typeof Icon === 'function' && Icon.name === 'TikTokIcon' ? (
                      <Icon className="h-5 w-5 text-[#111827]" />
                    ) : (
                      <Icon className="h-5 w-5 text-[#111827]" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
