/**
 * Types for AI Coaching Service
 */

/**
 * Coaching mode based on user emotional state
 */
export type CoachingMode =
  | "warm_mentor" // Low energy, struggling user
  | "data_partner" // Motivated, analytical user
  | "accountability_buddy" // User making excuses
  | "educator"; // Confused user, needs learning

/**
 * Session types for coaching conversations
 */
export type SessionType =
  | "onboarding"
  | "check_in"
  | "habit_creation"
  | "habit_review"
  | "technique_learning"
  | "streak_recovery"
  | "motivation"
  | "general_chat";

/**
 * User context for personalized coaching
 */
export interface UserContext {
  userId: string;
  displayName?: string;
  currentStreak?: number;
  longestStreak?: number;
  mainHabitTitle?: string;
  recentCompletions?: number;
  totalHabits?: number;
  daysSinceJoined?: number;
}

/**
 * Message in chat history
 */
export interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Request for generating a coaching response
 */
export interface CoachingRequest {
  userMessage: string;
  sessionType: SessionType;
  context: UserContext;
  chatHistory?: ChatHistoryMessage[];
  sessionContext?: Record<string, unknown>;
}

/**
 * Response from AI coaching service
 */
export interface CoachingResponse {
  content: string;
  detectedMode: CoachingMode;
  suggestedHabit?: {
    title: string;
    routine: string;
    category: string;
    cueTrigger?: string;
  };
  metadata: {
    modelUsed: string;
    promptTokens?: number;
    completionTokens?: number;
    latencyMs: number;
  };
}

/**
 * Intent classification result
 */
export interface IntentClassification {
  mode: CoachingMode;
  confidence: number;
  signals: string[];
}
