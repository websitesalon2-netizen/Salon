import React from 'react';
import { Users, Clock, Scissors, Award, ArrowRight } from 'lucide-react';
import type { Barber } from '../types';

interface BarbersSectionProps {
  barbers: Barber[];
  barberQueues: Record<string, { waitingCount: number; currentServing?: string }>;
  onSelectBarber: (barberId: string) => void;
  title?: string;
  subtitle?: string;
}

export const BarbersSection: React.FC<BarbersSectionProps> = ({
  barbers,
  barberQueues,
  onSelectBarber,
  title,
  subtitle
}) => {
  return (
    <section id="barbers-section" className="py-20 bg-[#FAF8F5] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#233A30]/10 text-[#233A30] text-xs font-bold tracking-widest uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>Master Craftsmen</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            {title || 'Meet Pampore’s Dedicated Barbers'}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {subtitle || 'Honoring generations of Kashmiri grooming heritage. Each master barber brings specialized scissors precision, razor craftsmanship, and relaxed hospitality.'}
          </p>
        </div>

        {/* Barbers Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {barbers.map((barber) => {
            const queueInfo = barberQueues[barber.id] || { waitingCount: 0 };

            return (
              <div
                key={barber.id}
                className="bg-white rounded-xl sm:rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo with live queue status overlay */}
                  <div className="relative aspect-4/5 w-full overflow-hidden bg-stone-100">
                    <img
                      src={barber.image_url || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&q=80'}
                      alt={barber.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />

                    {/* Live queue status badge */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                      {queueInfo.currentServing ? (
                        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[9px] sm:text-[11px] font-medium shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Chair Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-stone-200 text-[9px] sm:text-[11px] font-medium shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Ready
                        </span>
                      )}
                    </div>

                    {/* Barber Name and Specialty over image */}
                    <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 text-white">
                      <h3 className="font-serif text-sm sm:text-lg font-bold leading-snug tracking-tight truncate">
                        {barber.name}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-amber-200/90 font-medium truncate mt-0.5">
                        {barber.specialty}
                      </p>
                    </div>
                  </div>

                  {/* Bio & Details */}
                  <div className="p-2.5 sm:p-4 space-y-2 sm:space-y-3">
                    <p className="text-stone-600 text-[11px] sm:text-xs leading-relaxed line-clamp-2 sm:line-clamp-3">
                      {barber.bio}
                    </p>

                    {/* Current Queue Information */}
                    <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-stone-50 border border-stone-200/70 text-[10px] sm:text-xs space-y-1">
                      <div className="flex items-center justify-between font-medium">
                        <span className="text-stone-500 flex items-center gap-1 truncate">
                          <Clock className="w-3 h-3 text-[#2D4E40]" /> Queue:
                        </span>
                        <span className={queueInfo.waitingCount > 0 ? 'text-amber-800 font-semibold truncate' : 'text-emerald-700 font-semibold truncate'}>
                          {queueInfo.waitingCount > 0
                            ? `${queueInfo.waitingCount} waiting`
                            : 'No wait'}
                        </span>
                      </div>
                      {queueInfo.currentServing && (
                        <div className="text-[9px] sm:text-[11px] text-stone-500 truncate">
                          Serving: <span className="font-medium text-stone-700">{queueInfo.currentServing}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Booking Option Button */}
                <div className="p-2.5 sm:p-4 pt-0">
                  <button
                    type="button"
                    id={`book-with-barber-${barber.id}`}
                    onClick={() => onSelectBarber(barber.id)}
                    className="w-full py-1.5 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-[#233A30] hover:bg-[#182B22] text-amber-50 text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition shadow-xs flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer"
                  >
                    <span>Choose Barber</span>
                    <ArrowRight className="w-3 h-3 text-amber-300" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
