// Mirrors the backend's Prisma models (see the backend repo's
// prisma/schema.prisma) — this is the contract between the two projects.
// Keep in sync manually for now; there's no shared package between the
// two separate repos.

export interface Destination {
  id: number;
  name: string;
  slug: string;
  country: string;
  overview: string;
  attractions: string[];
  activities: string[];
  bestTimeToVisit: string | null;
  heroImage: string | null;
  images: string[];
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export const BOOKING_STATUSES = [
  "NEW",
  "PENDING",
  "AWAITING_CUSTOMER",
  "AWAITING_PAYMENT",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "REJECTED",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export interface BookingRequest {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  nationality: string | null;
  travelDate: string;
  numberOfTravelers: number;
  accommodationPref: string | null;
  specialRequests: string | null;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  tour: { id: number; name: string; slug: string };
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
