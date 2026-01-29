import { BookOpen, Plus, Layers, Clock, Flame } from "lucide-react-native";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DeckList } from "../../src/components/learn";
import { colors } from "../../src/lib/theme";

import type { Deck } from "../../src/components/learn";

/**
 * Learn Screen
 * Spaced repetition flashcard decks
 */

// Mock data for development
const MOCK_DECKS: Deck[] = [
  {
    id: "1",
    name: "JavaScript Fundamentals",
    cardCount: 45,
    masteryPercent: 78,
    lastStudied: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "2",
    name: "React Hooks",
    cardCount: 28,
    masteryPercent: 92,
    lastStudied: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "3",
    name: "TypeScript Types",
    cardCount: 36,
    masteryPercent: 45,
    lastStudied: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  },
  {
    id: "4",
    name: "Data Structures",
    cardCount: 52,
    masteryPercent: 23,
    lastStudied: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
  },
  {
    id: "5",
    name: "Atomic Habits",
    cardCount: 15,
    masteryPercent: 0,
    lastStudied: null,
  },
];

// Local colors for this screen (matching existing pattern)
const screenColors = {
  forest: colors.laurel.forest,
  sage: colors.laurel.sage,
  amber: colors.laurel.amber,
  charcoal: colors.laurel.charcoal,
  gray50: colors.gray[50],
  gray100: colors.gray[100],
  gray500: colors.gray[500],
  red500: colors.error.DEFAULT,
};

export default function LearnScreen() {
  const [decks, setDecks] = useState<Deck[]>(MOCK_DECKS);

  // Calculate stats from decks
  const totalCards = decks.reduce((sum, deck) => sum + deck.cardCount, 0);
  const dueCards = decks.reduce((sum, deck) => {
    // Simulate due cards based on last studied date
    if (!deck.lastStudied) return sum + deck.cardCount;
    const daysSinceStudied = Math.floor(
      (Date.now() - deck.lastStudied.getTime()) / (1000 * 60 * 60 * 24)
    );
    return sum + Math.min(deck.cardCount, daysSinceStudied * 5);
  }, 0);

  const handleDeckPress = (deck: Deck) => {
    Alert.alert(deck.name, `${deck.cardCount} cards - ${deck.masteryPercent}% mastered`, [
      { text: "Cancel", style: "cancel" },
      { text: "Study Now", onPress: () => console.log("Study deck:", deck.id) },
    ]);
  };

  const handleCreateDeck = () => {
    Alert.alert("Create Deck", "Deck creation coming soon!", [{ text: "OK" }]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: `${screenColors.forest}15` }]}>
            <BookOpen color={screenColors.forest} size={20} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Learn</Text>
            <Text style={styles.headerSubtitle}>Spaced repetition flashcards</Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.addButton, { backgroundColor: screenColors.forest }]}
          onPress={handleCreateDeck}
        >
          <Plus color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Layers color={screenColors.sage} size={16} />
            <Text style={styles.statLabel}>Cards</Text>
          </View>
          <Text style={styles.statValue}>{totalCards}</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Clock color={screenColors.amber} size={16} />
            <Text style={styles.statLabel}>Due</Text>
          </View>
          <Text style={[styles.statValue, { color: screenColors.amber }]}>{dueCards}</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Flame color={screenColors.red500} size={16} />
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <Text style={styles.statValue}>7</Text>
        </View>
      </View>

      {/* Due Cards Banner */}
      {dueCards > 0 && (
        <View
          style={[
            styles.dueBanner,
            { borderColor: `${screenColors.forest}30`, backgroundColor: `${screenColors.sage}10` },
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${screenColors.forest}15` }]}>
            <Clock color={screenColors.forest} size={20} />
          </View>
          <View style={styles.dueText}>
            <Text style={styles.dueTitle}>{dueCards} cards due</Text>
            <Text style={styles.dueSubtitle}>Review now to maintain your streak</Text>
          </View>
        </View>
      )}

      {/* Deck List */}
      <View style={styles.deckListContainer}>
        <DeckList decks={decks} onCreateDeck={handleCreateDeck} onDeckPress={handleDeckPress} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    color: screenColors.charcoal,
  },
  headerSubtitle: {
    fontSize: 12,
    color: screenColors.gray500,
  },
  addButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: screenColors.gray50,
    borderRadius: 12,
    padding: 12,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statLabel: {
    fontSize: 12,
    color: screenColors.gray500,
  },
  statValue: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: "700",
    color: screenColors.charcoal,
  },
  dueBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  dueText: {
    flex: 1,
  },
  dueTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: screenColors.charcoal,
  },
  dueSubtitle: {
    fontSize: 14,
    color: screenColors.gray500,
  },
  deckListContainer: {
    flex: 1,
  },
});
