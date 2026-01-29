"use client";

import { Send } from "lucide-react";
import { useRef, useState, useCallback } from "react";
import TextareaAutosize from "react-textarea-autosize";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * ChatInput Component
 * Auto-resizing textarea with send button
 * - Enter to send
 * - Shift+Enter for new line
 * - Auto-expands up to 120px
 */
export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Type your message...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmedValue = value.trim();
    if (trimmedValue && !disabled) {
      onSend(trimmedValue);
      setValue("");
      // Reset height after clearing
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="flex items-end gap-3">
      <div className="relative flex-1">
        <TextareaAutosize
          ref={textareaRef}
          aria-label="Message input"
          className={cn(
            "border-input bg-background text-foreground placeholder:text-muted-foreground",
            "focus:ring-laurel-forest w-full resize-none rounded-3xl border px-4 py-3 text-sm",
            "focus:outline-none focus:ring-2",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          disabled={disabled}
          maxRows={4}
          minRows={1}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <Button
        aria-label="Send message"
        className={cn(
          "bg-laurel-forest hover:bg-laurel-forest/90 h-12 w-12 shrink-0 rounded-full transition-colors",
          !canSend && "cursor-not-allowed opacity-50"
        )}
        disabled={!canSend}
        size="icon"
        onClick={handleSend}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}

/**
 * Controlled version that accepts an external value
 */
interface ControlledChatInputProps extends Omit<ChatInputProps, "onSend"> {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function ControlledChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = "Type your message...",
}: ControlledChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmedValue = value.trim();
    if (trimmedValue && !disabled) {
      onSend();
      // Reset height after clearing
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="flex items-end gap-3">
      <div className="relative flex-1">
        <TextareaAutosize
          ref={textareaRef}
          aria-label="Message input"
          className={cn(
            "border-input bg-background text-foreground placeholder:text-muted-foreground",
            "focus:ring-laurel-forest w-full resize-none rounded-3xl border px-4 py-3 text-sm",
            "focus:outline-none focus:ring-2",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          disabled={disabled}
          maxRows={4}
          minRows={1}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <Button
        aria-label="Send message"
        className={cn(
          "bg-laurel-forest hover:bg-laurel-forest/90 h-12 w-12 shrink-0 rounded-full transition-colors",
          !canSend && "cursor-not-allowed opacity-50"
        )}
        disabled={!canSend}
        size="icon"
        onClick={handleSend}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
}
