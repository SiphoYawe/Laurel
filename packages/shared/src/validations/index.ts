import { z } from "zod";

/**
 * Shared Validations
 * Zod schemas for input validation
 */

// Re-export auth validations
export * from "./auth";

// Re-export habit validations (Epic 2)
export * from "./habits";

// Re-export coaching validations (Epic 2)
export * from "./coaching";

// User validation schemas
export const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  displayName: z.string().min(2, "Display name must be at least 2 characters").max(50).optional(),
});

// Pagination validation
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// UUID validation
export const uuidSchema = z.string().uuid("Invalid ID format");
