import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo } from "react";
import { View, StyleSheet, Platform } from "react-native";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";

import { HabitCard, type Habit } from "./HabitCard";
import { colors, spacing, borderRadius } from "../../lib/theme";

import type { RenderItemParams, DragEndParams } from "react-native-draggable-flatlist";

/**
 * HabitList component props
 */
export interface HabitListProps {
  habits: Habit[];
  onReorder: (habits: Habit[]) => void;
  onToggleComplete: (habitId: string) => void;
}

/**
 * Custom decorator component for drag visual feedback
 * Provides elevation and scale effects during drag
 */
interface DragDecoratorProps {
  children: React.ReactNode;
  isActive: boolean;
}

function DragDecorator({ children, isActive }: DragDecoratorProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isActive ? 0.95 : 1, {
      damping: 15,
      stiffness: 120,
    }),
    transform: [
      {
        scale: withSpring(isActive ? 1.03 : 1, {
          damping: 15,
          stiffness: 120,
        }),
      },
    ],
    shadowOpacity: withSpring(isActive ? 0.25 : 0.1, {
      damping: 15,
      stiffness: 120,
    }),
    zIndex: isActive ? 999 : 1,
  }));

  return (
    <Animated.View
      style={[styles.dragContainer, animatedStyle, isActive && styles.dragContainerActive]}
    >
      {children}
    </Animated.View>
  );
}

/**
 * Placeholder component shown at the drop target position
 */
interface PlaceholderProps {
  item: Habit;
}

function Placeholder({ item }: PlaceholderProps) {
  return (
    <View style={styles.placeholder}>
      <View style={styles.placeholderInner} />
    </View>
  );
}

/**
 * Drop position indicator line
 */
function DropIndicator() {
  return <View style={styles.dropIndicator} />;
}

/**
 * HabitList Component
 *
 * A reorderable list of habits with drag-and-drop functionality.
 * Features:
 * - Long press to initiate drag mode
 * - Smooth drag animations using react-native-reanimated
 * - Visual feedback showing drop target position
 * - Haptic feedback on drag start/end
 * - Persists new order through onReorder callback
 */
export function HabitList({ habits, onReorder, onToggleComplete }: HabitListProps) {
  /**
   * Trigger haptic feedback for drag interactions
   */
  const triggerHapticFeedback = useCallback((type: "start" | "end") => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      if (type === "start") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  }, []);

  /**
   * Handle drag start - trigger haptic feedback
   */
  const handleDragBegin = useCallback(
    (index: number) => {
      triggerHapticFeedback("start");
    },
    [triggerHapticFeedback]
  );

  /**
   * Handle drag end - update habit order and trigger haptic feedback
   */
  const handleDragEnd = useCallback(
    ({ data, from, to }: DragEndParams<Habit>) => {
      triggerHapticFeedback("end");
      // Only call onReorder if the order actually changed
      if (from !== to) {
        onReorder(data);
      }
    },
    [onReorder, triggerHapticFeedback]
  );

  /**
   * Render a single habit item with drag capabilities
   */
  const renderItem = useCallback(
    ({ item, drag, isActive, getIndex }: RenderItemParams<Habit>) => {
      return (
        <ScaleDecorator activeScale={1.03}>
          <DragDecorator isActive={isActive}>
            <HabitCard
              habit={item}
              isDragging={isActive}
              onLongPress={drag}
              onToggle={onToggleComplete}
            />
          </DragDecorator>
        </ScaleDecorator>
      );
    },
    [onToggleComplete]
  );

  /**
   * Render placeholder at the original position of dragged item
   */
  const renderPlaceholder = useCallback(({ item, index }: { item: Habit; index: number }) => {
    return <Placeholder item={item} />;
  }, []);

  /**
   * Extract unique key for each habit
   */
  const keyExtractor = useCallback((item: Habit) => item.id, []);

  /**
   * Memoized list data to prevent unnecessary re-renders
   */
  const listData = useMemo(() => habits, [habits]);

  if (habits.length === 0) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <DraggableFlatList<Habit>
        activationDistance={10}
        animationConfig={{
          damping: 20,
          stiffness: 200,
          mass: 0.8,
        }}
        autoscrollSpeed={200}
        autoscrollThreshold={50}
        containerStyle={styles.listContainer}
        contentContainerStyle={styles.listContentContainer}
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderPlaceholder={renderPlaceholder}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        onDragBegin={handleDragBegin}
        onDragEnd={handleDragEnd}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: spacing.md,
  },
  dragContainer: {
    backgroundColor: "transparent",
    // Shadow for iOS
    shadowColor: colors.laurel.charcoal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 2,
  },
  dragContainerActive: {
    // Enhanced shadow when dragging
    shadowColor: colors.laurel.charcoal,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  placeholder: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    height: 80, // Approximate height of HabitCard
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[100],
    borderWidth: 2,
    borderColor: colors.laurel.sage,
    borderStyle: "dashed",
    overflow: "hidden",
  },
  placeholderInner: {
    flex: 1,
    backgroundColor: `${colors.laurel.sage}20`,
  },
  dropIndicator: {
    height: 3,
    backgroundColor: colors.laurel.forest,
    borderRadius: borderRadius.full,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
});

export default HabitList;
