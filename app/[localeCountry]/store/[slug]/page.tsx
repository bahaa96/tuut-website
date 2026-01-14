import { ArrowLeft, Store, ExternalLink } from "lucide-react";
import Link from "next/link";
import { DealCard } from "@/components/DealCard";
import { Metadata } from "next";
import {
  requestFetchAllDealsByStoreId,
  requestFetchSingleStoreBySlug,
} from "@/network";
import { getCountryNameFromCode } from "@/utils/getCountryNameFromCode";
import getCurrencyFromCountryCode from "@/utils/getCurrencyFromCountryCode";
import * as m from "@/src/paraglide/messages";

interface Store {
  id: string;
  slug?: string;
  slug_en?: string;
  slug_ar?: string;
  title?: string;
  title_en?: string;
  title_ar?: string;
  store_name?: string;
  store_name_ar?: string;
  name?: string;
  name_ar?: string;
  logo_url?: string;
  profile_picture_url?: string;
  description?: string;
  description_en?: string;
  description_ar?: string;
  website_url?: string;
  redirect_url?: string;
  category?: string;
  deals?: any[];
}

interface Deal {
  id: number;
  title: string;
  title_ar?: string;
  title_en?: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  discount_percentage?: number;
  discount_amount?: number;
  original_price?: number;
  discounted_price?: number;
  code?: string;
  store_id?: string;
  store_slug?: string;
  store_name?: string;
  store_logo?: string;
  category_name?: string;
  expires_at?: string;
  is_verified?: boolean;
  featured?: boolean;
  slug_en?: string;
  slug_ar?: string;
}

interface StoreDetailPageProps {
  params: Promise<{
    localeCountry: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: StoreDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { localeCountry, slug } = resolvedParams;

  // Extract language from localeCountry (e.g., "en-EG" -> "en")
  const language = localeCountry.split("-")[0];
  const country = localeCountry.split("-")[1];
  const isArabic = language === "ar";

  // Fetch store data for metadata
  const { data: store } = await requestFetchSingleStoreBySlug({ slug });

  if (!store) {
    return {
      title: isArabic ? "المتجر غير موجود | Tuut" : "Store Not Found | Tuut",
      description: isArabic
        ? "هذا المتجر غير متوفر حالياً"
        : "This store is currently unavailable",
    };
  }

  const storeName =
    isArabic && store.title_ar ? store.title_ar : store.title_en;
  const storeDescription =
    isArabic && store.description_ar
      ? store.description_ar
      : store.description_en;

  // Create SEO-optimized title
  const title = storeName
    ? `${storeName} | ${
        isArabic ? "العروض والخصومات" : "Deals and Discounts"
      } | Tuut`
    : `${isArabic ? "عروض المتجر" : "Store Deals"} | Tuut`;

  // Create SEO-optimized description
  let description = "";
  if (storeDescription) {
    description =
      storeDescription.length > 160
        ? storeDescription.substring(0, 157) + "..."
        : storeDescription;
  } else if (storeName) {
    description = isArabic
      ? `اكتشف أحدث العروض والخصومات من ${storeName}. أفضل الصفقات والعروض الحصرية في ${getCountryNameFromCode(
          country
        )}.`
      : `Discover latest deals and discounts from ${storeName}. Best offers and exclusive deals in ${getCountryNameFromCode(
          country
        )}.`;
  } else {
    description = isArabic
      ? `استعرض أفضل العروض والخصومات من المتاجر الرائدة في ${getCountryNameFromCode(
          country
        )}.`
      : `Browse best deals and discounts from leading stores in ${getCountryNameFromCode(
          country
        )}.`;
  }

  return {
    title,
    description,
    keywords: [
      storeName,
      isArabic ? "عروض" : "deals",
      isArabic ? "خصومات" : "discounts",
      isArabic ? "تخفيضات" : "coupons",
      isArabic ? "متجر" : "store",
      isArabic ? "تسوق" : "shopping",
      store?.category,
      country,
      isArabic ? "عروض حصرية" : "exclusive offers",
      isArabic ? "توفير المال" : "money saving",
    ]
      .filter(Boolean)
      .join(", "),
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://tuut.shop/${localeCountry}/store/${slug}/`,
      siteName: "Tuut",
      images: store.profile_picture_url
        ? [
            {
              url: store.profile_picture_url,
              width: 1200,
              height: 630,
              alt: `${storeName} ${isArabic ? "شعار" : "logo"}`,
            },
          ]
        : [],
      locale: localeCountry,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: store.profile_picture_url ? [store.profile_picture_url] : [],
    },
    alternates: {
      canonical: `https://tuut.shop/${localeCountry}/store/${slug}/`,
      languages: {
        [localeCountry]: `https://tuut.shop/${localeCountry}/store/${slug}/`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function StoreDetailPage({
  params,
}: StoreDetailPageProps) {
  // Await params as required by Next.js 15
  const resolvedParams = await params;

  // Extract country from localeCountry (e.g., "en-EG" -> "EG")
  const countrySlug = resolvedParams.localeCountry.split("-")[1];
  const language = resolvedParams.localeCountry.split("-")[0];
  const isRTL = language === "ar";
  const storeSlug = resolvedParams.slug;

  const { data: storeData } = await requestFetchSingleStoreBySlug({
    slug: storeSlug,
  });

  const { data: deals } = await requestFetchAllDealsByStoreId({
    storeId: storeData.id,
    countrySlug: countrySlug,
    currentPage: 1,
    pageSize: 10,
  });

  const storeName = isRTL ? storeData.title_ar : storeData.title_en;
  const storeDescription =
    isRTL && storeData.description_ar
      ? storeData.description_ar
      : storeData.description_en;

  // Generate JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `https://tuut.shop/${resolvedParams.localeCountry}/store/${resolvedParams.slug}/`,
    name: storeName,
    description: storeDescription,
    url: storeData.redirect_url,
    image: storeData.profile_picture_url,
    category: storeData.category,
    address: {
      "@type": "Country",
      name: getCountryNameFromCode(countrySlug),
    },
    offers: deals.map((deal) => ({
      "@type": "Offer",
      name: isRTL ? deal.title_ar : deal.title_en,
      description: isRTL ? deal.description_ar : deal.description_en,
      discount: deal.discount_percentage
        ? `${deal.discount_percentage}%`
        : undefined,
      price: deal.discounted_price,
      priceCurrency: getCurrencyFromCountryCode(countrySlug),
      availability: "https://schema.org/InStock",
      validThrough: deal.expires_at,
    })),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://tuut.shop/${resolvedParams.localeCountry}/store/${resolvedParams.slug}/`,
    },
  };

  // Generate breadcrumb structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isRTL ? "الرئيسية" : "Home",
        item: `https://tuut.shop/${resolvedParams.localeCountry}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isRTL ? "المتاجر" : "Stores",
        item: `https://tuut.shop/${resolvedParams.localeCountry}/stores/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: storeName,
        item: `https://tuut.shop/${resolvedParams.localeCountry}/store/${resolvedParams.slug}/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <section className="py-12 md:py-16 bg-[#E8F3E8] min-h-screen">
        <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/stores"
            className="inline-flex items-center text-[#5FB57A] hover:text-[#4FA669] mb-8 transition-colors"
          >
            <ArrowLeft
              className={`h-5 w-5 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`}
            />
            {isRTL ? "العودة إلى جميع المتاجر" : "Back to All Stores"}
          </Link>

          {/* Store Header Card */}
          <div className="bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-8 mb-8">
            <div
              className={`flex flex-col md:flex-row items-start gap-6 ${
                isRTL ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Store Logo */}
              {storeData.profile_picture_url ? (
                <img
                  src={storeData.profile_picture_url}
                  alt={`${storeName} ${m.STORE_LOGO()}`}
                  className="h-24 w-24 object-contain rounded-xl bg-[#F9FAFB] p-4 border-2 border-[#E5E7EB]"
                />
              ) : (
                <div className="h-24 w-24 rounded-xl bg-[#E8F3E8] border-2 border-[#111827] flex items-center justify-center">
                  <Store className="h-12 w-12 text-[#5FB57A]" />
                </div>
              )}

              {/* Store Info */}
              <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                <h1
                  className="text-[#111827] mb-3"
                  style={{ fontSize: "32px", fontWeight: 700 }}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {storeName}
                </h1>

                {storeDescription && (
                  <p
                    className="text-[#6B7280] mb-4"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    {storeDescription}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  {storeData.category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#E8F3E8] text-[#5FB57A] text-sm border-2 border-[#5FB57A]">
                      {storeData.category}
                    </span>
                  )}

                  {storeData.redirect_url && (
                    <a
                      href={storeData.redirect_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-[#5FB57A] text-white border-2 border-[#111827] shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                      <ExternalLink
                        className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                      />
                      {isRTL ? "زيارة المتجر" : "Visit Store"}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Deals Section */}
          <div className={`mb-6 ${isRTL ? "text-right" : "text-left"}`}>
            <h2
              className="text-[#111827]"
              style={{ fontSize: "24px", fontWeight: 700 }}
            >
              {isRTL
                ? `جميع العروض (${deals.length})`
                : `All Deals (${deals.length})`}
            </h2>
          </div>

          {/* Deals Grid */}
          {deals.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
              <p className="text-[#6B7280]" style={{ fontSize: "18px" }}>
                {isRTL
                  ? "لا توجد عروض متاحة حالياً"
                  : "No deals available at the moment"}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} isRTL={isRTL} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
