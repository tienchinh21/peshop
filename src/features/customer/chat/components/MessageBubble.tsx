"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, Clock } from "lucide-react";
import { formatMessageTime } from "../utils/chat.utils";
import type { NormalizedMessage } from "../types/chat.types";
type MessageStatus = "sent" | "sending" | "error";
interface MessageBubbleProps {
  message: NormalizedMessage;
  status?: MessageStatus;
  onRetry?: () => void;
}
export function MessageBubble({
  message,
  status = "sent",
  onRetry
}: MessageBubbleProps) {
  const isMe = message.sender === "me";
  const formattedTime = formatMessageTime(message.createdAt);
  return <div className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[75%] space-y-1", isMe ? "items-end" : "items-start")}>
        {}
        <div className={cn("rounded-2xl px-4 py-2", isMe ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-muted text-foreground")}>
          <p className="whitespace-pre-wrap break-words text-sm">
            {message.content}
          </p>
        </div>

        {}
        <div className={cn("flex items-center gap-1.5 px-1", isMe ? "justify-end" : "justify-start")}>
          {}
          {status === "sending" && isMe && <Clock className="size-3 animate-pulse text-muted-foreground" />}

          {}
          {status === "error" && isMe && <button type="button" onClick={onRetry} className="flex items-center gap-1 text-destructive hover:underline" title="Gửi lại">
              <AlertCircle className="size-3" />
              <span className="text-xs">Lỗi</span>
            </button>}

          {}
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
        </div>
      </div>
    </div>;
}