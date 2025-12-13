"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";
function ConversationItemSkeleton() {
  return <div className="flex items-center gap-3 rounded-lg p-3">
      {}
      <Skeleton className="size-12 shrink-0 rounded-full" />

      {}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-3 w-full" />
      </div>
    </div>;
}
export function ConversationListSkeleton() {
  return <div className="flex h-full flex-col">
      {}
      <div className="border-b p-3">
        <Skeleton className="h-9 w-full rounded-md" />
      </div>

      {}
      <div className="flex-1 space-y-1 overflow-hidden p-2">
        {Array.from({
        length: 6
      }).map((_, index) => <ConversationItemSkeleton key={index} />)}
      </div>
    </div>;
}
function MessageBubbleSkeleton({
  isMe
}: {
  isMe: boolean;
}) {
  return <div className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[75%] space-y-1">
        <Skeleton className={`h-10 rounded-2xl ${isMe ? "w-32 rounded-br-md" : "w-40 rounded-bl-md"}`} />
        <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>;
}
export function MessageAreaSkeleton() {
  const messagePattern = [false, true, true, false, true, false, false, true];
  return <div className="flex h-full flex-col justify-end space-y-3 p-4">
      {messagePattern.map((isMe, index) => <MessageBubbleSkeleton key={index} isMe={isMe} />)}
    </div>;
}