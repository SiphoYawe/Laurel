import { Tabs } from "expo-router";
import { Home, MessageCircle, CheckCircle, BookOpen, Users, User } from "lucide-react-native";
import { View, Text, StyleSheet } from "react-native";

import type { LucideIcon } from "lucide-react-native";

/**
 * Tab Layout
 * 6 tabs: Home, Chat, Habits, Learn, Pods, Profile
 * Matches web app navigation structure
 */

// Laurel brand colors
const colors = {
  forest: "#2D5A3D",
  sage: "#7CB07F",
  amber: "#E8A54B",
  white: "#FAFAF8",
  charcoal: "#1A1A1A",
  muted: "#6B7280",
  border: "#E5E7EB",
};

interface TabIconProps {
  icon: LucideIcon;
  label: string;
  focused: boolean;
  badge?: number | boolean;
}

function TabIcon({ icon: Icon, label, focused, badge }: TabIconProps) {
  const color = focused ? colors.forest : colors.muted;

  return (
    <View style={styles.tabIconContainer}>
      <View style={styles.iconWrapper}>
        <Icon color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
        {badge && (
          <View style={[styles.badge, { backgroundColor: colors.amber }]}>
            {typeof badge === "number" && badge > 0 && (
              <Text style={styles.badgeText}>{badge > 9 ? "9+" : badge}</Text>
            )}
          </View>
        )}
      </View>
      <Text style={[styles.tabLabel, { color, fontWeight: focused ? "600" : "400" }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
  },
  iconWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: -4,
    top: -4,
    height: 16,
    width: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#fff",
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 10,
  },
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={Home} label="Home" />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={MessageCircle} label="Chat" />
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: "Habits",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={CheckCircle} label="Habits" />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={BookOpen} label="Learn" />,
        }}
      />
      <Tabs.Screen
        name="pods"
        options={{
          title: "Pods",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={Users} label="Pods" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={User} label="Profile" />,
        }}
      />
    </Tabs>
  );
}
