import { ChevronUp, ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useCallback } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  runOnJS,
  Easing,
} from "react-native-reanimated";

import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from "../../lib/theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Swipe thresholds
const SWIPE_THRESHOLD_X = SCREEN_WIDTH * 0.25;
const SWIPE_THRESHOLD_Y = SCREEN_HEIGHT * 0.15;
const FLIP_DURATION = 400;

/**
 * FlashCard component props
 */
export interface FlashCardProps {
  front: string;
  back: string;
  cardNumber: number;
  totalCards: number;
  onSwipeLeft: () => void; // Wrong
  onSwipeRight: () => void; // Correct
  onSwipeUp: () => void; // Skip
}

/**
 * Parse basic markdown formatting (bold and italic)
 */
function parseMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const remaining = text;
  let key = 0;

  // Pattern to match **bold**, *italic*, or __bold__, _italic_
  const regex = /(\*\*|__)(.+?)\1|(\*|_)(.+?)\3/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(<Text key={key++}>{text.slice(lastIndex, match.index)}</Text>);
    }

    // Add formatted text
    if (match[1]) {
      // Bold (**text** or __text__)
      parts.push(
        <Text key={key++} style={styles.boldText}>
          {match[2]}
        </Text>
      );
    } else if (match[3]) {
      // Italic (*text* or _text_)
      parts.push(
        <Text key={key++} style={styles.italicText}>
          {match[4]}
        </Text>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(<Text key={key++}>{text.slice(lastIndex)}</Text>);
  }

  return parts.length > 0 ? parts : [<Text key={0}>{text}</Text>];
}

/**
 * FlashCard Component
 *
 * A flashcard with 3D flip animation and swipe gestures.
 * - Tap to flip between front (question) and back (answer)
 * - Swipe left for wrong answer
 * - Swipe right for correct answer
 * - Swipe up to skip
 */
export function FlashCard({
  front,
  back,
  cardNumber,
  totalCards,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
}: FlashCardProps) {
  // Animation values
  const isFlipped = useSharedValue(false);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const cardOpacity = useSharedValue(1);

  // Reset card state
  const resetCard = useCallback(() => {
    translateX.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(0, { duration: 200 });
    cardOpacity.value = withTiming(1, { duration: 200 });
    isFlipped.value = false;
  }, [translateX, translateY, cardOpacity, isFlipped]);

  // Handle flip
  const handleFlip = useCallback(() => {
    isFlipped.value = !isFlipped.value;
  }, [isFlipped]);

  // Handle swipe completion with runOnJS
  const handleSwipeComplete = useCallback(
    (direction: "left" | "right" | "up") => {
      if (direction === "left") {
        onSwipeLeft();
      } else if (direction === "right") {
        onSwipeRight();
      } else {
        onSwipeUp();
      }
      // Reset after callback
      resetCard();
    },
    [onSwipeLeft, onSwipeRight, onSwipeUp, resetCard]
  );

  // Pan gesture for swipe detection
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      const { translationX, translationY, velocityX, velocityY } = event;

      // Check for vertical swipe (up) first
      if (translationY < -SWIPE_THRESHOLD_Y || (velocityY < -500 && translationY < -30)) {
        // Swipe up - Skip
        translateY.value = withTiming(
          -SCREEN_HEIGHT,
          { duration: 300, easing: Easing.out(Easing.cubic) },
          () => {
            runOnJS(handleSwipeComplete)("up");
          }
        );
        cardOpacity.value = withTiming(0, { duration: 300 });
        return;
      }

      // Check for horizontal swipe
      if (translationX < -SWIPE_THRESHOLD_X || (velocityX < -500 && translationX < -30)) {
        // Swipe left - Wrong
        translateX.value = withTiming(
          -SCREEN_WIDTH,
          { duration: 300, easing: Easing.out(Easing.cubic) },
          () => {
            runOnJS(handleSwipeComplete)("left");
          }
        );
        cardOpacity.value = withTiming(0, { duration: 300 });
        return;
      }

      if (translationX > SWIPE_THRESHOLD_X || (velocityX > 500 && translationX > 30)) {
        // Swipe right - Correct
        translateX.value = withTiming(
          SCREEN_WIDTH,
          { duration: 300, easing: Easing.out(Easing.cubic) },
          () => {
            runOnJS(handleSwipeComplete)("right");
          }
        );
        cardOpacity.value = withTiming(0, { duration: 300 });
        return;
      }

      // Return to center if swipe not completed
      translateX.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(0, { duration: 200 });
    });

  // Tap gesture for flip
  const tapGesture = Gesture.Tap().onEnd(() => {
    runOnJS(handleFlip)();
  });

  // Combine gestures - pan takes priority
  const composedGesture = Gesture.Race(panGesture, tapGesture);

  // Front card animated style
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [0, 180]);
    const rotateValue = withTiming(`${spinValue}deg`, {
      duration: FLIP_DURATION,
      easing: Easing.inOut(Easing.cubic),
    });

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateY: rotateValue },
      ],
      opacity: cardOpacity.value,
      backfaceVisibility: "hidden" as const,
    };
  });

  // Back card animated style
  const backAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [180, 360]);
    const rotateValue = withTiming(`${spinValue}deg`, {
      duration: FLIP_DURATION,
      easing: Easing.inOut(Easing.cubic),
    });

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateY: rotateValue },
      ],
      opacity: cardOpacity.value,
      backfaceVisibility: "hidden" as const,
    };
  });

  // Swipe indicator animated styles
  const leftIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [-SWIPE_THRESHOLD_X, -50, 0], [1, 0.5, 0]);
    return { opacity };
  });

  const rightIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [0, 50, SWIPE_THRESHOLD_X], [0, 0.5, 1]);
    return { opacity };
  });

  const upIndicatorStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateY.value, [-SWIPE_THRESHOLD_Y, -30, 0], [1, 0.5, 0]);
    return { opacity };
  });

  return (
    <View style={styles.container}>
      {/* Card number indicator */}
      <View style={styles.cardCountContainer}>
        <Text style={styles.cardCountText}>
          {cardNumber} of {totalCards}
        </Text>
      </View>

      {/* Swipe indicators */}
      <Animated.View style={[styles.swipeIndicator, styles.swipeIndicatorLeft, leftIndicatorStyle]}>
        <View style={[styles.swipeIndicatorIcon, styles.swipeIndicatorWrong]}>
          <ChevronLeft color={colors.error.DEFAULT} size={24} strokeWidth={2.5} />
        </View>
        <Text style={[styles.swipeIndicatorText, { color: colors.error.DEFAULT }]}>Wrong</Text>
      </Animated.View>

      <Animated.View
        style={[styles.swipeIndicator, styles.swipeIndicatorRight, rightIndicatorStyle]}
      >
        <View style={[styles.swipeIndicatorIcon, styles.swipeIndicatorCorrect]}>
          <ChevronRight color={colors.success.DEFAULT} size={24} strokeWidth={2.5} />
        </View>
        <Text style={[styles.swipeIndicatorText, { color: colors.success.DEFAULT }]}>Correct</Text>
      </Animated.View>

      <Animated.View style={[styles.swipeIndicator, styles.swipeIndicatorUp, upIndicatorStyle]}>
        <View style={[styles.swipeIndicatorIcon, styles.swipeIndicatorSkip]}>
          <ChevronUp color={colors.gray[500]} size={24} strokeWidth={2.5} />
        </View>
        <Text style={[styles.swipeIndicatorText, { color: colors.gray[500] }]}>Skip</Text>
      </Animated.View>

      {/* Card container */}
      <GestureDetector gesture={composedGesture}>
        <View style={styles.cardContainer}>
          {/* Front of card (Question) */}
          <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
            <View style={styles.cardContent}>
              <View style={styles.cardLabel}>
                <Text style={styles.cardLabelText}>Question</Text>
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardText}>{parseMarkdown(front)}</Text>
              </View>
              <View style={styles.tapHint}>
                <Text style={styles.tapHintText}>Tap to reveal answer</Text>
              </View>
            </View>
          </Animated.View>

          {/* Back of card (Answer) */}
          <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
            <View style={styles.cardContent}>
              <View style={styles.cardLabel}>
                <Text style={styles.cardLabelText}>Answer</Text>
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardText}>{parseMarkdown(back)}</Text>
              </View>
              <View style={styles.swipeHint}>
                <Text style={styles.swipeHintText}>
                  Swipe: Left = Wrong, Right = Correct, Up = Skip
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  cardCountContainer: {
    position: "absolute",
    top: spacing.lg,
    alignSelf: "center",
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  cardCountText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.gray[600],
  },
  cardContainer: {
    width: SCREEN_WIDTH - spacing.lg * 2,
    height: SCREEN_HEIGHT * 0.55,
    position: "relative",
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: colors.background,
    borderRadius: 16,
    ...shadow.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardFront: {
    zIndex: 1,
  },
  cardBack: {
    zIndex: 0,
  },
  cardContent: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "space-between",
  },
  cardLabel: {
    alignSelf: "flex-start",
    backgroundColor: `${colors.laurel.forest}15`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  cardLabelText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.laurel.forest,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
  },
  cardText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
    textAlign: "center",
    lineHeight: fontSize.xl * 1.5,
  },
  boldText: {
    fontWeight: fontWeight.bold,
  },
  italicText: {
    fontStyle: "italic",
  },
  tapHint: {
    alignItems: "center",
    paddingTop: spacing.md,
  },
  tapHintText: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  swipeHint: {
    alignItems: "center",
    paddingTop: spacing.md,
  },
  swipeHintText: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    textAlign: "center",
  },
  swipeIndicator: {
    position: "absolute",
    alignItems: "center",
    zIndex: 10,
  },
  swipeIndicatorLeft: {
    left: spacing.lg,
    top: "50%",
    transform: [{ translateY: -30 }],
  },
  swipeIndicatorRight: {
    right: spacing.lg,
    top: "50%",
    transform: [{ translateY: -30 }],
  },
  swipeIndicatorUp: {
    top: spacing.xl + 40,
    alignSelf: "center",
  },
  swipeIndicatorIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  swipeIndicatorWrong: {
    backgroundColor: colors.error.light,
  },
  swipeIndicatorCorrect: {
    backgroundColor: colors.success.light,
  },
  swipeIndicatorSkip: {
    backgroundColor: colors.gray[200],
  },
  swipeIndicatorText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
});

export default FlashCard;
