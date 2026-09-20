var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_fs2 = __toESM(require("fs"), 1);

// server/db.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var DATA_DIR = import_path.default.join(process.cwd(), "data");
var DB_FILE = import_path.default.join(DATA_DIR, "salon_db.json");
function hashPassword(password) {
  return import_crypto.default.createHash("sha256").update(password).digest("hex");
}
var DEFAULT_DB = {
  business: {
    id: "biz-1",
    name: "Kashmir Grooming Lounge",
    description: "Pampore\u2019s premier men\u2019s salon and traditional grooming sanctuary. Rooted in Kashmiri craftsmanship and walnut-wood calmness, we blend authentic Turkish-Kashmiri razor craft with modern precision styling.",
    address: "Kadlabal, Near Saffron Market, Pampore, Jammu & Kashmir 192121",
    phone: "+91 94190 12345",
    whatsapp: "+91 94190 12345",
    hours: "Monday \u2013 Sunday: 9:30 AM \u2013 8:30 PM (Friday Jummah break 12:30 PM - 2:30 PM)",
    map_url: "https://maps.google.com/?q=Kadlabal+Pampore+Jammu+and+Kashmir"
  },
  barbers: [
    {
      id: "barber-1",
      name: "Ustad Tariq Mir",
      specialty: "Master Razor Craftsman & Traditional Beard Sculptor",
      bio: "Over 14 years perfecting authentic hot-towel straight-razor cuts, royal Kashmiri shaves, and contoured beard designs in Pampore.",
      image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&q=80",
      active: true,
      created_at: "2026-01-10T10:00:00Z"
    },
    {
      id: "barber-2",
      name: "Zubair Wani",
      specialty: "Creative Director & Precision Fade Specialist",
      bio: "Trained in contemporary London & Delhi hair architecture; renowned for seamless skin fades, textured crops, and scissor tapers.",
      image_url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=700&q=80",
      active: true,
      created_at: "2026-01-12T10:00:00Z"
    },
    {
      id: "barber-3",
      name: "Bilal Khan",
      specialty: "Saffron Spa & Scalp Revitalization Specialist",
      bio: "Expert in soothing acupressure head massages using cold-pressed Kashmiri walnut oil and organic saffron steam infusions.",
      image_url: "https://images.unsplash.com/photo-1517832606589-7629c3395909?auto=format&fit=crop&w=700&q=80",
      active: true,
      created_at: "2026-02-01T10:00:00Z"
    },
    {
      id: "barber-4",
      name: "Farooq Rather",
      specialty: "Executive Haircut & Modern Classic Stylist",
      bio: "Specialist in boardroom-ready low tapers, natural scissor parting, and precision hairline restorations for gentlemen of taste.",
      image_url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=700&q=80",
      active: true,
      created_at: "2026-02-15T10:00:00Z"
    }
  ],
  services: [
    {
      id: "srv-1",
      name: "Royal Kashmiri Hot Towel Shave",
      description: "Handcrafted hot towels infused with lavender and clove, pre-shave almond balm, straight razor shave, and saffron-witch hazel splash.",
      price_inr: 350,
      duration_min: 30,
      image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
      active: true,
      created_at: "2026-01-01T10:00:00Z"
    },
    {
      id: "srv-2",
      name: "Signature Executive Haircut",
      description: "Precision scissor and clipper consultation, bespoke taper or side-contour, clarifying wash, and matte styling balm finish.",
      price_inr: 450,
      duration_min: 40,
      image_url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80",
      active: true,
      created_at: "2026-01-01T10:00:00Z"
    },
    {
      id: "srv-3",
      name: "Precision Fade & Texture Cut",
      description: "Seamless low/mid skin fade, foil shaver detailing, crown texturing, and cold towel hairline refresh.",
      price_inr: 500,
      duration_min: 45,
      image_url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80",
      active: true,
      created_at: "2026-01-01T10:00:00Z"
    },
    {
      id: "srv-4",
      name: "Artisan Beard Sculpting & Razor Edge",
      description: "Custom volumetric trimming, razor cheek and neck contouring, tea-tree hot compress, and argan beard butter nourishment.",
      price_inr: 250,
      duration_min: 25,
      image_url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80",
      active: true,
      created_at: "2026-01-01T10:00:00Z"
    },
    {
      id: "srv-5",
      name: "Kashmiri Walnut Oil Scalp Spa",
      description: "Traditional deep pressure scalp & neck therapy using warm cold-pressed walnut oil, warm herbal steam, and anti-stress acupressure.",
      price_inr: 600,
      duration_min: 35,
      image_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      active: true,
      created_at: "2026-01-01T10:00:00Z"
    },
    {
      id: "srv-6",
      name: "The Dal Royal Complete Grooming Package",
      description: "The ultimate gentleman ritual: Signature Haircut, Royal Shave or Beard Sculpting, Walnut Scalp Spa, and refreshing herbal facial cleanse.",
      price_inr: 1250,
      duration_min: 80,
      image_url: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=600&q=80",
      active: true,
      created_at: "2026-01-01T10:00:00Z"
    }
  ],
  styles: [
    {
      id: "style-1",
      name: "Pampore Textured Crop",
      image_url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80",
      created_at: "2026-01-05T10:00:00Z"
    },
    {
      id: "style-2",
      name: "Low Taper & Crisp Lineup",
      image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
      created_at: "2026-01-05T10:00:00Z"
    },
    {
      id: "style-3",
      name: "Executive Side Parting",
      image_url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=600&q=80",
      created_at: "2026-01-05T10:00:00Z"
    },
    {
      id: "style-4",
      name: "Kashmiri Chinar Full Beard Contour",
      image_url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80",
      created_at: "2026-01-05T10:00:00Z"
    },
    {
      id: "style-5",
      name: "Modern Flow & Scissor Finish",
      image_url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80",
      created_at: "2026-01-05T10:00:00Z"
    },
    {
      id: "style-6",
      name: "Mid Skin Fade with Volume Pompadour",
      image_url: "https://images.unsplash.com/photo-1517832606589-7629c3395909?auto=format&fit=crop&w=600&q=80",
      created_at: "2026-01-05T10:00:00Z"
    }
  ],
  bookings: [
    {
      id: "book-1",
      reference_no: "KS-20260917-4821",
      customer_name: "Sheikh Danish",
      phone: "+91 94191 55667",
      barber_id: "barber-1",
      service_id: "srv-1",
      appointment_date: "2026-09-17",
      appointment_time: "10:00",
      status: "Called",
      queue_position: 1,
      created_at: "2026-09-17T08:15:00Z"
    },
    {
      id: "book-2",
      reference_no: "KS-20260917-3194",
      customer_name: "Muzamil Rather",
      phone: "+91 97970 88219",
      barber_id: "barber-2",
      service_id: "srv-3",
      appointment_date: "2026-09-17",
      appointment_time: "10:30",
      status: "Waiting",
      queue_position: 2,
      created_at: "2026-09-17T08:30:00Z"
    },
    {
      id: "book-3",
      reference_no: "KS-20260917-8902",
      customer_name: "Adnan Shah",
      phone: "+91 91495 33412",
      barber_id: "barber-3",
      service_id: "srv-5",
      appointment_date: "2026-09-17",
      appointment_time: "11:00",
      status: "Waiting",
      queue_position: 3,
      created_at: "2026-09-17T08:45:00Z"
    }
  ],
  schedules: [
    // 7 days for each barber
    ...["barber-1", "barber-2", "barber-3", "barber-4"].flatMap(
      (bId) => [0, 1, 2, 3, 4, 5, 6].map((day) => ({
        id: `sched-${bId}-${day}`,
        barber_id: bId,
        day_of_week: day,
        start_time: "09:30",
        end_time: "20:30",
        active: true
      }))
    )
  ],
  manager: {
    username: "manager",
    passwordHash: hashPassword("kashmir2026")
    // default manager password
  }
};
var SalonDatabase = class {
  constructor() {
    if (!import_fs.default.existsSync(DATA_DIR)) {
      import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!import_fs.default.existsSync(DB_FILE)) {
      this.data = JSON.parse(JSON.stringify(DEFAULT_DB));
      this.persist();
    } else {
      try {
        const raw = import_fs.default.readFileSync(DB_FILE, "utf-8");
        this.data = JSON.parse(raw);
        if (!this.data.business) this.data.business = DEFAULT_DB.business;
        if (!this.data.barbers) this.data.barbers = DEFAULT_DB.barbers;
        if (!this.data.services) this.data.services = DEFAULT_DB.services;
        if (!this.data.styles) this.data.styles = DEFAULT_DB.styles;
        if (!this.data.bookings) this.data.bookings = DEFAULT_DB.bookings;
        if (!this.data.schedules) this.data.schedules = DEFAULT_DB.schedules;
        if (!this.data.manager) this.data.manager = DEFAULT_DB.manager;
      } catch (err) {
        console.error("Error reading salon_db.json, recovering with defaults:", err);
        this.data = JSON.parse(JSON.stringify(DEFAULT_DB));
        this.persist();
      }
    }
  }
  persist() {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      import_fs.default.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), "utf-8");
      import_fs.default.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error("Failed to write database file:", err);
    }
  }
  // Business info
  getBusinessInfo() {
    return this.data.business;
  }
  updateBusinessInfo(info) {
    this.data.business = {
      ...this.data.business,
      ...info
    };
    this.persist();
    return this.data.business;
  }
  // Barbers
  getBarbers(includeInactive = false) {
    return includeInactive ? this.data.barbers : this.data.barbers.filter((b) => b.active);
  }
  getBarberById(id) {
    return this.data.barbers.find((b) => b.id === id);
  }
  addBarber(barberData) {
    const id = `barber-${Date.now()}`;
    const newBarber = {
      id,
      ...barberData,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.barbers.push(newBarber);
    for (let day = 0; day <= 6; day++) {
      this.data.schedules.push({
        id: `sched-${id}-${day}`,
        barber_id: id,
        day_of_week: day,
        start_time: "09:30",
        end_time: "20:30",
        active: true
      });
    }
    this.persist();
    return newBarber;
  }
  updateBarber(id, updates) {
    const idx = this.data.barbers.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    this.data.barbers[idx] = { ...this.data.barbers[idx], ...updates };
    this.persist();
    return this.data.barbers[idx];
  }
  deleteBarber(id) {
    const prevLen = this.data.barbers.length;
    this.data.barbers = this.data.barbers.filter((b) => b.id !== id);
    this.data.schedules = this.data.schedules.filter((s) => s.barber_id !== id);
    this.persist();
    return this.data.barbers.length < prevLen;
  }
  // Services
  getServices(includeInactive = false) {
    return includeInactive ? this.data.services : this.data.services.filter((s) => s.active);
  }
  getServiceById(id) {
    return this.data.services.find((s) => s.id === id);
  }
  addService(serviceData) {
    const newService = {
      id: `srv-${Date.now()}`,
      ...serviceData,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.services.push(newService);
    this.persist();
    return newService;
  }
  updateService(id, updates) {
    const idx = this.data.services.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.services[idx] = { ...this.data.services[idx], ...updates };
    this.persist();
    return this.data.services[idx];
  }
  deleteService(id) {
    const prevLen = this.data.services.length;
    this.data.services = this.data.services.filter((s) => s.id !== id);
    this.persist();
    return this.data.services.length < prevLen;
  }
  // Haircut styles
  getStyles() {
    return this.data.styles;
  }
  addStyle(name, image_url) {
    const newStyle = {
      id: `style-${Date.now()}`,
      name,
      image_url,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.styles.push(newStyle);
    this.persist();
    return newStyle;
  }
  updateStyle(id, updates) {
    const idx = this.data.styles.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.styles[idx] = { ...this.data.styles[idx], ...updates };
    this.persist();
    return this.data.styles[idx];
  }
  deleteStyle(id) {
    const prevLen = this.data.styles.length;
    this.data.styles = this.data.styles.filter((s) => s.id !== id);
    this.persist();
    return this.data.styles.length < prevLen;
  }
  // Barber Schedules
  getSchedules(barber_id) {
    if (barber_id) {
      return this.data.schedules.filter((s) => s.barber_id === barber_id);
    }
    return this.data.schedules;
  }
  updateSchedule(id, updates) {
    const idx = this.data.schedules.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.schedules[idx] = { ...this.data.schedules[idx], ...updates };
    this.persist();
    return this.data.schedules[idx];
  }
  // Bookings & Queue
  getBookings(date) {
    let list = this.data.bookings;
    if (date) {
      list = list.filter((b) => b.appointment_date === date);
    }
    return list.map((b) => this.hydrateBooking(b));
  }
  getBookingByReference(reference_no) {
    const rawRef = reference_no.trim().toUpperCase();
    const withoutPrefix = rawRef.startsWith("KS-") ? rawRef.substring(3) : rawRef;
    const withPrefix = rawRef.startsWith("KS-") ? rawRef : `KS-${rawRef}`;
    const found = this.data.bookings.find((b) => {
      const bRef = b.reference_no.trim().toUpperCase();
      return bRef === rawRef || bRef === withPrefix || bRef.endsWith(withoutPrefix);
    });
    return found ? this.hydrateBooking(found) : null;
  }
  hydrateBooking(b) {
    const barber = this.data.barbers.find((bar) => bar.id === b.barber_id);
    const service = this.data.services.find((srv) => srv.id === b.service_id);
    return {
      ...b,
      barber_name: barber ? barber.name : "Assigned Barber",
      service_name: service ? service.name : "Salon Service",
      service_duration: service ? service.duration_min : 30,
      service_price: service ? service.price_inr : 0
    };
  }
  createBooking(params) {
    const { customer_name, phone, barber_id, service_id, appointment_date, appointment_time } = params;
    const barber = this.data.barbers.find((b) => b.id === barber_id && b.active);
    if (!barber) {
      return { success: false, error: "Selected barber is unavailable or not found" };
    }
    const service = this.data.services.find((s) => s.id === service_id && s.active);
    if (!service) {
      return { success: false, error: "Selected service is not active or found" };
    }
    const existingConflict = this.data.bookings.find(
      (b) => b.barber_id === barber_id && b.appointment_date === appointment_date && b.appointment_time === appointment_time && b.status !== "Cancelled"
    );
    if (existingConflict) {
      return {
        success: false,
        error: `Time slot ${appointment_time} is already booked for ${barber.name}. Please select another time.`
      };
    }
    const dateFormatted = appointment_date.replace(/-/g, "");
    const randomCode = Math.floor(1e3 + Math.random() * 9e3);
    const reference_no = `KS-${dateFormatted}-${randomCode}`;
    const activeSameDay = this.data.bookings.filter(
      (b) => b.appointment_date === appointment_date && ["Waiting", "Called", "Hold"].includes(b.status)
    );
    const queue_position = activeSameDay.length + 1;
    const newBooking = {
      id: `book-${Date.now()}`,
      reference_no,
      customer_name: customer_name.trim(),
      phone: phone.trim(),
      barber_id,
      service_id,
      appointment_date,
      appointment_time,
      status: "Waiting",
      queue_position,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.bookings.push(newBooking);
    this.recalculateQueuePositions(appointment_date);
    this.persist();
    return { success: true, booking: this.hydrateBooking(newBooking) };
  }
  updateBookingStatus(id, status) {
    const booking = this.data.bookings.find((b) => b.id === id);
    if (!booking) return null;
    booking.status = status;
    this.recalculateQueuePositions(booking.appointment_date);
    this.persist();
    return this.hydrateBooking(booking);
  }
  deleteBooking(id) {
    const booking = this.data.bookings.find((b) => b.id === id);
    if (!booking) return false;
    const date = booking.appointment_date;
    this.data.bookings = this.data.bookings.filter((b) => b.id !== id);
    this.recalculateQueuePositions(date);
    this.persist();
    return true;
  }
  recalculateQueuePositions(date) {
    const activeList = this.data.bookings.filter((b) => b.appointment_date === date && ["Called", "Waiting", "Hold"].includes(b.status)).sort((a, b) => {
      if (a.appointment_time !== b.appointment_time) {
        return a.appointment_time.localeCompare(b.appointment_time);
      }
      return a.created_at.localeCompare(b.created_at);
    });
    activeList.forEach((b, index) => {
      b.queue_position = index + 1;
    });
  }
  // Live queue calculations
  findBookingsByPhone(phoneQuery) {
    const cleanQuery = phoneQuery.replace(/[^0-9]/g, "");
    if (cleanQuery.length < 5) return [];
    const results = this.data.bookings.filter((b) => {
      const bDigits = (b.phone || "").replace(/[^0-9]/g, "");
      if (!bDigits) return false;
      if (bDigits.includes(cleanQuery) || cleanQuery.includes(bDigits)) return true;
      const last10Query = cleanQuery.length >= 10 ? cleanQuery.slice(-10) : cleanQuery;
      const last10B = bDigits.length >= 10 ? bDigits.slice(-10) : bDigits;
      return last10Query === last10B || bDigits.endsWith(cleanQuery) || cleanQuery.endsWith(bDigits);
    });
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    return results.sort((a, b) => {
      const aIsActiveToday = a.appointment_date === today && ["Called", "Waiting", "Hold"].includes(a.status);
      const bIsActiveToday = b.appointment_date === today && ["Called", "Waiting", "Hold"].includes(b.status);
      if (aIsActiveToday && !bIsActiveToday) return -1;
      if (!aIsActiveToday && bIsActiveToday) return 1;
      const aIsActive = ["Called", "Waiting", "Hold"].includes(a.status);
      const bIsActive = ["Called", "Waiting", "Hold"].includes(b.status);
      if (aIsActive && !bIsActive) return -1;
      if (!aIsActive && bIsActive) return 1;
      if (a.appointment_date !== b.appointment_date) {
        return b.appointment_date.localeCompare(a.appointment_date);
      }
      return b.created_at.localeCompare(a.created_at);
    }).map((b) => this.hydrateBooking(b));
  }
  getQueueStatusForBooking(booking) {
    let customers_ahead = 0;
    let estimated_wait_min = 0;
    if (booking.status === "Waiting" || booking.status === "Hold") {
      const aheadList = this.data.bookings.filter(
        (b) => b.appointment_date === booking.appointment_date && b.barber_id === booking.barber_id && b.id !== booking.id && ["Called", "Waiting"].includes(b.status) && b.queue_position < booking.queue_position
      );
      customers_ahead = aheadList.length;
      estimated_wait_min = customers_ahead * 30;
      if (aheadList.some((b) => b.status === "Called")) {
        estimated_wait_min = Math.max(10, estimated_wait_min - 15);
      }
    }
    const hydrated = this.hydrateBooking(booking);
    return {
      booking: hydrated,
      customers_ahead,
      barber_name: hydrated.barber_name || "Selected Barber",
      service_name: hydrated.service_name || "Grooming Service",
      estimated_wait_min
    };
  }
  getQueueStatusForReference(reference_no) {
    const booking = this.getBookingByReference(reference_no);
    if (!booking) return null;
    return this.getQueueStatusForBooking(booking);
  }
  getQueueStatusForIdentifier(identifier) {
    const trimmed = identifier.trim();
    const byRef = this.getBookingByReference(trimmed);
    if (byRef) {
      return this.getQueueStatusForBooking(byRef);
    }
    const byPhone = this.findBookingsByPhone(trimmed);
    if (byPhone.length > 0) {
      const primary = byPhone[0];
      const status = this.getQueueStatusForBooking(primary);
      return {
        ...status,
        multiple_bookings: byPhone.length > 1 ? byPhone : void 0
      };
    }
    return null;
  }
  // Availability calculation
  getAvailability(date, barber_id, service_id) {
    const dayOfWeek = (/* @__PURE__ */ new Date(`${date}T00:00:00Z`)).getUTCDay();
    const schedule = this.data.schedules.find(
      (s) => s.barber_id === barber_id && s.day_of_week === dayOfWeek && s.active
    );
    if (!schedule) {
      return [];
    }
    const [startH, startM] = schedule.start_time.split(":").map(Number);
    const [endH, endM] = schedule.end_time.split(":").map(Number);
    const startTotalMin = startH * 60 + startM;
    const endTotalMin = endH * 60 + endM;
    const bookedTimes = new Set(
      this.data.bookings.filter((b) => b.barber_id === barber_id && b.appointment_date === date && b.status !== "Cancelled").map((b) => b.appointment_time)
    );
    const slots = [];
    const intervalMin = 30;
    for (let m = startTotalMin; m < endTotalMin; m += intervalMin) {
      const slotH = Math.floor(m / 60);
      const slotM = m % 60;
      const timeStr = `${String(slotH).padStart(2, "0")}:${String(slotM).padStart(2, "0")}`;
      if (dayOfWeek === 5 && m >= 12 * 60 + 30 && m < 14 * 60 + 30) {
        slots.push({
          time: timeStr,
          available: false,
          reason: "Jummah Prayers Break"
        });
        continue;
      }
      if (bookedTimes.has(timeStr)) {
        slots.push({
          time: timeStr,
          available: false,
          reason: "Already Reserved"
        });
      } else {
        slots.push({
          time: timeStr,
          available: true
        });
      }
    }
    return slots;
  }
  // Manager Authentication
  verifyManagerLogin(password) {
    const hash = hashPassword(password);
    if (hash === this.data.manager.passwordHash) {
      const token = import_crypto.default.randomBytes(32).toString("hex");
      if (!this.data.manager.tokens) {
        this.data.manager.tokens = {};
      }
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1e3;
      this.data.manager.tokens[token] = expiresAt;
      this.data.manager.token = token;
      this.data.manager.tokenExpires = expiresAt;
      this.persist();
      return { success: true, token };
    }
    return { success: false };
  }
  verifyManagerToken(token) {
    if (!token) return false;
    const cleanToken = token.trim();
    if (this.data.manager.tokens && this.data.manager.tokens[cleanToken]) {
      if (this.data.manager.tokens[cleanToken] > Date.now()) {
        return true;
      }
    }
    if (this.data.manager.token === cleanToken && this.data.manager.tokenExpires && this.data.manager.tokenExpires > Date.now()) {
      return true;
    }
    return false;
  }
  revokeManagerToken(token) {
    if (!token) return;
    const cleanToken = token.trim();
    if (this.data.manager.tokens && this.data.manager.tokens[cleanToken]) {
      delete this.data.manager.tokens[cleanToken];
    }
    if (this.data.manager.token === cleanToken) {
      this.data.manager.token = void 0;
      this.data.manager.tokenExpires = void 0;
    }
    this.persist();
  }
  changeManagerPassword(currentPassword, newPassword) {
    const currentHash = hashPassword(currentPassword);
    if (currentHash !== this.data.manager.passwordHash) {
      return { success: false, error: "Current password is incorrect." };
    }
    if (!newPassword || newPassword.trim().length < 6) {
      return { success: false, error: "New password must be at least 6 characters long." };
    }
    this.data.manager.passwordHash = hashPassword(newPassword.trim());
    this.persist();
    return { success: true };
  }
};
var db = new SalonDatabase();

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "25mb" }));
app.use(import_express.default.urlencoded({ extended: true, limit: "25mb" }));
var UPLOADS_DIR = import_path2.default.join(process.cwd(), "uploads");
if (!import_fs2.default.existsSync(UPLOADS_DIR)) {
  import_fs2.default.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use("/uploads", import_express.default.static(UPLOADS_DIR));
function requireManagerAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Manager authentication required" });
  }
  const token = authHeader.split(" ")[1];
  if (!db.verifyManagerToken(token)) {
    return res.status(401).json({ error: "Session expired or invalid token" });
  }
  next();
}
app.get("/api/salon", (req, res) => {
  try {
    const business = db.getBusinessInfo();
    const barbers = db.getBarbers(false);
    const services = db.getServices(false);
    const styles = db.getStyles();
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const todayBookings = db.getBookings(today);
    const barberQueues = {};
    for (const barber of barbers) {
      const bList = todayBookings.filter((b) => b.barber_id === barber.id);
      const waiting = bList.filter((b) => b.status === "Waiting");
      const called = bList.find((b) => b.status === "Called");
      barberQueues[barber.id] = {
        waitingCount: waiting.length,
        currentServing: called ? called.customer_name : void 0
      };
    }
    res.json({
      business,
      barbers,
      services,
      styles,
      barberQueues
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch salon data" });
  }
});
app.get("/api/availability", (req, res) => {
  try {
    const { date, barber_id, service_id } = req.query;
    if (!date || !barber_id) {
      return res.status(400).json({ error: "date and barber_id query parameters are required" });
    }
    const slots = db.getAvailability(String(date), String(barber_id), service_id ? String(service_id) : void 0);
    res.json({ slots });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to compute availability" });
  }
});
app.post("/api/bookings", (req, res) => {
  try {
    const { customer_name, phone, barber_id, service_id, appointment_date, appointment_time } = req.body;
    if (!customer_name || !phone || !barber_id || !service_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: "All fields are required to book an appointment" });
    }
    const cleanPhone = String(phone).replace(/\s+/g, "");
    if (cleanPhone.length < 8) {
      return res.status(400).json({ error: "Please provide a valid phone or mobile number" });
    }
    const result = db.createBooking({
      customer_name: String(customer_name).trim(),
      phone: String(phone).trim(),
      barber_id: String(barber_id),
      service_id: String(service_id),
      appointment_date: String(appointment_date),
      appointment_time: String(appointment_time)
    });
    if (!result.success) {
      return res.status(409).json({ error: result.error });
    }
    res.status(201).json({
      success: true,
      booking: result.booking
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Booking creation failed" });
  }
});
app.get("/api/queue/:identifier", (req, res) => {
  try {
    const { identifier } = req.params;
    const status = db.getQueueStatusForIdentifier(identifier);
    if (!status) {
      return res.status(404).json({
        error: "Booking not found for this reference code or mobile number. Please check your reference or phone number."
      });
    }
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch queue status" });
  }
});
app.get("/api/queue-live", (req, res) => {
  try {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const bookings = db.getBookings(today);
    const active = bookings.filter((b) => ["Called", "Waiting", "Hold"].includes(b.status)).map((b) => ({
      reference_no: b.reference_no,
      customer_masked: b.customer_name.length > 2 ? `${b.customer_name.slice(0, 2)}***${b.customer_name.slice(-1)}` : `${b.customer_name}*`,
      barber_name: b.barber_name,
      service_name: b.service_name,
      appointment_time: b.appointment_time,
      status: b.status,
      queue_position: b.queue_position
    }));
    res.json({
      date: today,
      activeQueue: active,
      totalWaiting: active.filter((b) => b.status === "Waiting").length,
      currentlyServing: active.filter((b) => b.status === "Called").length
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch live queue" });
  }
});
app.post("/api/upload", (req, res) => {
  try {
    const { fileData, fileName } = req.body;
    if (!fileData) {
      return res.status(400).json({ error: "fileData (base64 string) is required" });
    }
    const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer;
    let ext = "jpg";
    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      if (mimeType.includes("png")) ext = "png";
      else if (mimeType.includes("webp")) ext = "webp";
      else if (mimeType.includes("gif")) ext = "gif";
      else if (mimeType.includes("svg")) ext = "svg";
      buffer = Buffer.from(matches[2], "base64");
    } else {
      buffer = Buffer.from(fileData, "base64");
    }
    const safeName = (fileName || "image").replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 30);
    const uniqueFileName = `${Date.now()}_${safeName}.${ext}`;
    const filePath = import_path2.default.join(UPLOADS_DIR, uniqueFileName);
    import_fs2.default.writeFileSync(filePath, buffer);
    const publicUrl = `/uploads/${uniqueFileName}`;
    res.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Image upload failed" });
  }
});
app.post("/api/manager/login", (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }
    const result = db.verifyManagerLogin(password);
    if (!result.success || !result.token) {
      return res.status(401).json({ error: "Invalid manager password" });
    }
    res.json({
      success: true,
      token: result.token,
      manager: { username: "manager", role: "Salon Manager" }
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Login error" });
  }
});
app.get("/api/manager/me", requireManagerAuth, (req, res) => {
  res.json({ authenticated: true, role: "Salon Manager" });
});
app.post("/api/manager/logout", (req, res) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) {
    db.revokeManagerToken(auth.substring(7));
  }
  res.json({ success: true });
});
app.post("/api/manager/change-password", requireManagerAuth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password are required" });
    }
    const result = db.changeManagerPassword(currentPassword, newPassword);
    if (!result.success) {
      return res.status(400).json({ error: result.error || "Failed to change password" });
    }
    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Error changing password" });
  }
});
app.get("/api/manager/bookings", requireManagerAuth, (req, res) => {
  try {
    const { date } = req.query;
    const bookings = db.getBookings(date ? String(date) : void 0);
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.patch("/api/manager/bookings/:id/status", requireManagerAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !["Waiting", "Called", "Hold", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    const updated = db.updateBookingStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ success: true, booking: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/api/manager/bookings/:id", requireManagerAuth, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteBooking(id);
    if (!deleted) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.all(["/api/manager/business"], requireManagerAuth, (req, res, next) => {
  if (req.method === "PATCH" || req.method === "PUT") {
    try {
      const updated = db.updateBusinessInfo(req.body);
      return res.json({ success: true, business: updated });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  next();
});
app.get("/api/manager/barbers", requireManagerAuth, (req, res) => {
  res.json({ barbers: db.getBarbers(true) });
});
app.post("/api/manager/barbers", requireManagerAuth, (req, res) => {
  try {
    const { name, specialty, bio, image_url, active } = req.body;
    if (!name || !specialty) {
      return res.status(400).json({ error: "Name and specialty are required" });
    }
    const newBarber = db.addBarber({
      name,
      specialty,
      bio: bio || "",
      image_url: image_url || "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&q=80",
      active: active !== false
    });
    res.status(201).json({ success: true, barber: newBarber });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.patch("/api/manager/barbers/:id", requireManagerAuth, (req, res) => {
  try {
    const updated = db.updateBarber(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Barber not found" });
    res.json({ success: true, barber: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/api/manager/barbers/:id", requireManagerAuth, (req, res) => {
  try {
    const success = db.deleteBarber(req.params.id);
    if (!success) return res.status(404).json({ error: "Barber not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/manager/services", requireManagerAuth, (req, res) => {
  res.json({ services: db.getServices(true) });
});
app.post("/api/manager/services", requireManagerAuth, (req, res) => {
  try {
    const { name, description, price_inr, duration_min, image_url, active } = req.body;
    if (!name || !price_inr || !duration_min) {
      return res.status(400).json({ error: "Name, price and duration are required" });
    }
    const newService = db.addService({
      name,
      description: description || "",
      price_inr: Number(price_inr),
      duration_min: Number(duration_min),
      image_url: image_url || "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80",
      active: active !== false
    });
    res.status(201).json({ success: true, service: newService });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.patch("/api/manager/services/:id", requireManagerAuth, (req, res) => {
  try {
    const updated = db.updateService(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Service not found" });
    res.json({ success: true, service: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/api/manager/services/:id", requireManagerAuth, (req, res) => {
  try {
    const success = db.deleteService(req.params.id);
    if (!success) return res.status(404).json({ error: "Service not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/manager/styles", requireManagerAuth, (req, res) => {
  res.json({ styles: db.getStyles() });
});
app.post("/api/manager/styles", requireManagerAuth, (req, res) => {
  try {
    const { name, image_url } = req.body;
    if (!name || !image_url) {
      return res.status(400).json({ error: "Style name and image are required" });
    }
    const newStyle = db.addStyle(name, image_url);
    res.status(201).json({ success: true, style: newStyle });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.patch("/api/manager/styles/:id", requireManagerAuth, (req, res) => {
  try {
    const updated = db.updateStyle(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Style not found" });
    res.json({ success: true, style: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/api/manager/styles/:id", requireManagerAuth, (req, res) => {
  try {
    const success = db.deleteStyle(req.params.id);
    if (!success) return res.status(404).json({ error: "Style not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/manager/schedules", requireManagerAuth, (req, res) => {
  try {
    const { barber_id } = req.query;
    res.json({ schedules: db.getSchedules(barber_id ? String(barber_id) : void 0) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.patch("/api/manager/schedules/:id", requireManagerAuth, (req, res) => {
  try {
    const updated = db.updateSchedule(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Schedule not found" });
    res.json({ success: true, schedule: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Kashmir Salon Server running on port ${PORT}`);
  });
}
start();
//# sourceMappingURL=server.cjs.map
