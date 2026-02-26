export type DeviceType = "IOS" | "ANDROID" | "WEB";

export interface SignInRequest {
  email: string;
  password: string;
  device: DeviceType;
  deviceId: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  userName: string;
  name: string;
  bio: string;
  location: string;
}

export interface CreateUser {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface UserProfile {
  id: string;
  userName: string;
  name: string;
  bio: string;
  location: string;
  avatarId?: string | null;
  bannerId?: string | null;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
  };
  profile: UserProfile;
}

export interface SignInResponse extends AuthTokens {}
