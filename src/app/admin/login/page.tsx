import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Admin sign in</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Staff only. Sign in to manage bookings and destinations.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
