import React from 'react'

// Simple fallback component for all pages
const FallbackPage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Tuut Website</h1>
      <p className="text-lg text-muted-foreground">SSR Website is loading...</p>
    </div>
  </div>
)

// Route mapping function - simplified for SSR deployment
export function getPageForPath(path: string): React.ComponentType {
  // For now, return the same fallback component for all routes
  // This ensures the SSR build works
  return FallbackPage
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