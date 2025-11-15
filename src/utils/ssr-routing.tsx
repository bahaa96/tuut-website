import React from 'react'

// Import page components - start with the absolute essentials
import { HomePage } from '../pages/HomePage'
import { DealsPage } from '../pages/DealsPage'
import { StoresPage } from '../pages/StoresPage'
import { BlogPage } from '../pages/BlogPage'
import { PrivacyPage } from '../pages/PrivacyPage'
import { TermsPage } from '../pages/TermsPage'

// We'll add these pages later once we check their exports
// import { DealDetailPage } from '../pages/DealDetailPage'
// import { StoreDetailsPage } from '../pages/StoreDetailsPage'
// import { ProductDetailPage } from '../pages/ProductDetailPage'
// import { CategoryPage } from '../pages/CategoryPage'
// import { ArticleDetailPage } from '../pages/ArticleDetailPage'
// import { SearchPage } from '../pages/SearchPage'
// import { ProductsPage } from '../pages/ProductsPage'
// import { WishlistPage } from '../pages/WishlistPage'
// import { TrackedProductsPage } from '../pages/TrackedProductsPage'

// Simple fallback component for pages not found
const FallbackPage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Tuut Website</h1>
      <p className="text-lg text-muted-foreground">SSR Website is loading...</p>
    </div>
  </div>
)

// Route mapping function
export function getPageForPath(path: string): React.ComponentType {
  const cleanPath = path.replace(/\/$/, '').split('?')[0]

  switch (cleanPath) {
    // Home page
    case '':
    case '/':
      return HomePage

    // Main pages
    case '/deals':
      return DealsPage
    case '/stores':
      return StoresPage
    case '/blog':
    case '/guides':
      return BlogPage
    case '/privacy':
      return PrivacyPage
    case '/terms':
      return TermsPage

    // These pages will be added later once we check their exports
    // case '/products':
    //   return ProductsPage
    // case '/search':
    //   return SearchPage
    // case '/wishlist':
    //   return WishlistPage
    // case '/tracked-products':
    //   return TrackedProductsPage

    // Dynamic routes - will be added later
    default:
      // For now, return fallback for all dynamic routes
      // TODO: Add these routes once we check their exports
      // if (cleanPath.startsWith('/deal/')) return DealDetailPage
      // if (cleanPath.startsWith('/store/')) return StoreDetailsPage
      // if (cleanPath.startsWith('/product/')) return ProductDetailPage
      // if (cleanPath.startsWith('/category/')) return CategoryPage
      // if (cleanPath.startsWith('/blog/')) return ArticleDetailPage
      // if (cleanPath.startsWith('/guides/')) return ArticleDetailPage

      // Return fallback for unknown routes
      return FallbackPage
  }
}

// Function to extract route parameters
export function getRouteParams(path: string): Record<string, string> {
  const params: Record<string, string> = {}
  const cleanPath = path.replace(/\/$/, '').split('?')[0]

  // Extract store slug
  const storeMatch = cleanPath.match(/^\/store\/(.+)$/);
  if (storeMatch) {
    params.storeSlug = storeMatch[1]
  }

  // Extract deal slug
  const dealMatch = cleanPath.match(/^\/deal\/(.+)$/);
  if (dealMatch) {
    params.dealSlug = dealMatch[1]
  }

  // Extract product slug
  const productMatch = cleanPath.match(/^\/product\/(.+)$/);
  if (productMatch) {
    params.productSlug = productMatch[1]
  }

  // Extract category slug
  const categoryMatch = cleanPath.match(/^\/category\/(.+)$/);
  if (categoryMatch) {
    params.categorySlug = categoryMatch[1]
  }

  // Extract article slug
  const articleMatch = cleanPath.match(/^\/(?:blog|article)\/(.+)$/);
  if (articleMatch) {
    params.articleSlug = articleMatch[1]
  }

  return params
}