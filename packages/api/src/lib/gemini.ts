import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Get the Gemini API key from environment variables
 */
function getApiKey(): string {
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY or GEMINI_API_KEY environment variable is not set");
  }
  return apiKey;
}

/**
 * Lazy-loaded Gemini client singleton
 */
let genAI: GoogleGenerativeAI | null = null;

/**
 * Get the Gemini AI client instance
 * Uses lazy initialization to avoid startup errors if API key is not set
 */
export function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(getApiKey());
  }
  return genAI;
}

/**
 * Gemini model configuration for coaching
 */
export const COACHING_MODEL_CONFIG = {
  model: "gemini-1.5-pro",
  generationConfig: {
    temperature: 0.7, // Balanced between creative and focused
    maxOutputTokens: 1024, // Enough for detailed responses, but keeps them concise
    topP: 0.9,
    topK: 40,
  },
};

/**
 * Gemini model configuration for quick classification
 */
export const CLASSIFICATION_MODEL_CONFIG = {
  model: "gemini-1.5-flash", // Faster model for intent classification
  generationConfig: {
    temperature: 0.3, // More deterministic for classification
    maxOutputTokens: 100,
  },
};
