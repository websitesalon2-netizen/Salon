import React from 'react';
import { Shield, MessageCircle, Heart, Terminal } from 'lucide-react';
import type { BusinessInfo } from '../types';

interface FooterProps {
  business: BusinessInfo;
  onOpenManager: () => void;
  onOpenDeveloper?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ business, onOpenManager, onOpenDeveloper }) => {
  // WhatsApp developer link (configurable via Developer Desk)
  const devPhone = (business.developer_whatsapp || '919622229622').replace(/[^0-9]/g, '');
  const developerWhatsAppLink = `https://wa.me/${devPhone}?text=${encodeURIComponent('hello, i want to discuss about website for my business.')}`;

  return (
    <footer className="bg-[#182B22] text-stone-300 border-t border-[#233A30]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#233A30]/60">
          
          {/* Logo & Dynamic Name */}
          <div className="flex items-center gap-3 text-center md:text-left">
            {business.logo_url ? (
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#3A594C] bg-white flex items-center justify-center">
                <img
                  src={business.logo_url}
                  alt={business.name || 'Salon Logo'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-lg bg-[#233A30] text-amber-200 flex items-center justify-center font-serif text-lg font-bold border border-[#3A594C]">
                {business.logo_text || (business.name ? business.name.charAt(0) : 'K')}
              </div>
            )}
            <div>
              <span className="font-serif text-lg font-bold text-white block">
                {business.name || 'Kashmir Grooming Lounge'}
              </span>
              <span className="text-[11px] text-stone-400">
                {business.region_badge || 'Pampore · Jammu & Kashmir'}
              </span>
            </div>
          </div>

          {/* Quick links & Manager Desk */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-300">
            <a
              href="#services-section"
              className="hover:text-amber-200 transition"
            >
              Services
            </a>
            <a
              href="#barbers-section"
              className="hover:text-amber-200 transition"
            >
              Barbers
            </a>
            <a
              href="#styles-section"
              className="hover:text-amber-200 transition"
            >
              Styles
            </a>
            <a
              href="#live-queue-section"
              className="hover:text-amber-200 transition"
            >
              Live Queue
            </a>
            <a
              href="#visit-section"
              className="hover:text-amber-200 transition"
            >
              Visit
            </a>

            <button
              type="button"
              id="footer-manager-desk-btn"
              onClick={onOpenManager}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#233A30] hover:bg-[#2F4D40] text-amber-100 text-xs font-semibold transition border border-[#3A594C] cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>Manager Desk</span>
            </button>

            {onOpenDeveloper && (
              <button
                type="button"
                id="footer-dev-desk-btn"
                onClick={onOpenDeveloper}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-mono font-medium transition border border-emerald-500/50 cursor-pointer shadow-xs"
                title="Open Developer Desk (Edit anything on website)"
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Developer Desk</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            © 2026 {business.name || 'Kashmir Grooming Lounge'}. All rights reserved.
          </div>

          <div className="flex items-center gap-2">
            <span>Crafted with care ·</span>
            <a
              href={developerWhatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              id="footer-developer-link"
              className="inline-flex items-center gap-1 text-amber-300 hover:text-white font-semibold transition underline underline-offset-4 decoration-amber-300/40 hover:decoration-white"
              title={`Chat with ${business.developer_name || 'Developer Shujaat'} on WhatsApp`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{business.developer_name || 'Developed by Shujaat'}</span>
            </a>
            {onOpenDeveloper && (
              <>
                <span className="text-stone-600">·</span>
                <button
                  type="button"
                  onClick={onOpenDeveloper}
                  className="text-stone-500 hover:text-emerald-300 font-mono text-[11px] transition cursor-pointer"
                  title="Direct Developer Access"
                >
                  [CMS]
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
