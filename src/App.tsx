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
import { ArticleDetailPage } from "./pages/ArticleDetailPage";
import { ProductsPage } from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";

function AppContent() {
  const { currentPath } = useRouter();

  // Route matching
  const renderPage = () => {
    // Check for dynamic routes first
    if (currentPath.startsWith("/store/")) {
      return <StoreDetailsPage />;
    }
    if (currentPath.startsWith("/product/")) {
      return <ProductDetailPage />;
    }
    if (currentPath.startsWith("/blog/") && currentPath !== "/blog") {
      // Individual blog article page
      return <ArticleDetailPage />;
    }
    
    switch (currentPath) {
      case "/deals":
        return <DealsPage />;
      case "/stores":
        return <StoresPage />;
      case "/products":
        return <ProductsPage />;
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
