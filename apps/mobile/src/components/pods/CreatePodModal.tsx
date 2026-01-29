import { X, Check, Lock, Globe, Users, ChevronLeft, ChevronRight, Copy } from "lucide-react-native";
import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
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
 * Category type definition
 */
type PodCategory = "health" | "fitness" | "learning" | "career" | "creative";

/**
 * New pod data structure
 */
export interface NewPod {
  name: string;
  description: string;
  category: PodCategory;
  isPrivate: boolean;
  maxMembers: number;
}

/**
 * CreatePodModal component props
 */
export interface CreatePodModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (pod: NewPod) => void;
}

/**
 * Category configuration with colors and icons
 */
const CATEGORIES: {
  id: PodCategory;
  label: string;
  color: string;
  emoji: string;
}[] = [
  { id: "health", label: "Health", color: colors.laurel.sage, emoji: "💚" },
  { id: "fitness", label: "Fitness", color: colors.laurel.forest, emoji: "💪" },
  { id: "learning", label: "Learning", color: colors.laurel.amber, emoji: "📚" },
  { id: "career", label: "Career", color: colors.laurel.forestLight, emoji: "💼" },
  { id: "creative", label: "Creative", color: "#9B7ED9", emoji: "🎨" },
];

/**
 * Generate a random invite code
 */
function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * CategoryChip - Selectable category button
 */
function CategoryChip({
  category,
  isSelected,
  onSelect,
}: {
  category: (typeof CATEGORIES)[number];
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.categoryChip,
        isSelected && {
          backgroundColor: category.color,
          borderColor: category.color,
        },
      ]}
      onPress={onSelect}
    >
      <Text style={styles.categoryEmoji}>{category.emoji}</Text>
      <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
        {category.label}
      </Text>
      {isSelected && <Check color={colors.laurel.white} size={14} style={styles.checkIcon} />}
    </TouchableOpacity>
  );
}

/**
 * PrivacyOption - Radio button for privacy selection
 */
function PrivacyOption({
  isPrivate,
  isSelected,
  onSelect,
}: {
  isPrivate: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Icon = isPrivate ? Lock : Globe;
  const label = isPrivate ? "Private" : "Public";
  const description = isPrivate
    ? "Only people with invite code can join"
    : "Anyone can find and join this pod";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.privacyOption, isSelected && styles.privacyOptionSelected]}
      onPress={onSelect}
    >
      <View
        style={[styles.privacyIconContainer, isSelected && styles.privacyIconContainerSelected]}
      >
        <Icon color={isSelected ? colors.laurel.white : colors.laurel.forest} size={20} />
      </View>
      <View style={styles.privacyTextContainer}>
        <Text style={[styles.privacyLabel, isSelected && styles.privacyLabelSelected]}>
          {label}
        </Text>
        <Text style={styles.privacyDescription}>{description}</Text>
      </View>
      <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
        {isSelected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );
}

/**
 * MemberSlider - Custom slider for max members
 */
function MemberSlider({ value, onChange }: { value: number; onChange: (val: number) => void }) {
  const minMembers = 5;
  const maxMembers = 20;

  const handleDecrement = () => {
    if (value > minMembers) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < maxMembers) {
      onChange(value + 1);
    }
  };

  return (
    <View style={styles.sliderContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={value <= minMembers}
        style={[styles.sliderButton, value <= minMembers && styles.sliderButtonDisabled]}
        onPress={handleDecrement}
      >
        <ChevronLeft
          color={value <= minMembers ? colors.gray[300] : colors.laurel.forest}
          size={24}
        />
      </TouchableOpacity>

      <View style={styles.sliderValueContainer}>
        <Users color={colors.laurel.forest} size={20} />
        <Text style={styles.sliderValue}>{value}</Text>
        <Text style={styles.sliderLabel}>members max</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        disabled={value >= maxMembers}
        style={[styles.sliderButton, value >= maxMembers && styles.sliderButtonDisabled]}
        onPress={handleIncrement}
      >
        <ChevronRight
          color={value >= maxMembers ? colors.gray[300] : colors.laurel.forest}
          size={24}
        />
      </TouchableOpacity>
    </View>
  );
}

/**
 * SuccessView - Shown after successful pod creation
 */
function SuccessView({
  podName,
  inviteCode,
  onDone,
}: {
  podName: string;
  inviteCode: string;
  onDone: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // In a real app, use Clipboard API
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.successContainer}>
      <View style={styles.successIconContainer}>
        <Check color={colors.laurel.white} size={48} />
      </View>

      <Text style={styles.successTitle}>Pod Created!</Text>
      <Text style={styles.successSubtitle}>
        Your pod &quot;{podName}&quot; is ready for members
      </Text>

      <View style={styles.inviteCodeContainer}>
        <Text style={styles.inviteCodeLabel}>Invite Code</Text>
        <View style={styles.inviteCodeRow}>
          <Text style={styles.inviteCode}>{inviteCode}</Text>
          <TouchableOpacity activeOpacity={0.7} style={styles.copyButton} onPress={handleCopy}>
            {copied ? (
              <Check color={colors.laurel.forest} size={18} />
            ) : (
              <Copy color={colors.laurel.forest} size={18} />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.inviteCodeHint}>Share this code with friends to invite them</Text>
      </View>

      <TouchableOpacity activeOpacity={0.8} style={styles.doneButton} onPress={onDone}>
        <Text style={styles.doneButtonText}>Go to Pod</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * CreatePodModal Component
 *
 * Bottom sheet modal for creating a new pod with form validation.
 * Features category selection, privacy toggle, member limit slider,
 * and generates invite code on success.
 */
export function CreatePodModal({ visible, onClose, onCreate }: CreatePodModalProps) {
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<PodCategory>("health");
  const [isPrivate, setIsPrivate] = useState(false);
  const [maxMembers, setMaxMembers] = useState(10);

  // UI state
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  // Animation values
  const translateY = useSharedValue(1000);
  const backdropOpacity = useSharedValue(0);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: { name?: string; description?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Pod name is required";
    } else if (name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (name.trim().length > 30) {
      newErrors.name = "Name must be less than 30 characters";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (description.trim().length > 150) {
      newErrors.description = "Description must be less than 150 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const resetForm = useCallback(() => {
    setName("");
    setDescription("");
    setCategory("health");
    setIsPrivate(false);
    setMaxMembers(10);
    setErrors({});
    setIsCreating(false);
    setShowSuccess(false);
    setInviteCode("");
  }, []);

  const handleClose = useCallback(() => {
    const closeModal = () => {
      resetForm();
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
  }, [translateY, backdropOpacity, onClose, resetForm]);

  // Handle create action
  const handleCreate = useCallback(() => {
    if (!validateForm()) {
      return;
    }

    setIsCreating(true);

    // Simulate API call
    setTimeout(() => {
      const code = generateInviteCode();
      setInviteCode(code);
      setIsCreating(false);
      setShowSuccess(true);
    }, 1500);
  }, [name, description, category, isPrivate, maxMembers]);

  // Handle done after success
  const handleDone = useCallback(() => {
    const newPod: NewPod = {
      name: name.trim(),
      description: description.trim(),
      category,
      isPrivate,
      maxMembers,
    };

    onCreate(newPod);
    handleClose();
  }, [name, description, category, isPrivate, maxMembers, onCreate, handleClose]);

  // Trigger animations when visibility changes
  if (visible && translateY.value === 1000) {
    handleOpen();
  }

  const isFormValid = name.trim().length >= 3 && description.trim().length >= 10;

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

            {showSuccess ? (
              <SuccessView inviteCode={inviteCode} podName={name} onDone={handleDone} />
            ) : (
              <>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>Create a Pod</Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.closeButton}
                    onPress={handleClose}
                  >
                    <X color={colors.gray[500]} size={24} />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  contentContainerStyle={styles.scrollContent}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  style={styles.scrollView}
                >
                  {/* Name Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Pod Name</Text>
                    <TextInput
                      maxLength={30}
                      placeholder="Give your pod a name..."
                      placeholderTextColor={colors.mutedForeground}
                      style={[styles.textInput, errors.name ? styles.textInputError : undefined]}
                      value={name}
                      onChangeText={(text) => {
                        setName(text);
                        if (errors.name) {
                          setErrors((prev) => ({ ...prev, name: undefined }));
                        }
                      }}
                    />
                    {errors.name ? (
                      <Text style={styles.errorText}>{errors.name}</Text>
                    ) : (
                      <Text style={styles.charCount}>{name.length}/30</Text>
                    )}
                  </View>

                  {/* Description Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                      multiline
                      maxLength={150}
                      numberOfLines={3}
                      placeholder="What's your pod about?"
                      placeholderTextColor={colors.mutedForeground}
                      style={[
                        styles.textInput,
                        styles.textArea,
                        errors.description ? styles.textInputError : undefined,
                      ]}
                      textAlignVertical="top"
                      value={description}
                      onChangeText={(text) => {
                        setDescription(text);
                        if (errors.description) {
                          setErrors((prev) => ({
                            ...prev,
                            description: undefined,
                          }));
                        }
                      }}
                    />
                    {errors.description ? (
                      <Text style={styles.errorText}>{errors.description}</Text>
                    ) : (
                      <Text style={styles.charCount}>{description.length}/150</Text>
                    )}
                  </View>

                  {/* Category Selection */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category</Text>
                    <View style={styles.categoryGrid}>
                      {CATEGORIES.map((cat) => (
                        <CategoryChip
                          key={cat.id}
                          category={cat}
                          isSelected={category === cat.id}
                          onSelect={() => setCategory(cat.id)}
                        />
                      ))}
                    </View>
                  </View>

                  {/* Privacy Selection */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Privacy</Text>
                    <View style={styles.privacyContainer}>
                      <PrivacyOption
                        isPrivate={false}
                        isSelected={!isPrivate}
                        onSelect={() => setIsPrivate(false)}
                      />
                      <PrivacyOption
                        isPrivate={true}
                        isSelected={isPrivate}
                        onSelect={() => setIsPrivate(true)}
                      />
                    </View>
                  </View>

                  {/* Max Members */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Maximum Members</Text>
                    <MemberSlider value={maxMembers} onChange={setMaxMembers} />
                  </View>
                </ScrollView>

                {/* Create Button */}
                <View style={styles.footer}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={!isFormValid || isCreating}
                    style={[
                      styles.createButton,
                      (!isFormValid || isCreating) && styles.createButtonDisabled,
                    ]}
                    onPress={handleCreate}
                  >
                    {isCreating ? (
                      <ActivityIndicator color={colors.laurel.white} size="small" />
                    ) : (
                      <Text style={styles.createButtonText}>Create Pod</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
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
    maxHeight: "90%",
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.muted,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSize.md,
    color: colors.foreground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textInputError: {
    borderColor: colors.error.DEFAULT,
  },
  textArea: {
    minHeight: 80,
    paddingTop: spacing.sm + 2,
  },
  charCount: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    textAlign: "right",
    marginTop: spacing.xs,
  },
  errorText: {
    fontSize: fontSize.xs,
    color: colors.error.DEFAULT,
    marginTop: spacing.xs,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.muted,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryEmoji: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  categoryChipText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
  },
  categoryChipTextSelected: {
    color: colors.laurel.white,
  },
  checkIcon: {
    marginLeft: spacing.xs,
  },
  privacyContainer: {
    gap: spacing.sm,
  },
  privacyOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.muted,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  privacyOptionSelected: {
    borderColor: colors.laurel.forest,
    backgroundColor: `${colors.laurel.forest}08`,
  },
  privacyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.laurel.forest}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  privacyIconContainerSelected: {
    backgroundColor: colors.laurel.forest,
  },
  privacyTextContainer: {
    flex: 1,
  },
  privacyLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: 2,
  },
  privacyLabelSelected: {
    color: colors.laurel.forest,
  },
  privacyDescription: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.gray[300],
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: colors.laurel.forest,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.laurel.forest,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.muted,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sliderButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.sm,
  },
  sliderButtonDisabled: {
    backgroundColor: colors.gray[100],
    ...shadow.sm,
  },
  sliderValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  sliderValue: {
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.bold,
    color: colors.laurel.forest,
  },
  sliderLabel: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  createButton: {
    backgroundColor: colors.laurel.forest,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.md,
  },
  createButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
  createButtonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.laurel.white,
  },
  // Success View Styles
  successContainer: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing["2xl"],
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.laurel.forest,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  successSubtitle: {
    fontSize: fontSize.md,
    color: colors.mutedForeground,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  inviteCodeContainer: {
    width: "100%",
    backgroundColor: colors.muted,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  inviteCodeLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.mutedForeground,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inviteCodeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  inviteCode: {
    fontSize: fontSize["3xl"],
    fontWeight: fontWeight.bold,
    color: colors.laurel.forest,
    letterSpacing: 4,
  },
  copyButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: `${colors.laurel.forest}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  inviteCodeHint: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    marginTop: spacing.sm,
  },
  doneButton: {
    width: "100%",
    backgroundColor: colors.laurel.forest,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
    ...shadow.md,
  },
  doneButtonText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.laurel.white,
  },
});

export default CreatePodModal;
