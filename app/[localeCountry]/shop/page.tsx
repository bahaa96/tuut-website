import { fetchProducts } from "../../../utils/api"
import ShopClientPage from "./page.client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Product } from "../types"

interface ShopPageProps {
  params: Promise<{
    localeCountry: string;
  }>;
}

export default async function ShopPage({ params }: ShopPageProps) {
  // Await params as required by Next.js 15
  const resolvedParams = await params;

  // Extract country from localeCountry (e.g., "en-EG" -> "EG")
  const country = resolvedParams.localeCountry.split('-')[1];
  const language = resolvedParams.localeCountry.split('-')[0];
  const isRTL = language === 'ar';

  // Fetch products server-side from Supabase products table
  const productsResult = await fetchProducts({
    country: country,
    limit: 12
  });

  const products = productsResult.success ? productsResult.products || productsResult.data || [] : [];

  return (
    <main className="min-h-screen">
        <section className="py-12 md:py-16 bg-[#E8F3E8] min-h-screen">
          <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Link href="/" className="inline-flex items-center text-[#5FB57A] hover:text-[#4FA669] mb-4 transition-colors">
                <ArrowLeft className={`h-5 w-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                {language === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}
              </Link>
              <h1 className="text-[#111827] mb-4" style={{ fontSize: '36px', fontWeight: 700 }}>
                {language === 'ar' ? 'المتجر' : 'Shop'}
              </h1>
              <p className="text-[#6B7280] text-sm">
                {language === 'ar'
                  ? `اكتشف منتجات رائعة لـ: ${country}`
                  : `Discover amazing products for: ${country}`
                }
              </p>
            </div>

            <ShopClientPage
              initialProducts={products}
              language={language}
              isRTL={isRTL}
              country={country}
            />
          </div>
        </section>
    </main>
  )
}