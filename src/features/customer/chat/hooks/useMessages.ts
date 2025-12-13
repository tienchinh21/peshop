"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "@/shared/hooks";
import { chatService } from "../services/chat.service";
import { getSenderType, normalizeMessages } from "../utils/chat.utils";
import type { ChatHistoryResponse, NormalizedMessage, SenderType } from "../types/chat.types";
const PAGE_SIZE = 20;
export const messageKeys = {
  all: ["messages"] as const,
  conversation: (userId: string, shopId: string, type: SenderType) => [...messageKeys.all, "conversation", userId, shopId, type] as const
};

/**
 * Hook for fetching chat messages with infinite scroll support
 * Messages are normalized and sorted by createdAt in ascending order
 * 
 * @param userId - The user ID in the conversation
 * @param shopId - The shop ID in the conversation
 * @returns Query result with messages, loading states, and pagination functions
 */
export function useMessages(userId: string, shopId: string) {
  const {
    roles,
    isAuthenticated
  } = useAuth();
  const senderType = getSenderType(roles);
  const query = useInfiniteQuery<ChatHistoryResponse, Error>({
    queryKey: messageKeys.conversation(userId, shopId, senderType),
    queryFn: ({
      pageParam
    }) => chatService.getChatHistory({
      userId,
      shopId,
      type: senderType,
      page: pageParam as number,
      pageSize: PAGE_SIZE
    }),
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.hasNextPage ? lastPage.nextPage : undefined,
    getPreviousPageParam: firstPage => firstPage.hasPreviousPage ? firstPage.previousPage : undefined,
    enabled: isAuthenticated && !!userId && !!shopId,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
    refetchOnWindowFocus: false
  });
  const messages = useMemo<NormalizedMessage[]>(() => {
    if (!query.data?.pages) return [];
    const allMessages: NormalizedMessage[] = [];
    query.data.pages.forEach(page => {
      const pageData = Array.isArray(page.data) ? page.data : [];
      pageData.forEach(messageGroup => {
        if (messageGroup?.it || messageGroup?.me) {
          const normalized = normalizeMessages(messageGroup.it || [], messageGroup.me || []);
          allMessages.push(...normalized);
        }
      });
    });
    return allMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
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
    senderType
  };
}
export function useInvalidateMessages() {
  const queryClient = useQueryClient();
  return (userId: string, shopId: string, type: SenderType) => {
    queryClient.invalidateQueries({
      queryKey: messageKeys.conversation(userId, shopId, type)
    });
  };
}