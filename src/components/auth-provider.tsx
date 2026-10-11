"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import {
  type User,
  signIn as apiSignIn,
  signUp as apiSignUp,
} from "@/lib/auth";
import { createBrowserStore, useHydrated } from "@/lib/browser-store";

const SESSION_KEY = "gym.session";
const sessionStore = createBrowserStore<User | null>(SESSION_KEY, null);

type AuthContextValue = {
  user: User | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (name: string, email: string, password: string) => Promise<User>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(
    sessionStore.subscribe,
    sessionStore.getSnapshot,
    sessionStore.getServerSnapshot,
  );
  const ready = useHydrated();

  const signIn = useCallback(async (email: string, password: string) => {
    const next = await apiSignIn(email, password);
    sessionStore.set(next);
    return next;
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const next = await apiSignUp(name, email, password);
      sessionStore.set(next);
      return next;
    },
    [],
  );

  const signOut = useCallback(() => {
    sessionStore.set(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>.");
  return ctx;
}
