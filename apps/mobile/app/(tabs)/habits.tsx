import { CheckCircle, Plus, Calendar, Flame } from "lucide-react-native";
import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  HabitCard,
  HabitList,
  StreakCalendar,
  type Habit,
  type DayCompletionData,
} from "../../src/components/habits";

/**
 * Habits Screen
 * Habit list with completion tracking
 */

const colors = {
  forest: "#2D5A3D",
  sage: "#7CB07F",
  amber: "#E8A54B",
  white: "#FAFAF8",
  charcoal: "#1A1A1A",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray500: "#6B7280",
  gray600: "#4B5563",
};

/**
 * Mock habit data for development
 */
const initialMockHabits: Habit[] = [
  {
    id: "1",
    name: "Morning meditation",
    streak: 12,
    category: "mindfulness",
    isCompleted: true,
    maxStreak: 30,
  },
  {
    id: "2",
    name: "Read for 30 minutes",
    streak: 7,
    category: "learning",
    isCompleted: false,
    maxStreak: 30,
  },
  {
    id: "3",
    name: "Exercise",
    streak: 21,
    category: "fitness",
    isCompleted: true,
    maxStreak: 30,
  },
  {
    id: "4",
    name: "Drink 8 glasses of water",
    streak: 5,
    category: "health",
    isCompleted: false,
    maxStreak: 30,
  },
  {
    id: "5",
    name: "Write in journal",
    streak: 0,
    category: "creativity",
    isCompleted: false,
    maxStreak: 30,
  },
  {
    id: "6",
    name: "Review budget",
    streak: 3,
    category: "finance",
    isCompleted: false,
    maxStreak: 7,
  },
];

export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>(initialMockHabits);

  // Calculate completion stats
  const completedCount = habits.filter((h) => h.isCompleted).length;
  const totalCount = habits.length;

  // Calculate current streak (consecutive days with all habits completed)
  const currentStreak = Math.max(...habits.map((h) => h.streak), 0);

  // Toggle habit completion
  const handleToggleHabit = useCallback((habitId: string) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              isCompleted: !habit.isCompleted,
              streak: !habit.isCompleted ? habit.streak + 1 : habit.streak,
            }
          : habit
      )
    );
  }, []);

  // Handle habit reordering from drag-and-drop
  const handleReorderHabits = useCallback((reorderedHabits: Habit[]) => {
    setHabits(reorderedHabits);
    // TODO: Persist new order to backend/storage
    console.log(
      "Habits reordered:",
      reorderedHabits.map((h) => h.name)
    );
  }, []);

  const hasHabits = habits.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.flex}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.forest}15` }]}>
              <CheckCircle color={colors.forest} size={20} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Habits</Text>
              <Text style={styles.headerSubtitle}>
                {completedCount} of {totalCount} completed today
              </Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.addButton, { backgroundColor: colors.forest }]}
          >
            <Plus color="#fff" size={20} />
          </TouchableOpacity>
        </View>

        {/* Streak Banner */}
        <View style={[styles.streakBanner, { backgroundColor: `${colors.amber}15` }]}>
          <View style={[styles.streakIcon, { backgroundColor: `${colors.amber}30` }]}>
            <Flame color={colors.amber} size={24} />
          </View>
          <View style={styles.streakText}>
            <Text style={styles.streakTitle}>
              {currentStreak > 0 ? `${currentStreak} day streak!` : "Start your streak!"}
            </Text>
            <Text style={styles.streakSubtitle}>
              {currentStreak > 0
                ? "Keep it up! Consistency is key."
                : "Complete habits daily to build momentum"}
            </Text>
          </View>
        </View>

        {/* Streak Calendar */}
        <View style={styles.calendarSection}>
          <Text style={styles.calendarTitle}>Your Progress</Text>
          <StreakCalendar weeksToShow={12} />
        </View>

        {/* Quick Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          <View style={styles.filtersContent}>
            <TouchableOpacity style={[styles.filterActive, { backgroundColor: colors.forest }]}>
              <Text style={styles.filterActiveText}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filter}>
              <Text style={styles.filterText}>Morning</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filter}>
              <Text style={styles.filterText}>Afternoon</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filter}>
              <Text style={styles.filterText}>Evening</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Habit List */}
        {hasHabits ? (
          <View style={styles.habitList}>
            <HabitList
              habits={habits}
              onReorder={handleReorderHabits}
              onToggleComplete={handleToggleHabit}
            />
          </View>
        ) : (
          /* Empty State */
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: `${colors.forest}15` }]}>
              <Calendar color={colors.forest} size={32} />
            </View>
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptyDescription}>
              Start building better habits today. Tap the + button to add your first habit.
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.addHabitButton, { backgroundColor: colors.forest }]}
            >
              <Plus color="#fff" size={18} />
              <Text style={styles.addHabitButtonText}>Add Habit</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Quick Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>Start small</Text>
              <Text style={styles.tipDescription}>
                Begin with 2-minute habits to build consistency
              </Text>
            </View>
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>Habit stacking</Text>
              <Text style={styles.tipDescription}>Link new habits to existing routines</Text>
            </View>
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
  flex: {
    flex: 1,
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
  addButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  streakBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
  },
  streakIcon: {
    height: 48,
    width: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  streakText: {
    flex: 1,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.charcoal,
  },
  streakSubtitle: {
    fontSize: 14,
    color: colors.gray500,
  },
  calendarSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.charcoal,
    marginBottom: 12,
  },
  filtersContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  filtersContent: {
    flexDirection: "row",
    gap: 8,
  },
  filterActive: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterActiveText: {
    color: "#fff",
    fontWeight: "500",
  },
  filter: {
    backgroundColor: colors.gray100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterText: {
    color: colors.gray600,
    fontWeight: "500",
  },
  habitList: {
    paddingBottom: 8,
    minHeight: 400, // Ensure enough space for drag-and-drop list
  },
  emptyState: {
    marginHorizontal: 16,
    backgroundColor: colors.gray50,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
  },
  emptyIcon: {
    height: 64,
    width: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.charcoal,
    marginBottom: 8,
  },
  emptyDescription: {
    textAlign: "center",
    color: colors.gray500,
    marginBottom: 16,
  },
  addHabitButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  addHabitButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  tipsSection: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.charcoal,
    marginBottom: 12,
  },
  tipsContainer: {
    gap: 8,
  },
  tipCard: {
    backgroundColor: colors.gray50,
    borderRadius: 12,
    padding: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.charcoal,
  },
  tipDescription: {
    marginTop: 4,
    fontSize: 14,
    color: colors.gray500,
  },
});
