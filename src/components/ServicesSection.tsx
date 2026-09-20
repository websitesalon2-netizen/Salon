import React from 'react';
import { Clock, Scissors, ArrowRight, Sparkles } from 'lucide-react';
import type { Service } from '../types';

interface ServicesSectionProps {
  services: Service[];
  onSelectService: (serviceId: string) => void;
  title?: string;
  subtitle?: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectService,
  title,
  subtitle
}) => {
  return (
    <section id="services-section" className="py-20 bg-stone-50/70 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#233A30]/10 text-[#233A30] text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Treatments</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            {title || 'Signature Grooming & Services'}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {subtitle || 'Every appointment begins with warm consultation and ends with tailored styling. All treatments are performed using premium Kashmiri herbal botanicals.'}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl sm:rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md hover:border-stone-300 transition-all duration-300 flex flex-col group"
            >
              {/* Service Image */}
              <div className="relative h-36 sm:h-52 w-full overflow-hidden bg-stone-100">
                <img
                  src={service.image_url || 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80'}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
                
                {/* Price and duration pill badge */}
                <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 flex items-center justify-between gap-1">
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/75 backdrop-blur-md text-amber-300 text-[10px] sm:text-xs font-bold tracking-wide">
                    ₹{service.price_inr}
                  </span>
                  <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-800 text-[9px] sm:text-[11px] font-semibold tracking-wide flex items-center gap-1 shadow-sm">
                    <Clock className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-[#2D4E40]" />
                    {service.duration_min} min
                  </span>
                </div>
              </div>

              {/* Service Details */}
              <div className="p-3 sm:p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="font-serif text-sm sm:text-lg font-bold text-stone-900 leading-snug group-hover:text-[#233A30] transition line-clamp-1">
                    {service.name}
                  </h3>
                  <p className="text-stone-600 text-[11px] sm:text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1">
                  <span className="text-[10px] sm:text-xs text-stone-500 font-medium truncate">
                    ₹{service.price_inr} · {service.duration_min}m
                  </span>
                  <button
                    type="button"
                    id={`book-service-${service.id}`}
                    onClick={() => onSelectService(service.id)}
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#233A30]/10 hover:bg-[#233A30] text-[#233A30] hover:text-white text-[10px] sm:text-xs font-semibold tracking-wide transition cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
