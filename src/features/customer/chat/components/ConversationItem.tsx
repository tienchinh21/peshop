"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { formatMessageTime } from "../utils/chat.utils";
import type { Conversation, SenderType } from "../types/chat.types";
interface ConversationItemProps {
  conversation: Conversation;
  senderType: SenderType;
  isSelected?: boolean;
  onClick?: () => void;
}
function getPartnerInfo(conversation: Conversation, senderType: SenderType) {
  if (senderType === 1) {
    return {
      name: conversation.shopName,
      avatar: conversation.shopAvatar
    };
  }
  return {
    name: conversation.userName,
    avatar: conversation.userAvatar
  };
}
export function ConversationItem({
  conversation,
  senderType,
  isSelected = false,
  onClick
}: ConversationItemProps) {
  const partner = getPartnerInfo(conversation, senderType);
  const formattedTime = formatMessageTime(conversation.createdAt);
  const isUnread = !conversation.seen;
  return <button type="button" onClick={onClick} className={cn("flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors", "hover:bg-accent/50", isSelected && "bg-accent", isUnread && "bg-primary/5")}>
      {}
      <div className="relative shrink-0">
        <div className="size-12 overflow-hidden rounded-full bg-muted">
          {partner.avatar ? <img src={partner.avatar} alt={partner.name} className="size-full object-cover" /> : <div className="flex size-full items-center justify-center bg-primary/10 text-lg font-medium text-primary">
              {partner.name?.charAt(0)?.toUpperCase() || "?"}
            </div>}
        </div>
        {}
        {isUnread && <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-primary" />}
      </div>

      {}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className={cn("truncate text-sm", isUnread ? "font-semibold" : "font-medium")}>
            {partner.name}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formattedTime}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className={cn("truncate text-sm", isUnread ? "text-foreground" : "text-muted-foreground")}>
            {conversation.lastMessage || "Chưa có tin nhắn"}
          </p>
          {}
          {isUnread && <Badge variant="default" className="size-5 shrink-0 rounded-full p-0">
              <span className="sr-only">Tin nhắn chưa đọc</span>
            </Badge>}
        </div>
      </div>
    </button>;
}