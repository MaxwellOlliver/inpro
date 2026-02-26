import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthTokens } from "../api/auth.types";
import { TokenStorage } from "../storage/token.storage";
import { registerAuthCallbacks } from "../../../lib/api";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  user: { id: string; email: string } | null;
}

interface AuthContextValue extends AuthState {
  login: (tokens: AuthTokens) => Promise<void>;
  logout: () => Promise<void>;
  updateTokens: (tokens: AuthTokens) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    status: "loading",
    user: null,
  });

  const login = useCallback(async (tokens: AuthTokens) => {
    await TokenStorage.saveTokens(tokens);
    setState({ status: "authenticated", user: null });
  }, []);

  const logout = useCallback(async () => {
    await TokenStorage.clearTokens();
    setState({ status: "unauthenticated", user: null });
  }, []);

  const updateTokens = useCallback((tokens: AuthTokens) => {
    TokenStorage.saveTokens(tokens);
  }, []);

  // Bootstrap: check for existing tokens on mount
  useEffect(() => {
    async function bootstrap() {
      const accessToken = await TokenStorage.getAccessToken();
      if (accessToken) {
        setState((prev) => ({ ...prev, status: "authenticated" }));
      } else {
        setState((prev) => ({ ...prev, status: "unauthenticated" }));
      }
    }
    bootstrap();
  }, []);

  // Register callbacks for axios interceptor
  useEffect(() => {
    registerAuthCallbacks({ updateTokens, logout });
  }, [updateTokens, logout]);

  const value = useMemo(
    () => ({ ...state, login, logout, updateTokens }),
    [state, login, logout, updateTokens],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
