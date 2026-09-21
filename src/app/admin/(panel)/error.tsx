"use client";

// Next.js shows this if anything in the admin panel throws (e.g. the backend
// is down). error.tsx files must be Client Components.
export default function PanelError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="max-w-lg rounded-lg border border-red-200 bg-red-50 p-6">
      <h1 className="font-semibold text-red-800">Something went wrong</h1>
      <p className="mt-2 text-sm text-red-700">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
      >
        Try again
      </button>
    </div>
  );
}
