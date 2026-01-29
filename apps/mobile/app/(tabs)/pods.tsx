import { Users, Plus, UserPlus } from "lucide-react-native";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PodList, MemberStreaks, Leaderboard, ActivityFeed } from "../../src/components/pods";

import type { Pod, MemberStreak, LeaderboardMember, ActivityItem } from "../../src/components/pods";

/**
 * Pods Screen
 * Accountability pods and group features
 */

const colors = {
  forest: "#2D5A3D",
  sage: "#7CB07F",
  amber: "#E8A54B",
  white: "#FAFAF8",
  charcoal: "#1A1A1A",
  gray50: "#F9FAFB",
  gray500: "#6B7280",
};

// Mock data for demonstration
const MOCK_PODS: Pod[] = [
  {
    id: "1",
    name: "Morning Routines",
    description:
      "A pod for early risers committed to building powerful morning habits. We share our routines and keep each other accountable.",
    memberCount: 8,
    members: [
      { id: "m1", name: "Alex Chen" },
      { id: "m2", name: "Sarah Kim" },
      { id: "m3", name: "Mike Johnson" },
      { id: "m4", name: "Emily Davis" },
      { id: "m5", name: "Chris Lee" },
      { id: "m6", name: "Jordan Smith" },
      { id: "m7", name: "Taylor Brown" },
      { id: "m8", name: "Morgan White" },
    ],
  },
  {
    id: "2",
    name: "Fitness Goals 2026",
    description:
      "Working together to achieve our fitness resolutions this year. Daily check-ins and workout sharing.",
    memberCount: 5,
    members: [
      { id: "m9", name: "Jamie Wilson" },
      { id: "m10", name: "Casey Miller" },
      { id: "m11", name: "Drew Anderson" },
      { id: "m12", name: "Robin Garcia" },
      { id: "m13", name: "Sam Martinez" },
    ],
  },
  {
    id: "3",
    name: "Mindfulness Masters",
    description:
      "Daily meditation and mindfulness practice. Supporting each other on the journey to inner peace.",
    memberCount: 12,
    members: [
      { id: "m14", name: "Quinn Thompson" },
      { id: "m15", name: "Avery Robinson" },
      { id: "m16", name: "Blake Clark" },
      { id: "m17", name: "Cameron Lewis" },
      { id: "m18", name: "Dakota Hall" },
      { id: "m19", name: "Elliot Young" },
      { id: "m20", name: "Finley King" },
      { id: "m21", name: "Harper Wright" },
      { id: "m22", name: "Indigo Scott" },
      { id: "m23", name: "Jordan Green" },
      { id: "m24", name: "Kai Adams" },
      { id: "m25", name: "Luna Baker" },
    ],
  },
  {
    id: "4",
    name: "Reading Challenge",
    description: "52 books in 52 weeks! Share recommendations and discuss what we're reading.",
    memberCount: 3,
    members: [
      { id: "m26", name: "Max Turner" },
      { id: "m27", name: "Nova Phillips" },
      { id: "m28", name: "Oscar Campbell" },
    ],
  },
];

// Mock member streaks data
const MOCK_MEMBER_STREAKS: MemberStreak[] = [
  { id: "m1", name: "Alex Chen", currentStreak: 45 },
  { id: "m2", name: "Sarah Kim", currentStreak: 32 },
  { id: "m3", name: "Mike Johnson", currentStreak: 21 },
  { id: "m4", name: "Emily Davis", currentStreak: 18 },
  { id: "m5", name: "Chris Lee", currentStreak: 14 },
  { id: "m6", name: "Jordan Smith", currentStreak: 9 },
  { id: "m7", name: "Taylor Brown", currentStreak: 5 },
  { id: "m8", name: "Morgan White", currentStreak: 3 },
];

// Mock leaderboard data
const MOCK_LEADERBOARD: LeaderboardMember[] = [
  { id: "m1", name: "Alex Chen", xp: 12450, streak: 45, rankChange: 0 },
  { id: "m2", name: "Sarah Kim", xp: 10820, streak: 32, rankChange: 2 },
  { id: "m3", name: "Mike Johnson", xp: 9340, streak: 21, rankChange: -1 },
  { id: "m4", name: "Emily Davis", xp: 8120, streak: 18, rankChange: 1, isCurrentUser: true },
  { id: "m5", name: "Chris Lee", xp: 7650, streak: 14, rankChange: -2 },
  { id: "m6", name: "Jordan Smith", xp: 5430, streak: 9, rankChange: 0 },
  { id: "m7", name: "Taylor Brown", xp: 3210, streak: 5, rankChange: 1 },
  { id: "m8", name: "Morgan White", xp: 1890, streak: 3, rankChange: -1 },
];

// Mock activity feed data
const now = new Date();
const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "a1",
    type: "habit_completed",
    memberId: "m1",
    memberName: "Alex Chen",
    timestamp: new Date(now.getTime() - 5 * 60 * 1000), // 5 mins ago
    metadata: { habitName: "Morning Meditation" },
  },
  {
    id: "a2",
    type: "badge_earned",
    memberId: "m2",
    memberName: "Sarah Kim",
    timestamp: new Date(now.getTime() - 25 * 60 * 1000), // 25 mins ago
    metadata: { badgeName: "7-Day Warrior" },
  },
  {
    id: "a3",
    type: "level_up",
    memberId: "m3",
    memberName: "Mike Johnson",
    timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
    metadata: { newLevel: 15 },
  },
  {
    id: "a4",
    type: "habit_completed",
    memberId: "m4",
    memberName: "Emily Davis",
    timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
    metadata: { habitName: "Read 30 Pages" },
  },
  {
    id: "a5",
    type: "joined_pod",
    memberId: "m8",
    memberName: "Morgan White",
    timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
    metadata: { podName: "Morning Routines" },
  },
  {
    id: "a6",
    type: "habit_completed",
    memberId: "m5",
    memberName: "Chris Lee",
    timestamp: new Date(now.getTime() - 36 * 60 * 60 * 1000), // 1.5 days ago
    metadata: { habitName: "Evening Journal" },
  },
];

export default function PodsScreen() {
  const handlePodPress = (pod: Pod) => {
    Alert.alert(pod.name, `You selected the "${pod.name}" pod with ${pod.memberCount} members.`);
  };

  const handleMemberPress = (member: MemberStreak) => {
    Alert.alert(member.name, `${member.name} has a ${member.currentStreak} day streak!`);
  };

  const handleJoinPod = () => {
    Alert.alert("Join Pod", "Pod discovery feature coming soon!");
  };

  const handleCreatePod = () => {
    Alert.alert("Create Pod", "Pod creation feature coming soon!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.forest}15` }]}>
              <Users color={colors.forest} size={20} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Pods</Text>
              <Text style={styles.headerSubtitle}>Accountability groups</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.joinButton, { borderColor: colors.forest }]}
            onPress={handleJoinPod}
          >
            <UserPlus color={colors.forest} size={18} />
            <Text style={[styles.joinButtonText, { color: colors.forest }]}>Join Pod</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.createButton, { backgroundColor: colors.forest }]}
            onPress={handleCreatePod}
          >
            <Plus color="#fff" size={18} />
            <Text style={styles.createButtonText}>Create Pod</Text>
          </TouchableOpacity>
        </View>

        {/* Member Streaks Section */}
        <View style={styles.section}>
          <MemberStreaks members={MOCK_MEMBER_STREAKS} onMemberPress={handleMemberPress} />
        </View>

        {/* Leaderboard Section */}
        <View style={styles.section}>
          <Leaderboard members={MOCK_LEADERBOARD} sortBy="xp" />
        </View>

        {/* Activity Feed Section */}
        <View style={styles.section}>
          <ActivityFeed activities={MOCK_ACTIVITIES} maxItems={6} />
        </View>

        {/* My Pods Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Pods</Text>
        </View>

        {/* Pod List - rendered inline instead of as FlatList */}
        <View style={styles.podListContainer}>
          {MOCK_PODS.map((pod) => (
            <TouchableOpacity key={pod.id} activeOpacity={0.7} onPress={() => handlePodPress(pod)}>
              <View style={styles.podCard}>
                <View style={styles.podHeader}>
                  <View
                    style={[styles.podIconContainer, { backgroundColor: `${colors.forest}15` }]}
                  >
                    <Users color={colors.forest} size={18} />
                  </View>
                  <View style={styles.podHeaderText}>
                    <Text numberOfLines={1} style={styles.podName}>
                      {pod.name}
                    </Text>
                    <Text style={styles.podMemberCount}>
                      {pod.memberCount} {pod.memberCount === 1 ? "member" : "members"}
                    </Text>
                  </View>
                </View>
                <Text numberOfLines={2} style={styles.podDescription}>
                  {pod.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
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
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerLeft: {
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
  headerSubtitle: {
    fontSize: 12,
    color: colors.gray500,
  },
  actionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  joinButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
  },
  joinButtonText: {
    fontWeight: "500",
  },
  createButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 12,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.charcoal,
    marginBottom: 12,
  },
  podListContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  podCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  podHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  podIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  podHeaderText: {
    flex: 1,
  },
  podName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.charcoal,
  },
  podMemberCount: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },
  podDescription: {
    fontSize: 14,
    color: colors.gray500,
    lineHeight: 20,
  },
});
