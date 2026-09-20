import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Scissors,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import type { Barber, Service, Booking, TimeSlot } from '../types';
import { fetchAvailability, createBooking } from '../lib/api';

interface BookingSectionProps {
  barbers: Barber[];
  services: Service[];
  selectedBarberId?: string;
  selectedServiceId?: string;
  onBookingSuccess: (booking: Booking) => void;
  onTrackQueue: (referenceNo: string) => void;
  title?: string;
  subtitle?: string;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  barbers,
  services,
  selectedBarberId,
  selectedServiceId,
  onBookingSuccess,
  onTrackQueue,
  title,
  subtitle
}) => {
  // Today's date YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(todayStr);
  const [barberId, setBarberId] = useState<string>(selectedBarberId || (barbers[0]?.id || ''));
  const [serviceId, setServiceId] = useState<string>(selectedServiceId || (services[0]?.id || ''));
  const [selectedTime, setSelectedTime] = useState<string>('');

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Success state modal
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync external selections
  useEffect(() => {
    if (selectedBarberId && barbers.some(b => b.id === selectedBarberId)) {
      setBarberId(selectedBarberId);
    }
  }, [selectedBarberId, barbers]);

  useEffect(() => {
    if (selectedServiceId && services.some(s => s.id === selectedServiceId)) {
      setServiceId(selectedServiceId);
    }
  }, [selectedServiceId, services]);

  // If barberId is empty but barbers load
  useEffect(() => {
    if (!barberId && barbers.length > 0) {
      setBarberId(barbers[0].id);
    }
    if (!serviceId && services.length > 0) {
      setServiceId(services[0].id);
    }
  }, [barbers, services, barberId, serviceId]);

  // Load available time slots when date, barberId or serviceId changes
  useEffect(() => {
    if (!barberId || !appointmentDate) return;

    let isMounted = true;
    setLoadingSlots(true);
    setSelectedTime('');
    setErrorMsg(null);

    fetchAvailability(appointmentDate, barberId, serviceId)
      .then((res) => {
        if (!isMounted) return;
        setSlots(res.slots || []);
        // Auto-select first available slot if any
        const firstAvailable = res.slots.find(s => s.available);
        if (firstAvailable) {
          setSelectedTime(firstAvailable.time);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setErrorMsg(err.message || 'Unable to compute available time slots.');
      })
      .finally(() => {
        if (isMounted) setLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [appointmentDate, barberId, serviceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\s+/g, '').length < 8) {
      setErrorMsg('Please provide a valid phone or mobile number.');
      return;
    }
    if (!selectedTime) {
      setErrorMsg('Please select an available appointment time slot.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createBooking({
        customer_name: customerName,
        phone,
        barber_id: barberId,
        service_id: serviceId,
        appointment_date: appointmentDate,
        appointment_time: selectedTime
      });

      setCompletedBooking(res.booking);
      onBookingSuccess(res.booking);
    } catch (err: any) {
      setErrorMsg(err.message || 'Booking submission failed. Slot may have been reserved.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyReference = (ref: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ref).catch(() => {
          fallbackCopyText(ref);
        });
      } else {
        fallbackCopyText(ref);
      }
    } catch {
      fallbackCopyText(ref);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const fallbackCopyText = (text: string) => {
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    } catch (e) {
      console.warn('Fallback copy failed:', e);
    }
  };

  const selectedService = services.find(s => s.id === serviceId);
  const selectedBarber = barbers.find(b => b.id === barberId);

  return (
    <section id="booking-section" className="py-20 bg-[#FAF8F5] border-b border-stone-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#233A30]/10 text-[#233A30] text-xs font-bold tracking-widest uppercase">
            <Scissors className="w-3.5 h-3.5" />
            <span>Instant Reservation</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            {title || 'Book Your Appointment'}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {subtitle || 'No account required. Choose your barber, treatment, and verified available time slot. Double bookings are automatically prevented.'}
          </p>
        </div>

        {/* Successful Booking Confirmation Overlay / Card */}
        {completedBooking ? (
          <div className="bg-white rounded-2xl border-2 border-[#233A30] p-6 sm:p-10 shadow-xl space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3 text-emerald-800">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Appointment Confirmed!
                </h3>
                <p className="text-xs text-stone-500">
                  Your seat has been reserved at Kashmir Grooming Lounge, Pampore.
                </p>
              </div>
            </div>

            {/* Reference Number Box */}
            <div className="p-5 rounded-xl bg-[#F4EFE6] border border-[#E3D9C9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#233A30]">
                  Unique Booking Reference Code
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-stone-900 tracking-wider mt-0.5">
                  {completedBooking.reference_no}
                </div>
                <p className="text-xs text-stone-600 mt-1 font-medium">
                  Please save or screenshot this code to track your live queue position.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopyReference(completedBooking.reference_no)}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-xs font-semibold flex items-center gap-2 transition shadow-xs cursor-pointer"
                id="btn-copy-booking-ref"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-stone-600" />
                    <span>Copy Reference</span>
                  </>
                )}
              </button>
            </div>

            {/* Summary Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 font-medium block">Customer</span>
                <span className="font-bold text-stone-900 text-sm mt-0.5 block truncate">
                  {completedBooking.customer_name}
                </span>
                <span className="text-stone-500 text-[11px]">{completedBooking.phone}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 font-medium block">Barber</span>
                <span className="font-bold text-stone-900 text-sm mt-0.5 block truncate">
                  {completedBooking.barber_name}
                </span>
                <span className="text-stone-500 text-[11px]">Chair Reserved</span>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-stone-500 font-medium block">Date & Time</span>
                <span className="font-bold text-stone-900 text-sm mt-0.5 block">
                  {completedBooking.appointment_time}
                </span>
                <span className="text-stone-500 text-[11px]">{completedBooking.appointment_date}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-emerald-700 font-medium block">Queue Position</span>
                <span className="font-serif text-2xl font-bold text-emerald-900 mt-0.5 block">
                  #{completedBooking.queue_position}
                </span>
                <span className="text-emerald-700 text-[10px] font-semibold uppercase">Status: Waiting</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => onTrackQueue(completedBooking.reference_no)}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-[#233A30] hover:bg-[#182B22] text-amber-50 text-xs font-semibold tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                id="btn-track-booking-live"
              >
                <span>Track in Live Queue</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setCompletedBooking(null);
                  setCustomerName('');
                  setPhone('');
                }}
                className="w-full sm:w-auto py-3.5 px-5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold cursor-pointer"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        ) : (
          /* The Form */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-sm space-y-8"
            id="appointment-booking-form"
          >
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 1: Customer Contact */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#233A30] text-white flex items-center justify-center text-[10px]">1</span>
                Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="input-customer-name" className="block text-xs font-medium text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      id="input-customer-name"
                      type="text"
                      required
                      placeholder="e.g. Farhan Shah"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#233A30] focus:border-transparent bg-stone-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="input-customer-phone" className="block text-xs font-medium text-stone-700 mb-1">
                    Mobile Number (for live queue SMS/alerts) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      id="input-customer-phone"
                      type="tel"
                      required
                      placeholder="e.g. +91 94190 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#233A30] focus:border-transparent bg-stone-50/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Service & Barber Selection */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#233A30] text-white flex items-center justify-center text-[10px]">2</span>
                Service & Barber Preference
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="select-service" className="block text-xs font-medium text-stone-700 mb-1">
                    Select Grooming Service *
                  </label>
                  <select
                    id="select-service"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#233A30] bg-stone-50/50 cursor-pointer"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} · ₹{s.price_inr} ({s.duration_min} min)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="select-barber" className="block text-xs font-medium text-stone-700 mb-1">
                    Preferred Barber *
                  </label>
                  <select
                    id="select-barber"
                    value={barberId}
                    onChange={(e) => setBarberId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#233A30] bg-stone-50/50 cursor-pointer"
                  >
                    {barbers.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.specialty})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Service pricing summary pill */}
              {selectedService && (
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-between text-xs text-stone-600">
                  <span>
                    Selected: <strong className="text-stone-900">{selectedService.name}</strong> with{' '}
                    <strong className="text-stone-900">{selectedBarber?.name}</strong>
                  </span>
                  <span className="font-bold text-[#233A30] text-sm">
                    ₹{selectedService.price_inr} · {selectedService.duration_min} min
                  </span>
                </div>
              )}
            </div>

            {/* Step 3: Date & Available Slots */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#233A30] text-white flex items-center justify-center text-[10px]">3</span>
                Select Date & Available Slot
              </h3>

              <div>
                <label htmlFor="input-appointment-date" className="block text-xs font-medium text-stone-700 mb-1">
                  Appointment Date *
                </label>
                <div className="relative max-w-xs">
                  <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    id="input-appointment-date"
                    type="date"
                    min={todayStr}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#233A30] bg-stone-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-2">
                  Available Time Slots for {selectedBarber?.name || 'Selected Barber'}
                </label>

                {loadingSlots ? (
                  <div className="p-8 rounded-xl bg-stone-50 border border-stone-200 flex flex-col items-center justify-center gap-2 text-stone-500 text-xs">
                    <Loader2 className="w-5 h-5 animate-spin text-[#233A30]" />
                    <span>Loading real-time availability from salon server...</span>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="p-6 rounded-xl bg-stone-50 border border-stone-200 text-center text-xs text-stone-500">
                    No operating slots available for this barber on this day. Please pick another date or barber.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 max-h-56 overflow-y-auto p-1">
                    {slots.map((slot) => {
                      const isSelected = selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`py-2 px-2 rounded-xl text-xs font-medium transition cursor-pointer flex flex-col items-center justify-center gap-0.5 border ${
                            isSelected
                              ? 'bg-[#233A30] text-amber-50 border-[#233A30] shadow-xs'
                              : slot.available
                              ? 'bg-white text-stone-800 border-stone-200 hover:border-[#233A30] hover:bg-stone-50'
                              : 'bg-stone-100 text-stone-400 border-stone-200/60 cursor-not-allowed opacity-60'
                          }`}
                          title={slot.reason || (slot.available ? 'Available Slot' : 'Not available')}
                        >
                          <span className="font-semibold">{slot.time}</span>
                          <span className="text-[9px]">
                            {slot.available ? 'Available' : slot.reason || 'Booked'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-4 border-t border-stone-100">
              <button
                type="submit"
                id="btn-confirm-appointment"
                disabled={submitting || !selectedTime}
                className="w-full py-4 px-6 rounded-xl bg-[#233A30] hover:bg-[#182B22] text-amber-50 text-sm font-semibold tracking-wider uppercase transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Reserving your seat...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4 text-amber-300" />
                    <span>Confirm & Generate Booking Reference</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-stone-500 text-center mt-2.5">
                Zero advance payment required · Instant verified booking reference provided
              </p>
            </div>
          </form>
        )}

      </div>
    </section>
  );
};
