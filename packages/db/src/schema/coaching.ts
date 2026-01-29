import { relations } from "drizzle-orm";
import { index, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { profiles } from "./users";

/**
 * Session type enum
 * Types of coaching sessions
 */
export const sessionTypeEnum = pgEnum("session_type", [
  "habit_creation",
  "habit_review",
  "motivation",
  "technique_learning",
  "streak_recovery",
  "general_chat",
]);

/**
 * Message role enum
 * Roles for chat messages
 */
export const messageRoleEnum = pgEnum("message_role", ["user", "assistant", "system"]);

/**
 * Coaching sessions table
 * Tracks individual coaching conversation sessions
 */
export const coachingSessions = pgTable(
  "coaching_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    startedAt: timestamp("started_at", { withTimezone: true }).defaultNow(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    sessionType: sessionTypeEnum("session_type").notNull(),
    context: jsonb("context").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index("coaching_sessions_user_id_idx").on(table.userId),
  })
);

/**
 * Coaching messages table
 * Stores individual messages within coaching sessions
 */
export const coachingMessages = pgTable(
  "coaching_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => coachingSessions.id, { onDelete: "cascade" }),
    role: messageRoleEnum("role").notNull(),
    content: text("content").notNull(),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    sessionIdIdx: index("coaching_messages_session_id_idx").on(table.sessionId),
  })
);

/**
 * Relations for coaching
 */
export const coachingSessionsRelations = relations(coachingSessions, ({ one, many }) => ({
  user: one(profiles, {
    fields: [coachingSessions.userId],
    references: [profiles.id],
  }),
  messages: many(coachingMessages),
}));

export const coachingMessagesRelations = relations(coachingMessages, ({ one }) => ({
  session: one(coachingSessions, {
    fields: [coachingMessages.sessionId],
    references: [coachingSessions.id],
  }),
}));

/**
 * TypeScript types inferred from schema
 */
export type CoachingSession = typeof coachingSessions.$inferSelect;
export type NewCoachingSession = typeof coachingSessions.$inferInsert;
export type CoachingMessage = typeof coachingMessages.$inferSelect;
export type NewCoachingMessage = typeof coachingMessages.$inferInsert;

// Re-export enum values for use in application code
export type SessionType = (typeof sessionTypeEnum.enumValues)[number];
export type MessageRole = (typeof messageRoleEnum.enumValues)[number];
