"use client";

import clsx from "clsx";
import { SelectHTMLAttributes, forwardRef } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ invalid = false, className, children, ...rest }, ref) => {
    return (
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={clsx(
          // base — mirrors Input
          "block w-full rounded bg-surface text-foreground",
          "px-3 py-2 text-base",
          "border border-border",

          // focus — same ring as Input/Button
          "focus:outline-none focus:border-foreground focus:ring-2 focus:ring-accent",

          // disabled
          "disabled:opacity-50 disabled:cursor-not-allowed",

          // invalid
          invalid && "border-danger focus:border-danger focus:ring-danger/40",

          className,
        )}
        {...rest}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = "Select";
