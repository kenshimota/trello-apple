import { cn } from "@/lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export function Input({ hasError, className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-sm border bg-fill-secondary px-4 text-body text-label",
        "placeholder:text-placeholder transition-colors",
        hasError ? "border-danger" : "border-transparent focus:border-tint",
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
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="footnote px-1 text-secondary">
        {label}
      </label>
      {children}
      {error ? (
        <p className="footnote px-1 text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="footnote px-1 text-tertiary">{hint}</p>
      ) : null}
    </div>
  );
}
