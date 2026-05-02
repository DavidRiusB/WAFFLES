import React from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className = "", children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={`border px-3 py-3 rounded-lg w-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 ${className}`}
    >
      {children}
    </select>
  );
}
