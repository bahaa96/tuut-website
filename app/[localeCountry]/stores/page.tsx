import { fetchStoresByCountrySlug } from "../../../lib/supabase-fetch"
import StoresClientPage from "./StoresClient"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface StoresPageProps {
  params: Promise<{
    localeCountry: string;
  }>;
}

export default async function StoresPage({ params }: StoresPageProps) {
  // Await params as required by Next.js 15
  const resolvedParams = await params;

  // Extract country from localeCountry (e.g., "en-EG" -> "EG")
  const country = resolvedParams.localeCountry.split('-')[1];
  const language = resolvedParams.localeCountry.split('-')[0];
  const isRTL = language === 'ar';

  // Fetch stores data server-side using supabase-fetch with country_slug filter
  let stores: any[] = [];

  try {
    const storesResult = await fetchStoresByCountrySlug(country.toUpperCase());

    if (!storesResult.error && storesResult.data) {
      stores = storesResult.data;
    } else {
      console.error('Error fetching stores data:', storesResult.error);
    }

  } catch (error) {
    console.error('Error fetching stores data:', error);
  }

  return (
    <main>
      <section className="py-12 md:py-16 bg-[#E8F3E8] min-h-screen">
        <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          {/* Header */}
          <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <Link href="/" className="inline-flex items-center text-[#5FB57A] hover:text-[#4FA669] mb-4 transition-colors">
              <ArrowLeft className={`h-5 w-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
              {language === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}
            </Link>
            <h1 className="text-[#111827] mb-3" style={{ fontSize: '48px', fontWeight: 700 }}>
              {language === 'ar' ? 'جميع المتاجر' : 'All Stores'}
            </h1>
            <p className="text-[#6B7280] text-lg mb-4">
              {language === 'en'
                ? `Discover ${stores.length} stores with exclusive deals and coupons`
                : `اكتشف ${stores.length} متجر مع عروض وكوبونات حصرية`
              }
            </p>
          </div>

          <StoresClientPage
            initialStores={stores}
            language={language}
            isRTL={isRTL}
            country={country}
          />
        </div>
      </section>
    </main>
  )
}