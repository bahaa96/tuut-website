import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CountryProvider } from "./contexts/CountryContext";
import { RouterProvider, useRouter } from "./router";
import { HomePage } from "./pages/HomePage";
import { SchemaInspectorPage } from "./pages/SchemaInspectorPage";
import { DealsPage } from "./pages/DealsPage";
import { StoresPage } from "./pages/StoresPage";
import { StoreDetailsPage } from "./pages/StoreDetailsPage";
import { BlogPage } from "./pages/BlogPage";

function AppContent() {
  const { currentPath } = useRouter();

  // Route matching
  const renderPage = () => {
    // Check for dynamic routes first
    if (currentPath.startsWith("/store/")) {
      return <StoreDetailsPage />;
    }
    if (currentPath.startsWith("/blog/")) {
      // Individual blog article page would go here
      // For now, redirect to blog list
      return <BlogPage />;
    }
    
    switch (currentPath) {
      case "/deals":
        return <DealsPage />;
      case "/stores":
        return <StoresPage />;
      case "/blog":
        return <BlogPage />;
      case "/schema_inspector":
        return <SchemaInspectorPage />;
      case "/":
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {renderPage()}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <LanguageProvider>
        <CountryProvider>
          <AppContent />
        </CountryProvider>
      </LanguageProvider>
    </RouterProvider>
  );
}
