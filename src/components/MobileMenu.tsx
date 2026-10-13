import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { X, Phone, MapPin, ChevronRight } from 'lucide-react';
import SERVICES from '../data/services';
import SERVICE_AREAS from '../data/serviceAreas';

/** Full-screen navigation for phones (the desktop header shows links inline). */
export default function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const rowClass =
    'flex items-center justify-between py-4 border-b border-white/10 font-display font-bold text-xl uppercase tracking-tight';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[110] bg-[#0a0a0a] text-white flex flex-col md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-white/60">Menu</span>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 pb-8">
            <Link to="/" onClick={onClose} className={rowClass}>
              Home <ChevronRight className="w-5 h-5 text-white/30" />
            </Link>
            {/* Plain link so the browser scrolls to the section, from any page */}
            <a href="/#recovery" onClick={onClose} className={rowClass}>
              Car Got Towed? <ChevronRight className="w-5 h-5 text-white/30" />
            </a>
            <Link to="/blog" onClick={onClose} className={rowClass}>
              News & Tips <ChevronRight className="w-5 h-5 text-white/30" />
            </Link>

            <p className="font-mono text-xs font-bold uppercase tracking-widest text-white/40 mt-8 mb-1">Services</p>
            {SERVICES.map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`} onClick={onClose} className={rowClass}>
                {s.name} <ChevronRight className="w-5 h-5 text-white/30" />
              </Link>
            ))}

            <p className="font-mono text-xs font-bold uppercase tracking-widest text-white/40 mt-8 mb-3">Service Areas</p>
            <div className="flex flex-wrap gap-2">
              {SERVICE_AREAS.map((c) => (
                <Link
                  key={c.slug}
                  to={`/towing/${c.slug}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-4 py-3 font-mono text-sm"
                >
                  <MapPin className="w-3.5 h-3.5 text-[var(--blue)]" />
                  {c.name}
                </Link>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-white/10">
            <a
              href="tel:9712227994"
              className="min-h-[60px] rounded-2xl flex items-center justify-center gap-3 bg-[var(--orange)] text-white font-display font-bold uppercase tracking-wider text-lg"
            >
              <Phone className="w-5 h-5" />
              Call (971) 222-7994
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
