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
      <header className="sticky top-0 z-10 border-b border-separator bg-material">
        <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-sm bg-tint text-on-tint">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" />
              </svg>
            </span>
            <span className="headline text-label">Gym</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden caption-1 text-secondary sm:inline">
              {user.name}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">
        <div className="mb-6">
          <h1 className="large-title text-label">Entrenamiento</h1>
          <p className="callout mt-1 text-secondary">
            Agrupa tus ejercicios por día y marca lo que completas.
          </p>
        </div>

        <GymBoard userId={user.id} />
      </main>
    </div>
  );
}
