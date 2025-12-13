"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSearchSuggestions, searchProducts } from "../services";
import type { SearchFilters } from "../types";
export const searchKeys = {
  all: ["search"] as const,
  suggestions: (keyword: string) => [...searchKeys.all, "suggestions", keyword] as const,
  results: (filters: SearchFilters) => [...searchKeys.all, "results", filters] as const
};

/**
 * Hook for search suggestions with debounce
 * @param keyword - Search keyword
 * @param debounceMs - Debounce delay in milliseconds (default: 200ms)
 * @returns Search suggestions data and loading state
 */
export const useSearchSuggestions = (keyword: string, debounceMs: number = 100) => {
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, debounceMs);
    return () => {
      clearTimeout(timer);
    };
  }, [keyword, debounceMs]);
  const shouldFetch = debouncedKeyword.trim().length >= 2;
  return useQuery({
    queryKey: searchKeys.suggestions(debouncedKeyword),
    queryFn: () => getSearchSuggestions(debouncedKeyword),
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1
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
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2
  });
};
export const useSearchWithSuggestions = () => {
  const [searchQuery, setSearchQueryState] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    data: suggestionsData,
    isLoading: isLoadingSuggestions
  } = useSearchSuggestions(searchQuery);
  const suggestions = suggestionsData?.data || [];
  const handleInputChange = useCallback((value: string) => {
    setSearchQueryState(value);
    if (value.trim().length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, []);
  const setSearchQuery = useCallback((value: string) => {
    setSearchQueryState(value);
  }, []);
  const handleSuggestionClick = useCallback((keyword: string) => {
    setSearchQueryState(keyword);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setPendingNavigation(keyword);
  }, []);
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
          return;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          return;
        case "Escape":
          e.preventDefault();
          setShowSuggestions(false);
          setSelectedIndex(-1);
          return;
      }
    }
    if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        const selectedKeyword = suggestions[selectedIndex].keyword;
        handleSuggestionClick(selectedKeyword);
      } else {
        setShowSuggestions(false);
      }
    }
  }, [showSuggestions, suggestions, selectedIndex, handleSuggestionClick]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideInput = inputRef.current && !inputRef.current.contains(target);
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);
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
  const clearSearch = useCallback(() => {
    setSearchQueryState("");
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);
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
    consumePendingNavigation
  };
};