import { useCallback, useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { useProfile } from "../../auth/queries/use-profile.query";
import { useThemeColors } from "../../../shared/theme/use-theme-colors";

function StatItem({
  count,
  label,
  accentColor,
  mutedColor,
}: {
  count: number;
  label: string;
  accentColor: string;
  mutedColor: string;
}) {
  return (
    <Pressable style={{ alignItems: "center", paddingHorizontal: 8 }}>
      <Text
        bold
        style={{ fontSize: 17, color: accentColor, letterSpacing: 0.3 }}
      >
        {count.toLocaleString()}
      </Text>
      <Text
        style={{
          fontSize: 11,
          color: mutedColor,
          marginTop: 2,
          letterSpacing: 0.8,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function StatDivider({ color }: { color: string }) {
  return (
    <Box
      style={{
        width: 1,
        height: 28,
        backgroundColor: color,
        opacity: 0.25,
      }}
    />
  );
}

const ICON_BG = "rgba(0, 0, 0, 0.45)";

function HeaderIconButton({
  icon,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: ICON_BG,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name={icon} size={18} color="#fff" />
    </Pressable>
  );
}

type Tab = "activities" | "about";

export function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const profile = useProfile();
  const [activeTab, setActiveTab] = useState<Tab>("activities");
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      setScrolled(y > 20);
    },
    [],
  );

  return (
    <Box className="flex-1 bg-background-0">
      {/* Fixed header */}
      <HStack
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          paddingTop: insets.top + 8,
          paddingHorizontal: 16,
          paddingBottom: 10,
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: scrolled ? colors.alpha.black(0.45) : "transparent",
        }}
      >
        <HeaderIconButton icon="arrow-back" onPress={() => router.back()} />

        <HStack style={{ gap: 10 }}>
          <HeaderIconButton icon="pencil-outline" />
          <HeaderIconButton icon="ellipsis-horizontal" />
        </HStack>
      </HStack>

      <ScrollView
        style={{ flex: 1 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Banner */}
        <Box>
          {profile?.bannerUrl ? (
            <Image
              source={{ uri: profile.bannerUrl }}
              style={{ width: "100%", height: 120 + insets.top }}
              resizeMode="cover"
            />
          ) : (
            <Box
              className="bg-background-50"
              style={{ width: "100%", height: 120 + insets.top }}
            />
          )}
        </Box>

        {/* Avatar + Team badge */}
        <HStack
          style={{
            paddingHorizontal: 20,
            marginTop: -40,
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          {profile?.avatarUrl ? (
            <Image
              source={{ uri: profile.avatarUrl }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                borderWidth: 3,
                borderColor: colors.background[0],
              }}
            />
          ) : (
            <Box
              className="bg-background-50 rounded-full items-center justify-center"
              style={{
                width: 80,
                height: 80,
                borderWidth: 3,
                borderColor: colors.background[0],
              }}
            >
              <Ionicons
                name="person"
                size={36}
                color={colors.typography[400]}
              />
            </Box>
          )}

          <Image
            source={{
              uri: "https://i.ibb.co/4nZdBWkq/furia-esports-logo-png-seeklogo-428783.png",
            }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              top: 12,
            }}
          />
        </HStack>

        {/* Name & Username */}
        <Box style={{ paddingHorizontal: 20, marginTop: 12 }}>
          <Text bold className="text-typography-900" style={{ fontSize: 20 }}>
            {profile?.name ?? "..."}
          </Text>
          <Text
            className="text-typography-400"
            style={{ fontSize: 14, marginTop: 2 }}
          >
            @{profile?.userName ?? "..."}
          </Text>
        </Box>
        {/* Bio */}
        {profile?.bio ? (
          <Box style={{ paddingHorizontal: 20, marginTop: 16 }}>
            <Text
              className="text-typography-700"
              style={{ fontSize: 14, lineHeight: 20 }}
            >
              {profile.bio}
            </Text>
          </Box>
        ) : null}
        {/* Connection Stats */}
        <HStack
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            paddingVertical: 14,
            marginHorizontal: 32,
            borderRadius: 12,
            backgroundColor: colors.alpha.black(0.15),
            gap: 16,
          }}
        >
          <StatItem
            count={128}
            label="Followers"
            accentColor={colors.typography[900]}
            mutedColor={colors.typography[400]}
          />
          <StatDivider color={colors.typography[400]} />
          <StatItem
            count={64}
            label="Following"
            accentColor={colors.typography[900]}
            mutedColor={colors.typography[400]}
          />
          <StatDivider color={colors.typography[400]} />
          <StatItem
            count={42}
            label="Posts"
            accentColor={colors.typography[900]}
            mutedColor={colors.typography[400]}
          />
        </HStack>

        {/* Location */}
        {profile?.location ? (
          <HStack
            space="xs"
            style={{
              paddingHorizontal: 20,
              marginTop: 8,
              alignItems: "center",
            }}
          >
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.typography[400]}
            />
            <Text className="text-typography-400" style={{ fontSize: 13 }}>
              {profile.location}
            </Text>
          </HStack>
        ) : null}

        {/* Team */}
        <HStack
          space="xs"
          style={{
            paddingHorizontal: 20,
            marginTop: 8,
            alignItems: "center",
          }}
        >
          <Ionicons
            name="business-outline"
            size={14}
            color={colors.typography[400]}
          />
          <Text className="text-typography-400" style={{ fontSize: 13 }}>
            FuriaGG
          </Text>
        </HStack>

        {/* Tabs */}
        <HStack className="border-b border-outline-0" style={{ marginTop: 24 }}>
          <Pressable
            onPress={() => setActiveTab("activities")}
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 12,
              borderBottomWidth: 2,
              borderBottomColor:
                activeTab === "activities"
                  ? colors.primary[500]
                  : "transparent",
            }}
          >
            <Text
              bold={activeTab === "activities"}
              style={{
                fontSize: 14,
                color:
                  activeTab === "activities"
                    ? colors.primary[500]
                    : colors.typography[400],
              }}
            >
              Activities
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("about")}
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 12,
              borderBottomWidth: 2,
              borderBottomColor:
                activeTab === "about" ? colors.primary[500] : "transparent",
            }}
          >
            <Text
              bold={activeTab === "about"}
              style={{
                fontSize: 14,
                color:
                  activeTab === "about"
                    ? colors.primary[500]
                    : colors.typography[400],
              }}
            >
              Career
            </Text>
          </Pressable>
        </HStack>

        {/* Tab content */}
        <Box style={{ padding: 20, alignItems: "center", paddingTop: 40 }}>
          <Text className="text-typography-400" style={{ fontSize: 14 }}>
            {activeTab === "activities"
              ? "Nenhuma atividade ainda"
              : "Em breve"}
          </Text>
        </Box>
      </ScrollView>
    </Box>
  );
}
