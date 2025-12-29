import { apiGet } from "./api";

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
};

export function fetchCurrentUser() {
  return apiGet<ApiUser>("/user");
}
