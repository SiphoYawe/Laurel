/**
 * Opik Decorators
 *
 * Custom decorators for tracing AI interactions
 * These will integrate with Opik's @track functionality
 */

import { isOpikEnabled } from "./client";

/**
 * Trace metadata for LLM calls
 */
export interface TraceMetadata {
  name: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Decorator to trace function execution with Opik
 * Usage: @track({ name: "coaching-response" })
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
      if (!isOpikEnabled()) {
        return originalMethod.apply(this, args) as ReturnType<T>;
      }

      const startTime = Date.now();

      try {
        // Execute the original method
        const result = await originalMethod.apply(this, args);

        // Log trace data to Opik
        // eslint-disable-next-line no-console
        console.log(`[Opik Trace] ${options.name}`, {
          duration: Date.now() - startTime,
          tags: options.tags,
          metadata: options.metadata,
        });

        return result as ReturnType<T>;
      } catch (error) {
        console.error(`[Opik Trace Error] ${options.name}`, error);
        throw error;
      }
    } as T;

    return descriptor;
  };
}

/**
 * Wrap a function with Opik tracing (for non-class methods)
 */
export function withTrace<T extends (...args: unknown[]) => unknown>(
  fn: T,
  options: TraceMetadata
): T {
  return async function (...args: Parameters<T>): Promise<ReturnType<T>> {
    if (!isOpikEnabled()) {
      return fn(...args) as ReturnType<T>;
    }

    const startTime = Date.now();

    try {
      const result = await fn(...args);

      // eslint-disable-next-line no-console
      console.log(`[Opik Trace] ${options.name}`, {
        duration: Date.now() - startTime,
        tags: options.tags,
        metadata: options.metadata,
      });

      return result as ReturnType<T>;
    } catch (error) {
      console.error(`[Opik Trace Error] ${options.name}`, error); // eslint-disable-line no-console
      throw error;
    }
  } as T;
}
