/**
 * Two-Minute Rule Generator
 * Story 2-8: AI-powered generation of two-minute habit versions
 *
 * Based on James Clear's Two-Minute Rule from Atomic Habits:
 * "When you start a new habit, it should take less than two minutes to do."
 */

import { getGeminiClient } from "../../lib/gemini";

/**
 * Two-minute version generation prompt
 */
const TWO_MINUTE_PROMPT = `Generate a 2-minute starter version of this habit.

The 2-minute version should be:
1. The absolute minimum first step to start the habit
2. Completable in under 2 minutes
3. Physical and concrete (not mental preparation)
4. The action that removes the biggest friction

Habit: {habitTitle}
Full description: {habitRoutine}
Duration: {duration} minutes
Category: {category}

Examples:
- "Study biology for 1 hour" -> "Open biology textbook and read one paragraph"
- "Run 5 miles" -> "Put on running shoes and step outside"
- "Write essay" -> "Write one sentence"
- "Practice piano 30 min" -> "Play one scale"
- "Read for 30 minutes" -> "Read one page"
- "Meditate for 20 minutes" -> "Sit in meditation position and take 3 breaths"
- "Exercise for 45 minutes" -> "Do 5 jumping jacks"
- "Learn Spanish 20 min" -> "Review 3 vocabulary words"
- "Complete math homework" -> "Solve one problem"

Generate only the 2-minute version as a short phrase (5-10 words), nothing else.`;

/**
 * Category-specific fallbacks for when AI fails
 */
const CATEGORY_FALLBACKS: Record<string, string[]> = {
  study: [
    "Open your textbook",
    "Read one paragraph",
    "Write one sentence of notes",
    "Review one concept",
    "Watch 2 minutes of a lecture",
  ],
  exercise: [
    "Put on workout clothes",
    "Do 5 jumping jacks",
    "Take a short walk",
    "Stretch for 2 minutes",
    "Do one push-up",
  ],
  health: [
    "Drink a glass of water",
    "Take one deep breath",
    "Stand up and stretch",
    "Eat one piece of fruit",
    "Step outside for fresh air",
  ],
  productivity: [
    "Open your to-do list",
    "Write down one task",
    "Clear one item from desk",
    "Review your calendar",
    "Send one quick message",
  ],
  mindfulness: [
    "Close your eyes for 30 seconds",
    "Take 3 deep breaths",
    "Notice 5 things around you",
    "Sit in meditation position",
    "Write one line in your journal",
  ],
  social: [
    "Send a quick hello text",
    "Comment on one post",
    "Think of one person to contact",
    "Schedule one call",
    "Wave to a neighbor",
  ],
  creative: [
    "Doodle for 1 minute",
    "Write one sentence",
    "Hum a tune",
    "Look at inspiration images",
    "Pick up your creative tool",
  ],
  other: [
    "Take the first small step",
    "Prepare your materials",
    "Set a 2-minute timer",
    "Start with the easiest part",
    "Just begin",
  ],
};

/**
 * Input for two-minute version generation
 */
export interface TwoMinuteInput {
  habitTitle: string;
  habitRoutine: string;
  duration?: number | null;
  category?: string;
}

/**
 * Result of two-minute generation
 */
export interface TwoMinuteResult {
  twoMinuteVersion: string;
  isAIGenerated: boolean;
  confidence: number;
}

/**
 * Generate a two-minute version of a habit using AI
 */
export async function generateTwoMinuteVersion(input: TwoMinuteInput): Promise<TwoMinuteResult> {
  const { habitTitle, habitRoutine, duration = 15, category = "other" } = input;

  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 50,
      },
    });

    const prompt = TWO_MINUTE_PROMPT.replace("{habitTitle}", habitTitle)
      .replace("{habitRoutine}", habitRoutine || habitTitle)
      .replace("{duration}", String(duration || 15))
      .replace("{category}", category);

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();

    // Clean up the response
    const cleaned = response
      .replace(/^["']|["']$/g, "") // Remove quotes
      .replace(/^-\s*/, "") // Remove leading dash
      .replace(/\.$/, "") // Remove trailing period
      .trim();

    // Validate the response
    if (cleaned.length > 5 && cleaned.length < 100 && !cleaned.includes("\n")) {
      return {
        twoMinuteVersion: cleaned,
        isAIGenerated: true,
        confidence: 0.9,
      };
    }

    // Fallback to category-specific default
    return getFallbackVersion(category);
  } catch (error) {
    console.error("Two-minute generation failed:", error);
    return getFallbackVersion(category);
  }
}

/**
 * Get a fallback two-minute version based on category
 */
function getFallbackVersion(category: string): TwoMinuteResult {
  const fallbacks = CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.other;
  const randomIndex = Math.floor(Math.random() * fallbacks.length);

  return {
    twoMinuteVersion: fallbacks[randomIndex],
    isAIGenerated: false,
    confidence: 0.6,
  };
}

/**
 * Generate two-minute version synchronously with smart defaults
 * Used when we need a quick suggestion without AI
 */
export function getQuickTwoMinuteVersion(habitTitle: string, category: string = "other"): string {
  const titleLower = habitTitle.toLowerCase();

  // Smart keyword-based suggestions
  if (titleLower.includes("study") || titleLower.includes("read")) {
    return "Open your book and read one paragraph";
  }
  if (titleLower.includes("exercise") || titleLower.includes("workout")) {
    return "Put on your workout clothes";
  }
  if (titleLower.includes("run") || titleLower.includes("jog")) {
    return "Put on your running shoes and step outside";
  }
  if (titleLower.includes("write") || titleLower.includes("essay")) {
    return "Write one sentence";
  }
  if (titleLower.includes("meditat")) {
    return "Sit in position and take 3 deep breaths";
  }
  if (
    titleLower.includes("piano") ||
    titleLower.includes("guitar") ||
    titleLower.includes("music")
  ) {
    return "Play one scale or chord";
  }
  if (titleLower.includes("clean") || titleLower.includes("tidy")) {
    return "Put away one item";
  }
  if (titleLower.includes("code") || titleLower.includes("program")) {
    return "Open your IDE and write one line";
  }
  if (titleLower.includes("journal")) {
    return "Write today's date and one sentence";
  }

  // Fall back to category defaults
  const fallbacks = CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.other;
  return fallbacks[0];
}

/**
 * Validate a two-minute version
 */
export function validateTwoMinuteVersion(version: string): boolean {
  if (!version || version.length < 5) {
    return false;
  }

  if (version.length > 100) {
    return false;
  }

  // Should not contain numbers greater than 5 (implying more than 2 minutes)
  const numbers = version.match(/\d+/g);
  if (numbers) {
    for (const num of numbers) {
      if (parseInt(num, 10) > 5) {
        return false;
      }
    }
  }

  return true;
}
