import { z } from "zod";

/**
 * Shared Validations
 * Zod schemas for input validation
 */

// User validation schemas
export const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  displayName: z.string().min(2, "Display name must be at least 2 characters").max(50).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = loginSchema
  .extend({
    displayName: z.string().min(2, "Display name must be at least 2 characters").max(50),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Pagination validation
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// UUID validation
export const uuidSchema = z.string().uuid("Invalid ID format");
