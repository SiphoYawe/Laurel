import { z } from "zod";

/**
 * Session type enum validation
 */
export const sessionTypeSchema = z.enum([
  "habit_creation",
  "habit_review",
  "motivation",
  "technique_learning",
  "streak_recovery",
  "general_chat",
]);

/**
 * Message role enum validation
 */
export const messageRoleSchema = z.enum(["user", "assistant", "system"]);

/**
 * Session context validation
 */
export const sessionContextSchema = z
  .object({
    habitId: z.string().uuid().optional(),
    habitTitle: z.string().optional(),
    currentStreak: z.number().optional(),
    coachingMode: z.enum(["warm", "data", "accountability", "educator"]).optional(),
  })
  .passthrough(); // Allow additional properties

/**
 * Create coaching session input validation
 */
export const createCoachingSessionSchema = z.object({
  sessionType: sessionTypeSchema,
  context: sessionContextSchema.optional().default({}),
});

/**
 * Message metadata validation
 */
export const messageMetadataSchema = z
  .object({
    tokenCount: z.number().optional(),
    modelUsed: z.string().optional(),
    latencyMs: z.number().optional(),
    suggestedHabit: z
      .object({
        title: z.string(),
        routine: z.string(),
        category: z.string(),
      })
      .optional(),
  })
  .passthrough(); // Allow additional properties

/**
 * Create coaching message input validation
 */
export const createCoachingMessageSchema = z.object({
  sessionId: z.string().uuid("Invalid session ID"),
  role: messageRoleSchema,
  content: z.string().min(1, "Message content is required").max(10000, "Message too long"),
  metadata: messageMetadataSchema.optional().default({}),
});

/**
 * Chat input validation
 */
export const chatInputSchema = z.object({
  message: z.string().min(1, "Message is required").max(5000, "Message too long"),
  sessionId: z.string().uuid().optional(),
  sessionType: sessionTypeSchema.optional().default("general_chat"),
  context: sessionContextSchema.optional(),
});

/**
 * Session ID param validation
 */
export const sessionIdSchema = z.object({
  sessionId: z.string().uuid("Invalid session ID"),
});

// Note: Input types are defined in types/coaching.ts
// Use z.infer for local inference if needed:
// type CreateCoachingSessionInput = z.infer<typeof createCoachingSessionSchema>;
