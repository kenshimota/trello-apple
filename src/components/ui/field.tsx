import { cn } from "@/lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export function Input({ hasError, className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-md border bg-tertiary px-3 text-sans-md text-raise",
        "placeholder:text-quaternary transition-colors",
        hasError ? "border-error" : "border-default focus:border-accent",
        className,
      )}
    />
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-mono-xs text-secondary">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-sans-sm text-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sans-sm text-tertiary">{hint}</p>
      ) : null}
    </div>
  );
}
