import { Metadata } from "next";
import { Product } from "@/domain-models/Product";

interface ProductsPageMetadataParams {
  localeCountry: string;
  searchParams?: {
    search?: string;
    category?: string;
    store?: string;
    discount?: string;
    min_price?: string;
    max_price?: string;
    sort?: string;
    page?: string;
  };
  productsCount?: number;
  currentPage?: number;
  totalPages?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  previousPageUrl?: string;
  nextPageUrl?: string;
}

interface ProductPageMetadataParams {
  localeCountry: string;
  product: Product;
}

export function generateProductsPageMetadata({
  localeCountry,
  searchParams = {},
  productsCount = 0,
  currentPage = 1,
  totalPages = 1,
  hasPreviousPage = false,
  hasNextPage = false,
  previousPageUrl,
  nextPageUrl,
}: ProductsPageMetadataParams): Metadata {
  // Extract language and country from localeCountry (e.g., "en-EG" -> "en", "EG")
  const language = localeCountry.split("-")[0];
  const country = localeCountry.split("-")[1];
  const isArabic = language === "ar";

  // Build page title and description based on filters
  let title: string;
  let description: string;

  const baseTitle = isArabic ? "جميع المنتجات" : "All Products";
  const siteName = "Tuut";
  const countryName = getCountryNameFromCode(country);

  // Create filter descriptions
  const filterParts: string[] = [];

  if (searchParams.search) {
    filterParts.push(isArabic ? `بحث: "${searchParams.search}"` : `Search: "${searchParams.search}"`);
  }

  if (searchParams.category) {
    filterParts.push(isArabic ? `الفئة: ${searchParams.category}` : `Category: ${searchParams.category}`);
  }

  if (searchParams.store) {
    filterParts.push(isArabic ? `المتجر: ${searchParams.store}` : `Store: ${searchParams.store}`);
  }

  if (searchParams.discount) {
    filterParts.push(isArabic ? `خصم: ${searchParams.discount}` : `Discount: ${searchParams.discount}`);
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
  const productsText = isArabic ? `${productsCount} منتج` : `${productsCount} products`;
  const browseText = isArabic ? "استعرض" : "Browse";
  const discoverText = isArabic ? "اكتشف أفضل المنتجات والعروض" : "Discover the best products and deals";
  const saveText = isArabic ? "وفر المال مع Tuut" : "Save money with Tuut";

  description = isArabic
    ? `${browseText} ${productsText} في ${countryName}. ${discoverText} من المتاجر الرائعة. ${saveText}.`
    : `${browseText} ${productsText} in ${countryName}. ${discoverText} from top retailers. ${saveText}.`;

  // Add filter context to description
  if (filterParts.length > 0) {
    const filterContext = isArabic
      ? `النتائج لـ: ${filterParts.join(", ")}`
      : `Results for: ${filterParts.join(", ")}`;
    description = `${filterContext}. ${description}`;
  }

  // Build canonical URL
  const baseUrl = `https://tuut.shop/${localeCountry}/products`;
  const searchParamsString = new URLSearchParams(searchParams).toString();
  const canonicalUrl = searchParamsString
    ? `${baseUrl}?${searchParamsString}`
    : baseUrl;

  // Generate keywords
  const baseKeywords = [
    isArabic ? "منتجات" : "products",
    isArabic ? "عروض" : "deals",
    isArabic ? "خصومات" : "discounts",
    isArabic ? "تسوق" : "shopping",
    isArabic ? "توفير" : "saving",
    isArabic ? "أسعار" : "prices",
    isArabic ? "منتجات مخفضة" : "discounted products",
    countryName,
  ];

  // Add filter-specific keywords
  if (searchParams.category) {
    baseKeywords.push(searchParams.category);
  }
  if (searchParams.store) {
    baseKeywords.push(searchParams.store);
  }
  if (searchParams.search) {
    baseKeywords.push(searchParams.search);
  }

  // Build pagination rel tags
  const other: Record<string, { rel: string; href: string }> = {};

  if (hasPreviousPage && previousPageUrl) {
    other.prev = {
      rel: "prev",
      href: previousPageUrl,
    };
  }

  if (hasNextPage && nextPageUrl) {
    other.next = {
      rel: "next",
      href: nextPageUrl,
    };
  }

  return {
    title,
    description,
    keywords: baseKeywords.join(", "),
    authors: [{ name: "Tuut" }],
    creator: "Tuut",
    publisher: "Tuut",
    category: "e-commerce",
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
      languages: generateHreflangTags(localeCountry, searchParams),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: "Tuut",
      images: [
        {
          url: "https://tuut.shop/og-products.jpg",
          width: 1200,
          height: 630,
          alt: isArabic ? "جميع المنتجات في Tuut" : "All Products on Tuut",
          type: "image/jpeg",
        },
      ],
      locale: localeCountry,
      localeAlternate: generateAlternateLocales(localeCountry),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://tuut.shop/og-products.jpg"],
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
    other: Object.keys(other).length > 0 ? other : undefined,
  };
}

export function generateProductPageMetadata({
  localeCountry,
  product,
}: ProductPageMetadataParams): Metadata {
  const language = localeCountry.split("-")[0];
  const country = localeCountry.split("-")[1];
  const isArabic = language === "ar";

  const title = product.title
    ? `${product.title} | Tuut`
    : isArabic
      ? "منتج | Tuut"
      : "Product | Tuut";

  const description = product.description
    ? product.description.slice(0, 160)
    : isArabic
      ? "اكتشف هذا المنتج الرائع على Tuut. استفد من أفضل الأسعار والعروض."
      : "Discover this amazing product on Tuut. Get the best prices and deals.";

  const currencyMap: Record<string, string> = {
    "ريال": "SAR",
  };
  const currencyCode = product.currency
    ? currencyMap[product.currency] ?? product.currency
    : null;

  const price = product.price && currencyCode
    ? new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US", {
        style: "currency",
        currency: currencyCode,
      }).format(product.price)
    : null;

  const priceText = price
    ? isArabic
      ? `السعر: ${price}`
      : `Price: ${price}`
    : "";

  const baseUrl = `https://tuut.shop/${localeCountry}/products/${product.slug}`;
  const imageUrl = product.images?.[0] || "https://tuut.shop/default-product.jpg";

  return {
    title,
    description: `${priceText} ${description}`,
    keywords: [
      product.title,
      product.categories?.join(", "),
      product.store,
      product.title,
      isArabic ? "شراء" : "buy",
      isArabic ? "سعر" : "price",
      isArabic ? "خصم" : "discount",
      isArabic ? "تسوق" : "shopping",
    ].filter(Boolean).join(", "),
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
      canonical: baseUrl,
      languages: generateHreflangTagsForProduct(product.slug, localeCountry),
    },
    openGraph: {
      title,
      description: `${priceText} ${description}`,
      type: "website",
      url: baseUrl,
      siteName: "Tuut",
      images: product.images?.map((img, index) => ({
        url: img,
        width: 800,
        height: 800,
        alt: product.title || "Product image",
        type: "image/jpeg",
        ...(index === 0 && { isPrimary: true }),
      })) || [{
        url: imageUrl,
        width: 800,
        height: 800,
        alt: product.title || "Product image",
        type: "image/jpeg",
      }],
      locale: localeCountry,
      product: {
        availability: product.available ? "in stock" : "out of stock",
        brand: product.store,
        condition: "new",
        price: product.price?.toString(),
        priceCurrency: product.currency,
        category: product.categories?.[0],
        retailer: product.store,
      },
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: `${priceText} ${description}`,
      images: [imageUrl],
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

function generateHreflangTags(
  localeCountry: string,
  searchParams: Record<string, string | undefined>
): Record<string, string> {
  const languages = ["en", "ar"];
  const countries = ["EG", "SA", "AE", "JO", "QA", "BH", "KW", "OM", "LB"];

  const hreflangs: Record<string, string> = {};

  // Generate combinations for the current country
  languages.forEach(lang => {
    const locale = `${lang}-${localeCountry.split("-")[1]}`;
    hreflangs[locale] = `https://tuut.shop/${locale}/products${Object.keys(searchParams).length > 0 ? `?${new URLSearchParams(searchParams).toString()}` : ''}`;
  });

  // Default language
  hreflangs["x-default"] = `https://tuut.shop/en-${localeCountry.split("-")[1]}/products`;

  return hreflangs;
}

function generateHreflangTagsForProduct(
  slug: string | undefined,
  localeCountry: string
): Record<string, string> {
  if (!slug) return {};

  const languages = ["en", "ar"];
  const hreflangs: Record<string, string> = {};

  // Generate combinations for the current country
  languages.forEach(lang => {
    const locale = `${lang}-${localeCountry.split("-")[1]}`;
    hreflangs[locale] = `https://tuut.shop/${locale}/products/${slug}`;
  });

  // Default language
  hreflangs["x-default"] = `https://tuut.shop/en-${localeCountry.split("-")[1]}/products/${slug}`;

  return hreflangs;
}

function generateAlternateLocales(localeCountry: string): string[] {
  const currentLang = localeCountry.split("-")[0];
  const country = localeCountry.split("-")[1];

  // Return all supported locales for the same country
  return currentLang === "en"
    ? [`ar-${country}`, "en-US"]
    : [`en-${country}`, "ar-SA"];
}

function getCountryNameFromCode(countryCode: string): string {
  const countryNames: Record<string, { en: string; ar: string }> = {
    EG: { en: "Egypt", ar: "مصر" },
    SA: { en: "Saudi Arabia", ar: "السعودية" },
    AE: { en: "UAE", ar: "الإمارات" },
    JO: { en: "Jordan", ar: "الأردن" },
    QA: { en: "Qatar", ar: "قطر" },
    BH: { en: "Bahrain", ar: "البحرين" },
    KW: { en: "Kuwait", ar: "الكويت" },
    OM: { en: "Oman", ar: "عُمان" },
    LB: { en: "Lebanon", ar: "لبنان" },
  };

  return countryNames[countryCode]?.en || countryCode;
}