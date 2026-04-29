type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps) {
  return (
    <input
      {...props}
      className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
    />
  );
}
