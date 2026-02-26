import { useState } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { AppDrawer } from "../../features/app/components/app-drawer";
import { useThemeColors } from "../../shared/theme/use-theme-colors";
import { useProfileQuery } from "../../features/auth/queries/use-profile.query";

function AppHeader({ onAvatarPress }: { onAvatarPress: () => void }) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  return (
    <Box
      className="border-b border-outline-0"
      style={{
        paddingTop: insets.top + 12,
        paddingHorizontal: 20,
        paddingBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.background[0],
      }}
    >
      <Pressable
        onPress={onAvatarPress}
        className="bg-background-50 rounded-full items-center justify-center"
        style={{ width: 36, height: 36 }}
      >
        <Ionicons name="person" size={18} color={colors.typography[400]} />
      </Pressable>

      <Text
        bold
        className="text-primary-500"
        style={{ fontSize: 18, letterSpacing: 1 }}
      >
        InPro
      </Text>

      <Pressable
        className="rounded-full items-center justify-center"
        style={{ width: 36, height: 36 }}
      >
        <Ionicons
          name="person-add-outline"
          size={18}
          color={colors.typography[900]}
        />
      </Pressable>
    </Box>
  );
}

export default function AppLayout() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [drawerOpen, setDrawerOpen] = useState(false);
  useProfileQuery();

  return (
    <Box className="flex-1 bg-background-0">
      <AppHeader onAvatarPress={() => setDrawerOpen(true)} />
      <AppDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.background[0],
            borderTopColor: colors.outline[0],
            borderTopWidth: 1,
            height: 56 + insets.bottom,
            paddingBottom: insets.bottom + 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: colors.primary[500],
          tabBarInactiveTintColor: colors.typography[300],
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "500",
            marginTop: 1,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Início",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Pesquisar",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "search" : "search-outline"}
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="conversations"
          options={{
            title: "Conversas",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "chatbubbles" : "chatbubbles-outline"}
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: "Notificações",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "notifications" : "notifications-outline"}
                size={22}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </Box>
  );
}
