import { Facebook, Twitter, Instagram, Youtube, Mail, Tag, Smartphone, Chrome } from "lucide-react";
import Link from "next/link";

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
  discount_percentage?: number;
  code?: string;
  store_name?: string;
  store_slug?: string;
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
  [key: string]: any;
}

interface Product {
  id: string | number;
  title?: string;
  title_ar?: string;
  name?: string;
  name_ar?: string;
  slug?: string;
  price?: number;
  rating?: number;
  ratings_count?: number;
  image_url?: string;
  store_name?: string;
  store_name_ar?: string;
}

interface TranslationKeys {
  footer: {
    about: string;
    careers: string;
    help: string;
    faq: string;
    contact: string;
    company: string;
    featuredDeals: string;
    shoppingGuides: string;
    topStores: string;
    viewAll: string;
    tagline: string;
    copyright: string;
    followUs: string;
  };
  testimonials: {
    downloadApp: string;
    downloadOn: string;
    appStore: string;
    getItOn: string;
    googlePlay: string;
  };
}

interface FooterProps {
  featuredDeals?: Deal[];
  topStores?: Store[];
  articles?: Article[];
  categories?: Category[];
  bestSellingProducts?: Product[];
  translations: TranslationKeys;
  isRTL: boolean;
}

export function Footer({
  featuredDeals = [],
  topStores = [],
  articles = [],
  categories = [],
  bestSellingProducts = [],
  translations,
  isRTL
}: FooterProps) {
  const { t, footer: ft, testimonials: tt } = translations;

  const footerLinks = {
    company: [
      { label: ft.about, href: "#" },
      { label: isRTL ? "كيف يعمل" : "How It Works", href: "#" },
      { label: ft.careers, href: "#" },
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
      { label: ft.help, href: "#" },
      { label: ft.faq, href: "#" },
      { label: ft.contact, href: "#" },
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
                {ft.tagline}
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
              <h3 className="mb-4 text-[#111827]" style={{ fontWeight: 600 }}>{ft.company}</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    {link.href.startsWith('#') ? (
                      <a
                        href={link.href}
                        className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm hover:underline"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm hover:underline"
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
                        className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm hover:underline"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm hover:underline"
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
                {ft.featuredDeals}
              </h3>
              <ul className="space-y-2">
                {featuredDeals.length > 0 ? (
                  featuredDeals.slice(0, 5).map((deal) => {
                    const getTitle = () => {
                      if (isRTL) {
                        if (deal.title_ar) return deal.title_ar;
                        if (deal.title) return deal.title;
                      } else {
                        if (deal.title) return deal.title;
                      }

                      const storeName = isRTL
                        ? deal.store_name || 'متجر'
                        : deal.store_name || 'Store';

                      const discount = deal.discount_percentage
                        ? `${deal.discount_percentage}% off`
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
                          href={`/deal/${deal.slug || deal.id}`}
                          className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm hover:underline"
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
                      href="/deals"
                      className="text-[#5FB57A] hover:text-[#4a9561] text-sm transition-colors hover:underline"
                      style={{ fontWeight: 500 }}
                    >
                      {ft.viewAll} {!isRTL && '→'}
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Row 2 - 3 Columns */}
            {/* Shopping Guides */}
            <div>
              <h3 className="mb-4 text-[#111827]" style={{ fontWeight: 600 }}>
                {ft.shoppingGuides}
              </h3>
              <ul className="space-y-2">
                {articles.length > 0 ? (
                  <>
                    {articles.map((guide) => (
                      <li key={guide.id}>
                        <Link
                          href={`/guides/${guide.slug}`}
                          className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm line-clamp-1 hover:underline"
                        >
                          {guide.title}
                        </Link>
                      </li>
                    ))}
                    <li className="pt-2">
                      <Link
                        href="/guides"
                        className="text-[#5FB57A] hover:text-[#4a9561] text-sm transition-colors hover:underline"
                        style={{ fontWeight: 500 }}
                      >
                        {ft.viewAll} {!isRTL && '→'}
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
                {ft.topStores}
              </h3>
              <ul className="space-y-2">
                {topStores.length > 0 ? (
                  <>
                    {topStores.map((store) => (
                      <li key={store.id}>
                        <Link
                          href={`/store/${store.slug}`}
                          className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm hover:underline"
                        >
                          {store.name}
                        </Link>
                      </li>
                    ))}
                    <li className="pt-2">
                      <Link
                        href="/stores"
                        className="text-[#5FB57A] hover:text-[#4a9561] text-sm transition-colors hover:underline"
                        style={{ fontWeight: 500 }}
                      >
                        {ft.viewAll} {!isRTL && '→'}
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
                          href={categoryUrl}
                          className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm hover:underline"
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
                            href={`/products/${product.slug || product.id}`}
                            className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm line-clamp-1 hover:underline"
                          >
                            {title}
                          </Link>
                        </li>
                      );
                    })}
                    <li className="pt-2">
                      <Link
                        href="/products"
                        className="text-[#5FB57A] hover:text-[#4a9561] text-sm transition-colors hover:underline"
                        style={{ fontWeight: 500 }}
                      >
                        {ft.viewAll} {!isRTL && '→'}
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
              {tt.downloadApp}
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
                  <div className="text-xs text-[#111827]/70">{tt.downloadOn}</div>
                  <div className="text-[#111827]" style={{ fontWeight: 600 }}>{tt.appStore}</div>
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
                  <div className="text-xs text-[#111827]/70">{tt.getItOn}</div>
                  <div className="text-[#111827]" style={{ fontWeight: 600 }}>{tt.googlePlay}</div>
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
              {ft.copyright}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#6B7280] mr-2">{ft.followUs}</span>
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