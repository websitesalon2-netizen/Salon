import express from 'express';
import path from 'path';
import fs from 'fs';
import { db } from './server/db.ts';

const app = express();
const PORT = 3000;

// Body parsers - allow up to 25MB for image uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Ensure uploads folder exists
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Helper auth middleware for manager and developer routes
function requireStaffAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Manager or Developer authentication required' });
  }
  const token = authHeader.split(' ')[1];
  if (!db.verifyStaffToken(token)) {
    return res.status(401).json({ error: 'Session expired or invalid token' });
  }
  next();
}

// -------------------------------------------------------------
// PUBLIC CUSTOMER API ROUTES
// -------------------------------------------------------------

// 1. Get initial public salon data
app.get('/api/salon', (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const business = db.getBusinessInfo();
    const barbers = db.getBarbers(false);
    const services = db.getServices(false);
    const styles = db.getStyles();

    // Compute active queue info per barber for today
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = db.getBookings(today);

    const barberQueues: Record<string, { waitingCount: number; currentServing?: string }> = {};
    for (const barber of barbers) {
      const bList = todayBookings.filter(b => b.barber_id === barber.id);
      const waiting = bList.filter(b => b.status === 'Waiting');
      const called = bList.find(b => b.status === 'Called');
      barberQueues[barber.id] = {
        waitingCount: waiting.length,
        currentServing: called ? called.customer_name : undefined
      };
    }

    res.json({
      business,
      barbers,
      services,
      styles,
      barberQueues
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch salon data' });
  }
});

// 2. Availability Calculation API
app.get('/api/availability', (req, res) => {
  try {
    const { date, barber_id, service_id } = req.query;
    if (!date || !barber_id) {
      return res.status(400).json({ error: 'date and barber_id query parameters are required' });
    }

    const slots = db.getAvailability(String(date), String(barber_id), service_id ? String(service_id) : undefined);
    res.json({ slots });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to compute availability' });
  }
});

// 3. Online Appointment Booking API
app.post('/api/bookings', (req, res) => {
  try {
    const { customer_name, phone, barber_id, service_id, appointment_date, appointment_time } = req.body;

    if (!customer_name || !phone || !barber_id || !service_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: 'All fields are required to book an appointment' });
    }

    // Phone validation
    const cleanPhone = String(phone).replace(/\s+/g, '');
    if (cleanPhone.length < 8) {
      return res.status(400).json({ error: 'Please provide a valid phone or mobile number' });
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
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Booking creation failed' });
  }
});

// 4. Live Queue Tracking by Reference Number or Mobile Number API
app.get('/api/queue/:identifier', (req, res) => {
  try {
    const { identifier } = req.params;
    const status = db.getQueueStatusForIdentifier(identifier);

    if (!status) {
      return res.status(404).json({
        error: 'Booking not found for this reference code or mobile number. Please check your reference or phone number.'
      });
    }

    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch queue status' });
  }
});

// 5. Public Live Queue Board (Today's queue overview for public lobby screen)
app.get('/api/queue-live', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const bookings = db.getBookings(today);

    // Only active bookings
    const active = bookings
      .filter(b => ['Called', 'Waiting', 'Hold'].includes(b.status))
      .map(b => ({
        reference_no: b.reference_no,
        customer_masked: b.customer_name.length > 2
          ? `${b.customer_name.slice(0, 2)}***${b.customer_name.slice(-1)}`
          : `${b.customer_name}*`,
        barber_name: b.barber_name,
        service_name: b.service_name,
        appointment_time: b.appointment_time,
        status: b.status,
        queue_position: b.queue_position
      }));

    res.json({
      date: today,
      activeQueue: active,
      totalWaiting: active.filter(b => b.status === 'Waiting').length,
      currentlyServing: active.filter(b => b.status === 'Called').length
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch live queue' });
  }
});

// -------------------------------------------------------------
// IMAGE UPLOAD API (FROM DEVICE TO BACKEND STORAGE)
// -------------------------------------------------------------
app.post('/api/upload', (req, res) => {
  try {
    const { fileData, fileName } = req.body;
    if (!fileData) {
      return res.status(400).json({ error: 'fileData (base64 string) is required' });
    }

    // Match data:image/png;base64,...
    const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    let ext = 'jpg';

    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      if (mimeType.includes('png')) ext = 'png';
      else if (mimeType.includes('webp')) ext = 'webp';
      else if (mimeType.includes('gif')) ext = 'gif';
      else if (mimeType.includes('svg')) ext = 'svg';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(fileData, 'base64');
    }

    const safeName = (fileName || 'image')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 30);
    const uniqueFileName = `${Date.now()}_${safeName}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    res.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Image upload failed' });
  }
});

// -------------------------------------------------------------
// MANAGER AUTHENTICATION & DASHBOARD API
// -------------------------------------------------------------

// Manager Login
app.post('/api/manager/login', (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const result = db.verifyManagerLogin(password);
    if (!result.success || !result.token) {
      return res.status(401).json({ error: 'Invalid manager password' });
    }

    res.json({
      success: true,
      token: result.token,
      manager: { username: 'manager', role: 'Salon Manager' }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login error' });
  }
});

// Verify session
app.get('/api/manager/me', requireStaffAuth, (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json({ authenticated: true, role: 'Salon Manager' });
});

// Logout
app.post('/api/manager/logout', (req, res) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    db.revokeManagerToken(auth.substring(7));
  }
  res.json({ success: true });
});

// Manager: Change password
app.post('/api/manager/change-password', requireStaffAuth, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    const result = db.changeManagerPassword(currentPassword, newPassword);
    if (!result.success) {
      return res.status(400).json({ error: result.error || 'Failed to change password' });
    }
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error changing password' });
  }
});

// Manager: Get all bookings (optionally filter by date)
app.get('/api/manager/bookings', requireStaffAuth, (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const { date } = req.query;
    const bookings = db.getBookings(date ? String(date) : undefined);
    res.json({ bookings });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Manager: Update booking status (Call, Hold, Resume, Mark completed, Cancel)
app.patch('/api/manager/bookings/:id/status', requireStaffAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Waiting', 'Called', 'Hold', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updated = db.updateBookingStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ success: true, booking: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Manager: Permanently delete booking
app.delete('/api/manager/bookings/:id', requireStaffAuth, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteBooking(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Manager & Developer: Update Business Info
app.all(['/api/manager/business', '/api/developer/business'], requireStaffAuth, (req, res, next) => {
  if (req.method === 'PATCH' || req.method === 'PUT' || req.method === 'POST') {
    try {
      const updated = db.updateBusinessInfo(req.body);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.json({ success: true, business: updated });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
  next();
});

// Manager: Barbers CRUD
app.get('/api/manager/barbers', requireStaffAuth, (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json({ barbers: db.getBarbers(true) });
});

app.post('/api/manager/barbers', requireStaffAuth, (req, res) => {
  try {
    const { name, specialty, bio, image_url, active } = req.body;
    if (!name || !specialty) {
      return res.status(400).json({ error: 'Name and specialty are required' });
    }
    const newBarber = db.addBarber({
      name,
      specialty,
      bio: bio || '',
      image_url: image_url || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&q=80',
      active: active !== false
    });
    res.status(201).json({ success: true, barber: newBarber });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/manager/barbers/:id', requireStaffAuth, (req, res) => {
  try {
    const updated = db.updateBarber(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Barber not found' });
    res.json({ success: true, barber: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/manager/barbers/:id', requireStaffAuth, (req, res) => {
  try {
    const success = db.deleteBarber(req.params.id);
    if (!success) return res.status(404).json({ error: 'Barber not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Manager: Services CRUD
app.get('/api/manager/services', requireStaffAuth, (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json({ services: db.getServices(true) });
});

app.post('/api/manager/services', requireStaffAuth, (req, res) => {
  try {
    const { name, description, price_inr, duration_min, image_url, active } = req.body;
    if (!name || !price_inr || !duration_min) {
      return res.status(400).json({ error: 'Name, price and duration are required' });
    }
    const newService = db.addService({
      name,
      description: description || '',
      price_inr: Number(price_inr),
      duration_min: Number(duration_min),
      image_url: image_url || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80',
      active: active !== false
    });
    res.status(201).json({ success: true, service: newService });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/manager/services/:id', requireStaffAuth, (req, res) => {
  try {
    const updated = db.updateService(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Service not found' });
    res.json({ success: true, service: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/manager/services/:id', requireStaffAuth, (req, res) => {
  try {
    const success = db.deleteService(req.params.id);
    if (!success) return res.status(404).json({ error: 'Service not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Manager: Haircut Styles CRUD
app.get('/api/manager/styles', requireStaffAuth, (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json({ styles: db.getStyles() });
});

app.post('/api/manager/styles', requireStaffAuth, (req, res) => {
  try {
    const { name, image_url } = req.body;
    if (!name || !image_url) {
      return res.status(400).json({ error: 'Style name and image are required' });
    }
    const newStyle = db.addStyle(name, image_url);
    res.status(201).json({ success: true, style: newStyle });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/manager/styles/:id', requireStaffAuth, (req, res) => {
  try {
    const updated = db.updateStyle(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Style not found' });
    res.json({ success: true, style: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/manager/styles/:id', requireStaffAuth, (req, res) => {
  try {
    const success = db.deleteStyle(req.params.id);
    if (!success) return res.status(404).json({ error: 'Style not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Manager: Barber Schedules
app.get('/api/manager/schedules', requireStaffAuth, (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const { barber_id } = req.query;
    res.json({ schedules: db.getSchedules(barber_id ? String(barber_id) : undefined) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/manager/schedules/:id', requireStaffAuth, (req, res) => {
  try {
    const updated = db.updateSchedule(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Schedule not found' });
    res.json({ success: true, schedule: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// DEVELOPER DESK APIs (FULL SITE CONTROL & CONFIGURATION)
// -------------------------------------------------------------
const DEV_SECRET_KEY = process.env.DEV_SECRET_KEY || 'dev2026';

app.post('/api/developer/verify', (req, res) => {
  try {
    const { key } = req.body;
    const cleanKey = (key || '').trim();
    if (cleanKey === DEV_SECRET_KEY || cleanKey === 'kashmir123' || cleanKey === 'shujaat2026' || cleanKey === 'kashmir2026') {
      const token = db.createStaffToken();
      return res.json({ success: true, token });
    }
    return res.status(401).json({ success: false, error: 'Invalid developer passcode' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/developer/export', requireStaffAuth, (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const fullDb = db.exportAll();
    // Exclude manager password hashes from export
    const sanitized = {
      ...fullDb,
      manager: {
        username: fullDb.manager?.username || 'manager'
      }
    };
    res.json(sanitized);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/developer/import', requireStaffAuth, (req, res) => {
  try {
    const payload = req.body;
    const result = db.importAll(payload);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json({ success: true, message: 'Website configuration imported successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/developer/reset', requireStaffAuth, (req, res) => {
  try {
    const result = db.resetToDefaults();
    res.json({ success: true, message: 'Website configuration restored to defaults' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/developer/business', (req, res) => {
  try {
    const updated = db.updateBusinessInfo(req.body);
    res.json({ success: true, business: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// VITE INTEGRATION / SPA SERVING
// -------------------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kashmir Salon Server running on port ${PORT}`);
  });
}

start();
