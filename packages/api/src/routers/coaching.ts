import { z } from "zod";

import { protectedProcedure, router } from "../trpc";

/**
 * Message type for chat history
 */
export interface ChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

/**
 * Session type for coaching sessions
 */
export interface CoachingSession {
  id: string;
  userId: string;
  sessionType: string;
  context: Record<string, unknown>;
  startedAt: Date;
  endedAt: Date | null;
  createdAt: Date;
}

/**
 * Coaching router for AI chat functionality
 */
export const coachingRouter = router({
  /**
   * Get current active session or null
   */
  getSession: protectedProcedure.query(async ({ ctx: _ctx }) => {
    // TODO: Implement with Drizzle once Story 2.3 is complete
    // For now, return mock session for UI development
    return null as CoachingSession | null;
  }),

  /**
   * Get message history for a session
   */
  getHistory: protectedProcedure
    .input(
      z.object({
        sessionId: z.string().uuid().optional(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx: _ctx, input: _input }) => {
      // TODO: Implement with Drizzle once Story 2.3 is complete
      // For now, return empty array for UI development
      return [] as ChatMessage[];
    }),

  /**
   * Start a new coaching session
   */
  startSession: protectedProcedure
    .input(
      z.object({
        sessionType: z
          .enum([
            "habit_creation",
            "habit_review",
            "motivation",
            "technique_learning",
            "streak_recovery",
            "general_chat",
          ])
          .default("general_chat"),
        context: z.record(z.unknown()).optional().default({}),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Implement with Drizzle once Story 2.3 is complete
      // For now, return mock session
      const session: CoachingSession = {
        id: crypto.randomUUID(),
        userId: ctx.userId,
        sessionType: input.sessionType,
        context: input.context,
        startedAt: new Date(),
        endedAt: null,
        createdAt: new Date(),
      };
      return session;
    }),

  /**
   * Send a message and get AI response
   * This will be connected to Gemini AI in Story 2.3
   */
  sendMessage: protectedProcedure
    .input(
      z.object({
        sessionId: z.string().uuid(),
        content: z.string().min(1).max(5000),
      })
    )
    .mutation(async ({ ctx: _ctx, input }) => {
      // TODO: Implement with Gemini AI in Story 2.3
      // For now, return a mock response for UI development

      // Create user message
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sessionId: input.sessionId,
        role: "user",
        content: input.content,
        metadata: {},
        createdAt: new Date(),
      };

      // Create mock AI response
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sessionId: input.sessionId,
        role: "assistant",
        content: getMockResponse(input.content),
        metadata: {
          modelUsed: "mock-model",
          latencyMs: 500,
        },
        createdAt: new Date(),
      };

      return {
        userMessage,
        aiMessage,
      };
    }),

  /**
   * End a coaching session
   */
  endSession: protectedProcedure
    .input(z.object({ sessionId: z.string().uuid() }))
    .mutation(async ({ ctx: _ctx, input: _input }) => {
      // TODO: Implement with Drizzle once Story 2.3 is complete
      return { success: true };
    }),
});

/**
 * Mock response generator for UI development
 * Will be replaced with Gemini AI in Story 2.3
 */
function getMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("study") || lowerMessage.includes("habit")) {
    return `Great question about building study habits! Based on the Atomic Habits framework, I'd suggest:

1. **Make it obvious**: Set a specific time and place for studying
2. **Make it attractive**: Pair studying with something you enjoy
3. **Make it easy**: Start with just 2 minutes
4. **Make it satisfying**: Track your progress visually

Would you like help setting up a specific study habit using this framework?`;
  }

  if (lowerMessage.includes("two-minute") || lowerMessage.includes("2 minute")) {
    return `The **Two-Minute Rule** is a powerful technique from Atomic Habits:

> "When you start a new habit, it should take less than two minutes to do."

For example:
- "Read before bed" becomes "Read one page"
- "Study for exams" becomes "Open my notes"
- "Exercise daily" becomes "Put on my workout clothes"

The key is to make starting so easy that you can't say no. Once you've started, momentum takes over.

Would you like me to help you create a two-minute version of a habit you're working on?`;
  }

  if (lowerMessage.includes("consistent") || lowerMessage.includes("stick")) {
    return `Staying consistent is one of the biggest challenges! Here's what works:

**1. Never miss twice**
If you miss a day, that's okay. But never miss two in a row.

**2. Reduce scope, not schedule**
On tough days, do a tiny version of your habit instead of skipping entirely.

**3. Environment design**
Make good habits easy and bad habits hard by designing your space.

**4. Track visually**
Use a streak counter or calendar to see your progress.

What's a specific habit you'd like to be more consistent with?`;
  }

  return `I'm here to help you build better habits! I use the **Atomic Habits** framework by James Clear to help you:

- Create habits that actually stick
- Break bad habits you want to change
- Stay motivated with streak tracking
- Learn proven techniques like habit stacking

What would you like to work on today? You can tell me about:
- A new habit you want to build
- A habit you're struggling with
- Questions about habit formation`;
}
