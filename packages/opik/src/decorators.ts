/**
 * Opik Decorators
 *
 * Custom decorators and wrappers for tracing AI interactions
 * Integrates with Opik's tracing functionality
 */

import { getOpik, isOpikEnabled, type CoachingTraceMetadata } from "./client";

/**
 * Trace metadata for general LLM calls
 */
export interface TraceMetadata {
  name: string;
  type?: "general" | "llm" | "tool" | "guardrail";
  tags?: string[];
  metadata?: Record<string, unknown>;
  projectName?: string;
}

/**
 * Options for coaching trace
 */
export interface CoachingTraceOptions {
  userId: string;
  sessionId: string;
  sessionType: CoachingTraceMetadata["session_type"];
  coachingMode?: CoachingTraceMetadata["coaching_mode"];
  model?: string;
}

/**
 * Result from a traced coaching call
 */
export interface TracedCoachingResult<T> {
  result: T;
  traceId?: string;
  spanId?: string;
  latencyMs: number;
}

/**
 * Decorator to trace function execution with Opik
 * Usage: @track({ name: "coaching-response", type: "llm" })
 *
 * Note: TypeScript decorators are experimental. For production use,
 * consider using the withTrace wrapper function instead.
 */
export function track(options: TraceMetadata) {
  return function <T extends (...args: unknown[]) => unknown>(
    _target: unknown,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value!;

    descriptor.value = async function (
      this: unknown,
      ...args: Parameters<T>
    ): Promise<ReturnType<T>> {
      const client = getOpik();

      if (!isOpikEnabled() || !client) {
        return originalMethod.apply(this, args) as ReturnType<T>;
      }

      const startTime = Date.now();

      try {
        // Execute the original method first
        const result = await originalMethod.apply(this, args);
        const latencyMs = Date.now() - startTime;

        // Create trace with input and output
        const trace = client.trace({
          name: options.name,
          input: { args: args.length > 0 ? args : undefined },
          output: { result },
          metadata: {
            ...options.metadata,
            tags: options.tags,
            latency_ms: latencyMs,
          },
        });

        // Create a span for this function execution
        trace.span({
          name: `${options.name}_execution`,
          type: options.type || "general",
          input: { args: args.length > 0 ? args : undefined },
          output: { result },
        });

        return result as ReturnType<T>;
      } catch (error) {
        const latencyMs = Date.now() - startTime;

        // Log error trace
        client.trace({
          name: options.name,
          input: { args: args.length > 0 ? args : undefined },
          output: { error: error instanceof Error ? error.message : String(error) },
          metadata: {
            ...options.metadata,
            error: true,
            error_type: error instanceof Error ? error.name : "UnknownError",
            latency_ms: latencyMs,
          },
        });

        throw error;
      }
    } as T;

    return descriptor;
  };
}

/**
 * Wrap a function with Opik tracing (for non-class methods)
 * This is the recommended approach for tracing functions
 *
 * @example
 * const tracedFunction = withTrace(myFunction, { name: "my-function", type: "llm" });
 * const result = await tracedFunction(args);
 */
export function withTrace<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  options: TraceMetadata
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async function (...args: Parameters<T>): Promise<ReturnType<T>> {
    const client = getOpik();

    if (!isOpikEnabled() || !client) {
      return fn(...args) as ReturnType<T>;
    }

    const startTime = Date.now();

    try {
      const result = await fn(...args);
      const latencyMs = Date.now() - startTime;

      // Create trace with input and output
      const trace = client.trace({
        name: options.name,
        input: { args: args.length > 0 ? args : undefined },
        output: { result },
        metadata: {
          ...options.metadata,
          tags: options.tags,
          latency_ms: latencyMs,
        },
      });

      // Create a span for the execution
      trace.span({
        name: `${options.name}_execution`,
        type: options.type || "general",
        input: { args: args.length > 0 ? args : undefined },
        output: { result },
      });

      return result as ReturnType<T>;
    } catch (error) {
      const latencyMs = Date.now() - startTime;

      // Log error trace
      client.trace({
        name: options.name,
        input: { args: args.length > 0 ? args : undefined },
        output: { error: error instanceof Error ? error.message : String(error) },
        metadata: {
          ...options.metadata,
          error: true,
          error_type: error instanceof Error ? error.name : "UnknownError",
          latency_ms: latencyMs,
        },
      });

      throw error;
    }
  };
}

/**
 * Trace a coaching interaction with full metadata
 * This is the main function for tracing AI coaching calls
 *
 * @param fn - The async function to trace
 * @param options - Coaching trace options
 * @returns Wrapped function that logs to Opik
 */
export async function traceCoachingCall<T>(
  fn: () => Promise<T>,
  options: CoachingTraceOptions
): Promise<TracedCoachingResult<T>> {
  const client = getOpik();
  const startTime = Date.now();

  if (!isOpikEnabled() || !client) {
    const result = await fn();
    return {
      result,
      latencyMs: Date.now() - startTime,
    };
  }

  try {
    const result = await fn();
    const latencyMs = Date.now() - startTime;

    // Create trace with full coaching metadata
    const trace = client.trace({
      name: "coaching_interaction",
      input: {
        user_id: options.userId,
        session_id: options.sessionId,
        session_type: options.sessionType,
      },
      output: { result },
      metadata: {
        user_id: options.userId,
        session_id: options.sessionId,
        session_type: options.sessionType,
        coaching_mode: options.coachingMode || "warm_mentor",
        model: options.model || "gemini-1.5-pro",
        response_time_ms: latencyMs,
        success: true,
      },
      tags: ["coaching", options.sessionType],
    });

    // Create LLM span
    trace.span({
      name: "gemini_generation",
      type: "llm",
      input: {
        session_type: options.sessionType,
        coaching_mode: options.coachingMode,
      },
      output: { result },
      metadata: {
        model: options.model || "gemini-1.5-pro",
        provider: "google",
        response_time_ms: latencyMs,
      },
    });

    return {
      result,
      latencyMs,
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;

    // Log error trace
    client.trace({
      name: "coaching_interaction",
      input: {
        user_id: options.userId,
        session_id: options.sessionId,
        session_type: options.sessionType,
      },
      output: {
        error: error instanceof Error ? error.message : String(error),
      },
      metadata: {
        error: true,
        error_type: error instanceof Error ? error.name : "UnknownError",
        error_message: error instanceof Error ? error.message : String(error),
        response_time_ms: latencyMs,
      },
    });

    throw error;
  }
}

/**
 * Trace an intent classification call
 */
export async function traceIntentClassification<T>(
  fn: () => Promise<T>,
  userMessage: string,
  options: Pick<CoachingTraceOptions, "userId" | "sessionId">
): Promise<TracedCoachingResult<T>> {
  const client = getOpik();
  const startTime = Date.now();

  if (!isOpikEnabled() || !client) {
    const result = await fn();
    return {
      result,
      latencyMs: Date.now() - startTime,
    };
  }

  try {
    const result = await fn();
    const latencyMs = Date.now() - startTime;

    // Create trace
    const trace = client.trace({
      name: "intent_classification",
      input: {
        user_message: userMessage,
        user_id: options.userId,
        session_id: options.sessionId,
      },
      output: { result },
      metadata: {
        model: "gemini-1.5-flash",
        response_time_ms: latencyMs,
        success: true,
      },
      tags: ["classification", "intent"],
    });

    // Create classification span
    trace.span({
      name: "classify_intent",
      type: "llm",
      input: { user_message: userMessage },
      output: { result },
      metadata: {
        model: "gemini-1.5-flash",
        provider: "google",
      },
    });

    return {
      result,
      latencyMs,
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;

    // Log error trace
    client.trace({
      name: "intent_classification",
      input: {
        user_message: userMessage,
        user_id: options.userId,
        session_id: options.sessionId,
      },
      output: {
        error: error instanceof Error ? error.message : String(error),
      },
      metadata: {
        error: true,
        error_type: error instanceof Error ? error.name : "UnknownError",
        response_time_ms: latencyMs,
      },
    });

    throw error;
  }
}

/**
 * Log evaluation scores to an existing trace
 */
export function logEvaluationScores(
  traceId: string,
  scores: {
    motivation_score: number;
    technique_accuracy: number;
    personalization: number;
    actionability: number;
    overall: number;
    feedback?: string;
  }
): void {
  const client = getOpik();

  if (!isOpikEnabled() || !client) {
    console.log("[Opik] Evaluation scores (disabled):", scores);
    return;
  }

  // Create an evaluation trace to log scores
  const trace = client.trace({
    name: "coaching_evaluation",
    input: { traceId },
    output: { scores },
    metadata: {
      motivation_score: scores.motivation_score,
      technique_accuracy: scores.technique_accuracy,
      personalization: scores.personalization,
      actionability: scores.actionability,
      overall: scores.overall,
      feedback: scores.feedback,
    },
    tags: ["evaluation", "llm-as-judge"],
  });

  // Add feedback scores using the score method
  trace.score({
    name: "motivation_score",
    value: scores.motivation_score / 5, // Normalize to 0-1
    reason: "Motivation and inspiration level",
  });

  trace.score({
    name: "technique_accuracy",
    value: scores.technique_accuracy / 5,
    reason: "Atomic Habits technique accuracy",
  });

  trace.score({
    name: "personalization",
    value: scores.personalization / 5,
    reason: "Response personalization level",
  });

  trace.score({
    name: "actionability",
    value: scores.actionability / 5,
    reason: "Clear actionable next steps",
  });

  trace.score({
    name: "overall",
    value: scores.overall / 5,
    reason: scores.feedback || "Overall coaching quality",
  });

  console.log("[Opik] Evaluation scores logged:", {
    traceId,
    scores,
  });
}
