import { Home, Flame, Target, TrendingUp } from "lucide-react-native";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { XPLevelDisplay } from "../../src/components/gamification";

/**
 * Home Screen (Dashboard)
 * Shows daily overview, quick stats, and habit progress
 */

const colors = {
  forest: "#2D5A3D",
  sage: "#7CB07F",
  amber: "#E8A54B",
  white: "#FAFAF8",
  charcoal: "#1A1A1A",
  muted: "#6B7280",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray500: "#6B7280",
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning! 🌿</Text>
          <Text style={styles.subGreeting}>Let&apos;s make today count</Text>
        </View>

        {/* XP & Level Display */}
        <View style={styles.xpSection}>
          <XPLevelDisplay currentXP={450} level={3} xpForNextLevel={1000} />
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${colors.forest}15` }]}>
              <Target color={colors.forest} size={20} />
            </View>
            <Text style={styles.statLabel}>Today&apos;s Progress</Text>
            <Text style={[styles.statValue, { color: colors.forest }]}>0/0</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${colors.amber}15` }]}>
              <Flame color={colors.amber} size={20} />
            </View>
            <Text style={styles.statLabel}>Current Streak</Text>
            <Text style={[styles.statValue, { color: colors.amber }]}>0 days</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: `${colors.sage}15` }]}>
              <TrendingUp color={colors.sage} size={20} />
            </View>
            <Text style={styles.statLabel}>Level</Text>
            <Text style={[styles.statValue, { color: colors.sage }]}>1</Text>
          </View>
        </View>

        {/* Today's Habits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Habits</Text>
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: `${colors.forest}15` }]}>
              <Home color={colors.forest} size={24} />
            </View>
            <Text style={styles.emptyText}>
              No habits yet. Start your journey by adding your first habit!
            </Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.emptyStateSmall}>
            <Text style={styles.emptyText}>Your recent activity will appear here</Text>
          </View>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 16,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.charcoal,
  },
  subGreeting: {
    marginTop: 4,
    fontSize: 14,
    color: colors.gray500,
  },
  xpSection: {
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.gray100,
  },
  statIconContainer: {
    height: 40,
    width: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray500,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.charcoal,
    marginBottom: 12,
  },
  emptyState: {
    backgroundColor: colors.gray50,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
  },
  emptyStateSmall: {
    backgroundColor: colors.gray50,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  emptyIcon: {
    height: 48,
    width: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyText: {
    textAlign: "center",
    color: colors.gray500,
    fontSize: 14,
  },
});
