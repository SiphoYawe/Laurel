import {
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Award,
  Target,
  Flame,
} from "lucide-react-native";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { LucideIcon } from "lucide-react-native";

/**
 * Profile Screen
 * User profile, settings, and achievements
 */

const colors = {
  forest: "#2D5A3D",
  sage: "#7CB07F",
  amber: "#E8A54B",
  white: "#FAFAF8",
  charcoal: "#1A1A1A",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  red50: "#FEF2F2",
  red200: "#FECACA",
  red500: "#EF4444",
};

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  iconColor?: string;
  onPress?: () => void;
}

function MenuItem({ icon: Icon, label, iconColor = colors.charcoal, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconContainer}>
          <Icon color={iconColor} size={20} />
        </View>
        <Text style={styles.menuItemLabel}>{label}</Text>
      </View>
      <ChevronRight color={colors.gray400} size={20} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.flex}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.forest}15` }]}>
              <User color={colors.forest} size={20} />
            </View>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: `${colors.sage}30` }]}>
            <User color={colors.sage} size={40} />
          </View>
          <Text style={styles.userName}>Guest User</Text>
          <Text style={styles.userSubtitle}>Sign in to sync your data</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.signInButton, { backgroundColor: colors.forest }]}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.forest}15` }]}>
              <Target color={colors.forest} size={20} />
            </View>
            <Text style={[styles.statValue, { color: colors.forest }]}>0</Text>
            <Text style={styles.statLabel}>Total Completions</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.amber}15` }]}>
              <Flame color={colors.amber} size={20} />
            </View>
            <Text style={[styles.statValue, { color: colors.amber }]}>0</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${colors.sage}15` }]}>
              <Award color={colors.sage} size={20} />
            </View>
            <Text style={[styles.statValue, { color: colors.sage }]}>0</Text>
            <Text style={styles.statLabel}>Badges Earned</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <MenuItem icon={Settings} iconColor={colors.charcoal} label="Settings" />
          <View style={styles.divider} />
          <MenuItem icon={Bell} iconColor={colors.charcoal} label="Notifications" />
          <View style={styles.divider} />
          <MenuItem icon={Shield} iconColor={colors.charcoal} label="Privacy" />
          <View style={styles.divider} />
          <MenuItem icon={HelpCircle} iconColor={colors.charcoal} label="Help & Support" />
        </View>

        {/* Sign Out */}
        <View style={styles.signOutContainer}>
          <TouchableOpacity activeOpacity={0.7} style={styles.signOutButton}>
            <LogOut color={colors.red500} size={20} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.charcoal,
  },
  profileCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: colors.gray50,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.charcoal,
  },
  userSubtitle: {
    fontSize: 14,
    color: colors.gray500,
  },
  signInButton: {
    marginTop: 16,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  signInButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.gray50,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statIcon: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray500,
    textAlign: "center",
  },
  menuContainer: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuIconContainer: {
    height: 40,
    width: 40,
    borderRadius: 12,
    backgroundColor: colors.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemLabel: {
    fontSize: 16,
    color: colors.charcoal,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray100,
  },
  signOutContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.red50,
    borderWidth: 1,
    borderColor: colors.red200,
    borderRadius: 12,
    paddingVertical: 16,
  },
  signOutText: {
    color: colors.red500,
    fontWeight: "500",
  },
});
