"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  MessageCircle,
  X,
  Send,
  Search,
  Image as ImageIcon,
  Smile,
  AlertCircle,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/lib/utils";
import { useConversations } from "../hooks/useConversations";
import { useMessages } from "../hooks/useMessages";
import { useSendMessage } from "../hooks/useSendMessage";
import { useChatRealtime } from "../hooks/useChatRealtime";
import { useAuth } from "@/shared/hooks";
import { useChatContextSafe } from "../context";
import type { Conversation, SenderType } from "../types/chat.types";
function getPartnerInfo(
  conversation: Conversation,
  senderType: SenderType
): {
  name: string;
  avatar: string;
} {
  if (senderType === 1) {
    return {
      name: conversation.shopName,
      avatar: conversation.shopAvatar,
    };
  }
  return {
    name: conversation.userName,
    avatar: conversation.userAvatar,
  };
}
function getTotalUnreadCount(
  conversations: Conversation[] | undefined
): number {
  if (!conversations || !Array.isArray(conversations)) return 0;
  return conversations.filter((c) => !c.seen).length;
}
export function ChatWidget() {
  const chatContext = useChatContextSafe();
  const { user } = useAuth();
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const isOpen = chatContext?.isOpen ?? localIsOpen;
  const setIsOpen = useCallback(
    (open: boolean) => {
      if (chatContext) {
        open ? chatContext.openChat() : chatContext.closeChat();
      } else {
        setLocalIsOpen(open);
      }
    },
    [chatContext]
  );
  const {
    conversations,
    isLoading: isLoadingConversations,
    isError: isConversationsError,
    refetch: refetchConversations,
    senderType,
  } = useConversations();
  useEffect(() => {
    if (chatContext?.targetShop && isOpen) {
      const conversationList = Array.isArray(conversations)
        ? conversations
        : [];
      const targetConv = conversationList.find(
        (c) => c.shopId === chatContext.targetShop?.shopId
      );
      if (targetConv) {
        setSelectedConversation(targetConv);
      } else if (user?.id) {
        const virtualConversation: Conversation = {
          userId: user.id,
          userName: user.name || user.username || "",
          userAvatar: user.avatar || "",
          shopId: chatContext.targetShop.shopId,
          shopName: chatContext.targetShop.shopName || "Shop",
          shopAvatar: chatContext.targetShop.shopAvatar || "",
          lastMessage: "",
          seen: true,
          createdAt: new Date().toISOString(),
        };
        setSelectedConversation(virtualConversation);
      }
    }
  }, [chatContext?.targetShop, isOpen, conversations, user]);
  const { messages, isLoading: isLoadingMessages } = useMessages(
    selectedConversation?.userId ?? "",
    selectedConversation?.shopId ?? ""
  );
  const { sendMessage, isPending: isSending } = useSendMessage({
    onSuccess: () => {
      setMessageInput("");
      refetchConversations();
    },
  });
  const {
    isConnected: isSignalRConnected,
    isReconnecting,
    reconnect,
  } = useChatRealtime({
    activeConversation: selectedConversation
      ? {
          userId: selectedConversation.userId,
          shopId: selectedConversation.shopId,
        }
      : null,
    onNewMessage: () => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    },
    onConnectionStatusChange: (status) => {
      console.log("[ChatWidget] SignalR status:", status);
    },
  });
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, selectedConversation, isOpen]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        widgetRef.current &&
        !widgetRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);
  const handleSendMessage = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!messageInput.trim() || !selectedConversation) return;
      sendMessage({
        message: messageInput.trim(),
        userId: selectedConversation.userId,
        shopId: selectedConversation.shopId,
      });
    },
    [messageInput, selectedConversation, sendMessage]
  );
  const totalUnread = getTotalUnreadCount(conversations);
  const partnerInfo = selectedConversation
    ? getPartnerInfo(selectedConversation, senderType)
    : null;
  const filteredConversations = useMemo(() => {
    const list = Array.isArray(conversations) ? conversations : [];
    if (!searchQuery.trim()) return list;
    return list.filter((c) => {
      const name = senderType === 1 ? c.shopName : c.userName;
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [conversations, searchQuery, senderType]);
  return (
    <>
      {}
      <Button
        ref={toggleButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center group",
          isOpen
            ? "bg-red-500 hover:bg-red-600 rotate-90"
            : "bg-primary hover:bg-primary/90"
        )}
      >
        {isOpen ? (
          <X className="h-7 w-7 text-white" />
        ) : (
          <>
            <MessageCircle className="h-7 w-7 text-white" />
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-bounce">
                {totalUnread > 9 ? "9+" : totalUnread}
              </span>
            )}
          </>
        )}
        <span className="sr-only">Toggle Chat</span>
      </Button>

      {}
      {isOpen && (
        <div
          ref={widgetRef}
          className={cn(
            "fixed bottom-24 right-6 z-40 transition-all duration-300 ease-in-out origin-bottom-right",
            "max-sm:bottom-20 max-sm:right-4 max-sm:left-4",
            "opacity-100 scale-100 translate-y-0"
          )}
        >
          <Card className="w-full max-w-[600px] h-[70vh] max-h-[500px] max-sm:max-w-full max-sm:h-[calc(100vh-120px)] shadow-2xl border-0 flex flex-row overflow-hidden rounded-xl ring-1 ring-black/5 bg-white p-0 gap-0">
            {}
            <div className="w-[300px] max-lg:w-[240px] max-md:hidden flex flex-col border-r border-gray-100 bg-white shrink-0">
              {}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-primary">Chat</h3>
                  {totalUnread > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {totalUnread > 9 ? "9+" : totalUnread}
                    </span>
                  )}
                </div>
              </div>

              {}
              <div className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm theo tên..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 h-9"
                  />
                </div>
              </div>

              {}
              <div className="flex-1 overflow-y-auto">
                {isConversationsError ? (
                  <div className="flex flex-col items-center justify-center gap-3 p-4 text-center h-full">
                    <AlertCircle className="size-8 text-red-500" />
                    <p className="text-sm text-muted-foreground">
                      Không thể tải cuộc trò chuyện
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetchConversations()}
                      className="gap-2"
                    >
                      <RefreshCw className="size-4" />
                      Thử lại
                    </Button>
                  </div>
                ) : isLoadingConversations ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Đang tải...
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Chưa có cuộc trò chuyện nào
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const partner = getPartnerInfo(conv, senderType);
                    const isSelected =
                      selectedConversation?.shopId === conv.shopId &&
                      selectedConversation?.userId === conv.userId;
                    return (
                      <div
                        key={`${conv.userId}-${conv.shopId}`}
                        className={cn(
                          "flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-gray-50 last:border-0 hover:bg-gray-50",
                          isSelected ? "bg-red-50 hover:bg-red-50" : ""
                        )}
                        onClick={() => setSelectedConversation(conv)}
                      >
                        <div className="relative shrink-0">
                          {partner.avatar ? (
                            <img
                              src={partner.avatar}
                              alt={partner.name}
                              className="h-10 w-10 rounded-full object-cover border border-gray-100"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              {partner.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h4
                              className={cn(
                                "font-semibold text-sm truncate pr-2",
                                isSelected ? "text-primary" : "text-gray-900"
                              )}
                            >
                              {partner.name}
                            </h4>
                            <span className="text-[10px] text-gray-400 shrink-0">
                              {new Date(conv.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                          <p
                            className={cn(
                              "text-xs truncate pr-4",
                              !conv.seen
                                ? "text-gray-900 font-medium"
                                : "text-gray-500"
                            )}
                          >
                            {conv.lastMessage || "Chưa có tin nhắn"}
                          </p>
                        </div>
                        {!conv.seen && (
                          <div className="shrink-0">
                            <span className="flex h-2 w-2 rounded-full bg-red-500" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {}
            <div className="flex-1 flex flex-col bg-gray-50/30">
              {selectedConversation && partnerInfo ? (
                <>
                  {}
                  <div className="p-3 border-b border-gray-100 bg-white flex items-center justify-between shrink-0 h-[69px]">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {partnerInfo.avatar ? (
                          <img
                            src={partnerInfo.avatar}
                            alt={partnerInfo.name}
                            className="h-9 w-9 rounded-full object-cover border border-gray-100"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                            {partnerInfo.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900">
                          {partnerInfo.name}
                        </h3>
                        <span
                          className={cn(
                            "text-xs flex items-center gap-1",
                            isSignalRConnected
                              ? "text-green-600"
                              : isReconnecting
                              ? "text-yellow-600"
                              : "text-gray-400"
                          )}
                        >
                          {isSignalRConnected ? (
                            <>
                              <Wifi className="h-3 w-3" />
                              Đang hoạt động
                            </>
                          ) : isReconnecting ? (
                            <>
                              <RefreshCw className="h-3 w-3 animate-spin" />
                              Đang kết nối lại...
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => reconnect()}
                              className="flex items-center gap-1 hover:text-primary transition-colors"
                              title="Nhấn để kết nối lại"
                            >
                              <WifiOff className="h-3 w-3" />
                              Offline - Nhấn để kết nối
                            </button>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-primary md:hidden"
                        onClick={() => setSelectedConversation(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {isLoadingMessages ? (
                      <div className="text-center text-sm text-gray-500">
                        Đang tải tin nhắn...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-sm text-gray-500">
                        Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex w-full",
                            msg.sender === "me"
                              ? "justify-end"
                              : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "p-3 rounded-2xl text-sm shadow-sm max-w-[80%]",
                              msg.sender === "me"
                                ? "bg-primary text-primary-foreground rounded-br-none"
                                : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                            )}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {}
                  <div className="p-3 bg-white border-t border-gray-100">
                    <form
                      onSubmit={handleSendMessage}
                      className="flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-2 px-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-primary hover:bg-gray-100"
                        >
                          <Smile className="h-5 w-5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-primary hover:bg-gray-100"
                        >
                          <ImageIcon className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="flex items-end gap-2">
                        <Input
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          placeholder="Nhập nội dung tin nhắn..."
                          className="flex-1 bg-gray-50 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 min-h-[40px]"
                          disabled={isSending}
                        />
                        <Button
                          type="submit"
                          size="icon"
                          className={cn(
                            "h-10 w-10 rounded-lg shrink-0 transition-all",
                            messageInput.trim()
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          )}
                          disabled={!messageInput.trim() || isSending}
                        >
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                  <MessageCircle className="h-16 w-16 mb-4 opacity-20" />
                  <p className="text-sm">
                    Chọn một cuộc hội thoại để bắt đầu chat
                  </p>

                  {}
                  <div className="mt-4 md:hidden w-full px-4">
                    {isLoadingConversations ? (
                      <p className="text-xs text-center">Đang tải...</p>
                    ) : filteredConversations.length > 0 ? (
                      <div className="max-h-[300px] overflow-y-auto">
                        {filteredConversations.map((conv) => {
                          const partner = getPartnerInfo(conv, senderType);
                          return (
                            <div
                              key={`${conv.userId}-${conv.shopId}`}
                              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 rounded-lg"
                              onClick={() => setSelectedConversation(conv)}
                            >
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                {partner.name?.charAt(0)?.toUpperCase() || "?"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm truncate text-gray-900">
                                  {partner.name}
                                </h4>
                                <p className="text-xs truncate text-gray-500">
                                  {conv.lastMessage || "Chưa có tin nhắn"}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-center">
                        Chưa có cuộc trò chuyện nào
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
