import { Stack } from "expo-router";

/**
 * Onboarding Layout
 * Modal stack for the 5-step onboarding wizard
 */

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: false,
      }}
    />
  );
}
