"use client";

import { useState, useCallback, type FormEvent, type KeyboardEvent } from "react";
import { Send, Smile, ImageIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";
interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}
function isValidMessage(message: string): boolean {
  return message.trim().length > 0;
}
export function MessageInput({
  onSendMessage,
  disabled = false,
  placeholder = "Nhập tin nhắn..."
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const canSend = isValidMessage(message) && !disabled;
  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    onSendMessage(message.trim());
    setMessage("");
  }, [canSend, message, onSendMessage]);
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) {
        onSendMessage(message.trim());
        setMessage("");
      }
    }
  }, [canSend, message, onSendMessage]);
  return <form onSubmit={handleSubmit} className="border-t p-3">
      <div className="flex items-end gap-2">
        {}
        <div className="flex shrink-0 gap-1">
          <Button type="button" variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground" title="Emoji" disabled={disabled}>
            <Smile className="size-5" />
            <span className="sr-only">Chọn emoji</span>
          </Button>
          <Button type="button" variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground" title="Gửi hình ảnh" disabled={disabled}>
            <ImageIcon className="size-5" />
            <span className="sr-only">Gửi hình ảnh</span>
          </Button>
        </div>

        {}
        <div className="relative flex-1">
          <textarea value={message} onChange={e => setMessage(e.target.value)} onKeyDown={handleKeyDown} placeholder={placeholder} disabled={disabled} rows={1} className={cn("w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm", "placeholder:text-muted-foreground", "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1", "disabled:cursor-not-allowed disabled:opacity-50", "max-h-32 min-h-[40px]")} style={{
          height: "auto",
          minHeight: "40px"
        }} />
        </div>

        {}
        <Button type="submit" size="icon" disabled={!canSend} className="shrink-0" title="Gửi tin nhắn">
          <Send className="size-4" />
          <span className="sr-only">Gửi</span>
        </Button>
      </div>
    </form>;
}