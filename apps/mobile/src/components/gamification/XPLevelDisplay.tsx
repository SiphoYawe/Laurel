import { Star, Zap } from "lucide-react-native";
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { colors, borderRadius, fontSize, fontWeight, spacing } from "../../lib/theme";

export interface XPLevelDisplayProps {
  /** Current XP points */
  currentXP: number;
  /** XP required to reach the next level */
  xpForNextLevel: number;
  /** Current level number */
  level: number;
}

/**
 * XPLevelDisplay Component
 * Displays the user's current level, XP progress bar, and XP count.
 * Uses animated progress bar to show progression to the next level.
 */
export function XPLevelDisplay({ currentXP, xpForNextLevel, level }: XPLevelDisplayProps) {
  const progressPercentage = Math.min((currentXP / xpForNextLevel) * 100, 100);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withTiming(progressPercentage, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [progressPercentage, progressWidth]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });

  return (
    <View style={styles.container}>
      {/* Level Badge */}
      <View style={styles.levelSection}>
        <View style={styles.levelBadge}>
          <Star color={colors.laurel.white} fill={colors.laurel.white} size={18} />
        </View>
        <View style={styles.levelInfo}>
          <Text style={styles.levelLabel}>Level</Text>
          <Text style={styles.levelNumber}>{level}</Text>
        </View>
      </View>

      {/* XP Progress Section */}
      <View style={styles.xpSection}>
        <View style={styles.xpHeader}>
          <View style={styles.xpLabelContainer}>
            <Zap color={colors.laurel.amber} fill={colors.laurel.amber} size={14} />
            <Text style={styles.xpLabel}>XP</Text>
          </View>
          <Text style={styles.xpCount}>
            {currentXP.toLocaleString()} / {xpForNextLevel.toLocaleString()}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View style={[styles.progressBarFill, animatedProgressStyle]} />
          </View>
        </View>

        {/* Progress Percentage */}
        <Text style={styles.progressText}>
          {Math.round(progressPercentage)}% to Level {level + 1}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  levelSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  levelBadge: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.laurel.forest,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  levelInfo: {
    flexDirection: "column",
  },
  levelLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  levelNumber: {
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.bold,
    color: colors.laurel.forest,
  },
  xpSection: {
    flex: 1,
  },
  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  xpLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  xpLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.laurel.amber,
  },
  xpCount: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.mutedForeground,
  },
  progressBarContainer: {
    marginBottom: spacing.xs,
  },
  progressBarBackground: {
    height: 10,
    borderRadius: borderRadius.full,
    backgroundColor: `${colors.laurel.amber}20`,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: borderRadius.full,
    backgroundColor: colors.laurel.amber,
  },
  progressText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.mutedForeground,
    textAlign: "right",
  },
});

export default XPLevelDisplay;
