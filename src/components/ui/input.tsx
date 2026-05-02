export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} className="border px-3 py-3 rounded-lg w-full text-sm" />
  );
}
