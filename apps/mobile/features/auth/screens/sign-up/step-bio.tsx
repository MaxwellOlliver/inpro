import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
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
  bio: z.string().max(160, "Bio must be 160 characters or less"),
  location: z.string().max(100, "Location must be 100 characters or less"),
});

type FormValues = z.infer<typeof schema>;

interface StepBioProps {
  initialData: { bio: string; location: string };
  onSubmit: (data: { bio: string; location: string }) => void;
  onBack: () => void;
  isPending: boolean;
  error: Error | null;
}

export function StepBio({
  initialData,
  onSubmit,
  onBack,
  isPending,
  error,
}: StepBioProps) {
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      bio: initialData.bio,
      location: initialData.location,
    },
  });

  const bioValue = watch("bio");

  const onFormSubmit = (values: FormValues) => {
    onSubmit({ bio: values.bio.trim(), location: values.location.trim() });
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
            disabled={isPending}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#1A1A20",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
              opacity: isPending ? 0.5 : 1,
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>

          {/* Step indicator */}
          <StepIndicator current={2} total={3} />

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
              Almost done
            </Text>
            <Text style={{ color: "#606070", fontSize: 16 }}>
              Add a bio and location to complete your profile
            </Text>
          </View>

          {/* Form */}
          <VStack space="lg">
            <FormField label="Bio" error={errors.bio?.message} optional>
              <Controller
                control={control}
                name="bio"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    size="lg"
                    variant="outline"
                    isInvalid={!!errors.bio}
                    className="h-auto min-h-[100px] items-start py-3"
                  >
                    <InputField
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Tell the community about yourself..."
                      placeholderTextColor="#505060"
                      multiline
                      textAlignVertical="top"
                      className="text-white"
                      style={{ minHeight: 80 }}
                    />
                  </Input>
                )}
              />
              <Text
                size="xs"
                style={{
                  color: bioValue.length > 140 ? "#E53935" : "#505060",
                  textAlign: "right",
                  marginTop: -4,
                }}
              >
                {bioValue.length}/160
              </Text>
            </FormField>

            <FormField
              label="Location"
              error={errors.location?.message}
              optional
            >
              <Controller
                control={control}
                name="location"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    size="lg"
                    variant="outline"
                    isInvalid={!!errors.location}
                  >
                    <InputField
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="City, Country"
                      placeholderTextColor="#505060"
                      className="text-white"
                    />
                  </Input>
                )}
              />
            </FormField>

            {/* Server error */}
            {error && (
              <View
                style={{
                  backgroundColor: "rgba(229, 57, 53, 0.1)",
                  borderWidth: 1,
                  borderColor: "rgba(229, 57, 53, 0.3)",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <Text
                  size="sm"
                  style={{ color: "#E53935", textAlign: "center" }}
                >
                  {error.message || "Registration failed. Please try again."}
                </Text>
              </View>
            )}

            <HStack space="md" className="mt-2">
              <Button
                size="xl"
                variant="outline"
                className="flex-1 rounded-2xl"
                style={{ backgroundColor: "#1A1A20", borderColor: "#2E2E38" }}
                onPress={onBack}
                disabled={isPending}
              >
                <ButtonText style={{ color: "#FFFFFF" }}>Back</ButtonText>
              </Button>
              <Button
                size="xl"
                action="primary"
                className="flex-1 rounded-2xl"
                onPress={handleSubmit(onFormSubmit)}
                disabled={isPending}
              >
                {isPending ? (
                  <ButtonSpinner color="#FFFFFF" />
                ) : (
                  <ButtonText className="tracking-wide">
                    Create Account
                  </ButtonText>
                )}
              </Button>
            </HStack>
          </VStack>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
