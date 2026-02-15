import { useState } from "react";
import { Button, H2, Input, Paragraph, Spinner, TextArea, XStack, YStack } from "tamagui";

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
  const [bio, setBio] = useState(initialData.bio);
  const [location, setLocation] = useState(initialData.location);

  return (
    <YStack flex={1} justifyContent="center" padding="$6" gap="$4">
      <H2 textAlign="center">Almost Done</H2>
      <Paragraph textAlign="center" color="$gray10">
        Step 3 of 3 — Bio & location (optional)
      </Paragraph>

      <YStack gap="$3" marginTop="$4">
        <TextArea
          placeholder="Tell us about yourself..."
          value={bio}
          onChangeText={setBio}
          numberOfLines={4}
        />
        <Input
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />
      </YStack>

      {error && (
        <Paragraph color="$red10" textAlign="center">
          {error.message || "Registration failed. Please try again."}
        </Paragraph>
      )}

      <XStack gap="$3" marginTop="$2">
        <Button flex={1} onPress={onBack} disabled={isPending}>
          Back
        </Button>
        <Button
          flex={1}
          theme="accent"
          onPress={() => onSubmit({ bio: bio.trim(), location: location.trim() })}
          disabled={isPending}
        >
          {isPending ? <Spinner /> : "Create Account"}
        </Button>
      </XStack>
    </YStack>
  );
}
