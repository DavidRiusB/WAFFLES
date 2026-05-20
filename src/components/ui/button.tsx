"use client";

import clsx from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      className,
      disabled,
      type = "button",
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={clsx(
          // base — applies to every variant
          "inline-flex items-center justify-center gap-2 rounded font-bold",
          "transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          "disabled:opacity-50 disabled:cursor-not-allowed",

          // size
          size === "sm" && "text-sm px-3 py-1.5",
          size === "md" && "text-base px-4 py-2",

          // variant
          variant === "primary" &&
            "bg-primary text-on-primary hover:opacity-90",
          variant === "secondary" &&
            "bg-secondary text-on-secondary hover:opacity-90",
          variant === "ghost" &&
            "bg-transparent text-foreground border border-border hover:bg-border/40",
          variant === "danger" && "bg-danger text-white hover:opacity-90",

          fullWidth && "w-full",
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
