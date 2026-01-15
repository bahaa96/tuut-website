import { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowLeft, 
  Store as StoreIcon, 
  ExternalLink, 
  Star,
  Tag as TagIcon,
  Calendar,
  CheckCircle,
  ChevronLeft,
  TrendingDown,
  Package
} from "lucide-react";
import { Product } from "../../../../domain-models/Product";
import { requestFetchSingleProduct } from "@/network";
import { getCountryNameFromCode } from "@/utils/getCountryNameFromCode";
import * as m from "@/src/paraglide/messages";
import {
  ProductStructuredData,
  BreadcrumbStructuredData,
  WebsiteStructuredData,
} from "@/components/StructuredData";
import { generateProductPageMetadata } from "@/utils/metadata";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

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
      title:
        language === "ar"
          ? "المنتج غير موجود | Tuut"
          : "Product Not Found | Tuut",
      description:
        language === "ar"
          ? "هذا المنتج غير متوفر حالياً"
          : "This product is currently unavailable",
    };
  }

  return generateProductPageMetadata({
    localeCountry,
    product,
  });
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
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
      <div className={`min-h-screen bg-[#E8F3E8] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Package className="h-16 w-16 text-[#9CA3AF] mx-auto mb-4" />
            <h2 className="text-2xl mb-2">{isArabic ? 'المنتج غير موجود' : 'Product Not Found'}</h2>
            <p className="text-[#6B7280] mb-6">{isArabic ? 'المنتج الذي تبحث عنه غير موجود.' : 'The product you are looking for does not exist.'}</p>
            <Button asChild>
              <Link href={`/${localeCountry}/products`}>
                {isArabic ? 'تصفح المنتجات' : 'Browse Products'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate discount percentage
  const discount =
    product.original_price && product.price
      ? Math.round(
          ((product.original_price - product.price) / product.original_price) *
            100
        )
      : 0;

  const storeName = product.store ? product.store.charAt(0).toUpperCase() + product.store.slice(1) : '';

  // Build URLs
  const productUrl = `https://tuut.shop/${localeCountry}/product/${slug}`;
  const storeUrl = `https://tuut.shop/${localeCountry}/store/${product.store}`;

  // Breadcrumb items
  const breadcrumbItems = [
    {
      name: isArabic ? "الرئيسية" : "Home",
      url: `https://tuut.shop/${localeCountry}`,
    },
    {
      name: isArabic ? "المنتجات" : "Products",
      url: `https://tuut.shop/${localeCountry}/products`,
    },
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
        description={
          isArabic
            ? "اكتشف أفضل المنتجات والعروض"
            : "Discover the best products and deals"
        }
      />

      <div className={`min-h-screen bg-[#E8F3E8] ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Breadcrumb */}
        <div className="bg-white border-b border-[#E5E7EB]">
          <div className="max-w-[1200px] mx-auto px-4 py-4">
            <div className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link
                href={`/${localeCountry}`}
                className="text-[#6B7280] hover:text-[#5FB57A] transition-colors"
              >
                {isArabic ? 'الرئيسية' : 'Home'}
              </Link>
              <span className="text-[#9CA3AF]">/</span>
              <Link
                href={`/${localeCountry}/products`}
                className="text-[#6B7280] hover:text-[#5FB57A] transition-colors"
              >
                {isArabic ? 'المنتجات' : 'Products'}
              </Link>
              <span className="text-[#9CA3AF]">/</span>
              <span className="text-[#111827]">{product.title}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            asChild
            className={`mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Link href={`/${localeCountry}/products`}>
              {isRTL ? <ChevronLeft className="h-4 w-4 rotate-180" /> : <ChevronLeft className="h-4 w-4" />}
              {isArabic ? 'العودة للمنتجات' : 'Back to Products'}
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Product Images */}
            <ProductImageGallery
              images={product.images || []}
              title={product.title || ''}
              discount={discount}
              rating={product.rating}
              isRTL={isRTL}
              language={language}
            />

            {/* Product Info */}
            <div>
              {/* Store & Category */}
              <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {storeName && (
                  <div className={`flex items-center gap-2 text-[#6B7280] ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <StoreIcon className="h-4 w-4" />
                    <span>{storeName}</span>
                  </div>
                )}
                {product.categories && product.categories.length > 0 && (
                  <div className={`flex items-center gap-2 text-[#6B7280] ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <TagIcon className="h-4 w-4" />
                    <span className="capitalize">{product.categories[0].replace(/-/g, ' ')}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className={`text-3xl mb-4 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontWeight: 700 }}>
                {product.title}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(product.rating || 0)
                            ? 'fill-[#FBBF24] text-[#FBBF24]'
                            : 'text-[#E5E7EB]'
                        }`}
                      />
                    ))}
                  </div>
                  <span style={{ fontWeight: 600 }}>{product.rating.toFixed(1)}</span>
                  {product.ratings_count && (
                    <span className="text-[#6B7280]">
                      ({product.ratings_count} {isArabic ? 'تقييم' : 'reviews'})
                    </span>
                  )}
                </div>
              )}

              {/* Price */}
              <div className={`mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-baseline gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[#5FB57A]" style={{ fontSize: '48px', fontWeight: 700 }}>
                    {product.price?.toFixed(2)} {product.currency || 'SAR'}
                  </span>
                  {discount > 0 && product.original_price && (
                    <span className="text-[#9CA3AF] line-through" style={{ fontSize: '24px' }}>
                      {product.original_price.toFixed(2)}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <p className="text-red-500" style={{ fontWeight: 600 }}>
                    {isArabic ? 'توفر' : 'You save'}: {(product.original_price! - product.price!).toFixed(2)} {product.currency || 'SAR'} ({discount}%)
                  </p>
                )}
              </div>

              {/* Availability */}
              <div className={`flex items-center gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {product.available ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-600" style={{ fontWeight: 600 }}>
                      {isArabic ? 'متوفر' : 'In Stock'}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 text-red-500" />
                    <span className="text-red-600" style={{ fontWeight: 600 }}>
                      {isArabic ? 'غير متوفر' : 'Out of Stock'}
                    </span>
                  </>
                )}
              </div>

              <Separator className="my-6" />

              {/* Short Description */}
              {product.description && (
                <div className={`mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <p className="text-[#4B5563] leading-relaxed">
                    {product.description.length > 300
                      ? product.description.substring(0, 300) + '...'
                      : product.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  size="lg"
                  asChild
                  className="flex-1 bg-[#5FB57A] hover:bg-[#4FA569] text-white rounded-lg"
                  disabled={!product.available}
                >
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                  >
                    <ExternalLink className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isArabic 
                      ? (storeName ? `عرض في ${storeName}` : 'عرض في المتجر')
                      : (storeName ? `View on ${storeName}` : 'View on Store')}
                  </a>
                </Button>
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                  <Calendar className="h-5 w-5 text-[#6B7280] mt-0.5" />
                  <div>
                    <p className="text-sm text-[#6B7280]">
                      {isArabic ? 'آخر تحديث' : 'Last updated'}:{' '}
                      {new Date(product.updated_at || product.created_at || '').toLocaleDateString(
                        language === 'ar' ? 'ar-SA' : 'en-US',
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <Card className="border-2 border-[#E5E7EB] rounded-xl p-6 mb-6">
            <h2 className={`text-2xl mb-4 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontWeight: 700 }}>
              {isArabic ? 'الوصف' : 'Description'}
            </h2>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="text-[#4B5563] leading-relaxed whitespace-pre-line">
                {product.description || (isArabic ? 'لا يوجد وصف متاح.' : 'No description available.')}
              </p>
            </div>
          </Card>

          {/* Features Section */}
          {product.feature_bullets && product.feature_bullets.length > 0 && (
            <Card className="border-2 border-[#E5E7EB] rounded-xl p-6 mb-6">
              <h2 className={`text-2xl mb-4 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontWeight: 700 }}>
                {isArabic ? 'المميزات' : 'Features'}
              </h2>
              <ul className={`space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                {product.feature_bullets.map((bullet, index) => (
                  <li key={index} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <CheckCircle className="h-5 w-5 text-[#5FB57A] shrink-0 mt-0.5" />
                    <span className="text-[#4B5563]">{bullet}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Specifications Section */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <Card className="border-2 border-[#E5E7EB] rounded-xl p-6 mb-6">
              <h2 className={`text-2xl mb-4 ${isRTL ? 'text-right' : 'text-left'}`} style={{ fontWeight: 700 }}>
                {isArabic ? 'المواصفات' : 'Specifications'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className={`flex ${isRTL ? 'flex-row-reverse' : ''} p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]`}
                  >
                    <span className={`text-[#6B7280] ${isRTL ? 'mr-auto' : 'mr-4'}`} style={{ fontWeight: 600 }}>
                      {key}:
                    </span>
                    <span className="text-[#111827]">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
