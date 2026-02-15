import { useState } from "react";
import { Button, H2, Input, Paragraph, XStack, YStack } from "tamagui";

interface StepProfileProps {
  initialData: { userName: string; name: string };
  onNext: (data: { userName: string; name: string }) => void;
  onBack: () => void;
}

export function StepProfile({ initialData, onNext, onBack }: StepProfileProps) {
  const [userName, setUserName] = useState(initialData.userName);
  const [name, setName] = useState(initialData.name);

  const isValid = userName.trim().length > 0 && name.trim().length > 0;

  return (
    <YStack flex={1} justifyContent="center" padding="$6" gap="$4">
      <H2 textAlign="center">Your Profile</H2>
      <Paragraph textAlign="center" color="$gray10">
        Step 2 of 3 — Tell us about yourself
      </Paragraph>

      <YStack gap="$3" marginTop="$4">
        <Input
          placeholder="Username"
          value={userName}
          onChangeText={setUserName}
          autoCapitalize="none"
          autoComplete="username"
        />
        <Input
          placeholder="Display Name"
          value={name}
          onChangeText={setName}
          autoComplete="name"
        />
      </YStack>

      <XStack gap="$3" marginTop="$2">
        <Button flex={1} onPress={onBack}>
          Back
        </Button>
        <Button
          flex={1}
          theme="accent"
          onPress={() =>
            onNext({ userName: userName.trim(), name: name.trim() })
          }
          disabled={!isValid}
        >
          Next
        </Button>
      </XStack>
    </YStack>
  );
}
