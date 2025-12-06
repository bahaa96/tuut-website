import StoresClientPage from "./StoresClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { getCountryNameFromCode } from "@/utils/getCountryNameFromCode";
import { requestFetchAllStores } from "@/network/stores";

interface StoresPageProps {
  params: Promise<{
    localeCountry: string;
  }>;
  searchParams: Promise<{
    search?: string;
    category?: string;
    city?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: StoresPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const localeCountry = resolvedParams.localeCountry;

  // Extract language and country from localeCountry (e.g., "en-EG" -> "en", "EG")
  const language = localeCountry.split("-")[0];
  const country = localeCountry.split("-")[1];
  const isArabic = language === "ar";

  // Fetch stores count for metadata
  let storesCount = 0;
  try {
    const { data: allStores } = await requestFetchAllStores({
      countrySlug: country.toUpperCase(),
      currentPage: 1,
      pageSize: 20,
    });
    storesCount = allStores.length;
  } catch (error) {
    console.error("Error fetching stores count for metadata:", error);
  }

  const countryName = getCountryNameFromCode(country);
  const currentPage = parseInt(resolvedSearchParams.page || "1");

  // Build page title and description based on filters
  let title: string;
  let description: string;

  const baseTitle = isArabic ? "جميع المتاجر" : "All Stores";
  const siteName = "Tuut";

  // Create filter descriptions
  const filterParts: string[] = [];

  if (resolvedSearchParams.search) {
    filterParts.push(isArabic ? `بحث: "${resolvedSearchParams.search}"` : `Search: "${resolvedSearchParams.search}"`);
  }

  if (resolvedSearchParams.category) {
    filterParts.push(isArabic ? `الفئة: ${resolvedSearchParams.category}` : `Category: ${resolvedSearchParams.category}`);
  }

  if (resolvedSearchParams.city) {
    filterParts.push(isArabic ? `المدينة: ${resolvedSearchParams.city}` : `City: ${resolvedSearchParams.city}`);
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
    ? `استعرض ${storesCount} متجر في ${countryName}. اكتشف أفضل العروض والخصومات والكوبونات من المتاجر الرائدة. وفّر المال مع Tuut.`
    : `Browse ${storesCount} stores in ${countryName}. Discover the best deals, discounts, and coupons from leading retailers. Save money with Tuut.`;

  // Add filter context to description
  if (filterParts.length > 0) {
    const filterContext = isArabic
      ? `النتائج لـ: ${filterParts.join(", ")}`
      : `Results for: ${filterParts.join(", ")}`;
    description = `${filterContext}. ${description}`;
  }

  // Build canonical URL
  const baseUrl = `https://tuut.shop/${localeCountry}/stores`;
  const searchParamsString = new URLSearchParams(resolvedSearchParams).toString();
  const canonicalUrl = searchParamsString
    ? `${baseUrl}?${searchParamsString}`
    : baseUrl;

  // Generate keywords
  const baseKeywords = [
    isArabic ? "متاجر" : "stores",
    isArabic ? "عروض" : "deals",
    isArabic ? "خصومات" : "discounts",
    isArabic ? "كوبونات" : "coupons",
    isArabic ? "تسوق" : "shopping",
    isArabic ? "توفير المال" : "save money",
    countryName,
    isArabic ? "عروض حصرية" : "exclusive offers",
    isArabic ? "متاجر رائدة" : "leading retailers",
  ];

  // Add filter-specific keywords
  if (resolvedSearchParams.category) {
    baseKeywords.push(resolvedSearchParams.category);
  }
  if (resolvedSearchParams.city) {
    baseKeywords.push(resolvedSearchParams.city);
  }
  if (resolvedSearchParams.search) {
    baseKeywords.push(resolvedSearchParams.search);
  }

  // Build pagination rel tags
  const other: Record<string, { rel: string; href: string }> = {};
  const pageSize = 20;
  const totalPages = Math.ceil(storesCount / pageSize);

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
          url: "https://tuut.shop/og-stores.jpg",
          width: 1200,
          height: 630,
          alt: isArabic ? "جميع المتاجر في Tuut" : "All Stores on Tuut",
          type: "image/jpeg",
        },
      ],
      locale: localeCountry,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://tuut.shop/og-stores.jpg"],
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
    hreflangs[locale] = `https://tuut.shop/${locale}/stores${searchParamsString ? `?${searchParamsString}` : ''}`;
  });

  // Default language
  hreflangs["x-default"] = `https://tuut.shop/en-${localeCountry.split("-")[1]}/stores${searchParamsString ? `?${searchParamsString}` : ''}`;

  return hreflangs;
}

export default async function StoresPage({ params, searchParams }: StoresPageProps) {
  // Await params as required by Next.js 15
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Extract country from localeCountry (e.g., "en-EG" -> "EG")
  const country = resolvedParams.localeCountry.split("-")[1];
  const language = resolvedParams.localeCountry.split("-")[0];
  const isRTL = language === "ar";

  // Fetch stores data server-side using supabase-fetch with country_slug filter
  let stores: any[] = [];

  try {
    const { data: allStores } = await requestFetchAllStores({
      countrySlug: country.toUpperCase(),
      currentPage: 1,
      pageSize: 20,
    });

    stores = allStores;
  } catch (error) {
    console.error("Error fetching stores data:", error);
  }

  // Generate JSON-LD structured data for stores listing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `https://tuut.shop/${resolvedParams.localeCountry}/stores`,
    name:
      language === "ar"
        ? `جميع المتاجر في ${country}`
        : `All Stores in ${country}`,
    description:
      language === "ar"
        ? `استعرض ${stores.length} متجر في ${country}. اكتشف أفضل العروض والخصومات من المتاجر الرائدة.`
        : `Browse ${stores.length} stores in ${country}. Discover the best deals and discounts from leading retailers.`,
    url: `https://tuut.shop/${resolvedParams.localeCountry}/stores`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: stores.length,
      itemListElement: stores.slice(0, 20).map((store, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Store",
          "@id": `https://tuut.shop/${resolvedParams.localeCountry}/store/${
            store.slug_en || store.slug
          }/`,
          name:
            language === "ar"
              ? store.title_ar || store.name_ar
              : store.title_en || store.name || store.store_name,
          description:
            language === "ar" ? store.description_ar : store.description_en,
          image: store.profile_picture_url || store.logo_url,
          category: store.category,
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
        name: language === "ar" ? "المتاجر" : "Stores",
        item: `https://tuut.shop/${resolvedParams.localeCountry}/stores/`,
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
                className="inline-flex items-center text-[#5FB57A] hover:text-[#4FA669] mb-4 transition-colors"
              >
                <ArrowLeft
                  className={`h-5 w-5 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`}
                />
                {language === "ar"
                  ? "العودة إلى الصفحة الرئيسية"
                  : "Back to Home"}
              </Link>
              <h1
                className="text-[#111827] mb-3"
                style={{ fontSize: "48px", fontWeight: 700 }}
              >
                {language === "ar" ? "جميع المتاجر" : "All Stores"}
              </h1>
              <p className="text-[#6B7280] text-lg mb-4">
                {language === "en"
                  ? `Discover ${stores.length} stores with exclusive deals and coupons`
                  : `اكتشف ${stores.length} متجر مع عروض وكوبونات حصرية`}
              </p>
            </div>

            <StoresClientPage initialStores={stores} initialSearchParams={resolvedSearchParams} />
          </div>
        </section>
      </main>
    </>
  );
}
