"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { ConversationItem } from "./ConversationItem";
import { ConversationListSkeleton } from "./ChatSkeleton";
import type { Conversation, SenderType } from "../types/chat.types";
interface ConversationListProps {
  conversations: Conversation[] | undefined;
  senderType: SenderType;
  isLoading?: boolean;
  selectedConversation?: Conversation | null;
  onSelectConversation?: (conversation: Conversation) => void;
}
function filterConversations(conversations: Conversation[] | undefined, searchQuery: string, senderType: SenderType): Conversation[] {
  if (!conversations || !Array.isArray(conversations)) {
    return [];
  }
  if (!searchQuery.trim()) {
    return conversations;
  }
  const query = searchQuery.toLowerCase().trim();
  return conversations.filter(conv => {
    const partnerName = senderType === 1 ? conv.shopName : conv.userName;
    return partnerName?.toLowerCase().includes(query);
  });
}
export function ConversationList({
  conversations,
  senderType,
  isLoading = false,
  selectedConversation,
  onSelectConversation
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredConversations = useMemo(() => filterConversations(conversations, searchQuery, senderType), [conversations, searchQuery, senderType]);
  if (isLoading) {
    return <ConversationListSkeleton />;
  }
  return <div className="flex h-full flex-col">
      {}
      <div className="border-b p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="text" placeholder="Tìm kiếm cuộc trò chuyện..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
      </div>

      {}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? <div className="flex flex-col items-center justify-center p-6 text-center">
            <p className="text-sm text-muted-foreground">
              {searchQuery.trim() ? "Không tìm thấy cuộc trò chuyện nào" : "Chưa có cuộc trò chuyện nào"}
            </p>
          </div> : <div className="space-y-1 p-2">
            {filteredConversations.map(conversation => {
          const isSelected = selectedConversation?.userId === conversation.userId && selectedConversation?.shopId === conversation.shopId;
          return <ConversationItem key={`${conversation.userId}-${conversation.shopId}`} conversation={conversation} senderType={senderType} isSelected={isSelected} onClick={() => onSelectConversation?.(conversation)} />;
        })}
          </div>}
      </div>
    </div>;
}