import { z } from "zod";

import { getAICoachingService } from "../services/ai";
import { protectedProcedure, router } from "../trpc";

import type { SessionType } from "../services/ai/types";

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

// In-memory session storage (will be replaced with database in future)
const sessions = new Map<string, CoachingSession>();
const messageHistory = new Map<string, ChatMessage[]>();

/**
 * Session types enum
 */
const SESSION_TYPES = [
  "habit_creation",
  "habit_review",
  "motivation",
  "technique_learning",
  "streak_recovery",
  "general_chat",
  "onboarding",
  "check_in",
] as const;

/**
 * Check if Gemini API is available
 */
function isGeminiAvailable(): boolean {
  return !!(process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY);
}

/**
 * Coaching router for AI chat functionality
 */
export const coachingRouter = router({
  /**
   * Get current active session or null
   */
  getSession: protectedProcedure.query(async ({ ctx }) => {
    // Find the user's most recent session
    for (const [_id, session] of sessions) {
      if (session.userId === ctx.userId && !session.endedAt) {
        return session;
      }
    }
    return null;
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
    .query(async ({ ctx: _ctx, input }) => {
      if (!input.sessionId) {
        return [];
      }
      const history = messageHistory.get(input.sessionId) || [];
      return history.slice(-input.limit);
    }),

  /**
   * Start a new coaching session
   */
  startSession: protectedProcedure
    .input(
      z.object({
        sessionType: z.enum(SESSION_TYPES).default("general_chat"),
        context: z.record(z.unknown()).optional().default({}),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const session: CoachingSession = {
        id: crypto.randomUUID(),
        userId: ctx.userId,
        sessionType: input.sessionType,
        context: input.context,
        startedAt: new Date(),
        endedAt: null,
        createdAt: new Date(),
      };

      // Store session
      sessions.set(session.id, session);
      messageHistory.set(session.id, []);

      return session;
    }),

  /**
   * Send a message and get AI response
   */
  sendMessage: protectedProcedure
    .input(
      z.object({
        sessionId: z.string().uuid(),
        content: z.string().min(1).max(5000),
        chatHistory: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const session = sessions.get(input.sessionId);

      // Create user message
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sessionId: input.sessionId,
        role: "user",
        content: input.content,
        metadata: {},
        createdAt: new Date(),
      };

      // Store user message in history
      const history = messageHistory.get(input.sessionId) || [];
      history.push(userMessage);

      let aiContent: string;
      let metadata: Record<string, unknown> = {};

      // Use Gemini AI if available, otherwise use mock
      if (isGeminiAvailable()) {
        try {
          const aiService = getAICoachingService();

          // Build chat history from stored messages
          const chatHistory = history
            .filter((m) => m.role !== "system")
            .map((m) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            }));

          const response = await aiService.generateResponse({
            userMessage: input.content,
            sessionType: (session?.sessionType || "general_chat") as SessionType,
            context: {
              userId: ctx.userId,
              // Add more context as available from database
            },
            chatHistory: chatHistory.slice(0, -1), // Exclude the current message
          });

          aiContent = response.content;
          metadata = {
            modelUsed: response.metadata.modelUsed,
            latencyMs: response.metadata.latencyMs,
            detectedMode: response.detectedMode,
            suggestedHabit: response.suggestedHabit,
          };
        } catch (error) {
          console.error("Gemini AI error, falling back to mock:", error);
          aiContent = getMockResponse(input.content);
          metadata = {
            modelUsed: "mock-fallback",
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      } else {
        // Use mock response when API key not available
        aiContent = getMockResponse(input.content);
        metadata = {
          modelUsed: "mock-model",
          reason: "GEMINI_API_KEY not configured",
        };
      }

      // Create AI message
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sessionId: input.sessionId,
        role: "assistant",
        content: aiContent,
        metadata,
        createdAt: new Date(),
      };

      // Store AI message in history
      history.push(aiMessage);
      messageHistory.set(input.sessionId, history);

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
    .mutation(async ({ ctx: _ctx, input }) => {
      const session = sessions.get(input.sessionId);
      if (session) {
        session.endedAt = new Date();
        sessions.set(input.sessionId, session);
      }
      return { success: true };
    }),
});

/**
 * Mock response generator for development/fallback
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
