/**
 * Utility functions for language-specific slug handling
 */

export interface SlugEntity {
  slug_en?: string;
  slug_ar?: string;
  id?: string | number;
}

/**
 * Get the appropriate slug based on language
 * @param entity - Object containing slug_en, slug_ar, and id
 * @param isRTL - Whether the current language is RTL (Arabic)
 * @returns The appropriate slug or fallback to id
 */
export function getLocalizedSlug(entity: SlugEntity, isRTL: boolean = false): string {
  // Use Arabic slug for RTL languages, English slug for LTR languages
  if (isRTL && entity.slug_ar) {
    return entity.slug_ar;
  }

  // Fallback to English slug
  if (entity.slug_en) {
    return entity.slug_en;
  }

  // Final fallback to ID
  return String(entity.id || '');
}

/**
 * Generate a localized URL for entities with language-specific slugs
 * @param entity - Object containing slug_en, slug_ar, and id
 * @param basePath - Base path for the URL (e.g., '/deal', '/store', '/category')
 * @param isRTL - Whether the current language is RTL (Arabic)
 * @returns Complete localized URL
 */
export function getLocalizedUrl(
  entity: SlugEntity,
  basePath: string,
  isRTL: boolean = false
): string {
  const slug = getLocalizedSlug(entity, isRTL);
  return `${basePath}/${slug}`;
}

/**
 * Create a language-aware Link component props object
 * @param entity - Object containing slug_en, slug_ar, and id
 * @param basePath - Base path for the URL (e.g., '/deal', '/store', '/category')
 * @param isRTL - Whether the current language is RTL (Arabic)
 * @returns URL object or string suitable for routing
 */
export function createLocalizedLink(
  entity: SlugEntity,
  basePath: string,
  isRTL: boolean = false
): string {
  return getLocalizedUrl(entity, basePath, isRTL);
}