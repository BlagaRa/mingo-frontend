import {
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { theme } from "@/config/theme";

const variants = {
  primary: {
    backgroundColor: theme.colors.forestFill,
    color: theme.colors.onForest,
    borderColor: theme.colors.forestFill,
  },
  accent: {
    backgroundColor: theme.colors.coral,
    color: theme.colors.onCoral,
    borderColor: theme.colors.coral,
  },
  ghost: {
    backgroundColor: "transparent",
    color: theme.colors.ink,
    borderColor: "color-mix(in srgb, #073035 22%, transparent)",
  },
  danger: {
    backgroundColor: theme.colors.coralSoft,
    color: theme.colors.forest,
    borderColor: theme.colors.coral,
  },
} as const;

export type ButtonVariant = keyof typeof variants;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  asChild?: boolean;
  children: ReactNode;
};

const baseClass =
  "inline-flex items-center justify-center gap-2 border px-4 py-2.5 text-[length:var(--type-small)] font-semibold tracking-tight rounded-[var(--radius-sm)] transition-[transform,opacity,box-shadow,background-color,border-color,color] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-px [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_8px_18px_color-mix(in_srgb,var(--color-forest)_16%,transparent)]";

export function Button({
  variant = "primary",
  asChild = false,
  className = "",
  children,
  type = "button",
  style,
  ...props
}: ButtonProps) {
  const classes = `${baseClass} ${className}`.trim();
  const tone = variants[variant];
  const mergedStyle: CSSProperties = { ...tone, ...style };

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{
      className?: string;
      style?: CSSProperties;
    }>;
    return cloneElement(child, {
      className: `${classes} ${child.props.className ?? ""}`.trim(),
      style: { ...mergedStyle, ...child.props.style },
    });
  }

  return (
    <button type={type} className={classes} style={mergedStyle} {...props}>
      {children}
    </button>
  );
}
