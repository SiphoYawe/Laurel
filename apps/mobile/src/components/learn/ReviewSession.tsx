import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react-native";
import React, { useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  interpolate,
  Easing,
  runOnJS,
  FadeIn,
  FadeInDown,
  FadeOut,
  SlideInUp,
} from "react-native-reanimated";

import { FlashCard } from "./FlashCard";
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from "../../lib/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/**
 * Spaced repetition interval levels (in days)
 * Based on SM-2 algorithm intervals
 */
const INTERVAL_LEVELS = [0, 1, 3, 7, 14, 30, 60, 120];

/**
 * Card data for review session
 */
export interface ReviewCard {
  id: string;
  front: string;
  back: string;
  difficulty?: "easy" | "medium" | "hard";
  /** Current interval level (0-7) */
  intervalLevel?: number;
  /** Last review date */
  lastReviewed?: Date;
  /** Next scheduled review date */
  nextReview?: Date;
}

/**
 * Result of a single card review
 */
export interface CardReviewResult {
  cardId: string;
  response: "correct" | "wrong" | "skipped";
  newIntervalLevel: number;
  nextReviewDate: Date;
  reviewedAt: Date;
}

/**
 * Session summary statistics
 */
export interface SessionSummary {
  totalCards: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  accuracy: number;
  masteryGain: number;
  results: CardReviewResult[];
}

/**
 * Props for ReviewSession component
 */
export interface ReviewSessionProps {
  /** Deck name for display */
  deckName: string;
  /** Cards to review */
  cards: ReviewCard[];
  /** Callback when session is completed */
  onSessionComplete: (summary: SessionSummary) => void;
  /** Callback to exit the session early */
  onExit: () => void;
  /** Optional callback when a single card is reviewed */
  onCardReviewed?: (result: CardReviewResult) => void;
}

/**
 * Calculate next review date based on response
 */
function calculateNextReview(
  currentLevel: number,
  response: "correct" | "wrong" | "skipped"
): { newLevel: number; nextDate: Date } {
  let newLevel = currentLevel;

  if (response === "correct") {
    // Move up one level (max 7)
    newLevel = Math.min(currentLevel + 1, INTERVAL_LEVELS.length - 1);
  } else if (response === "wrong") {
    // Reset to level 0
    newLevel = 0;
  }
  // Skipped: keep same level

  const daysUntilNext = INTERVAL_LEVELS[newLevel];
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + daysUntilNext);

  return { newLevel, nextDate };
}

/**
 * Progress Arc Component
 * Renders a circular progress indicator with fill effect
 */
function ProgressArc({
  progress,
  correctRatio,
  wrongRatio,
}: {
  progress: number;
  correctRatio: number;
  wrongRatio: number;
}) {
  const size = 56;

  // Animated fill height
  const fillStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(`${progress * 100}%`, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      }),
    };
  });

  return (
    <View style={progressStyles.container}>
      {/* Background circle */}
      <View style={[progressStyles.circle, { width: size, height: size }]}>
        <View style={progressStyles.backgroundRing} />
        {/* Progress fill from bottom */}
        <Animated.View style={[progressStyles.progressFill, fillStyle]}>
          <View style={[progressStyles.correctSegment, { flex: correctRatio || 0 }]} />
          <View style={[progressStyles.wrongSegment, { flex: wrongRatio || 0 }]} />
          <View
            style={[
              progressStyles.skippedSegment,
              { flex: Math.max(0, 1 - correctRatio - wrongRatio) || 1 },
            ]}
          />
        </Animated.View>
        {/* Center content */}
        <View style={progressStyles.centerContent}>
          <Text style={progressStyles.progressText}>{Math.round(progress * 100)}%</Text>
        </View>
      </View>
    </View>
  );
}

const progressStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    borderRadius: 28,
    backgroundColor: colors.gray[100],
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  backgroundRing: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    backgroundColor: colors.gray[100],
  },
  progressFill: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: 28,
  },
  correctSegment: {
    backgroundColor: colors.success.DEFAULT,
    opacity: 0.4,
  },
  wrongSegment: {
    backgroundColor: colors.error.DEFAULT,
    opacity: 0.4,
  },
  skippedSegment: {
    backgroundColor: colors.laurel.sage,
    opacity: 0.3,
  },
  centerContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
  },
  progressText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.laurel.forest,
  },
});

/**
 * Stats Bar Component
 * Shows real-time counts of correct/wrong/skipped
 */
function StatsBar({
  correct,
  wrong,
  skipped,
}: {
  correct: number;
  wrong: number;
  skipped: number;
}) {
  return (
    <View style={statsStyles.container}>
      <View style={statsStyles.stat}>
        <View style={[statsStyles.indicator, statsStyles.correctIndicator]} />
        <Text style={statsStyles.count}>{correct}</Text>
        <Text style={statsStyles.label}>Correct</Text>
      </View>
      <View style={statsStyles.stat}>
        <View style={[statsStyles.indicator, statsStyles.wrongIndicator]} />
        <Text style={statsStyles.count}>{wrong}</Text>
        <Text style={statsStyles.label}>Wrong</Text>
      </View>
      <View style={statsStyles.stat}>
        <View style={[statsStyles.indicator, statsStyles.skippedIndicator]} />
        <Text style={statsStyles.count}>{skipped}</Text>
        <Text style={statsStyles.label}>Skipped</Text>
      </View>
    </View>
  );
}

const statsStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.lg,
    paddingVertical: spacing.sm,
  },
  stat: {
    alignItems: "center",
    minWidth: 60,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  correctIndicator: {
    backgroundColor: colors.success.DEFAULT,
  },
  wrongIndicator: {
    backgroundColor: colors.error.DEFAULT,
  },
  skippedIndicator: {
    backgroundColor: colors.gray[400],
  },
  count: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    marginTop: 2,
  },
});

/**
 * Session Summary Component
 * Displays results when session is complete
 */
function SessionSummaryView({
  summary,
  deckName,
  onRestart,
  onExit,
}: {
  summary: SessionSummary;
  deckName: string;
  onRestart: () => void;
  onExit: () => void;
}) {
  const { totalCards, correctCount, wrongCount, skippedCount, accuracy, masteryGain } = summary;

  // Determine performance message
  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { text: "Exceptional!", color: colors.laurel.forest };
    if (accuracy >= 75) return { text: "Great work!", color: colors.success.DEFAULT };
    if (accuracy >= 50) return { text: "Keep practicing!", color: colors.laurel.amber };
    return { text: "Room to grow", color: colors.gray[500] };
  };

  const performance = getPerformanceMessage();

  return (
    <View style={summaryStyles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={summaryStyles.header}>
        <Text style={summaryStyles.completedText}>Session Complete</Text>
        <Text style={summaryStyles.deckName}>{deckName}</Text>
      </Animated.View>

      {/* Main Score Circle */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(600).springify()}
        style={summaryStyles.scoreContainer}
      >
        <View style={summaryStyles.scoreCircle}>
          <View style={summaryStyles.scoreInner}>
            <Text style={[summaryStyles.scorePercent, { color: performance.color }]}>
              {accuracy}%
            </Text>
            <Text style={summaryStyles.scoreLabel}>Accuracy</Text>
          </View>
          {/* Progress ring visual */}
          <View style={[summaryStyles.scoreRing, { borderColor: performance.color }]} />
        </View>
        <Text style={[summaryStyles.performanceText, { color: performance.color }]}>
          {performance.text}
        </Text>
      </Animated.View>

      {/* Stats Grid */}
      <Animated.View entering={FadeInDown.delay(400).duration(500)} style={summaryStyles.statsGrid}>
        <View style={summaryStyles.statBox}>
          <View style={[summaryStyles.statIcon, { backgroundColor: colors.success.light }]}>
            <ChevronRight color={colors.success.DEFAULT} size={18} />
          </View>
          <Text style={summaryStyles.statValue}>{correctCount}</Text>
          <Text style={summaryStyles.statLabel}>Correct</Text>
        </View>

        <View style={summaryStyles.statBox}>
          <View style={[summaryStyles.statIcon, { backgroundColor: colors.error.light }]}>
            <ChevronLeft color={colors.error.DEFAULT} size={18} />
          </View>
          <Text style={summaryStyles.statValue}>{wrongCount}</Text>
          <Text style={summaryStyles.statLabel}>Wrong</Text>
        </View>

        <View style={summaryStyles.statBox}>
          <View style={[summaryStyles.statIcon, { backgroundColor: colors.gray[100] }]}>
            <RotateCcw color={colors.gray[500]} size={16} />
          </View>
          <Text style={summaryStyles.statValue}>{skippedCount}</Text>
          <Text style={summaryStyles.statLabel}>Skipped</Text>
        </View>

        <View style={summaryStyles.statBox}>
          <View style={[summaryStyles.statIcon, { backgroundColor: `${colors.laurel.sage}30` }]}>
            <Text style={summaryStyles.masteryIcon}>+</Text>
          </View>
          <Text style={summaryStyles.statValue}>{masteryGain}%</Text>
          <Text style={summaryStyles.statLabel}>Mastery</Text>
        </View>
      </Animated.View>

      {/* Cards reviewed bar */}
      <Animated.View
        entering={FadeInDown.delay(500).duration(500)}
        style={summaryStyles.progressBar}
      >
        <View style={summaryStyles.progressTrack}>
          <View
            style={[
              summaryStyles.progressCorrect,
              { width: `${(correctCount / totalCards) * 100}%` },
            ]}
          />
          <View
            style={[summaryStyles.progressWrong, { width: `${(wrongCount / totalCards) * 100}%` }]}
          />
          <View
            style={[
              summaryStyles.progressSkipped,
              { width: `${(skippedCount / totalCards) * 100}%` },
            ]}
          />
        </View>
        <Text style={summaryStyles.cardsReviewedText}>{totalCards} cards reviewed</Text>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View entering={FadeInDown.delay(600).duration(500)} style={summaryStyles.actions}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={summaryStyles.restartButton}
          onPress={onRestart}
        >
          <RotateCcw color={colors.laurel.forest} size={18} />
          <Text style={summaryStyles.restartText}>Study Again</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={summaryStyles.doneButton} onPress={onExit}>
          <Text style={summaryStyles.doneText}>Done</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const summaryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.laurel.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === "ios" ? 60 : spacing.xl,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  completedText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.laurel.forest,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  deckName: {
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    textAlign: "center",
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: spacing["2xl"],
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    ...shadow.lg,
  },
  scoreInner: {
    alignItems: "center",
  },
  scorePercent: {
    fontSize: fontSize["4xl"],
    fontWeight: fontWeight.bold,
  },
  scoreLabel: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  scoreRing: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 74,
    borderWidth: 3,
    opacity: 0.3,
  },
  performanceText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  statBox: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.sm) / 2 - spacing.sm / 2,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: "center",
    ...shadow.sm,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  masteryIcon: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.laurel.forest,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  progressBar: {
    marginBottom: spacing["2xl"],
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.gray[100],
    borderRadius: 4,
    flexDirection: "row",
    overflow: "hidden",
  },
  progressCorrect: {
    height: "100%",
    backgroundColor: colors.success.DEFAULT,
  },
  progressWrong: {
    height: "100%",
    backgroundColor: colors.error.DEFAULT,
  },
  progressSkipped: {
    height: "100%",
    backgroundColor: colors.gray[400],
  },
  cardsReviewedText: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: "auto",
  },
  restartButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.laurel.forest,
    backgroundColor: colors.background,
  },
  restartText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.laurel.forest,
  },
  doneButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.laurel.forest,
    ...shadow.sm,
  },
  doneText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.background,
  },
});

/**
 * ReviewSession Component
 *
 * Manages a flashcard review session with:
 * - Card stack management
 * - Progress tracking
 * - Response counting (correct/wrong/skipped)
 * - Spaced repetition interval updates
 * - Session summary on completion
 */
export function ReviewSession({
  deckName,
  cards,
  onSessionComplete,
  onExit,
  onCardReviewed,
}: ReviewSessionProps) {
  // Session state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<CardReviewResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [sessionKey, setSessionKey] = useState(0); // For restart

  // Current card
  const currentCard = cards[currentIndex];
  const totalCards = cards.length;

  // Calculate stats
  const correctCount = results.filter((r) => r.response === "correct").length;
  const wrongCount = results.filter((r) => r.response === "wrong").length;
  const skippedCount = results.filter((r) => r.response === "skipped").length;

  // Progress calculations
  const progress = totalCards > 0 ? currentIndex / totalCards : 0;
  const reviewedCards = results.length;
  const correctRatio = reviewedCards > 0 ? correctCount / reviewedCards : 0;
  const wrongRatio = reviewedCards > 0 ? wrongCount / reviewedCards : 0;

  // Handle card response
  const handleCardResponse = useCallback(
    (response: "correct" | "wrong" | "skipped") => {
      if (!currentCard) return;

      // Calculate new interval
      const currentLevel = currentCard.intervalLevel ?? 0;
      const { newLevel, nextDate } = calculateNextReview(currentLevel, response);

      // Create result
      const result: CardReviewResult = {
        cardId: currentCard.id,
        response,
        newIntervalLevel: newLevel,
        nextReviewDate: nextDate,
        reviewedAt: new Date(),
      };

      // Update results
      const newResults = [...results, result];
      setResults(newResults);

      // Notify parent if callback provided
      if (onCardReviewed) {
        onCardReviewed(result);
      }

      // Check if session is complete
      if (currentIndex >= totalCards - 1) {
        // Calculate summary
        const newCorrectCount = newResults.filter((r) => r.response === "correct").length;
        const newWrongCount = newResults.filter((r) => r.response === "wrong").length;
        const newSkippedCount = newResults.filter((r) => r.response === "skipped").length;
        const reviewedForAccuracy = newCorrectCount + newWrongCount;
        const accuracy =
          reviewedForAccuracy > 0 ? Math.round((newCorrectCount / reviewedForAccuracy) * 100) : 0;

        // Calculate mastery gain (simplified)
        const masteryGain = Math.round((newCorrectCount / totalCards) * 10);

        const summary: SessionSummary = {
          totalCards,
          correctCount: newCorrectCount,
          wrongCount: newWrongCount,
          skippedCount: newSkippedCount,
          accuracy,
          masteryGain,
          results: newResults,
        };

        setIsComplete(true);
        onSessionComplete(summary);
      } else {
        // Move to next card
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [currentCard, currentIndex, results, totalCards, onCardReviewed, onSessionComplete]
  );

  // Handle swipe callbacks from FlashCard
  const handleSwipeLeft = useCallback(() => {
    handleCardResponse("wrong");
  }, [handleCardResponse]);

  const handleSwipeRight = useCallback(() => {
    handleCardResponse("correct");
  }, [handleCardResponse]);

  const handleSwipeUp = useCallback(() => {
    handleCardResponse("skipped");
  }, [handleCardResponse]);

  // Restart session
  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setResults([]);
    setIsComplete(false);
    setSessionKey((prev) => prev + 1);
  }, []);

  // Calculate session summary for display
  const sessionSummary: SessionSummary = useMemo(() => {
    const reviewedForAccuracy = correctCount + wrongCount;
    const accuracy =
      reviewedForAccuracy > 0 ? Math.round((correctCount / reviewedForAccuracy) * 100) : 0;
    const masteryGain = Math.round((correctCount / Math.max(totalCards, 1)) * 10);

    return {
      totalCards,
      correctCount,
      wrongCount,
      skippedCount,
      accuracy,
      masteryGain,
      results,
    };
  }, [totalCards, correctCount, wrongCount, skippedCount, results]);

  // Show empty state if no cards
  if (cards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Cards to Review</Text>
        <Text style={styles.emptySubtitle}>Add some flashcards to this deck to start studying</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.emptyButton} onPress={onExit}>
          <Text style={styles.emptyButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show summary if complete
  if (isComplete) {
    return (
      <SessionSummaryView
        deckName={deckName}
        summary={sessionSummary}
        onExit={onExit}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <View key={sessionKey} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.exitButton}
          onPress={onExit}
        >
          <ChevronLeft color={colors.foreground} size={24} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text numberOfLines={1} style={styles.deckTitle}>
            {deckName}
          </Text>
          <Text style={styles.cardProgress}>
            Card {currentIndex + 1} of {totalCards}
          </Text>
        </View>

        <ProgressArc correctRatio={correctRatio} progress={progress} wrongRatio={wrongRatio} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarTrack}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: `${((currentIndex + 1) / totalCards) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Stats Bar */}
      <StatsBar correct={correctCount} skipped={skippedCount} wrong={wrongCount} />

      {/* FlashCard */}
      <View style={styles.cardArea}>
        {currentCard && (
          <FlashCard
            key={`card-${currentCard.id}-${sessionKey}`}
            back={currentCard.back}
            cardNumber={currentIndex + 1}
            front={currentCard.front}
            totalCards={totalCards}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            onSwipeUp={handleSwipeUp}
          />
        )}
      </View>

      {/* Bottom hint */}
      <View style={styles.bottomHint}>
        <Text style={styles.hintText}>Swipe left for wrong, right for correct, up to skip</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.laurel.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === "ios" ? 60 : spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  exitButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.sm,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: spacing.sm,
  },
  deckTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: 2,
  },
  cardProgress: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  progressBarContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: colors.gray[200],
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.laurel.forest,
    borderRadius: 2,
  },
  cardArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomHint: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  hintText: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    textAlign: "center",
  },
  // Empty state styles
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.laurel.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.mutedForeground,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  emptyButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.laurel.forest,
    ...shadow.sm,
  },
  emptyButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.background,
  },
});

export default ReviewSession;
