import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
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

const schema = z.object({
  userName: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be 30 characters or less")
    .regex(
      /^[a-z0-9_]+$/,
      "Only lowercase letters, numbers, and underscores allowed",
    ),
  name: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be 50 characters or less"),
});

type FormValues = z.infer<typeof schema>;

interface StepProfileProps {
  initialData: { userName: string; name: string };
  onNext: (data: { userName: string; name: string }) => void;
  onBack: () => void;
}

export function StepProfile({ initialData, onNext, onBack }: StepProfileProps) {
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      userName: initialData.userName,
      name: initialData.name,
    },
  });

  const onSubmit = (values: FormValues) => {
    onNext({ userName: values.userName.trim(), name: values.name.trim() });
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
            onPress={onBack}
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
          <StepIndicator current={1} total={3} />

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
              Your profile
            </Text>
            <Text style={{ color: "#606070", fontSize: 16 }}>
              Tell us who you are
            </Text>
          </View>

          {/* Form */}
          <VStack space="lg">
            <FormField
              label="Username"
              error={errors.userName?.message}
              hint="Only lowercase letters, numbers, and underscores"
            >
              <Controller
                control={control}
                name="userName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    size="lg"
                    variant="outline"
                    isInvalid={!!errors.userName}
                  >
                    <InputField
                      value={value}
                      onChangeText={(text) => onChange(text.toLowerCase())}
                      onBlur={onBlur}
                      placeholder="your_username"
                      placeholderTextColor="#505060"
                      autoCapitalize="none"
                      autoComplete="username"
                      className="text-white"
                    />
                  </Input>
                )}
              />
            </FormField>

            <FormField label="Display name" error={errors.name?.message}>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input size="lg" variant="outline" isInvalid={!!errors.name}>
                    <InputField
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Your Name"
                      placeholderTextColor="#505060"
                      autoComplete="name"
                      className="text-white"
                    />
                  </Input>
                )}
              />
            </FormField>

            <VStack space="md" className="mt-2">
              <Button
                size="xl"
                action="primary"
                className="flex-1"
                onPress={handleSubmit(onSubmit)}
              >
                <ButtonText className="tracking-wide">Continue</ButtonText>
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="flex-1"
                action="secondary"
                onPress={onBack}
              >
                <ButtonText style={{ color: "#FFFFFF" }}>Back</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
