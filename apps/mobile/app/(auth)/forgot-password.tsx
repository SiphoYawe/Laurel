import { router } from "expo-router";
import { Mail, ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Forgot Password Screen
 * Request password reset via email
 */

const colors = {
  forest: "#2D5A3D",
  sage: "#7CB07F",
  amber: "#E8A54B",
  white: "#FAFAF8",
  charcoal: "#1A1A1A",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  red500: "#EF4444",
  green50: "#F0FDF4",
  green500: "#22C55E",
};

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    setError(undefined);
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // TODO: Implement actual password reset
      console.log("Password reset requested for:", email);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
    } catch (err) {
      console.error("Password reset error:", err);
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          {/* Back Button */}
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color={colors.charcoal} size={24} />
          </TouchableOpacity>

          {/* Success Content */}
          <View style={styles.successContent}>
            <View style={styles.successIconContainer}>
              <Mail color={colors.green500} size={32} />
            </View>
            <Text style={styles.successTitle}>Check your email</Text>
            <Text style={styles.successMessage}>
              We&apos;ve sent password reset instructions to{"\n"}
              <Text style={styles.emailHighlight}>{email}</Text>
            </Text>
            <Text style={styles.successNote}>
              Didn&apos;t receive the email? Check your spam folder or try again with a different
              email address.
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.successActions}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={() => router.replace("/(auth)/login")}
            >
              <Text style={styles.buttonText}>Back to Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.retryButton}
              onPress={() => setIsSuccess(false)}
            >
              <Text style={styles.retryButtonText}>Try different email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color={colors.charcoal} size={24} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Forgot password?</Text>
            <Text style={styles.subtitle}>
              No worries! Enter your email and we&apos;ll send you reset instructions.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
                <Mail color={colors.gray400} size={20} style={styles.inputIcon} />
                <TextInput
                  autoFocus
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="Enter your email"
                  placeholderTextColor={colors.gray400}
                  style={styles.input}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError(undefined);
                  }}
                />
              </View>
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={isSubmitting}
              style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={handleResetPassword}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Back to Login */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.backToLoginButton}
              onPress={() => router.back()}
            >
              <ArrowLeft color={colors.forest} size={16} />
              <Text style={styles.backToLoginText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.gray50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.charcoal,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray500,
    lineHeight: 24,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.charcoal,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray100,
    paddingHorizontal: 16,
    height: 52,
  },
  inputError: {
    borderColor: colors.red500,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.charcoal,
  },
  errorText: {
    fontSize: 12,
    color: colors.red500,
    marginTop: 6,
  },
  button: {
    backgroundColor: colors.forest,
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  footer: {
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 24,
  },
  backToLoginButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backToLoginText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.forest,
  },
  // Success state styles
  successContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  successContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.green50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.charcoal,
    marginBottom: 12,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    color: colors.gray500,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 16,
  },
  emailHighlight: {
    fontWeight: "600",
    color: colors.charcoal,
  },
  successNote: {
    fontSize: 14,
    color: colors.gray400,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  successActions: {
    paddingBottom: 32,
  },
  retryButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.forest,
  },
});
