"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSearchSuggestions, searchProducts } from "../services";
import type { SearchFilters } from "../types";

/**
 * Query keys for search
 */
export const searchKeys = {
  all: ["search"] as const,
  suggestions: (keyword: string) =>
    [...searchKeys.all, "suggestions", keyword] as const,
  results: (filters: SearchFilters) =>
    [...searchKeys.all, "results", filters] as const,
};

/**
 * Hook for search suggestions with debounce
 * @param keyword - Search keyword
 * @param debounceMs - Debounce delay in milliseconds (default: 200ms)
 * @returns Search suggestions data and loading state
 */
export const useSearchSuggestions = (
  keyword: string,
  debounceMs: number = 100
) => {
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

  // Debounce the keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [keyword, debounceMs]);

  // Fetch suggestions only if keyword has at least 2 characters
  const shouldFetch = debouncedKeyword.trim().length >= 2;

  return useQuery({
    queryKey: searchKeys.suggestions(debouncedKeyword),
    queryFn: () => getSearchSuggestions(debouncedKeyword),
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};

/**
 * Hook for search results
 * @param filters - Search filters
 * @returns Search results data and loading state
 */
export const useSearchResults = (filters: SearchFilters) => {
  const shouldFetch = filters.keyword.trim().length > 0;

  return useQuery({
    queryKey: searchKeys.results(filters),
    queryFn: () => searchProducts(filters),
    enabled: shouldFetch,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Hook for managing search state with suggestions dropdown
 * Provides all necessary state and handlers for SearchBar component
 */
export const useSearchWithSuggestions = () => {
  const [searchQuery, setSearchQueryState] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions with debounce
  const { data: suggestionsData, isLoading: isLoadingSuggestions } =
    useSearchSuggestions(searchQuery);

  const suggestions = suggestionsData?.data || [];

  // Handle input change - directly set value without extra logic
  const handleInputChange = useCallback((value: string) => {
    setSearchQueryState(value);
    if (value.trim().length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, []);

  // Set search query directly (for external use)
  const setSearchQuery = useCallback((value: string) => {
    setSearchQueryState(value);
  }, []);

  // Handle suggestion click - returns the keyword for navigation
  const handleSuggestionClick = useCallback((keyword: string) => {
    setSearchQueryState(keyword);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setPendingNavigation(keyword);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Handle arrow navigation only when suggestions are visible
      if (showSuggestions && suggestions.length > 0) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setSelectedIndex((prev) =>
              prev < suggestions.length - 1 ? prev + 1 : prev
            );
            return;
          case "ArrowUp":
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
            return;
          case "Escape":
            e.preventDefault();
            setShowSuggestions(false);
            setSelectedIndex(-1);
            return;
        }
      }

      // Handle Enter key
      if (e.key === "Enter") {
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          // User selected a suggestion with keyboard - navigate with selected keyword
          e.preventDefault();
          const selectedKeyword = suggestions[selectedIndex].keyword;
          handleSuggestionClick(selectedKeyword);
        } else {
          // No suggestion selected - let form submit with current query
          setShowSuggestions(false);
        }
      }
    },
    [showSuggestions, suggestions, selectedIndex, handleSuggestionClick]
  );

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const isOutsideInput =
        inputRef.current && !inputRef.current.contains(target);
      const isOutsideDropdown =
        dropdownRef.current && !dropdownRef.current.contains(target);

      if (isOutsideInput && isOutsideDropdown) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQueryState("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  // Reset pending navigation after it's been consumed
  const consumePendingNavigation = useCallback(() => {
    const keyword = pendingNavigation;
    setPendingNavigation(null);
    return keyword;
  }, [pendingNavigation]);

  return {
    searchQuery,
    setSearchQuery: handleInputChange,
    setSearchQueryDirect: setSearchQuery,
    suggestions,
    isLoadingSuggestions,
    showSuggestions,
    setShowSuggestions,
    selectedIndex,
    handleSuggestionClick,
    handleKeyDown,
    clearSearch,
    inputRef,
    dropdownRef,
    pendingNavigation,
    consumePendingNavigation,
  };
};
