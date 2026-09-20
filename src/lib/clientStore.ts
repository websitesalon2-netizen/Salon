import type {
  Barber,
  Service,
  Booking,
  HaircutStyle,
  BusinessInfo,
  BarberSchedule,
  TimeSlot,
  SalonDataResponse,
  QueueCheckResponse
} from '../types';

const STORAGE_KEY = 'kashmir_salon_client_db_v1';
const MANAGER_PASSWORD_KEY = 'kashmir_salon_manager_pw';

interface LocalDatabase {
  business: BusinessInfo;
  barbers: Barber[];
  services: Service[];
  styles: HaircutStyle[];
  bookings: Booking[];
  schedules: BarberSchedule[];
}

const DEFAULT_BUSINESS: BusinessInfo = {
  id: 'biz-1',
  name: 'Jawed Habib',
  tagline: "Pampore's Premier Men's Salon & Grooming Sanctuary",
  description: "Pampore's premier men’s salon and traditional grooming sanctuary. Rooted in Kashmiri craftsmanship and walnut-wood calmness, we blend authentic Turkish-Kashmiri razor craft with modern precision styling.",
  address: "Kadlabal Pampore Near JK Bank, Pampore, Jammu & Kashmir 192121",
  phone: "+91 9622229622",
  whatsapp: "+91 9622229622",
  hours: "Monday – Sunday: 9:30 AM – 8:30 PM",
  map_url: "https://maps.google.com/?q=Kadlabal+Pampore+Jammu+and+Kashmir",
  region_badge: "Pampore · Kashmir",
  location_badge: "Frestabal, Pampore",
  logo_text: "J",
  logo_url: "",
  favicon_url: "",
  hero_headline: "Traditional Craftsmanship, Modern Precision",
  hero_description: "Experience the timeless ritual of royal Kashmiri hot towel shaves, bespoke scissor architecture, and revitalizing walnut oil scalp therapies along the serene saffron fields of Pampore.",
  hero_caption: "Frestabal, Pampore · Open until 8:30 PM",
  hero_image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80",
  visit_image_url: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80",
  announcement_bar: "",
  friday_break: "Friday Jummah break 12:30 PM - 2:30 PM",
  developer_name: "Developed by Shujaat",
  developer_whatsapp: "9622229622",
  services_title: "Signature Grooming & Services",
  services_subtitle: "Every appointment begins with warm consultation and ends with tailored styling. All treatments are performed using premium Kashmiri herbal botanicals.",
  barbers_title: "Meet Pampore’s Dedicated Barbers",
  barbers_subtitle: "Honoring generations of Kashmiri grooming heritage. Each master barber brings specialized scissors precision, razor craftsmanship, and relaxed hospitality.",
  styles_title: "Popular Haircut Styles & Scissor Work",
  styles_subtitle: "From classic gentlemen’s contours to crisp skin fades and traditional Kashmiri beard sculpts. Pick your signature aesthetic.",
  booking_title: "Book Your Grooming Chair",
  booking_subtitle: "Select your preferred master barber, signature service, date and time for instant confirmed booking.",
  queue_title: "Track Your Appointment & Queue",
  queue_subtitle: "Real-time queue tracking for walk-in and booked appointments in Pampore lounge.",
  visit_title: "Visit Us in Pampore",
  visit_subtitle: "Situated in Kadlabal near Saffron Town. Easy parking and serene Kashmiri hospitality await you."
};

const DEFAULT_BARBERS: Barber[] = [
  {
    id: 'barber-1',
    name: 'Ustad Tariq Mir',
    specialty: 'Master Razor Craftsman & Traditional Beard Sculptor',
    bio: 'Over 14 years perfecting authentic hot-towel straight-razor cuts, royal Kashmiri shaves, and contoured beard designs in Pampore.',
    image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&q=80',
    active: true,
    created_at: '2026-01-10T10:00:00Z'
  },
  {
    id: 'barber-2',
    name: 'Zubair Wani',
    specialty: 'Creative Director & Precision Fade Specialist',
    bio: 'Trained in contemporary London & Delhi hair architecture; renowned for seamless skin fades, textured crops, and scissor tapers.',
    image_url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=700&q=80',
    active: true,
    created_at: '2026-01-12T10:00:00Z'
  },
  {
    id: 'barber-3',
    name: 'Bilal Khan',
    specialty: 'Saffron Spa & Scalp Revitalization Specialist',
    bio: 'Expert in soothing acupressure head massages using cold-pressed Kashmiri walnut oil and organic saffron steam infusions.',
    image_url: 'https://images.unsplash.com/photo-1517832606589-7629c3395909?auto=format&fit=crop&w=700&q=80',
    active: true,
    created_at: '2026-02-01T10:00:00Z'
  },
  {
    id: 'barber-4',
    name: 'Farooq Rather',
    specialty: 'Executive Haircut & Modern Classic Stylist',
    bio: 'Specialist in boardroom-ready low tapers, natural scissor parting, and precision hairline restorations for gentlemen of taste.',
    image_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=700&q=80',
    active: true,
    created_at: '2026-02-15T10:00:00Z'
  }
];

const DEFAULT_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'Royal Kashmiri Hot Towel Shave',
    description: 'Handcrafted hot towels infused with lavender and clove, pre-shave almond balm, straight razor shave, and saffron-witch hazel splash.',
    price_inr: 350,
    duration_min: 30,
    image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    active: true,
    created_at: '2026-01-01T10:00:00Z'
  },
  {
    id: 'srv-2',
    name: 'Signature Executive Haircut',
    description: 'Precision scissor and clipper consultation, bespoke taper or side-contour, clarifying wash, and matte styling balm finish.',
    price_inr: 450,
    duration_min: 40,
    image_url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80',
    active: true,
    created_at: '2026-01-01T10:00:00Z'
  },
  {
    id: 'srv-3',
    name: 'Precision Fade & Texture Cut',
    description: 'Seamless low/mid skin fade, foil shaver detailing, crown texturing, and cold towel hairline refresh.',
    price_inr: 500,
    duration_min: 45,
    image_url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80',
    active: true,
    created_at: '2026-01-01T10:00:00Z'
  },
  {
    id: 'srv-4',
    name: 'Artisan Beard Sculpting & Razor Edge',
    description: 'Custom volumetric trimming, razor cheek and neck contouring, tea-tree hot compress, and argan beard butter nourishment.',
    price_inr: 300,
    duration_min: 25,
    image_url: 'https://images.unsplash.com/photo-1517832606589-7629c3395909?auto=format&fit=crop&w=600&q=80',
    active: true,
    created_at: '2026-01-01T10:00:00Z'
  },
  {
    id: 'srv-5',
    name: 'Kashmiri Walnut Oil Scalp Therapy',
    description: 'Traditional deep-tissue head and shoulder acupressure with warm cold-pressed walnut and almond oils, herbal steam, and rinse.',
    price_inr: 600,
    duration_min: 45,
    image_url: 'https://images.unsplash.com/photo-1519500099198-fd81846b8f03?auto=format&fit=crop&w=600&q=80',
    active: true,
    created_at: '2026-01-01T10:00:00Z'
  },
  {
    id: 'srv-6',
    name: 'The Pampore Gentleman Complete Package',
    description: 'Executive Haircut + Hot Towel Shave + Walnut Oil Head Massage + Purifying Clay Face Mask.',
    price_inr: 1200,
    duration_min: 90,
    image_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80',
    active: true,
    created_at: '2026-01-01T10:00:00Z'
  }
];

const DEFAULT_STYLES: HaircutStyle[] = [
  {
    id: 'style-1',
    name: 'Classic Kashmiri Taper & Scissor Part',
    image_url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80',
    created_at: '2026-01-01T10:00:00Z'
  },
  {
    id: 'style-2',
    name: 'Textured Crop with Low Drop Fade',
    image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    created_at: '2026-01-01T10:00:00Z'
  },
  {
    id: 'style-3',
    name: 'Gentleman Slick Back & Undercut',
    image_url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80',
    created_at: '2026-01-01T10:00:00Z'
  },
  {
    id: 'style-4',
    name: 'Mid Skin Fade & Sculpted Beard Contour',
    image_url: 'https://images.unsplash.com/photo-1517832606589-7629c3395909?auto=format&fit=crop&w=600&q=80',
    created_at: '2026-01-01T10:00:00Z'
  },
  {
    id: 'style-5',
    name: 'Natural Flow Wave & Soft Neckline',
    image_url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80',
    created_at: '2026-01-01T10:00:00Z'
  },
  {
    id: 'style-6',
    name: 'Pompadour Fade with Sharp Razor Part',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    created_at: '2026-01-01T10:00:00Z'
  }
];

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'book-seed-1',
    reference_no: 'KS-20260917-4821',
    customer_name: 'Shujaat Ahmad',
    phone: '9622229622',
    barber_id: 'barber-1',
    service_id: 'srv-1',
    appointment_date: getTodayString(),
    appointment_time: '10:00',
    status: 'Called',
    queue_position: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'book-seed-2',
    reference_no: 'KS-20260917-3194',
    customer_name: 'Irfan Yasin',
    phone: '9419012345',
    barber_id: 'barber-2',
    service_id: 'srv-2',
    appointment_date: getTodayString(),
    appointment_time: '11:00',
    status: 'Waiting',
    queue_position: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'book-seed-3',
    reference_no: 'KS-20260917-5920',
    customer_name: 'Mudasir Zargar',
    phone: '9419067890',
    barber_id: 'barber-3',
    service_id: 'srv-5',
    appointment_date: getTodayString(),
    appointment_time: '11:30',
    status: 'Waiting',
    queue_position: 3,
    created_at: new Date().toISOString()
  }
];

function getDefaultSchedules(): BarberSchedule[] {
  const scheds: BarberSchedule[] = [];
  for (const b of DEFAULT_BARBERS) {
    for (let day = 0; day <= 6; day++) {
      scheds.push({
        id: `sched-${b.id}-${day}`,
        barber_id: b.id,
        day_of_week: day,
        start_time: '09:30',
        end_time: '20:30',
        active: true
      });
    }
  }
  return scheds;
}

class ClientStore {
  private db: LocalDatabase;

  constructor() {
    this.db = this.load();
  }

  private load(): LocalDatabase {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.business && parsed.barbers?.length) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }

    const initial: LocalDatabase = {
      business: DEFAULT_BUSINESS,
      barbers: DEFAULT_BARBERS,
      services: DEFAULT_SERVICES,
      styles: DEFAULT_STYLES,
      bookings: DEFAULT_BOOKINGS,
      schedules: getDefaultSchedules()
    };
    this.save(initial);
    return initial;
  }

  private save(db: LocalDatabase) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {
      // storage quota or private browsing
    }
  }

  private hydrateBooking(b: Booking): Booking {
    const barber = this.db.barbers.find(x => x.id === b.barber_id);
    const service = this.db.services.find(x => x.id === b.service_id);
    return {
      ...b,
      barber_name: barber ? barber.name : undefined,
      service_name: service ? service.name : undefined,
      service_duration: service ? service.duration_min : undefined,
      service_price: service ? service.price_inr : undefined
    };
  }

  // -------------------------------------------------------------
  // Public APIs
  // -------------------------------------------------------------
  getSalonData(): SalonDataResponse {
    const today = getTodayString();
    const todayBookings = this.db.bookings.filter(b => b.appointment_date === today);

    const barberQueues: Record<string, { waitingCount: number; currentServing?: string }> = {};
    for (const barber of this.db.barbers) {
      const bList = todayBookings.filter(b => b.barber_id === barber.id);
      const waiting = bList.filter(b => b.status === 'Waiting');
      const called = bList.find(b => b.status === 'Called');
      barberQueues[barber.id] = {
        waitingCount: waiting.length,
        currentServing: called ? called.customer_name : undefined
      };
    }

    return {
      business: this.db.business,
      barbers: this.db.barbers.filter(b => b.active),
      services: this.db.services.filter(s => s.active),
      styles: this.db.styles,
      barberQueues
    };
  }

  getAvailability(date: string, barberId: string, _serviceId?: string): { slots: TimeSlot[] } {
    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.getDay();
    const schedule = this.db.schedules.find(s => s.barber_id === barberId && s.day_of_week === dayOfWeek);

    if (!schedule || !schedule.active) {
      return { slots: [] };
    }

    const [startH, startM] = schedule.start_time.split(':').map(Number);
    const [endH, endM] = schedule.end_time.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    const existingBookings = this.db.bookings.filter(
      b => b.barber_id === barberId && b.appointment_date === date && b.status !== 'Cancelled'
    );

    const slots: TimeSlot[] = [];
    const interval = 30; // 30 min slots

    for (let m = startMinutes; m < endMinutes; m += interval) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const timeStr = `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;

      // Friday prayer check
      if (dayOfWeek === 5 && m >= 12 * 60 + 30 && m < 14 * 60 + 30) {
        slots.push({ time: timeStr, available: false, reason: 'Friday Jummah Break' });
        continue;
      }

      const booked = existingBookings.some(b => b.appointment_time === timeStr);
      slots.push({
        time: timeStr,
        available: !booked,
        reason: booked ? 'Slot Reserved' : undefined
      });
    }

    return { slots };
  }

  createBooking(data: {
    customer_name: string;
    phone: string;
    barber_id: string;
    service_id: string;
    appointment_date: string;
    appointment_time: string;
  }): { success: boolean; booking: Booking } {
    const todayStr = getTodayString().replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const reference_no = `KS-${todayStr}-${randomSuffix}`;

    const dateBookings = this.db.bookings.filter(b => b.appointment_date === data.appointment_date);
    const nextQueuePos = dateBookings.length + 1;

    const newBooking: Booking = {
      id: `book-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      reference_no,
      customer_name: data.customer_name.trim(),
      phone: data.phone.trim(),
      barber_id: data.barber_id,
      service_id: data.service_id,
      appointment_date: data.appointment_date,
      appointment_time: data.appointment_time,
      status: 'Waiting',
      queue_position: nextQueuePos,
      created_at: new Date().toISOString()
    };

    this.db.bookings.push(newBooking);
    this.save(this.db);

    return { success: true, booking: this.hydrateBooking(newBooking) };
  }

  getQueueStatus(identifier: string): QueueCheckResponse | null {
    const cleanId = identifier.trim().toLowerCase().replace(/\s+/g, '');
    if (!cleanId) return null;

    // Search by reference code or phone
    const matches = this.db.bookings.filter(b => {
      const refMatch = b.reference_no.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanId.replace(/[^a-z0-9]/g, '');
      const phoneMatch = b.phone.replace(/[^0-9]/g, '').endsWith(cleanId.replace(/[^0-9]/g, '')) ||
                         cleanId.replace(/[^0-9]/g, '').endsWith(b.phone.replace(/[^0-9]/g, ''));
      return refMatch || phoneMatch;
    });

    if (matches.length === 0) return null;

    // Prioritize active waiting/called bookings
    matches.sort((a, b) => {
      const order: Record<string, number> = { Called: 1, Waiting: 2, Hold: 3, Completed: 4, Cancelled: 5 };
      return (order[a.status] || 9) - (order[b.status] || 9);
    });

    const primary = matches[0];
    const barber = this.db.barbers.find(b => b.id === primary.barber_id);
    const service = this.db.services.find(s => s.id === primary.service_id);

    // Calculate customers ahead
    const ahead = this.db.bookings.filter(
      b => b.barber_id === primary.barber_id &&
           b.appointment_date === primary.appointment_date &&
           b.status === 'Waiting' &&
           b.queue_position < primary.queue_position
    ).length;

    const estimated_wait_min = ahead * 25;

    return {
      booking: this.hydrateBooking(primary),
      customers_ahead: ahead,
      barber_name: barber ? barber.name : 'Master Barber',
      service_name: service ? service.name : 'Grooming Service',
      estimated_wait_min,
      multiple_bookings: matches.length > 1 ? matches.map(m => this.hydrateBooking(m)) : undefined
    };
  }

  getLiveQueueBoard() {
    const today = getTodayString();
    const todayBookings = this.db.bookings
      .filter(b => b.appointment_date === today && (b.status === 'Waiting' || b.status === 'Called'))
      .sort((a, b) => a.queue_position - b.queue_position);

    const activeQueue = todayBookings.map(b => {
      const barber = this.db.barbers.find(x => x.id === b.barber_id);
      const service = this.db.services.find(x => x.id === b.service_id);
      const nameParts = b.customer_name.trim().split(' ');
      const masked = nameParts.length > 1
        ? `${nameParts[0]} ${nameParts[1].charAt(0)}.`
        : `${b.customer_name.charAt(0)}***`;

      return {
        reference_no: b.reference_no,
        customer_masked: masked,
        barber_name: barber?.name,
        service_name: service?.name,
        appointment_time: b.appointment_time,
        status: b.status,
        queue_position: b.queue_position
      };
    });

    return {
      date: today,
      activeQueue,
      totalWaiting: todayBookings.filter(b => b.status === 'Waiting').length,
      currentlyServing: todayBookings.filter(b => b.status === 'Called').length
    };
  }

  // -------------------------------------------------------------
  // Manager APIs
  // -------------------------------------------------------------
  verifyManagerPassword(password: string): boolean {
    const stored = localStorage.getItem(MANAGER_PASSWORD_KEY);
    const validPassword = stored || 'kashmir123';
    return password === validPassword;
  }

  changeManagerPassword(currentPassword: string, newPassword: string): { success: boolean; message: string } {
    if (!this.verifyManagerPassword(currentPassword)) {
      throw new Error('Current password is incorrect.');
    }
    if (!newPassword || newPassword.length < 4) {
      throw new Error('New password must be at least 4 characters long.');
    }
    localStorage.setItem(MANAGER_PASSWORD_KEY, newPassword);
    return { success: true, message: 'Manager password updated successfully.' };
  }

  getManagerBookings(date?: string): Booking[] {
    let list = this.db.bookings;
    if (date) {
      list = list.filter(b => b.appointment_date === date);
    }
    return list.map(b => this.hydrateBooking(b));
  }

  updateBookingStatus(id: string, status: any): Booking {
    const idx = this.db.bookings.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Booking not found');
    this.db.bookings[idx].status = status;
    this.save(this.db);
    return this.hydrateBooking(this.db.bookings[idx]);
  }

  deleteBooking(id: string) {
    this.db.bookings = this.db.bookings.filter(b => b.id !== id);
    this.save(this.db);
  }

  updateBusiness(info: Partial<BusinessInfo>): BusinessInfo {
    this.db.business = { ...this.db.business, ...info };
    this.save(this.db);
    return this.db.business;
  }

  getBarbers(): Barber[] {
    return this.db.barbers;
  }

  createBarber(barber: Partial<Barber>): Barber {
    const newBarber: Barber = {
      id: `barber-${Date.now()}`,
      name: barber.name || 'New Barber',
      specialty: barber.specialty || 'Master Barber',
      bio: barber.bio || '',
      image_url: barber.image_url || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&q=80',
      active: barber.active !== undefined ? barber.active : true,
      created_at: new Date().toISOString()
    };
    this.db.barbers.push(newBarber);
    this.save(this.db);
    return newBarber;
  }

  updateBarber(id: string, updates: Partial<Barber>): Barber {
    const idx = this.db.barbers.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Barber not found');
    this.db.barbers[idx] = { ...this.db.barbers[idx], ...updates };
    this.save(this.db);
    return this.db.barbers[idx];
  }

  deleteBarber(id: string) {
    this.db.barbers = this.db.barbers.filter(b => b.id !== id);
    this.save(this.db);
  }

  getServices(): Service[] {
    return this.db.services;
  }

  createService(service: Partial<Service>): Service {
    const newService: Service = {
      id: `srv-${Date.now()}`,
      name: service.name || 'New Service',
      description: service.description || '',
      price_inr: Number(service.price_inr) || 300,
      duration_min: Number(service.duration_min) || 30,
      image_url: service.image_url || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80',
      active: service.active !== undefined ? service.active : true,
      created_at: new Date().toISOString()
    };
    this.db.services.push(newService);
    this.save(this.db);
    return newService;
  }

  updateService(id: string, updates: Partial<Service>): Service {
    const idx = this.db.services.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Service not found');
    this.db.services[idx] = { ...this.db.services[idx], ...updates };
    this.save(this.db);
    return this.db.services[idx];
  }

  deleteService(id: string) {
    this.db.services = this.db.services.filter(s => s.id !== id);
    this.save(this.db);
  }

  getStyles(): HaircutStyle[] {
    return this.db.styles;
  }

  createStyle(style: Partial<HaircutStyle>): HaircutStyle {
    const newStyle: HaircutStyle = {
      id: `style-${Date.now()}`,
      name: style.name || 'New Style',
      image_url: style.image_url || 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80',
      created_at: new Date().toISOString()
    };
    this.db.styles.push(newStyle);
    this.save(this.db);
    return newStyle;
  }

  updateStyle(id: string, updates: Partial<HaircutStyle>): HaircutStyle {
    const idx = this.db.styles.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Style not found');
    this.db.styles[idx] = { ...this.db.styles[idx], ...updates };
    this.save(this.db);
    return this.db.styles[idx];
  }

  deleteStyle(id: string) {
    this.db.styles = this.db.styles.filter(s => s.id !== id);
    this.save(this.db);
  }

  getSchedules(): BarberSchedule[] {
    return this.db.schedules;
  }

  updateSchedule(id: string, updates: Partial<BarberSchedule>): BarberSchedule {
    const idx = this.db.schedules.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Schedule not found');
    this.db.schedules[idx] = { ...this.db.schedules[idx], ...updates };
    this.save(this.db);
    return this.db.schedules[idx];
  }

  // Developer Desk Operations
  exportAll(): LocalDatabase {
    return JSON.parse(JSON.stringify(this.db));
  }

  importAll(data: any): boolean {
    if (!data || !data.business || !Array.isArray(data.barbers)) {
      throw new Error('Invalid JSON structure: missing business or barbers.');
    }
    this.db = {
      ...this.db,
      ...data
    };
    this.save(this.db);
    return true;
  }

  resetToDefaults(): boolean {
    localStorage.removeItem(STORAGE_KEY);
    this.db = this.load();
    return true;
  }
}

export const clientStore = new ClientStore();
