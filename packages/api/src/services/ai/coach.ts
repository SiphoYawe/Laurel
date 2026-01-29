import {
  traceCoachingCall,
  traceIntentClassification,
  evaluateCoachingQualityAsync,
  isOpikEnabled,
} from "@laurel/opik";

import { buildCoachingPrompt, INTENT_CLASSIFICATION_PROMPT } from "./prompts";
import { getGeminiClient, COACHING_MODEL_CONFIG } from "../../lib/gemini";

import type {
  ChatHistoryMessage,
  CoachingRequest,
  CoachingResponse,
  IntentClassification,
  SessionType,
} from "./types";

/**
 * AI Coaching Service
 * Handles all AI-powered coaching interactions using Google Gemini
 * Integrates with Opik for tracing and evaluation
 */
export class AICoachingService {
  /**
   * Classify user intent to determine coaching mode
   */
  async classifyIntent(
    userMessage: string,
    options?: { userId?: string; sessionId?: string }
  ): Promise<IntentClassification> {
    const classify = async (): Promise<IntentClassification> => {
      try {
        const genAI = getGeminiClient();
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 200,
          },
        });

        const prompt = INTENT_CLASSIFICATION_PROMPT + userMessage;
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Parse JSON response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as IntentClassification;
          return {
            mode: parsed.mode || "warm_mentor",
            confidence: parsed.confidence || 0.5,
            signals: parsed.signals || [],
          };
        }

        // Fallback to warm mentor if parsing fails
        return {
          mode: "warm_mentor",
          confidence: 0.5,
          signals: ["parsing_fallback"],
        };
      } catch (error) {
        console.error("Intent classification failed:", error);
        // Default to warm mentor on error
        return {
          mode: "warm_mentor",
          confidence: 0.3,
          signals: ["error_fallback"],
        };
      }
    };

    // Wrap with Opik tracing if enabled and options provided
    if (isOpikEnabled() && options?.userId && options?.sessionId) {
      const traced = await traceIntentClassification(classify, userMessage, {
        userId: options.userId,
        sessionId: options.sessionId,
      });
      return traced.result;
    }

    return classify();
  }

  /**
   * Generate a coaching response using Gemini
   * Traced with Opik for observability
   */
  async generateResponse(request: CoachingRequest): Promise<CoachingResponse> {
    const startTime = Date.now();

    const generate = async (): Promise<CoachingResponse> => {
      // First, classify the user's intent
      const intent = await this.classifyIntent(request.userMessage, {
        userId: request.context?.userId,
        sessionId: request.context?.sessionId,
      });

      // Build the system prompt
      const systemPrompt = buildCoachingPrompt(request.sessionType, intent.mode, request.context);

      // Get Gemini client and model
      const genAI = getGeminiClient();
      const model = genAI.getGenerativeModel({
        model: COACHING_MODEL_CONFIG.model,
        generationConfig: COACHING_MODEL_CONFIG.generationConfig,
        systemInstruction: systemPrompt,
      });

      // Build chat history
      const history = this.formatChatHistory(request.chatHistory || []);

      // Create chat session
      const chat = model.startChat({ history });

      // Generate response
      const result = await chat.sendMessage(request.userMessage);
      const responseText = result.response.text();

      const latencyMs = Date.now() - startTime;

      // Check for suggested habit in response
      const suggestedHabit = this.extractSuggestedHabit(responseText);

      const response: CoachingResponse = {
        content: responseText,
        detectedMode: intent.mode,
        suggestedHabit,
        metadata: {
          modelUsed: COACHING_MODEL_CONFIG.model,
          latencyMs,
        },
      };

      // Run async evaluation (non-blocking)
      this.runAsyncEvaluation(request, response);

      return response;
    };

    // Wrap with Opik tracing if enabled
    if (isOpikEnabled() && request.context?.userId && request.context?.sessionId) {
      const traced = await traceCoachingCall(generate, {
        userId: request.context.userId,
        sessionId: request.context.sessionId,
        sessionType: this.mapSessionType(request.sessionType),
        coachingMode: "warm_mentor", // Will be updated after intent classification
        model: COACHING_MODEL_CONFIG.model,
      });
      return traced.result;
    }

    return generate();
  }

  /**
   * Run LLM-as-judge evaluation asynchronously
   * Does not block the response to the user
   */
  private runAsyncEvaluation(request: CoachingRequest, response: CoachingResponse): void {
    if (!isOpikEnabled()) {
      return;
    }

    evaluateCoachingQualityAsync(
      {
        userMessage: request.userMessage,
        aiResponse: response.content,
        sessionType: request.sessionType,
        coachingMode: response.detectedMode,
        userContext: {
          userId: request.context?.userId,
          streakDays: request.context?.streakDays,
          habitsCount: request.context?.habitsCount,
        },
      },
      (evaluation) => {
        console.log("[Opik] Coaching evaluation completed:", {
          overall: evaluation.overall,
          motivationScore: evaluation.motivationScore,
          techniqueAccuracy: evaluation.techniqueAccuracy,
          personalization: evaluation.personalization,
          actionability: evaluation.actionability,
          feedback: evaluation.feedback,
        });
      }
    );
  }

  /**
   * Map session type to Opik trace metadata type
   */
  private mapSessionType(
    sessionType: SessionType
  ):
    | "onboarding"
    | "check_in"
    | "habit_creation"
    | "habit_review"
    | "motivation"
    | "technique_learning"
    | "streak_recovery"
    | "general_chat" {
    const mapping: Record<SessionType, ReturnType<typeof this.mapSessionType>> = {
      onboarding: "onboarding",
      check_in: "check_in",
      habit_creation: "habit_creation",
      habit_review: "habit_review",
      motivation: "motivation",
      technique_learning: "technique_learning",
      streak_recovery: "streak_recovery",
      general_chat: "general_chat",
    };
    return mapping[sessionType] || "general_chat";
  }

  /**
   * Generate a coaching response with streaming support
   */
  async *generateResponseStream(
    request: CoachingRequest
  ): AsyncGenerator<string, CoachingResponse, unknown> {
    const startTime = Date.now();

    // Classify intent first
    const intent = await this.classifyIntent(request.userMessage, {
      userId: request.context?.userId,
      sessionId: request.context?.sessionId,
    });

    // Build the system prompt
    const systemPrompt = buildCoachingPrompt(request.sessionType, intent.mode, request.context);

    // Get Gemini client and model
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({
      model: COACHING_MODEL_CONFIG.model,
      generationConfig: COACHING_MODEL_CONFIG.generationConfig,
      systemInstruction: systemPrompt,
    });

    // Build chat history
    const history = this.formatChatHistory(request.chatHistory || []);

    // Create chat session
    const chat = model.startChat({ history });

    // Generate streaming response
    const result = await chat.sendMessageStream(request.userMessage);

    let fullContent = "";

    // Stream each chunk
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullContent += chunkText;
      yield chunkText;
    }

    const latencyMs = Date.now() - startTime;

    const response: CoachingResponse = {
      content: fullContent,
      detectedMode: intent.mode,
      suggestedHabit: this.extractSuggestedHabit(fullContent),
      metadata: {
        modelUsed: COACHING_MODEL_CONFIG.model,
        latencyMs,
      },
    };

    // Run async evaluation (non-blocking)
    this.runAsyncEvaluation(request, response);

    // Return final response
    return response;
  }

  /**
   * Format chat history for Gemini
   */
  private formatChatHistory(
    history: ChatHistoryMessage[]
  ): Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> {
    return history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));
  }

  /**
   * Extract suggested habit from response if present
   * Looks for implementation intention patterns
   */
  private extractSuggestedHabit(response: string): CoachingResponse["suggestedHabit"] | undefined {
    // Look for implementation intention pattern
    const intentionMatch = response.match(
      /(?:I will|After .+?, I will) (.+?) (?:at|in|when|every)/i
    );

    if (intentionMatch) {
      const routine = intentionMatch[1].trim();

      // Try to extract cue trigger
      const cueMatch = response.match(/After (.+?),/i);
      const cueTrigger = cueMatch ? cueMatch[1].trim() : undefined;

      // Guess category based on keywords
      const category = this.guessCategory(routine);

      return {
        title: this.generateHabitTitle(routine),
        routine,
        category,
        cueTrigger,
      };
    }

    return undefined;
  }

  /**
   * Generate a habit title from routine
   */
  private generateHabitTitle(routine: string): string {
    // Remove common prefixes
    const cleanedRoutine = routine.replace(/^(read|study|practice|do|write|review) /i, "").trim();

    // Capitalize first letter
    return cleanedRoutine.charAt(0).toUpperCase() + cleanedRoutine.slice(1);
  }

  /**
   * Guess habit category from routine text
   */
  private guessCategory(routine: string): string {
    const lower = routine.toLowerCase();

    if (
      lower.includes("study") ||
      lower.includes("read") ||
      lower.includes("learn") ||
      lower.includes("review") ||
      lower.includes("notes") ||
      lower.includes("homework")
    ) {
      return "study";
    }

    if (
      lower.includes("exercise") ||
      lower.includes("workout") ||
      lower.includes("run") ||
      lower.includes("gym") ||
      lower.includes("stretch")
    ) {
      return "exercise";
    }

    if (
      lower.includes("meditat") ||
      lower.includes("mindful") ||
      lower.includes("breath") ||
      lower.includes("journal")
    ) {
      return "mindfulness";
    }

    if (
      lower.includes("sleep") ||
      lower.includes("water") ||
      lower.includes("eat") ||
      lower.includes("health")
    ) {
      return "health";
    }

    if (
      lower.includes("work") ||
      lower.includes("task") ||
      lower.includes("plan") ||
      lower.includes("organize")
    ) {
      return "productivity";
    }

    return "other";
  }
}

/**
 * Singleton instance
 */
let coachingService: AICoachingService | null = null;

/**
 * Get the AI coaching service instance
 */
export function getAICoachingService(): AICoachingService {
  if (!coachingService) {
    coachingService = new AICoachingService();
  }
  return coachingService;
}
