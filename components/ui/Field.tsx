import type { ReactNode, SelectHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

const control =
  'w-full rounded border border-line/20 bg-surface/40 px-3.5 py-2.5 text-sm text-fg placeholder:text-muted/60 transition-colors duration-fast outline-none focus:border-accent/70 disabled:opacity-50 aria-[invalid=true]:border-red-400/70';

/** Labelled field wrapper with accessible error messaging. */
export function Field({
  id,
  label,
  required,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-mist">
        {label}
        {required && <span className="ms-1 text-accent">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted/70">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({ invalid, ...props }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input className={control} aria-invalid={invalid || undefined} {...props} />;
}

export function Textarea({ invalid, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return <textarea className={`${control} min-h-32 resize-y`} aria-invalid={invalid || undefined} {...props} />;
}

export function Select({
  invalid,
  placeholder,
  options,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <select className={control} aria-invalid={invalid || undefined} {...props}>
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Checkbox({
  id,
  checked,
  onChange,
  invalid,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  invalid?: boolean;
  children: ReactNode;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-mist">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        aria-invalid={invalid || undefined}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-line/30 bg-surface accent-[rgb(var(--c-gold))]"
      />
      <span>{children}</span>
    </label>
  );
}
