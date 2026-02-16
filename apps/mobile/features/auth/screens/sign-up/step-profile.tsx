import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

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
    <View className="flex-1 justify-center px-6">
      <Text className="text-center text-3xl font-bold text-black">Your Profile</Text>
      <Text className="mt-1 text-center text-base text-neutral-500">
        Step 2 of 3 - Tell us about yourself
      </Text>

      <View className="mt-4 gap-3">
        <TextInput
          className="rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base"
          placeholder="Username"
          value={userName}
          onChangeText={setUserName}
          autoCapitalize="none"
          autoComplete="username"
        />
        <TextInput
          className="rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base"
          placeholder="Display Name"
          value={name}
          onChangeText={setName}
          autoComplete="name"
        />
      </View>

      <View className="mt-4 flex-row gap-3">
        <Pressable
          onPress={onBack}
          className="flex-1 items-center rounded-lg border border-neutral-300 bg-white px-4 py-3"
        >
          <Text className="font-semibold text-neutral-800">Back</Text>
        </Pressable>
        <Pressable
          onPress={() => onNext({ userName: userName.trim(), name: name.trim() })}
          disabled={!isValid}
          className={`flex-1 items-center rounded-lg bg-blue-600 px-4 py-3 ${
            !isValid ? "opacity-60" : ""
          }`}
        >
          <Text className="font-semibold text-white">Next</Text>
        </Pressable>
      </View>
    </View>
  );
}
