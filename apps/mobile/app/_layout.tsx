import { QueryClientProvider } from "@tanstack/react-query";
import { TamaguiProvider } from "tamagui";
import { config } from "../tamagui.config";
import { queryClient } from "../lib/query-client";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider config={config} defaultTheme="light">
        <Slot />
      </TamaguiProvider>
    </QueryClientProvider>
  );
}
