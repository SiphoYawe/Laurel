import { Repeat, Target, Sparkles, Brain, BookOpen, MessageCircle } from "lucide-react-native";
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from "react-native";

import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from "../../lib/theme";

/**
 * SuggestedPrompts Component - M2-3
 *
 * Displays horizontally scrollable suggested prompts grouped by category.
 * Categories: Habits, Motivation, Learning, Reflection
 * Each prompt chip can be tapped to send as a message.
 */

// Prompt category definition
interface PromptCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  prompts: string[];
}

// Category colors matching Laurel brand
const categoryColors = {
  habits: colors.laurel.forest,
  motivation: colors.laurel.amber,
  learning: colors.laurel.sage,
  reflection: "#6366F1", // Indigo for reflection/introspection
};

// Prompt data organized by category
const promptCategories: PromptCategory[] = [
  {
    id: "habits",
    name: "Habits",
    icon: <Repeat color={categoryColors.habits} size={16} strokeWidth={2.5} />,
    color: categoryColors.habits,
    prompts: ["Help me build a morning routine", "Why do I keep breaking habits?"],
  },
  {
    id: "motivation",
    name: "Motivation",
    icon: <Sparkles color={categoryColors.motivation} size={16} strokeWidth={2.5} />,
    color: categoryColors.motivation,
    prompts: ["I'm feeling unmotivated today", "How do I stay consistent?"],
  },
  {
    id: "learning",
    name: "Learning",
    icon: <BookOpen color={categoryColors.learning} size={16} strokeWidth={2.5} />,
    color: categoryColors.learning,
    prompts: ["How does spaced repetition work?", "Tips for active recall"],
  },
  {
    id: "reflection",
    name: "Reflection",
    icon: <Brain color={categoryColors.reflection} size={16} strokeWidth={2.5} />,
    color: categoryColors.reflection,
    prompts: ["Review my progress this week", "What habits should I focus on?"],
  },
];

interface PromptChipProps {
  prompt: string;
  color: string;
  onPress: (prompt: string) => void;
}

/**
 * Individual prompt chip component
 */
function PromptChip({ prompt, color, onPress }: PromptChipProps) {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.promptChip, { borderColor: color }]}
        onPress={() => onPress(prompt)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={styles.promptChipText}>{prompt}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

interface CategorySectionProps {
  category: PromptCategory;
  onPromptSelect: (prompt: string) => void;
}

/**
 * Category section with icon, label, and prompt chips
 */
function CategorySection({ category, onPromptSelect }: CategorySectionProps) {
  return (
    <View style={styles.categorySection}>
      {/* Category header */}
      <View style={styles.categoryHeader}>
        <View style={[styles.categoryIconContainer, { backgroundColor: `${category.color}15` }]}>
          {category.icon}
        </View>
        <Text style={[styles.categoryLabel, { color: category.color }]}>{category.name}</Text>
      </View>

      {/* Prompt chips */}
      <View style={styles.promptChipsContainer}>
        {category.prompts.map((prompt, index) => (
          <PromptChip
            key={`${category.id}-${index}`}
            color={category.color}
            prompt={prompt}
            onPress={onPromptSelect}
          />
        ))}
      </View>
    </View>
  );
}

interface SuggestedPromptsProps {
  onPromptSelect: (prompt: string) => void;
  visible?: boolean;
}

/**
 * Main SuggestedPrompts component
 *
 * Renders horizontally scrollable categories with prompt chips.
 * Automatically hides when visible is false.
 */
export function SuggestedPrompts({ onPromptSelect, visible = true }: SuggestedPromptsProps) {
  const fadeAnim = React.useRef(new Animated.Value(visible ? 1 : 0)).current;
  const slideAnim = React.useRef(new Animated.Value(visible ? 0 : 20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: visible ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: visible ? 0 : 20,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, fadeAnim, slideAnim]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.headerContainer}>
        <MessageCircle color={colors.gray[500]} size={14} strokeWidth={2.5} />
        <Text style={styles.headerText}>Quick prompts to get started</Text>
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        snapToInterval={280}
      >
        {promptCategories.map((category) => (
          <CategorySection key={category.id} category={category} onPromptSelect={onPromptSelect} />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  headerText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.gray[500],
    letterSpacing: 0.3,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  categorySection: {
    width: 260,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadow.sm,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  categoryIconContainer: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.3,
  },
  promptChipsContainer: {
    gap: spacing.xs,
  },
  promptChip: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.gray[200],
    ...shadow.sm,
  },
  promptChipText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
    lineHeight: 20,
  },
});

export default SuggestedPrompts;
