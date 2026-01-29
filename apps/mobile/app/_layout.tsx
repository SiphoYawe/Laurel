import "../src/global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "@/providers/AuthProvider";
import { TRPCProvider } from "@/providers/TRPCProvider";

/**
 * Root Layout
 * Sets up global providers and navigation structure
 */
export default function RootLayout() {
  return (
    <TRPCProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen
              name="onboarding"
              options={{
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
          </Stack>
        </SafeAreaProvider>
      </AuthProvider>
    </TRPCProvider>
  );
}
