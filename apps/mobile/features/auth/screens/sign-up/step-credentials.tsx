import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface StepCredentialsProps {
  initialData: { email: string; password: string };
  onNext: (data: { email: string; password: string }) => void;
}

export function StepCredentials({ initialData, onNext }: StepCredentialsProps) {
  const [email, setEmail] = useState(initialData.email);
  const [password, setPassword] = useState(initialData.password);
  const [confirmPassword, setConfirmPassword] = useState("");

  const isValid =
    email.trim().length > 0 &&
    password.length >= 8 &&
    password === confirmPassword;

  return (
    <View className="flex-1 justify-center px-6">
      <Text className="text-center text-3xl font-bold text-black">
        Create Account
      </Text>
      <Text className="mt-1 text-center text-base text-neutral-500">
        Step 1 of 3 - Your credentials
      </Text>

      <View className="mt-4 gap-3">
        <TextInput
          className="rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <TextInput
          className="rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base"
          placeholder="Password (min 8 characters)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
        />
        <TextInput
          className="rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoComplete="new-password"
        />
      </View>

      {password.length > 0 && password.length < 8 && (
        <Text className="mt-2 text-sm text-red-500">
          Password must be at least 8 characters
        </Text>
      )}

      {confirmPassword.length > 0 && password !== confirmPassword && (
        <Text className="mt-1 text-sm text-red-500">Passwords do not match</Text>
      )}

      <Pressable
        onPress={() => onNext({ email: email.trim(), password })}
        disabled={!isValid}
        className={`mt-4 items-center rounded-lg bg-blue-600 px-4 py-3 ${
          !isValid ? "opacity-60" : ""
        }`}
      >
        <Text className="font-semibold text-white">Next</Text>
      </Pressable>
    </View>
  );
}
