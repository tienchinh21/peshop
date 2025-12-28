"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  LogIn,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
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
  const router = useRouter();
  const chatContext = useChatContextSafe();
  const { user, isAuthenticated } = useAuth();
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
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
        // Cập nhật thông tin shop từ targetShop nếu conversation không có
        const updatedConv = {
          ...targetConv,
          shopName:
            targetConv.shopName || chatContext.targetShop.shopName || "Shop",
          shopAvatar:
            targetConv.shopAvatar || chatContext.targetShop.shopAvatar || "",
        };
        setSelectedConversation(updatedConv);
      } else {
        // Tạo virtual conversation để hiển thị thông tin shop
        const virtualConversation: Conversation = {
          userId: user?.id || "",
          userName: user?.name || user?.username || "",
          userAvatar: user?.avatar || "",
          shopId: chatContext.targetShop.shopId,
          shopName: chatContext.targetShop.shopName?.trim() || "Shop",
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
      {/* Toggle Button - chỉ hiện khi đóng */}
      {!isOpen && (
        <Button
          ref={toggleButtonRef}
          onClick={() => {
            if (isAuthenticated) {
              setIsOpen(true);
            } else {
              setLoginModalOpen(true);
            }
          }}
          className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-[9999] flex items-center justify-center bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          {totalUnread > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
              {totalUnread > 9 ? "9+" : totalUnread}
            </span>
          )}
        </Button>
      )}

      {/* Chat Panel - full height, 40% width */}
      {isOpen && (
        <div
          ref={widgetRef}
          className={cn(
            "fixed inset-y-0 right-0 z-[9999] transition-all duration-300 ease-in-out",
            "w-[50%] min-w-[420px]",
            "max-lg:w-[50%]",
            "max-md:w-full max-md:min-w-0"
          )}
        >
          <div className="w-full h-full shadow-2xl flex flex-row overflow-hidden bg-white border-l border-gray-200">
            {/* Sidebar - danh sách conversation */}
            <div className="w-[200px] max-lg:w-[180px] max-md:hidden flex flex-col border-r border-gray-100 bg-white shrink-0">
              {/* Header */}
              <div className="p-3 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-primary">Chat</h3>
                  {totalUnread > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {totalUnread > 9 ? "9+" : totalUnread}
                    </span>
                  )}
                </div>
              </div>

              {/* Search */}
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 h-8 text-sm"
                  />
                </div>
              </div>

              {/* Conversation list */}
              <div className="flex-1 overflow-y-auto">
                {isConversationsError ? (
                  <div className="flex flex-col items-center justify-center gap-2 p-3 text-center h-full">
                    <AlertCircle className="size-6 text-red-500" />
                    <p className="text-xs text-muted-foreground">Lỗi tải</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetchConversations()}
                      className="gap-1 h-7 text-xs"
                    >
                      <RefreshCw className="size-3" />
                      Thử lại
                    </Button>
                  </div>
                ) : isLoadingConversations ? (
                  <div className="p-3 text-center text-xs text-gray-500">
                    Đang tải...
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-3 text-center text-xs text-gray-500">
                    Chưa có cuộc trò chuyện
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
                          "flex items-center gap-2 p-2 cursor-pointer transition-colors border-b border-gray-50 hover:bg-gray-50",
                          isSelected ? "bg-primary/10 hover:bg-primary/10" : ""
                        )}
                        onClick={() => setSelectedConversation(conv)}
                      >
                        <div className="relative shrink-0">
                          {partner.avatar ? (
                            <img
                              src={partner.avatar}
                              alt={partner.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">
                              {partner.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                          )}
                          {!conv.seen && (
                            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={cn(
                              "font-medium text-xs truncate",
                              isSelected ? "text-primary" : "text-gray-900"
                            )}
                          >
                            {partner.name}
                          </h4>
                          <p className="text-[10px] truncate text-gray-500">
                            {conv.lastMessage || "Chưa có tin nhắn"}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Main chat area */}
            <div className="flex-1 flex flex-col bg-gray-50/50 min-w-0">
              {selectedConversation && partnerInfo ? (
                <>
                  {/* Chat header */}
                  <div className="p-3 border-b border-gray-100 bg-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-primary md:hidden shrink-0"
                        onClick={() => setSelectedConversation(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      {partnerInfo.avatar ? (
                        <img
                          src={partnerInfo.avatar}
                          alt={partnerInfo.name}
                          className="h-8 w-8 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm shrink-0">
                          {partnerInfo.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 truncate">
                          {partnerInfo.name}
                        </h3>
                        <span
                          className={cn(
                            "text-[10px] flex items-center gap-1",
                            isSignalRConnected
                              ? "text-green-600"
                              : "text-gray-400"
                          )}
                        >
                          {isSignalRConnected ? (
                            <>
                              <Wifi className="h-2.5 w-2.5" /> Online
                            </>
                          ) : (
                            <>
                              <WifiOff className="h-2.5 w-2.5" /> Offline
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-500 shrink-0"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {isLoadingMessages ? (
                      <div className="text-center text-sm text-gray-500">
                        Đang tải...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-sm text-gray-500">
                        Chưa có tin nhắn
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
                              "p-2.5 rounded-2xl text-sm max-w-[85%]",
                              msg.sender === "me"
                                ? "bg-primary text-white rounded-br-sm"
                                : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                            )}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-2 bg-white border-t border-gray-100">
                    <form
                      onSubmit={handleSendMessage}
                      className="flex items-center gap-2"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 shrink-0"
                      >
                        <Smile className="h-5 w-5" />
                      </Button>
                      <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 bg-gray-100 border-0 h-9"
                        disabled={isSending}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className="h-9 w-9 rounded-lg shrink-0 bg-primary"
                        disabled={!messageInput.trim() || isSending}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <>
                  {/* Header khi chưa chọn conversation */}
                  <div className="p-3 border-b border-gray-100 bg-white flex items-center justify-between shrink-0">
                    <h3 className="font-bold text-base text-primary">Chat</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-500"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-4">
                    <MessageCircle className="h-12 w-12 mb-3 opacity-30" />
                    <p className="text-sm">Chọn cuộc hội thoại để chat</p>

                    {/* Mobile conversation list */}
                    <div className="mt-4 md:hidden w-full">
                      {filteredConversations.length > 0 ? (
                        <div className="space-y-1">
                          {filteredConversations.map((conv) => {
                            const partner = getPartnerInfo(conv, senderType);
                            return (
                              <div
                                key={`${conv.userId}-${conv.shopId}`}
                                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 rounded-lg bg-white"
                                onClick={() => setSelectedConversation(conv)}
                              >
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                  {partner.name?.charAt(0)?.toUpperCase() ||
                                    "?"}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm truncate">
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
                          Chưa có cuộc trò chuyện
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent className="sm:max-w-md p-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-primary" />
              Đăng nhập để chat
            </DialogTitle>
            <DialogDescription>
              Bạn cần đăng nhập để sử dụng tính năng chat
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-6 gap-4">
            <MessageCircle className="h-16 w-16 text-primary/30" />
            <p className="text-center text-sm text-muted-foreground">
              Kết nối với shop để được hỗ trợ nhanh chóng và nhận câu trả lời
              tốt nhất
            </p>
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setLoginModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Đóng
            </Button>
            <Button
              onClick={() => {
                setLoginModalOpen(false);
                router.push("/xac-thuc");
              }}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Đăng nhập ngay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
