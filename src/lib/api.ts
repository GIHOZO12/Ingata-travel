import type {
  ApiResponse,
  Destination,
  FAQ,
  Tour,
  TourDetail,
} from "@/lib/types";

// All calls to the Express backend live here so pages stay small.
// These run on the server (called from Server Components).
const API = process.env.NEXT_PUBLIC_API_URL;

export async function getDestinations(): Promise<Destination[]> {
  const res = await fetch(`${API}/destinations`);

  if (!res.ok) {
    throw new Error(`Failed to fetch destinations: ${res.status}`);
  }

  const json: ApiResponse<Destination[]> = await res.json();
  return json.data;
}

export async function getTours(): Promise<Tour[]> {
  const res = await fetch(`${API}/tours`);

  if (!res.ok) {
    throw new Error(`Failed to fetch tours: ${res.status}`);
  }

  const json: ApiResponse<Tour[]> = await res.json();
  return json.data;
}

export async function getFAQs(): Promise<FAQ[]> {
  const res = await fetch(`${API}/faqs`);

  if (!res.ok) {
    throw new Error(`Failed to fetch FAQs: ${res.status}`);
  }

  const json: ApiResponse<FAQ[]> = await res.json();
  return json.data;
}

// Returns null when the tour doesn't exist, so the page can show a 404.
export async function getTour(slug: string): Promise<TourDetail | null> {
  const res = await fetch(`${API}/tours/${encodeURIComponent(slug)}`);

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to fetch tour: ${res.status}`);
  }

  const json: ApiResponse<TourDetail> = await res.json();
  return json.data;
}
