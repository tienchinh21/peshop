"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
interface ChatTarget {
  shopId: string;
  shopName?: string;
  shopAvatar?: string;
}
interface ChatContextValue {
  isOpen: boolean;
  targetShop: ChatTarget | null;
  openChat: (target?: ChatTarget) => void;
  closeChat: () => void;
  toggleChat: () => void;
}
const ChatContext = createContext<ChatContextValue | null>(null);
export function ChatProvider({
  children
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetShop, setTargetShop] = useState<ChatTarget | null>(null);
  const openChat = useCallback((target?: ChatTarget) => {
    if (target) {
      setTargetShop(target);
    }
    setIsOpen(true);
  }, []);
  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  return <ChatContext.Provider value={{
    isOpen,
    targetShop,
    openChat,
    closeChat,
    toggleChat
  }}>
      {children}
    </ChatContext.Provider>;
}
export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
export function useChatContextSafe() {
  return useContext(ChatContext);
}