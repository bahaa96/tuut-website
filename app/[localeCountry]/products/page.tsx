import ProductsClientPage from "./page.client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fetchProducts } from "@/utils/api";
import { Product } from "../types";
import { requestFetchAllProducts } from "@/network";
import * as m from "@/src/paraglide/messages";
import { Metadata } from "next";
import { generateProductsPageMetadata } from "@/utils/metadata";
import {
  ProductCollectionStructuredData,
  BreadcrumbStructuredData,
  WebsiteStructuredData
} from "@/components/StructuredData";
import { getCountryNameFromCode } from "@/utils/getCountryNameFromCode";

interface ProductsPageProps {
  params: Promise<{
    localeCountry: string;
  }>;
  searchParams: Promise<{
    search?: string;
    category?: string;
    store?: string;
    discount?: string;
    min_price?: string;
    max_price?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const localeCountry = resolvedParams.localeCountry;
  const currentPage = parseInt(resolvedSearchParams.page || "1");

  // Fetch products count for metadata
  let productsCount = 0;
  let totalPages = 1;
  try {
    const country = localeCountry.split("-")[1];
    const pageSize = 50;
    const { data: allProducts } = await requestFetchAllProducts({
      countrySlug: country,
      currentPage: 1,
      pageSize,
    });
    productsCount = allProducts.length;

    // Estimate total pages (assuming 50 products per page)
    if (productsCount > 0) {
      totalPages = Math.ceil(productsCount / pageSize);
    }
  } catch (error) {
    console.error("Error fetching products count for metadata:", error);
  }

  // Build pagination URLs
  const baseUrl = `https://tuut.shop/${localeCountry}/products`;
  const searchParamsWithoutPage = { ...resolvedSearchParams };
  delete searchParamsWithoutPage.page;
  const searchParamsString = new URLSearchParams(searchParamsWithoutPage).toString();

  const baseUrlWithParams = searchParamsString ? `${baseUrl}?${searchParamsString}` : baseUrl;

  const prevPageUrl = currentPage > 1
    ? currentPage === 2
      ? baseUrlWithParams
      : `${baseUrlWithParams}${searchParamsString ? "&" : "?"}page=${currentPage - 1}`
    : undefined;

  const nextPageUrl = currentPage < totalPages
    ? `${baseUrlWithParams}${searchParamsString ? "&" : "?"}page=${currentPage + 1}`
    : undefined;

  return generateProductsPageMetadata({
    localeCountry,
    searchParams: resolvedSearchParams,
    productsCount,
    currentPage,
    totalPages,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
    previousPageUrl: prevPageUrl,
    nextPageUrl: nextPageUrl,
  });
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Extract country from localeCountry (e.g., "en-EG" -> "EG")
  const country = resolvedParams.localeCountry.split("-")[1];
  const language = resolvedParams.localeCountry.split("-")[0];
  const isRTL = language === "ar";

  // Fetch products from the API for server-side rendering
  let products: Product[] = [];
  try {
    const { data: allProducts } = await requestFetchAllProducts({
      countrySlug: country,
      currentPage: 1,
      pageSize: 50,
    });

    products = allProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  // Build structured data
  const baseUrl = `https://tuut.shop/${resolvedParams.localeCountry}/products`;
  const searchParamsString = new URLSearchParams(resolvedSearchParams).toString();
  const currentUrl = searchParamsString ? `${baseUrl}?${searchParamsString}` : baseUrl;

  const isArabic = language === "ar";
  const countryName = getCountryNameFromCode(country);

  const pageName = isArabic ? `جميع المنتجات في ${countryName}` : `All Products in ${countryName}`;
  const pageDescription = isArabic
    ? `استعرض أفضل المنتجات والعروض في ${countryName}`
    : `Browse the best products and deals in ${countryName}`;

  // Breadcrumb items
  const breadcrumbItems = [
    { name: isArabic ? "الرئيسية" : "Home", url: `https://tuut.shop/${resolvedParams.localeCountry}` },
    { name: isArabic ? "المنتجات" : "Products", url: currentUrl },
  ];

  // Add filter-specific breadcrumbs
  if (resolvedSearchParams.search) {
    breadcrumbItems.push({
      name: isArabic ? `بحث: ${resolvedSearchParams.search}` : `Search: ${resolvedSearchParams.search}`,
      url: currentUrl,
    });
  }

  if (resolvedSearchParams.category) {
    breadcrumbItems.push({
      name: isArabic ? resolvedSearchParams.category : resolvedSearchParams.category,
      url: currentUrl,
    });
  }

  return (
    <>
      {/* Structured Data */}
      <ProductCollectionStructuredData
        products={products}
        url={currentUrl}
        name={pageName}
        description={pageDescription}
        language={language}
        country={countryName}
      />

      <BreadcrumbStructuredData items={breadcrumbItems} />

      <WebsiteStructuredData
        url={`https://tuut.shop/${resolvedParams.localeCountry}`}
        name="Tuut"
        description={isArabic ? "اكتشف أفضل المنتجات والعروض" : "Discover the best products and deals"}
      />

      <main className="min-h-screen">
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
              {m.BACK_TO_HOME()}
            </Link>
            <h1
              className="text-[#111827] mb-4"
              style={{ fontSize: "36px", fontWeight: 700 }}
            >
              {m.ALL_PRODUCTS()}
            </h1>
          </div>

          <ProductsClientPage
            initialProducts={products}
            initialSearchParams={resolvedSearchParams}
          />
        </div>
      </section>
    </main>
    </>
  );
}
