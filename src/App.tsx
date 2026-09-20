import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import type { BusinessInfo, Barber, Service, HaircutStyle, Booking } from './types';
import { fetchSalonData, verifyManagerSession, isDeveloperSessionActive, updateFaviconDOM } from './lib/api';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { BarbersSection } from './components/BarbersSection';
import { StylesSection } from './components/StylesSection';
import { BookingSection } from './components/BookingSection';
import { LiveQueueSection } from './components/LiveQueueSection';
import { VisitSection } from './components/VisitSection';
import { Footer } from './components/Footer';
import { ManagerLoginModal } from './components/ManagerLoginModal';
import { ManagerDashboard } from './components/ManagerDashboard';
import { DeveloperLoginModal } from './components/DeveloperLoginModal';
import { DeveloperDesk } from './components/DeveloperDesk';

export default function App() {
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [styles, setStyles] = useState<HaircutStyle[]>([]);
  const [barberQueues, setBarberQueues] = useState<Record<string, { waitingCount: number; currentServing?: string }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pre-selection for booking
  const [selectedBarberId, setSelectedBarberId] = useState<string | undefined>();
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();

  // Live queue active reference code
  const [activeQueueRef, setActiveQueueRef] = useState<string>('KS-20260917-4821');

  // Manager state
  const [isManagerLoggedIn, setIsManagerLoggedIn] = useState(false);
  const [showManagerLoginModal, setShowManagerLoginModal] = useState(false);
  const [showManagerDashboard, setShowManagerDashboard] = useState(false);

  // Developer state
  const [isDeveloperLoggedIn, setIsDeveloperLoggedIn] = useState(false);
  const [showDeveloperLoginModal, setShowDeveloperLoginModal] = useState(false);
  const [showDeveloperDesk, setShowDeveloperDesk] = useState(false);

  // Load public salon data
  const loadData = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const data = await fetchSalonData();
      setBusiness(data.business);
      setBarbers(data.barbers);
      setServices(data.services);
      setStyles(data.styles);
      setBarberQueues(data.barberQueues || {});
      setError(null);

      // Keep browser title synchronized dynamically
      if (data.business?.name) {
        document.title = `${data.business.name} · Pampore, Kashmir`;
      }

      // Keep dynamic favicon in sync
      if (data.business?.favicon_url) {
        updateFaviconDOM(data.business.favicon_url);
      }
    } catch (err: any) {
      if (isInitial) {
        setError(err.message || 'Unable to connect to salon server. Please refresh.');
      }
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  // Initial load & check sessions
  useEffect(() => {
    loadData(true);

    verifyManagerSession().then((isValid) => {
      setIsManagerLoggedIn(isValid);
    });

    setIsDeveloperLoggedIn(isDeveloperSessionActive());
  }, [loadData]);

  // Developer keyboard shortcut: Ctrl+Shift+D or Alt+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') || (e.altKey && e.key.toLowerCase() === 'd')) {
        e.preventDefault();
        handleOpenDeveloper();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDeveloperLoggedIn]);

  // Fast multi-device public data sync (every 5 seconds) & instant refresh on tab focus / visibility
  useEffect(() => {
    const timer = setInterval(() => {
      loadData(false);
    }, 5000);

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        loadData(false);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kashmir_salon_data_v2' || e.key === 'kashmir_salon_manager_token') {
        loadData(false);
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(timer);
      window.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadData]);

  // Helper scrollTo
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleBookFromHero = () => {
    scrollTo('booking-section');
  };

  const handleQueueFromHero = () => {
    scrollTo('live-queue-section');
  };

  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    scrollTo('booking-section');
  };

  const handleSelectBarber = (barberId: string) => {
    setSelectedBarberId(barberId);
    scrollTo('booking-section');
  };

  const handleBookingSuccess = (booking: Booking) => {
    setActiveQueueRef(booking.reference_no);
    loadData(false);
  };

  const handleTrackQueue = (ref: string) => {
    setActiveQueueRef(ref);
    scrollTo('live-queue-section');
  };

  const handleOpenManager = () => {
    if (isManagerLoggedIn) {
      setShowManagerDashboard(true);
    } else {
      setShowManagerLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsManagerLoggedIn(true);
    setShowManagerLoginModal(false);
    setShowManagerDashboard(true);
  };

  const handleOpenDeveloper = () => {
    if (isDeveloperLoggedIn || isDeveloperSessionActive()) {
      setIsDeveloperLoggedIn(true);
      setShowDeveloperDesk(true);
    } else {
      setShowDeveloperLoginModal(true);
    }
  };

  const handleDeveloperLoginSuccess = () => {
    setIsDeveloperLoggedIn(true);
    setShowDeveloperLoginModal(false);
    setShowDeveloperDesk(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-[#233A30] text-amber-200 flex items-center justify-center font-serif text-2xl font-bold mb-4 shadow-md animate-pulse">
          K
        </div>
        <div className="flex items-center gap-2 text-stone-700 text-sm font-medium">
          <Loader2 className="w-5 h-5 animate-spin text-[#233A30]" />
          <span>Opening Kashmir Grooming Lounge, Pampore...</span>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-stone-200 shadow-md text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
          <h2 className="font-serif text-xl font-bold text-stone-900">Salon Connection Issue</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            {error || 'Unable to connect to the Pampore salon server. Please retry.'}
          </p>
          <button
            onClick={() => loadData(true)}
            className="px-6 py-2.5 rounded-xl bg-[#233A30] text-amber-100 text-xs font-semibold uppercase tracking-wider shadow-xs hover:bg-[#182B22] transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans selection:bg-[#233A30] selection:text-amber-100">
      
      {/* Public Header */}
      <Header
        business={business}
        onOpenManager={handleOpenManager}
        onOpenDeveloper={handleOpenDeveloper}
        isManagerLoggedIn={isManagerLoggedIn}
      />

      {/* Main Public Website Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          business={business}
          barberCount={barbers.length}
          serviceCount={services.length}
          onBookClick={handleBookFromHero}
          onQueueClick={handleQueueFromHero}
        />

        {/* 2. Services Section */}
        <ServicesSection
          services={services}
          title={business.services_title}
          subtitle={business.services_subtitle}
          onSelectService={handleSelectService}
        />

        {/* 3. Barber Section */}
        <BarbersSection
          barbers={barbers}
          barberQueues={barberQueues}
          title={business.barbers_title}
          subtitle={business.barbers_subtitle}
          onSelectBarber={handleSelectBarber}
        />

        {/* 4. Haircut Styles / Portfolio Section */}
        <StylesSection
          styles={styles}
          title={business.styles_title}
          subtitle={business.styles_subtitle}
          onBookStyle={(style) => scrollTo('booking-section')}
        />

        {/* 5. Online Appointment Booking Section */}
        <BookingSection
          barbers={barbers}
          services={services}
          title={business.booking_title}
          subtitle={business.booking_subtitle}
          selectedBarberId={selectedBarberId}
          selectedServiceId={selectedServiceId}
          onBookingSuccess={handleBookingSuccess}
          onTrackQueue={handleTrackQueue}
        />

        {/* 6. Live Queue Tracking Section */}
        <LiveQueueSection
          initialReference={activeQueueRef}
          title={business.queue_title}
          subtitle={business.queue_subtitle}
        />

        {/* 9 & 10. Visit & Google Maps Location Section */}
        <VisitSection business={business} />
      </main>

      {/* 18. Footer */}
      <Footer
        business={business}
        onOpenManager={handleOpenManager}
        onOpenDeveloper={handleOpenDeveloper}
      />

      {/* Manager Login Modal */}
      <ManagerLoginModal
        isOpen={showManagerLoginModal}
        onClose={() => setShowManagerLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Developer Login Modal */}
      <DeveloperLoginModal
        isOpen={showDeveloperLoginModal}
        onClose={() => setShowDeveloperLoginModal(false)}
        onLoginSuccess={handleDeveloperLoginSuccess}
      />

      {/* Dedicated Manager Dashboard */}
      {showManagerDashboard && (
        <ManagerDashboard
          business={business}
          onOpenDeveloperDesk={() => {
            setShowManagerDashboard(false);
            handleOpenDeveloper();
          }}
          onBusinessUpdated={(updated) => {
            setBusiness(updated);
            if (updated.name) {
              document.title = `${updated.name} · Pampore, Kashmir`;
            }
            if (updated.favicon_url) {
              updateFaviconDOM(updated.favicon_url);
            }
          }}
          onClose={() => {
            setShowManagerDashboard(false);
            loadData(false);
          }}
        />
      )}

      {/* Full Developer Desk (Custom CMS for Everything) */}
      {showDeveloperDesk && (
        <DeveloperDesk
          business={business}
          onRefreshData={() => loadData(false)}
          onBusinessUpdated={(updated) => {
            setBusiness(updated);
            if (updated.name) {
              document.title = `${updated.name} · Pampore, Kashmir`;
            }
            if (updated.favicon_url) {
              updateFaviconDOM(updated.favicon_url);
            }
            loadData(false);
          }}
          onClose={() => {
            setShowDeveloperDesk(false);
            loadData(false);
          }}
        />
      )}

    </div>
  );
}
