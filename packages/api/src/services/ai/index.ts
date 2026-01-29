/**
 * AI Services
 * Export AI coaching and evaluation services
 */

export { AICoachingService, getAICoachingService } from "./coach";
export * from "./types";
export { buildCoachingPrompt, buildUserContextString, BASE_SYSTEM_PROMPT } from "./prompts";
export {
  generateTwoMinuteVersion,
  getQuickTwoMinuteVersion,
  validateTwoMinuteVersion,
} from "./twoMinuteGenerator";
export type { TwoMinuteInput, TwoMinuteResult } from "./twoMinuteGenerator";
export { extractHabitFromMessage, detectConfirmationIntent } from "./habitExtractor";
