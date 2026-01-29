/**
 * Growth Curve Calculations
 * Story 3-4: Plateau of Latent Potential Visualization
 *
 * Implements the mathematical model for the "Valley of Disappointment"
 * from Atomic Habits by James Clear
 */

/**
 * Stage definitions for the growth journey
 */
export const GROWTH_STAGES = {
  foundation: { minDay: 1, maxDay: 14, name: "Foundation" },
  valley: { minDay: 15, maxDay: 30, name: "Valley" },
  breakthrough: { minDay: 31, maxDay: 60, name: "Breakthrough" },
  mastery: { minDay: 61, maxDay: Infinity, name: "Mastery" },
} as const;

export type GrowthStage = keyof typeof GROWTH_STAGES;

/**
 * Stage-specific messages
 */
export const STAGE_MESSAGES: Record<GrowthStage, { title: string; message: string }> = {
  foundation: {
    title: "Building the Foundation",
    message: "You're laying the groundwork for lasting change. Trust the process!",
  },
  valley: {
    title: "In the Valley of Disappointment",
    message:
      "This is normal! Results are compounding invisibly. Keep showing up - the breakthrough is coming.",
  },
  breakthrough: {
    title: "Entering Compound Growth",
    message:
      "You're starting to see real results! Your habits are becoming automatic. Keep the momentum!",
  },
  mastery: {
    title: "Habit Mastery",
    message: "Your habits are now part of who you are. You've proven you can make lasting change!",
  },
};

/**
 * Calculate the "what you expect" linear line Y value
 * Linear progress from 0 at day 0 to 100 at day 90
 */
export function calculateExpectationY(day: number): number {
  const maxDays = 90;
  const result = (day / maxDays) * 100;
  return Math.min(100, Math.max(0, result));
}

/**
 * Calculate the "what actually happens" sigmoid curve Y value
 * Stays flat initially, then accelerates (hockey stick effect)
 */
export function calculateRealityY(day: number): number {
  const inflectionPoint = 30; // Day when curve starts accelerating
  const steepness = 0.15; // Controls how sharp the curve is
  const maxValue = 100;

  // Sigmoid function: 100 / (1 + e^(-steepness * (day - inflectionPoint)))
  const result = maxValue / (1 + Math.exp(-steepness * (day - inflectionPoint)));
  return Math.min(100, Math.max(0, result));
}

/**
 * Determine the growth stage based on day count
 */
export function getGrowthStage(dayCount: number): GrowthStage {
  if (dayCount <= GROWTH_STAGES.foundation.maxDay) return "foundation";
  if (dayCount <= GROWTH_STAGES.valley.maxDay) return "valley";
  if (dayCount <= GROWTH_STAGES.breakthrough.maxDay) return "breakthrough";
  return "mastery";
}

/**
 * Get the stage message for a given day count
 */
export function getStageMessage(dayCount: number): { title: string; message: string } {
  const stage = getGrowthStage(dayCount);
  return STAGE_MESSAGES[stage];
}

/**
 * Generate data points for the expectation line
 */
export function generateExpectationData(
  maxDay: number = 90,
  step: number = 1
): Array<{ day: number; value: number }> {
  const data: Array<{ day: number; value: number }> = [];
  for (let day = 0; day <= maxDay; day += step) {
    data.push({ day, value: calculateExpectationY(day) });
  }
  return data;
}

/**
 * Generate data points for the reality curve
 */
export function generateRealityData(
  maxDay: number = 90,
  step: number = 1
): Array<{ day: number; value: number }> {
  const data: Array<{ day: number; value: number }> = [];
  for (let day = 0; day <= maxDay; day += step) {
    data.push({ day, value: calculateRealityY(day) });
  }
  return data;
}

/**
 * Generate data for the valley of disappointment area
 * (area between expectation and reality lines in the early days)
 */
export function generateValleyData(
  maxDay: number = 45,
  step: number = 1
): Array<{ day: number; expectation: number; reality: number }> {
  const data: Array<{ day: number; expectation: number; reality: number }> = [];
  for (let day = 0; day <= maxDay; day += step) {
    const expectation = calculateExpectationY(day);
    const reality = calculateRealityY(day);
    // Only include points where expectation > reality (the valley)
    if (expectation > reality) {
      data.push({ day, expectation, reality });
    }
  }
  return data;
}

/**
 * James Clear quote for the explanation modal
 */
export const JAMES_CLEAR_QUOTE = {
  text: "Habits often appear to make no difference until you cross a critical threshold. The work is not wasted; it is being stored. It will be unleashed all at once.",
  author: "James Clear",
  source: "Atomic Habits",
};

/**
 * Learning examples for the explanation modal
 */
export const LEARNING_EXAMPLES = [
  {
    title: "Language Learning",
    description:
      "You might study for months feeling like you're not improving, then suddenly find yourself understanding conversations.",
  },
  {
    title: "Fitness",
    description:
      "The first few weeks of exercise show minimal visible changes, but internally your body is adapting and strengthening.",
  },
  {
    title: "Skill Building",
    description:
      "Learning an instrument or coding feels frustrating at first, but neural pathways are forming that will eventually enable fluency.",
  },
  {
    title: "Study Habits",
    description:
      "Consistent review may not improve test scores immediately, but knowledge compounds and eventually clicks into place.",
  },
];
