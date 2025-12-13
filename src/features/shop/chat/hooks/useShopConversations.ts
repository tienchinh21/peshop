"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/shared/hooks";
import { chatService } from "@/features/customer/chat/services/chat.service";
import { SenderType, type Conversation } from "@/features/customer/chat/types/chat.types";

export const shopConversationKeys = {
  all: ["shop-conversations"] as const,
  list: () => [...shopConversationKeys.all, "list", SenderType.Shop] as const,
};

/**
 * Hook for fetching shop chat conversations
 * Always uses SenderType.Shop (2) for API calls
 */
export function useShopConversations() {
  const { isAuthenticated } = useAuth();

  const query = useQuery<Conversation[], Error>({
    queryKey: shopConversationKeys.list(),
    queryFn: () => chatService.getConversations(SenderType.Shop),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  return {
    conversations: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    senderType: SenderType.Shop,
  };
}

export function useInvalidateShopConversations() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({
      queryKey: shopConversationKeys.all,
    });
  };
}
