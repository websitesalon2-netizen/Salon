import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, ExternalLink, Navigation } from 'lucide-react';
import type { BusinessInfo } from '../types';

interface VisitSectionProps {
  business: BusinessInfo;
}

export const VisitSection: React.FC<VisitSectionProps> = ({ business }) => {
  // Compute Google Maps Link: either map_url or generated search link from address
  const googleMapsLink = business.map_url && business.map_url.trim()
    ? business.map_url
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        business.address || 'Frestabal, Pampore, Jammu and Kashmir'
      )}`;

  // Clean numbers for WhatsApp and Tel
  const cleanPhone = (business.phone || '').replace(/[^0-9+]/g, '');
  const cleanWhatsApp = (business.whatsapp || business.phone || '').replace(/[^0-9]/g, '');

  return (
    <section id="visit-section" className="py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#233A30]/10 text-[#233A30] text-xs font-bold tracking-widest uppercase">
            <Navigation className="w-3.5 h-3.5" />
            <span>Salon Sanctuary</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            {business.visit_title || 'Visit Us in Pampore'}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {business.visit_subtitle || 'Situated in Kadlabal near Saffron Town. Easy parking and serene Kashmiri hospitality await you.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Column: Contact Cards */}
          <div className="md:col-span-6 space-y-4 flex flex-col justify-between">
            
            {/* Clickable Address Card -> Google Maps in new tab */}
            <a
              href={googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-[#233A30] hover:shadow-md transition group block"
              id="visit-address-link"
              title="Open location on Google Maps"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#233A30]/10 text-[#233A30] flex items-center justify-center flex-shrink-0 group-hover:bg-[#233A30] group-hover:text-white transition">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                      Salon Address (Click for Navigation)
                    </span>
                    <p className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#233A30] transition mt-1">
                      {business.address || 'Kadlabal, Near Saffron Market, Pampore, J&K 192121'}
                    </p>
                    <p className="text-xs text-[#233A30] font-semibold mt-1 flex items-center gap-1">
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </p>
                  </div>
                </div>
              </div>
            </a>

            {/* Operating Hours Card */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#233A30]/10 text-[#233A30] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                    Operating Lounge Hours
                  </span>
                  <p className="font-medium text-stone-900 text-sm sm:text-base mt-1">
                    {business.hours || 'Monday – Sunday: 9:30 AM – 8:30 PM'}
                  </p>
                  {business.friday_break !== '' && (
                    <p className="text-xs text-stone-500 mt-0.5">
                      {business.friday_break || 'Friday Jummah prayers break: 12:30 PM – 2:30 PM'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Phone & WhatsApp Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`tel:${cleanPhone}`}
                id="visit-phone-link"
                className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-[#233A30] hover:shadow-sm transition flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-800 group-hover:text-white transition">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block">
                    Telephone Call
                  </span>
                  <span className="font-bold text-stone-900 text-sm group-hover:text-[#233A30]">
                    {business.phone || '+91 94190 12345'}
                  </span>
                </div>
              </a>

              <a
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                id="visit-whatsapp-btn"
                className="p-5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366] hover:text-white transition flex items-center gap-3.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:text-[#25D366] transition">
                  <MessageSquare className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-600 group-hover:text-white/90 block">
                    WhatsApp Chat
                  </span>
                  <span className="font-bold text-stone-900 text-sm group-hover:text-white">
                    {business.whatsapp || '+91 94190 12345'}
                  </span>
                </div>
              </a>
            </div>

          </div>

          {/* Right Column: Visual Map Card */}
          <div className="md:col-span-6">
            <div className="h-full min-h-[340px] rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 relative group flex flex-col justify-between shadow-xs">
              {/* Stylized background image representing Pampore surroundings */}
              <img
                src={business.visit_image_url || 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80'}
                alt={business.name || 'Pampore Kashmir surroundings'}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

              <div className="relative p-6 text-white z-10">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wider uppercase inline-block">
                  Pampore Destination
                </span>
                <h3 className="font-serif text-2xl font-bold mt-2 text-amber-100">
                  {business.name || 'Kashmir Grooming Lounge'}
                </h3>
                <p className="text-xs text-stone-200 mt-1 max-w-sm">
                  Walk-ins and reservations welcomed daily in Kadlabal, Saffron Town Pampore.
                </p>
              </div>

              <div className="relative p-6 z-10">
                <a
                  href={googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-white text-stone-900 hover:bg-stone-100 text-xs font-semibold tracking-wider uppercase shadow-md transition"
                >
                  <MapPin className="w-4 h-4 text-[#233A30]" />
                  <span>Navigate with Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
