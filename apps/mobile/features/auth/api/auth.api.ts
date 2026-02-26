import { api } from "../../../lib/api";
import type {
  CreateUser,
  RegisterResponse,
  SignInRequest,
  SignInResponse,
  UserProfile,
} from "./auth.types";

export async function registerUser(
  data: CreateUser,
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

export async function getProfile(): Promise<UserProfile> {
  const response = await api.get<UserProfile>("/profile");
  return response.data;
}
