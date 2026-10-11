import { cn } from "@/lib/cn";

export function Spinner({
  size = "base",
  className,
}: {
  size?: "base" | "lg";
  className?: string;
}) {
  const dimension = size === "lg" ? "h-9 w-9" : "h-3 w-3";
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none",
        dimension,
        className,
      )}
      style={{ animationDuration: "0.7s" }}
    />
  );
}
