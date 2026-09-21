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

export interface ItineraryDay {
  id: number;
  dayNumber: number;
  title: string;
  activities: string[];
}

export interface Tour {
  id: number;
  name: string;
  slug: string;
  category: string;
  durationDays: number;
  durationNights: number;
  // The database's Decimal type arrives as a string, e.g. "1200.00".
  startingPrice: string | null;
  currency: string;
  overview: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  requirements: string[];
  featuredImage: string | null;
  images: string[];
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  destinationId: number;
  destination: { id: number; name: string; slug: string; country: string };
}

export interface TourDetail extends Tour {
  itineraryDays: ItineraryDay[];
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  order: number;
  isPublished: boolean;
}

export const INQUIRY_STATUSES = ["NEW", "CONTACTED", "CLOSED"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export interface Inquiry {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  destinationName: string | null;
  preferredDate: string | null;
  numberOfTravelers: number | null;
  message: string | null;
  status: InquiryStatus;
  createdAt: string;
  tour: { id: number; name: string; slug: string } | null;
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
