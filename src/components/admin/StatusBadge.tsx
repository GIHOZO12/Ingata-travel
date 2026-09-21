import type { BookingStatus } from "@/lib/types";

const styles: Record<BookingStatus, string> = {
  NEW: "bg-blue-100 text-blue-800",
  PENDING: "bg-amber-100 text-amber-800",
  AWAITING_CUSTOMER: "bg-orange-100 text-orange-800",
  AWAITING_PAYMENT: "bg-orange-100 text-orange-800",
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  COMPLETED: "bg-zinc-200 text-zinc-800",
  CANCELLED: "bg-red-100 text-red-800",
  REJECTED: "bg-red-100 text-red-800",
};

// "AWAITING_PAYMENT" -> "Awaiting payment"
export function statusLabel(status: string) {
  const text = status.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {statusLabel(status)}
    </span>
  );
}
