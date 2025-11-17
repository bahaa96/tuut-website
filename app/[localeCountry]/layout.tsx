import { Header } from "../../components/Header";
import { Footer } from "../../components/FooterSSR";
import { fetchFooterData } from "../../lib/supabase-fetch";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ localeCountry: string }>;
}) {
  // Await params as required by Next.js 15
  const resolvedParams = await params;

  // Extract country from localeCountry (e.g., "en-EG" -> "EG")
  const country = resolvedParams.localeCountry.split('-')[1];
  const language = resolvedParams.localeCountry.split('-')[0];
  const isRTL = language === 'ar';

  // Fetch footer data server-side
  let footerData = {
    featuredDeals: [],
    topStores: [],
    articles: [],
    categories: [],
    bestSellingProducts: []
  };

  try {
    footerData = await fetchFooterData(country.toUpperCase());
  } catch (error) {
    console.error('Error fetching footer data:', error);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer
        featuredDeals={footerData.featuredDeals}
        topStores={footerData.topStores}
        articles={footerData.articles}
        categories={footerData.categories}
        bestSellingProducts={footerData.bestSellingProducts}
        translations={{
          footer: {
            about: isRTL ? 'من نحن' : 'About',
            careers: isRTL ? 'وظائف' : 'Careers',
            help: isRTL ? 'مساعدة' : 'Help',
            faq: isRTL ? 'الأسئلة الشائعة' : 'FAQ',
            contact: isRTL ? 'اتصل بنا' : 'Contact',
            company: isRTL ? 'الشركة' : 'Company',
            featuredDeals: isRTL ? 'العروض المميزة' : 'Featured Deals',
            shoppingGuides: isRTL ? 'أدلة التسوق' : 'Shopping Guides',
            topStores: isRTL ? 'أفضل المتاجر' : 'Top Stores',
            viewAll: isRTL ? 'عرض الكل' : 'View All',
            tagline: isRTL ? 'اكتشف أفضل العروض والخصومات في متجرك المفضل' : 'Discover the best deals and discounts at your favorite stores',
            copyright: isRTL ? 'جميع الحقوق محفوظة 2024 Tuut' : '© 2024 Tuut. All rights reserved.',
            followUs: isRTL ? 'تابعنا' : 'Follow Us'
          },
          testimonials: {
            downloadApp: isRTL ? 'قم بتنزيل تطبيقنا' : 'Download Our App',
            downloadOn: isRTL ? 'تحميل من' : 'Download on',
            appStore: isRTL ? 'App Store' : 'App Store',
            getItOn: isRTL ? 'الحصول عليه من' : 'Get it on',
            googlePlay: isRTL ? 'Google Play' : 'Google Play'
          }
        }}
        isRTL={isRTL}
      />
    </div>
  );
}