import {
  Flame,
  Target,
  BookOpen,
  Users,
  Award,
  Sparkles,
  Lock,
  X,
  Calendar,
  Brain,
  Heart,
  Layers,
} from "lucide-react-native";
import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  FadeIn,
  FadeOut,
  SlideInUp,
} from "react-native-reanimated";

import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from "../../lib/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BADGE_SIZE = 64;
const BADGE_CONTAINER_SIZE = 80;
const BADGES_PER_ROW = 4;
const GRID_GAP =
  (SCREEN_WIDTH - spacing.lg * 2 - BADGE_CONTAINER_SIZE * BADGES_PER_ROW) / (BADGES_PER_ROW - 1);

/**
 * Badge category types
 */
export type BadgeCategory = "streak" | "habit" | "learning" | "social" | "special";

/**
 * Badge data structure
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  howToEarn: string;
  category: BadgeCategory;
  icon: keyof typeof badgeIcons;
  isEarned: boolean;
  earnedAt?: Date;
  progress?: number; // 0-100 percentage for unearned badges
  progressText?: string; // e.g., "5/7 days"
}

/**
 * Badge icon mapping
 */
const badgeIcons = {
  flame: Flame,
  target: Target,
  bookOpen: BookOpen,
  users: Users,
  award: Award,
  sparkles: Sparkles,
  calendar: Calendar,
  brain: Brain,
  heart: Heart,
  layers: Layers,
};

/**
 * Category color mapping
 */
const categoryColors: Record<BadgeCategory, { primary: string; secondary: string; glow: string }> =
  {
    streak: {
      primary: "#FF6B35", // Warm orange-red for fire/streaks
      secondary: "#FFB088",
      glow: "rgba(255, 107, 53, 0.4)",
    },
    habit: {
      primary: colors.laurel.forest,
      secondary: colors.laurel.sage,
      glow: "rgba(45, 90, 61, 0.4)",
    },
    learning: {
      primary: "#6366F1", // Indigo for wisdom/learning
      secondary: "#A5B4FC",
      glow: "rgba(99, 102, 241, 0.4)",
    },
    social: {
      primary: "#8B5CF6", // Purple for community
      secondary: "#C4B5FD",
      glow: "rgba(139, 92, 246, 0.4)",
    },
    special: {
      primary: colors.laurel.amber, // Gold for special achievements
      secondary: "#FCD34D",
      glow: "rgba(232, 165, 75, 0.5)",
    },
  };

/**
 * Default badges for the showcase
 */
export const defaultBadges: Badge[] = [
  // Streak badges
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Maintained a 7-day streak",
    howToEarn: "Complete any habit for 7 consecutive days",
    category: "streak",
    icon: "flame",
    isEarned: false,
    progress: 71,
    progressText: "5/7 days",
  },
  {
    id: "streak-30",
    name: "Monthly Master",
    description: "Maintained a 30-day streak",
    howToEarn: "Complete any habit for 30 consecutive days",
    category: "streak",
    icon: "calendar",
    isEarned: false,
    progress: 23,
    progressText: "7/30 days",
  },
  {
    id: "streak-100",
    name: "Century Club",
    description: "Maintained a 100-day streak",
    howToEarn: "Complete any habit for 100 consecutive days",
    category: "streak",
    icon: "award",
    isEarned: false,
    progress: 7,
    progressText: "7/100 days",
  },
  // Habit badges
  {
    id: "habit-first",
    name: "First Step",
    description: "Created your first habit",
    howToEarn: "Create your very first habit",
    category: "habit",
    icon: "target",
    isEarned: true,
    earnedAt: new Date("2024-01-15"),
  },
  {
    id: "habit-5",
    name: "Habit Builder",
    description: "Created 5 habits",
    howToEarn: "Create 5 different habits",
    category: "habit",
    icon: "layers",
    isEarned: false,
    progress: 60,
    progressText: "3/5 habits",
  },
  {
    id: "habit-10",
    name: "Habit Master",
    description: "Created 10 habits",
    howToEarn: "Create 10 different habits",
    category: "habit",
    icon: "sparkles",
    isEarned: false,
    progress: 30,
    progressText: "3/10 habits",
  },
  // Learning badges
  {
    id: "learn-first-deck",
    name: "Scholar",
    description: "Created your first flashcard deck",
    howToEarn: "Create your first flashcard deck",
    category: "learning",
    icon: "bookOpen",
    isEarned: true,
    earnedAt: new Date("2024-01-16"),
  },
  {
    id: "learn-100-reviews",
    name: "Knowledge Seeker",
    description: "Completed 100 flashcard reviews",
    howToEarn: "Review flashcards 100 times",
    category: "learning",
    icon: "brain",
    isEarned: false,
    progress: 45,
    progressText: "45/100 reviews",
  },
  // Social badges
  {
    id: "social-first-pod",
    name: "Community Member",
    description: "Joined your first pod",
    howToEarn: "Join your first accountability pod",
    category: "social",
    icon: "users",
    isEarned: false,
    progress: 0,
    progressText: "Join a pod",
  },
  {
    id: "social-helped-5",
    name: "Helping Hand",
    description: "Helped 5 pod members",
    howToEarn: "Send encouraging messages to 5 different pod members",
    category: "social",
    icon: "heart",
    isEarned: false,
    progress: 0,
    progressText: "0/5 members helped",
  },
  // Special badges
  {
    id: "special-early-adopter",
    name: "Early Adopter",
    description: "Joined Laurel in its early days",
    howToEarn: "Be one of the first users to join Laurel",
    category: "special",
    icon: "sparkles",
    isEarned: true,
    earnedAt: new Date("2024-01-01"),
  },
  {
    id: "special-perfect-week",
    name: "Perfect Week",
    description: "Completed all habits for an entire week",
    howToEarn: "Complete every single habit for 7 consecutive days",
    category: "special",
    icon: "award",
    isEarned: false,
    progress: 57,
    progressText: "4/7 perfect days",
  },
];

/**
 * BadgeShowcase Props
 */
export interface BadgeShowcaseProps {
  badges?: Badge[];
  title?: string;
  showTitle?: boolean;
}

/**
 * Individual Badge Component
 */
interface BadgeItemProps {
  badge: Badge;
  onPress: (badge: Badge) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function BadgeItem({ badge, onPress }: BadgeItemProps) {
  const scale = useSharedValue(1);
  const categoryColor = categoryColors[badge.category];
  const IconComponent = badgeIcons[badge.icon];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  return (
    <AnimatedPressable
      style={[styles.badgeContainer, animatedStyle]}
      onPress={() => onPress(badge)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View
        style={[
          styles.badge,
          badge.isEarned
            ? {
                backgroundColor: categoryColor.primary,
                shadowColor: categoryColor.glow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 12,
                elevation: 8,
              }
            : styles.badgeUnearned,
        ]}
      >
        <IconComponent
          color={badge.isEarned ? colors.laurel.white : colors.gray[400]}
          size={28}
          strokeWidth={2}
        />
        {!badge.isEarned && (
          <View style={styles.lockOverlay}>
            <Lock color={colors.gray[500]} size={14} strokeWidth={2.5} />
          </View>
        )}
      </View>
      <Text
        numberOfLines={2}
        style={[styles.badgeName, !badge.isEarned && styles.badgeNameUnearned]}
      >
        {badge.name}
      </Text>
    </AnimatedPressable>
  );
}

/**
 * Badge Detail Modal Component
 */
interface BadgeModalProps {
  badge: Badge | null;
  visible: boolean;
  onClose: () => void;
}

function BadgeModal({ badge, visible, onClose }: BadgeModalProps) {
  if (!badge) return null;

  const categoryColor = categoryColors[badge.category];
  const IconComponent = badgeIcons[badge.icon];

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Animated.View entering={SlideInUp.springify().damping(15)} style={styles.modalContent}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            {/* Close button */}
            <Pressable style={styles.closeButton} onPress={onClose}>
              <X color={colors.gray[500]} size={20} />
            </Pressable>

            {/* Badge icon */}
            <View
              style={[
                styles.modalBadge,
                badge.isEarned
                  ? {
                      backgroundColor: categoryColor.primary,
                      shadowColor: categoryColor.glow,
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 1,
                      shadowRadius: 16,
                      elevation: 10,
                    }
                  : styles.modalBadgeUnearned,
              ]}
            >
              <IconComponent
                color={badge.isEarned ? colors.laurel.white : colors.gray[400]}
                size={40}
                strokeWidth={1.5}
              />
              {!badge.isEarned && (
                <View style={styles.modalLockOverlay}>
                  <Lock color={colors.gray[500]} size={18} strokeWidth={2.5} />
                </View>
              )}
            </View>

            {/* Badge name */}
            <Text style={styles.modalTitle}>{badge.name}</Text>

            {/* Badge category */}
            <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor.primary}15` }]}>
              <Text style={[styles.categoryText, { color: categoryColor.primary }]}>
                {badge.category.charAt(0).toUpperCase() + badge.category.slice(1)}
              </Text>
            </View>

            {/* Badge description */}
            <Text style={styles.modalDescription}>{badge.description}</Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* How to earn */}
            <Text style={styles.howToEarnLabel}>
              {badge.isEarned ? "How you earned it" : "How to earn"}
            </Text>
            <Text style={styles.howToEarnText}>{badge.howToEarn}</Text>

            {/* Progress bar for unearned badges */}
            {!badge.isEarned && badge.progress !== undefined && (
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Progress</Text>
                  <Text style={styles.progressText}>{badge.progressText}</Text>
                </View>
                <View style={styles.progressBarBackground}>
                  <Animated.View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${badge.progress}%`,
                        backgroundColor: categoryColor.primary,
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            {/* Earned date */}
            {badge.isEarned && badge.earnedAt && (
              <View style={styles.earnedSection}>
                <Award color={categoryColor.primary} size={16} />
                <Text style={styles.earnedText}>
                  Earned on{" "}
                  {badge.earnedAt.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>
            )}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

/**
 * BadgeShowcase Component
 *
 * Displays a grid of badges showing earned and unearned achievements.
 * Earned badges are shown in full color with a glow effect.
 * Unearned badges are shown in grayscale with a lock icon.
 * Tapping a badge opens a modal with details and progress.
 */
export function BadgeShowcase({
  badges = defaultBadges,
  title = "Achievements",
  showTitle = true,
}: BadgeShowcaseProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleBadgePress = useCallback((badge: Badge) => {
    setSelectedBadge(badge);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    // Delay clearing badge to allow exit animation
    setTimeout(() => setSelectedBadge(null), 200);
  }, []);

  const earnedCount = badges.filter((b) => b.isEarned).length;
  const totalCount = badges.length;

  return (
    <View style={styles.container}>
      {showTitle && (
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Award color={colors.laurel.forest} size={22} />
            <Text style={styles.title}>{title}</Text>
          </View>
          <Text style={styles.subtitle}>
            {earnedCount} of {totalCount} earned
          </Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {badges.map((badge, index) => (
          <Animated.View key={badge.id} entering={FadeIn.delay(index * 50).duration(300)}>
            <BadgeItem badge={badge} onPress={handleBadgePress} />
          </Animated.View>
        ))}
      </ScrollView>

      <BadgeModal badge={selectedBadge} visible={modalVisible} onClose={handleCloseModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    marginLeft: spacing.sm + 22, // Align with title text after icon
  },
  scrollView: {
    flex: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: GRID_GAP > 0 ? GRID_GAP : spacing.sm,
  },
  badgeContainer: {
    width: BADGE_CONTAINER_SIZE,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  badgeUnearned: {
    backgroundColor: colors.gray[100],
    borderWidth: 2,
    borderColor: colors.gray[200],
    borderStyle: "dashed",
  },
  lockOverlay: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  badgeName: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
    textAlign: "center",
    lineHeight: fontSize.xs * 1.3,
  },
  badgeNameUnearned: {
    color: colors.gray[400],
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    ...shadow.lg,
  },
  closeButton: {
    position: "absolute",
    top: -spacing.sm,
    right: -spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[100],
    alignItems: "center",
    justifyContent: "center",
  },
  modalBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  modalBadgeUnearned: {
    backgroundColor: colors.gray[100],
    borderWidth: 3,
    borderColor: colors.gray[200],
    borderStyle: "dashed",
  },
  modalLockOverlay: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.gray[200],
  },
  modalTitle: {
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  categoryText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalDescription: {
    fontSize: fontSize.base,
    color: colors.mutedForeground,
    textAlign: "center",
    lineHeight: fontSize.base * 1.5,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  howToEarnLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  howToEarnText: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    textAlign: "center",
    lineHeight: fontSize.sm * 1.5,
  },
  progressSection: {
    width: "100%",
    marginTop: spacing.md,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
  },
  progressText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.mutedForeground,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[200],
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: borderRadius.full,
  },
  earnedSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  earnedText: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
});

export default BadgeShowcase;
