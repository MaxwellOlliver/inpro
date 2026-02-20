import { View } from "react-native";

interface StepIndicatorProps {
  current: number;
  total: number;
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <View className="flex-row gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className="h-[3px] flex-1 rounded-full"
          style={{
            backgroundColor:
              i < current ? "#9B59C5" : i === current ? "#7B3FA5" : "#2E2E38",
          }}
        />
      ))}
    </View>
  );
}
