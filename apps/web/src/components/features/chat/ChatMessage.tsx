"use client";

import { motion, useReducedMotion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
  /** Avatar URL - reserved for future use when profile avatars are implemented */
  avatar?: string | null;
  userName?: string;
}

/**
 * ChatMessage Component
 * Renders a single chat message with proper alignment and styling
 * - User messages: right-aligned with green background
 * - AI messages: left-aligned with avatar and white background
 */
export function ChatMessage({
  role,
  content,
  timestamp,
  avatar: _avatar, // Reserved for future profile avatar support
  userName,
}: ChatMessageProps) {
  const prefersReducedMotion = useReducedMotion();
  const isUser = role === "user";

  const variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const reducedMotionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <motion.div
      animate="visible"
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
      initial="hidden"
      transition={{ duration: 0.2 }}
      variants={prefersReducedMotion ? reducedMotionVariants : variants}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium",
          isUser ? "bg-laurel-forest text-white" : "bg-laurel-sage/30 text-laurel-forest"
        )}
      >
        {isUser ? userName?.[0]?.toUpperCase() || "U" : <LaurelIcon className="h-5 w-5" />}
      </div>

      {/* Message bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser ? "bg-laurel-forest text-white" : "bg-card border-border text-foreground border"
        )}
      >
        {/* Markdown content for AI, plain text for user */}
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm">{content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                // Custom styling for markdown elements
                p: ({ children }) => <p className="text-foreground mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => (
                  <strong className="text-laurel-forest font-semibold">{children}</strong>
                ),
                ul: ({ children }) => <ul className="my-2 ml-4 list-disc space-y-1">{children}</ul>,
                ol: ({ children }) => (
                  <ol className="my-2 ml-4 list-decimal space-y-1">{children}</ol>
                ),
                li: ({ children }) => <li className="text-foreground text-sm">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-laurel-sage bg-laurel-sage/10 my-2 border-l-4 py-1 pl-3 italic">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-muted rounded px-1 py-0.5 text-xs">{children}</code>
                ),
              }}
              remarkPlugins={[remarkGfm]}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}

        {/* Timestamp */}
        {timestamp && (
          <p className={cn("mt-1 text-xs", isUser ? "text-white/70" : "text-muted-foreground")}>
            {formatTimestamp(timestamp)}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Laurel leaf icon for AI avatar
 */
function LaurelIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 3c-1.5 0-4 1.5-4 4.5C8 10 10 12 12 12s4-2 4-4.5C16 4.5 13.5 3 12 3z" />
      <path d="M12 12v9" />
      <path d="M8 17c1.5-1.5 4-1.5 4-1.5s2.5 0 4 1.5" />
    </svg>
  );
}

/**
 * Format timestamp for display
 */
function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}
