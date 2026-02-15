import { api } from "../../../lib/api";
import type {
  RegisterRequest,
  RegisterResponse,
  SignInRequest,
  SignInResponse,
} from "./auth.types";

export async function registerUser(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>("/register", data);
  return response.data;
}

export async function signIn(data: SignInRequest): Promise<SignInResponse> {
  const response = await api.post<SignInResponse>("/auth/sign-in", data);
  return response.data;
}

export async function refreshToken(token: string): Promise<SignInResponse> {
  const response = await api.post<SignInResponse>(
    "/auth/refresh-token",
    {},
    { headers: { Cookie: `refreshToken=${token}` } },
  );
  return response.data;
}

export async function signOut(): Promise<void> {
  await api.delete("/auth/sign-out");
}
