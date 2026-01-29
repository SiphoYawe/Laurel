import { MessageCircle } from "lucide-react";

import type { Metadata } from "next";

import { ChatContainer } from "@/components/features/chat";

export const metadata: Metadata = {
  title: "AI Coach - Laurel",
  description: "Chat with your AI habit coach.",
};

/**
 * Chat Page
 * AI coaching interface using Atomic Habits methodology
 */
export default function ChatPage() {
  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="bg-laurel-forest/10 flex h-10 w-10 items-center justify-center rounded-lg">
          <MessageCircle className="text-laurel-forest h-5 w-5" />
        </div>
        <div>
          <h1 className="text-foreground text-2xl font-bold">AI Coach</h1>
          <p className="text-muted-foreground text-sm">
            Chat with your habit coach using Atomic Habits methodology
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      <ChatContainer />
    </div>
  );
}
