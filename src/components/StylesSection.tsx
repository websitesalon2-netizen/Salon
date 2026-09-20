import React from 'react';
import { Camera, Sparkles } from 'lucide-react';
import type { HaircutStyle } from '../types';

interface StylesSectionProps {
  styles: HaircutStyle[];
  onBookStyle?: (styleName: string) => void;
  title?: string;
  subtitle?: string;
}

export const StylesSection: React.FC<StylesSectionProps> = ({ styles, onBookStyle, title, subtitle }) => {
  return (
    <section id="styles-section" className="py-20 bg-stone-50/70 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#233A30]/10 text-[#233A30] text-xs font-bold tracking-widest uppercase">
            <Camera className="w-3.5 h-3.5" />
            <span>Lookbook & Portfolio</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            {title || 'Popular Haircut Styles & Scissor Work'}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {subtitle || 'From classic gentlemen’s contours to crisp skin fades and traditional Kashmiri beard sculpts. Pick your signature aesthetic.'}
          </p>
        </div>

        {/* Styles Grid */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
          {styles.map((style) => (
            <div
              key={style.id}
              className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 shadow-xs hover:shadow-lg transition-all duration-300 aspect-3/4 flex flex-col justify-end"
            >
              <img
                src={style.image_url}
                alt={style.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-90 group-hover:opacity-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              
              <div className="relative p-2 sm:p-4 text-white z-10">
                <span className="text-[8px] sm:text-[10px] tracking-widest uppercase text-amber-300/90 font-medium block">
                  Pampore Cut
                </span>
                <h3 className="font-serif text-xs sm:text-base font-bold leading-tight mt-0.5 line-clamp-1 sm:line-clamp-2 text-stone-100">
                  {style.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
