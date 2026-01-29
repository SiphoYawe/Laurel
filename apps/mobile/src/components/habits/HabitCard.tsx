import * as Haptics from "expo-haptics";
import { Check, Circle as CircleIcon, Flame, Undo2 } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  interpolate,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from "../../lib/theme";

// Create animated versions of components
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Habit category types with associated colors
 */
export type HabitCategory =
  | "health"
  | "productivity"
  | "mindfulness"
  | "learning"
  | "fitness"
  | "creativity"
  | "social"
  | "finance";

/**
 * Category color mapping using theme colors
 */
export const categoryColors: Record<HabitCategory, string> = {
  health: colors.laurel.forest,
  productivity: colors.laurel.amber,
  mindfulness: colors.laurel.sage,
  learning: "#6366F1", // Indigo
  fitness: "#EF4444", // Red
  creativity: "#EC4899", // Pink
  social: "#8B5CF6", // Purple
  finance: "#14B8A6", // Teal
};

/**
 * Habit data structure
 */
export interface Habit {
  id: string;
  name: string;
  streak: number;
  category: HabitCategory;
  isCompleted: boolean;
  maxStreak?: number;
}

/**
 * HabitCard component props
 */
interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string) => void;
  onUndo?: (habitId: string) => void;
  onLongPress?: () => void;
  isDragging?: boolean;
}

/**
 * Milestone streaks that trigger celebrations
 */
const MILESTONE_STREAKS = [7, 30, 100];

/**
 * Check if a streak is a milestone
 */
function isMilestoneStreak(streak: number): boolean {
  return MILESTONE_STREAKS.includes(streak);
}

/**
 * Confetti particle component for celebration
 */
interface ConfettiParticleProps {
  index: number;
  color: string;
  isActive: boolean;
}

function ConfettiParticle({ index, color, isActive }: ConfettiParticleProps) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      // Reset values
      translateY.value = 0;
      translateX.value = 0;
      opacity.value = 1;
      scale.value = 1;
      rotate.value = 0;

      // Randomize trajectory
      const randomAngle = (Math.random() - 0.5) * 120;
      const randomDistance = 60 + Math.random() * 80;

      // Animate explosion
      translateY.value = withSequence(
        withTiming(-randomDistance, { duration: 400, easing: Easing.out(Easing.cubic) }),
        withTiming(-randomDistance + 40, { duration: 600, easing: Easing.in(Easing.cubic) })
      );
      translateX.value = withTiming(Math.sin((randomAngle * Math.PI) / 180) * randomDistance, {
        duration: 1000,
        easing: Easing.out(Easing.cubic),
      });
      rotate.value = withTiming(360 + Math.random() * 360, { duration: 1000 });
      opacity.value = withDelay(600, withTiming(0, { duration: 400 }));
      scale.value = withSequence(
        withSpring(1.2, { damping: 8 }),
        withDelay(400, withTiming(0.5, { duration: 400 }))
      );
    } else {
      opacity.value = 0;
    }
  }, [isActive, index, translateY, translateX, opacity, rotate, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const shapes = ["circle", "square", "triangle"];
  const shape = shapes[index % shapes.length];

  return (
    <Animated.View
      style={[
        styles.confettiParticle,
        animatedStyle,
        shape === "circle" && styles.confettiCircle,
        shape === "square" && styles.confettiSquare,
        { backgroundColor: color },
      ]}
    />
  );
}

/**
 * Confetti celebration component
 */
interface ConfettiCelebrationProps {
  isActive: boolean;
  color: string;
}

function ConfettiCelebration({ isActive, color }: ConfettiCelebrationProps) {
  const confettiColors = [
    color,
    colors.laurel.amber,
    colors.laurel.sage,
    "#FFD700", // Gold
    "#FF6B6B", // Coral
    "#4ECDC4", // Teal
  ];

  return (
    <View style={styles.confettiContainer}>
      {Array.from({ length: 12 }).map((_, index) => (
        <ConfettiParticle
          key={index}
          color={confettiColors[index % confettiColors.length]}
          index={index}
          isActive={isActive}
        />
      ))}
    </View>
  );
}

/**
 * Undo Toast component
 */
interface UndoToastProps {
  isVisible: boolean;
  onUndo: () => void;
  streak: number;
}

function UndoToast({ isVisible, onUndo, streak }: UndoToastProps) {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withTiming(100, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [isVisible, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const isMilestone = isMilestoneStreak(streak);

  return (
    <Animated.View style={[styles.toastContainer, animatedStyle]}>
      <View style={styles.toast}>
        <View style={styles.toastContent}>
          <Check color={colors.success.DEFAULT} size={18} />
          <Text style={styles.toastText}>
            {isMilestone ? `Amazing! ${streak}-day streak!` : "Habit completed!"}
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} style={styles.undoButton} onPress={onUndo}>
          <Undo2 color={colors.laurel.forest} size={16} />
          <Text style={styles.undoText}>Undo</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

/**
 * Animated Streak Ring component
 */
interface StreakRingProps {
  streak: number;
  maxStreak?: number;
  color: string;
  size?: number;
  isAnimating?: boolean;
}

function StreakRing({
  streak,
  maxStreak = 30,
  color,
  size = 56,
  isAnimating = false,
}: StreakRingProps) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(streak / maxStreak, 1);

  // Shared value for animated progress
  const animatedProgress = useSharedValue(progress);

  useEffect(() => {
    if (isAnimating) {
      // Animate from previous progress to new progress
      animatedProgress.value = withTiming(progress, {
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      animatedProgress.value = progress;
    }
  }, [progress, isAnimating, animatedProgress]);

  // Animated props for the progress circle
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - animatedProgress.value);
    return {
      strokeDashoffset,
    };
  });

  // Glow animation for celebration
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (isAnimating && isMilestoneStreak(streak)) {
      glowScale.value = withSequence(
        withSpring(1.3, { damping: 8 }),
        withTiming(1, { duration: 300 })
      );
      glowOpacity.value = withSequence(
        withTiming(0.5, { duration: 200 }),
        withTiming(0, { duration: 400 })
      );
    }
  }, [isAnimating, streak, glowScale, glowOpacity]);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  return (
    <View style={[styles.streakRingContainer, { width: size, height: size }]}>
      {/* Glow effect for milestones */}
      <Animated.View
        style={[
          styles.streakGlow,
          { width: size + 16, height: size + 16, backgroundColor: color },
          glowStyle,
        ]}
      />
      <Svg height={size} style={styles.streakRingSvg} width={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          r={radius}
          stroke={colors.gray[200]}
          strokeWidth={strokeWidth}
        />
        {/* Animated progress circle */}
        <AnimatedCircle
          animatedProps={animatedProps}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          origin={`${size / 2}, ${size / 2}`}
          r={radius}
          rotation={-90}
          stroke={color}
          strokeDasharray={circumference}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </Svg>
      {/* Streak count and flame icon */}
      <View style={styles.streakContent}>
        {streak > 0 ? (
          <>
            <Flame color={color} size={14} />
            <Text style={[styles.streakText, { color }]}>{streak}</Text>
          </>
        ) : (
          <CircleIcon color={colors.gray[400]} size={18} />
        )}
      </View>
    </View>
  );
}

/**
 * HabitCard Component
 *
 * Displays a single habit with:
 * - Habit name and category
 * - Circular streak ring showing current streak progress
 * - Category color indicator
 * - Completion checkbox/button
 * - Haptic feedback on completion
 * - Optimistic UI updates with undo functionality
 * - Celebration animation for milestone streaks (7, 30, 100 days)
 */
export function HabitCard({
  habit,
  onToggle,
  onUndo,
  onLongPress,
  isDragging = false,
}: HabitCardProps) {
  const { id, name, streak, category, isCompleted, maxStreak } = habit;
  const categoryColor = categoryColors[category];

  // Local optimistic state
  const [optimisticCompleted, setOptimisticCompleted] = useState(isCompleted);
  const [optimisticStreak, setOptimisticStreak] = useState(streak);
  const [showUndoToast, setShowUndoToast] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isAnimatingRing, setIsAnimatingRing] = useState(false);

  // Refs for undo timer
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync with prop changes (e.g., server sync)
  useEffect(() => {
    if (!showUndoToast) {
      setOptimisticCompleted(isCompleted);
      setOptimisticStreak(streak);
    }
  }, [isCompleted, streak, showUndoToast]);

  // Animation values
  const checkboxScale = useSharedValue(1);
  const checkmarkOpacity = useSharedValue(isCompleted ? 1 : 0);

  // Trigger haptic feedback
  const triggerHaptic = useCallback(async (type: "success" | "selection") => {
    try {
      if (type === "success") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        await Haptics.selectionAsync();
      }
    } catch {
      // Haptics not available (e.g., simulator)
    }
  }, []);

  // Handle completion toggle
  const handleToggle = useCallback(() => {
    // Don't allow toggle while dragging
    if (isDragging) return;

    // Clear any existing undo timer
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
    }

    const wasCompleted = optimisticCompleted;
    const newCompleted = !wasCompleted;
    const newStreak = newCompleted ? streak + 1 : streak;

    // Optimistic UI update
    setOptimisticCompleted(newCompleted);
    setOptimisticStreak(newStreak);

    // Animate checkbox
    checkmarkOpacity.value = withTiming(newCompleted ? 1 : 0, { duration: 200 });
    checkboxScale.value = withSequence(
      withSpring(0.8, { damping: 15 }),
      withSpring(1, { damping: 10 })
    );

    if (newCompleted) {
      // Completion haptic and animations
      triggerHaptic("success");
      setIsAnimatingRing(true);

      // Check for milestone celebration
      if (isMilestoneStreak(newStreak)) {
        setShowConfetti(true);
        // Extra strong haptic for milestones
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setTimeout(() => setShowConfetti(false), 1200);
      }

      // Show undo toast
      setShowUndoToast(true);

      // Auto-hide undo toast after 5 seconds
      undoTimerRef.current = setTimeout(() => {
        setShowUndoToast(false);
        setIsAnimatingRing(false);
        // Actually commit the change to server
        onToggle(id);
      }, 5000);
    } else {
      // Uncomplete - immediate
      triggerHaptic("selection");
      setIsAnimatingRing(true);
      setTimeout(() => setIsAnimatingRing(false), 600);
      onToggle(id);
    }
  }, [
    optimisticCompleted,
    streak,
    id,
    onToggle,
    triggerHaptic,
    checkmarkOpacity,
    checkboxScale,
    isDragging,
  ]);

  // Handle undo
  const handleUndo = useCallback(() => {
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current);
    }

    triggerHaptic("selection");

    // Revert optimistic state
    setOptimisticCompleted(isCompleted);
    setOptimisticStreak(streak);
    setShowUndoToast(false);
    setIsAnimatingRing(false);

    // Animate checkbox back
    checkmarkOpacity.value = withTiming(isCompleted ? 1 : 0, { duration: 200 });

    // Call undo callback if provided
    onUndo?.(id);
  }, [isCompleted, streak, id, onUndo, triggerHaptic, checkmarkOpacity]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current);
      }
    };
  }, []);

  // Gesture handler for tap with animated press feedback
  const pressed = useSharedValue(0);

  const tapGesture = Gesture.Tap()
    .enabled(!isDragging)
    .onBegin(() => {
      pressed.value = withTiming(1, { duration: 100 });
    })
    .onFinalize(() => {
      pressed.value = withTiming(0, { duration: 100 });
    })
    .onEnd(() => {
      runOnJS(handleToggle)();
    });

  // Long press gesture for drag support
  const longPressGesture = Gesture.LongPress()
    .enabled(!isDragging && !!onLongPress)
    .minDuration(200)
    .onStart(() => {
      if (onLongPress) {
        runOnJS(onLongPress)();
      }
    });

  // Compose gestures
  const composedGesture = Gesture.Race(tapGesture, longPressGesture);

  // Card press animation style
  const cardAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressed.value, [0, 1], [1, 0.98]);
    return {
      transform: [{ scale }],
    };
  });

  // Checkbox animation style
  const checkboxAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkboxScale.value }],
  }));

  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: checkmarkOpacity.value,
    transform: [{ scale: interpolate(checkmarkOpacity.value, [0, 1], [0.5, 1]) }],
  }));

  return (
    <View style={styles.cardWrapper}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.card, cardAnimatedStyle, isDragging && styles.cardDragging]}>
          {/* Category color indicator */}
          <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />

          {/* Streak ring with confetti */}
          <View style={styles.streakRingWrapper}>
            <ConfettiCelebration color={categoryColor} isActive={showConfetti} />
            <StreakRing
              color={categoryColor}
              isAnimating={isAnimatingRing}
              maxStreak={maxStreak}
              streak={optimisticStreak}
            />
          </View>

          {/* Habit info */}
          <View style={styles.habitInfo}>
            <Text
              numberOfLines={1}
              style={[styles.habitName, optimisticCompleted && styles.habitNameCompleted]}
            >
              {name}
            </Text>
            <Text style={styles.categoryText}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </View>

          {/* Completion checkbox */}
          <Animated.View style={checkboxAnimatedStyle}>
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={isDragging}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={[
                styles.checkbox,
                optimisticCompleted && [
                  styles.checkboxCompleted,
                  { backgroundColor: categoryColor, borderColor: categoryColor },
                ],
              ]}
              onPress={handleToggle}
            >
              <Animated.View style={checkmarkAnimatedStyle}>
                {optimisticCompleted && <Check color={colors.background} size={16} />}
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      {/* Undo Toast */}
      <UndoToast isVisible={showUndoToast} streak={optimisticStreak} onUndo={handleUndo} />
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    position: "relative",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    ...shadow.md,
  },
  cardDragging: {
    opacity: 0.95,
    borderWidth: 2,
    borderColor: colors.laurel.sage,
  },
  categoryIndicator: {
    width: 4,
    height: 40,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  streakRingWrapper: {
    position: "relative",
    marginRight: spacing.sm,
  },
  streakRingContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  streakRingSvg: {
    position: "absolute",
  },
  streakGlow: {
    position: "absolute",
    borderRadius: 100,
    top: -8,
    left: -8,
  },
  streakContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  streakText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    marginTop: 1,
  },
  habitInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  habitName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: 2,
  },
  habitNameCompleted: {
    textDecorationLine: "line-through",
    color: colors.mutedForeground,
  },
  categoryText: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.gray[300],
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  checkboxCompleted: {
    borderWidth: 0,
  },
  // Confetti styles
  confettiContainer: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  confettiParticle: {
    position: "absolute",
    width: 8,
    height: 8,
  },
  confettiCircle: {
    borderRadius: 4,
  },
  confettiSquare: {
    borderRadius: 1,
  },
  // Toast styles
  toastContainer: {
    position: "absolute",
    bottom: -60,
    left: spacing.md,
    right: spacing.md,
    zIndex: 100,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.gray[800],
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    ...shadow.lg,
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  toastText: {
    color: colors.background,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  undoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  undoText: {
    color: colors.laurel.forest,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});

export default HabitCard;
