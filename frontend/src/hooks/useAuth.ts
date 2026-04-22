import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import type { User } from "../types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          authService.logout();
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    await authService.login({ email, password });
    const userData = await authService.getCurrentUser();
    setUser(userData);
    setIsAuthenticated(true);
  };

  const signup = async (email: string, password: string, full_name: string) => {
    await authService.signup({ email, password, full_name });
    await login(email, password);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
  };
}
