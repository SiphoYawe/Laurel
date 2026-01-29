import { BookOpen, Brain } from "lucide-react-native";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";

import { colors, borderRadius, shadow, fontSize, fontWeight, spacing } from "../../lib/theme";

/**
 * Deck data interface
 */
export interface Deck {
  id: string;
  name: string;
  cardCount: number;
  masteryPercent: number;
  lastStudied: Date | null;
}

interface DeckCardProps {
  deck: Deck;
  onPress: (deck: Deck) => void;
}

/**
 * DeckCard Component
 *
 * Displays a flashcard deck with name, card count, last studied date,
 * and a mastery progress indicator. Uses sage green tones for learning theme.
 */
export function DeckCard({ deck, onPress }: DeckCardProps) {
  const { name, cardCount, masteryPercent, lastStudied } = deck;

  // Format last studied date
  const formatLastStudied = (date: Date | null): string => {
    if (!date) return "Not yet studied";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Determine mastery level color and label
  const getMasteryInfo = (percent: number) => {
    if (percent >= 80) return { color: colors.laurel.forest, label: "Mastered" };
    if (percent >= 60) return { color: colors.laurel.sage, label: "Learning" };
    if (percent >= 30) return { color: colors.laurel.amber, label: "Growing" };
    return { color: colors.gray[400], label: "New" };
  };

  const masteryInfo = getMasteryInfo(masteryPercent);

  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.container} onPress={() => onPress(deck)}>
      {/* Card Content */}
      <View style={styles.content}>
        {/* Left Section - Icon and Info */}
        <View style={styles.leftSection}>
          {/* Deck Icon */}
          <View style={[styles.iconContainer, { backgroundColor: `${colors.laurel.sage}20` }]}>
            <BookOpen color={colors.laurel.forest} size={22} strokeWidth={2} />
          </View>

          {/* Deck Info */}
          <View style={styles.deckInfo}>
            <Text numberOfLines={1} style={styles.deckName}>
              {name}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.cardCount}>
                {cardCount} {cardCount === 1 ? "card" : "cards"}
              </Text>
              <View style={styles.metaDot} />
              <Text style={styles.lastStudied}>{formatLastStudied(lastStudied)}</Text>
            </View>
          </View>
        </View>

        {/* Right Section - Mastery Indicator */}
        <View style={styles.rightSection}>
          <View style={styles.masteryContainer}>
            {/* Mastery Ring */}
            <View style={styles.masteryRing}>
              <View style={[styles.masteryRingBackground]}>
                <View
                  style={[
                    styles.masteryRingFill,
                    {
                      backgroundColor: masteryInfo.color,
                      width: `${masteryPercent}%`,
                    },
                  ]}
                />
              </View>
              <View style={[styles.masteryInner, { borderColor: masteryInfo.color }]}>
                <Brain color={masteryInfo.color} size={14} strokeWidth={2.5} />
              </View>
            </View>
            {/* Mastery Percentage */}
            <Text style={[styles.masteryPercent, { color: masteryInfo.color }]}>
              {masteryPercent}%
            </Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${masteryPercent}%`,
                backgroundColor: masteryInfo.color,
              },
            ]}
          />
        </View>
        <Text style={[styles.masteryLabel, { color: masteryInfo.color }]}>{masteryInfo.label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.sm,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  deckInfo: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
  },
  deckName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardCount: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.gray[300],
    marginHorizontal: spacing.xs,
  },
  lastStudied: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  rightSection: {
    alignItems: "center",
  },
  masteryContainer: {
    alignItems: "center",
  },
  masteryRing: {
    width: 44,
    height: 44,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  masteryRingBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 22,
    backgroundColor: colors.gray[100],
    overflow: "hidden",
  },
  masteryRingFill: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    opacity: 0.2,
  },
  masteryInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  masteryPercent: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  progressBackground: {
    flex: 1,
    height: 4,
    backgroundColor: colors.gray[100],
    borderRadius: 2,
    overflow: "hidden",
    marginRight: spacing.sm,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  masteryLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    minWidth: 56,
    textAlign: "right",
  },
});

export default DeckCard;
