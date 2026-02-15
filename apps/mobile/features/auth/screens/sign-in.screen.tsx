import { useState } from "react";
import { Button, H2, Input, Paragraph, Spinner, YStack } from "tamagui";
import { Link } from "expo-router";
import { useSignIn } from "../mutations/use-sign-in.mutation";

export function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signIn = useSignIn();

  const handleSignIn = () => {
    signIn.mutate({ email: email.trim(), password });
  };

  return (
    <YStack flex={1} justifyContent="center" padding="$6" gap="$4">
      <H2 textAlign="center">Welcome Back</H2>
      <Paragraph textAlign="center" color="$gray10">
        Sign in to your account
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
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />
      </YStack>

      {signIn.error && (
        <Paragraph color="$red10" textAlign="center">
          {signIn.error.message || "Sign in failed. Please try again."}
        </Paragraph>
      )}

      <Button
        theme="accent"
        onPress={handleSignIn}
        disabled={signIn.isPending || !email || !password}
        marginTop="$2"
      >
        {signIn.isPending ? <Spinner /> : "Sign In"}
      </Button>

      <Link href="/(auth)/sign-up" asChild>
        <Paragraph textAlign="center" color="$blue10" marginTop="$2">
          Don&apos;t have an account? Sign Up
        </Paragraph>
      </Link>
    </YStack>
  );
}
