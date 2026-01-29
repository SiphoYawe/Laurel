import { Users } from "lucide-react-native";
import { FlatList, View, Text, StyleSheet } from "react-native";

import { PodCard } from "./PodCard";
import { colors, borderRadius, spacing, fontSize, fontWeight } from "../../lib/theme";

import type { Pod } from "./PodCard";
import type { ListRenderItem } from "react-native";

/**
 * PodList component props
 */
interface PodListProps {
  pods: Pod[];
  onPodPress: (pod: Pod) => void;
}

/**
 * Empty state component when no pods exist
 */
function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Users color={colors.laurel.forest} size={32} />
      </View>
      <Text style={styles.emptyTitle}>No pods yet</Text>
      <Text style={styles.emptyDescription}>
        Join or create a pod to stay accountable with others on similar goals
      </Text>
    </View>
  );
}

/**
 * PodList Component
 *
 * Displays a scrollable list of PodCard components.
 * Shows an empty state when no pods are available.
 */
export function PodList({ pods, onPodPress }: PodListProps) {
  const renderPod: ListRenderItem<Pod> = ({ item }) => <PodCard pod={item} onPress={onPodPress} />;

  const keyExtractor = (item: Pod) => item.id;

  if (pods.length === 0) {
    return <EmptyState />;
  }

  return (
    <FlatList
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={styles.listContainer}
      data={pods}
      keyExtractor={keyExtractor}
      renderItem={renderPod}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  separator: {
    height: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.muted,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.laurel.forest}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    fontSize: fontSize.base,
    color: colors.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
  },
});

export default PodList;
