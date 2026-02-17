import "@/global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/query-client";
import { Slot, useRouter, useSegments } from "expo-router";
import type { Href } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../features/auth/context/auth.context";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

function AppGate({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    const inAuthGroup = segments[0] === "(auth)";

    if (status === "unauthenticated" && !inAuthGroup) {
      router.replace("/(auth)" as Href);
    } else if (status === "authenticated" && inAuthGroup) {
      router.replace("/(app)");
    }
  }, [status, segments, router]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppGate>
          <GluestackUIProvider mode="dark">
            <Slot />
          </GluestackUIProvider>
        </AppGate>
      </AuthProvider>
    </QueryClientProvider>
  );
}
