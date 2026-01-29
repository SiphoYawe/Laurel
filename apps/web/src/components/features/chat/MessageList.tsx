"use client";

import { useRef, useEffect } from "react";

import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
}

interface MessageListProps {
  messages: Message[];
  isTyping?: boolean;
  userName?: string;
}

/**
 * MessageList Component
 * Scrollable container for chat messages with auto-scroll
 */
export function MessageList({ messages, isTyping = false, userName }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or typing state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div
      ref={scrollRef}
      aria-label="Chat messages"
      aria-live="polite"
      className="flex-1 overflow-y-auto px-4 py-4"
      role="log"
    >
      <div className="mx-auto max-w-2xl space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            role={message.role}
            timestamp={message.createdAt}
            userName={userName}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

/**
 * Loading skeleton for message list
 */
export function MessageListSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="mx-auto max-w-2xl space-y-4">
        {/* AI message skeleton */}
        <div className="flex gap-3">
          <div className="bg-muted h-8 w-8 animate-pulse rounded-full" />
          <div className="bg-muted h-24 w-3/4 animate-pulse rounded-2xl" />
        </div>

        {/* User message skeleton */}
        <div className="flex flex-row-reverse gap-3">
          <div className="bg-muted h-8 w-8 animate-pulse rounded-full" />
          <div className="bg-muted h-12 w-1/2 animate-pulse rounded-2xl" />
        </div>

        {/* AI message skeleton */}
        <div className="flex gap-3">
          <div className="bg-muted h-8 w-8 animate-pulse rounded-full" />
          <div className="bg-muted h-32 w-2/3 animate-pulse rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
