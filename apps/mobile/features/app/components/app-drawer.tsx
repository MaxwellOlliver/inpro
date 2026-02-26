import { Modal, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { useSignOut } from "../../auth/mutations/use-sign-out.mutation";
import { useAuth } from "../../auth/context/auth.context";
import { useThemeColors } from "../../../shared/theme/use-theme-colors";

interface AppDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface DrawerItemProps {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

function DrawerItem({ icon, label, onPress, destructive }: DrawerItemProps) {
  const colors = useThemeColors();
  const color = destructive ? colors.error[500] : colors.typography[700];

  return (
    <Pressable onPress={onPress}>
      <HStack
        space="md"
        style={{
          paddingVertical: 14,
          paddingHorizontal: 24,
          alignItems: "center",
        }}
      >
        <Ionicons name={icon} size={20} color={color} />
        <Text style={{ color, fontSize: 15 }}>{label}</Text>
      </HStack>
    </Pressable>
  );
}

export function AppDrawer({ open, onClose }: AppDrawerProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { profile } = useAuth();
  const signOut = useSignOut();

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View
          style={{
            width: "75%",
            backgroundColor: colors.background[0],
            borderRightWidth: 1,
            borderRightColor: colors.outline[0],
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          }}
        >
          <VStack className="border-b border-outline-0 p-6" space="md">
            <HStack space="md">
              <Box
                className="bg-background-50 rounded-full items-center justify-center"
                style={{ width: 42, height: 42 }}
              >
                <Ionicons
                  name="person"
                  size={22}
                  color={colors.typography[400]}
                />
              </Box>
              <Box>
                <Text
                  bold
                  className="text-typography-900"
                  style={{ fontSize: 16 }}
                >
                  {profile?.name ?? "..."}
                </Text>
                <Text
                  className="text-typography-400"
                  style={{ fontSize: 13, marginTop: 2 }}
                >
                  @{profile?.userName ?? "..."}
                </Text>
              </Box>
            </HStack>
            <Text className="text-typography-900">{profile?.bio}</Text>
          </VStack>

          <VStack style={{ flex: 1, paddingTop: 8 }}>
            <DrawerItem
              icon="person-outline"
              label="Perfil"
              onPress={onClose}
            />
            <DrawerItem
              icon="settings-outline"
              label="Configurações"
              onPress={onClose}
            />
            <DrawerItem
              icon="moon-outline"
              label="Aparência"
              onPress={onClose}
            />
          </VStack>

          <Box className="border-t border-outline-0" style={{ paddingTop: 8 }}>
            {signOut.isPending ? (
              <Box style={{ paddingVertical: 14, paddingHorizontal: 24 }}>
                <ActivityIndicator
                  size="small"
                  color={colors.typography[400]}
                />
              </Box>
            ) : (
              <DrawerItem
                icon="log-out-outline"
                label="Sair"
                destructive
                onPress={() => signOut.mutate()}
              />
            )}
          </Box>
        </View>

        <Pressable
          onPress={onClose}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        />
      </View>
    </Modal>
  );
}
