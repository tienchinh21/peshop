import { cache } from "react";

/**
 * Creates a cached version of an async function using React's cache
 * Useful for server-side data fetching with automatic deduplication
 * 
 * @param fn - The async function to cache
 * @returns Cached version of the function
 */
export const createCachedFetcher = <TArgs extends any[], TReturn>(fn: (...args: TArgs) => Promise<TReturn>) => {
  return cache(fn);
};
export const CACHE_REVALIDATION = {
  PRODUCT_DETAIL: 60,
  PRODUCT_LIST: 30,
  SHOP_DETAIL: 60,
  CATEGORY: 300,
  STATIC_DATA: 3600
} as const;
export const createCacheOptions = (revalidateSeconds: number) => ({
  next: {
    revalidate: revalidateSeconds
  }
});