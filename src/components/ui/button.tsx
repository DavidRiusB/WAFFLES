type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

export function Button({ children, variant = "primary" }: ButtonProps) {
  const base = "px-4 py-2 rounded-lg font-medium";

  const styles =
    variant === "primary"
      ? "bg-yellow-400 text-black"
      : "border border-gray-300 text-gray-700";

  return <button className={`${base} ${styles}`}>{children}</button>;
}
