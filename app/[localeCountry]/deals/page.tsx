import DealsClientPage from "./DealsClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Deal } from "@/domain-models";
import { Metadata } from "next";
import { getCountryNameFromCode } from "@/utils/getCountryNameFromCode";
import { requestFetchAllDeals } from "@/network/deals";
import * as m from "@/src/paraglide/messages";
import getCurrencyFromCountryCode from "@/utils/getCurrencyFromCountryCode";
import { headers } from "next/headers";

interface DealsPageProps {
  params: Promise<{
    localeCountry: string;
  }>;
  searchParams: Promise<{
    search?: string;
    category?: string;
    store?: string;
    sort?: string;
    min_discount?: string;
    max_discount?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: DealsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const localeCountry = resolvedParams.localeCountry;

  // Extract language and country from localeCountry (e.g., "en-EG" -> "en", "EG")
  const language = localeCountry.split("-")[0];
  const countrySlug = localeCountry.split("-")[1];
  const isArabic = language === "ar";

  // Fetch deals count for metadata
  let dealsCount = 0;
  try {
    const { data: allDeals } = await requestFetchAllDeals({
      countrySlug: countrySlug,
      currentPage: 1,
      pageSize: 20,
    });

    dealsCount = allDeals.length;
  } catch (error) {
    console.error("Error fetching deals count for metadata:", error);
  }

  const countryName = getCountryNameFromCode(countrySlug);
  const currentPage = parseInt(resolvedSearchParams.page || "1");

  // Build page title and description based on filters
  let title: string;
  let description: string;

  const baseTitle = isArabic ? "جميع العروض" : "All Deals";
  const siteName = "Tuut";

  // Create filter descriptions
  const filterParts: string[] = [];

  if (resolvedSearchParams.search) {
    filterParts.push(isArabic ? `بحث: "${resolvedSearchParams.search}"` : `Search: "${resolvedSearchParams.search}"`);
  }

  if (resolvedSearchParams.category) {
    filterParts.push(isArabic ? `الفئة: ${resolvedSearchParams.category}` : `Category: ${resolvedSearchParams.category}`);
  }

  if (resolvedSearchParams.store) {
    filterParts.push(isArabic ? `المتجر: ${resolvedSearchParams.store}` : `Store: ${resolvedSearchParams.store}`);
  }

  if (resolvedSearchParams.min_discount) {
    filterParts.push(isArabic ? `خصم من: ${resolvedSearchParams.min_discount}%` : `Min Discount: ${resolvedSearchParams.min_discount}%`);
  }

  if (resolvedSearchParams.max_discount) {
    filterParts.push(isArabic ? `خصم حتى: ${resolvedSearchParams.max_discount}%` : `Max Discount: ${resolvedSearchParams.max_discount}%`);
  }

  // Build title
  if (filterParts.length > 0) {
    const filterString = filterParts.join(" | ");
    title = isArabic
      ? `${filterString} | ${baseTitle} في ${countryName} | ${siteName}`
      : `${filterString} | ${baseTitle} in ${countryName} | ${siteName}`;
  } else {
    title = isArabic
      ? `${baseTitle} في ${countryName} | ${siteName}`
      : `${baseTitle} in ${countryName} | ${siteName}`;
  }

  // Add pagination to title
  if (currentPage > 1) {
    title = isArabic
      ? `${title} - الصفحة ${currentPage}`
      : `${title} - Page ${currentPage}`;
  }

  // Build description
  description = isArabic
    ? `استعرض ${dealsCount} عرض في ${countryName}. اكتشف أفضل الخصومات والكوبونات والعروض الحصرية. وفّر المال مع Tuut.`
    : `Browse ${dealsCount} deals in ${countryName}. Discover the best discounts, coupons, and exclusive offers. Save money with Tuut.`;

  // Add filter context to description
  if (filterParts.length > 0) {
    const filterContext = isArabic
      ? `النتائج لـ: ${filterParts.join(", ")}`
      : `Results for: ${filterParts.join(", ")}`;
    description = `${filterContext}. ${description}`;
  }

  // Build canonical URL
  const baseUrl = `https://tuut.shop/${localeCountry}/deals`;
  const searchParamsString = new URLSearchParams(resolvedSearchParams).toString();
  const canonicalUrl = searchParamsString
    ? `${baseUrl}?${searchParamsString}`
    : baseUrl;

  // Generate keywords
  const baseKeywords = [
    isArabic ? "عروض" : "deals",
    isArabic ? "خصومات" : "discounts",
    isArabic ? "كوبونات" : "coupons",
    isArabic ? "عروض حصرية" : "exclusive offers",
    isArabic ? "توفير المال" : "save money",
    isArabic ? "تسوق" : "shopping",
    countryName,
    isArabic ? "صفقات" : "bargains",
    isArabic ? "عروض مميزة" : "special deals",
  ];

  // Add filter-specific keywords
  if (resolvedSearchParams.category) {
    baseKeywords.push(resolvedSearchParams.category);
  }
  if (resolvedSearchParams.store) {
    baseKeywords.push(resolvedSearchParams.store);
  }
  if (resolvedSearchParams.search) {
    baseKeywords.push(resolvedSearchParams.search);
  }

  // Build pagination rel tags
  const other: Record<string, { rel: string; href: string }> = {};
  const pageSize = 20;
  const totalPages = Math.ceil(dealsCount / pageSize);

  if (currentPage > 1) {
    const prevSearchParams = { ...resolvedSearchParams };
    if (currentPage === 2) {
      delete prevSearchParams.page;
    } else {
      prevSearchParams.page = (currentPage - 1).toString();
    }
    const prevQueryString = new URLSearchParams(prevSearchParams).toString();
    other.prev = {
      rel: "prev",
      href: prevQueryString ? `${baseUrl}?${prevQueryString}` : baseUrl,
    };
  }

  if (currentPage < totalPages) {
    const nextSearchParams = { ...resolvedSearchParams, page: (currentPage + 1).toString() };
    const nextQueryString = new URLSearchParams(nextSearchParams).toString();
    other.next = {
      rel: "next",
      href: `${baseUrl}?${nextQueryString}`,
    };
  }

  return {
    title,
    description,
    keywords: baseKeywords.join(", "),
    authors: [{ name: "Tuut" }],
    creator: "Tuut",
    publisher: "Tuut",
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
    alternates: {
      canonical: canonicalUrl,
      languages: generateHreflangTags(localeCountry, resolvedSearchParams),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: "Tuut",
      images: [
        {
          url: "https://tuut.shop/og-deals.jpg",
          width: 1200,
          height: 630,
          alt: isArabic ? "جميع العروض في Tuut" : "All Deals on Tuut",
          type: "image/jpeg",
        },
      ],
      locale: localeCountry,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://tuut.shop/og-deals.jpg"],
      creator: "@tuutapp",
      site: "@tuutapp",
    },
    other: Object.keys(other).length > 0 ? other : undefined,
  };
}

function generateHreflangTags(
  localeCountry: string,
  searchParams: Record<string, string | undefined>
): Record<string, string> {
  const languages = ["en", "ar"];
  const hreflangs: Record<string, string> = {};

  const searchParamsString = new URLSearchParams(searchParams).toString();

  // Generate combinations for the current country
  languages.forEach(lang => {
    const locale = `${lang}-${localeCountry.split("-")[1]}`;
    hreflangs[locale] = `https://tuut.shop/${locale}/deals${searchParamsString ? `?${searchParamsString}` : ''}`;
  });

  // Default language
  hreflangs["x-default"] = `https://tuut.shop/en-${localeCountry.split("-")[1]}/deals${searchParamsString ? `?${searchParamsString}` : ''}`;

  return hreflangs;
}

export default async function DealsPage({ params, searchParams }: DealsPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Extract country from localeCountry (e.g., "en-EG" -> "EG")
  const countrySlug = resolvedParams.localeCountry.split("-")[1];
  const language = resolvedParams.localeCountry.split("-")[0];
  const isRTL = language === "ar";

  let deals: Deal[] = [];

  try {
    const { data: allDeals } = await requestFetchAllDeals({
      countrySlug: countrySlug,
      currentPage: 1,
      pageSize: 20,
    });

    deals = allDeals;
  } catch (error) {
    console.error("Error fetching deals data:", error);
  }

  const countryName = getCountryNameFromCode(countrySlug);

  // Generate JSON-LD structured data for deals listing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `https://tuut.shop/${resolvedParams.localeCountry}/deals`,
    name:
      language === "ar"
        ? `جميع العروض في ${countryName}`
        : `All Deals in ${countryName}`,
    description:
      language === "ar"
        ? `استعرض ${deals.length} عرض في ${countryName}. اكتشف أفضل الخصومات والعروض الحصرية.`
        : `Browse ${deals.length} deals in ${countryName}. Discover the best discounts and exclusive offers.`,
    url: `https://tuut.shop/${resolvedParams.localeCountry}/deals`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: deals.length,
      itemListElement: deals.slice(0, 20).map((deal, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Offer",
          "@id": `https://tuut.shop/${resolvedParams.localeCountry}/deal/${
            language === "ar" ? deal.slug_ar : deal.slug_en
          }/`,
          name: language === "ar" ? deal.title_ar : deal.title_en,
          description:
            language === "ar" ? deal.description_ar : deal.description_en,
          image: deal.featured_image_url || deal.image_url,
          discount: deal.discount_percentage
            ? `${deal.discount_percentage}%`
            : undefined,
          price: deal.discounted_price,
          priceCurrency: getCurrencyFromCountryCode(countrySlug),
          category: deal.category_name,
          availability: "https://schema.org/InStock",
          validThrough: deal.expires_at,
          seller: {
            "@type": "Store",
            name:
              language === "ar" ? deal.store?.title_ar : deal.store?.title_en,
            image: deal.store?.profile_picture_url,
          },
        },
      })),
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
        name: language === "ar" ? "الرئيسية" : "Home",
        item: `https://tuut.shop/${resolvedParams.localeCountry}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: language === "ar" ? "العروض" : "Deals",
        item: `https://tuut.shop/${resolvedParams.localeCountry}/deals/`,
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
      <main>
        <section className="py-12 md:py-16 bg-[#E8F3E8] min-h-screen">
          <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
              <Link
                href="/"
                className={`inline-flex items-center text-[#5FB57A] hover:text-[#4FA669] mb-4 transition-colors gap-2 ${
                  isRTL ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <ArrowLeft
                  className={`h-5 w-5 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`}
                />
                {m.BACK_TO_HOME()}
              </Link>
              <h1
                className="text-[#111827] mb-4"
                style={{ fontSize: "36px", fontWeight: 700 }}
              >
                {m.ALL_DEALS()}
              </h1>
            </div>

            <DealsClientPage initialDeals={deals} initialSearchParams={resolvedSearchParams} />
          </div>
        </section>
      </main>
    </>
  );
}
