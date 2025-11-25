"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Search,
  Image as ImageIcon,
  Smile,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Mock Data
const MOCK_CONVERSATIONS = [
  {
    id: "1",
    name: "Shop Dũng Gentleman",
    avatar: "https://github.com/shadcn.png",
    lastMessage:
      "Dạ sản phẩm này bên em còn hàng ạ, anh cần tư vấn size không ạ?",
    time: "10:30",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "TechWorld Official",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    lastMessage: "Đơn hàng của bạn đã được giao cho đơn vị vận chuyển.",
    time: "Hôm qua",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    name: "Mỹ Phẩm Chính Hãng",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    lastMessage: "Cảm ơn bạn đã ủng hộ shop!",
    time: "20/11",
    unread: 0,
    online: true,
  },
];

const MOCK_MESSAGES = {
  "1": [
    {
      id: 1,
      text: "Chào shop, áo này còn size L không ạ?",
      sender: "me",
      time: "10:00",
    },
    { id: 2, text: "Dạ chào anh/chị ạ", sender: "other", time: "10:05" },
    {
      id: 3,
      text: "Mẫu này bên em mới về thêm, size L còn đủ màu ạ",
      sender: "other",
      time: "10:05",
    },
    {
      id: 4,
      text: "Anh/chị cao nặng bao nhiêu để em tư vấn size chuẩn nhất ạ?",
      sender: "other",
      time: "10:06",
    },
    { id: 5, text: "Mình cao 1m75 nặng 70kg", sender: "me", time: "10:15" },
    {
      id: 6,
      text: "Dạ với chiều cao cân nặng này mình mặc size L là vừa đẹp luôn ạ",
      sender: "other",
      time: "10:20",
    },
    {
      id: 7,
      text: "Dạ sản phẩm này bên em còn hàng ạ, anh cần tư vấn size không ạ?",
      sender: "other",
      time: "10:30",
    },
  ],
  "2": [],
  "3": [],
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >("1"); // Default to first conversation
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const activeConversation = MOCK_CONVERSATIONS.find(
    (c) => c.id === activeConversationId
  );
  const currentMessages = activeConversationId
    ? (MOCK_MESSAGES as any)[activeConversationId] || []
    : [];

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentMessages, activeConversationId, isOpen]);

  // Click outside to close
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!messageInput.trim()) return;
    setMessageInput("");
  };

  return (
    <>
      {/* Toggle Button */}
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
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-bounce">
              2
            </span>
          </>
        )}
        <span className="sr-only">Toggle Chat</span>
      </Button>

      {/* Chat Window */}
      <div
        ref={widgetRef}
        className={cn(
          "fixed bottom-24 right-6 z-40 transition-all duration-300 ease-in-out origin-bottom-right",
          "max-sm:bottom-20 max-sm:right-4 max-sm:left-4",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        )}
      >
        <Card className="w-full max-w-[600px] h-[70vh] max-h-[500px] max-sm:max-w-full max-sm:h-[calc(100vh-120px)] shadow-2xl border-0 flex flex-row overflow-hidden rounded-xl ring-1 ring-black/5 bg-white p-0 gap-0">
          {/* Left Sidebar: Conversation List */}
          <div className="w-[300px] max-lg:w-[240px] max-md:hidden flex flex-col border-r border-gray-100 bg-white shrink-0">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-primary">Chat</h3>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  5
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm theo tên..."
                  className="pl-9 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 h-9"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {MOCK_CONVERSATIONS.map((conv) => (
                <div
                  key={conv.id}
                  className={cn(
                    "flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-gray-50 last:border-0 hover:bg-gray-50",
                    activeConversationId === conv.id
                      ? "bg-red-50 hover:bg-red-50"
                      : ""
                  )}
                  onClick={() => setActiveConversationId(conv.id)}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="h-10 w-10 rounded-full object-cover border border-gray-100"
                    />
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4
                        className={cn(
                          "font-semibold text-sm truncate pr-2",
                          activeConversationId === conv.id
                            ? "text-primary"
                            : "text-gray-900"
                        )}
                      >
                        {conv.name}
                      </h4>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {conv.time}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-xs truncate pr-4",
                        conv.unread > 0
                          ? "text-gray-900 font-medium"
                          : "text-gray-500"
                      )}
                    >
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="shrink-0">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {conv.unread}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Area: Chat Content */}
          <div className="flex-1 flex flex-col bg-gray-50/30">
            {activeConversationId ? (
              <>
                {/* Chat Header */}
                <div className="p-3 border-b border-gray-100 bg-white flex items-center justify-between shrink-0 h-[69px]">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={activeConversation?.avatar}
                        alt={activeConversation?.name}
                        className="h-9 w-9 rounded-full object-cover border border-gray-100"
                      />
                      {activeConversation?.online && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900">
                        {activeConversation?.name}
                      </h3>
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        Đang hoạt động
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
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

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {currentMessages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex w-full",
                        msg.sender === "me" ? "justify-end" : "justify-start"
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
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
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
                        disabled={!messageInput.trim()}
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
                <p>Chọn một cuộc hội thoại để bắt đầu chat</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
