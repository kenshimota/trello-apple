"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { RequireAuth } from "@/components/require-auth";
import { GymBoard } from "@/components/gym-board";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  );
}

function Dashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  if (!user) return null;

  function handleSignOut() {
    signOut();
    router.replace("/login");
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-default">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-mono-sm text-inverse">
              ▚
            </span>
            <span className="text-mono-md text-raise">Gym</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-mono-xs text-tertiary sm:inline">
              {user.name}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-sans-3xl text-raise">Organiza tu gym</h1>
          <p className="text-sans-md text-secondary">
            Agrupa tus ejercicios por día de entrenamiento y marca lo que completas.
          </p>
        </div>

        <GymBoard userId={user.id} />
      </main>
    </div>
  );
}
