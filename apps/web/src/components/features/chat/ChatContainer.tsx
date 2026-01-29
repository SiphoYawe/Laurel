"use client";

import { MessageCircle, Plus, AlertCircle, RefreshCw } from "lucide-react";
import { useState, useCallback } from "react";

import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";
import { WelcomeState } from "./WelcomeState";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase/auth-context";
import { trpc } from "@/lib/trpc/client";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
}

/**
 * ChatContainer Component
 * Main chat interface with message history and input
 */
export function ChatContainer() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // tRPC mutations
  const startSession = trpc.coaching.startSession.useMutation();
  const sendMessage = trpc.coaching.sendMessage.useMutation();

  /**
   * Start a new chat session
   */
  const handleNewChat = useCallback(async () => {
    try {
      setError(null);
      const session = await startSession.mutateAsync({
        sessionType: "general_chat",
      });
      setSessionId(session.id);
      setMessages([]);
    } catch (err) {
      setError("Failed to start a new chat. Please try again.");
      console.error("Failed to start session:", err);
    }
  }, [startSession]);

  /**
   * Send a message and get AI response
   */
  const handleSendMessage = useCallback(
    async (content: string) => {
      setError(null);

      // Start session if not already started
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        try {
          const session = await startSession.mutateAsync({
            sessionType: "general_chat",
          });
          currentSessionId = session.id;
          setSessionId(session.id);
        } catch (err) {
          setError("Failed to start chat session. Please try again.");
          console.error("Failed to start session:", err);
          return;
        }
      }

      // Add user message immediately (optimistic update)
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      try {
        // Send message and get AI response
        const response = await sendMessage.mutateAsync({
          sessionId: currentSessionId,
          content,
        });

        // Add AI response
        setMessages((prev) => [
          ...prev,
          {
            id: response.aiMessage.id,
            role: response.aiMessage.role,
            content: response.aiMessage.content,
            createdAt: new Date(response.aiMessage.createdAt),
          },
        ]);
      } catch (err) {
        setError("Failed to get a response. Please try again.");
        console.error("Failed to send message:", err);
      } finally {
        setIsTyping(false);
      }
    },
    [sessionId, startSession, sendMessage]
  );

  /**
   * Handle suggested prompt selection
   */
  const handlePromptSelect = useCallback(
    (prompt: string) => {
      handleSendMessage(prompt);
    },
    [handleSendMessage]
  );

  /**
   * Retry last failed message
   */
  const handleRetry = useCallback(() => {
    setError(null);
    // Find the last user message and resend it
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMessage) {
      // Remove the last user message and resend
      setMessages((prev) => prev.filter((m) => m.id !== lastUserMessage.id));
      handleSendMessage(lastUserMessage.content);
    }
  }, [messages, handleSendMessage]);

  // Get display name from user metadata or email
  const userName =
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    undefined;
  const hasMessages = messages.length > 0;

  return (
    <div className="border-border bg-card flex h-[calc(100vh-12rem)] flex-col rounded-xl border lg:h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="bg-laurel-forest/10 flex h-8 w-8 items-center justify-center rounded-lg">
            <MessageCircle className="text-laurel-forest h-4 w-4" />
          </div>
          <span className="text-foreground font-medium">Laurel AI Coach</span>
        </div>
        <Button
          className="gap-1"
          disabled={startSession.isPending}
          size="sm"
          variant="outline"
          onClick={handleNewChat}
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Messages or Welcome State */}
      {hasMessages ? (
        <MessageList isTyping={isTyping} messages={messages} userName={userName} />
      ) : (
        <WelcomeState userName={userName} onPromptSelect={handlePromptSelect} />
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-destructive/10 border-destructive/30 flex items-center justify-between border-t px-4 py-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-destructive h-4 w-4" />
            <span className="text-destructive text-sm">{error}</span>
          </div>
          <Button
            className="text-destructive hover:text-destructive gap-1"
            size="sm"
            variant="ghost"
            onClick={handleRetry}
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </Button>
        </div>
      )}

      {/* Input Area */}
      <div className="border-border border-t p-4">
        <ChatInput
          disabled={isTyping || sendMessage.isPending}
          placeholder={hasMessages ? "Type your message..." : "Ask Laurel anything..."}
          onSend={handleSendMessage}
        />
      </div>
    </div>
  );
}
