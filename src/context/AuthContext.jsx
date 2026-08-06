import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, loginUser, registerUser } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load, if a token exists, hydrate the user from the API
  // rather than trusting stale localStorage data.
  useEffect(() => {
    const token = localStorage.getItem("dermanova_access_token");
    if (!token) {
      setIsLoading(false);
      console.log("AuthContext user:", user);
      console.log("isAuthenticated:", !!user);
      return;
    }
    getCurrentUser()
      .then(({ data }) => setUser(data))
      .catch(() => {
        localStorage.removeItem("dermanova_access_token");
        localStorage.removeItem("dermanova_refresh_token");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email, password) => {
  const { data } = await loginUser({ email, password });
  console.log("Login response:", data);

  localStorage.setItem("dermanova_access_token", data.access_token);

  const me = await getCurrentUser();
  console.log("Current user:", me.data);

  setUser(me.data);

  return me.data;
};

  const register = async (payload) => {
  const { data } = await registerUser(payload);
  console.log("Register response:", data);
  localStorage.setItem("dermanova_access_token", data.access_token);

  const me = await getCurrentUser();
  console.log("Current user after register:", me.data);
  setUser(me.data);

  return me.data;
};

  const logout = () => {
    localStorage.removeItem("dermanova_access_token");
    localStorage.removeItem("dermanova_refresh_token");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, setUser, isLoading, login, register, logout, isAuthenticated: !!user }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
