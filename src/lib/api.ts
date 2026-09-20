import type {
  SalonDataResponse,
  TimeSlot,
  Booking,
  QueueCheckResponse,
  BusinessInfo,
  Barber,
  Service,
  HaircutStyle,
  BarberSchedule
} from '../types';
import { clientStore } from './clientStore';

const TOKEN_KEY = 'kashmir_salon_manager_token';

export function getManagerToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setManagerToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeManagerToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  const token = getManagerToken() || getDeveloperToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// -------------------------------------------------------------
// Public Customer APIs (with automatic static/GitHub Pages fallback)
// -------------------------------------------------------------

export async function fetchSalonData(): Promise<SalonDataResponse> {
  try {
    const res = await fetch(`/api/salon?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.business) {
        try { clientStore.importAll(json); } catch {}
        return json;
      }
    }
  } catch {
    // Backend unavailable or static hosting (e.g. GitHub Pages)
  }
  return clientStore.getSalonData();
}

export async function fetchAvailability(date: string, barberId: string, serviceId?: string): Promise<{ slots: TimeSlot[] }> {
  try {
    const params = new URLSearchParams({ date, barber_id: barberId });
    if (serviceId) params.append('service_id', serviceId);
    const res = await fetch(`/api/availability?${params.toString()}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend unavailable or static hosting
  }
  return clientStore.getAvailability(date, barberId, serviceId);
}

export async function createBooking(data: {
  customer_name: string;
  phone: string;
  barber_id: string;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
}): Promise<{ success: boolean; booking: Booking }> {
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      return await res.json();
    }
    // If backend replied with 400 validation error, parse message
    if (res.status === 400 || res.status === 409) {
      const json = await res.json().catch(() => ({}));
      if (json.error) throw new Error(json.error);
    }
  } catch (err: any) {
    if (err.message && err.message !== 'Failed to fetch' && !err.message.includes('NetworkError')) {
      // Re-throw genuine validation messages
      if (err.message.includes('required') || err.message.includes('valid phone')) {
        throw err;
      }
    }
  }
  return clientStore.createBooking(data);
}

export async function checkQueueStatus(identifier: string): Promise<QueueCheckResponse> {
  try {
    const res = await fetch(`/api/queue/${encodeURIComponent(identifier.trim())}`);
    if (res.ok) {
      return await res.json();
    }
    if (res.status === 404) {
      const json = await res.json().catch(() => ({}));
      // Check if backend specifically reported not found
      if (json.error && !json.error.includes('Cannot GET')) {
        // Also check client store in case it was booked on client side
        const localStatus = clientStore.getQueueStatus(identifier);
        if (localStatus) return localStatus;
        throw new Error(json.error);
      }
    }
  } catch (err: any) {
    if (err.message && err.message.includes('Booking not found')) {
      throw err;
    }
  }

  const localStatus = clientStore.getQueueStatus(identifier);
  if (!localStatus) {
    throw new Error('Booking not found for this reference code or mobile number');
  }
  return localStatus;
}

export async function fetchLiveQueueBoard(): Promise<{
  date: string;
  activeQueue: Array<{
    reference_no: string;
    customer_masked: string;
    barber_name?: string;
    service_name?: string;
    appointment_time: string;
    status: string;
    queue_position: number;
  }>;
  totalWaiting: number;
  currentlyServing: number;
}> {
  try {
    const res = await fetch('/api/queue-live');
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }
  return clientStore.getLiveQueueBoard();
}

// -------------------------------------------------------------
// Image Upload (File -> Backend Storage or base64 Data URI)
// -------------------------------------------------------------

export async function uploadImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const fileData = reader.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileData,
              fileName: file.name
            })
          });
          if (res.ok) {
            const json = await res.json();
            if (json.url) {
              resolve(json.url);
              return;
            }
          }
        } catch {
          // Backend unavailable: fall back to fileData (data URI)
        }
        // Resolves with base64 Data URI when static hosting
        resolve(fileData);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file from device'));
    reader.readAsDataURL(file);
  });
}

// -------------------------------------------------------------
// Manager APIs
// -------------------------------------------------------------

export async function loginManager(password: string): Promise<{ success: boolean; token: string }> {
  try {
    const res = await fetch('/api/manager/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (res.ok) {
      const json = await res.json();
      setManagerToken(json.token);
      return json;
    }
    if (res.status === 401) {
      const json = await res.json().catch(() => ({}));
      // Check client store fallback
      if (clientStore.verifyManagerPassword(password)) {
        const clientToken = 'client-manager-token';
        setManagerToken(clientToken);
        return { success: true, token: clientToken };
      }
      throw new Error(json.error || 'Invalid manager password');
    }
  } catch (err: any) {
    if (err.message && err.message.includes('Invalid')) {
      throw err;
    }
  }

  // Client-side validation fallback
  if (clientStore.verifyManagerPassword(password)) {
    const clientToken = 'client-manager-token';
    setManagerToken(clientToken);
    return { success: true, token: clientToken };
  }
  throw new Error('Invalid manager password. Default key is kashmir123');
}

export async function verifyManagerSession(): Promise<boolean> {
  const token = getManagerToken();
  if (!token) return false;
  if (token === 'client-manager-token') return true;
  try {
    const res = await fetch('/api/manager/me', {
      headers: authHeaders()
    });
    return res.ok;
  } catch {
    return !!token;
  }
}

export async function logoutManager() {
  removeManagerToken();
  try {
    await fetch('/api/manager/logout', { method: 'POST' });
  } catch {
    // ignore
  }
}

export async function changeManagerPassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/manager/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    if (res.ok) {
      const json = await res.json();
      // Keep clientStore in sync
      try { clientStore.changeManagerPassword(currentPassword, newPassword); } catch {}
      return json;
    }
    if (res.status === 400 || res.status === 401) {
      const json = await res.json().catch(() => ({}));
      if (json.error) throw new Error(json.error);
    }
  } catch (err: any) {
    if (err.message && (err.message.includes('incorrect') || err.message.includes('least'))) {
      throw err;
    }
  }
  return clientStore.changeManagerPassword(currentPassword, newPassword);
}

export async function fetchManagerBookings(date?: string): Promise<{ bookings: Booking[] }> {
  try {
    const url = date ? `/api/manager/bookings?date=${encodeURIComponent(date)}` : '/api/manager/bookings';
    const res = await fetch(url, { headers: authHeaders() });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }
  return { bookings: clientStore.getManagerBookings(date) };
}

export async function updateBookingStatus(id: string, status: string): Promise<Booking> {
  try {
    const res = await fetch(`/api/manager/bookings/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      const json = await res.json();
      try { clientStore.updateBookingStatus(id, status as any); } catch {}
      return json.booking;
    }
  } catch {
    // fallback
  }
  return clientStore.updateBookingStatus(id, status as any);
}

export async function deleteBookingPermanently(id: string): Promise<void> {
  try {
    const res = await fetch(`/api/manager/bookings/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (res.ok) {
      try { clientStore.deleteBooking(id); } catch {}
      return;
    }
  } catch {
    // fallback
  }
  clientStore.deleteBooking(id);
}

export async function updateBusinessInfo(info: Partial<BusinessInfo>): Promise<BusinessInfo> {
  // 1. Try /api/manager/business
  try {
    const res = await fetch('/api/manager/business', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify(info)
    });
    if (res.ok) {
      const json = await res.json();
      const updated = json.business || info;
      try { clientStore.updateBusiness(updated); } catch {}
      return updated;
    }
  } catch {
    // try fallback route
  }

  // 2. Try /api/developer/business
  try {
    const res2 = await fetch('/api/developer/business', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify(info)
    });
    if (res2.ok) {
      const json2 = await res2.json();
      const updated = json2.business || info;
      try { clientStore.updateBusiness(updated); } catch {}
      return updated;
    }
  } catch {
    // fallback
  }

  return clientStore.updateBusiness(info);
}

// Manager Barbers
export async function fetchManagerBarbers(): Promise<{ barbers: Barber[] }> {
  try {
    const res = await fetch('/api/manager/barbers', { headers: authHeaders() });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }
  return { barbers: clientStore.getBarbers() };
}

export async function createBarber(barber: Partial<Barber>): Promise<Barber> {
  try {
    const res = await fetch('/api/manager/barbers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(barber)
    });
    if (res.ok) {
      const json = await res.json();
      try { clientStore.createBarber(json.barber); } catch {}
      return json.barber;
    }
  } catch {
    // fallback
  }
  return clientStore.createBarber(barber);
}

export async function updateBarber(id: string, updates: Partial<Barber>): Promise<Barber> {
  try {
    const res = await fetch(`/api/manager/barbers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const json = await res.json();
      try { clientStore.updateBarber(id, updates); } catch {}
      return json.barber;
    }
  } catch {
    // fallback
  }
  return clientStore.updateBarber(id, updates);
}

export async function deleteBarber(id: string): Promise<void> {
  try {
    const res = await fetch(`/api/manager/barbers/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (res.ok) {
      try { clientStore.deleteBarber(id); } catch {}
      return;
    }
  } catch {
    // fallback
  }
  clientStore.deleteBarber(id);
}

// Manager Services
export async function fetchManagerServices(): Promise<{ services: Service[] }> {
  try {
    const res = await fetch('/api/manager/services', { headers: authHeaders() });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }
  return { services: clientStore.getServices() };
}

export async function createService(service: Partial<Service>): Promise<Service> {
  try {
    const res = await fetch('/api/manager/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(service)
    });
    if (res.ok) {
      const json = await res.json();
      try { clientStore.createService(json.service); } catch {}
      return json.service;
    }
  } catch {
    // fallback
  }
  return clientStore.createService(service);
}

export async function updateService(id: string, updates: Partial<Service>): Promise<Service> {
  try {
    const res = await fetch(`/api/manager/services/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const json = await res.json();
      try { clientStore.updateService(id, updates); } catch {}
      return json.service;
    }
  } catch {
    // fallback
  }
  return clientStore.updateService(id, updates);
}

export async function deleteService(id: string): Promise<void> {
  try {
    const res = await fetch(`/api/manager/services/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (res.ok) {
      try { clientStore.deleteService(id); } catch {}
      return;
    }
  } catch {
    // fallback
  }
  clientStore.deleteService(id);
}

// Manager Styles
export async function fetchManagerStyles(): Promise<{ styles: HaircutStyle[] }> {
  try {
    const res = await fetch('/api/manager/styles', { headers: authHeaders() });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }
  return { styles: clientStore.getStyles() };
}

export async function createStyle(style: { name: string; image_url: string }): Promise<HaircutStyle> {
  try {
    const res = await fetch('/api/manager/styles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(style)
    });
    if (res.ok) {
      const json = await res.json();
      try { clientStore.createStyle(json.style); } catch {}
      return json.style;
    }
  } catch {
    // fallback
  }
  return clientStore.createStyle(style);
}

export async function updateStyle(id: string, updates: Partial<HaircutStyle>): Promise<HaircutStyle> {
  try {
    const res = await fetch(`/api/manager/styles/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const json = await res.json();
      try { clientStore.updateStyle(id, updates); } catch {}
      return json.style;
    }
  } catch {
    // fallback
  }
  return clientStore.updateStyle(id, updates);
}

export async function deleteStyle(id: string): Promise<void> {
  try {
    const res = await fetch(`/api/manager/styles/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (res.ok) {
      try { clientStore.deleteStyle(id); } catch {}
      return;
    }
  } catch {
    // fallback
  }
  clientStore.deleteStyle(id);
}

// Manager Schedules
export async function fetchManagerSchedules(barberId?: string): Promise<{ schedules: BarberSchedule[] }> {
  try {
    const url = barberId ? `/api/manager/schedules?barber_id=${barberId}` : '/api/manager/schedules';
    const res = await fetch(url, { headers: authHeaders() });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }
  return { schedules: clientStore.getSchedules() };
}

export async function updateSchedule(id: string, updates: Partial<BarberSchedule>): Promise<BarberSchedule> {
  try {
    const res = await fetch(`/api/manager/schedules/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const json = await res.json();
      try { clientStore.updateSchedule(id, updates); } catch {}
      return json.schedule;
    }
  } catch {
    // fallback
  }
  return clientStore.updateSchedule(id, updates);
}

// -------------------------------------------------------------
// DEVELOPER DESK API HELPERS
// -------------------------------------------------------------
const DEV_TOKEN_KEY = 'kashmir_salon_dev_token';

export function getDeveloperToken(): string | null {
  return localStorage.getItem(DEV_TOKEN_KEY);
}

export function setDeveloperToken(token: string) {
  localStorage.setItem(DEV_TOKEN_KEY, token);
}

export function removeDeveloperToken() {
  localStorage.removeItem(DEV_TOKEN_KEY);
}

export function isDeveloperSessionActive(): boolean {
  return !!getDeveloperToken();
}

export const updateBusiness = updateBusinessInfo;

export async function verifyDeveloperPasscode(key: string): Promise<boolean> {
  try {
    const res = await fetch('/api/developer/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key })
    });
    if (res.ok) {
      const json = await res.json();
      setDeveloperToken(json.token || 'dev-authenticated');
      return true;
    }
  } catch {
    // static / offline fallback
  }
  if (key === 'dev2026' || key === 'kashmir123' || key === 'shujaat2026') {
    setDeveloperToken('dev-authenticated-local');
    return true;
  }
  return false;
}

export async function exportDatabaseConfig(): Promise<any> {
  try {
    const res = await fetch(`/api/developer/export?_t=${Date.now()}`, {
      headers: authHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }
  return clientStore.exportAll();
}

export async function importDatabaseConfig(payload: any): Promise<boolean> {
  try {
    const res = await fetch('/api/developer/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      try { clientStore.importAll(payload); } catch {}
      return true;
    }
  } catch {
    // fallback
  }
  return clientStore.importAll(payload);
}

export async function resetDatabaseConfig(): Promise<boolean> {
  try {
    const res = await fetch('/api/developer/reset', {
      method: 'POST',
      headers: authHeaders()
    });
    if (res.ok) {
      try { clientStore.resetToDefaults(); } catch {}
      return true;
    }
  } catch {
    // fallback
  }
  return clientStore.resetToDefaults();
}

export function updateFaviconDOM(faviconUrl?: string) {
  if (typeof document === 'undefined') return;
  let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  if (faviconUrl && faviconUrl.trim()) {
    link.href = faviconUrl.trim();
  }
}

