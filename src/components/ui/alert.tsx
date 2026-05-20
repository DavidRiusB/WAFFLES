import clsx from "clsx";
import { HTMLAttributes, forwardRef } from "react";

type Variant = "info" | "success" | "warning" | "danger";

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: Variant;
  title?: string;
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "info", title, className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={clsx(
          // base — every alert
          "rounded-lg border p-4 text-sm flex flex-col gap-1",

          // variants — same pattern as Badge: -text + base border + /10 bg
          variant === "info" && "text-foreground border-border bg-surface",
          variant === "success" &&
            "text-success-text border-success bg-success/10",
          variant === "warning" &&
            "text-warning-text border-warning bg-warning/10",
          variant === "danger" && "text-danger-text border-danger bg-danger/10",

          className,
        )}
        {...rest}
      >
        {title && <p className="font-bold">{title}</p>}
        <div>{children}</div>
      </div>
    );
  },
);

Alert.displayName = "Alert";
