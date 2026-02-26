import { Link } from "expo-router";
import { ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";

const bgImage = require("@/assets/images/home-bg.jpg");

export function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <Box className="flex-1">
      <ImageBackground source={bgImage} className="flex-1" resizeMode="cover">
        <LinearGradient
          colors={[
            "transparent",
            "rgba(116 9 136 / 0.3)",
            "rgba(116 9 136 / 0.8)",
          ]}
          locations={[0, 0.5, 1]}
          style={{ flex: 1 }}
        >
          <VStack
            className="flex-1 justify-end px-8"
            style={{ paddingBottom: insets.bottom + 32 }}
          >
            {/* Branding */}
            <Text size="5xl" bold className="tracking-tight text-white">
              InPro
            </Text>
            <Text
              size="lg"
              className="mt-3 leading-relaxed text-white/80 mb-16"
            >
              Connect, create, and grow with a community that inspires you.
            </Text>

            {/* CTA Buttons */}
            <VStack space="lg" className="mt-10">
              <Link href="/(auth)/sign-up" asChild>
                <Button size="xl" action="primary">
                  <ButtonText className="tracking-wide">Get Started</ButtonText>
                </Button>
              </Link>

              <Link href="/(auth)/sign-in" asChild>
                <Button size="xl" action="secondary" variant="outline">
                  <ButtonText className="tracking-wide">Sign In</ButtonText>
                </Button>
              </Link>
            </VStack>
          </VStack>
        </LinearGradient>
      </ImageBackground>
    </Box>
  );
}
