/**
 * User Types
 * Type definitions for user-related data structures
 * These types match the database schema in packages/db/src/schema/users.ts
 */

/**
 * User profile as stored in the database
 */
export interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  timezone: string | null;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User preferences for app customization
 */
export interface UserPreferences {
  userId: string;
  notificationEnabled: boolean;
  emailDigestFrequency: EmailDigestFrequency;
  theme: Theme;
  coachingStyle: CoachingStyle;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Email digest frequency options
 */
export type EmailDigestFrequency = "daily" | "weekly" | "never";

/**
 * Theme options
 */
export type Theme = "light" | "dark" | "system";

/**
 * AI coaching style options
 */
export type CoachingStyle = "encouraging" | "challenging" | "balanced";

/**
 * Combined user data (profile + preferences)
 */
export interface UserWithPreferences extends Profile {
  preferences: UserPreferences | null;
}

/**
 * Input for creating a new profile
 */
export interface CreateProfileInput {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

/**
 * Input for updating a profile
 */
export interface UpdateProfileInput {
  fullName?: string;
  avatarUrl?: string;
  timezone?: string;
  onboardingCompleted?: boolean;
}

/**
 * Input for updating user preferences
 */
export interface UpdatePreferencesInput {
  notificationEnabled?: boolean;
  emailDigestFrequency?: EmailDigestFrequency;
  theme?: Theme;
  coachingStyle?: CoachingStyle;
}

/**
 * Auth session user (from Supabase Auth)
 */
export interface AuthUser {
  id: string;
  email: string;
  emailConfirmedAt?: string;
  phone?: string;
  lastSignInAt?: string;
  appMetadata: Record<string, unknown>;
  userMetadata: {
    fullName?: string;
    avatarUrl?: string;
    [key: string]: unknown;
  };
  createdAt: string;
}
