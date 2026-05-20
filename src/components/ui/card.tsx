import clsx from "clsx";
import { HTMLAttributes, forwardRef } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "article";
  padded?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ as: Tag = "div", padded = true, className, children, ...rest }, ref) => {
    return (
      <Tag
        ref={ref as never}
        className={clsx(
          "bg-surface border border-border rounded-lg",
          padded && "p-4",
          className,
        )}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);

Card.displayName = "Card";
