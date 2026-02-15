import { useState } from "react";
import { Button, H2, Input, Paragraph, YStack } from "tamagui";

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
    <YStack flex={1} justifyContent="center" padding="$6" gap="$4">
      <H2 textAlign="center">Create Account</H2>
      <Paragraph textAlign="center" color="$gray10">
        Step 1 of 3 — Your credentials
      </Paragraph>

      <YStack gap="$3" marginTop="$4">
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <Input
          placeholder="Password (min 8 characters)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
        />
        <Input
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoComplete="new-password"
        />
      </YStack>

      {password.length > 0 && password.length < 8 && (
        <Paragraph color="$red10" fontSize="$2">
          Password must be at least 8 characters
        </Paragraph>
      )}
      {confirmPassword.length > 0 && password !== confirmPassword && (
        <Paragraph color="$red10" fontSize="$2">
          Passwords do not match
        </Paragraph>
      )}

      <Button
        theme="accent"
        onPress={() => onNext({ email: email.trim(), password })}
        disabled={!isValid}
        marginTop="$2"
      >
        Next
      </Button>
    </YStack>
  );
}
