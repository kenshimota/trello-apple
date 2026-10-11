"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
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
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 grid h-16 w-16 place-items-center rounded-xl bg-tint text-on-tint shadow-md">
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" />
            </svg>
          </span>
          <h1 className="large-title text-label">Gym</h1>
          <p className="callout mt-1 text-secondary">
            Organiza tus días, rutinas y ejercicios.
          </p>
        </div>

        <div className="rounded-lg bg-card p-6 shadow-md">
          <div className="mb-6 flex rounded-full bg-fill p-1">
            <Segment
              active={mode === "signin"}
              onClick={() => {
                setMode("signin");
                setError(null);
              }}
            >
              Iniciar sesión
            </Segment>
            <Segment
              active={mode === "signup"}
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
            >
              Crear cuenta
            </Segment>
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
              <p className="footnote text-danger" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" loading={pending} className="mt-2 w-full">
              {mode === "signin" ? "Entrar" : "Crear cuenta"}
            </Button>
          </form>
        </div>

        <div className="mt-5 flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={useDemo}
            className="subheadline font-semibold text-tint hover:opacity-70"
          >
            Usar cuenta de prueba
          </button>
          <p className="footnote text-tertiary">
            {DEMO_CREDENTIALS.email} · {DEMO_CREDENTIALS.password}
          </p>
        </div>
      </div>
    </main>
  );
}

function Segment({
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
        "flex-1 rounded-full px-3 py-1.5 subheadline transition-colors " +
        (active
          ? "bg-card font-semibold text-label shadow-sm"
          : "text-secondary hover:text-label")
      }
    >
      {children}
    </button>
  );
}
