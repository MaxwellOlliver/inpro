import { useState } from "react";
import { Link } from "expo-router";
import { useSignIn } from "../mutations/use-sign-in.mutation";
import { Text, View } from "react-native";

export function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signIn = useSignIn();

  const handleSignIn = () => {
    signIn.mutate({ email: email.trim(), password });
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
    </View>
  );
}
