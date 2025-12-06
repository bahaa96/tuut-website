import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Store, ExternalLink, Star } from "lucide-react";
import { Product } from "../../../../domain-models/Product";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { requestFetchSingleProduct } from "@/network";
import { getCountryNameFromCode } from "@/utils/getCountryNameFromCode";
import * as m from "@/src/paraglide/messages";
import {
  ProductStructuredData,
  BreadcrumbStructuredData,
  WebsiteStructuredData
} from "@/components/StructuredData";
import { generateProductPageMetadata } from "@/utils/metadata";

interface ProductDetailPageProps {
  params: Promise<{
    localeCountry: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { localeCountry, slug } = resolvedParams;

  // Extract language from localeCountry (e.g., "en-EG" -> "en")
  const language = localeCountry.split("-")[0];
  const countrySlug = localeCountry.split("-")[1];

  // Fetch product data for metadata
  const { data: product } = await requestFetchSingleProduct({ slug });

  if (!product) {
    return {
      title: language === "ar" ? "المنتج غير موجود | Tuut" : "Product Not Found | Tuut",
      description: language === "ar"
        ? "هذا المنتج غير متوفر حالياً"
        : "This product is currently unavailable",
    };
  }

  return generateProductPageMetadata({
    localeCountry,
    product,
  });
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = await params;
  const { localeCountry, slug } = resolvedParams;

  // Extract language and country from localeCountry
  const language = localeCountry.split("-")[0];
  const countrySlug = localeCountry.split("-")[1];
  const isArabic = language === "ar";
  const isRTL = isArabic;

  // Fetch product data
  const { data: product } = await requestFetchSingleProduct({ slug });

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className={`text-2xl font-bold text-gray-900 mb-4 ${isRTL ? "text-right" : "text-left"}`}>
            {isArabic ? "المنتج غير موجود" : "Product Not Found"}
          </h1>
          <p className="text-gray-600 mb-6">
            {isArabic
              ? "هذا المنتج غير متوفر حالياً"
              : "This product is currently unavailable"}
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-[#5FB57A] text-white rounded-lg hover:bg-[#4FA669] transition-colors"
          >
            <ArrowLeft className={`h-5 w-5 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
            {isArabic ? "العودة للرئيسية" : "Back to Home"}
          </Link>
        </div>
      </div>
    );
  }

  // Calculate discount percentage
  const discountPercentage = product.original_price && product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  // Format prices
  const formatPrice = (price: number | undefined, currency: string | undefined) => {
    if (!price || !currency) return "";
    return new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency,
    }).format(price);
  };

  const currentPrice = formatPrice(product.price, product.currency);
  const originalPrice = formatPrice(product.original_price, product.currency);

  // Build URLs
  const productUrl = `https://tuut.shop/${localeCountry}/product/${slug}`;
  const storeUrl = `https://tuut.shop/${localeCountry}/store/${product.store}`;

  // Breadcrumb items
  const breadcrumbItems = [
    { name: isArabic ? "الرئيسية" : "Home", url: `https://tuut.shop/${localeCountry}` },
    { name: isArabic ? "المنتجات" : "Products", url: `https://tuut.shop/${localeCountry}/products` },
    { name: product.title || isArabic ? "المنتج" : "Product", url: productUrl },
  ];

  return (
    <>
      {/* Structured Data */}
      <ProductStructuredData
        product={product}
        url={productUrl}
        language={language}
        country={getCountryNameFromCode(countrySlug)}
      />

      <BreadcrumbStructuredData items={breadcrumbItems} />

      <WebsiteStructuredData
        url={`https://tuut.shop/${localeCountry}`}
        name="Tuut"
        description={isArabic ? "اكتشف أفضل المنتجات والعروض" : "Discover the best products and deals"}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          {/* Breadcrumb Navigation */}
          <nav className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
            <Link
              href="/"
              className="inline-flex items-center text-[#5FB57A] hover:text-[#4FA669] mb-4 transition-colors"
            >
              <ArrowLeft className={`h-5 w-5 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
              {m.BACK_TO_HOME()}
            </Link>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <ImageWithFallback
                  src={product.images?.[0] || "/placeholder-product.jpg"}
                  alt={product.title || "Product image"}
                  width={600}
                  height={600}
                  className="w-full h-auto rounded-lg object-cover"
                  fallbackSrc="/placeholder-product.jpg"
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image, index) => (
                    <ImageWithFallback
                      key={index}
                      src={image}
                      alt={`${product.title} ${index + 2}`}
                      width={150}
                      height={150}
                      className="w-full h-auto rounded-lg object-cover cursor-pointer hover:opacity-75 transition-opacity"
                      fallbackSrc="/placeholder-product.jpg"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Store Badge */}
              {product.store && (
                <div className="flex items-center space-x-2">
                  <Store className="h-5 w-5 text-[#5FB57A]" />
                  <Link
                    href={storeUrl}
                    className="text-sm font-medium text-[#5FB57A] hover:underline"
                  >
                    {product.store}
                  </Link>
                </div>
              )}

              {/* Product Title */}
              <h1 className={`text-3xl font-bold text-gray-900 ${isRTL ? "text-right" : "text-left"}`}>
                {product.title}
              </h1>

              {/* Product Description */}
              {product.description && (
                <p className="text-gray-600 leading-relaxed" dir={isRTL ? "rtl" : "ltr"}>
                  {product.description}
                </p>
              )}

              {/* Rating */}
              {product.rating && (
                <div className={`flex items-center space-x-2 ${isRTL ? "flex-row-reverse space-x-reverse" : ""}`}>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating || 0)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating.toFixed(1)} {isArabic ? "نجوم" : "stars"}
                  </span>
                </div>
              )}

              {/* Price Section */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl font-bold text-gray-900">
                        {currentPrice}
                      </span>
                      {originalPrice && (
                        <span className="text-xl text-gray-400 line-through">
                          {originalPrice}
                        </span>
                      )}
                    </div>
                    {discountPercentage > 0 && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          {isArabic ? "خصم" : "Save"} {discountPercentage}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {product.available
                      ? isArabic
                        ? "متوفر"
                        : "In Stock"
                      : isArabic
                        ? "غير متوفر"
                        : "Out of Stock"}
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className={`w-full flex items-center justify-center px-6 py-3 bg-[#5FB57A] text-white rounded-lg hover:bg-[#4FA669] transition-colors ${!product.available ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={(e) => {
                    if (!product.available) {
                      e.preventDefault();
                    }
                  }}
                >
                  <ExternalLink className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {isArabic ? "شراء المنتج" : "Buy Product"}
                </a>
              </div>

              {/* Categories */}
              {product.categories && product.categories.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className={`text-lg font-semibold mb-3 ${isRTL ? "text-right" : "text-left"}`}>
                    {isArabic ? "الفئات" : "Categories"}
                  </h3>
                  <div className={`flex flex-wrap gap-2 ${isRTL ? "justify-end" : "justify-start"}`}>
                    {product.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3 className={`text-lg font-semibold mb-3 text-blue-900 ${isRTL ? "text-right" : "text-left"}`}>
                  {isArabic ? "معلومات إضافية" : "Additional Information"}
                </h3>
                <ul className={`space-y-2 text-blue-800 ${isRTL ? "text-right" : "text-left"}`}>
                  <li>
                    <strong>{isArabic ? "المتجر:" : "Store:"}</strong> {product.store || "-"}
                  </li>
                  <li>
                    <strong>{isArabic ? "العملة:" : "Currency:"}</strong> {product.currency || "-"}
                  </li>
                  {product.created_at && (
                    <li>
                      <strong>{isArabic ? "تاريخ الإضافة:" : "Added on:"}</strong>{" "}
                      {new Date(product.created_at).toLocaleDateString(
                        language === "ar" ? "ar-EG" : "en-US"
                      )}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}