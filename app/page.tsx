import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CountryProvider } from "@/contexts/CountryContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SSRDataProvider } from "@/contexts/SSRDataContext";
import { RouterProvider, useRouter } from "@/router";
import { getPageForPath } from "@/utils/ssr-routing";

function AppContent() {
  const { currentPath } = useRouter();

  // Get the page component for the current path using shared routing
  const PageComponent = getPageForPath(currentPath);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageComponent />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function Home() {
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
              <AppContent />
            </AuthProvider>
          </CountryProvider>
        </LanguageProvider>
      </RouterProvider>
    </SSRDataProvider>
  );
}