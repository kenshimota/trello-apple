import { cn } from "@/lib/cn";

type Color =
  | "default"
  | "neutral"
  | "blue"
  | "purple"
  | "destructive"
  | "notice"
  | "success";

const tones: Record<Color, string> = {
  default: "var(--tint)",
  blue: "var(--tint)",
  purple: "var(--purple)",
  destructive: "var(--danger)",
  notice: "var(--notice)",
  success: "var(--success)",
  neutral: "var(--secondary-label)",
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
      ? { backgroundColor: tone, color: "var(--on-tint)" }
      : {
          color: tone,
          backgroundColor:
            color === "neutral" ? "var(--fill)" : `color-mix(in srgb, ${tone} 15%, transparent)`,
        };

  return (
    <span
      style={style}
      className={cn(
        "caption-1 inline-flex h-5 items-center rounded-full px-2 font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}
