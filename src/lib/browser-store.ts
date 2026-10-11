"use client";

import { useSyncExternalStore } from "react";

type Listener = () => void;

export function createBrowserStore<T>(key: string, fallback: T) {
  const listeners = new Set<Listener>();
  let cachedRaw: string | null = null;
  let cachedValue: T = fallback;
  let initialized = false;

  function read(): T {
    if (typeof window === "undefined") return fallback;
    const raw = window.localStorage.getItem(key);
    if (initialized && raw === cachedRaw) return cachedValue;

    cachedRaw = raw;
    initialized = true;
    try {
      cachedValue = raw === null ? fallback : (JSON.parse(raw) as T);
    } catch {
      cachedValue = fallback;
    }
    return cachedValue;
  }

  function emit() {
    listeners.forEach((listener) => listener());
  }

  return {
    subscribe(listener: Listener) {
      listeners.add(listener);
      const onStorage = (event: StorageEvent) => {
        if (event.key !== key) return;
        initialized = false;
        emit();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot: read,
    getServerSnapshot: () => fallback,
    set(value: T) {
      const raw = JSON.stringify(value);
      window.localStorage.setItem(key, raw);
      cachedRaw = raw;
      cachedValue = value;
      initialized = true;
      emit();
    },
  };
}

const emptySubscribe = () => () => {};

export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
