import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { profiles } from "./users";

/**
 * Habit category enum
 * Categories for organizing habits
 */
export const habitCategoryEnum = pgEnum("habit_category", [
  "study",
  "exercise",
  "health",
  "productivity",
  "mindfulness",
  "social",
  "creative",
  "other",
]);

/**
 * Habit frequency enum
 * How often a habit should be performed
 */
export const habitFrequencyEnum = pgEnum("habit_frequency", [
  "daily",
  "weekdays",
  "weekends",
  "weekly",
  "custom",
]);

/**
 * Habits table
 * Core table for storing user habits based on Atomic Habits framework
 */
export const habits = pgTable(
  "habits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    cueTrigger: text("cue_trigger"), // "After I [X]..."
    routine: text("routine").notNull(), // "I will [Y]..."
    reward: text("reward"),
    twoMinuteVersion: text("two_minute_version"),
    category: habitCategoryEnum("category").notNull(),
    frequency: habitFrequencyEnum("frequency").notNull().default("daily"),
    frequencyDays: integer("frequency_days").array(), // [0-6] for custom days
    durationMinutes: integer("duration_minutes").default(15),
    targetTime: time("target_time"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index("habits_user_id_idx").on(table.userId),
  })
);

/**
 * Habit completions table
 * Records each time a habit is completed
 */
export const habitCompletions = pgTable(
  "habit_completions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    habitId: uuid("habit_id")
      .notNull()
      .references(() => habits.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    completedAt: timestamp("completed_at", { withTimezone: true }).defaultNow(),
    durationMinutes: integer("duration_minutes"),
    notes: text("notes"),
    qualityRating: integer("quality_rating"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    habitIdIdx: index("habit_completions_habit_id_idx").on(table.habitId),
    completedAtIdx: index("habit_completions_completed_at_idx").on(table.completedAt),
    userIdIdx: index("habit_completions_user_id_idx").on(table.userId),
    habitIdCompletedAtIdx: index("habit_completions_habit_id_completed_at_idx").on(
      table.habitId,
      table.completedAt
    ),
    qualityRatingCheck: check(
      "quality_rating_check",
      sql`${table.qualityRating} IS NULL OR (${table.qualityRating} >= 1 AND ${table.qualityRating} <= 5)`
    ),
  })
);

/**
 * Habit streaks table
 * Tracks current and longest streaks for each habit
 * One-to-one relationship with habits
 */
export const habitStreaks = pgTable("habit_streaks", {
  habitId: uuid("habit_id")
    .primaryKey()
    .references(() => habits.id, { onDelete: "cascade" }),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastCompletedDate: date("last_completed_date"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

/**
 * Relations for habits
 */
export const habitsRelations = relations(habits, ({ one, many }) => ({
  user: one(profiles, {
    fields: [habits.userId],
    references: [profiles.id],
  }),
  completions: many(habitCompletions),
  streak: one(habitStreaks, {
    fields: [habits.id],
    references: [habitStreaks.habitId],
  }),
}));

export const habitCompletionsRelations = relations(habitCompletions, ({ one }) => ({
  habit: one(habits, {
    fields: [habitCompletions.habitId],
    references: [habits.id],
  }),
  user: one(profiles, {
    fields: [habitCompletions.userId],
    references: [profiles.id],
  }),
}));

export const habitStreaksRelations = relations(habitStreaks, ({ one }) => ({
  habit: one(habits, {
    fields: [habitStreaks.habitId],
    references: [habits.id],
  }),
}));

/**
 * TypeScript types inferred from schema
 */
export type Habit = typeof habits.$inferSelect;
export type NewHabit = typeof habits.$inferInsert;
export type HabitCompletion = typeof habitCompletions.$inferSelect;
export type NewHabitCompletion = typeof habitCompletions.$inferInsert;
export type HabitStreak = typeof habitStreaks.$inferSelect;
export type NewHabitStreak = typeof habitStreaks.$inferInsert;

// Re-export enum values for use in application code
export type HabitCategory = (typeof habitCategoryEnum.enumValues)[number];
export type HabitFrequency = (typeof habitFrequencyEnum.enumValues)[number];
