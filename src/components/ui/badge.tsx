import { cn } from "@/lib/cn";

type Color =
  | "default"
  | "neutral"
  | "blue"
  | "purple"
  | "destructive"
  | "notice";

const tones: Record<Color, string> = {
  default: "var(--theme-accent)",
  neutral: "var(--content-secondary)",
  blue: "var(--color-blue-800)",
  purple: "var(--color-purple-800)",
  destructive: "var(--color-red-800)",
  notice: "var(--color-yellow-800)",
};

export function Badge({
  color = "default",
  variant = "default",
  className,
  children,
}: {
  color?: Color;
  variant?: "default" | "solid";
  className?: string;
  children: React.ReactNode;
}) {
  const tone = tones[color];
  const style =
    variant === "solid"
      ? { backgroundColor: tone, color: "var(--content-inverse)" }
      : {
          color: tone,
          backgroundColor: `color-mix(in oklch, ${tone} 15%, transparent)`,
          boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${tone} 30%, transparent)`,
        };

  return (
    <span
      style={style}
      className={cn(
        "inline-flex h-5 items-center rounded-sm px-1.5 text-mono-xs tabular-nums",
        className,
      )}
    >
      {children}
    </span>
  );
}
