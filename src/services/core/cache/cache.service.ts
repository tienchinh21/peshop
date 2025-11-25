import { cache } from "react";

/**
 * Creates a cached version of an async function using React's cache
 * Useful for server-side data fetching with automatic deduplication
 * 
 * @param fn - The async function to cache
 * @returns Cached version of the function
 */
export const createCachedFetcher = <TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>
) => {
  return cache(fn);
};

/**
 * Cache configuration for different data types
 * Used with Next.js fetch revalidation
 */
export const CACHE_REVALIDATION = {
  PRODUCT_DETAIL: 60, // 1 minute
  PRODUCT_LIST: 30, // 30 seconds
  SHOP_DETAIL: 60, // 1 minute
  CATEGORY: 300, // 5 minutes
  STATIC_DATA: 3600, // 1 hour
} as const;

/**
 * Creates fetch options with caching configuration
 */
export const createCacheOptions = (revalidateSeconds: number) => ({
  next: {
    revalidate: revalidateSeconds,
  },
});

