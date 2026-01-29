import { router } from "expo-router";
import {
  Sparkles,
  Target,
  Brain,
  Users,
  Trophy,
  ChevronRight,
  ChevronLeft,
  type LucideIcon,
} from "lucide-react-native";
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Onboarding Screen
 * 5-step onboarding wizard for new users
 */

const { width } = Dimensions.get("window");

const colors = {
  forest: "#2D5A3D",
  sage: "#7CB07F",
  amber: "#E8A54B",
  white: "#FAFAF8",
  charcoal: "#1A1A1A",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
};

interface OnboardingStep {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
}

const steps: OnboardingStep[] = [
  {
    icon: Sparkles,
    iconColor: colors.forest,
    iconBg: `${colors.forest}15`,
    title: "Welcome to Laurel",
    description:
      "Your AI-powered habit coach. Build lasting habits using proven techniques from Atomic Habits.",
  },
  {
    icon: Target,
    iconColor: colors.amber,
    iconBg: `${colors.amber}15`,
    title: "Track Your Habits",
    description:
      "Create habits, track daily completions, and watch your streaks grow. Small wins compound over time.",
  },
  {
    icon: Brain,
    iconColor: colors.sage,
    iconBg: `${colors.sage}15`,
    title: "Learn Smarter",
    description:
      "Use spaced repetition flashcards to remember what matters. The science-backed way to learn.",
  },
  {
    icon: Users,
    iconColor: colors.forest,
    iconBg: `${colors.forest}15`,
    title: "Join Accountability Pods",
    description:
      "Connect with others on similar goals. Stay motivated with friendly competition and support.",
  },
  {
    icon: Trophy,
    iconColor: colors.amber,
    iconBg: `${colors.amber}15`,
    title: "Earn Rewards",
    description:
      "Level up, earn badges, and celebrate your progress. Gamification makes habit building fun!",
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      // Complete onboarding
      router.replace("/(tabs)");
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  const Icon = step.icon;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Skip Button */}
        <View style={styles.header}>
          {!isFirstStep ? (
            <TouchableOpacity activeOpacity={0.7} style={styles.backButton} onPress={handleBack}>
              <ChevronLeft color={colors.gray500} size={24} />
            </TouchableOpacity>
          ) : (
            <View style={styles.backButton} />
          )}
          <TouchableOpacity activeOpacity={0.7} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Dots */}
        <View style={styles.progressContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentStep && styles.progressDotActive,
                index < currentStep && styles.progressDotCompleted,
              ]}
            />
          ))}
        </View>

        {/* Content */}
        <View style={styles.stepContent}>
          <View style={[styles.iconContainer, { backgroundColor: step.iconBg }]}>
            <Icon color={step.iconColor} size={48} />
          </View>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.description}>{step.description}</Text>
        </View>

        {/* Navigation */}
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.nextButton, { backgroundColor: colors.forest }]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>{isLastStep ? "Get Started" : "Continue"}</Text>
            {!isLastStep && <ChevronRight color="#fff" size={20} />}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  skipText: {
    fontSize: 16,
    color: colors.gray500,
    fontWeight: "500",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginVertical: 24,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray100,
  },
  progressDotActive: {
    width: 24,
    backgroundColor: colors.forest,
  },
  progressDotCompleted: {
    backgroundColor: colors.sage,
  },
  stepContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.charcoal,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.gray500,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  footer: {
    paddingBottom: 24,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    paddingVertical: 16,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});
