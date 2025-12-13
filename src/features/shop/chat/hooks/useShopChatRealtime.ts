"use client";

import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/shared/hooks";
import { signalRService, type ConnectionStatus, type SignalRMessage, type SignalRCallbacks } from "@/features/customer/chat/services/signalr.service";
import { shopMessageKeys } from "./useShopMessages";
import { shopConversationKeys } from "./useShopConversations";
import { SenderType, type Conversation, type NormalizedMessage } from "@/features/customer/chat/types/chat.types";

export interface UseShopChatRealtimeOptions {
  activeConversation?: { userId: string; shopId: string } | null;
  onNewMessage?: (message: NormalizedMessage) => void;
  onUnreadCountChange?: (conversationKey: string, count: number) => void;
  onConnectionStatusChange?: (status: ConnectionStatus) => void;
}

export interface UseShopChatRealtimeReturn {
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
  isReconnecting: boolean;
  hasConnectionError: boolean;
  reconnect: () => Promise<void>;
}

/**
 * Hook for shop real-time messaging via SignalR
 * Always connects with SenderType.Shop (2)
 */
export function useShopChatRealtime(
  options: UseShopChatRealtimeOptions = {}
): UseShopChatRealtimeReturn {
  const { activeConversation, onNewMessage, onUnreadCountChange, onConnectionStatusChange } = options;
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const activeConversationRef = useRef(activeConversation);
  activeConversationRef.current = activeConversation;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const statusRef = useRef<ConnectionStatus>("disconnected");

  const handleMessageReceived = useCallback(
    (message: SignalRMessage) => {
      console.log("[ShopChatRealtime] Message received:", message);

      const currentActive = activeConversationRef.current;
      const currentOptions = optionsRef.current;

      const isActiveConversation =
        currentActive &&
        message.userId === currentActive.userId &&
        message.shopId === currentActive.shopId;

      const tempId = `realtime-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      if (isActiveConversation) {
        console.log("[ShopChatRealtime] Updating active conversation");

        const normalizedMessage: NormalizedMessage = {
          id: tempId,
          content: message.content,
          createdAt: message.createdAt,
          sender: "other", // Messages from SignalR are from the other party (User)
        };

        // Invalidate and refetch messages
        queryClient.invalidateQueries({
          queryKey: shopMessageKeys.conversation(message.userId, message.shopId),
        });

        // Update conversation list
        queryClient.setQueryData<Conversation[]>(
          shopConversationKeys.list(),
          (old) => {
            if (!old || !Array.isArray(old)) return old;
            return old.map((conv) => {
              if (conv.userId === message.userId && conv.shopId === message.shopId) {
                return {
                  ...conv,
                  lastMessage: message.content,
                  createdAt: message.createdAt,
                };
              }
              return conv;
            });
          }
        );

        currentOptions.onNewMessage?.(normalizedMessage);
      } else {
        console.log("[ShopChatRealtime] Marking non-active conversation as unread");

        const conversationKey = `${message.userId}-${message.shopId}`;

        queryClient.setQueryData<Conversation[]>(
          shopConversationKeys.list(),
          (old) => {
            if (!old || !Array.isArray(old)) return old;
            return old.map((conv) => {
              if (conv.userId === message.userId && conv.shopId === message.shopId) {
                return {
                  ...conv,
                  lastMessage: message.content,
                  seen: false,
                  createdAt: message.createdAt,
                };
              }
              return conv;
            });
          }
        );

        currentOptions.onUnreadCountChange?.(conversationKey, 1);
      }

      // Force refetch conversations
      queryClient.invalidateQueries({
        queryKey: shopConversationKeys.list(),
      });
    },
    [queryClient]
  );

  const handleConnectionStatusChange = useCallback(
    (status: ConnectionStatus) => {
      statusRef.current = status;
      onConnectionStatusChange?.(status);
    },
    [onConnectionStatusChange]
  );

  const handleError = useCallback((error: Error) => {
    console.error("[ShopChatRealtime] SignalR error:", error.message);
  }, []);

  const connect = useCallback(async () => {
    const callbacks: SignalRCallbacks = {
      onMessageReceived: handleMessageReceived,
      onConnectionStatusChanged: handleConnectionStatusChange,
      onError: handleError,
    };

    await signalRService.connect(callbacks, { senderType: SenderType.Shop });
  }, [handleMessageReceived, handleConnectionStatusChange, handleError]);

  // Auto-connect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      connect();
    }

    return () => {
      // Don't disconnect on unmount to keep connection alive
    };
  }, [isAuthenticated, connect]);

  // Mark active conversation as read
  useEffect(() => {
    if (activeConversation && signalRService.isConnected()) {
      queryClient.setQueryData<Conversation[]>(
        shopConversationKeys.list(),
        (old) => {
          if (!old || !Array.isArray(old)) return old;
          return old.map((conv) => {
            if (
              conv.userId === activeConversation.userId &&
              conv.shopId === activeConversation.shopId
            ) {
              return { ...conv, seen: true };
            }
            return conv;
          });
        }
      );
    }
  }, [activeConversation, queryClient]);

  return {
    connectionStatus: statusRef.current,
    isConnected: signalRService.isConnected(),
    isReconnecting: statusRef.current === "reconnecting",
    hasConnectionError: statusRef.current === "error",
    reconnect: connect,
  };
}

export type { ConnectionStatus };
