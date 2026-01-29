/**
 * Opik Integration for Laurel
 *
 * LLM observability and evaluation for AI coaching
 * @see https://www.comet.com/docs/opik/
 */

// Client exports
export {
  initOpik,
  getOpik,
  isOpikEnabled,
  flushOpik,
  type OpikConfig,
  type CoachingTraceMetadata,
  type CoachingEvaluationScores,
} from "./client";

// Decorator and tracing exports
export {
  track,
  withTrace,
  traceCoachingCall,
  traceIntentClassification,
  logEvaluationScores,
  type TraceMetadata,
  type CoachingTraceOptions,
  type TracedCoachingResult,
} from "./decorators";

// Evaluation exports
export * from "./evaluations";
