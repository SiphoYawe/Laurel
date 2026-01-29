import { Plus, BookOpen } from "lucide-react-native";
import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

import { DeckCard } from "./DeckCard";
import { colors, borderRadius, fontSize, fontWeight, spacing, shadow } from "../../lib/theme";

import type { Deck } from "./DeckCard";
import type { ListRenderItem } from "react-native";

interface DeckListProps {
  decks: Deck[];
  onDeckPress: (deck: Deck) => void;
  onCreateDeck: () => void;
}

/**
 * DeckList Component
 *
 * Displays a FlatList of DeckCard components with an empty state
 * and a floating create button.
 */
export function DeckList({ decks, onDeckPress, onCreateDeck }: DeckListProps) {
  const renderDeckCard: ListRenderItem<Deck> = ({ item }) => (
    <DeckCard deck={item} onPress={onDeckPress} />
  );

  const keyExtractor = (item: Deck) => item.id;

  // Empty state component
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <BookOpen color={colors.laurel.forest} size={36} strokeWidth={1.5} />
      </View>
      <Text style={styles.emptyTitle}>No decks yet</Text>
      <Text style={styles.emptyDescription}>
        Create your first flashcard deck to start learning with spaced repetition
      </Text>
      <TouchableOpacity activeOpacity={0.8} style={styles.emptyButton} onPress={onCreateDeck}>
        <Plus color={colors.background} size={18} strokeWidth={2.5} />
        <Text style={styles.emptyButtonText}>Create Your First Deck</Text>
      </TouchableOpacity>
    </View>
  );

  // Header component with create button
  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTitleRow}>
        <Text style={styles.headerTitle}>My Decks</Text>
        <Text style={styles.headerCount}>
          {decks.length} {decks.length === 1 ? "deck" : "decks"}
        </Text>
      </View>
      {decks.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.headerCreateButton}
          onPress={onCreateDeck}
        >
          <Plus color={colors.laurel.forest} size={16} strokeWidth={2.5} />
          <Text style={styles.headerCreateText}>New Deck</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Footer spacing
  const ListFooter = () => <View style={styles.footer} />;

  return (
    <View style={styles.container}>
      <FlatList
        ListEmptyComponent={EmptyState}
        ListFooterComponent={decks.length > 0 ? ListFooter : null}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        data={decks}
        keyExtractor={keyExtractor}
        renderItem={renderDeckCard}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    paddingVertical: spacing.xs,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
  },
  headerCount: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    marginLeft: spacing.sm,
  },
  headerCreateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${colors.laurel.sage}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  headerCreateText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.laurel.forest,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing["2xl"],
    paddingHorizontal: spacing.lg,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.laurel.sage}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    fontSize: fontSize.base,
    color: colors.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.lg,
    maxWidth: 280,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.laurel.forest,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    ...shadow.md,
  },
  emptyButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.background,
  },
  footer: {
    height: spacing.lg,
  },
});

export default DeckList;
