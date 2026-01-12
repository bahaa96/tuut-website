import { Metadata } from "next";
import { getCountryNameFromCode } from "@/utils/getCountryNameFromCode";
import {
  WebsiteStructuredData,
  FAQStructuredData,
} from "@/components/StructuredData";
import HomePageClient from "./page.client";
import {
  requestFetchAllFeaturedDeals,
  requestFetchAllCategories,
  requestFetchAllStores,
  requestFetchAllFeaturedProducts,
  requestFetchRandomDeals,
} from "@/network";
import { FeaturedDeal, Category, Store, Product, Deal } from "@/domain-models";

interface HomePageProps {
  params: Promise<{
    localeCountry: string;
  }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const localeCountry = resolvedParams.localeCountry;

  // Extract language and country from localeCountry (e.g., "en-EG" -> "en", "EG")
  const language = localeCountry.split("-")[0];
  const country = localeCountry.split("-")[1];
  const isArabic = language === "ar";
  const countryName = getCountryNameFromCode(country);

  // Build title and description
  const title = isArabic
    ? `Tuut - أفضل العروض والخصومات في ${countryName} | تطبيق التسوق الذكي`
    : `Tuut - Best Deals and Discounts in ${countryName} | Smart Shopping App`;

  const description = isArabic
    ? `اكتشف أفضل العروض والخصومات والكوبونات في ${countryName}. تطبيق Tuut يساعدك على توفير المال عبر آلاف المتاجر. حمل التطبيق الآن وابدأ التوفير!`
    : `Discover the best deals, discounts, and coupons in ${countryName}. Tuut app helps you save money across thousands of stores. Download now and start saving!`;

  // Generate keywords
  const keywords = [
    isArabic ? "عروض" : "deals",
    isArabic ? "خصومات" : "discounts",
    isArabic ? "كوبونات" : "coupons",
    isArabic ? "تطبيق تسوق" : "shopping app",
    isArabic ? "توفير المال" : "save money",
    isArabic ? "عروض حصرية" : "exclusive offers",
    isArabic ? "متاجر" : "stores",
    isArabic ? "تسوق عبر الإنترنت" : "online shopping",
    countryName,
    isArabic ? "أسعار مخفضة" : "discounted prices",
    isArabic ? "صفقات رائعة" : "great deals",
    isArabic ? "تخفيضات" : "price reductions",
    isArabic ? "عروض اليوم" : "today's deals",
    isArabic ? "أفضل الأسعار" : "best prices",
  ];

  // Build canonical URL
  const canonicalUrl = `https://tuut.shop/${localeCountry}`;

  return {
    title,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: "Tuut Team" }],
    creator: "Tuut",
    publisher: "Tuut",
    category: "shopping",
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
      languages: generateHreflangTags(localeCountry),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: "Tuut",
      images: [
        {
          url: "https://tuut.shop/og-home.jpg",
          width: 1200,
          height: 630,
          alt: title,
          type: "image/jpeg",
        },
      ],
      locale: localeCountry,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://tuut.shop/og-home.jpg"],
      creator: "@tuutapp",
      site: "@tuutapp",
    },
    app: {
      name: "Tuut",
      url: {
        iphone: "https://apps.apple.com/app/tuut",
        android: "https://play.google.com/store/apps/details?id=com.tuut.app",
      },
    },
  };
}

function generateHreflangTags(localeCountry: string): Record<string, string> {
  const languages = ["en", "ar"];
  const country = localeCountry.split("-")[1];
  const hreflangs: Record<string, string> = {};

  // Generate combinations for the current country
  languages.forEach((lang) => {
    const locale = `${lang}-${country}`;
    hreflangs[locale] = `https://tuut.shop/${locale}`;
  });

  // Default language
  hreflangs["x-default"] = `https://tuut.shop/en-${country}`;

  return hreflangs;
}

export default async function Home({ params }: HomePageProps) {
  const resolvedParams = await params;
  const localeCountry = resolvedParams.localeCountry;
  const language = localeCountry.split("-")[0];
  const country = localeCountry.split("-")[1];
  const isArabic = language === "ar";
  const countryName = getCountryNameFromCode(country);

  // Fetch featured deals, categories, and popular stores
  let featuredDeals: FeaturedDeal[] = [];
  let categories: Category[] = [];
  let popularStores: Store[] = [];
  let featuredProducts: Product[] = [];
  let wheelDeals: Deal[] = [];

  try {
    const [
      featuredDealsResult,
      categoriesResult,
      storesResult,
      featuredProductsResult,
      wheelDealsResult,
    ] = await Promise.all([
      requestFetchAllFeaturedDeals({
        countrySlug: country,
        currentPage: 1,
        pageSize: 10,
      }),
      requestFetchAllCategories({
        currentPage: 1,
        pageSize: 10,
      }),
      requestFetchAllStores({
        countrySlug: country,
        currentPage: 1,
        pageSize: 8,
      }),
      requestFetchAllFeaturedProducts({
        countrySlug: country,
        currentPage: 1,
        pageSize: 10,
      }),
      requestFetchRandomDeals({
        countrySlug: country,
        count: 10,
        currentPage: 1,
      }),
    ]);

    featuredDeals = featuredDealsResult.data;
    categories = categoriesResult.data;
    popularStores = storesResult.data;
    featuredProducts = featuredProductsResult.data;
    wheelDeals = wheelDealsResult.data;
  } catch (error) {
    console.error("Error fetching home page data:", error);
  }

  // FAQ data for the home page
  const faqs = [
    {
      question: isArabic ? "ما هو تطبيق Tuut؟" : "What is the Tuut app?",
      answer: isArabic
        ? "Tuut هو تطبيق تسوق ذكي يساعدك على اكتشاف أفضل العروض والخصومات والكوبونات من آلاف المتاجر في منطقتك. يقارن الأسعار ويوفر لك عروضاً حصرية لتوفير المال."
        : "Tuut is a smart shopping app that helps you discover the best deals, discounts, and coupons from thousands of stores in your area. It compares prices and provides exclusive offers to help you save money.",
    },
    {
      question: isArabic ? "هل تطبيق Tuut مجاني؟" : "Is the Tuut app free?",
      answer: isArabic
        ? "نعم، تطبيق Tuut مجاني تماماً للتحميل والاستخدام. يمكنك الوصول إلى جميع العروض والخصومات دون أي رسوم."
        : "Yes, the Tuut app is completely free to download and use. You can access all deals and discounts without any fees.",
    },
    {
      question: isArabic
        ? "في أي المدن يتوفر Tuut؟"
        : "In which cities is Tuut available?",
      answer: isArabic
        ? `Tuut متاح في مدن رئيسية في ${countryName} بما في ذلك القاهرة، الإسكندرية، الرياض، جدة، دبي، وأبو ظبي. نعمل باستمرار على التوسع لتغطية المزيد من المدن.`
        : `Tuut is available in major cities across ${countryName} including Cairo, Alexandria, Riyadh, Jeddah, Dubai, and Abu Dhabi. We're constantly expanding to cover more cities.`,
    },
    {
      question: isArabic
        ? "كيف أوفر المال باستخدام Tuut؟"
        : "How do I save money using Tuut?",
      answer: isArabic
        ? "مع Tuut، يمكنك الوصول إلى عروض حصرية وكوبونات خصم، مقارنة الأسعار بين المتاجر المختلفة، وتلقي إشعارات عن أحدث الصفقات. يوفر مستخدمونا في المتوسط 30% على مشترياتهم."
        : "With Tuut, you get access to exclusive deals and discount coupons, compare prices across different stores, and receive notifications about the latest bargains. Our users save an average of 30% on their purchases.",
    },
  ];

  return (
    <>
      {/* Structured Data */}
      <WebsiteStructuredData
        url={`https://tuut.shop/${localeCountry}`}
        name="Tuut"
        description={
          isArabic
            ? `اكتشف أفضل العروض والخصومات في ${countryName}`
            : `Discover the best deals and discounts in ${countryName}`
        }
      />

      <FAQStructuredData faqs={faqs} />

      {/* JSON-LD for Local Business */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Tuut",
              description: isArabic
                ? "تطبيق تسوق ذكي لاكتشاف أفضل العروض والخصومات"
                : "Smart shopping app to discover the best deals and discounts",
              url: `https://tuut.shop/${localeCountry}`,
              applicationCategory: "Shopping",
              operatingSystem: "iOS, Android",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              },
              author: {
                "@type": "Organization",
                name: "Tuut",
                url: "https://tuut.shop",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.7",
                reviewCount: "10000",
                bestRating: "5",
                worstRating: "1",
              },
              inLanguage: language,
              contentLocation: {
                "@type": "Place",
                name: countryName,
              },
            },
            null,
            2
          ),
        }}
      />
      <HomePageClient
        initialFeaturedDeals={featuredDeals}
        initialCategories={categories}
        initialPopularStores={popularStores}
        initialFeaturedProducts={featuredProducts}
        initialWheelDeals={wheelDeals}
      />
    </>
  );
}
