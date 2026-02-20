import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";
import { FormField } from "../../components/form-field";
import { StepIndicator } from "../../components/step-indicator";

const schema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

interface StepCredentialsProps {
  initialData: { email: string; password: string };
  onNext: (data: { email: string; password: string }) => void;
}

export function StepCredentials({ initialData, onNext }: StepCredentialsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: initialData.email,
      password: initialData.password,
      confirmPassword: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    onNext({ email: values.email.trim(), password: values.password });
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
              marginBottom: 32,
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>

          {/* Step indicator */}
          <StepIndicator current={0} total={3} />

          {/* Header */}
          <View className="mb-10 mt-8">
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
              Create account
            </Text>
            <Text style={{ color: "#606070", fontSize: 16 }}>
              Start with your login credentials
            </Text>
          </View>

          {/* Form */}
          <VStack space="lg">
            <FormField label="Email address" error={errors.email?.message}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input size="lg" variant="outline" isInvalid={!!errors.email}>
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
                  >
                    <InputField
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Min. 8 characters"
                      placeholderTextColor="#505060"
                      secureTextEntry={!showPassword}
                      autoComplete="new-password"
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

            <FormField
              label="Confirm password"
              error={errors.confirmPassword?.message}
            >
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    size="lg"
                    variant="outline"
                    isInvalid={!!errors.confirmPassword}
                  >
                    <InputField
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Repeat your password"
                      placeholderTextColor="#505060"
                      secureTextEntry={!showConfirm}
                      autoComplete="new-password"
                      className="text-white"
                    />
                    <InputSlot
                      className="pr-3"
                      onPress={() => setShowConfirm((v) => !v)}
                    >
                      <Ionicons
                        name={showConfirm ? "eye-off" : "eye"}
                        size={20}
                        color="#505060"
                      />
                    </InputSlot>
                  </Input>
                )}
              />
            </FormField>

            <Button
              size="xl"
              action="primary"
              className="mt-6"
              onPress={handleSubmit(onSubmit)}
            >
              <ButtonText className="tracking-wide">Continue</ButtonText>
            </Button>
          </VStack>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
