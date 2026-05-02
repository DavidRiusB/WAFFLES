type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base = "px-4 py-2 rounded-lg font-medium";

  const styles =
    variant === "primary"
      ? "bg-yellow-400 text-black hover:bg-yellow-500"
      : "border border-gray-300 text-gray-700 hover:bg-gray-100";

  return (
    <button {...props} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}
