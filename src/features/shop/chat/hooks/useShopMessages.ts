"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "@/shared/hooks";
import { chatService } from "@/features/customer/chat/services/chat.service";
import { normalizeMessages } from "@/features/customer/chat/utils/chat.utils";
import { SenderType, type ChatHistoryResponse, type NormalizedMessage } from "@/features/customer/chat/types/chat.types";

const PAGE_SIZE = 20;

export const shopMessageKeys = {
  all: ["shop-messages"] as const,
  conversation: (userId: string, shopId: string) =>
    [...shopMessageKeys.all, "conversation", userId, shopId, SenderType.Shop] as const,
};

/**
 * Hook for fetching shop chat messages with infinite scroll
 * Always uses SenderType.Shop (2) for API calls
 */
export function useShopMessages(userId: string, shopId: string) {
  const { isAuthenticated } = useAuth();

  const query = useInfiniteQuery<ChatHistoryResponse, Error>({
    queryKey: shopMessageKeys.conversation(userId, shopId),
    queryFn: ({ pageParam }) =>
      chatService.getChatHistory({
        userId,
        shopId,
        type: SenderType.Shop,
        page: pageParam as number,
        pageSize: PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.hasPreviousPage ? firstPage.previousPage : undefined,
    enabled: isAuthenticated && !!userId && !!shopId,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });

  const messages = useMemo<NormalizedMessage[]>(() => {
    if (!query.data?.pages) return [];

    const allMessages: NormalizedMessage[] = [];
    query.data.pages.forEach((page) => {
      const pageData = Array.isArray(page.data) ? page.data : [];
      pageData.forEach((messageGroup) => {
        if (messageGroup?.it || messageGroup?.me) {
          const normalized = normalizeMessages(
            messageGroup.it || [],
            messageGroup.me || []
          );
          allMessages.push(...normalized);
        }
      });
    });

    return allMessages.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [query.data?.pages]);

  return {
    messages,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    fetchNextPage: query.fetchNextPage,
    fetchPreviousPage: query.fetchPreviousPage,
    hasNextPage: query.hasNextPage ?? false,
    hasPreviousPage: query.hasPreviousPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
    isFetchingPreviousPage: query.isFetchingPreviousPage,
    refetch: query.refetch,
    senderType: SenderType.Shop,
  };
}

export function useInvalidateShopMessages() {
  const queryClient = useQueryClient();
  return (userId: string, shopId: string) => {
    queryClient.invalidateQueries({
      queryKey: shopMessageKeys.conversation(userId, shopId),
    });
  };
}
