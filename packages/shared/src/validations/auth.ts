import { z } from "zod";

/**
 * Auth Validation Schemas
 * Zod schemas for authentication forms
 */

/**
 * Email validation - reusable
 */
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

/**
 * Password validation - minimum 8 characters
 */
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters");

/**
 * Sign up form schema
 */
export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Sign in form schema
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

/**
 * Password reset request schema
 */
export const passwordResetSchema = z.object({
  email: emailSchema,
});

/**
 * New password schema (for reset flow)
 */
export const newPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Type exports for form handling
 */
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;

/**
 * Password strength calculator
 * Returns: 0-4 (weak, fair, good, strong, very strong)
 */
export function calculatePasswordStrength(password: string): number {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  return Math.min(strength, 4);
}

/**
 * Get password strength label
 */
export function getPasswordStrengthLabel(strength: number): "weak" | "fair" | "good" | "strong" {
  if (strength <= 1) return "weak";
  if (strength === 2) return "fair";
  if (strength === 3) return "good";
  return "strong";
}
