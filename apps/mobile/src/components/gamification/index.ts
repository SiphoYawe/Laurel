/**
 * Gamification Components
 * Components related to XP, levels, achievements, and game mechanics
 */

export { XPLevelDisplay } from "./XPLevelDisplay";
export type { XPLevelDisplayProps } from "./XPLevelDisplay";

export { BadgeShowcase, defaultBadges } from "./BadgeShowcase";
export type { BadgeShowcaseProps, Badge, BadgeCategory } from "./BadgeShowcase";

export { CelebrationProvider, useCelebration } from "./Celebration";
export type {
  CelebrationType,
  CelebrationData,
  CelebrationConfig,
  CelebrationContextValue,
} from "./Celebration";
