import { Users, ChevronRight } from "lucide-react-native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { colors, borderRadius, shadow, spacing, fontSize, fontWeight } from "../../lib/theme";

/**
 * Pod member type for avatar display
 */
export interface PodMember {
  id: string;
  name: string;
  avatarUrl?: string;
}

/**
 * Pod data structure
 */
export interface Pod {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  members: PodMember[];
}

/**
 * PodCard component props
 */
interface PodCardProps {
  pod: Pod;
  onPress: (pod: Pod) => void;
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
    colors.laurel.amber,
    colors.laurel.forestLight,
    colors.laurel.forestDark,
  ];

  // Simple hash based on name characters
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return avatarColors[Math.abs(hash) % avatarColors.length];
}

/**
 * MemberAvatar - Displays a circular avatar with initials
 */
function MemberAvatar({ member, index }: { member: PodMember; index: number }) {
  const initials = getInitials(member.name);
  const backgroundColor = getAvatarColor(member.name);

  return (
    <View
      style={[
        styles.avatar,
        {
          backgroundColor,
          marginLeft: index > 0 ? -10 : 0,
          zIndex: 10 - index,
        },
      ]}
    >
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

/**
 * PodCard Component
 *
 * Displays a pod with its name, description, and member avatars.
 * Features an organic, earthy design consistent with the Laurel brand.
 */
export function PodCard({ pod, onPress }: PodCardProps) {
  const { name, description, memberCount, members } = pod;

  // Show max 4 avatars, with overflow indicator
  const visibleMembers = members.slice(0, 4);
  const overflowCount = memberCount - visibleMembers.length;

  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.container} onPress={() => onPress(pod)}>
      {/* Card Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Users color={colors.laurel.forest} size={18} />
        </View>
        <View style={styles.headerText}>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>
          <Text style={styles.memberCount}>
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </Text>
        </View>
        <ChevronRight color={colors.gray[400]} size={20} />
      </View>

      {/* Description */}
      <Text numberOfLines={2} style={styles.description}>
        {description}
      </Text>

      {/* Member Avatars */}
      <View style={styles.avatarsContainer}>
        <View style={styles.avatarsRow}>
          {visibleMembers.map((member, index) => (
            <MemberAvatar key={member.id} index={index} member={member} />
          ))}
          {overflowCount > 0 && (
            <View style={[styles.avatar, styles.overflowAvatar, { marginLeft: -10 }]}>
              <Text style={styles.overflowText}>+{overflowCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: `${colors.laurel.forest}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
  },
  memberCount: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  description: {
    fontSize: fontSize.base,
    color: colors.mutedForeground,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  avatarsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  avatarsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  avatarText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.laurel.white,
  },
  overflowAvatar: {
    backgroundColor: colors.gray[200],
  },
  overflowText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.gray[600],
  },
});

export default PodCard;
