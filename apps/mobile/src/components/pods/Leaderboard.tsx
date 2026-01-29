import { Trophy, TrendingUp, TrendingDown, Minus, Zap } from "lucide-react-native";
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

import { colors, borderRadius, spacing, fontSize, fontWeight, shadow } from "../../lib/theme";

import type { ListRenderItem } from "react-native";

/**
 * Leaderboard member data
 */
export interface LeaderboardMember {
  id: string;
  name: string;
  avatarUrl?: string;
  xp: number;
  streak: number;
  rankChange: number; // positive = moved up, negative = moved down, 0 = no change
  isCurrentUser?: boolean;
}

/**
 * Leaderboard component props
 */
interface LeaderboardProps {
  members: LeaderboardMember[];
  sortBy?: "xp" | "streak";
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
 * Medal colors for top 3 positions
 */
const MEDAL_COLORS = {
  gold: colors.laurel.amber,
  silver: "#C0C0C0",
  bronze: "#CD7F32",
};

/**
 * RankBadge - Shows position with medal icons for top 3
 */
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <View style={[styles.rankBadge, { backgroundColor: `${MEDAL_COLORS.gold}20` }]}>
        <Trophy color={MEDAL_COLORS.gold} fill={MEDAL_COLORS.gold} size={16} />
      </View>
    );
  }
  if (rank === 2) {
    return (
      <View style={[styles.rankBadge, { backgroundColor: `${MEDAL_COLORS.silver}20` }]}>
        <Trophy color={MEDAL_COLORS.silver} fill={MEDAL_COLORS.silver} size={16} />
      </View>
    );
  }
  if (rank === 3) {
    return (
      <View style={[styles.rankBadge, { backgroundColor: `${MEDAL_COLORS.bronze}20` }]}>
        <Trophy color={MEDAL_COLORS.bronze} fill={MEDAL_COLORS.bronze} size={16} />
      </View>
    );
  }
  return (
    <View style={styles.rankBadge}>
      <Text style={styles.rankNumber}>{rank}</Text>
    </View>
  );
}

/**
 * RankChangeIndicator - Shows rank movement from last week
 */
function RankChangeIndicator({ change }: { change: number }) {
  if (change > 0) {
    return (
      <View style={[styles.rankChange, styles.rankUp]}>
        <TrendingUp color={colors.success.DEFAULT} size={12} />
        <Text style={[styles.rankChangeText, { color: colors.success.DEFAULT }]}>+{change}</Text>
      </View>
    );
  }
  if (change < 0) {
    return (
      <View style={[styles.rankChange, styles.rankDown]}>
        <TrendingDown color={colors.error.DEFAULT} size={12} />
        <Text style={[styles.rankChangeText, { color: colors.error.DEFAULT }]}>{change}</Text>
      </View>
    );
  }
  return (
    <View style={styles.rankChange}>
      <Minus color={colors.gray[400]} size={12} />
    </View>
  );
}

/**
 * LeaderboardItem - Individual row in the leaderboard
 */
function LeaderboardItem({ member, rank }: { member: LeaderboardMember; rank: number }) {
  const initials = getInitials(member.name);
  const backgroundColor = getAvatarColor(member.name);

  return (
    <View style={[styles.itemContainer, member.isCurrentUser && styles.currentUserItem]}>
      {/* Rank */}
      <RankBadge rank={rank} />

      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor }]}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      {/* Name and stats */}
      <View style={styles.memberInfo}>
        <Text
          numberOfLines={1}
          style={[styles.memberName, member.isCurrentUser && styles.currentUserName]}
        >
          {member.name}
          {member.isCurrentUser && " (You)"}
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Zap color={colors.laurel.amber} fill={colors.laurel.amber} size={12} />
            <Text style={styles.statText}>{member.xp.toLocaleString()} XP</Text>
          </View>
          <View style={styles.statDivider} />
          <Text style={styles.statText}>{member.streak} day streak</Text>
        </View>
      </View>

      {/* Rank change */}
      <RankChangeIndicator change={member.rankChange} />
    </View>
  );
}

/**
 * Leaderboard Component
 *
 * Displays a ranked list of pod members by XP or streaks.
 * Top 3 positions show medal icons (gold, silver, bronze).
 * Current user is highlighted, and rank changes from last week are shown.
 */
export function Leaderboard({ members, sortBy = "xp" }: LeaderboardProps) {
  // Sort members by the selected metric
  const sortedMembers = [...members].sort((a, b) => {
    if (sortBy === "streak") {
      return b.streak - a.streak;
    }
    return b.xp - a.xp;
  });

  const renderItem: ListRenderItem<LeaderboardMember> = ({ item, index }) => (
    <LeaderboardItem member={item} rank={index + 1} />
  );

  if (members.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Trophy color={colors.gray[400]} size={32} />
        <Text style={styles.emptyTitle}>No rankings yet</Text>
        <Text style={styles.emptyText}>Complete habits to earn XP and climb the leaderboard</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Trophy color={colors.laurel.amber} fill={colors.laurel.amber} size={18} />
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Text style={styles.headerSubtitle}>by {sortBy === "xp" ? "XP" : "Streak"}</Text>
      </View>

      <FlatList
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        data={sortedMembers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        scrollEnabled={false}
      />
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
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    flex: 1,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.mutedForeground,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
  },
  currentUserItem: {
    backgroundColor: `${colors.laurel.forest}10`,
    marginHorizontal: -spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.muted,
    marginRight: spacing.sm,
  },
  rankNumber: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.mutedForeground,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  avatarText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.laurel.white,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: 2,
  },
  currentUserName: {
    color: colors.laurel.forest,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.mutedForeground,
  },
  statDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray[300],
    marginHorizontal: spacing.sm,
  },
  rankChange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    minWidth: 40,
    justifyContent: "flex-end",
  },
  rankUp: {
    backgroundColor: `${colors.success.DEFAULT}15`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  rankDown: {
    backgroundColor: `${colors.error.DEFAULT}15`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  rankChangeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  emptyContainer: {
    backgroundColor: colors.muted,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.mutedForeground,
    textAlign: "center",
  },
});

export default Leaderboard;
