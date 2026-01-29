import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌿 Laurel</Text>
      <Text style={styles.subtitle}>AI-powered habit coaching using Atomic Habits methodology</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#16a34a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#166534",
    textAlign: "center",
  },
});
