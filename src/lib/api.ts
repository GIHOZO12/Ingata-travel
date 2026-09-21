import type { ApiResponse, Destination } from "@/lib/types";

// All calls to the Express backend live here so pages stay small.
// These run on the server (called from Server Components).
export async function getDestinations(): Promise<Destination[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/destinations`);

  if (!res.ok) {
    throw new Error(`Failed to fetch destinations: ${res.status}`);
  }

  const json: ApiResponse<Destination[]> = await res.json();
  return json.data;
}
