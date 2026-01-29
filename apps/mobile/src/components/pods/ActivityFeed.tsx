import { CheckCircle, Award, TrendingUp, Users, Activity } from "lucide-react-native";
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

import { colors, borderRadius, spacing, fontSize, fontWeight, shadow } from "../../lib/theme";

import type { ListRenderItem } from "react-native";

/**
 * Activity types for the feed
 */
export type ActivityType = "habit_completed" | "badge_earned" | "level_up" | "joined_pod";

/**
 * Activity item data
 */
export interface ActivityItem {
  id: string;
  type: ActivityType;
  memberId: string;
  memberName: string;
  memberAvatarUrl?: string;
  timestamp: Date;
  metadata?: {
    habitName?: string;
    badgeName?: string;
    newLevel?: number;
    podName?: string;
  };
}

/**
 * ActivityFeed component props
 */
interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
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
 * Format relative timestamp (e.g., "5m ago", "2h ago", "3d ago")
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return "just now";
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Get activity icon and color based on type
 */
function getActivityStyle(type: ActivityType) {
  switch (type) {
    case "habit_completed":
      return {
        icon: CheckCircle,
        color: colors.laurel.forest,
        bgColor: `${colors.laurel.forest}15`,
      };
    case "badge_earned":
      return {
        icon: Award,
        color: colors.laurel.amber,
        bgColor: `${colors.laurel.amber}15`,
      };
    case "level_up":
      return {
        icon: TrendingUp,
        color: colors.success.DEFAULT,
        bgColor: `${colors.success.DEFAULT}15`,
      };
    case "joined_pod":
      return {
        icon: Users,
        color: colors.laurel.sage,
        bgColor: `${colors.laurel.sage}15`,
      };
    default:
      return {
        icon: Activity,
        color: colors.gray[500],
        bgColor: colors.gray[100],
      };
  }
}

/**
 * Generate activity description text
 */
function getActivityDescription(activity: ActivityItem): string {
  const firstName = activity.memberName.split(" ")[0];
  switch (activity.type) {
    case "habit_completed":
      return `${firstName} completed "${activity.metadata?.habitName || "a habit"}"`;
    case "badge_earned":
      return `${firstName} earned the "${activity.metadata?.badgeName || "a badge"}" badge`;
    case "level_up":
      return `${firstName} reached level ${activity.metadata?.newLevel || "?"}`;
    case "joined_pod":
      return `${firstName} joined ${activity.metadata?.podName || "the pod"}`;
    default:
      return `${firstName} performed an action`;
  }
}

/**
 * ActivityCard - Individual activity item
 */
function ActivityCard({ activity }: { activity: ActivityItem }) {
  const initials = getInitials(activity.memberName);
  const avatarColor = getAvatarColor(activity.memberName);
  const { icon: Icon, color, bgColor } = getActivityStyle(activity.type);
  const description = getActivityDescription(activity);
  const relativeTime = formatRelativeTime(activity.timestamp);

  return (
    <View style={styles.cardContainer}>
      {/* Left: Avatar with activity icon overlay */}
      <View style={styles.avatarSection}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={[styles.activityIconBadge, { backgroundColor: bgColor }]}>
          <Icon color={color} size={10} />
        </View>
      </View>

      {/* Center: Description */}
      <View style={styles.contentSection}>
        <Text numberOfLines={2} style={styles.description}>
          {description}
        </Text>
        <Text style={styles.timestamp}>{relativeTime}</Text>
      </View>

      {/* Right: Activity type icon */}
      <View style={[styles.typeIcon, { backgroundColor: bgColor }]}>
        <Icon color={color} size={16} />
      </View>
    </View>
  );
}

/**
 * ActivityFeed Component
 *
 * Displays a vertical list of recent activities in the pod.
 * Activities include habit completions, badge earnings, level ups, and new members.
 * Each item shows member avatar, action description, and relative timestamp.
 */
export function ActivityFeed({ activities, maxItems = 10 }: ActivityFeedProps) {
  // Sort by timestamp (most recent first) and limit
  const sortedActivities = [...activities]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, maxItems);

  const renderItem: ListRenderItem<ActivityItem> = ({ item }) => <ActivityCard activity={item} />;

  if (activities.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Activity color={colors.gray[400]} size={32} />
        <Text style={styles.emptyTitle}>No activity yet</Text>
        <Text style={styles.emptyText}>Pod member activities will appear here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Activity color={colors.laurel.forest} size={18} />
        <Text style={styles.headerTitle}>Recent Activity</Text>
      </View>

      <FlatList
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        data={sortedActivities}
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
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  avatarSection: {
    position: "relative",
    marginRight: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.laurel.white,
  },
  activityIconBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  contentSection: {
    flex: 1,
    marginRight: spacing.sm,
  },
  description: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
    lineHeight: 18,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
    color: colors.mutedForeground,
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 52,
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

export default ActivityFeed;
