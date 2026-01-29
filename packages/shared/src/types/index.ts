/**
 * Shared Types
 * Common type definitions used across the application
 */

// User types - export from dedicated user types file
export * from "./user";

// Habit types (Epic 2)
export * from "./habits";

// Coaching types (Epic 2)
export * from "./coaching";

// Legacy User type alias for backwards compatibility
export type { Profile as User } from "./user";

// Common API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
