import { Button, H2, YStack } from "tamagui";
import { useSignOut } from "../../features/auth/mutations/use-sign-out.mutation";

export default function HomeScreen() {
  const signOut = useSignOut();

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$6" gap="$4">
      <H2>Home</H2>
      <Button onPress={() => signOut.mutate()} disabled={signOut.isPending}>
        Sign Out
      </Button>
    </YStack>
  );
}
