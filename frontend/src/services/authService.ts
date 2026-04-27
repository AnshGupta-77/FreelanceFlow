import { api } from "./api";
import type { User, Token } from "../types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  full_name: string;
  default_currency?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<Token> {
    const response = await api.post<Token>("/auth/login", credentials);
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);
    return response.data;
  },

  async signup(data: SignupData): Promise<User> {
    const response = await api.post<User>("/auth/signup", data);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },

  logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token");
  },
};
