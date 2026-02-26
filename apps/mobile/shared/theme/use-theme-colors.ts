import { useColorScheme } from "nativewind";
import {
  lightVars,
  darkVars,
} from "@/components/ui/gluestack-ui-provider/config";

type RawVars = Record<string, string>;

const toRgb = (v: RawVars, key: string) => {
  const value = v[key];
  if (!value) return "transparent";
  return `rgb(${value.replace(/\s+/g, ", ")})`;
};

const toRgba = (v: RawVars, key: string, alpha: number) => {
  const value = v[key];
  if (!value) return "transparent";
  return `rgba(${value.replace(/\s+/g, ", ")}, ${alpha})`;
};

function resolveColors(v: RawVars) {
  const c = (key: string) => toRgb(v, key);
  const a = (key: string, alpha: number) => toRgba(v, key, alpha);

  return {
    primary: {
      0: c("--color-primary-0"),
      100: c("--color-primary-100"),
      200: c("--color-primary-200"),
      300: c("--color-primary-300"),
      400: c("--color-primary-400"),
      500: c("--color-primary-500"),
      600: c("--color-primary-600"),
      700: c("--color-primary-700"),
      800: c("--color-primary-800"),
      900: c("--color-primary-900"),
      950: c("--color-primary-950"),
    },
    background: {
      0: c("--color-background-0"),
      50: c("--color-background-50"),
      100: c("--color-background-100"),
      200: c("--color-background-200"),
      300: c("--color-background-300"),
      400: c("--color-background-400"),
      500: c("--color-background-500"),
      600: c("--color-background-600"),
      700: c("--color-background-700"),
      800: c("--color-background-800"),
      900: c("--color-background-900"),
      950: c("--color-background-950"),
      error: c("--color-background-error"),
      warning: c("--color-background-warning"),
      success: c("--color-background-success"),
      muted: c("--color-background-muted"),
      info: c("--color-background-info"),
    },
    typography: {
      0: c("--color-typography-0"),
      100: c("--color-typography-100"),
      200: c("--color-typography-200"),
      300: c("--color-typography-300"),
      400: c("--color-typography-400"),
      500: c("--color-typography-500"),
      600: c("--color-typography-600"),
      700: c("--color-typography-700"),
      800: c("--color-typography-800"),
      900: c("--color-typography-900"),
      950: c("--color-typography-950"),
    },
    outline: {
      0: c("--color-outline-0"),
      100: c("--color-outline-100"),
      200: c("--color-outline-200"),
      300: c("--color-outline-300"),
      400: c("--color-outline-400"),
      500: c("--color-outline-500"),
      600: c("--color-outline-600"),
      700: c("--color-outline-700"),
      800: c("--color-outline-800"),
      900: c("--color-outline-900"),
      950: c("--color-outline-950"),
    },
    error: {
      400: c("--color-error-400"),
      500: c("--color-error-500"),
      600: c("--color-error-600"),
    },
    success: {
      400: c("--color-success-400"),
      500: c("--color-success-500"),
      600: c("--color-success-600"),
    },
    border: c("--color-border"),
    alpha: {
      primary500: (opacity: number) => a("--color-primary-500", opacity),
      background0: (opacity: number) => a("--color-background-0", opacity),
      black: (opacity: number) => `rgba(0, 0, 0, ${opacity})`,
    },
  };
}

const cache = {
  light: resolveColors(lightVars),
  dark: resolveColors(darkVars),
};

export function useThemeColors() {
  const { colorScheme } = useColorScheme();
  return cache[colorScheme ?? "dark"];
}

export type ThemeColors = ReturnType<typeof resolveColors>;
