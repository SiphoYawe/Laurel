import { z } from "zod";

/**
 * Habit category enum validation
 */
export const habitCategorySchema = z.enum([
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
 * Habit frequency enum validation
 */
export const habitFrequencySchema = z.enum(["daily", "weekdays", "weekends", "weekly", "custom"]);

/**
 * Create habit input validation
 */
export const createHabitSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  routine: z
    .string()
    .min(1, "Routine is required")
    .max(500, "Routine must be less than 500 characters"),
  category: habitCategorySchema,
  description: z.string().max(1000).optional().nullable(),
  cueTrigger: z.string().max(200).optional().nullable(),
  reward: z.string().max(200).optional().nullable(),
  twoMinuteVersion: z.string().max(200).optional().nullable(),
  frequency: habitFrequencySchema.optional().default("daily"),
  frequencyDays: z
    .array(z.number().int().min(0).max(6))
    .refine((days) => new Set(days).size === days.length, {
      message: "Frequency days must not contain duplicates",
    })
    .optional()
    .nullable(),
  durationMinutes: z.number().min(1).max(480).optional().default(15),
  targetTime: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)")
    .optional()
    .nullable(),
});

/**
 * Update habit input validation
 */
export const updateHabitSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .optional(),
  description: z.string().max(1000).optional().nullable(),
  cueTrigger: z.string().max(200).optional().nullable(),
  routine: z.string().max(500).optional(),
  reward: z.string().max(200).optional().nullable(),
  twoMinuteVersion: z.string().max(200).optional().nullable(),
  category: habitCategorySchema.optional(),
  frequency: habitFrequencySchema.optional(),
  frequencyDays: z
    .array(z.number().int().min(0).max(6))
    .refine((days) => new Set(days).size === days.length, {
      message: "Frequency days must not contain duplicates",
    })
    .optional()
    .nullable(),
  durationMinutes: z.number().min(1).max(480).optional(),
  targetTime: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)")
    .optional()
    .nullable(),
  isActive: z.boolean().optional(),
});

/**
 * Create habit completion input validation
 */
export const createHabitCompletionSchema = z.object({
  habitId: z.string().uuid("Invalid habit ID"),
  durationMinutes: z.number().min(1).max(480).optional(),
  notes: z.string().max(500).optional().nullable(),
  qualityRating: z.number().min(1).max(5).optional().nullable(),
});

/**
 * Habit ID param validation
 */
export const habitIdSchema = z.object({
  habitId: z.string().uuid("Invalid habit ID"),
});

// Note: Input types are defined in types/habits.ts
// Use z.infer for local inference if needed:
// type CreateHabitInput = z.infer<typeof createHabitSchema>;
