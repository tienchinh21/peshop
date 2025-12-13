import type { ReviewFilterParams } from "../types/review.types";

/**
 * Build Spring Filter query string from filter parameters
 * Supports rating filter with exact match and search filter with case-insensitive matching
 * Supports productId, variantId, and orderId filters
 *
 * @param params - Filter parameters containing rating, search, and other filter values
 * @returns Spring Filter query string
 */
export const buildReviewFilter = (params: ReviewFilterParams): string => {
  const conditions: string[] = [];

  // Rating filter with exact match syntax
  if (params.rating !== undefined && params.rating !== null) {
    conditions.push(`rating : ${params.rating}`);
  }

  // Product ID filter
  if (params.productId !== undefined && params.productId !== null) {
    conditions.push(`product.id : '${params.productId}'`);
  }

  // Variant ID filter
  if (params.variantId !== undefined && params.variantId !== null) {
    conditions.push(`variant.id : '${params.variantId}'`);
  }

  // Order ID filter
  if (params.orderId !== undefined && params.orderId !== null) {
    conditions.push(`order.id : '${params.orderId}'`);
  }

  // Search filter with case-insensitive matching on content and user.name
  if (params.search && params.search.trim()) {
    const searchTerm = params.search.trim();
    // Escape single quotes in search term to prevent injection
    const escapedSearch = searchTerm.replace(/'/g, "''");
    conditions.push(
      `(content ~~ '${escapedSearch}' or user.name ~~ '${escapedSearch}')`
    );
  }

  return conditions.join(" and ");
};
