export function formatPrice(price: string | number | null, currency: string) {
  if (price === null || price === undefined || price === "") return null;
  const amount = Number(price);
  if (Number.isNaN(amount)) return null;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Unknown currency code: fall back to plain text.
    return `${currency} ${amount}`;
  }
}

export function formatDuration(days: number, nights: number) {
  return `${days} Day${days === 1 ? "" : "s"} / ${nights} Night${nights === 1 ? "" : "s"}`;
}

// Tomorrow as "YYYY-MM-DD": the earliest date a visitor can pick for a trip.
export function tomorrowISO() {
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
