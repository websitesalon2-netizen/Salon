import React from 'react';
import { Shield, Clock, MapPin, Scissors, Sparkles, UserCheck, Terminal } from 'lucide-react';
import type { BusinessInfo } from '../types';

interface HeaderProps {
  business: BusinessInfo;
  onOpenManager: () => void;
  onOpenDeveloper?: () => void;
  isManagerLoggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  business,
  onOpenManager,
  onOpenDeveloper,
  isManagerLoggedIn
}) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top utility ribbon */}
      <div className="bg-[#1F332B] text-stone-200 text-xs px-3 sm:px-4 py-1.5 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center justify-between min-w-max sm:min-w-0 gap-4">
          <div className="flex items-center gap-4 sm:gap-6 text-[11px] font-medium tracking-wide">
            <span className="flex items-center gap-1.5 text-amber-200/90">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {business.region_badge || 'Pampore, Kashmir'}
            </span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              {business.hours || 'Mon – Sun: 9:30 AM – 8:30 PM'}
            </span>
            {business.announcement_bar && (
              <span className="text-amber-300/90 font-medium">
                {business.announcement_bar}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
            {onOpenDeveloper && (
              <button
                type="button"
                onClick={onOpenDeveloper}
                className="text-stone-300 hover:text-emerald-300 flex items-center gap-1 font-mono transition cursor-pointer"
                title="Developer Desk (Customize Website)"
              >
                <Terminal className="w-3 h-3 text-emerald-400" />
                <span>Developer Desk</span>
              </button>
            )}
            <span className="text-stone-500">|</span>
            <span className="text-stone-300 hidden sm:inline">Call / WhatsApp:</span>
            <a
              href={`tel:${business.phone}`}
              className="text-amber-200 hover:text-white font-medium transition"
            >
              {business.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo & Dynamic Salon Name */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 sm:gap-3.5 group cursor-pointer shrink-0"
            id="header-logo-link"
          >
            {/* Logo Image or Kashmir Chinar-inspired Monogram Badge */}
            {business.logo_url ? (
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-md border border-[#3B5B4E] bg-white flex items-center justify-center">
                <img
                  src={business.logo_url}
                  alt={business.name || 'Salon Logo'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#233A30] text-amber-100 flex items-center justify-center font-serif text-lg sm:text-xl font-bold tracking-tight shadow-md border border-[#3B5B4E] group-hover:bg-[#1B2F27] transition">
                <span>{business.logo_text || (business.name ? business.name.charAt(0) : 'J')}</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-serif text-base sm:text-xl font-bold tracking-tight text-stone-900 leading-tight line-clamp-1">
                {business.name || 'Jawed Habib'}
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-semibold text-[#3D6352]">
                {business.region_badge || 'Pampore · Kashmir'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation (Visible on md and above) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => scrollTo('services-section')}
              className="text-xs font-semibold uppercase tracking-widest text-stone-700 hover:text-[#233A30] transition cursor-pointer"
              id="nav-services"
            >
              Services
            </button>
            <button
              onClick={() => scrollTo('barbers-section')}
              className="text-xs font-semibold uppercase tracking-widest text-stone-700 hover:text-[#233A30] transition cursor-pointer"
              id="nav-barbers"
            >
              Barbers
            </button>
            <button
              onClick={() => scrollTo('styles-section')}
              className="text-xs font-semibold uppercase tracking-widest text-stone-700 hover:text-[#233A30] transition cursor-pointer"
              id="nav-styles"
            >
              Styles
            </button>
            <button
              onClick={() => scrollTo('live-queue-section')}
              className="relative text-xs font-semibold uppercase tracking-widest text-[#233A30] hover:text-black transition flex items-center gap-1.5 cursor-pointer"
              id="nav-live-queue"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Queue
            </button>
            <button
              onClick={() => scrollTo('visit-section')}
              className="text-xs font-semibold uppercase tracking-widest text-stone-700 hover:text-[#233A30] transition cursor-pointer"
              id="nav-visit"
            >
              Visit
            </button>
          </nav>

          {/* Action Buttons: Book Button + Manager Desk (Always directly visible) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => scrollTo('booking-section')}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl bg-[#233A30] hover:bg-[#192B23] text-amber-50 text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              id="header-book-appointment-btn"
            >
              <Scissors className="w-3.5 h-3.5 text-amber-300" />
              <span>Book Appointment</span>
            </button>

            <button
              onClick={onOpenManager}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2.5 rounded-xl border text-[11px] sm:text-xs font-semibold tracking-wide transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                isManagerLoggedIn
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                  : 'border-stone-300 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900'
              }`}
              id="header-manager-desk-btn"
              title="Manager Access Desk"
            >
              <Shield className={`w-3.5 h-3.5 ${isManagerLoggedIn ? 'text-emerald-700' : 'text-stone-500'}`} />
              <span className="hidden sm:inline">{isManagerLoggedIn ? 'Manager Dashboard' : 'Manager Desk'}</span>
              <span className="sm:hidden">Manager</span>
            </button>
          </div>
        </div>
      </div>

      {/* Direct Desktop-Style Navigation Sub-Bar (always visible on mobile/tablets so desktop nav isn't hidden) */}
      <div className="md:hidden border-t border-stone-200/70 bg-[#FAF8F5] px-3 py-2 flex items-center justify-around gap-2 text-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => scrollTo('services-section')}
          className="text-[11px] font-semibold uppercase tracking-wider text-stone-700 hover:text-[#233A30] transition cursor-pointer px-1 py-0.5"
        >
          Services
        </button>
        <span className="text-stone-300">·</span>
        <button
          onClick={() => scrollTo('barbers-section')}
          className="text-[11px] font-semibold uppercase tracking-wider text-stone-700 hover:text-[#233A30] transition cursor-pointer px-1 py-0.5"
        >
          Barbers
        </button>
        <span className="text-stone-300">·</span>
        <button
          onClick={() => scrollTo('styles-section')}
          className="text-[11px] font-semibold uppercase tracking-wider text-stone-700 hover:text-[#233A30] transition cursor-pointer px-1 py-0.5"
        >
          Styles
        </button>
        <span className="text-stone-300">·</span>
        <button
          onClick={() => scrollTo('live-queue-section')}
          className="text-[11px] font-semibold uppercase tracking-wider text-[#233A30] flex items-center gap-1 transition cursor-pointer font-bold px-1 py-0.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Queue
        </button>
        <span className="text-stone-300">·</span>
        <button
          onClick={() => scrollTo('visit-section')}
          className="text-[11px] font-semibold uppercase tracking-wider text-stone-700 hover:text-[#233A30] transition cursor-pointer px-1 py-0.5"
        >
          Visit
        </button>
      </div>
    </header>
  );
};
