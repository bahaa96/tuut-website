import { fetchDealsByCountrySlug } from "../../../lib/supabase-fetch";
import DealsClientPage from "./DealsClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Deal } from "@/domain-models";
import { Metadata } from "next";
import { getCountryNameFromCode } from "@/utils/getCountryNameFromCode";
import { requestFetchAllDeals } from "@/network/deals";

interface DealsPageProps {
  params: Promise<{
    localeCountry: string;
  }>;
}

export async function generateMetadata({
  params,
}: DealsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const localeCountry = resolvedParams.localeCountry;

  // Extract language and country from localeCountry (e.g., "en-EG" -> "en", "EG")
  const language = localeCountry.split("-")[0];
  const country = localeCountry.split("-")[1];
  const isArabic = language === "ar";

  // Fetch deals count for metadata
  let dealsCount = 0;
  try {
    const { data: allDeals } = await requestFetchAllDeals({
      countrySlug: country.toUpperCase(),
      currentPage: 1,
      pageSize: 20,
    });

    dealsCount = allDeals.length;
  } catch (error) {
    console.error("Error fetching deals count for metadata:", error);
  }

  const countryName = getCountryNameFromCode(country);

  const title = isArabic
    ? `جميع العروض في ${countryName} | الخصومات والكوبونات | Tuut`
    : `All Deals in ${countryName} | Discounts and Coupons | Tuut`;

  const description = isArabic
    ? `استعرض ${dealsCount} عرض في ${countryName}. اكتشف أفضل الخصومات والكوبونات والعروض الحصرية. وفّر المال مع Tuut.`
    : `Browse ${dealsCount} deals in ${countryName}. Discover the best discounts, coupons, and exclusive offers. Save money with Tuut.`;

  return {
    title,
    description,
    keywords: [
      isArabic ? "عروض" : "deals",
      isArabic ? "خصومات" : "discounts",
      isArabic ? "كوبونات" : "coupons",
      isArabic ? "عروض حصرية" : "exclusive offers",
      isArabic ? "توفير المال" : "save money",
      isArabic ? "تسوق" : "shopping",
      countryName,
      isArabic ? "صفقات" : "bargains",
      isArabic ? "عروض مميزة" : "special deals",
      isArabic ? "تخفيضات" : "price reductions",
    ].join(", "),
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://tuut.shop/${localeCountry}/deals`,
      siteName: "Tuut",
      images: [
        {
          url: "https://tuut.shop/og-image.jpg",
          width: 1200,
          height: 630,
          alt: isArabic ? "جميع العروض في Tuut" : "All Deals on Tuut",
        },
      ],
      locale: localeCountry,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://tuut.shop/og-image.jpg"],
    },
    alternates: {
      canonical: `https://tuut.shop/${localeCountry}/deals`,
      languages: {
        [localeCountry]: `https://tuut.shop/${localeCountry}/deals`,
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

export default async function DealsPage({ params }: DealsPageProps) {
  // Await params as required by Next.js 15
  const resolvedParams = await params;

  // Extract country from localeCountry (e.g., "en-EG" -> "EG")
  const country = resolvedParams.localeCountry.split("-")[1];
  const language = resolvedParams.localeCountry.split("-")[0];
  const isRTL = language === "ar";

  let deals: Deal[] = [];

  try {
    const { data: allDeals } = await requestFetchAllDeals({
      countrySlug: country.toUpperCase(),
      currentPage: 1,
      pageSize: 20,
    });

    deals = allDeals;
  } catch (error) {
    console.error("Error fetching deals data:", error);
  }

  // Generate JSON-LD structured data for deals listing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `https://tuut.shop/${resolvedParams.localeCountry}/deals`,
    name:
      language === "ar"
        ? `جميع العروض في ${country}`
        : `All Deals in ${country}`,
    description:
      language === "ar"
        ? `استعرض ${deals.length} عرض في ${country}. اكتشف أفضل الخصومات والعروض الحصرية.`
        : `Browse ${deals.length} deals in ${country}. Discover the best discounts and exclusive offers.`,
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
          priceCurrency:
            country === "EG" ? "EGP" : country === "SA" ? "SAR" : "USD",
          category: deal.category_name,
          availability: "https://schema.org/InStock",
          validThrough: deal.expires_at,
          seller: {
            "@type": "Store",
            name:
              language === "ar" ? deal.stores.title_ar : deal.stores.title_en,
            image: deal.stores.logo_url,
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
                className="text-[#111827] mb-4"
                style={{ fontSize: "36px", fontWeight: 700 }}
              >
                {language === "ar" ? "جميع العروض" : "All Deals"}
              </h1>
            </div>

            <DealsClientPage
              initialDeals={deals}
              language={language}
              isRTL={isRTL}
              country={country}
            />
          </div>
        </section>
      </main>
    </>
  );
}
