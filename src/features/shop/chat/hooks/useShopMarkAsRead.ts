"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { shopConversationKeys } from "./useShopConversations";
import { SenderType, type Conversation } from "@/features/customer/chat/types/chat.types";

/**
 * Hook for marking a shop conversation as read
 * Updates the seen status to true in the local cache
 */
export function useShopMarkAsRead() {
  const queryClient = useQueryClient();

  const markAsRead = useCallback(
    (userId: string, shopId: string) => {
      queryClient.setQueryData<Conversation[]>(
        shopConversationKeys.list(),
        (oldData) => {
          if (!oldData) return oldData;

          return oldData.map((conversation) => {
            if (conversation.userId === userId && conversation.shopId === shopId) {
              if (!conversation.seen) {
                return { ...conversation, seen: true };
              }
            }
            return conversation;
          });
        }
      );
    },
    [queryClient]
  );

  return { markAsRead, senderType: SenderType.Shop };
}
