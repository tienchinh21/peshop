"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/shared/hooks";
import { chatService } from "../services/chat.service";
import { getSenderType } from "../utils/chat.utils";
import { messageKeys } from "./useMessages";
import { conversationKeys } from "./useConversations";
import { SenderType, type SendMessageRequest, type SendMessageResponse, type NormalizedMessage, type ChatHistoryResponse } from "../types/chat.types";
interface SendMessageParams {
  message: string;
  userId: string;
  shopId: string;
}
interface UseSendMessageOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for sending messages with optimistic updates
 * Automatically handles sender type detection and optimistic UI updates
 * 
 * @param options - Optional callbacks for success and error handling
 * @returns Mutation result with sendMessage function, pending state, and error
 */
export function useSendMessage(options?: UseSendMessageOptions) {
  const {
    roles
  } = useAuth();
  const queryClient = useQueryClient();
  const senderType = getSenderType(roles);
  const mutation = useMutation<SendMessageResponse, Error, SendMessageParams, {
    previousMessages: unknown;
    optimisticMessage: NormalizedMessage;
  }>({
    mutationFn: async ({
      message,
      userId,
      shopId
    }) => {
      const request: SendMessageRequest = {
        message,
        type: senderType,
        ...(senderType === SenderType.User ? {
          shopId
        } : {
          userId
        })
      };
      console.log("[useSendMessage] Sending message:", request);
      const response = await chatService.sendMessage(request);
      console.log("[useSendMessage] Response:", response);
      return response;
    },
    onMutate: async ({
      message,
      userId,
      shopId
    }) => {
      await queryClient.cancelQueries({
        queryKey: messageKeys.conversation(userId, shopId, senderType)
      });
      const previousMessages = queryClient.getQueryData(messageKeys.conversation(userId, shopId, senderType));
      const optimisticMessage: NormalizedMessage = {
        id: `temp-${Date.now()}`,
        content: message,
        createdAt: new Date().toISOString(),
        sender: "me"
      };
      queryClient.setQueryData<{
        pages: ChatHistoryResponse[];
        pageParams: number[];
      }>(messageKeys.conversation(userId, shopId, senderType), old => {
        if (!old || !old.pages || old.pages.length === 0) {
          return {
            pages: [{
              data: [{
                it: [],
                me: [{
                  id: optimisticMessage.id,
                  content: optimisticMessage.content,
                  createdAt: optimisticMessage.createdAt
                }]
              }],
              currentPage: 1,
              pageSize: 20,
              totalCount: 1,
              totalPages: 1,
              hasNextPage: false,
              hasPreviousPage: false,
              nextPage: 1,
              previousPage: 1
            }],
            pageParams: [1]
          };
        }
        const newPages = [...old.pages];
        if (newPages.length > 0) {
          const firstPage = newPages[0];
          const pageData = Array.isArray(firstPage.data) && firstPage.data.length > 0 ? firstPage.data : [{
            it: [],
            me: []
          }];
          newPages[0] = {
            ...firstPage,
            data: [{
              ...pageData[0],
              me: [...(pageData[0].me || []), {
                id: optimisticMessage.id,
                content: optimisticMessage.content,
                createdAt: optimisticMessage.createdAt
              }]
            }, ...pageData.slice(1)]
          };
        }
        return {
          ...old,
          pages: newPages
        };
      });
      return {
        previousMessages,
        optimisticMessage
      };
    },
    onError: (_error, {
      userId,
      shopId
    }, context) => {
      console.error("[useSendMessage] Error sending message:", _error);
      if (context?.previousMessages) {
        queryClient.setQueryData(messageKeys.conversation(userId, shopId, senderType), context.previousMessages);
      }
      options?.onError?.(_error);
    },
    onSuccess: (_data, {
      userId,
      shopId
    }) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversation(userId, shopId, senderType)
      });
      queryClient.invalidateQueries({
        queryKey: conversationKeys.all
      });
      options?.onSuccess?.();
    }
  });
  return {
    sendMessage: mutation.mutate,
    sendMessageAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
    senderType
  };
}