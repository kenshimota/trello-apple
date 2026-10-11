import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gym — Organiza tu entrenamiento",
  description: "Inicia sesión y organiza tus rutinas, días y ejercicios.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full">
      <body className="flex min-h-full flex-col bg-surface text-label">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
