import * as Haptics from "expo-haptics";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Modal } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

import { colors, fontSize, fontWeight, spacing } from "../../lib/theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ============================================================================
// Types
// ============================================================================

export type CelebrationType = "LEVEL_UP" | "BADGE_EARNED" | "STREAK_MILESTONE" | "PERFECT_WEEK";

export interface CelebrationData {
  newLevel?: number;
  badgeName?: string;
  badgeIcon?: string;
  streakCount?: number;
}

export interface CelebrationConfig {
  type: CelebrationType;
  data?: CelebrationData;
}

export interface CelebrationContextValue {
  /** Trigger a celebration animation */
  celebrate: (config: CelebrationConfig) => void;
  /** Whether a celebration is currently showing */
  isShowing: boolean;
}

// ============================================================================
// Context
// ============================================================================

const CelebrationContext = createContext<CelebrationContextValue | undefined>(undefined);

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access the celebration system.
 * Must be used within a CelebrationProvider.
 *
 * @example
 * ```tsx
 * const { celebrate } = useCelebration();
 * celebrate({ type: 'LEVEL_UP', data: { newLevel: 5 } });
 * ```
 */
export function useCelebration(): CelebrationContextValue {
  const context = useContext(CelebrationContext);

  if (context === undefined) {
    throw new Error("useCelebration must be used within a CelebrationProvider");
  }

  return context;
}

// ============================================================================
// Confetti Particle Component
// ============================================================================

interface ConfettiParticleProps {
  index: number;
  color: string;
  startDelay: number;
}

function ConfettiParticle({ color, startDelay }: ConfettiParticleProps) {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0);

  // Calculate random initial position across the screen width
  const startX = useMemo(() => Math.random() * SCREEN_WIDTH - SCREEN_WIDTH / 2, []);
  const drift = useMemo(() => (Math.random() - 0.5) * 100, []);
  const size = useMemo(() => 8 + Math.random() * 8, []);
  const particleBorderRadius = useMemo(() => (Math.random() > 0.5 ? size / 2 : 2), [size]);

  useEffect(() => {
    // Scale in
    scale.value = withDelay(startDelay, withSpring(1, { damping: 8, stiffness: 200 }));

    // Fall down with drift
    translateY.value = withDelay(
      startDelay,
      withTiming(SCREEN_HEIGHT + 100, {
        duration: 3000 + Math.random() * 1000,
        easing: Easing.out(Easing.quad),
      })
    );

    // Horizontal drift
    translateX.value = withDelay(
      startDelay,
      withTiming(startX + drift, {
        duration: 3000,
        easing: Easing.inOut(Easing.sin),
      })
    );

    // Rotation
    rotate.value = withDelay(
      startDelay,
      withRepeat(withTiming(360, { duration: 1000 + Math.random() * 500 }), -1, false)
    );

    // Fade out at end
    opacity.value = withDelay(startDelay + 2500, withTiming(0, { duration: 500 }));
  }, [translateY, translateX, rotate, opacity, scale, startDelay, startX, drift]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}deg` },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.confettiParticle,
        {
          backgroundColor: color,
          width: size,
          height: size,
          left: SCREEN_WIDTH / 2,
          borderRadius: particleBorderRadius,
        },
        animatedStyle,
      ]}
    />
  );
}

// ============================================================================
// Star Burst Component (for Level Up)
// ============================================================================

interface StarBurstProps {
  index: number;
}

function StarBurst({ index }: StarBurstProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const angle = (index * 360) / 8;
  const radians = (angle * Math.PI) / 180;

  useEffect(() => {
    const delay = index * 50;

    scale.value = withDelay(
      delay,
      withSequence(
        withSpring(1.5, { damping: 5, stiffness: 150 }),
        withTiming(0.8, { duration: 200 })
      )
    );

    translateX.value = withDelay(
      delay,
      withTiming(Math.cos(radians) * 80, {
        duration: 600,
        easing: Easing.out(Easing.exp),
      })
    );

    translateY.value = withDelay(
      delay,
      withTiming(Math.sin(radians) * 80, {
        duration: 600,
        easing: Easing.out(Easing.exp),
      })
    );

    opacity.value = withDelay(delay + 400, withTiming(0, { duration: 200 }));
  }, [scale, opacity, translateX, translateY, index, radians]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.starContainer, animatedStyle]}>
      <Text style={styles.starEmoji}>*</Text>
    </Animated.View>
  );
}

// ============================================================================
// Celebration Content Components
// ============================================================================

interface LevelUpContentProps {
  newLevel: number;
}

function LevelUpContent({ newLevel }: LevelUpContentProps) {
  const scale = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.2, { damping: 6, stiffness: 200 }),
      withSpring(1, { damping: 10, stiffness: 150 })
    );

    textOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
  }, [scale, textOpacity]);

  const levelStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  return (
    <View style={styles.contentContainer}>
      {/* Star burst effect */}
      {Array.from({ length: 8 }).map((_, i) => (
        <StarBurst key={i} index={i} />
      ))}

      <Animated.View style={[styles.levelBadge, levelStyle]}>
        <Text style={styles.levelNumber}>{newLevel}</Text>
      </Animated.View>

      <Animated.Text style={[styles.congratsText, textStyle]}>LEVEL UP!</Animated.Text>

      <Animated.Text style={[styles.subtitleText, textStyle]}>
        You&apos;ve reached Level {newLevel}
      </Animated.Text>
    </View>
  );
}

interface BadgeEarnedContentProps {
  badgeName?: string;
}

function BadgeEarnedContent({ badgeName = "Achievement" }: BadgeEarnedContentProps) {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(-15);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withDelay(100, withSpring(1.3, { damping: 5, stiffness: 180 })),
      withSpring(1, { damping: 12, stiffness: 150 })
    );

    rotation.value = withSequence(
      withDelay(100, withTiming(15, { duration: 150 })),
      withTiming(-10, { duration: 150 }),
      withTiming(5, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );

    textOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
  }, [scale, rotation, textOpacity]);

  const badgeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  return (
    <View style={styles.contentContainer}>
      <Animated.View style={[styles.badgeIconContainer, badgeStyle]}>
        <Text style={styles.badgeEmoji}>🏆</Text>
      </Animated.View>

      <Animated.Text style={[styles.congratsText, textStyle]}>BADGE EARNED!</Animated.Text>

      <Animated.Text style={[styles.subtitleText, textStyle]}>{badgeName}</Animated.Text>
    </View>
  );
}

interface StreakMilestoneContentProps {
  streakCount?: number;
}

function StreakMilestoneContent({ streakCount = 7 }: StreakMilestoneContentProps) {
  const fireScale = useSharedValue(0);
  const fireWiggle = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    fireScale.value = withSequence(
      withDelay(100, withSpring(1.4, { damping: 4, stiffness: 200 })),
      withSpring(1, { damping: 8, stiffness: 150 })
    );

    // Wiggle animation
    fireWiggle.value = withDelay(
      200,
      withRepeat(
        withSequence(
          withTiming(-5, { duration: 100 }),
          withTiming(5, { duration: 100 }),
          withTiming(0, { duration: 100 })
        ),
        3,
        false
      )
    );

    textOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
  }, [fireScale, fireWiggle, textOpacity]);

  const fireStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: fireScale.value }, { rotate: `${fireWiggle.value}deg` }],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  return (
    <View style={styles.contentContainer}>
      <Animated.View style={[styles.streakIconContainer, fireStyle]}>
        <Text style={styles.fireEmoji}>🔥</Text>
        <View style={styles.streakCountBadge}>
          <Text style={styles.streakCountText}>{streakCount}</Text>
        </View>
      </Animated.View>

      <Animated.Text style={[styles.congratsText, textStyle]}>STREAK MILESTONE!</Animated.Text>

      <Animated.Text style={[styles.subtitleText, textStyle]}>
        {streakCount} days in a row!
      </Animated.Text>
    </View>
  );
}

function PerfectWeekContent() {
  const trophyScale = useSharedValue(0);
  const sparkle = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    trophyScale.value = withSequence(
      withDelay(100, withSpring(1.5, { damping: 4, stiffness: 200 })),
      withSpring(1, { damping: 10, stiffness: 150 })
    );

    // Sparkle pulse
    sparkle.value = withRepeat(
      withSequence(withTiming(1, { duration: 300 }), withTiming(0.6, { duration: 300 })),
      5,
      true
    );

    textOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
  }, [trophyScale, sparkle, textOpacity]);

  const trophyStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: trophyScale.value }],
    };
  });

  const sparkleStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(sparkle.value, [0, 1], [0.3, 1], Extrapolation.CLAMP),
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  return (
    <View style={styles.contentContainer}>
      <View style={styles.trophyWrapper}>
        <Animated.View style={sparkleStyle}>
          <Text style={styles.sparkleEmoji}>✨</Text>
        </Animated.View>
        <Animated.View style={[styles.trophyIconContainer, trophyStyle]}>
          <Text style={styles.trophyEmoji}>🏆</Text>
        </Animated.View>
        <Animated.View style={sparkleStyle}>
          <Text style={styles.sparkleEmoji}>✨</Text>
        </Animated.View>
      </View>

      <Animated.Text style={[styles.congratsTextGold, textStyle]}>PERFECT WEEK!</Animated.Text>

      <Animated.Text style={[styles.subtitleText, textStyle]}>
        You completed all habits this week!
      </Animated.Text>
    </View>
  );
}

// ============================================================================
// Main Celebration Overlay Component
// ============================================================================

interface CelebrationOverlayProps {
  config: CelebrationConfig | null;
  onDismiss: () => void;
}

function CelebrationOverlay({ config, onDismiss }: CelebrationOverlayProps) {
  const overlayOpacity = useSharedValue(0);

  // Confetti colors based on theme
  const confettiColors = useMemo(
    () => [
      colors.laurel.amber,
      colors.laurel.sage,
      colors.laurel.forest,
      "#FFD700", // gold
      "#FF6B6B", // coral
      "#4ECDC4", // teal
    ],
    []
  );

  useEffect(() => {
    if (config) {
      // Trigger haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Fade in overlay
      overlayOpacity.value = withTiming(1, { duration: 300 });

      // Auto-dismiss after 3.5 seconds
      const timer = setTimeout(() => {
        overlayOpacity.value = withTiming(0, { duration: 300 }, (finished) => {
          if (finished) {
            runOnJS(onDismiss)();
          }
        });
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [config, overlayOpacity, onDismiss]);

  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
    };
  });

  if (!config) return null;

  const renderContent = () => {
    switch (config.type) {
      case "LEVEL_UP":
        return <LevelUpContent newLevel={config.data?.newLevel ?? 1} />;
      case "BADGE_EARNED":
        return <BadgeEarnedContent badgeName={config.data?.badgeName} />;
      case "STREAK_MILESTONE":
        return <StreakMilestoneContent streakCount={config.data?.streakCount} />;
      case "PERFECT_WEEK":
        return <PerfectWeekContent />;
      default:
        return null;
    }
  };

  return (
    <Modal statusBarTranslucent transparent animationType="none" visible={true}>
      <Animated.View style={[styles.overlay, overlayStyle]}>
        {/* Confetti particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <ConfettiParticle
            key={i}
            color={confettiColors[i % confettiColors.length]}
            index={i}
            startDelay={Math.random() * 500}
          />
        ))}

        {/* Celebration content */}
        {renderContent()}
      </Animated.View>
    </Modal>
  );
}

// ============================================================================
// Celebration Provider
// ============================================================================

interface CelebrationProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that enables celebration animations throughout the app.
 * Wrap your app root with this provider to use the useCelebration hook.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <CelebrationProvider>
 *       <YourApp />
 *     </CelebrationProvider>
 *   );
 * }
 * ```
 */
export function CelebrationProvider({ children }: CelebrationProviderProps) {
  const [currentCelebration, setCurrentCelebration] = useState<CelebrationConfig | null>(null);

  const celebrate = useCallback((config: CelebrationConfig) => {
    // If already showing a celebration, queue this one
    // For simplicity, we just replace the current one
    setCurrentCelebration(config);
  }, []);

  const handleDismiss = useCallback(() => {
    setCurrentCelebration(null);
  }, []);

  const contextValue = useMemo<CelebrationContextValue>(
    () => ({
      celebrate,
      isShowing: currentCelebration !== null,
    }),
    [celebrate, currentCelebration]
  );

  return (
    <CelebrationContext.Provider value={contextValue}>
      {children}
      <CelebrationOverlay config={currentCelebration} onDismiss={handleDismiss} />
    </CelebrationContext.Provider>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Confetti
  confettiParticle: {
    position: "absolute",
    top: -20,
  },

  // Star burst
  starContainer: {
    position: "absolute",
  },
  starEmoji: {
    fontSize: 24,
    color: colors.laurel.amber,
  },

  // Content container
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  // Level Up
  levelBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.laurel.forest,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: colors.laurel.amber,
    shadowColor: colors.laurel.amber,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  levelNumber: {
    fontSize: fontSize["4xl"],
    fontWeight: fontWeight.bold,
    color: colors.laurel.white,
  },

  // Badge
  badgeIconContainer: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  badgeEmoji: {
    fontSize: 80,
  },

  // Streak
  streakIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  fireEmoji: {
    fontSize: 80,
  },
  streakCountBadge: {
    position: "absolute",
    bottom: -10,
    right: -10,
    backgroundColor: colors.laurel.amber,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: colors.laurel.white,
  },
  streakCountText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.laurel.charcoal,
  },

  // Trophy / Perfect Week
  trophyWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  trophyIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  trophyEmoji: {
    fontSize: 80,
  },
  sparkleEmoji: {
    fontSize: 32,
  },

  // Text styles
  congratsText: {
    fontSize: fontSize["3xl"],
    fontWeight: fontWeight.bold,
    color: colors.laurel.white,
    textAlign: "center",
    marginTop: spacing.lg,
    letterSpacing: 2,
  },
  congratsTextGold: {
    fontSize: fontSize["3xl"],
    fontWeight: fontWeight.bold,
    color: "#FFD700", // Gold color
    textAlign: "center",
    marginTop: spacing.lg,
    letterSpacing: 2,
    textShadowColor: "rgba(255, 215, 0, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitleText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    color: colors.laurel.sage,
    textAlign: "center",
    marginTop: spacing.sm,
  },
});

export default CelebrationProvider;
