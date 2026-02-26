import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

export default function NotificationsScreen() {
  return (
    <Box style={{ flex: 1, backgroundColor: "#0C0C0F", alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "#40404F", fontSize: 15 }}>Em breve</Text>
    </Box>
  );
}
