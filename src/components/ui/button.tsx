import { cn } from "@/lib/cn";
import { Spinner } from "@/components/ui/spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "base" | "sm" | "icon";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-inverse hover:bg-accent-hover",
  secondary: "bg-secondary text-default border border-default hover:bg-hover",
  ghost: "bg-transparent text-secondary hover:bg-hover hover:text-default",
  danger: "bg-error text-inverse hover:brightness-110",
};

const sizes: Record<Size, string> = {
  base: "h-10 px-4",
  sm: "h-8 px-3",
  icon: "h-8 w-8",
};

export function buttonStyle({
  variant = "primary",
  size = "base",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(
    "relative inline-flex select-none items-center justify-center gap-2 rounded-md text-mono-sm",
    "transition-colors duration-150 ease-out active:scale-[0.97] motion-reduce:active:scale-100",
    variants[variant],
    sizes[size],
    className,
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "base",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      {...props}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      className={cn(
        buttonStyle({ variant, size, className }),
        isDisabled && "pointer-events-none opacity-50",
      )}
    >
      {loading ? (
        <>
          <Spinner className="absolute" />
          <span className="invisible">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
