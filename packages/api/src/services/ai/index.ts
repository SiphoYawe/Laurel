/**
 * AI Services
 * Export AI coaching and evaluation services
 */

export { AICoachingService, getAICoachingService } from "./coach";
export * from "./types";
export { buildCoachingPrompt, buildUserContextString, BASE_SYSTEM_PROMPT } from "./prompts";
