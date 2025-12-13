"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useAuth } from "@/shared/hooks";
import { getSenderType } from "../utils/chat.utils";
import { conversationKeys } from "./useConversations";
import type { Conversation } from "../types/chat.types";

/**
 * Hook for marking a conversation as read in the local cache
 * Updates the seen status to true for the specified conversation
 * 
 * Property 8: Conversation Read Status Update
 * For any conversation selected by the shop owner, that conversation's 
 * seen status SHALL be updated to true in the local cache.
 * Validates: Requirements 7.3
 * 
 * @returns Function to mark a conversation as read
 */
export function useMarkConversationAsRead() {
  const queryClient = useQueryClient();
  const { roles } = useAuth();
  const senderType = getSenderType(roles);

  /**
   * Mark a conversation as read by updating the seen status in cache
   * @param userId - The user ID of the conversation
   * @param shopId - The shop ID of the conversation
   */
  const markAsRead = useCallback(
    (userId: string, shopId: string) => {
      // Update the conversations cache to mark this conversation as read
      queryClient.setQueryData<Conversation[]>(
        conversationKeys.list(senderType),
        (oldData) => {
          if (!oldData) return oldData;

          return oldData.map((conversation) => {
            // Find the matching conversation and update its seen status
            if (conversation.userId === userId && conversation.shopId === shopId) {
              // Only update if not already seen
              if (!conversation.seen) {
                return { ...conversation, seen: true };
              }
            }
            return conversation;
          });
        }
      );
    },
    [queryClient, senderType]
  );

  return { markAsRead, senderType };
}
