import type { ReactNode } from "react";

export function controlClass(invalid: boolean): string {
  return [
    "mt-2 w-full rounded-lg border bg-background px-4 py-3 text-sm text-white outline-none transition-colors",
    "placeholder:text-white/30 focus:border-primary",
    invalid ? "border-red-400/70" : "border-white/10",
  ].join(" ");
}

export function Field({
  id,
  label,
  optional = false,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-widest text-text-dim">
        {label}
        {optional ? (
          <span className="ml-2 font-normal normal-case tracking-normal text-white/40">Optional</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-xs text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Honeypot({ id }: { id: string }) {
  return (
    <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
      <label htmlFor={id}>Company website</label>
      <input
        id={id}
        name="company_website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-lg border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200">
      {message}
    </p>
  );
}

export function Confirmation({ message }: { message: string }) {
  return (
    <div role="status" className="glass rounded-2xl p-10 md:p-12">
      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Received</p>
      <p className="font-outfit text-2xl font-bold leading-snug text-white md:text-3xl">{message}</p>
    </div>
  );
}
