/**
 * Habits Feature Components
 * Story 2-6: Visual Habit Card Component
 * Story 2-7: Habit Stack Builder with Drag-Drop
 * Story 2-8: Two-Minute Rule Generator
 * Story 3-1: One-Tap Habit Completion
 */

// Core habit components
export { HabitCard, HabitCardSkeleton, CompactHabitCard } from "./HabitCard";
export { HabitList } from "./HabitList";
export { StreakRing } from "./StreakRing";
export { CategoryIndicator, CATEGORY_COLORS, getCategoryDisplayName } from "./CategoryIndicator";
export type { HabitCategory } from "./CategoryIndicator";
export { FilterChips } from "./FilterChips";
export type { HabitFilter } from "./FilterChips";
export { EmptyHabitsState } from "./EmptyHabitsState";

// Completion components (Story 3-1)
export { HabitCompletionButton } from "./HabitCompletionButton";
export {
  SuccessToastContent,
  ErrorToastContent,
  OfflineToastContent,
  SyncToastContent,
  StreakMilestoneToast,
} from "./HabitCompletionToast";
export { OfflineIndicator, OfflineBanner } from "./OfflineIndicator";

// Two-minute rule components (Story 2-8)
export { TwoMinuteSuggestion } from "./TwoMinuteSuggestion";
export { ContinuePrompt, TwoMinuteBadge, ContinuationTimer } from "./ContinuePrompt";

// Habit stacking components (Story 2-7)
export { HabitStackBuilder, useHabitStack } from "./HabitStackBuilder";
export { DraggableHabitCard, DraggableHabitCardOverlay } from "./DraggableHabitCard";
export { StackConnection, StackConnectionLine } from "./StackConnection";
export { StackPreview, StackFlowText, generateStackFlowText } from "./StackPreview";
