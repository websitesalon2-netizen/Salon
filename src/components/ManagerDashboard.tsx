import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Scissors,
  Settings,
  Calendar,
  Sparkles,
  Camera,
  LogOut,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  PauseCircle,
  PlayCircle,
  XCircle,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Save,
  Check,
  AlertCircle,
  RefreshCw,
  Bell,
  Upload,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Terminal,
  Code2
} from 'lucide-react';
import type {
  BusinessInfo,
  Barber,
  Service,
  HaircutStyle,
  Booking,
  BookingStatus,
  BarberSchedule
} from '../types';
import {
  fetchManagerBookings,
  updateBookingStatus,
  deleteBookingPermanently,
  updateBusinessInfo,
  fetchManagerBarbers,
  createBarber,
  updateBarber,
  deleteBarber,
  fetchManagerServices,
  createService,
  updateService,
  deleteService,
  fetchManagerStyles,
  createStyle,
  updateStyle,
  deleteStyle,
  fetchManagerSchedules,
  updateSchedule,
  logoutManager,
  changeManagerPassword
} from '../lib/api';
import { ImageUploader } from './ImageUploader';

interface ManagerDashboardProps {
  business: BusinessInfo;
  onBusinessUpdated: (updated: BusinessInfo) => void;
  onClose: () => void;
  onOpenDeveloperDesk?: () => void;
}

type TabType = 'queue' | 'services' | 'barbers' | 'styles' | 'business' | 'security';

interface DeleteTarget {
  type: 'booking' | 'barber' | 'service' | 'style';
  id: string;
  name: string;
  detail?: string;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  business,
  onBusinessUpdated,
  onClose,
  onOpenDeveloperDesk
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('queue');
  const [notification, setNotification] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Custom in-app delete confirmation state (bypasses iframe window.confirm blocks)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Today's date YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Data states
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [styles, setStyles] = useState<HaircutStyle[]>([]);
  const [schedules, setSchedules] = useState<BarberSchedule[]>([]);
  const [loading, setLoading] = useState(false);

  // Business Info Form State
  const [bizForm, setBizForm] = useState<BusinessInfo>(business);
  const [bizSaving, setBizSaving] = useState(false);

  // Modal / Form states
  const [editingBarber, setEditingBarber] = useState<Partial<Barber> | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingStyle, setEditingStyle] = useState<Partial<HaircutStyle> | null>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Load Bookings for chosen date
  const loadBookings = useCallback(async () => {
    try {
      const res = await fetchManagerBookings(selectedDate);
      setBookings(res.bookings || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load bookings');
    }
  }, [selectedDate]);

  // Load All Entities
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [bRes, sRes, barRes, styRes, schedRes] = await Promise.all([
        fetchManagerBookings(selectedDate),
        fetchManagerServices(),
        fetchManagerBarbers(),
        fetchManagerStyles(),
        fetchManagerSchedules()
      ]);
      setBookings(bRes.bookings || []);
      setServices(sRes.services || []);
      setBarbers(barRes.barbers || []);
      setStyles(styRes.styles || []);
      setSchedules(schedRes.schedules || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sync manager dashboard');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Periodic polling for bookings in queue tab
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'queue') {
        loadBookings();
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [activeTab, loadBookings]);

  // Handle Logout
  const handleLogout = async () => {
    await logoutManager();
    onClose();
  };

  // -------------------------------------------------------------
  // Queue Actions
  // -------------------------------------------------------------
  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    try {
      await updateBookingStatus(id, newStatus);
      showToast(`Booking updated to "${newStatus}"`);
      await loadBookings();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update booking status');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setErrorMsg(null);
    try {
      if (deleteTarget.type === 'booking') {
        await deleteBookingPermanently(deleteTarget.id);
        showToast('Booking deleted permanently');
        await loadBookings();
      } else if (deleteTarget.type === 'barber') {
        await deleteBarber(deleteTarget.id);
        showToast(`Barber "${deleteTarget.name}" removed successfully.`);
        const res = await fetchManagerBarbers();
        setBarbers(res.barbers);
      } else if (deleteTarget.type === 'service') {
        await deleteService(deleteTarget.id);
        showToast(`Service "${deleteTarget.name}" deleted successfully.`);
        const res = await fetchManagerServices();
        setServices(res.services);
      } else if (deleteTarget.type === 'style') {
        await deleteStyle(deleteTarget.id);
        showToast(`Style "${deleteTarget.name}" deleted successfully.`);
        const res = await fetchManagerStyles();
        setStyles(res.styles);
      }
      setDeleteTarget(null);
    } catch (err: any) {
      setErrorMsg(err.message || `Failed to delete ${deleteTarget.type}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleCallNextCustomer = async () => {
    const waiting = bookings
      .filter(b => b.status === 'Waiting')
      .sort((a, b) => a.queue_position - b.queue_position);

    if (waiting.length === 0) {
      showToast('No customers currently waiting in the queue!');
      return;
    }

    const next = waiting[0];
    await handleStatusChange(next.id, 'Called');
    showToast(`Called customer ${next.customer_name} (Queue #${next.queue_position}) to the chair!`);
  };

  // -------------------------------------------------------------
  // Business Info Update
  // -------------------------------------------------------------
  const handleSaveBusinessInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setBizSaving(true);
    try {
      const updated = await updateBusinessInfo(bizForm);
      onBusinessUpdated(updated);
      showToast('Salon business information updated successfully everywhere!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update business info');
    } finally {
      setBizSaving(false);
    }
  };

  // -------------------------------------------------------------
  // Barber Operations
  // -------------------------------------------------------------
  const handleSaveBarber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBarber || !editingBarber.name || !editingBarber.specialty) return;

    try {
      if (editingBarber.id) {
        await updateBarber(editingBarber.id, editingBarber);
        showToast(`Barber ${editingBarber.name} updated.`);
      } else {
        await createBarber(editingBarber);
        showToast(`New barber ${editingBarber.name} added.`);
      }
      setEditingBarber(null);
      const res = await fetchManagerBarbers();
      setBarbers(res.barbers);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save barber');
    }
  };

  // -------------------------------------------------------------
  // Service Operations
  // -------------------------------------------------------------
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.name || !editingService.price_inr || !editingService.duration_min) return;

    try {
      if (editingService.id) {
        await updateService(editingService.id, editingService);
        showToast(`Service "${editingService.name}" updated.`);
      } else {
        await createService(editingService);
        showToast(`New service "${editingService.name}" created.`);
      }
      setEditingService(null);
      const res = await fetchManagerServices();
      setServices(res.services);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save service');
    }
  };

  // -------------------------------------------------------------
  // Haircut Style Operations
  // -------------------------------------------------------------
  const handleSaveStyle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStyle || !editingStyle.name || !editingStyle.image_url) return;

    try {
      if (editingStyle.id) {
        await updateStyle(editingStyle.id, editingStyle);
        showToast(`Style "${editingStyle.name}" updated.`);
      } else {
        await createStyle({ name: editingStyle.name, image_url: editingStyle.image_url });
        showToast(`New style "${editingStyle.name}" added to portfolio.`);
      }
      setEditingStyle(null);
      const res = await fetchManagerStyles();
      setStyles(res.styles);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save style');
    }
  };

  // -------------------------------------------------------------
  // Manager Password Change
  // -------------------------------------------------------------
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError('Please enter your current manager password.');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setPasswordError('New password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match. Please verify and retype.');
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await changeManagerPassword(currentPassword, newPassword);
      setPasswordSuccess(res.message || 'Password changed successfully!');
      showToast('Manager password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setPasswordSaving(false);
    }
  };

  // Queue counts
  const totalWaiting = bookings.filter(b => b.status === 'Waiting').length;
  const currentlyCalled = bookings.filter(b => b.status === 'Called').length;
  const totalCompleted = bookings.filter(b => b.status === 'Completed').length;

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF8F5] overflow-y-auto flex flex-col animate-in fade-in duration-200">
      
      {/* Top Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl bg-[#233A30] text-amber-100 text-xs font-semibold shadow-xl flex items-center gap-2 border border-emerald-600 animate-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Manager Header */}
      <header className="sticky top-0 z-30 bg-[#1B2F27] text-white border-b border-[#2D4E40] px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Return to public customer website"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Website</span>
            </button>
            <div className="h-5 w-px bg-white/20" />
            <div>
              <span className="font-serif text-lg font-bold text-amber-100 block leading-tight">
                Manager Desk & Control Room
              </span>
              <span className="text-[10px] text-stone-300 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {business.name} · Pampore, Kashmir
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onOpenDeveloperDesk && (
              <button
                onClick={onOpenDeveloperDesk}
                id="btn-manager-open-dev-desk"
                className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-medium flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                title="Open Developer Desk (modify all texts, pictures, schemas)"
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Developer Desk</span>
              </button>
            )}

            <button
              onClick={loadAll}
              disabled={loading}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 transition text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              title="Refresh all data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-900/70 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              id="btn-manager-logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Sub-header Tabs */}
      <div className="bg-white border-b border-stone-200 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-2 flex-shrink-0 cursor-pointer ${
              activeTab === 'queue'
                ? 'bg-[#233A30] text-amber-50 shadow-xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Customer Queue ({bookings.length})</span>
            {totalWaiting > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-amber-950 font-mono text-[10px] font-bold">
                {totalWaiting}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-2 flex-shrink-0 cursor-pointer ${
              activeTab === 'services'
                ? 'bg-[#233A30] text-amber-50 shadow-xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Services ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('barbers')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-2 flex-shrink-0 cursor-pointer ${
              activeTab === 'barbers'
                ? 'bg-[#233A30] text-amber-50 shadow-xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Barbers & Schedules ({barbers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('styles')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-2 flex-shrink-0 cursor-pointer ${
              activeTab === 'styles'
                ? 'bg-[#233A30] text-amber-50 shadow-xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Haircut Styles / Lookbook ({styles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('business')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-2 flex-shrink-0 cursor-pointer ${
              activeTab === 'business'
                ? 'bg-[#233A30] text-amber-50 shadow-xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Business Info & Maps</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            id="tab-manager-password"
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-2 flex-shrink-0 cursor-pointer ${
              activeTab === 'security'
                ? 'bg-[#233A30] text-amber-50 shadow-xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Change Password</span>
          </button>

          {onOpenDeveloperDesk && (
            <button
              onClick={onOpenDeveloperDesk}
              id="tab-manager-dev-desk"
              className="px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-2 flex-shrink-0 cursor-pointer text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300/60 font-mono ml-auto"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-600" />
              <span>Developer Desk</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-rose-600 font-bold text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 1: CUSTOMER QUEUE MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
            {/* Action Bar & Date Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-stone-500" />
                <div>
                  <label htmlFor="select-queue-date" className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Queue Date:
                  </label>
                  <input
                    id="select-queue-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="text-xs font-bold text-stone-900 border border-stone-300 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#233A30]"
                  />
                </div>
              </div>

              {/* Call Next Customer Button */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  id="btn-call-next-customer"
                  onClick={handleCallNextCustomer}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#233A30] hover:bg-[#182B22] text-amber-100 text-xs font-semibold tracking-wider uppercase transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Bell className="w-4 h-4 text-amber-300 animate-bounce" />
                  <span>Call Next Customer</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
                  Total Today
                </span>
                <p className="font-serif text-2xl font-bold text-stone-900 mt-1">{bookings.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-amber-800 font-semibold">
                  Waiting in Lounge
                </span>
                <p className="font-serif text-2xl font-bold text-amber-900 mt-1">{totalWaiting}</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-emerald-800 font-semibold">
                  Currently in Chair
                </span>
                <p className="font-serif text-2xl font-bold text-emerald-900 mt-1">{currentlyCalled}</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 shadow-xs">
                <span className="text-[11px] uppercase tracking-wider text-blue-800 font-semibold">
                  Completed
                </span>
                <p className="font-serif text-2xl font-bold text-blue-900 mt-1">{totalCompleted}</p>
              </div>
            </div>

            {/* Bookings Queue Table / Cards */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Today’s Customer Roster ({selectedDate})
                </h3>
                <span className="text-xs text-stone-500">
                  Status changes immediately update customer live queue
                </span>
              </div>

              {bookings.length === 0 ? (
                <div className="p-12 text-center text-stone-500 text-xs">
                  No bookings recorded for {selectedDate}. New reservations will appear here automatically.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold tracking-wider uppercase text-[10px]">
                        <th className="py-3 px-4">Queue #</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Barber</th>
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Time</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Manager Controls</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-stone-50/60 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                            #{booking.queue_position}
                            <div className="text-[10px] text-stone-400 font-normal">{booking.reference_no}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-stone-900 block">{booking.customer_name}</span>
                            <a href={`tel:${booking.phone}`} className="text-stone-500 hover:underline text-[11px]">
                              {booking.phone}
                            </a>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-stone-800">
                            {booking.barber_name}
                          </td>
                          <td className="py-3.5 px-4 text-stone-600">
                            {booking.service_name}
                            <span className="text-[10px] text-stone-400 block">{booking.service_duration} min</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-stone-900">
                            {booking.appointment_time}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                booking.status === 'Called'
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 animate-pulse'
                                  : booking.status === 'Waiting'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                  : booking.status === 'Hold'
                                  ? 'bg-stone-200 text-stone-800'
                                  : booking.status === 'Completed'
                                  ? 'bg-blue-100 text-blue-900'
                                  : 'bg-rose-100 text-rose-900'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Call Customer to Chair */}
                              {booking.status !== 'Called' && booking.status !== 'Completed' && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(booking.id, 'Called')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition"
                                  title="Call to Chair"
                                >
                                  Call
                                </button>
                              )}

                              {/* Hold */}
                              {booking.status === 'Waiting' && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(booking.id, 'Hold')}
                                  className="px-2 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 text-[11px] font-medium transition"
                                  title="Put on hold"
                                >
                                  Hold
                                </button>
                              )}

                              {/* Resume from Hold */}
                              {booking.status === 'Hold' && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(booking.id, 'Waiting')}
                                  className="px-2 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 text-[11px] font-medium transition"
                                  title="Resume to waiting"
                                >
                                  Resume
                                </button>
                              )}

                              {/* Mark Completed */}
                              {booking.status !== 'Completed' && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(booking.id, 'Completed')}
                                  className="px-2 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 text-[11px] font-medium transition"
                                  title="Mark service finished"
                                >
                                  Done
                                </button>
                              )}

                              {/* Cancel */}
                              {booking.status !== 'Cancelled' && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(booking.id, 'Cancelled')}
                                  className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-rose-100 text-stone-600 hover:text-rose-700 text-[11px] transition"
                                  title="Cancel booking"
                                >
                                  Cancel
                                </button>
                              )}

                              {/* Delete Permanently */}
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteTarget({
                                    type: 'booking',
                                    id: booking.id,
                                    name: `Booking #${booking.queue_position} (${booking.reference_no})`,
                                    detail: `Customer: ${booking.customer_name} · Barber: ${booking.barber_name} · Time: ${booking.appointment_time}`
                                  })
                                }
                                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                                title="Delete booking permanently"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: SERVICES MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">Salon Services Catalog</h3>
                <p className="text-xs text-stone-500">Manage grooming services, prices in ₹ INR, and photos.</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditingService({
                    name: '',
                    description: '',
                    price_inr: 350,
                    duration_min: 30,
                    image_url: '',
                    active: true
                  })
                }
                className="px-4 py-2 rounded-xl bg-[#233A30] hover:bg-[#182B22] text-amber-50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>

            {/* Service Form Modal */}
            {editingService && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                <div className="bg-white rounded-2xl border border-stone-200 p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h4 className="font-serif text-lg font-bold text-stone-900">
                      {editingService.id ? 'Edit Service' : 'Add New Grooming Service'}
                    </h4>
                    <button
                      onClick={() => setEditingService(null)}
                      className="p-1 text-stone-400 hover:text-stone-700"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveService} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Service Name *</label>
                      <input
                        type="text"
                        required
                        value={editingService.name || ''}
                        onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Description *</label>
                      <textarea
                        rows={3}
                        required
                        value={editingService.description || ''}
                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Price (₹ INR) *</label>
                        <input
                          type="number"
                          required
                          min={50}
                          value={editingService.price_inr || ''}
                          onChange={(e) =>
                            setEditingService({ ...editingService, price_inr: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Duration (Minutes) *</label>
                        <input
                          type="number"
                          required
                          min={10}
                          value={editingService.duration_min || ''}
                          onChange={(e) =>
                            setEditingService({ ...editingService, duration_min: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900"
                        />
                      </div>
                    </div>

                    {/* Image Upload directly from device */}
                    <ImageUploader
                      label="Service Photo (Upload from Device)"
                      value={editingService.image_url || ''}
                      onChange={(url) => setEditingService({ ...editingService, image_url: url })}
                    />

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="srv-active"
                        checked={editingService.active !== false}
                        onChange={(e) => setEditingService({ ...editingService, active: e.target.checked })}
                        className="rounded"
                      />
                      <label htmlFor="srv-active" className="text-stone-700 font-medium">
                        Active on public booking website
                      </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => setEditingService(null)}
                        className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#233A30] text-amber-100 font-semibold"
                      >
                        Save Service
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((srv) => (
                <div key={srv.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="h-40 bg-stone-100 relative overflow-hidden">
                      <img src={srv.image_url} alt={srv.name} className="w-full h-full object-cover" />
                      {!srv.active && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-rose-900/80 text-white text-[10px] font-bold">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif font-bold text-stone-900 text-base">{srv.name}</h4>
                        <span className="font-bold text-[#233A30] text-sm">₹{srv.price_inr}</span>
                      </div>
                      <p className="text-xs text-stone-600 line-clamp-2">{srv.description}</p>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#2D4E40]" />
                        <span>{srv.duration_min} minutes duration</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-stone-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setEditingService(srv)}
                      className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          type: 'service',
                          id: srv.id,
                          name: srv.name,
                          detail: `Price: ₹${srv.price_inr} · Duration: ${srv.duration_min} minutes`
                        })
                      }
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: BARBERS & SCHEDULES */}
        {/* ============================================================== */}
        {activeTab === 'barbers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">Active Barber Staff</h3>
                <p className="text-xs text-stone-500">Manage barber profiles, photos, specialties, and active schedules.</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditingBarber({
                    name: '',
                    specialty: '',
                    bio: '',
                    image_url: '',
                    active: true
                  })
                }
                className="px-4 py-2 rounded-xl bg-[#233A30] hover:bg-[#182B22] text-amber-50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Barber</span>
              </button>
            </div>

            {/* Barber Modal */}
            {editingBarber && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                <div className="bg-white rounded-2xl border border-stone-200 p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h4 className="font-serif text-lg font-bold text-stone-900">
                      {editingBarber.id ? 'Edit Barber' : 'Add New Barber'}
                    </h4>
                    <button
                      onClick={() => setEditingBarber(null)}
                      className="p-1 text-stone-400 hover:text-stone-700"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveBarber} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Barber Name *</label>
                      <input
                        type="text"
                        required
                        value={editingBarber.name || ''}
                        onChange={(e) => setEditingBarber({ ...editingBarber, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Specialty *</label>
                      <input
                        type="text"
                        required
                        value={editingBarber.specialty || ''}
                        onChange={(e) => setEditingBarber({ ...editingBarber, specialty: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Short Biography *</label>
                      <textarea
                        rows={3}
                        required
                        value={editingBarber.bio || ''}
                        onChange={(e) => setEditingBarber({ ...editingBarber, bio: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900"
                      />
                    </div>

                    {/* Image Upload directly from device */}
                    <ImageUploader
                      label="Barber Portrait Photo (Upload from Device)"
                      value={editingBarber.image_url || ''}
                      onChange={(url) => setEditingBarber({ ...editingBarber, image_url: url })}
                    />

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="barber-active"
                        checked={editingBarber.active !== false}
                        onChange={(e) => setEditingBarber({ ...editingBarber, active: e.target.checked })}
                        className="rounded"
                      />
                      <label htmlFor="barber-active" className="text-stone-700 font-medium">
                        Active on public roster
                      </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => setEditingBarber(null)}
                        className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#233A30] text-amber-100 font-semibold"
                      >
                        Save Barber
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Barbers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {barbers.map((barber) => (
                <div key={barber.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="aspect-4/5 bg-stone-100 relative overflow-hidden">
                      <img src={barber.image_url} alt={barber.name} className="w-full h-full object-cover" />
                      {!barber.active && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-rose-900/80 text-white text-[10px] font-bold">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h4 className="font-serif font-bold text-stone-900 text-base">{barber.name}</h4>
                      <p className="text-[11px] text-[#2D4E40] font-semibold">{barber.specialty}</p>
                      <p className="text-xs text-stone-600 line-clamp-3 mt-1">{barber.bio}</p>
                    </div>
                  </div>

                  <div className="p-4 border-t border-stone-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setEditingBarber(barber)}
                      className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          type: 'barber',
                          id: barber.id,
                          name: barber.name,
                          detail: `Specialty: ${barber.specialty}`
                        })
                      }
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete barber"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: HAIRCUT STYLES / LOOKBOOK */}
        {/* ============================================================== */}
        {activeTab === 'styles' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">Haircut Styles & Portfolio</h3>
                <p className="text-xs text-stone-500">Showcase popular cuts to inspiring customers. Upload photos directly from device.</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditingStyle({
                    name: '',
                    image_url: ''
                  })
                }
                className="px-4 py-2 rounded-xl bg-[#233A30] hover:bg-[#182B22] text-amber-50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Haircut Style</span>
              </button>
            </div>

            {/* Style Modal */}
            {editingStyle && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                <div className="bg-white rounded-2xl border border-stone-200 p-6 max-w-md w-full shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h4 className="font-serif text-lg font-bold text-stone-900">
                      {editingStyle.id ? 'Edit Style' : 'Add Haircut Style'}
                    </h4>
                    <button
                      onClick={() => setEditingStyle(null)}
                      className="p-1 text-stone-400 hover:text-stone-700"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveStyle} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Style Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Srinagar Textured Crop"
                        value={editingStyle.name || ''}
                        onChange={(e) => setEditingStyle({ ...editingStyle, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900"
                      />
                    </div>

                    <ImageUploader
                      label="Style Image (Upload from Device)"
                      value={editingStyle.image_url || ''}
                      onChange={(url) => setEditingStyle({ ...editingStyle, image_url: url })}
                    />

                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => setEditingStyle(null)}
                        className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#233A30] text-amber-100 font-semibold"
                      >
                        Save Style
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Styles Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {styles.map((style) => (
                <div key={style.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="aspect-3/4 bg-stone-100 relative overflow-hidden">
                      <img src={style.image_url} alt={style.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h4 className="font-serif font-bold text-stone-900 text-sm">{style.name}</h4>
                    </div>
                  </div>

                  <div className="p-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setEditingStyle(style)}
                      className="px-2.5 py-1 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                    >
                      Edit / Replace Image
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          type: 'style',
                          id: style.id,
                          name: style.name,
                          detail: 'Haircut style will be removed from salon lookbook'
                        })
                      }
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete haircut style"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: BUSINESS INFORMATION & GOOGLE MAPS */}
        {/* ============================================================== */}
        {activeTab === 'business' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6 max-w-3xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Salon Business Information & Regional Badges
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Modifications here immediately update the website header, visit section, footer, browser title, address links, and WhatsApp buttons.
                </p>
              </div>

              {onOpenDeveloperDesk && (
                <button
                  type="button"
                  onClick={onOpenDeveloperDesk}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-emerald-300 border border-emerald-500/40 text-xs font-mono flex items-center gap-1.5 transition flex-shrink-0"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Full Dev Desk</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSaveBusinessInfo} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Salon / Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={bizForm.name || ''}
                  onChange={(e) => setBizForm({ ...bizForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Region Badge (Top Hero Tag)
                  </label>
                  <input
                    type="text"
                    value={bizForm.region_badge || ''}
                    onChange={(e) => setBizForm({ ...bizForm, region_badge: e.target.value })}
                    placeholder="e.g. Pampore · Kashmir"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">Updates the pill at the top of the hero section.</p>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Location Area / Subtitle
                  </label>
                  <input
                    type="text"
                    value={bizForm.location_badge || ''}
                    onChange={(e) => setBizForm({ ...bizForm, location_badge: e.target.value })}
                    placeholder="e.g. Frestabal, Pampore"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">Replaces any old Boulevard Road label.</p>
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Business Description / Tagline
                </label>
                <textarea
                  rows={3}
                  value={bizForm.description || ''}
                  onChange={(e) => setBizForm({ ...bizForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Full Address (Pampore, Jammu & Kashmir) *
                </label>
                <input
                  type="text"
                  required
                  value={bizForm.address || ''}
                  onChange={(e) => setBizForm({ ...bizForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Clickable on the public website to trigger direct navigation.
                </p>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Google Maps Location / Share URL
                </label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/?q=..."
                  value={bizForm.map_url || ''}
                  onChange={(e) => setBizForm({ ...bizForm, map_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm font-mono"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Paste your Google Maps share link. If left blank, the address will automatically be used to generate a Google Maps search link.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Phone Number (for call link) *
                  </label>
                  <input
                    type="text"
                    required
                    value={bizForm.phone || ''}
                    onChange={(e) => setBizForm({ ...bizForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    WhatsApp Number (for chat button) *
                  </label>
                  <input
                    type="text"
                    required
                    value={bizForm.whatsapp || ''}
                    onChange={(e) => setBizForm({ ...bizForm, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Business / Lounge Hours *
                </label>
                <input
                  type="text"
                  required
                  value={bizForm.hours || ''}
                  onChange={(e) => setBizForm({ ...bizForm, hours: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={bizSaving}
                  className="px-6 py-3 rounded-xl bg-[#233A30] hover:bg-[#182B22] text-amber-50 text-xs font-semibold uppercase tracking-wider transition shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>{bizSaving ? 'Saving Updates...' : 'Publish Business Updates'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: MANAGER PASSWORD CHANGE & CREDENTIAL SECURITY */}
        {/* ============================================================== */}
        {activeTab === 'security' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-start gap-4 pb-6 border-b border-stone-100">
                <div className="w-12 h-12 rounded-xl bg-[#233A30]/10 text-[#233A30] flex items-center justify-center flex-shrink-0">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Change Manager Password
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Update the security key used to log in to the Kashmir Grooming Lounge Pampore Manager Desk.
                  </p>
                </div>
              </div>

              {passwordSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordText ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter existing password"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#233A30]"
                      id="input-current-password"
                    />
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Default factory key is: <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-700">kashmir123</code>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      New Password *
                    </label>
                    <input
                      type={showPasswordText ? 'text' : 'password'}
                      required
                      minLength={4}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 4 characters"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#233A30]"
                      id="input-new-password"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                      Confirm New Password *
                    </label>
                    <input
                      type={showPasswordText ? 'text' : 'password'}
                      required
                      minLength={4}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Retype new password"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#233A30]"
                      id="input-confirm-password"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer"
                  >
                    {showPasswordText ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide password characters</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Show password characters</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-6 border-t border-stone-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setPasswordError(null);
                      setPasswordSuccess(null);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition cursor-pointer"
                  >
                    Clear Form
                  </button>

                  <button
                    type="submit"
                    disabled={passwordSaving}
                    id="btn-submit-change-password"
                    className="px-6 py-2.5 rounded-xl bg-[#233A30] hover:bg-[#182B22] text-amber-50 text-xs font-semibold uppercase tracking-wider transition shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {passwordSaving ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-amber-300" />
                    )}
                    <span>{passwordSaving ? 'Updating Key...' : 'Update Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* IN-APP DELETE CONFIRMATION MODAL (Reliable in sandboxed iframes) */}
      {/* ============================================================== */}
      {deleteTarget && (
        <div
          id="modal-confirm-delete"
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 text-rose-600">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Confirm Permanent Deletion
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Are you sure you want to permanently delete this {deleteTarget.type}?
                </p>

                <div className="mt-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <p className="text-sm font-bold text-stone-900 truncate">
                    {deleteTarget.name}
                  </p>
                  {deleteTarget.detail && (
                    <p className="text-xs text-stone-500 mt-0.5">
                      {deleteTarget.detail}
                    </p>
                  )}
                </div>

                <p className="text-[11px] text-rose-600 font-medium mt-2.5">
                  This action cannot be undone and will immediately remove this entry from the lounge database.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (!deleting) setDeleteTarget(null);
                }}
                disabled={deleting}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold cursor-pointer disabled:opacity-50"
                id="btn-cancel-delete"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                id="btn-confirm-delete-action"
              >
                {deleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Permanently</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
