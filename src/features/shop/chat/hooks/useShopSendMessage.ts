"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/features/customer/chat/services/chat.service";
import { shopMessageKeys } from "./useShopMessages";
import { shopConversationKeys } from "./useShopConversations";
import {
  SenderType,
  type SendMessageRequest,
  type SendMessageResponse,
  type NormalizedMessage,
  type ChatHistoryResponse,
} from "@/features/customer/chat/types/chat.types";

interface SendMessageParams {
  message: string;
  userId: string;
  shopId: string;
}

interface UseShopSendMessageOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for sending messages from shop to user
 * Always uses SenderType.Shop (2) and sends userId in request
 */
export function useShopSendMessage(options?: UseShopSendMessageOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    SendMessageResponse,
    Error,
    SendMessageParams,
    { previousMessages: unknown; optimisticMessage: NormalizedMessage }
  >({
    mutationFn: async ({ message, userId }) => {
      const request: SendMessageRequest = {
        message,
        type: SenderType.Shop,
        userId, // Shop sends to User
      };
      console.log("[useShopSendMessage] Sending message:", request);
      const response = await chatService.sendMessage(request);
      console.log("[useShopSendMessage] Response:", response);
      return response;
    },
    onMutate: async ({ message, userId, shopId }) => {
      await queryClient.cancelQueries({
        queryKey: shopMessageKeys.conversation(userId, shopId),
      });

      const previousMessages = queryClient.getQueryData(
        shopMessageKeys.conversation(userId, shopId)
      );

      const optimisticMessage: NormalizedMessage = {
        id: `temp-${Date.now()}`,
        content: message,
        createdAt: new Date().toISOString(),
        sender: "me",
      };

      queryClient.setQueryData<{
        pages: ChatHistoryResponse[];
        pageParams: number[];
      }>(shopMessageKeys.conversation(userId, shopId), (old) => {
        if (!old || !old.pages || old.pages.length === 0) {
          return {
            pages: [
              {
                data: [
                  {
                    it: [],
                    me: [
                      {
                        id: optimisticMessage.id,
                        content: optimisticMessage.content,
                        createdAt: optimisticMessage.createdAt,
                      },
                    ],
                  },
                ],
                currentPage: 1,
                pageSize: 20,
                totalCount: 1,
                totalPages: 1,
                hasNextPage: false,
                hasPreviousPage: false,
                nextPage: 1,
                previousPage: 1,
              },
            ],
            pageParams: [1],
          };
        }

        const newPages = [...old.pages];
        if (newPages.length > 0) {
          const firstPage = newPages[0];
          const pageData =
            Array.isArray(firstPage.data) && firstPage.data.length > 0
              ? firstPage.data
              : [{ it: [], me: [] }];

          newPages[0] = {
            ...firstPage,
            data: [
              {
                ...pageData[0],
                me: [
                  ...(pageData[0].me || []),
                  {
                    id: optimisticMessage.id,
                    content: optimisticMessage.content,
                    createdAt: optimisticMessage.createdAt,
                  },
                ],
              },
              ...pageData.slice(1),
            ],
          };
        }

        return { ...old, pages: newPages };
      });

      return { previousMessages, optimisticMessage };
    },
    onError: (_error, { userId, shopId }, context) => {
      console.error("[useShopSendMessage] Error:", _error);
      if (context?.previousMessages) {
        queryClient.setQueryData(
          shopMessageKeys.conversation(userId, shopId),
          context.previousMessages
        );
      }
      options?.onError?.(_error);
    },
    onSuccess: (_data, { userId, shopId }) => {
      queryClient.invalidateQueries({
        queryKey: shopMessageKeys.conversation(userId, shopId),
      });
      queryClient.invalidateQueries({
        queryKey: shopConversationKeys.all,
      });
      options?.onSuccess?.();
    },
  });

  return {
    sendMessage: mutation.mutate,
    sendMessageAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
    senderType: SenderType.Shop,
  };
}
