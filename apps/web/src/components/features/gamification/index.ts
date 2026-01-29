/**
 * Gamification Components
 * Stories 4-2 through 4-6
 */

// Story 4-2: XP Earning System
export { XpDisplay, XpGainPopup, CompactXpDisplay } from "./XpDisplay";

// Story 4-3: Level Progression System
export { LevelProgress, LevelUpCelebration, CompactLevelBadge } from "./LevelProgress";

// Story 4-4: Achievement Badge System
export {
  BadgeCard,
  BadgeUnlockCelebration,
  RarityBadge,
  type BadgeRarity,
  type BadgeCategory,
} from "./BadgeCard";

// Story 4-5: Badge Showcase on Profile
export { BadgeShowcase, CompactBadgeRow } from "./BadgeShowcase";

// Story 4-6: Milestone Celebration Enhancements
export {
  MilestoneCelebration,
  useMilestoneCelebration,
  QuickCelebration,
  type MilestoneType,
} from "./MilestoneCelebration";
