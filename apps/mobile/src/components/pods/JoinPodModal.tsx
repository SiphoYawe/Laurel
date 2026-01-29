import { Search, Users, X, Check, ChevronRight } from "lucide-react-native";
import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
} from "react-native-reanimated";

import { colors, borderRadius, shadow, spacing, fontSize, fontWeight } from "../../lib/theme";

/**
 * Public pod data structure for the join modal
 */
export interface PublicPod {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  category: string;
  isPrivate: boolean;
}

/**
 * JoinPodModal component props
 */
export interface JoinPodModalProps {
  visible: boolean;
  onClose: () => void;
  onJoin: (podId: string) => void;
}

// Mock data for demonstration
const MOCK_PUBLIC_PODS: PublicPod[] = [
  {
    id: "1",
    name: "Morning Runners",
    description: "Early risers who love to start their day with a run",
    memberCount: 8,
    maxMembers: 15,
    category: "fitness",
    isPrivate: false,
  },
  {
    id: "2",
    name: "Meditation Masters",
    description: "Daily mindfulness practice for stress relief and clarity",
    memberCount: 12,
    maxMembers: 20,
    category: "health",
    isPrivate: false,
  },
  {
    id: "3",
    name: "Code Learners",
    description: "Learning to code together, one day at a time",
    memberCount: 15,
    maxMembers: 20,
    category: "learning",
    isPrivate: false,
  },
  {
    id: "4",
    name: "Career Climbers",
    description: "Supporting each other in professional growth",
    memberCount: 6,
    maxMembers: 10,
    category: "career",
    isPrivate: false,
  },
  {
    id: "5",
    name: "Creative Writers",
    description: "Daily writing habits for aspiring authors",
    memberCount: 9,
    maxMembers: 15,
    category: "creative",
    isPrivate: false,
  },
];

/**
 * Get category color based on category type
 */
function getCategoryColor(category: string): string {
  const categoryColors: Record<string, string> = {
    health: colors.laurel.sage,
    fitness: colors.laurel.forest,
    learning: colors.laurel.amber,
    career: colors.laurel.forestLight,
    creative: "#9B7ED9", // Soft purple for creative
  };
  return categoryColors[category] || colors.laurel.forest;
}

/**
 * Format category name for display
 */
function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

/**
 * PodListItem - Individual pod item in the search results
 */
function PodListItem({
  pod,
  onJoin,
  isJoining,
  isJoined,
}: {
  pod: PublicPod;
  onJoin: (podId: string) => void;
  isJoining: boolean;
  isJoined: boolean;
}) {
  const categoryColor = getCategoryColor(pod.category);
  const isFull = pod.memberCount >= pod.maxMembers;

  return (
    <View style={styles.podItem}>
      <View style={styles.podItemHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}20` }]}>
          <Text style={[styles.categoryText, { color: categoryColor }]}>
            {formatCategory(pod.category)}
          </Text>
        </View>
        <View style={styles.memberInfo}>
          <Users color={colors.mutedForeground} size={14} />
          <Text style={styles.memberText}>
            {pod.memberCount}/{pod.maxMembers}
          </Text>
        </View>
      </View>

      <Text style={styles.podName}>{pod.name}</Text>
      <Text numberOfLines={2} style={styles.podDescription}>
        {pod.description}
      </Text>

      <TouchableOpacity
        activeOpacity={0.7}
        disabled={isFull || isJoining || isJoined}
        style={[styles.joinButton, isJoined && styles.joinedButton, isFull && styles.fullButton]}
        onPress={() => !isFull && !isJoined && onJoin(pod.id)}
      >
        {isJoining ? (
          <ActivityIndicator color={colors.laurel.white} size="small" />
        ) : isJoined ? (
          <>
            <Check color={colors.laurel.white} size={16} />
            <Text style={styles.joinButtonText}>Joined</Text>
          </>
        ) : isFull ? (
          <Text style={styles.fullButtonText}>Full</Text>
        ) : (
          <>
            <Text style={styles.joinButtonText}>Join Pod</Text>
            <ChevronRight color={colors.laurel.white} size={16} />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

/**
 * JoinPodModal Component
 *
 * Bottom sheet modal for searching and joining existing pods.
 * Features search by name or invite code, public pod listings,
 * and smooth join flow with feedback.
 */
export function JoinPodModal({ visible, onClose, onJoin }: JoinPodModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [joiningPodId, setJoiningPodId] = useState<string | null>(null);
  const [joinedPodId, setJoinedPodId] = useState<string | null>(null);

  // Animation values
  const translateY = useSharedValue(1000);
  const backdropOpacity = useSharedValue(0);

  // Filter pods based on search query
  const filteredPods = MOCK_PUBLIC_PODS.filter(
    (pod) =>
      pod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pod.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Animated styles
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Handle modal visibility changes
  const handleOpen = useCallback(() => {
    translateY.value = withSpring(0, {
      damping: 20,
      stiffness: 150,
    });
    backdropOpacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
  }, [translateY, backdropOpacity]);

  const handleClose = useCallback(() => {
    const closeModal = () => {
      setSearchQuery("");
      setJoiningPodId(null);
      setJoinedPodId(null);
      onClose();
    };

    translateY.value = withTiming(1000, {
      duration: 300,
      easing: Easing.in(Easing.ease),
    });
    backdropOpacity.value = withTiming(
      0,
      {
        duration: 250,
        easing: Easing.in(Easing.ease),
      },
      () => {
        runOnJS(closeModal)();
      }
    );
  }, [translateY, backdropOpacity, onClose]);

  // Handle join action
  const handleJoin = useCallback(
    (podId: string) => {
      setJoiningPodId(podId);

      // Simulate API call
      setTimeout(() => {
        setJoiningPodId(null);
        setJoinedPodId(podId);

        // Show success then close
        setTimeout(() => {
          onJoin(podId);
          handleClose();
        }, 800);
      }, 1200);
    },
    [onJoin, handleClose]
  );

  // Trigger animations when visibility changes
  if (visible && translateY.value === 1000) {
    handleOpen();
  }

  const renderPodItem = ({ item }: { item: PublicPod }) => (
    <PodListItem
      isJoined={joinedPodId === item.id}
      isJoining={joiningPodId === item.id}
      pod={item}
      onJoin={handleJoin}
    />
  );

  return (
    <Modal
      statusBarTranslucent
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        </Animated.View>

        {/* Modal Content */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <Animated.View style={[styles.modal, modalStyle]}>
            {/* Handle Bar */}
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Join a Pod</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.closeButton}
                onPress={handleClose}
              >
                <X color={colors.gray[500]} size={24} />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <Search color={colors.mutedForeground} size={20} style={styles.searchIcon} />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Search pods or enter invite code..."
                placeholderTextColor={colors.mutedForeground}
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity activeOpacity={0.7} onPress={() => setSearchQuery("")}>
                  <X color={colors.mutedForeground} size={18} />
                </TouchableOpacity>
              )}
            </View>

            {/* Results Label */}
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsLabel}>
                {searchQuery
                  ? `${filteredPods.length} result${filteredPods.length !== 1 ? "s" : ""}`
                  : "Popular Pods"}
              </Text>
            </View>

            {/* Pod List */}
            <FlatList
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Users color={colors.gray[300]} size={48} />
                  <Text style={styles.emptyTitle}>No pods found</Text>
                  <Text style={styles.emptyText}>
                    Try a different search or create your own pod
                  </Text>
                </View>
              }
              contentContainerStyle={styles.listContent}
              data={filteredPods}
              keyExtractor={(item) => item.id}
              renderItem={renderPodItem}
              showsVerticalScrollIndicator={false}
            />
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: "85%",
    minHeight: "60%",
    ...shadow.lg,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.gray[300],
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.bold,
    color: colors.foreground,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.full,
    backgroundColor: colors.muted,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.muted,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.foreground,
    paddingVertical: 0,
  },
  resultsHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  resultsLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  podItem: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  podItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  categoryText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  memberText: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    fontWeight: fontWeight.medium,
  },
  podName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  podDescription: {
    fontSize: fontSize.base,
    color: colors.mutedForeground,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.laurel.forest,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    gap: 6,
  },
  joinedButton: {
    backgroundColor: colors.laurel.sage,
  },
  fullButton: {
    backgroundColor: colors.gray[300],
  },
  joinButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.laurel.white,
  },
  fullButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.gray[600],
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing["2xl"],
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
    color: colors.mutedForeground,
    textAlign: "center",
  },
});

export default JoinPodModal;
