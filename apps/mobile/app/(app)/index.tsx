import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useSignOut } from "../../features/auth/mutations/use-sign-out.mutation";

export default function HomeScreen() {
  const signOut = useSignOut();

  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="mb-4 text-3xl font-bold text-black">Home</Text>
      <Pressable
        onPress={() => signOut.mutate()}
        disabled={signOut.isPending}
        className={`min-w-32 items-center rounded-lg bg-blue-600 px-4 py-3 ${
          signOut.isPending ? "opacity-60" : ""
        }`}
      >
        {signOut.isPending ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="font-semibold text-white">Sign Out</Text>
        )}
      </Pressable>
    </View>
  );
}
