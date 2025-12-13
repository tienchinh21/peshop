"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/shared/hooks";
import { chatService } from "../services/chat.service";
import { getSenderType } from "../utils/chat.utils";
import type { Conversation, SenderType } from "../types/chat.types";
export const conversationKeys = {
  all: ["conversations"] as const,
  list: (type: SenderType) => [...conversationKeys.all, "list", type] as const
};

/**
 * Hook for fetching chat conversations
 * Automatically detects user type (User or Shop) from auth state
 * 
 * @returns Query result with conversations, loading state, error, and refetch function
 */
export function useConversations() {
  const {
    roles,
    isAuthenticated
  } = useAuth();
  const senderType = getSenderType(roles);
  const query = useQuery<Conversation[], Error>({
    queryKey: conversationKeys.list(senderType),
    queryFn: () => chatService.getConversations(senderType),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });
  return {
    conversations: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    senderType
  };
}
export function useInvalidateConversations() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({
      queryKey: conversationKeys.all
    });
  };
}