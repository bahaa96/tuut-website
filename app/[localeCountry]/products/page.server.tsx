import { Header } from "@/components/Header"
import Footer from "@/components/Footer"
import { fetchProducts } from "../../../utils/api"
import ProductsClientPage from "./page.client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface Product {
  id: number;
  title?: string;
  description?: string;
  price?: number;
  original_price?: number;
  currency?: string;
  rating?: number;
  store?: string;
  url?: string;
  images?: string[];
  categories?: string[];
  available?: boolean;
  created_at?: string;
}

interface ProductsPageProps {
  params: Promise<{
    localeCountry: string;
  }>;
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  // Await params as required by Next.js 15
  const resolvedParams = await params;

  // Extract country from localeCountry (e.g., "en-EG" -> "EG")
  const country = resolvedParams.localeCountry.split('-')[1];
  const language = resolvedParams.localeCountry.split('-')[0];
  const isRTL = language === 'ar';

  // Fetch products server-side
  const productsResult = await fetchProducts({
    country: country,
    limit: 12
  });

  const products = productsResult.success ? productsResult.products : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="py-12 md:py-16 bg-[#E8F3E8] min-h-screen">
          <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Link href="/" className="inline-flex items-center text-[#5FB57A] hover:text-[#4FA669] mb-4 transition-colors">
                <ArrowLeft className={`h-5 w-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                {language === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}
              </Link>
              <h1 className="text-[#111827] mb-4" style={{ fontSize: '36px', fontWeight: 700 }}>
                {language === 'ar' ? 'جميع المنتجات' : 'All Products'}
              </h1>
              <p className="text-[#6B7280] text-sm">
                {language === 'ar'
                  ? `عرض المنتجات لـ: ${country}`
                  : `Showing products for: ${country}`
                }
              </p>
            </div>

            <ProductsClientPage
              initialProducts={products}
              language={language}
              isRTL={isRTL}
              country={country}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}