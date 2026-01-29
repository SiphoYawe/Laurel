/**
 * Coaching Types
 * Type definitions for AI coaching sessions and messages
 */

/**
 * Coaching session types
 */
export type SessionType =
  | "habit_creation"
  | "habit_review"
  | "motivation"
  | "technique_learning"
  | "streak_recovery"
  | "general_chat";

/**
 * Message role in conversation
 */
export type MessageRole = "user" | "assistant" | "system";

/**
 * Coaching session context
 */
export interface SessionContext {
  habitId?: string;
  habitTitle?: string;
  currentStreak?: number;
  coachingMode?: "warm" | "data" | "accountability" | "educator";
  [key: string]: unknown;
}

/**
 * Coaching session
 */
export interface CoachingSession {
  id: string;
  userId: string;
  startedAt: Date | null;
  endedAt: Date | null;
  sessionType: SessionType;
  context: SessionContext;
  createdAt: Date | null;
}

/**
 * Create coaching session input
 */
export interface CreateCoachingSessionInput {
  sessionType: SessionType;
  context?: SessionContext;
}

/**
 * Message metadata
 */
export interface MessageMetadata {
  tokenCount?: number;
  modelUsed?: string;
  latencyMs?: number;
  suggestedHabit?: {
    title: string;
    routine: string;
    category: string;
  };
  [key: string]: unknown;
}

/**
 * Coaching message
 */
export interface CoachingMessage {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  metadata: MessageMetadata;
  createdAt: Date | null;
}

/**
 * Create coaching message input
 */
export interface CreateCoachingMessageInput {
  sessionId: string;
  role: MessageRole;
  content: string;
  metadata?: MessageMetadata;
}

/**
 * Session with messages
 */
export interface CoachingSessionWithMessages extends CoachingSession {
  messages: CoachingMessage[];
}

/**
 * Chat input for AI coaching
 */
export interface ChatInput {
  message: string;
  sessionId?: string;
  sessionType?: SessionType;
  context?: SessionContext;
}

/**
 * Chat response from AI coaching
 */
export interface ChatResponse {
  message: CoachingMessage;
  session: CoachingSession;
  suggestedActions?: SuggestedAction[];
}

/**
 * Suggested action from AI
 */
export interface SuggestedAction {
  type: "create_habit" | "complete_habit" | "view_streak" | "learn_technique";
  label: string;
  data?: Record<string, unknown>;
}

/**
 * Session type display configuration
 */
export const SESSION_TYPE_CONFIG: Record<
  SessionType,
  {
    label: string;
    description: string;
    icon: string;
  }
> = {
  habit_creation: {
    label: "Create Habit",
    description: "Design a new habit with AI guidance",
    icon: "Plus",
  },
  habit_review: {
    label: "Review Habits",
    description: "Analyze and optimize your habits",
    icon: "BarChart",
  },
  motivation: {
    label: "Get Motivated",
    description: "Boost your motivation and commitment",
    icon: "Flame",
  },
  technique_learning: {
    label: "Learn Techniques",
    description: "Discover study and habit techniques",
    icon: "Lightbulb",
  },
  streak_recovery: {
    label: "Recover Streak",
    description: "Get back on track after a miss",
    icon: "RefreshCw",
  },
  general_chat: {
    label: "Chat",
    description: "Free conversation with your coach",
    icon: "MessageCircle",
  },
};
