import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useSignIn } from "../mutations/use-sign-in.mutation";
import { FormField } from "../components/form-field";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function SignInScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const signIn = useSignIn();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: FormValues) => {
    signIn.mutate({ email: values.email.trim(), password: values.password });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#0C0C0F" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flex: 1,
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 32,
            paddingHorizontal: 28,
          }}
        >
          {/* Back button */}
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#1A1A20",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 40,
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>

          {/* Header */}
          <View className="mb-10">
            <Text
              size="xs"
              bold
              style={{ color: "#9B59C5", letterSpacing: 3, marginBottom: 16 }}
            >
              INPRO
            </Text>
            <Text
              bold
              style={{
                fontSize: 36,
                color: "#F0F0F5",
                lineHeight: 44,
                marginBottom: 8,
              }}
            >
              Welcome back
            </Text>
            <Text style={{ color: "#606070", fontSize: 16 }}>
              Sign in to continue your journey
            </Text>
          </View>

          {/* Form */}
          <VStack space="lg">
            <FormField label="Email address" error={errors.email?.message}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    size="lg"
                    variant="outline"
                    isInvalid={!!errors.email}
                    className="rounded-2xl border-background-200 bg-background-50"
                  >
                    <InputField
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="you@example.com"
                      placeholderTextColor="#505060"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      className="text-white"
                    />
                  </Input>
                )}
              />
            </FormField>

            <FormField label="Password" error={errors.password?.message}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    size="lg"
                    variant="outline"
                    isInvalid={!!errors.password}
                    className="rounded-2xl border-background-200 bg-background-50"
                  >
                    <InputField
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="••••••••"
                      placeholderTextColor="#505060"
                      secureTextEntry={!showPassword}
                      autoComplete="password"
                      className="text-white"
                    />
                    <InputSlot
                      className="pr-3"
                      onPress={() => setShowPassword((v) => !v)}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#505060"
                      />
                    </InputSlot>
                  </Input>
                )}
              />
            </FormField>

            <Pressable className="self-end">
              <Text size="sm" style={{ color: "#9B59C5" }}>
                Forgot password?
              </Text>
            </Pressable>

            {/* Server error */}
            {signIn.error && (
              <View
                style={{
                  backgroundColor: "rgba(229, 57, 53, 0.1)",
                  borderWidth: 1,
                  borderColor: "rgba(229, 57, 53, 0.3)",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <Text size="sm" style={{ color: "#E53935", textAlign: "center" }}>
                  {signIn.error.message || "Sign in failed. Please try again."}
                </Text>
              </View>
            )}

            <Button
              size="xl"
              action="primary"
              className="mt-2 rounded-2xl"
              onPress={handleSubmit(onSubmit)}
              disabled={signIn.isPending}
            >
              {signIn.isPending ? (
                <ButtonSpinner color="#FFFFFF" />
              ) : (
                <ButtonText className="tracking-wide">Sign In</ButtonText>
              )}
            </Button>
          </VStack>

          {/* Footer */}
          <View className="mt-auto flex-row items-center justify-center pt-10">
            <Text style={{ color: "#606070" }}>Don't have an account? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <Pressable>
                <Text style={{ color: "#9B59C5" }} bold>
                  Create one
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
