"use client";

import clsx from "clsx";
import { InputHTMLAttributes, forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ invalid = false, className, type = "text", ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        aria-invalid={invalid || undefined}
        className={clsx(
          // base
          "block w-full rounded bg-surface text-foreground",
          "px-3 py-2 text-base",
          "border border-border",
          "placeholder:text-muted/60",

          // focus — uses accent ring, matches button focus
          "focus:outline-none focus:border-foreground focus:ring-2 focus:ring-accent",

          // disabled
          "disabled:opacity-50 disabled:cursor-not-allowed",

          // invalid — overrides border
          invalid && "border-danger focus:border-danger focus:ring-danger/40",

          className,
        )}
        {...rest}
      />
    );
  },
);

Input.displayName = "Input";
