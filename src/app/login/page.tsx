"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { DEMO_CREDENTIALS } from "@/lib/auth";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const { user, ready, signIn, signUp } = useAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace("/dashboard");
  }, [ready, user, router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Completa el correo y la contraseña.");
      return;
    }
    if (mode === "signup" && password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setPending(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(name, email, password);
      }
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal.");
    } finally {
      setPending(false);
    }
  }

  function useDemo() {
    setMode("signin");
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError(null);
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-accent text-mono-sm text-inverse">
            ▚
          </span>
          <div className="flex flex-col">
            <span className="text-mono-md text-raise">Gym</span>
            <span className="text-mono-xs text-tertiary">Organiza tu entrenamiento</span>
          </div>
        </div>

        <div className="rounded-lg border border-default bg-raise p-6">
          <div className="mb-6 flex gap-1 rounded-md bg-tertiary p-1">
            <TabButton
              active={mode === "signin"}
              onClick={() => {
                setMode("signin");
                setError(null);
              }}
            >
              Iniciar sesión
            </TabButton>
            <TabButton
              active={mode === "signup"}
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
            >
              Crear cuenta
            </TabButton>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {mode === "signup" && (
              <Field label="Nombre" htmlFor="name">
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  autoComplete="name"
                />
              </Field>
            )}

            <Field label="Correo" htmlFor="email">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                autoComplete="email"
                hasError={Boolean(error)}
              />
            </Field>

            <Field
              label="Contraseña"
              htmlFor="password"
              hint={mode === "signup" ? "Mínimo 8 caracteres." : undefined}
            >
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                hasError={Boolean(error)}
              />
            </Field>

            {error && (
              <p className="red-theme text-sans-sm text-error" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" loading={pending} className="mt-2 w-full">
              {mode === "signin" ? "Entrar" : "Crear cuenta"}
            </Button>
          </form>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-mono-xs text-quaternary">Cuenta de prueba</span>
          <button
            type="button"
            onClick={useDemo}
            className="text-mono-xs text-accent hover:underline"
          >
            usar demo
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Badge color="neutral">{DEMO_CREDENTIALS.email}</Badge>
          <Badge color="neutral">{DEMO_CREDENTIALS.password}</Badge>
        </div>
      </div>
    </main>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        "flex-1 rounded-sm px-3 py-1.5 text-mono-xs transition-colors " +
        (active ? "bg-raise text-accent" : "text-tertiary hover:text-default")
      }
    >
      {children}
    </button>
  );
}
