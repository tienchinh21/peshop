"use client";

import { useEffect, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { MessageAreaSkeleton } from "./ChatSkeleton";
import type { NormalizedMessage } from "../types/chat.types";
interface MessageAreaProps {
  messages: NormalizedMessage[];
  isLoading?: boolean;
  isFetchingMore?: boolean;
  hasMoreMessages?: boolean;
  onLoadMore?: () => void;
}
export function MessageArea({
  messages,
  isLoading = false,
  isFetchingMore = false,
  hasMoreMessages = false,
  onLoadMore
}: MessageAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth"
      });
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length]);
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      bottomRef.current?.scrollIntoView();
    }
  }, [isLoading]);
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !hasMoreMessages || isFetchingMore) return;
    const {
      scrollTop
    } = containerRef.current;
    if (scrollTop < 100) {
      onLoadMore?.();
    }
  }, [hasMoreMessages, isFetchingMore, onLoadMore]);
  if (isLoading) {
    return <MessageAreaSkeleton />;
  }
  if (messages.length === 0) {
    return <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
        </p>
      </div>;
  }
  return <div ref={containerRef} onScroll={handleScroll} className="flex h-full flex-col overflow-y-auto p-4">
      {}
      {isFetchingMore && <div className="flex justify-center py-2">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>}

      {}
      {hasMoreMessages && !isFetchingMore && <div className="flex justify-center py-2">
          <button type="button" onClick={onLoadMore} className="text-xs text-muted-foreground hover:text-foreground hover:underline">
            Tải tin nhắn cũ hơn
          </button>
        </div>}

      {}
      <div className="flex flex-1 flex-col justify-end space-y-3">
        {messages.map(message => <MessageBubble key={message.id} message={message} />)}
      </div>

      {}
      <div ref={bottomRef} />
    </div>;
}