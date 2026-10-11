import { cn } from "@/lib/cn";
import { Spinner } from "@/components/ui/spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "base" | "sm" | "icon";

const variants: Record<Variant, string> = {
  primary: "bg-tint text-on-tint hover:brightness-95 active:brightness-90",
  secondary: "bg-fill text-label hover:brightness-95 active:brightness-90",
  ghost: "bg-transparent text-tint hover:bg-tint-soft",
  danger: "bg-danger text-on-tint hover:brightness-95 active:brightness-90",
};

const sizes: Record<Size, string> = {
  base: "h-11 px-5 text-body",
  sm: "h-9 px-4 subheadline",
  icon: "h-9 w-9 rounded-full",
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
    "relative inline-flex select-none items-center justify-center gap-2 rounded-sm font-semibold",
    "transition-[transform,background-color,filter] duration-200 ease-out",
    "active:scale-[0.97] motion-reduce:active:scale-100",
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
        isDisabled && "pointer-events-none opacity-40",
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
