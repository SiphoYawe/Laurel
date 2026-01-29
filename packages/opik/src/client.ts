/**
 * Opik Client Configuration
 *
 * Initialize and configure Opik for LLM observability
 * @see https://www.comet.com/docs/opik/
 */

import { Opik } from "opik";

/**
 * Configuration for Opik client
 */
export interface OpikConfig {
  apiKey?: string;
  projectName?: string;
  workspaceName?: string;
  apiUrl?: string;
  environment?: "development" | "production";
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Partial<OpikConfig> = {
  projectName: "laurel-hackathon",
  apiUrl: "https://www.comet.com/opik/api",
  environment: process.env.NODE_ENV === "production" ? "production" : "development",
};

/**
 * Singleton Opik client instance
 */
let opikInstance: Opik | null = null;
let isInitialized = false;

/**
 * Initialize Opik client with configuration
 * @param config - Optional configuration overrides
 */
export async function initOpik(config: OpikConfig = {}): Promise<Opik | null> {
  const apiKey = config.apiKey || process.env.OPIK_API_KEY;
  const workspaceName = config.workspaceName || process.env.OPIK_WORKSPACE_NAME;
  const projectName =
    config.projectName || process.env.OPIK_PROJECT_NAME || DEFAULT_CONFIG.projectName;
  const apiUrl = config.apiUrl || process.env.OPIK_URL_OVERRIDE || DEFAULT_CONFIG.apiUrl;

  if (!apiKey) {
    console.warn("[Opik] API key not configured. Tracing will be disabled.");
    console.warn("[Opik] Set OPIK_API_KEY environment variable to enable tracing.");
    isInitialized = true;
    return null;
  }

  try {
    opikInstance = new Opik({
      apiKey,
      projectName,
      workspaceName,
      apiUrl,
    });

    isInitialized = true;
    console.log(`[Opik] Initialized for project: ${projectName}`);
    console.log(`[Opik] Environment: ${config.environment || DEFAULT_CONFIG.environment}`);

    return opikInstance;
  } catch (error) {
    console.error("[Opik] Failed to initialize:", error);
    isInitialized = true;
    return null;
  }
}

/**
 * Get the Opik client instance
 * @returns The Opik client instance or null if not initialized
 */
export function getOpik(): Opik | null {
  if (!isInitialized) {
    console.warn("[Opik] Client not initialized. Call initOpik() first.");
  }
  return opikInstance;
}

/**
 * Check if Opik is initialized and enabled
 * @returns true if Opik client is available
 */
export function isOpikEnabled(): boolean {
  return opikInstance !== null;
}

/**
 * Flush all pending traces to Opik
 * Call this before app shutdown to ensure all traces are sent
 */
export async function flushOpik(): Promise<void> {
  if (opikInstance) {
    try {
      await opikInstance.flush();
      console.log("[Opik] Traces flushed successfully");
    } catch (error) {
      console.error("[Opik] Failed to flush traces:", error);
    }
  }
}

/**
 * Coaching trace metadata schema
 * Based on story requirements
 */
export interface CoachingTraceMetadata {
  user_id: string;
  session_id: string;
  session_type:
    | "onboarding"
    | "check_in"
    | "habit_creation"
    | "habit_review"
    | "motivation"
    | "technique_learning"
    | "streak_recovery"
    | "general_chat";
  coaching_mode: "warm_mentor" | "data_partner" | "accountability_buddy" | "educator" | "motivator";
  tokens_used?: {
    input: number;
    output: number;
    total: number;
  };
  response_time_ms: number;
  model: string;
  evaluation?: CoachingEvaluationScores;
}

/**
 * Coaching evaluation scores from LLM-as-judge
 */
export interface CoachingEvaluationScores {
  motivation_score: number;
  technique_accuracy: number;
  personalization: number;
  actionability: number;
  overall: number;
  feedback?: string;
}
