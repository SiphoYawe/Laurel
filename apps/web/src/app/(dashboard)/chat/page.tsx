import { MessageCircle } from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Coach - Laurel",
  description: "Chat with your AI habit coach.",
};

/**
 * Chat Page
 * AI coaching interface using Atomic Habits methodology
 * Full implementation in Epic 2
 */
export default function ChatPage() {
  return (
    <div className="space-y-6">
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

      {/* Placeholder Chat Interface */}
      <div className="border-border bg-card flex h-[60vh] flex-col rounded-xl border">
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="text-center">
            <div className="bg-laurel-sage/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <MessageCircle className="text-laurel-sage h-8 w-8" />
            </div>
            <h3 className="text-foreground font-semibold">Coming Soon</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              AI coaching with Gemini 1.5 Pro will be available in Epic 2
            </p>
          </div>
        </div>

        {/* Placeholder Input */}
        <div className="border-border border-t p-4">
          <div className="flex gap-3">
            <input
              disabled
              className="border-input bg-background placeholder:text-muted-foreground focus:ring-laurel-forest flex-1 rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2"
              placeholder="Type your message... (Coming in Epic 2)"
              type="text"
            />
            <button
              disabled
              className="bg-laurel-forest rounded-lg px-4 py-2 text-sm font-medium text-white opacity-50"
              type="button"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
