import { X, Eye, EyeOff, Trash2, Save, RotateCcw } from "lucide-react-native";
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from "react-native";

import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from "../../lib/theme";

/**
 * Difficulty levels for flashcards
 */
export type CardDifficulty = "easy" | "medium" | "hard";

/**
 * Card data structure for editing
 */
export interface CardData {
  id: string;
  front: string;
  back: string;
  tags?: string[];
  difficulty?: CardDifficulty;
}

/**
 * Props for CardEditorModal
 */
export interface CardEditorModalProps {
  visible: boolean;
  card?: { id: string; front: string; back: string; tags?: string[]; difficulty?: CardDifficulty };
  deckId: string;
  onSave: (card: {
    front: string;
    back: string;
    tags?: string[];
    difficulty?: CardDifficulty;
  }) => void;
  onDelete?: (cardId: string) => void;
  onClose: () => void;
}

// Constants
const MAX_FRONT_CHARS = 500;
const MAX_BACK_CHARS = 1000;

/**
 * Get color for difficulty level
 */
const getDifficultyColor = (difficulty: CardDifficulty): string => {
  switch (difficulty) {
    case "easy":
      return colors.laurel.sage;
    case "medium":
      return colors.laurel.amber;
    case "hard":
      return colors.error.DEFAULT;
    default:
      return colors.gray[400];
  }
};

/**
 * CardEditorModal Component
 *
 * A full-screen modal for creating and editing flashcards.
 * Features:
 * - Multiline text inputs for front (question) and back (answer)
 * - Character count indicators
 * - Tags input (comma-separated)
 * - Difficulty selection
 * - Preview toggle to see the card as it will appear
 * - Save/Cancel/Delete actions
 */
export function CardEditorModal({
  visible,
  card,
  deckId,
  onSave,
  onDelete,
  onClose,
}: CardEditorModalProps) {
  // Form state
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [difficulty, setDifficulty] = useState<CardDifficulty>("medium");
  const [showPreview, setShowPreview] = useState(false);
  const [previewFlipped, setPreviewFlipped] = useState(false);

  // Animation for preview card flip
  const flipAnimation = useState(new Animated.Value(0))[0];

  // Determine if editing existing card
  const isEditing = !!card?.id;

  // Initialize form with card data when modal opens
  useEffect(() => {
    if (visible) {
      if (card) {
        setFront(card.front || "");
        setBack(card.back || "");
        setTagsInput(card.tags?.join(", ") || "");
        setDifficulty(card.difficulty || "medium");
      } else {
        // Reset form for new card
        setFront("");
        setBack("");
        setTagsInput("");
        setDifficulty("medium");
      }
      setShowPreview(false);
      setPreviewFlipped(false);
      flipAnimation.setValue(0);
    }
  }, [visible, card]);

  // Parse tags from comma-separated input
  const parseTags = useCallback((input: string): string[] => {
    return input
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }, []);

  // Validate form
  const isFormValid = front.trim().length > 0 && back.trim().length > 0;

  // Handle save
  const handleSave = () => {
    if (!isFormValid) return;

    const tags = parseTags(tagsInput);
    onSave({
      front: front.trim(),
      back: back.trim(),
      tags: tags.length > 0 ? tags : undefined,
      difficulty,
    });
  };

  // Handle delete with confirmation
  const handleDelete = () => {
    if (!card?.id || !onDelete) return;

    Alert.alert(
      "Delete Card",
      "Are you sure you want to delete this flashcard? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(card.id),
        },
      ]
    );
  };

  // Toggle preview
  const togglePreview = () => {
    setShowPreview(!showPreview);
    if (!showPreview) {
      setPreviewFlipped(false);
      flipAnimation.setValue(0);
    }
  };

  // Flip preview card
  const flipPreviewCard = () => {
    const toValue = previewFlipped ? 0 : 1;
    Animated.spring(flipAnimation, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setPreviewFlipped(!previewFlipped);
  };

  // Calculate character counts
  const frontCharCount = front.length;
  const backCharCount = back.length;
  const frontCharExceeded = frontCharCount > MAX_FRONT_CHARS;
  const backCharExceeded = backCharCount > MAX_BACK_CHARS;

  // Interpolate flip animation
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["0deg", "90deg", "180deg"],
  });
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["180deg", "90deg", "0deg"],
  });
  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });
  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <Modal
      animationType="slide"
      presentationStyle="fullScreen"
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.headerButton}
            onPress={onClose}
          >
            <X color={colors.foreground} size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{isEditing ? "Edit Card" : "New Card"}</Text>

          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[styles.headerButton, styles.previewButton]}
            onPress={togglePreview}
          >
            {showPreview ? (
              <EyeOff color={colors.laurel.forest} size={22} />
            ) : (
              <Eye color={colors.laurel.forest} size={22} />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          {/* Front (Question) Input */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Front (Question)</Text>
              <Text style={[styles.charCount, frontCharExceeded && styles.charCountExceeded]}>
                {frontCharCount}/{MAX_FRONT_CHARS}
              </Text>
            </View>
            <TextInput
              multiline
              maxLength={MAX_FRONT_CHARS + 50} // Allow slight overflow to show error
              numberOfLines={4}
              placeholder="Enter the question or prompt..."
              placeholderTextColor={colors.gray[400]}
              style={[
                styles.textInput,
                styles.textInputMultiline,
                frontCharExceeded && styles.textInputError,
              ]}
              textAlignVertical="top"
              value={front}
              onChangeText={setFront}
            />
          </View>

          {/* Back (Answer) Input */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Back (Answer)</Text>
              <Text style={[styles.charCount, backCharExceeded && styles.charCountExceeded]}>
                {backCharCount}/{MAX_BACK_CHARS}
              </Text>
            </View>
            <TextInput
              multiline
              maxLength={MAX_BACK_CHARS + 50}
              numberOfLines={6}
              placeholder="Enter the answer or explanation..."
              placeholderTextColor={colors.gray[400]}
              style={[
                styles.textInput,
                styles.textInputMultilineLarge,
                backCharExceeded && styles.textInputError,
              ]}
              textAlignVertical="top"
              value={back}
              onChangeText={setBack}
            />
          </View>

          {/* Tags Input */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Tags (Optional)</Text>
              <Text style={styles.labelHint}>Comma-separated</Text>
            </View>
            <TextInput
              placeholder="e.g., vocabulary, chapter-1, important"
              placeholderTextColor={colors.gray[400]}
              style={styles.textInput}
              value={tagsInput}
              onChangeText={setTagsInput}
            />
            {tagsInput.length > 0 && (
              <View style={styles.tagsPreview}>
                {parseTags(tagsInput).map((tag, index) => (
                  <View key={index} style={styles.tagChip}>
                    <Text style={styles.tagChipText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Difficulty Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Difficulty Hint</Text>
            <View style={styles.difficultyRow}>
              {(["easy", "medium", "hard"] as CardDifficulty[]).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.difficultyButton,
                    difficulty === level && {
                      backgroundColor: getDifficultyColor(level),
                      borderColor: getDifficultyColor(level),
                    },
                  ]}
                  onPress={() => setDifficulty(level)}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      difficulty === level && styles.difficultyTextActive,
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preview Card */}
          {showPreview && (
            <View style={styles.previewSection}>
              <View style={styles.previewHeader}>
                <Text style={styles.previewTitle}>Preview</Text>
                <TouchableOpacity style={styles.flipButton} onPress={flipPreviewCard}>
                  <RotateCcw color={colors.laurel.forest} size={18} />
                  <Text style={styles.flipButtonText}>Flip</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.previewCardContainer}>
                {/* Front of preview card */}
                <Animated.View
                  style={[
                    styles.previewCard,
                    styles.previewCardFront,
                    {
                      transform: [{ rotateY: frontInterpolate }],
                      opacity: frontOpacity,
                    },
                  ]}
                >
                  <Text style={styles.previewCardLabel}>Question</Text>
                  <Text style={styles.previewCardText}>{front || "Enter a question..."}</Text>
                  {parseTags(tagsInput).length > 0 && (
                    <View style={styles.previewCardTags}>
                      {parseTags(tagsInput)
                        .slice(0, 3)
                        .map((tag, index) => (
                          <View key={index} style={styles.previewTagChip}>
                            <Text style={styles.previewTagText}>{tag}</Text>
                          </View>
                        ))}
                    </View>
                  )}
                </Animated.View>

                {/* Back of preview card */}
                <Animated.View
                  style={[
                    styles.previewCard,
                    styles.previewCardBack,
                    {
                      transform: [{ rotateY: backInterpolate }],
                      opacity: backOpacity,
                    },
                  ]}
                >
                  <Text style={styles.previewCardLabel}>Answer</Text>
                  <Text style={styles.previewCardText}>{back || "Enter an answer..."}</Text>
                  <View style={styles.previewDifficultyBadge}>
                    <View
                      style={[
                        styles.difficultyDot,
                        { backgroundColor: getDifficultyColor(difficulty) },
                      ]}
                    />
                    <Text style={styles.previewDifficultyText}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </Text>
                  </View>
                </Animated.View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          {/* Delete Button (only for existing cards) */}
          {isEditing && onDelete && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Trash2 color={colors.error.DEFAULT} size={20} />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          )}

          {/* Save Button */}
          <TouchableOpacity
            disabled={!isFormValid || frontCharExceeded || backCharExceeded}
            style={[
              styles.saveButton,
              (!isFormValid || frontCharExceeded || backCharExceeded) && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
          >
            <Save color={colors.background} size={20} />
            <Text style={styles.saveButtonText}>{isEditing ? "Save Changes" : "Create Card"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.laurel.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === "ios" ? 60 : spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.sm,
  },
  previewButton: {
    backgroundColor: `${colors.laurel.sage}20`,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  inputSection: {
    marginBottom: spacing.lg,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
  },
  labelHint: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  charCount: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  charCountExceeded: {
    color: colors.error.DEFAULT,
    fontWeight: fontWeight.medium,
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: fontSize.md,
    color: colors.foreground,
  },
  textInputMultiline: {
    minHeight: 100,
    paddingTop: spacing.sm + 4,
  },
  textInputMultilineLarge: {
    minHeight: 140,
    paddingTop: spacing.sm + 4,
  },
  textInputError: {
    borderColor: colors.error.DEFAULT,
    backgroundColor: colors.error.light,
  },
  tagsPreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  tagChip: {
    backgroundColor: `${colors.laurel.sage}30`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  tagChipText: {
    fontSize: fontSize.sm,
    color: colors.laurel.forest,
    fontWeight: fontWeight.medium,
  },
  difficultyRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: spacing.sm + 4,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: "center",
  },
  difficultyText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.mutedForeground,
  },
  difficultyTextActive: {
    color: colors.background,
  },
  previewSection: {
    marginTop: spacing.sm,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  previewTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
  },
  flipButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: `${colors.laurel.sage}20`,
    borderRadius: borderRadius.sm,
  },
  flipButtonText: {
    fontSize: fontSize.sm,
    color: colors.laurel.forest,
    fontWeight: fontWeight.medium,
  },
  previewCardContainer: {
    height: 200,
    position: "relative",
  },
  previewCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    backfaceVisibility: "hidden",
    ...shadow.md,
  },
  previewCardFront: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.laurel.sage,
  },
  previewCardBack: {
    backgroundColor: colors.laurel.forest,
  },
  previewCardLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.laurel.sage,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  previewCardText: {
    fontSize: fontSize.md,
    color: colors.foreground,
    lineHeight: 24,
    flex: 1,
  },
  previewCardTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  previewTagChip: {
    backgroundColor: `${colors.laurel.forest}15`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  previewTagText: {
    fontSize: fontSize.xs,
    color: colors.laurel.forest,
  },
  previewDifficultyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  previewDifficultyText: {
    fontSize: fontSize.sm,
    color: colors.laurel.white,
  },
  bottomActions: {
    flexDirection: "row",
    padding: spacing.md,
    paddingBottom: Platform.OS === "ios" ? spacing.xl : spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error.DEFAULT,
    backgroundColor: colors.error.light,
    gap: spacing.xs,
  },
  deleteButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.error.DEFAULT,
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.laurel.forest,
    gap: spacing.xs,
    ...shadow.sm,
  },
  saveButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  saveButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.background,
  },
});

export default CardEditorModal;
