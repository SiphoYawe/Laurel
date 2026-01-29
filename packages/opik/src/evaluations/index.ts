/**
 * Opik Evaluations
 *
 * LLM-as-judge evaluation metrics for AI coaching quality
 */

// Export coaching quality evaluation
export {
  evaluateCoachingQuality,
  evaluateCoachingQualityAsync,
  calculateAverageScore,
  passesQualityThreshold,
  type CoachingEvaluation,
  type EvaluationInput,
} from "./coaching-quality";

/**
 * Generic evaluation result interface
 */
export interface EvaluationResult {
  score: number;
  passed: boolean;
  feedback?: string;
}

/**
 * Coaching evaluation criteria (legacy interface)
 */
export interface CoachingEvaluationCriteria {
  // Does the response follow Atomic Habits principles?
  atomicHabitsAlignment: boolean;
  // Is the advice actionable and specific?
  actionability: boolean;
  // Is the tone supportive and encouraging?
  supportiveTone: boolean;
  // Is the two-minute rule applied when appropriate?
  twoMinuteRuleApplication: boolean;
  // Is habit stacking suggested when appropriate?
  habitStackingSuggestion: boolean;
}

/**
 * Simple heuristic evaluation for coaching responses
 * Used as a fallback when LLM evaluation is not available
 */
export async function evaluateCoachingResponse(
  userMessage: string,
  coachResponse: string,
  _context?: Record<string, unknown>
): Promise<EvaluationResult> {
  const lowerResponse = coachResponse.toLowerCase();
  const lowerMessage = userMessage.toLowerCase();

  // Check for Atomic Habits keywords
  const atomicHabitsKeywords = [
    "habit",
    "routine",
    "stack",
    "two-minute",
    "2-minute",
    "cue",
    "craving",
    "reward",
    "identity",
    "1%",
    "compound",
    "plateau",
    "streak",
  ];

  const hasHabitKeywords = atomicHabitsKeywords.some((keyword) => lowerResponse.includes(keyword));

  // Check for actionable language
  const actionKeywords = [
    "try",
    "start",
    "begin",
    "first",
    "next",
    "today",
    "now",
    "specific",
    "when",
    "after",
  ];
  const hasActionableAdvice = actionKeywords.some((keyword) => lowerResponse.includes(keyword));

  // Check for supportive tone
  const supportiveKeywords = [
    "great",
    "well done",
    "good",
    "excellent",
    "proud",
    "progress",
    "amazing",
    "fantastic",
    "believe",
    "can",
  ];
  const hasSupportiveTone = supportiveKeywords.some((keyword) => lowerResponse.includes(keyword));

  // Check response length (should be substantial but not overwhelming)
  const hasGoodLength = coachResponse.length >= 100 && coachResponse.length <= 2000;

  // Check if response addresses user's message
  const messageKeywords = lowerMessage.split(" ").filter((word) => word.length > 3);
  const addressesMessage = messageKeywords.some((keyword) => lowerResponse.includes(keyword));

  // Calculate score
  let score = 0;
  if (hasHabitKeywords) score += 0.25;
  if (hasActionableAdvice) score += 0.25;
  if (hasSupportiveTone) score += 0.2;
  if (hasGoodLength) score += 0.15;
  if (addressesMessage) score += 0.15;

  return {
    score,
    passed: score >= 0.6,
    feedback: `Heuristic evaluation: ${(score * 100).toFixed(0)}% quality score`,
  };
}

/**
 * Evaluate habit suggestion quality
 */
export async function evaluateHabitSuggestion(
  suggestedHabit: string,
  userGoal: string
): Promise<EvaluationResult> {
  const lowerHabit = suggestedHabit.toLowerCase();
  const lowerGoal = userGoal.toLowerCase();

  // Check for specificity
  const isSpecific = suggestedHabit.split(" ").length >= 3;

  // Check for timing/frequency
  const hasTiming =
    lowerHabit.includes("every") ||
    lowerHabit.includes("daily") ||
    lowerHabit.includes("morning") ||
    lowerHabit.includes("evening") ||
    lowerHabit.includes("after") ||
    lowerHabit.includes("before");

  // Check relevance to goal
  const goalKeywords = lowerGoal.split(" ").filter((word) => word.length > 3);
  const isRelevant = goalKeywords.some((keyword) => lowerHabit.includes(keyword));

  // Check for two-minute rule compliance
  const isTwoMinute =
    lowerHabit.includes("2 minute") ||
    lowerHabit.includes("two minute") ||
    lowerHabit.includes("just") ||
    lowerHabit.includes("simple") ||
    lowerHabit.includes("quick");

  // Calculate score
  let score = 0;
  if (isSpecific) score += 0.3;
  if (hasTiming) score += 0.25;
  if (isRelevant) score += 0.25;
  if (isTwoMinute) score += 0.2;

  return {
    score,
    passed: score >= 0.6,
    feedback: `Habit suggestion evaluation for goal: "${userGoal.slice(0, 50)}"`,
  };
}
