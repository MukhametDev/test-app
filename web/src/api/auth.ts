import { apiPost } from "./api";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  token?: string;
  user?: AuthUser;
  message?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
  remember?: boolean;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export function login(payload: LoginPayload) {
  return apiPost<AuthResponse, LoginPayload>("/login", payload);
}

export function register(payload: RegisterPayload) {
  return apiPost<AuthResponse, RegisterPayload>("/register", payload);
}
