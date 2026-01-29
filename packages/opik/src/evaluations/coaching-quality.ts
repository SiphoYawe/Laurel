/**
 * LLM-as-Judge Evaluation for Coaching Quality
 *
 * Evaluates AI coaching responses using Gemini Flash for fast assessment
 * Based on Atomic Habits coaching principles
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Coaching evaluation scores
 */
export interface CoachingEvaluation {
  motivationScore: number; // 1-5: How motivating was the response?
  techniqueAccuracy: number; // 1-5: Were Atomic Habits techniques correctly applied?
  personalization: number; // 1-5: Was it tailored to this specific student?
  actionability: number; // 1-5: Did it provide clear next steps?
  overall: number; // 1-5: Overall coaching quality
  feedback: string; // Brief explanation
}

/**
 * Evaluation input parameters
 */
export interface EvaluationInput {
  userMessage: string;
  aiResponse: string;
  sessionType: string;
  coachingMode?: string;
  userContext?: {
    userId?: string;
    streakDays?: number;
    habitsCount?: number;
    recentCompletions?: number;
  };
}

/**
 * LLM-as-Judge evaluation prompt template
 */
const EVALUATION_PROMPT = `You are an expert evaluator assessing an AI habit coach's response based on the Atomic Habits framework by James Clear.

Score each dimension from 1 (poor) to 5 (excellent):

1. **Motivation Score**: Does the response inspire and encourage the user? Does it build confidence and maintain momentum?
   - 5: Highly motivating, empowering language, acknowledges progress
   - 3: Neutral tone, neither inspiring nor discouraging
   - 1: Discouraging, judgmental, or dismissive

2. **Technique Accuracy**: Are Atomic Habits principles correctly applied?
   - Check for: 1% improvements, habit stacking, Two-Minute Rule, cue-craving-response-reward loop, identity-based habits
   - 5: Techniques applied accurately and appropriately
   - 3: Some techniques mentioned but not well integrated
   - 1: Incorrect or no technique application

3. **Personalization**: Is the response tailored to this specific student's situation?
   - 5: Highly personalized, references user's specific context, habits, or goals
   - 3: Generic but applicable advice
   - 1: Completely generic, could apply to anyone

4. **Actionability**: Does it provide clear, concrete next steps?
   - 5: Specific, time-bound action items the user can do immediately
   - 3: Some suggestions but vague or abstract
   - 1: No clear next steps provided

5. **Overall Quality**: How effective is this coaching response overall?
   - Consider: helpfulness, tone, relevance, and completeness

---

**Session Type**: {sessionType}
**Coaching Mode**: {coachingMode}

**User Context**:
{userContext}

**Student message**: {userMessage}

**Coach response**: {aiResponse}

---

Respond ONLY in valid JSON format (no markdown, no code blocks):
{
  "motivationScore": <1-5>,
  "techniqueAccuracy": <1-5>,
  "personalization": <1-5>,
  "actionability": <1-5>,
  "overall": <1-5>,
  "feedback": "<brief 1-2 sentence explanation>"
}`;

/**
 * Get Gemini API key from environment
 */
function getGeminiApiKey(): string | undefined {
  return process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
}

/**
 * Evaluate coaching response quality using LLM-as-judge
 *
 * @param input - Evaluation input containing user message, AI response, and context
 * @returns Coaching evaluation scores (1-5 for each dimension)
 */
export async function evaluateCoachingQuality(input: EvaluationInput): Promise<CoachingEvaluation> {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    console.warn("[Opik Evaluation] Gemini API key not configured. Returning default scores.");
    return getDefaultScores("API key not configured");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Use Flash for faster, cheaper evaluation
      generationConfig: {
        temperature: 0.3, // Low temperature for consistent evaluation
        maxOutputTokens: 500,
        responseMimeType: "application/json",
      },
    });

    // Build context string
    const userContextStr = input.userContext
      ? `User ID: ${input.userContext.userId || "anonymous"}
Streak Days: ${input.userContext.streakDays ?? "unknown"}
Total Habits: ${input.userContext.habitsCount ?? "unknown"}
Recent Completions: ${input.userContext.recentCompletions ?? "unknown"}`
      : "No additional context available";

    // Build the prompt
    const prompt = EVALUATION_PROMPT.replace("{sessionType}", input.sessionType)
      .replace("{coachingMode}", input.coachingMode || "warm_mentor")
      .replace("{userContext}", userContextStr)
      .replace("{userMessage}", input.userMessage)
      .replace("{aiResponse}", input.aiResponse);

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON response
    const evaluation = JSON.parse(responseText) as CoachingEvaluation;

    // Validate and clamp scores to 1-5 range
    return {
      motivationScore: clampScore(evaluation.motivationScore),
      techniqueAccuracy: clampScore(evaluation.techniqueAccuracy),
      personalization: clampScore(evaluation.personalization),
      actionability: clampScore(evaluation.actionability),
      overall: clampScore(evaluation.overall),
      feedback: evaluation.feedback || "Evaluation completed",
    };
  } catch (error) {
    console.error("[Opik Evaluation] Failed to evaluate coaching quality:", error);
    return getDefaultScores(error instanceof Error ? error.message : "Evaluation failed");
  }
}

/**
 * Run evaluation asynchronously without blocking the main response
 *
 * @param input - Evaluation input
 * @param onComplete - Callback when evaluation completes
 */
export function evaluateCoachingQualityAsync(
  input: EvaluationInput,
  onComplete?: (evaluation: CoachingEvaluation) => void
): void {
  // Run evaluation in background
  evaluateCoachingQuality(input)
    .then((evaluation) => {
      console.log("[Opik Evaluation] Async evaluation completed:", evaluation);
      onComplete?.(evaluation);
    })
    .catch((error) => {
      console.error("[Opik Evaluation] Async evaluation failed:", error);
      onComplete?.(getDefaultScores("Async evaluation failed"));
    });
}

/**
 * Clamp score to valid range (1-5)
 */
function clampScore(score: number | undefined): number {
  if (typeof score !== "number" || isNaN(score)) {
    return 3; // Default to neutral
  }
  return Math.max(1, Math.min(5, Math.round(score)));
}

/**
 * Get default scores when evaluation fails
 */
function getDefaultScores(reason: string): CoachingEvaluation {
  return {
    motivationScore: 3,
    techniqueAccuracy: 3,
    personalization: 3,
    actionability: 3,
    overall: 3,
    feedback: `Default scores returned: ${reason}`,
  };
}

/**
 * Calculate average score from evaluation
 */
export function calculateAverageScore(evaluation: CoachingEvaluation): number {
  const scores = [
    evaluation.motivationScore,
    evaluation.techniqueAccuracy,
    evaluation.personalization,
    evaluation.actionability,
    evaluation.overall,
  ];
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

/**
 * Determine if evaluation passes quality threshold
 */
export function passesQualityThreshold(evaluation: CoachingEvaluation, threshold = 3.5): boolean {
  return calculateAverageScore(evaluation) >= threshold;
}
