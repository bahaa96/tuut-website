import { AppContentWrapper } from "@/components/AppContentWrapper";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CountryProvider } from "@/contexts/CountryContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SSRDataProvider } from "@/contexts/SSRDataContext";
import { RouterProvider } from "@/router";
import { fetchFooterData } from "@/lib/supabase-fetch";

export default async function Home() {
  // Fetch footer data server-side with default country (Egypt)
  let footerData = {
    featuredDeals: [],
    topStores: [],
    articles: [],
    categories: [],
    bestSellingProducts: []
  };

  try {
    footerData = await fetchFooterData('EG');
  } catch (error) {
    console.error('Error fetching footer data:', error);
  }

  // Default translations (English)
  const defaultTranslations = {
    footer: {
      about: 'About',
      careers: 'Careers',
      help: 'Help',
      faq: 'FAQ',
      contact: 'Contact',
      company: 'Company',
      featuredDeals: 'Featured Deals',
      shoppingGuides: 'Shopping Guides',
      topStores: 'Top Stores',
      viewAll: 'View All',
      tagline: 'Discover the best deals and discounts at your favorite stores',
      copyright: '© 2024 Tuut. All rights reserved.',
      followUs: 'Follow Us'
    },
    testimonials: {
      downloadApp: 'Download Our App',
      downloadOn: 'Download on',
      appStore: 'App Store',
      getItOn: 'Get it on',
      googlePlay: 'Google Play'
    }
  };

  // Get initial SSR data from window if available (for hydration)
  const getInitialSSRData = () => {
    if (typeof window !== 'undefined' && (window as any).__INITIAL_DATA__) {
      const data = (window as any).__INITIAL_DATA__;
      // Clear the initial data to prevent memory leaks
      delete (window as any).__INITIAL_DATA__;
      return data;
    }
    return {};
  };

  return (
    <SSRDataProvider data={getInitialSSRData()}>
      <RouterProvider>
        <LanguageProvider>
          <CountryProvider>
            <AuthProvider>
              <AppContentWrapper footerData={footerData} defaultTranslations={defaultTranslations} />
            </AuthProvider>
          </CountryProvider>
        </LanguageProvider>
      </RouterProvider>
    </SSRDataProvider>
  );
}