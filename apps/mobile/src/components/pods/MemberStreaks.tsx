import { Flame, Crown } from "lucide-react-native";
import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

import { colors, borderRadius, spacing, fontSize, fontWeight, shadow } from "../../lib/theme";

/**
 * Member with streak data
 */
export interface MemberStreak {
  id: string;
  name: string;
  avatarUrl?: string;
  currentStreak: number;
}

/**
 * MemberStreaks component props
 */
interface MemberStreaksProps {
  members: MemberStreak[];
  onMemberPress?: (member: MemberStreak) => void;
}

/**
 * Get initials from a name (max 2 characters)
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Generate a consistent color based on name for avatar backgrounds
 */
function getAvatarColor(name: string): string {
  const avatarColors = [
    colors.laurel.forest,
    colors.laurel.sage,
    colors.laurel.forestLight,
    colors.laurel.forestDark,
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return avatarColors[Math.abs(hash) % avatarColors.length];
}

/**
 * Get streak color based on streak count
 */
function getStreakColor(streak: number): string {
  if (streak >= 30) return colors.laurel.amber;
  if (streak >= 14) return colors.laurel.forest;
  if (streak >= 7) return colors.laurel.sage;
  return colors.gray[400];
}

/**
 * StreakAvatar - Individual member avatar with streak badge
 */
function StreakAvatar({
  member,
  isTopStreak,
  onPress,
}: {
  member: MemberStreak;
  isTopStreak: boolean;
  onPress?: () => void;
}) {
  const initials = getInitials(member.name);
  const backgroundColor = getAvatarColor(member.name);
  const streakColor = getStreakColor(member.currentStreak);

  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.avatarContainer} onPress={onPress}>
      {/* Crown for top streak */}
      {isTopStreak && (
        <View style={styles.crownContainer}>
          <Crown color={colors.laurel.amber} fill={colors.laurel.amber} size={16} />
        </View>
      )}

      {/* Avatar circle */}
      <View style={[styles.avatar, { backgroundColor }, isTopStreak && styles.topStreakAvatar]}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      {/* Streak badge */}
      <View style={[styles.streakBadge, { backgroundColor: streakColor }]}>
        <Flame color={colors.laurel.white} fill={colors.laurel.white} size={10} />
        <Text style={styles.streakCount}>{member.currentStreak}</Text>
      </View>

      {/* Member name */}
      <Text numberOfLines={1} style={styles.memberName}>
        {member.name.split(" ")[0]}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * MemberStreaks Component
 *
 * Horizontal scrollable list of member avatars with streak counts.
 * Highlights the member with the longest streak with a crown icon.
 */
export function MemberStreaks({ members, onMemberPress }: MemberStreaksProps) {
  // Find the member with the longest streak
  const maxStreak = Math.max(...members.map((m) => m.currentStreak));
  const topStreakMemberIds = members
    .filter((m) => m.currentStreak === maxStreak && maxStreak > 0)
    .map((m) => m.id);

  // Sort by streak (highest first)
  const sortedMembers = [...members].sort((a, b) => b.currentStreak - a.currentStreak);

  if (members.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Flame color={colors.gray[400]} size={24} />
        <Text style={styles.emptyText}>No streaks yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Flame color={colors.laurel.amber} fill={colors.laurel.amber} size={18} />
        <Text style={styles.headerTitle}>Member Streaks</Text>
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
      >
        {sortedMembers.map((member) => (
          <StreakAvatar
            key={member.id}
            isTopStreak={topStreakMemberIds.includes(member.id)}
            member={member}
            onPress={() => onMemberPress?.(member)}
          />
        ))}
      </ScrollView>
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
    ...shadow.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
  },
  scrollContent: {
    paddingRight: spacing.md,
    gap: spacing.md,
  },
  avatarContainer: {
    alignItems: "center",
    width: 68,
    position: "relative",
  },
  crownContainer: {
    position: "absolute",
    top: -8,
    zIndex: 10,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  topStreakAvatar: {
    borderWidth: 3,
    borderColor: colors.laurel.amber,
  },
  avatarText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.laurel.white,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    position: "absolute",
    bottom: 22,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    ...shadow.sm,
  },
  streakCount: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.laurel.white,
  },
  memberName: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.mutedForeground,
    marginTop: spacing.xs,
    textAlign: "center",
    width: "100%",
  },
  emptyContainer: {
    backgroundColor: colors.muted,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.mutedForeground,
  },
});

export default MemberStreaks;
