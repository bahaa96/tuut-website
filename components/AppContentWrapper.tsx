"use client";

import { useRouter } from "next/router";
import { getPageForPath } from "@/utils/ssr-routing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/FooterSSR";
import { Toaster } from "@/components/ui/sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface AppContentWrapperProps {
  footerData: any;
  defaultTranslations: any;
}

export function AppContentWrapper({ footerData, defaultTranslations }: AppContentWrapperProps) {
  const router = useRouter();
  const { isRTL } = useLanguage();

  // Guard against SSR
  if (typeof window === 'undefined') {
    return null;
  }

  // Get the page component for the current path using shared routing
  const PageComponent = getPageForPath(router.pathname);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageComponent />
      </main>
      <Footer
        featuredDeals={footerData.featuredDeals}
        topStores={footerData.topStores}
        articles={footerData.articles}
        categories={footerData.categories}
        bestSellingProducts={footerData.bestSellingProducts}
        translations={defaultTranslations}
        isRTL={isRTL}
      />
      <Toaster />
    </div>
  );
}