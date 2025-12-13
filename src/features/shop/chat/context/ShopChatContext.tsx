"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/**
 * Context value interface for shop chat state management
 * Manages the open/close state of the ShopChatWidget
 */
export interface ShopChatContextValue {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}

const ShopChatContext = createContext<ShopChatContextValue | null>(null);

/**
 * Provider component for shop chat state
 * Wraps shop layout to provide chat open/close functionality
 */
export function ShopChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openChat = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <ShopChatContext.Provider
      value={{
        isOpen,
        openChat,
        closeChat,
        toggleChat,
      }}
    >
      {children}
    </ShopChatContext.Provider>
  );
}

/**
 * Hook to access shop chat context
 * Must be used within ShopChatProvider
 * @throws Error if used outside of ShopChatProvider
 */
export function useShopChatContext(): ShopChatContextValue {
  const context = useContext(ShopChatContext);
  if (!context) {
    throw new Error(
      "useShopChatContext must be used within a ShopChatProvider"
    );
  }
  return context;
}

/**
 * Safe version of useShopChatContext that returns null if not within provider
 * Useful for conditional rendering scenarios
 */
export function useShopChatContextSafe(): ShopChatContextValue | null {
  return useContext(ShopChatContext);
}
