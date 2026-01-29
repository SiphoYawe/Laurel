/**
 * Habit Extraction Service
 *
 * Extracts habit parameters from natural language using Gemini
 * Implements Story 2-5: Natural Language Habit Creation from Chat
 */

import { z } from "zod";

import { getGeminiClient } from "../../lib/gemini";

/**
 * Schema for extracted habit parameters
 */
export const ExtractedHabitSchema = z.object({
  title: z.string().min(1).max(100).nullable(),
  routine: z.string().min(1).max(500).nullable(),
  cue_trigger: z.string().max(200).nullable(),
  duration_minutes: z.number().int().min(1).max(480).nullable(),
  category: z
    .enum([
      "study",
      "exercise",
      "health",
      "productivity",
      "mindfulness",
      "social",
      "creative",
      "other",
    ])
    .nullable(),
  target_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .nullable(),
  two_minute_version: z.string().max(200).nullable(),
});

export type ExtractedHabit = z.infer<typeof ExtractedHabitSchema>;

/**
 * Schema for extraction result
 */
export const ExtractionResultSchema = z.object({
  extracted: ExtractedHabitSchema,
  missing_fields: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  is_habit_creation: z.boolean(),
  clarification_question: z.string().nullable(),
});

export type ExtractionResult = z.infer<typeof ExtractionResultSchema>;

/**
 * Schema for confirmation intent detection
 */
export const ConfirmationIntentSchema = z.object({
  intent: z.enum(["confirm", "reject", "modify", "unclear"]),
  modification: z.string().nullable(),
  confidence: z.number().min(0).max(1),
});

export type ConfirmationIntent = z.infer<typeof ConfirmationIntentSchema>;

/**
 * Prompt for extracting habit parameters from user message
 */
const EXTRACTION_PROMPT = `You are a habit coach assistant. Extract habit parameters from the user's message.

User message: "{userMessage}"

Analyze the message and extract habit information if the user is describing a habit they want to build.
If they're not talking about creating a habit, set is_habit_creation to false.

Extract the following (if mentioned):
- title: Short name for the habit (e.g., "Study biology", "Morning run")
- routine: Full description of what to do (e.g., "Study biology for 15 minutes")
- cue_trigger: When/what triggers the habit (e.g., "After dinner", "When I wake up")
- duration_minutes: How long in minutes (number only)
- category: One of: study, exercise, health, productivity, mindfulness, social, creative, other
- target_time: Specific time if mentioned (HH:MM format, 24-hour)
- two_minute_version: A tiny version that takes < 2 minutes (e.g., "Open biology textbook")

Also determine:
- missing_fields: List of important fields not mentioned (title, routine are required)
- confidence: How confident you are in the extraction (0-1)
- is_habit_creation: Is this message about creating a new habit?
- clarification_question: If missing important info, suggest ONE clarifying question

Respond ONLY in valid JSON format:
{
  "extracted": {
    "title": string | null,
    "routine": string | null,
    "cue_trigger": string | null,
    "duration_minutes": number | null,
    "category": string | null,
    "target_time": string | null,
    "two_minute_version": string | null
  },
  "missing_fields": ["field1", "field2"],
  "confidence": number,
  "is_habit_creation": boolean,
  "clarification_question": string | null
}`;

/**
 * Prompt for detecting confirmation intent
 */
const CONFIRMATION_DETECTION_PROMPT = `Analyze the user's message to determine their intent regarding habit creation confirmation.

User message: "{userMessage}"

Determine:
- intent: Is this a "confirm" (yes, create it), "reject" (no, cancel), "modify" (make changes), or "unclear"
- modification: If intent is "modify", what change do they want? (null otherwise)
- confidence: How confident you are (0-1)

Common confirmation patterns: "yes", "create it", "sounds good", "perfect", "do it"
Common rejection patterns: "no", "cancel", "nevermind", "forget it"
Common modification patterns: "actually", "make it", "change", "instead", "minutes instead"

Respond ONLY in valid JSON format:
{
  "intent": "confirm" | "reject" | "modify" | "unclear",
  "modification": string | null,
  "confidence": number
}`;

/**
 * Prompt for generating two-minute version
 */
const TWO_MINUTE_VERSION_PROMPT = `Based on this habit, suggest a "two-minute version" - the tiniest version that takes less than 2 minutes to do.

Habit: "{routine}" ({duration} minutes)

The two-minute rule: "When you start a new habit, it should take less than two minutes to do."
The goal is to make starting so easy that you can't say no.

Examples:
- "Run 5 miles" → "Put on running shoes"
- "Study for 1 hour" → "Open textbook"
- "Write essay" → "Write one sentence"
- "Practice piano" → "Play one scale"
- "Read for 30 minutes" → "Read one page"

Respond with ONLY the two-minute version text (no explanation, no quotes):`;

/**
 * Extract habit parameters from user message
 */
export async function extractHabitFromMessage(userMessage: string): Promise<ExtractionResult> {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500,
        responseMimeType: "application/json",
      },
    });

    const prompt = EXTRACTION_PROMPT.replace("{userMessage}", userMessage);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse and validate response
    const parsed = JSON.parse(responseText);
    return ExtractionResultSchema.parse(parsed);
  } catch (error) {
    console.error("Habit extraction failed:", error);
    // Return default "not a habit" result
    return {
      extracted: {
        title: null,
        routine: null,
        cue_trigger: null,
        duration_minutes: null,
        category: null,
        target_time: null,
        two_minute_version: null,
      },
      missing_fields: ["title", "routine"],
      confidence: 0,
      is_habit_creation: false,
      clarification_question: null,
    };
  }
}

/**
 * Detect user's confirmation intent
 */
export async function detectConfirmationIntent(userMessage: string): Promise<ConfirmationIntent> {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 200,
        responseMimeType: "application/json",
      },
    });

    const prompt = CONFIRMATION_DETECTION_PROMPT.replace("{userMessage}", userMessage);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const parsed = JSON.parse(responseText);
    return ConfirmationIntentSchema.parse(parsed);
  } catch (error) {
    console.error("Confirmation detection failed:", error);
    return {
      intent: "unclear",
      modification: null,
      confidence: 0,
    };
  }
}

/**
 * Generate a two-minute version of a habit
 */
export async function generateTwoMinuteVersion(
  routine: string,
  durationMinutes?: number | null
): Promise<string> {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100,
      },
    });

    const prompt = TWO_MINUTE_VERSION_PROMPT.replace("{routine}", routine).replace(
      "{duration}",
      durationMinutes?.toString() || "unknown"
    );

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Two-minute version generation failed:", error);
    // Return a simple default
    return `Start ${routine.toLowerCase().slice(0, 30)}...`;
  }
}

/**
 * Apply modification to extracted habit
 */
export async function applyModificationToHabit(
  currentHabit: Partial<ExtractedHabit>,
  modificationRequest: string
): Promise<ExtractionResult> {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500,
        responseMimeType: "application/json",
      },
    });

    const prompt = `Current habit being created:
${JSON.stringify(currentHabit, null, 2)}

User's modification request: "${modificationRequest}"

Update the habit based on the user's request. Keep all existing values unless the user specifically wants to change them.

Respond ONLY in valid JSON format:
{
  "extracted": {
    "title": string | null,
    "routine": string | null,
    "cue_trigger": string | null,
    "duration_minutes": number | null,
    "category": string | null,
    "target_time": string | null,
    "two_minute_version": string | null
  },
  "missing_fields": ["field1", "field2"],
  "confidence": number,
  "is_habit_creation": true,
  "clarification_question": null
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const parsed = JSON.parse(responseText);
    return ExtractionResultSchema.parse(parsed);
  } catch (error) {
    console.error("Modification application failed:", error);
    // Return the original habit unchanged
    return {
      extracted: {
        title: currentHabit.title || null,
        routine: currentHabit.routine || null,
        cue_trigger: currentHabit.cue_trigger || null,
        duration_minutes: currentHabit.duration_minutes || null,
        category: currentHabit.category || null,
        target_time: currentHabit.target_time || null,
        two_minute_version: currentHabit.two_minute_version || null,
      },
      missing_fields: [],
      confidence: 0.5,
      is_habit_creation: true,
      clarification_question: null,
    };
  }
}

/**
 * Format habit for confirmation message
 */
export function formatHabitForConfirmation(habit: Partial<ExtractedHabit>): string {
  const parts: string[] = [];

  if (habit.title) {
    parts.push(`**Habit:** ${habit.title}`);
  }

  if (habit.routine) {
    parts.push(`**What you'll do:** ${habit.routine}`);
  }

  if (habit.cue_trigger) {
    parts.push(`**Trigger:** ${habit.cue_trigger}`);
  }

  if (habit.duration_minutes) {
    parts.push(`**Duration:** ${habit.duration_minutes} minutes`);
  }

  if (habit.target_time) {
    parts.push(`**Time:** ${habit.target_time}`);
  }

  if (habit.category) {
    parts.push(`**Category:** ${habit.category}`);
  }

  return parts.join("\n");
}

/**
 * Check if extraction has required fields
 */
export function hasRequiredFields(habit: Partial<ExtractedHabit>): boolean {
  return !!(habit.title && habit.routine);
}

/**
 * Habit creation context for session storage
 */
export interface HabitCreationContext {
  state: "idle" | "extracting" | "confirming" | "clarifying" | "modifying" | "creating";
  pendingHabit: Partial<ExtractedHabit> | null;
  missingFields: string[];
  lastExtraction: ExtractionResult | null;
  conversationTurn: number;
}

/**
 * Create initial habit creation context
 */
export function createInitialHabitContext(): HabitCreationContext {
  return {
    state: "idle",
    pendingHabit: null,
    missingFields: [],
    lastExtraction: null,
    conversationTurn: 0,
  };
}
