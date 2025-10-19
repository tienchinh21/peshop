import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getSearchSuggestions,
  searchProducts,
} from "@/services/api/users/search.service";
import type {
  SearchSuggestion,
  SearchFilters,
  SearchResultsResponse,
} from "@/types/users/search.types";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions with debounce
  const { data: suggestionsData, isLoading: isLoadingSuggestions } =
    useSearchSuggestions(searchQuery);

  const suggestions = suggestionsData?.data || [];

  // Handle input change
  const handleInputChange = useCallback((value: string) => {
    setSearchQuery(value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  }, []);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((keyword: string) => {
    setSearchQuery(keyword);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions || suggestions.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            const selectedKeyword = suggestions[selectedIndex].keyword;
            handleSuggestionClick(selectedKeyword);
          }
          break;
        case "Escape":
          setShowSuggestions(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [showSuggestions, suggestions, selectedIndex, handleSuggestionClick]
  );

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is outside both input and dropdown
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
    setSearchQuery("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleInputChange,
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
  };
};
