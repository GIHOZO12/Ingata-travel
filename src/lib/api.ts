import type {
  ApiResponse,
  BlogPost,
  Destination,
  FAQ,
  Testimonial,
  Tour,
  TourDetail,
} from "@/lib/types";
import { API_TIMEOUT_MS } from "@/lib/api-timeout";

// All calls to the Express backend live here so pages stay small.
// These run on the server (called from Server Components).
const API = process.env.NEXT_PUBLIC_API_URL;

export async function getDestinations(): Promise<Destination[]> {
  const res = await fetch(`${API}/destinations`, {
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch destinations: ${res.status}`);
  }

  const json: ApiResponse<Destination[]> = await res.json();
  return json.data;
}

export async function getTours(): Promise<Tour[]> {
  const res = await fetch(`${API}/tours`, {
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch tours: ${res.status}`);
  }

  const json: ApiResponse<Tour[]> = await res.json();
  return json.data;
}

export async function getFAQs(): Promise<FAQ[]> {
  const res = await fetch(`${API}/faqs`, {
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch FAQs: ${res.status}`);
  }

  const json: ApiResponse<FAQ[]> = await res.json();
  return json.data;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const res = await fetch(`${API}/testimonials`, {
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch testimonials: ${res.status}`);
  }

  const json: ApiResponse<Testimonial[]> = await res.json();
  return json.data;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const res = await fetch(`${API}/blog`, {
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch blog posts: ${res.status}`);
  }

  const json: ApiResponse<BlogPost[]> = await res.json();
  return json.data;
}

// Returns null when the post doesn't exist (or the API can't be reached at
// all, or is too slow to respond — e.g. no backend deployed yet), so the
// page can show a clean 404 instead of crashing the whole build/request.
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API}/blog/${encodeURIComponent(slug)}`, {
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const json: ApiResponse<BlogPost> = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

// Same idea for tours (SRS tour detail page).
export async function getTour(slug: string): Promise<TourDetail | null> {
  try {
    const res = await fetch(`${API}/tours/${encodeURIComponent(slug)}`, {
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const json: ApiResponse<TourDetail> = await res.json();
    return json.data;
  } catch {
    return null;
  }
}
