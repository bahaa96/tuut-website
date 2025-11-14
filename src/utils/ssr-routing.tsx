import React from 'react';
import { HomePage } from '../pages/HomePage';
import { SchemaInspectorPage } from '../pages/SchemaInspectorPage';
import { DealsPage } from '../pages/DealsPage';
import { StoresPage } from '../pages/StoresPage';
import { StoreDetailsPage } from '../pages/StoreDetailsPage';
import { BlogPage } from '../pages/BlogPage';
import { ArticleDetailPage } from '../pages/ArticleDetailPage';
import { ProductsPage } from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import { DealDetailPage } from '../pages/DealDetailPage';
import { SearchPage } from '../pages/SearchPage';
import { StoreSearchTestPage } from '../pages/StoreSearchTestPage';
import { CategoryPage } from '../pages/CategoryPage';
import TranslationsInspectorPage from '../pages/TranslationsInspectorPage';
import { TrackedProductsPage } from '../pages/TrackedProductsPage';
import WishlistPage from '../pages/WishlistPage';
import AddProductPage from '../pages/AddProductPage';
import { TermsPage } from '../pages/TermsPage';
import { PrivacyPage } from '../pages/PrivacyPage';

// Export all page components for server-side use
export {
  HomePage,
  SchemaInspectorPage,
  DealsPage,
  StoresPage,
  StoreDetailsPage,
  BlogPage,
  ArticleDetailPage,
  ProductsPage,
  ProductDetailPage,
  DealDetailPage,
  SearchPage,
  StoreSearchTestPage,
  CategoryPage,
  TranslationsInspectorPage,
  TrackedProductsPage,
  WishlistPage,
  AddProductPage,
  TermsPage,
  PrivacyPage
};

// Shared routing function
export function getPageForPath(path: string): React.ComponentType<any> {
  // Check for dynamic routes first
  if (path.startsWith("/category/")) {
    return CategoryPage;
  }
  if (path.startsWith("/store/")) {
    return StoreDetailsPage;
  }
  if (path.startsWith("/product/")) {
    return ProductDetailPage;
  }
  if (path.startsWith("/deal/")) {
    return DealDetailPage;
  }
  if (path === "/tracked-products") {
    return TrackedProductsPage;
  }
  if (path === "/wishlist") {
    return WishlistPage;
  }
  if (path === "/add-product") {
    return AddProductPage;
  }
  if (path.startsWith("/guides/") && path !== "/guides") {
    // Individual guide/article page
    return ArticleDetailPage;
  }
  // Legacy /blog/ routes redirect to /guides/
  if (path.startsWith("/blog/") && path !== "/blog") {
    return ArticleDetailPage;
  }

  // Check for search route (including query params)
  if (path.startsWith("/search")) {
    return SearchPage;
  }

  switch (path) {
    case "/deals":
      return DealsPage;
    case "/stores":
      return StoresPage;
    case "/products":
      return ProductsPage;
    case "/terms":
      return TermsPage;
    case "/privacy":
      return PrivacyPage;
    case "/guides":
    case "/blog":
      return BlogPage;
    case "/schema_inspector":
      return SchemaInspectorPage;
    case "/translations_inspector":
      return TranslationsInspectorPage;
    case "/store_search_test":
      return StoreSearchTestPage;
    case "/":
    default:
      return HomePage;
  }
}