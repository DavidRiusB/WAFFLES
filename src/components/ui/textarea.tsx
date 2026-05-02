import React from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={`border px-3 py-3 rounded-lg w-full text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 ${className}`}
    />
  );
}
