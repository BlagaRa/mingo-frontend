import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  /** dark = ivory label (default on forest pages); light = forest label on ivory panels */
  tone?: "dark" | "light";
};

export function Input({
  label,
  error,
  id,
  className = "",
  tone = "dark",
  ...props
}: InputProps) {
  const inputId = id ?? props.name;
  return (
    <label className="flex flex-col gap-2 text-[var(--type-small)]">
      <span
        className={`font-medium ${
          tone === "light"
            ? "text-[var(--color-forest)]"
            : "text-[var(--color-ivory)]"
        }`}
      >
        {label}
      </span>
      <input
        id={inputId}
        className={`rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-forest)_14%,transparent)] bg-[var(--color-ivory)] px-3.5 py-2.5 text-[0.95rem] text-[var(--color-forest)] shadow-[0_1px_2px_color-mix(in_srgb,var(--color-forest)_8%,transparent)] transition-[border-color,box-shadow] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] focus-visible:border-[var(--color-coral)] ${className}`}
        {...props}
      />
      {error ? (
        <span
          className="rounded-[var(--radius-sm)] px-3 py-2 text-[var(--color-ivory)]"
          role="alert"
          style={{ backgroundColor: "var(--color-coral-soft)" }}
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}
