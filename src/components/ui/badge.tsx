import clsx from "clsx";
import { HTMLAttributes, forwardRef } from "react";

type Variant = "neutral" | "success" | "warning" | "danger" | "accent";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant;
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "neutral", className, children, ...rest }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          // base — always
          "inline-flex items-center rounded px-2 py-0.5 text-sm font-bold border",

          // variants — text uses -text token (darkened for legibility),
          // border uses the base semantic color
          variant === "neutral" && "text-muted border-border bg-surface",
          variant === "success" &&
            "text-success-text border-success bg-success/10",
          variant === "warning" &&
            "text-warning-text border-warning bg-warning/10",
          variant === "danger" && "text-danger-text border-danger bg-danger/10",
          variant === "accent" && "text-on-primary border-accent bg-accent/20",

          className,
        )}
        {...rest}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
