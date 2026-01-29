import { relations } from "drizzle-orm";
import { pgTable, text, boolean, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Profiles table
 * Linked to Supabase auth.users via ID
 * Created automatically via database trigger on user signup
 */
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // References auth.users(id)
  email: text("email").notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  timezone: text("timezone").default("UTC"),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

/**
 * User preferences table
 * One-to-one relationship with profiles
 */
export const userPreferences = pgTable("user_preferences", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => profiles.id, { onDelete: "cascade" }),
  notificationEnabled: boolean("notification_enabled").default(true),
  emailDigestFrequency: text("email_digest_frequency").default("daily"), // 'daily', 'weekly', 'never'
  theme: text("theme").default("system"), // 'light', 'dark', 'system'
  coachingStyle: text("coaching_style").default("balanced"), // 'encouraging', 'challenging', 'balanced'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

/**
 * Relations for type-safe joins
 */
export const profilesRelations = relations(profiles, ({ one }) => ({
  preferences: one(userPreferences, {
    fields: [profiles.id],
    references: [userPreferences.userId],
  }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  profile: one(profiles, {
    fields: [userPreferences.userId],
    references: [profiles.id],
  }),
}));

/**
 * TypeScript types inferred from schema
 */
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type UserPreference = typeof userPreferences.$inferSelect;
export type NewUserPreference = typeof userPreferences.$inferInsert;
