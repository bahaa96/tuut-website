import {
  requestFetchAllFeaturedDeals,
  requestFetchAllStores,
  requestFetchAllArticles,
  requestFetchAllCategories,
  requestFetchAllProducts,
} from "@/network";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Chrome,
} from "lucide-react";
import Link from "next/link";
import * as m from "../src/paraglide/messages.js";
import DealsClient from "@/app/[localeCountry]/deals/DealsClient.js";
import { localizedRoute } from "@/utils/localizedRoute";

// TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

interface FooterProps {
  isRTL: boolean;
}

const Footer = async ({ isRTL }: FooterProps) => {
  const { data: featuredDeals } = await requestFetchAllFeaturedDeals({
    countrySlug: "EG", // TODO: Replace with countrySlug
    currentPage: 1,
    pageSize: 5,
  });

  const { data: topStores } = await requestFetchAllStores({
    countrySlug: "EG", // TODO: Replace with countrySlug
    currentPage: 1,
    pageSize: 10,
  });

  const { data: featuredArticles } = await requestFetchAllArticles({
    countrySlug: "EG", // TODO: Replace with countrySlug
    currentPage: 1,
    pageSize: 5,
  });

  const { data: featuredCategories } = await requestFetchAllCategories({
    currentPage: 1,
    pageSize: 10,
  });

  const { data: bestSellingProducts } = await requestFetchAllProducts({
    countrySlug: "EG", // TODO: Replace with countrySlug
    currentPage: 1,
    pageSize: 10,
  });

  const footerLinks = {
    company: [
      { label: m.ABOUT(), href: "#" },
      { label: m.HOW_IT_WORKS(), href: "#" },
      { label: m.CAREERS(), href: "#" },
      { label: m.BLOG(), href: "/guides" },
      { label: m.PRIVACY_POLICY(), href: "/privacy" },
      { label: m.TERMS_OF_USE(), href: "/terms" },
    ],
    browse: [
      { label: m.ALL_COUPONS(), href: "/deals" },
      { label: m.TOP_STORES(), href: "/stores" },
      { label: m.CATEGORIES(), href: "/categories" },
      { label: m.NEW_DEALS(), href: "/deals" },
    ],
    support: [
      { label: m.HELP(), href: "#" },
      { label: m.FAQ(), href: "#" },
      { label: m.CONTACT(), href: "#" },
      { label: m.SUBMIT_A_DEAL(), href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: m.FACEBOOK() },
    { icon: Twitter, href: "#", label: m.TWITTER() },
    { icon: Instagram, href: "#", label: m.INSTAGRAM() },
    { icon: Youtube, href: "#", label: m.YOUTUBE() },
    { icon: TikTokIcon, href: "#", label: m.TIKTOK() },
  ];

  return (
    <footer className="bg-white border-t-2 border-[#111827]">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className={`mb-12 ${isRTL ? "text-right" : ""}`}>
          {/* Brand Section - Full Width */}
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            <div className="lg:w-1/4">
              <div className={`mb-4 ${isRTL ? "flex justify-end" : ""}`}>
                <img
                  src="https://i.ibb.co/XZV7bXh3/Tuut.png"
                  alt={m.TUUT()}
                  className="h-12 w-auto"
                />
              </div>
              <p className="text-[#6B7280] mb-6 max-w-[280px]">
                {m.DISCOVER_THE_BEST_DEALS_AND_DISCOUNTS_AT_YOUR_FAVORITE_STORES()}
              </p>

              {/* Contact Info */}
              <div className="space-y-3 text-sm text-[#6B7280]">
                <div
                  className={`flex items-center gap-2 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
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
              <h3 className="mb-4 text-[#111827]" style={{ fontWeight: 600 }}>
                {m.COMPANY()}
              </h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    {link.href.startsWith("#") ? (
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
              <h3 className="mb-4 text-[#111827]" style={{ fontWeight: 600 }}>
                {m.BROWSE()}
              </h3>
              <ul className="space-y-2">
                {footerLinks.browse.map((link, index) => (
                  <li key={index}>
                    {link.href.startsWith("/#") ? (
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
                {m.FEATURED_DEALS()}
              </h3>
              <ul className="space-y-2">
                {featuredDeals.length > 0 ? (
                  featuredDeals.map((deal) => {
                    return (
                      <li key={deal.id}>
                        <Link
                          href={localizedRoute(
                            `/deal/${
                              isRTL ? deal.deals.slug_ar : deal.deals.slug_en
                            }`
                          )}
                          className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm hover:underline"
                        >
                          {isRTL ? deal.deals.title_ar : deal.deals.title_en}
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <li className="text-[#6B7280] text-sm">{m.COMING_SOON()}</li>
                )}
                {featuredDeals.length > 0 && (
                  <li className="pt-2">
                    <Link
                      href={localizedRoute("/deals")}
                      className="text-[#5FB57A] hover:text-[#4a9561] text-sm transition-colors hover:underline"
                      style={{ fontWeight: 500 }}
                    >
                      {m.VIEW_ALL()} {!isRTL ? "→" : "←"}
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Row 2 - 3 Columns */}
            {/* Shopping Guides */}
            <div>
              <h3 className="mb-4 text-[#111827]" style={{ fontWeight: 600 }}>
                {m.SHOPPING_GUIDES()}
              </h3>
              <ul className="space-y-2">
                {featuredArticles.length > 0 ? (
                  <>
                    {featuredArticles.map((article) => (
                      <li key={article.id}>
                        <Link
                          href={localizedRoute(`/guides/${article.slug}`)}
                          className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm line-clamp-1 hover:underline"
                        >
                          {article.title}
                        </Link>
                      </li>
                    ))}
                    <li className="pt-2">
                      <Link
                        href={localizedRoute("/guides")}
                        className="text-[#5FB57A] hover:text-[#4a9561] text-sm transition-colors hover:underline"
                        style={{ fontWeight: 500 }}
                      >
                        {m.VIEW_ALL()} {!isRTL ? "→" : "←"}
                      </Link>
                    </li>
                  </>
                ) : (
                  <li className="text-[#6B7280] text-sm">{m.COMING_SOON()}</li>
                )}
              </ul>
            </div>

            {/* Top Stores */}
            <div>
              <h3 className="mb-4 text-[#111827]" style={{ fontWeight: 600 }}>
                {m.TOP_STORES()}
              </h3>
              <ul className="space-y-2">
                {topStores.length > 0 ? (
                  <>
                    {topStores.map((store) => (
                      <li key={store.id}>
                        <Link
                          href={localizedRoute(
                            `/store/${isRTL ? store.slug_ar : store.slug_en}`
                          )}
                          className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm hover:underline"
                        >
                          {isRTL ? store.title_ar : store.title_en}
                        </Link>
                      </li>
                    ))}
                    <li className="pt-2">
                      <Link
                        href={localizedRoute("/stores")}
                        className="text-[#5FB57A] hover:text-[#4a9561] text-sm transition-colors hover:underline"
                        style={{ fontWeight: 500 }}
                      >
                        {m.VIEW_ALL()} {!isRTL ? "→" : "←"}
                      </Link>
                    </li>
                  </>
                ) : (
                  <li className="text-[#6B7280] text-sm">{m.COMING_SOON()}</li>
                )}
              </ul>
            </div>

            {/* Browse by Category */}
            <div>
              <h3 className="mb-4 text-[#111827]" style={{ fontWeight: 600 }}>
                {m.BROWSE_BY_CATEGORY()}
              </h3>
              <ul className="space-y-2">
                {featuredCategories.length > 0 ? (
                  featuredCategories.map((category) => {
                    return (
                      <li key={category.id}>
                        <Link
                          href={localizedRoute(
                            `/category/${
                              isRTL ? category.slug_ar : category.slug_en
                            }`
                          )}
                          className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm hover:underline"
                        >
                          {isRTL ? category.title_ar : category.title_en}
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <li className="text-[#6B7280] text-sm">{m.COMING_SOON()}</li>
                )}
              </ul>
            </div>

            {/* Best Selling Products */}
            <div>
              <h3 className="mb-4 text-[#111827]" style={{ fontWeight: 600 }}>
                {m.BEST_SELLING_PRODUCTS()}
              </h3>
              <ul className="space-y-2">
                {bestSellingProducts.length > 0 ? (
                  <>
                    {bestSellingProducts.map((product) => {
                      return (
                        <li key={product.id}>
                          <Link
                            href={localizedRoute(`/products/${product.slug}`)}
                            className="text-[#6B7280] hover:text-[#111827] transition-colors text-sm line-clamp-1 hover:underline"
                          >
                            {product.title}
                          </Link>
                        </li>
                      );
                    })}
                    <li className="pt-2">
                      <Link
                        href={localizedRoute("/products")}
                        className="text-[#5FB57A] hover:text-[#4a9561] text-sm transition-colors hover:underline"
                        style={{ fontWeight: 500 }}
                      >
                        {m.VIEW_ALL()} {!isRTL ? "→" : "←"}
                      </Link>
                    </li>
                  </>
                ) : (
                  <li className="text-[#6B7280] text-sm">{m.COMING_SOON()}</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Download Our App Section */}
        <div className="mb-8 pb-8 border-b-2 border-[#E5E7EB]">
          <div className="flex flex-col items-center">
            <h3
              className="text-[#111827] mb-6 text-center"
              style={{ fontWeight: 600 }}
            >
              {m.DOWNLOAD_OUR_APP()}
            </h3>
            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${
                isRTL ? "sm:flex-row-reverse" : ""
              }`}
            >
              {/* App Store Button */}
              <a
                href="#"
                className={`group flex items-center gap-3 bg-white border-2 border-[#111827] rounded-xl px-4 py-2.5 transition-all hover:shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <svg
                  className="w-7 h-7 text-[#111827]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className={`${isRTL ? "text-right" : "text-left"}`}>
                  <div className="text-xs text-[#111827]/70">
                    {m.DOWNLOAD_ON()}
                  </div>
                  <div className="text-[#111827]" style={{ fontWeight: 600 }}>
                    {m.APP_STORE()}
                  </div>
                </div>
              </a>

              {/* Google Play Button */}
              <a
                href="#"
                className={`group flex items-center gap-3 bg-white border-2 border-[#111827] rounded-xl px-4 py-2.5 transition-all hover:shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <svg
                  className="w-7 h-7 text-[#111827]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className={`${isRTL ? "text-right" : "text-left"}`}>
                  <div className="text-xs text-[#111827]/70">
                    {m.GET_IT_ON()}
                  </div>
                  <div className="text-[#111827]" style={{ fontWeight: 600 }}>
                    {m.GOOGLE_PLAY()}
                  </div>
                </div>
              </a>

              {/* Chrome Extension Button */}
              <a
                href="#"
                className={`group flex items-center gap-3 bg-white border-2 border-[#111827] rounded-xl px-4 py-2.5 transition-all hover:shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Chrome className="w-7 h-7 text-[#111827]" />
                <div className={`${isRTL ? "text-right" : "text-left"}`}>
                  <div className="text-xs text-[#111827]/70">{m.ADD_TO()}</div>
                  <div className="text-[#111827]" style={{ fontWeight: 600 }}>
                    {m.CHROME()}
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8">
          <div
            className={`flex flex-col md:flex-row items-center justify-between gap-4 ${
              isRTL ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Copyright */}
            <div className="text-sm text-[#6B7280]">{m.COPYRIGHT()}</div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#6B7280] mr-2">
                {m.FOLLOW_US()}
              </span>
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="h-10 w-10 rounded-full border-2 border-[#111827] hover:bg-[#5FB57A] flex items-center justify-center transition-colors"
                  >
                    {typeof Icon === "function" &&
                    Icon.name === "TikTokIcon" ? (
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
};

export default Footer;
