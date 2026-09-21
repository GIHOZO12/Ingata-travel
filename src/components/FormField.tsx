// Label + input + error text for the PUBLIC forms (booking, inquiry).
// The colors are explicit so inputs stay readable even in the browser's dark mode.
export const inputClass =
  "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900";

export default function Field({
  label,
  name,
  error,
  required,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-zinc-700">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
