import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

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
    <View className="flex-1 justify-center px-6">
      <Text className="text-center text-3xl font-bold text-black">Almost Done</Text>
      <Text className="mt-1 text-center text-base text-neutral-500">
        Step 3 of 3 - Bio and location (optional)
      </Text>

      <View className="mt-4 gap-3">
        <TextInput
          className="min-h-24 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base"
          placeholder="Tell us about yourself..."
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        <TextInput
          className="rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base"
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      {error && (
        <Text className="mt-2 text-center text-sm text-red-500">
          {error.message || "Registration failed. Please try again."}
        </Text>
      )}

      <View className="mt-4 flex-row gap-3">
        <Pressable
          onPress={onBack}
          disabled={isPending}
          className={`flex-1 items-center rounded-lg border border-neutral-300 bg-white px-4 py-3 ${
            isPending ? "opacity-60" : ""
          }`}
        >
          <Text className="font-semibold text-neutral-800">Back</Text>
        </Pressable>
        <Pressable
          onPress={() => onSubmit({ bio: bio.trim(), location: location.trim() })}
          disabled={isPending}
          className={`flex-1 items-center rounded-lg bg-blue-600 px-4 py-3 ${
            isPending ? "opacity-60" : ""
          }`}
        >
          {isPending ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="font-semibold text-white">Create Account</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
