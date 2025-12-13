"use client";

import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/shared/hooks";
import { useSignalR, type SignalRMessage, type ConnectionStatus } from "./useSignalR";
import { messageKeys } from "./useMessages";
import { conversationKeys } from "./useConversations";
import { getSenderType } from "../utils/chat.utils";
import type { ChatHistoryResponse, Conversation, NormalizedMessage } from "../types/chat.types";
export interface UseChatRealtimeOptions {
  activeConversation?: {
    userId: string;
    shopId: string;
  } | null;
  onNewMessage?: (message: NormalizedMessage) => void;
  onUnreadCountChange?: (conversationKey: string, count: number) => void;
  onConnectionStatusChange?: (status: ConnectionStatus) => void;
}
export interface UseChatRealtimeReturn {
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
  isReconnecting: boolean;
  hasConnectionError: boolean;
  reconnect: () => Promise<void>;
}

/**
 * Hook for integrating real-time messaging with chat functionality
 * Automatically updates message lists and unread counts when messages arrive
 *
 * @param options - Configuration options
 * @returns Connection status and control functions
 */
export function useChatRealtime(options: UseChatRealtimeOptions = {}): UseChatRealtimeReturn {
  const {
    activeConversation,
    onNewMessage,
    onUnreadCountChange,
    onConnectionStatusChange
  } = options;
  const {
    roles
  } = useAuth();
  const queryClient = useQueryClient();
  const senderType = getSenderType(roles);
  const activeConversationRef = useRef(activeConversation);
  activeConversationRef.current = activeConversation;
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const handleMessageReceived = useCallback((message: SignalRMessage) => {
    console.log("[ChatRealtime] Message received:", message);
    const currentActive = activeConversationRef.current;
    const currentOptions = optionsRef.current;
    const isActiveConversation = currentActive && message.userId === currentActive.userId && message.shopId === currentActive.shopId;
    console.log("[ChatRealtime] Active conversation:", currentActive);
    console.log("[ChatRealtime] Is active conversation:", isActiveConversation);

    // Generate a temporary ID for the message since server doesn't provide one
    const tempId = `realtime-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Determine if message is from "me" or "other"
    // Since server doesn't send senderType, we assume incoming real-time messages are from "other"
    // (messages we send are handled by optimistic updates, not SignalR)
    const isFromMe = false; // Real-time messages are always from the other party

    if (isActiveConversation) {
      console.log("[ChatRealtime] Updating active conversation messages");
      const normalizedMessage: NormalizedMessage = {
        id: tempId,
        content: message.content,
        createdAt: message.createdAt,
        sender: isFromMe ? "me" : "other"
      };
      
      // Invalidate and refetch messages for active conversation
      // This is simpler and more reliable than manually updating the complex cache structure
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversation(message.userId, message.shopId, senderType),
      });
      
      // Also update conversation list to show latest message
      queryClient.setQueryData<Conversation[]>(conversationKeys.list(senderType), old => {
        if (!old || !Array.isArray(old)) return old;
        return old.map(conv => {
          if (conv.userId === message.userId && conv.shopId === message.shopId) {
            return {
              ...conv,
              lastMessage: message.content,
              createdAt: message.createdAt
              // Keep seen: true since this is active conversation
            };
          }
          return conv;
        });
      });
      
      currentOptions.onNewMessage?.(normalizedMessage);
    } else {
      console.log("[ChatRealtime] Updating non-active conversation as unread");
      const conversationKey = `${message.userId}-${message.shopId}`;
      queryClient.setQueryData<Conversation[]>(conversationKeys.list(senderType), old => {
        console.log("[ChatRealtime] Old conversations:", old);
        if (!old || !Array.isArray(old)) return old;
        const updated = old.map(conv => {
          if (conv.userId === message.userId && conv.shopId === message.shopId) {
            console.log("[ChatRealtime] Found matching conversation, marking as unread");
            return {
              ...conv,
              lastMessage: message.content,
              seen: false,
              createdAt: message.createdAt
            };
          }
          return conv;
        });
        console.log("[ChatRealtime] Updated conversations:", updated);
        return updated;
      });
      currentOptions.onUnreadCountChange?.(conversationKey, 1);
    }
    // Force refetch conversations to ensure UI updates with new unread count
    queryClient.invalidateQueries({
      queryKey: conversationKeys.list(senderType),
    });
  }, [queryClient, senderType]);
  const handleConnectionStatusChange = useCallback((status: ConnectionStatus) => {
    onConnectionStatusChange?.(status);
  }, [onConnectionStatusChange]);
  const handleError = useCallback((error: Error) => {
    console.error("[ChatRealtime] SignalR error:", error.message);
  }, []);
  const {
    status: connectionStatus,
    isConnected,
    isReconnecting,
    hasError: hasConnectionError,
    connect
  } = useSignalR({
    onMessageReceived: handleMessageReceived,
    onConnectionStatusChanged: handleConnectionStatusChange,
    onError: handleError,
    autoConnect: true
  });
  useEffect(() => {
    if (activeConversation && isConnected) {
      queryClient.setQueryData<Conversation[]>(conversationKeys.list(senderType), old => {
        if (!old || !Array.isArray(old)) return old;
        return old.map(conv => {
          if (conv.userId === activeConversation.userId && conv.shopId === activeConversation.shopId) {
            return {
              ...conv,
              seen: true
            };
          }
          return conv;
        });
      });
    }
  }, [activeConversation, isConnected, queryClient, senderType]);
  return {
    connectionStatus,
    isConnected,
    isReconnecting,
    hasConnectionError,
    reconnect: connect
  };
}