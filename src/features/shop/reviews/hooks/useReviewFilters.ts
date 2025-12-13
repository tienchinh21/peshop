"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { ReviewFilterParams, SortOption } from "../types";

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 10;
const DEFAULT_SORT: SortOption = "createdAt,desc";
const DEBOUNCE_DELAY = 300;

/**
 * Parse URL search params into filter state
 */
const parseFiltersFromURL = (searchParams: URLSearchParams): ReviewFilterParams => {
  const page = searchParams.get("page");
  const size = searchParams.get("size");
  const sort = searchParams.get("sort");
  const rating = searchParams.get("rating");
  const search = searchParams.get("search");
  const productId = searchParams.get("productId");
  const variantId = searchParams.get("variantId");
  const orderId = searchParams.get("orderId");

  return {
    page: page ? parseInt(page, 10) : DEFAULT_PAGE,
    size: size ? parseInt(size, 10) : DEFAULT_SIZE,
    sort: (sort as SortOption) || DEFAULT_SORT,
    rating: rating ? parseInt(rating, 10) : null,
    search: search || "",
    productId: productId || null,
    variantId: variantId || null,
    orderId: orderId || null,
  };
};

/**
 * Serialize filter state to URL search params
 */
const serializeFiltersToURL = (filters: ReviewFilterParams): string => {
  const params = new URLSearchParams();

  if (filters.page && filters.page !== DEFAULT_PAGE) {
    params.set("page", filters.page.toString());
  }
  if (filters.size && filters.size !== DEFAULT_SIZE) {
    params.set("size", filters.size.toString());
  }
  if (filters.sort && filters.sort !== DEFAULT_SORT) {
    params.set("sort", filters.sort);
  }
  if (filters.rating) {
    params.set("rating", filters.rating.toString());
  }
  if (filters.search) {
    params.set("search", filters.search);
  }
  if (filters.productId) {
    params.set("productId", filters.productId);
  }
  if (filters.variantId) {
    params.set("variantId", filters.variantId);
  }
  if (filters.orderId) {
    params.set("orderId", filters.orderId);
  }

  return params.toString();
};


/**
 * Hook for managing review filter state with URL synchronization
 *
 * Features:
 * - Syncs filter state with URL query parameters
 * - Debounced search input (300ms)
 * - Supports rating, search, sort, and pagination filters
 *
 * Requirements: 2.2, 3.2, 4.3, 5.4
 *
 * @example
 * const { filters, setRatingFilter, setSearchTerm, setSortOption, setPage } = useReviewFilters();
 */
export const useReviewFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse initial filters from URL
  const initialFilters = useMemo(
    () => parseFiltersFromURL(searchParams),
    [searchParams]
  );

  // Local state for immediate UI updates
  const [filters, setFilters] = useState<ReviewFilterParams>(initialFilters);
  
  // Separate state for search input (for debouncing)
  const [searchInput, setSearchInput] = useState(initialFilters.search || "");

  // Sync filters when URL changes (e.g., browser back/forward)
  useEffect(() => {
    const urlFilters = parseFiltersFromURL(searchParams);
    setFilters(urlFilters);
    setSearchInput(urlFilters.search || "");
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters: ReviewFilterParams) => {
      const queryString = serializeFiltersToURL(newFilters);
      const newURL = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(newURL, { scroll: false });
    },
    [router, pathname]
  );

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== filters.search) {
        const newFilters = {
          ...filters,
          search: searchInput,
          page: DEFAULT_PAGE, // Reset to first page on search
        };
        setFilters(newFilters);
        updateURL(newFilters);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [searchInput, filters, updateURL]);

  // Filter setters
  const setRatingFilter = useCallback(
    (rating: number | null) => {
      const newFilters = {
        ...filters,
        rating,
        page: DEFAULT_PAGE, // Reset to first page on filter change
      };
      setFilters(newFilters);
      updateURL(newFilters);
    },
    [filters, updateURL]
  );

  const setSearchTerm = useCallback((search: string) => {
    setSearchInput(search);
  }, []);

  const setSortOption = useCallback(
    (sort: SortOption) => {
      const newFilters = {
        ...filters,
        sort,
        page: DEFAULT_PAGE, // Reset to first page on sort change
      };
      setFilters(newFilters);
      updateURL(newFilters);
    },
    [filters, updateURL]
  );

  const setPage = useCallback(
    (page: number) => {
      const newFilters = {
        ...filters,
        page,
      };
      setFilters(newFilters);
      updateURL(newFilters);
    },
    [filters, updateURL]
  );

  const setPageSize = useCallback(
    (size: number) => {
      const newFilters = {
        ...filters,
        size,
        page: DEFAULT_PAGE, // Reset to first page on size change
      };
      setFilters(newFilters);
      updateURL(newFilters);
    },
    [filters, updateURL]
  );

  const setProductIdFilter = useCallback(
    (productId: string | null) => {
      const newFilters = {
        ...filters,
        productId,
        page: DEFAULT_PAGE, // Reset to first page on filter change
      };
      setFilters(newFilters);
      updateURL(newFilters);
    },
    [filters, updateURL]
  );

  const setVariantIdFilter = useCallback(
    (variantId: string | null) => {
      const newFilters = {
        ...filters,
        variantId,
        page: DEFAULT_PAGE, // Reset to first page on filter change
      };
      setFilters(newFilters);
      updateURL(newFilters);
    },
    [filters, updateURL]
  );

  const setOrderIdFilter = useCallback(
    (orderId: string | null) => {
      const newFilters = {
        ...filters,
        orderId,
        page: DEFAULT_PAGE, // Reset to first page on filter change
      };
      setFilters(newFilters);
      updateURL(newFilters);
    },
    [filters, updateURL]
  );

  const resetFilters = useCallback(() => {
    const defaultFilters: ReviewFilterParams = {
      page: DEFAULT_PAGE,
      size: DEFAULT_SIZE,
      sort: DEFAULT_SORT,
      rating: null,
      search: "",
      productId: null,
      variantId: null,
      orderId: null,
    };
    setFilters(defaultFilters);
    setSearchInput("");
    updateURL(defaultFilters);
  }, [updateURL]);

  return {
    filters,
    searchInput,
    setRatingFilter,
    setSearchTerm,
    setSortOption,
    setPage,
    setPageSize,
    setProductIdFilter,
    setVariantIdFilter,
    setOrderIdFilter,
    resetFilters,
  };
};
