/**
 * Opik Client Configuration
 *
 * Initialize and configure Opik for LLM observability
 * @see https://www.comet.com/docs/opik/
 */

// Opik client will be initialized when the package is available
// This is a placeholder for the integration

export interface OpikConfig {
  apiKey?: string;
  projectName?: string;
  environment?: "development" | "production";
}

// eslint-disable-next-line prefer-const
let opikInstance: unknown = null;

/**
 * Initialize Opik client with configuration
 */
export async function initOpik(config: OpikConfig): Promise<void> {
  const apiKey = config.apiKey || process.env.OPIK_API_KEY;

  if (!apiKey) {
    console.warn("Opik API key not configured. Tracing will be disabled.");
    return;
  }

  // Initialize Opik when the SDK is properly integrated
  // opikInstance = new Opik({ apiKey, projectName: config.projectName });

  // eslint-disable-next-line no-console
  console.log(`Opik initialized for project: ${config.projectName || "laurel"}`);
}

/**
 * Get the Opik client instance
 */
export function getOpik(): unknown {
  return opikInstance;
}

/**
 * Check if Opik is initialized
 */
export function isOpikEnabled(): boolean {
  return opikInstance !== null;
}
