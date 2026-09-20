import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Clock,
  User,
  Scissors,
  Calendar,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  PauseCircle,
  XCircle,
  Users,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Hash,
  Phone,
  Smartphone
} from 'lucide-react';
import type { QueueCheckResponse } from '../types';
import { checkQueueStatus, fetchLiveQueueBoard } from '../lib/api';

interface LiveQueueSectionProps {
  initialReference?: string;
  title?: string;
  subtitle?: string;
}

export const LiveQueueSection: React.FC<LiveQueueSectionProps> = ({
  initialReference = '',
  title,
  subtitle
}) => {
  const [trackMode, setTrackMode] = useState<'reference' | 'phone'>('phone');
  const [referenceInput, setReferenceInput] = useState(initialReference);
  const [phoneInput, setPhoneInput] = useState('');
  const [queueData, setQueueData] = useState<QueueCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Lobby board state
  const [showLobbyBoard, setShowLobbyBoard] = useState(false);
  const [lobbyData, setLobbyData] = useState<{
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
  } | null>(null);

  // Track if initialReference changes
  useEffect(() => {
    if (initialReference) {
      setTrackMode('reference');
      setReferenceInput(initialReference);
      handleCheck(initialReference);
    }
  }, [initialReference]);

  const handleCheck = useCallback(async (queryOverride?: string) => {
    const rawQuery = queryOverride !== undefined 
      ? queryOverride 
      : (trackMode === 'phone' ? phoneInput : referenceInput);
    
    const query = (rawQuery || '').trim();
    if (!query) {
      if (trackMode === 'phone') {
        setErrorMsg('Please enter your mobile phone number (e.g. 96222 29622).');
      } else {
        setErrorMsg('Please enter a booking reference code (e.g. KS-20260917-4821).');
      }
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const data = await checkQueueStatus(query);
      setQueueData(data);
      setLastRefreshed(new Date());
    } catch (err: any) {
      setErrorMsg(err.message || (trackMode === 'phone'
        ? 'No active booking found for this mobile number. Please check your number or try your reference code.'
        : 'Reference number not found. Please verify the code.'));
      setQueueData(null);
    } finally {
      setLoading(false);
    }
  }, [trackMode, phoneInput, referenceInput]);

  // Load lobby board
  const loadLobbyBoard = useCallback(async () => {
    try {
      const res = await fetchLiveQueueBoard();
      setLobbyData(res);
    } catch (err) {
      console.error('Failed to fetch live queue lobby board:', err);
    }
  }, []);

  useEffect(() => {
    loadLobbyBoard();
  }, [loadLobbyBoard]);

  // Auto-refresh periodically (every 15 seconds) so queue status updates automatically
  useEffect(() => {
    const interval = setInterval(() => {
      if (queueData?.booking.reference_no) {
        checkQueueStatus(queueData.booking.reference_no)
          .then((updated) => {
            setQueueData(updated);
            setLastRefreshed(new Date());
          })
          .catch(() => {});
      }
      loadLobbyBoard();
    }, 15000);

    return () => clearInterval(interval);
  }, [queueData?.booking.reference_no, loadLobbyBoard]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Called':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 animate-pulse font-bold text-xs tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Called · In Chair Now</span>
          </div>
        );
      case 'Waiting':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-xs tracking-wider uppercase">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Waiting in Lounge</span>
          </div>
        );
      case 'Hold':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200 text-stone-800 font-semibold text-xs tracking-wider uppercase">
            <PauseCircle className="w-3.5 h-3.5 text-stone-600" />
            <span>On Hold</span>
          </div>
        );
      case 'Completed':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-semibold text-xs tracking-wider uppercase">
            <CheckCircle className="w-3.5 h-3.5 text-blue-700" />
            <span>Grooming Completed</span>
          </div>
        );
      case 'Cancelled':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 font-semibold text-xs tracking-wider uppercase">
            <XCircle className="w-3.5 h-3.5 text-rose-700" />
            <span>Cancelled</span>
          </div>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <section id="live-queue-section" className="py-20 bg-stone-100/60 border-b border-stone-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-bold tracking-widest uppercase border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Real-time Lounge Sync</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            {title || 'Live Queue Tracking'}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {subtitle || (
              <>
                Track your appointment and seat position live using your <strong>Mobile Number</strong> or <strong>Booking Reference</strong> before visiting our Pampore salon.
              </>
            )}
          </p>
        </div>

        {/* Search & Lookup Form */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Tracking Mode Switcher: Mobile Number vs Reference Code */}
          <div className="flex items-center gap-2 p-1 bg-stone-100/90 rounded-xl max-w-sm border border-stone-200/80">
            <button
              type="button"
              id="tab-track-phone"
              onClick={() => {
                setTrackMode('phone');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                trackMode === 'phone'
                  ? 'bg-white text-[#233A30] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-[#233A30]" />
              <span>Mobile Number</span>
            </button>

            <button
              type="button"
              id="tab-track-ref"
              onClick={() => {
                setTrackMode('reference');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                trackMode === 'reference'
                  ? 'bg-white text-[#233A30] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Hash className="w-3.5 h-3.5 text-[#233A30]" />
              <span>Reference Code</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              {trackMode === 'phone' ? (
                <>
                  <Phone className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
                  <input
                    type="tel"
                    id="input-queue-phone"
                    placeholder="Enter Mobile Number (e.g. 96222 29622)"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCheck();
                      }
                    }}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-300 font-mono text-sm tracking-wide text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#233A30] bg-stone-50/50"
                  />
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    id="input-queue-reference"
                    placeholder="Enter Booking Reference (e.g. KS-20260917-4821)"
                    value={referenceInput}
                    onChange={(e) => setReferenceInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCheck();
                      }
                    }}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-300 font-mono text-sm tracking-wide text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#233A30] bg-stone-50/50"
                  />
                </>
              )}
            </div>
            <button
              type="button"
              id="btn-search-queue"
              disabled={loading}
              onClick={() => handleCheck()}
              className="px-7 py-3 rounded-xl bg-[#233A30] hover:bg-[#182B22] text-amber-50 text-xs font-semibold tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
              ) : (
                <Search className="w-4 h-4 text-amber-300" />
              )}
              <span>Track Queue</span>
            </button>
          </div>

          {/* Quick test references/numbers pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
            <span className="text-[11px] font-medium">Quick examples to test:</span>
            {trackMode === 'phone' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setPhoneInput('9622229622');
                    handleCheck('9622229622');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-[11px] transition cursor-pointer"
                >
                  96222 29622
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhoneInput('9419012345');
                    handleCheck('9419012345');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-[11px] transition cursor-pointer"
                >
                  94190 12345
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhoneInput('9419067890');
                    handleCheck('9419067890');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-[11px] transition cursor-pointer"
                >
                  94190 67890
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setReferenceInput('KS-20260917-4821');
                    handleCheck('KS-20260917-4821');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-[11px] transition cursor-pointer"
                >
                  KS-20260917-4821 (Called)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReferenceInput('KS-20260917-3194');
                    handleCheck('KS-20260917-3194');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-[11px] transition cursor-pointer"
                >
                  KS-20260917-3194 (Waiting)
                </button>
              </>
            )}
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* If multiple bookings were found for this phone number */}
          {queueData?.multiple_bookings && queueData.multiple_bookings.length > 1 && (
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2.5">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-amber-800" />
                Found {queueData.multiple_bookings.length} bookings for this number. Select one:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {queueData.multiple_bookings.map((mb) => {
                  const isSelected = mb.reference_no === queueData.booking.reference_no;
                  return (
                    <button
                      key={mb.id}
                      type="button"
                      onClick={() => handleCheck(mb.reference_no)}
                      className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#233A30] text-white border-[#233A30] shadow-xs'
                          : 'bg-white text-stone-800 border-amber-200 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono font-bold">
                        <span>{mb.reference_no}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-amber-400 text-amber-950' : 'bg-stone-100 text-stone-700'
                        }`}>
                          {mb.status}
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] opacity-90">
                        {mb.appointment_date} · {mb.appointment_time} · {mb.barber_name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Result Card */}
          {queueData && (
            <div className="pt-4 border-t border-stone-100 space-y-5 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    Live Tracking Result · {queueData.booking.customer_name}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-xl sm:text-2xl font-bold text-stone-900">
                      {queueData.booking.reference_no}
                    </span>
                    <span className="text-xs text-stone-500 font-mono bg-stone-100 px-2 py-0.5 rounded-md">
                      {queueData.booking.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(queueData.booking.status)}
                  <button
                    type="button"
                    onClick={() => handleCheck(queueData.booking.reference_no)}
                    className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition"
                    title="Refresh status now"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Called notice banner */}
              {queueData.booking.status === 'Called' && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-medium flex items-center gap-3 shadow-xs">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <div>
                    <strong>Your Turn!</strong> Master Barber {queueData.barber_name} has prepared the chair for your {queueData.service_name}. Please check in at our Pampore salon reception.
                  </div>
                </div>
              )}

              {/* Status Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-medium flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#2D4E40]" /> Queue Position
                  </span>
                  <span className="font-serif text-2xl font-bold text-stone-900 mt-0.5 block">
                    #{queueData.booking.queue_position}
                  </span>
                  <span className="text-[10px] text-stone-500">Overall order for today</span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#2D4E40]" /> Ahead of You
                  </span>
                  <span className="font-serif text-2xl font-bold text-stone-900 mt-0.5 block">
                    {queueData.customers_ahead}
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {queueData.customers_ahead === 0 ? 'You are next in line' : 'Customers in queue'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#2D4E40]" /> Est. Wait Time
                  </span>
                  <span className="font-serif text-2xl font-bold text-[#233A30] mt-0.5 block">
                    {queueData.estimated_wait_min > 0 ? `~${queueData.estimated_wait_min}m` : 'Ready now'}
                  </span>
                  <span className="text-[10px] text-stone-500">Updated in real-time</span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#2D4E40]" /> Reserved Time
                  </span>
                  <span className="font-serif text-lg font-bold text-stone-900 mt-0.5 block">
                    {queueData.booking.appointment_time}
                  </span>
                  <span className="text-[10px] text-stone-500">{queueData.booking.appointment_date}</span>
                </div>
              </div>

              {/* Barber & Service Info Pill */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-stone-500">Barber:</span>{' '}
                  <strong className="text-stone-900 font-semibold">{queueData.barber_name}</strong>
                  <span className="mx-2 text-stone-300">|</span>
                  <span className="text-stone-500">Service:</span>{' '}
                  <strong className="text-stone-900 font-semibold">{queueData.service_name}</strong>
                </div>

                {lastRefreshed && (
                  <span className="text-[10px] text-stone-400">
                    Auto-synced at {lastRefreshed.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Today's Salon Lobby Queue Board Toggle */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#233A30]" />
              Today’s Public Salon Board
            </h3>
            <button
              type="button"
              onClick={() => setShowLobbyBoard(!showLobbyBoard)}
              className="text-xs font-semibold text-[#233A30] hover:underline cursor-pointer"
            >
              {showLobbyBoard ? 'Hide Board' : 'View Full Today Queue'}
            </button>
          </div>

          {showLobbyBoard && lobbyData && (
            <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs animate-in slide-in-from-bottom-2 duration-300 space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-600 pb-2 border-b border-stone-100">
                <span>Date: <strong>{lobbyData.date}</strong></span>
                <span>Active waiting: <strong>{lobbyData.totalWaiting}</strong> · Currently in chair: <strong>{lobbyData.currentlyServing}</strong></span>
              </div>

              {lobbyData.activeQueue.length === 0 ? (
                <p className="text-xs text-stone-500 text-center py-6">
                  No active queue entries right now. Walk-ins and bookings receive immediate seating.
                </p>
              ) : (
                <div className="divide-y divide-stone-100">
                  {lobbyData.activeQueue.map((item) => (
                    <div key={item.reference_no} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-700 font-bold flex items-center justify-center text-[10px]">
                          #{item.queue_position}
                        </span>
                        <div>
                          <span className="font-mono font-bold text-stone-900">{item.reference_no}</span>
                          <span className="text-stone-500 text-[11px] ml-2">({item.customer_masked})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-stone-500 hidden sm:inline">{item.barber_name} · {item.appointment_time}</span>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
