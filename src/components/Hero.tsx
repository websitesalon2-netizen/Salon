import React from 'react';
import { Scissors, Users, Sparkles, Clock, ArrowRight } from 'lucide-react';
import type { BusinessInfo } from '../types';

interface HeroProps {
  business: BusinessInfo;
  barberCount: number;
  serviceCount: number;
  onBookClick: () => void;
  onQueueClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  business,
  barberCount,
  serviceCount,
  onBookClick,
  onQueueClick
}) => {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-24 border-b border-stone-200/70">
      {/* Subtle Kashmir walnut & chinar background accents */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#E5EFEA]/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#EBE5D8]/70 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Content */}
          <div className="w-full lg:col-span-7 space-y-4 sm:space-y-6 lg:space-y-8 text-left">
            {/* Location Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#233A30]/10 border border-[#233A30]/20 text-[#233A30] text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#233A30]" />
              <span>{business.region_badge || 'Pampore · Kashmir'}</span>
              <span className="text-stone-400">|</span>
              <span className="text-stone-600 font-normal capitalize">{business.location_badge || 'Frestabal, Pampore'}</span>
            </div>

            {/* Headline */}
            <div className="space-y-2 sm:space-y-3">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-[1.15]">
                {business.hero_headline || (
                  <>
                    Traditional Craftsmanship,{' '}
                    <span className="text-[#2D4E40] italic font-normal block sm:inline">Modern Precision</span>
                  </>
                )}
              </h1>
              <p className="text-stone-600 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed font-normal">
                {business.hero_description ||
                  business.description ||
                  'Experience the timeless ritual of royal Kashmiri hot towel shaves, bespoke scissor architecture, and revitalizing walnut oil scalp therapies along the serene saffron fields of Pampore.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onBookClick}
                id="hero-book-btn"
                className="flex-1 sm:flex-initial px-5 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-[#233A30] hover:bg-[#182B22] text-amber-50 text-xs sm:text-sm font-semibold tracking-wider uppercase transition shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer group whitespace-nowrap"
              >
                <Scissors className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4 text-amber-300/80 group-hover:translate-x-1 transition-transform hidden sm:inline-block" />
              </button>

              <button
                onClick={onQueueClick}
                id="hero-queue-btn"
                className="flex-1 sm:flex-initial px-4 sm:px-7 py-3.5 sm:py-4 rounded-xl border-2 border-stone-300 bg-white/90 hover:bg-stone-50 text-stone-800 text-xs sm:text-sm font-semibold tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer shadow-sm whitespace-nowrap"
              >
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Check Live Queue</span>
              </button>
            </div>

            {/* Small Statistics Cards */}
            <div className="pt-4 sm:pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-2 sm:gap-4 text-left">
              <div className="bg-white/80 border border-stone-200/80 rounded-xl p-2.5 sm:p-3.5 shadow-xs">
                <div className="flex items-center gap-1.5 text-stone-500 mb-1">
                  <Users className="w-3.5 h-3.5 text-[#2D4E40] shrink-0" />
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-stone-500 truncate">Barbers</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-lg sm:text-2xl font-bold text-stone-900">{barberCount}</span>
                  <span className="text-[10px] sm:text-xs text-emerald-700 font-medium truncate">On Duty</span>
                </div>
              </div>

              <div className="bg-white/80 border border-stone-200/80 rounded-xl p-2.5 sm:p-3.5 shadow-xs">
                <div className="flex items-center gap-1.5 text-stone-500 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#2D4E40] shrink-0" />
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-stone-500 truncate">Services</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-lg sm:text-2xl font-bold text-stone-900">{serviceCount}</span>
                  <span className="text-[10px] sm:text-xs text-stone-600 font-medium truncate">Rituals</span>
                </div>
              </div>

              <div className="bg-white/80 border border-stone-200/80 rounded-xl p-2.5 sm:p-3.5 shadow-xs">
                <div className="flex items-center gap-1.5 text-stone-500 mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#2D4E40] shrink-0" />
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-stone-500 truncate">Lounge</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-xs sm:text-sm font-bold text-stone-900 truncate">Zero Wait</span>
                  <span className="text-[10px] sm:text-xs text-stone-500 truncate hidden sm:inline">Live</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Showcase */}
          <div className="w-full lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl border-4 border-white aspect-4/3 sm:aspect-4/5 bg-stone-900 group">
                <img
                  src={business.hero_image_url || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80'}
                  alt={business.name || 'Traditional grooming ritual in Pampore salon'}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-90"
                  referrerPolicy="no-referrer"
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Overlaid salon credential card */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 rounded-xl bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-lg">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-stone-900 tracking-wide truncate">
                        {business.name || 'Jawed Habib'}
                      </p>
                      <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5 truncate">
                        {business.hero_caption || `${business.location_badge || 'Frestabal, Pampore'} · Open until 8:30 PM`}
                      </p>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      <span>Live Queue Open</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
