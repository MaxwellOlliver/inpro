import { View } from "react-native";
import { Text } from "@/components/ui/text";

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}

export function FormField({
  label,
  error,
  hint,
  optional,
  children,
}: FormFieldProps) {
  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text size="sm" className="font-medium" style={{ color: "#909099" }}>
          {label}
        </Text>
        {optional && (
          <Text size="xs" style={{ color: "#505060" }}>
            Optional
          </Text>
        )}
      </View>
      {children}
      {error ? (
        <Text size="xs" style={{ color: "#E53935" }} className="ml-1">
          {error}
        </Text>
      ) : hint ? (
        <Text size="xs" style={{ color: "#505060" }} className="ml-1">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
