export interface Barber {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  image_url: string;
  active: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price_inr: number;
  duration_min: number;
  image_url: string;
  active: boolean;
  created_at: string;
}

export type BookingStatus = 'Waiting' | 'Called' | 'Hold' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  reference_no: string;
  customer_name: string;
  phone: string;
  barber_id: string;
  service_id: string;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // HH:mm
  status: BookingStatus;
  queue_position: number;
  created_at: string;
  // Hydrated helper fields
  barber_name?: string;
  service_name?: string;
  service_duration?: number;
  service_price?: number;
}

export interface HaircutStyle {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
}

export interface BusinessInfo {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  hours: string;
  map_url: string;
  // Regional and location branding badges
  region_badge?: string; // e.g. "Pampore · Kashmir"
  location_badge?: string; // e.g. "Frestabal, Pampore"
  // Visual assets & logos
  logo_url?: string;
  logo_text?: string;
  favicon_url?: string;
  hero_image_url?: string;
  hero_headline?: string;
  hero_description?: string;
  hero_caption?: string; // e.g. "Frestabal, Pampore · Open until 8:30 PM"
  visit_image_url?: string;
  // Section text overrides
  announcement_bar?: string;
  friday_break?: string;
  developer_name?: string; // e.g. "Developed by Shujaat"
  developer_whatsapp?: string; // e.g. "9622229622"
  services_title?: string;
  services_subtitle?: string;
  barbers_title?: string;
  barbers_subtitle?: string;
  styles_title?: string;
  styles_subtitle?: string;
  booking_title?: string;
  booking_subtitle?: string;
  queue_title?: string;
  queue_subtitle?: string;
  visit_title?: string;
  visit_subtitle?: string;
}

export interface BarberSchedule {
  id: string;
  barber_id: string;
  day_of_week: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  start_time: string; // e.g. "09:30"
  end_time: string; // e.g. "20:00"
  active: boolean;
}

export interface TimeSlot {
  time: string; // "10:00"
  available: boolean;
  reason?: string;
}

export interface SalonDataResponse {
  business: BusinessInfo;
  barbers: Barber[];
  services: Service[];
  styles: HaircutStyle[];
  barberQueues: Record<string, { waitingCount: number; currentServing?: string }>;
}

export interface QueueCheckResponse {
  booking: Booking;
  customers_ahead: number;
  barber_name: string;
  service_name: string;
  estimated_wait_min: number;
  multiple_bookings?: Booking[];
}
