import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { createClient } from "../../../utils/supabase/client"
import DealsClientPage from "./DealsClient"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Deal } from "../../../domain-models"

interface DealsPageProps {
  params: Promise<{
    localeCountry: string;
  }>;
}

export default async function DealsPage({ params }: DealsPageProps) {
  // Await params as required by Next.js 15
  const resolvedParams = await params;

  // Extract country from localeCountry (e.g., "en-EG" -> "EG")
  const country = resolvedParams.localeCountry.split('-')[1];
  const language = resolvedParams.localeCountry.split('-')[0];
  const isRTL = language === 'ar';

  // Fetch deals server-side
  let deals: Deal[] = [];

  try {
    const supabase = createClient();

    // Fetch deals with store data using a join
    const { data: dealsData, error: dealsError } = await supabase
      .from('deals')
      .select(`
        *,
        stores (
          name,
          store_name,
          title,
          slug,
          logo_url
        )
      `)
      .order('created_at', { ascending: false });

    if (!dealsError && dealsData && dealsData.length > 0) {
      // Format deals with store data from the join
      deals = dealsData.map((deal: any) => {
        const store = deal.stores;
        const storeName = store?.store_name || store?.name || store?.title;

        return {
          id: deal.id,
          slug: deal.slug,
          title: deal.title,
          title_ar: deal.title_ar,
          description: deal.description,
          description_ar: deal.description_ar,
          discount_percentage: deal.discount_percentage,
          discount_amount: deal.discount_amount,
          original_price: deal.original_price,
          discounted_price: deal.discounted_price,
          code: deal.code,
          store_id: deal.store_id,
          store_slug: store?.slug,
          store_name: storeName,
          store_logo: store?.logo_url,
          category_name: deal.category_name,
          expires_at: deal.expires_at,
          is_verified: deal.is_verified,
          featured: deal.featured,
        };
      });
    }

  } catch (error) {
    console.error('Error fetching deals data:', error);
  }

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
                {language === 'ar' ? 'جميع العروض' : 'All Deals'}
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
      <Footer />
    </div>
  )
}