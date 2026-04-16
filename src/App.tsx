import React, { useState, useEffect } from 'react';
import { Car, Truck, AlertTriangle, Zap, Power, Phone, MapPin, Loader2, Crosshair, FileSignature, ListChecks, Map, Banknote, X, ChevronDown, Instagram, Facebook, Sun, Moon, Camera, CheckCircle2, ImagePlus, ArrowLeft, Upload } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const Marquee = ({ text }: { text: string }) => {
  const content = [...Array(5)].map((_, i) => (
    <span key={i} className="flex items-center gap-8 mx-4">
      {text} <AlertTriangle className="w-4 h-4 text-[var(--orange)]" />
    </span>
  ));

  return (
    <div className="overflow-hidden whitespace-nowrap py-3 border-y border-[var(--border)] bg-[var(--blue)] text-white flex items-center relative z-20 w-full">
      <motion.div
        className="flex font-mono text-sm uppercase tracking-widest font-bold"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        style={{ width: "fit-content" }}
      >
        <div className="flex">{content}</div>
        <div className="flex">{content}</div>
      </motion.div>
    </div>
  );
};

const OneClickDispatch = ({ className = "", isPulse = false }: { className?: string, isPulse?: boolean }) => {
  const [isLocating, setIsLocating] = useState(false);

  const handleDispatch = () => {
    const phoneNumber = "+19712227994";
    const fallbackCall = () => {
      window.location.href = `tel:${phoneNumber}`;
    };

    if (!navigator.geolocation) {
      fallbackCall();
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        const message = `I need a tow! My exact location is: ${mapsLink}`;
        
        // Handle iOS vs Android SMS URI formatting
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        const separator = isIOS ? '&' : '?';
        
        window.location.href = `sms:${phoneNumber}${separator}body=${encodeURIComponent(message)}`;
      },
      (error) => {
        console.warn("Geolocation failed or denied:", error);
        setIsLocating(false);
        fallbackCall(); // Graceful fallback to phone call
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <button 
      onClick={handleDispatch}
      disabled={isLocating}
      className={`flex items-center justify-center gap-3 font-display font-bold uppercase tracking-wider transition-colors duration-500 disabled:opacity-80 disabled:cursor-not-allowed ${isPulse ? 'pulse-button' : ''} ${className}`}
    >
      {isLocating ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Locating...
        </>
      ) : (
        <>
          <Crosshair className="w-5 h-5" />
          1-Click Dispatch
        </>
      )}
    </button>
  );
};

const PhoneNumber = () => {
  const number = "971:222:7994";
  return (
    <div className="flex justify-between items-baseline font-display font-bold text-[12vw] sm:text-[13vw] md:text-[14vw] lg:text-[11vw] xl:text-[12vw] leading-[0.8] tracking-tighter uppercase w-full cursor-crosshair">
      {number.split('').map((char, i) => {
        const isColon = char === ':';
        const hoverColorClass = isColon ? '' : (i % 2 === 0 ? 'hover:text-[var(--blue)]' : 'hover:text-[var(--orange)]');
        const baseColorClass = isColon ? 'text-[var(--fg)] opacity-20' : 'text-[var(--fg)]';
        
        return (
          <motion.span
            key={i}
            whileHover={{ 
              y: isColon ? 0 : -20, 
              scale: isColon ? 1 : 1.1
            }}
            className={`transition-all duration-200 inline-block ${baseColorClass} ${hoverColorClass}`}
          >
            {char}
          </motion.span>
        );
      })}
    </div>
  );
};

const JunkCarQuoteFlow = () => {
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState({ year: '', make: '', model: '' });
  const [photos, setPhotos] = useState<{ front: string | null; side: string | null; damage: string | null }>({
    front: null,
    side: null,
    damage: null
  });

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>, view: 'front' | 'side' | 'damage') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setPhotos(prev => ({ ...prev, [view]: url }));
    }
  };

  const submitQuote = () => {
    const formData = new FormData();
    formData.append('year', details.year);
    formData.append('make', details.make);
    formData.append('model', details.model);
    formData.append('front', photos.front || '');
    formData.append('side', photos.side || '');
    formData.append('damage', photos.damage || '');
    console.log("Submitting quote:", formData);
    setStep(6);
  };

  if (step === 0) {
    return (
      <motion.div layoutId="junk-car-card" className="bg-[var(--orange)] rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-8 relative overflow-hidden group shadow-lg h-full border border-transparent">
        <div className="absolute -right-4 -top-4 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
          <Banknote className="w-32 h-32" />
        </div>
        <div className="relative z-10 font-sans">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
            <Banknote className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight mb-2">Sell Junk Car<br/>For Cash</h4>
          <p className="font-mono text-sm text-white/80">Get an instant quote by uploading 3 photos.</p>
        </div>
        <button 
          onClick={() => setStep(1)}
          className="relative z-10 w-full bg-black text-white rounded-full py-4 font-bold text-sm uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg">
          Get Quote
        </button>
      </motion.div>
    );
  }

  const isDetailsComplete = details.year && details.make && details.model;

  return (
    <motion.div layoutId="junk-car-card" className="bg-[#1a1a1a] rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden md:col-span-2 shadow-[0_0_40px_rgba(255,85,0,0.1)] border border-[var(--orange)]/30 font-sans min-h-[400px]">
      <button onClick={() => setStep(0)} className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors z-20 flex items-center gap-2">
        <ArrowLeft className="w-5 h-5" />
        <span className="font-mono text-xs uppercase tracking-widest hidden sm:block">Cancel</span>
      </button>

      <div className="w-full max-w-md relative z-10 flex flex-col h-full justify-center">
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 w-full">
              <div className="text-center mb-4">
                <h3 className="font-display font-bold text-3xl text-white mb-2">Vehicle Details</h3>
                <p className="font-mono text-white/60 text-sm">Step 1 of 4</p>
              </div>
              <input type="text" placeholder="Year" value={details.year} onChange={e => setDetails({...details, year: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl h-16 px-6 text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-[var(--orange)] transition-colors" />
              <input type="text" placeholder="Make (e.g. Honda)" value={details.make} onChange={e => setDetails({...details, make: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl h-16 px-6 text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-[var(--orange)] transition-colors" />
              <input type="text" placeholder="Model (e.g. Civic)" value={details.model} onChange={e => setDetails({...details, model: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl h-16 px-6 text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-[var(--orange)] transition-colors" />
              <button 
                disabled={!isDetailsComplete}
                onClick={() => setStep(2)}
                className={`w-full h-16 rounded-2xl font-bold uppercase tracking-wider transition-all mt-4 ${isDetailsComplete ? 'bg-[var(--orange)] text-white hover:scale-105 active:scale-95' : 'bg-white/5 text-white/20'}`}>
                Next Step
              </button>
            </motion.div>
          )}

          {[2, 3, 4].includes(step) && (
            <motion.div key={`step${step}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 items-center text-center w-full">
              <div className="mb-4">
                <h3 className="font-display font-bold text-3xl text-white mb-2">
                  {step === 2 ? 'Front View' : step === 3 ? 'Side View' : 'Damage / Interior'}
                </h3>
                <p className="font-mono text-white/60 text-sm">Step {step} of 4</p>
              </div>

              {((step === 2 && photos.front) || (step === 3 && photos.side) || (step === 4 && photos.damage)) ? (
                <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden relative border-2 border-[var(--orange)] shadow-lg bg-black">
                  <img src={step === 2 ? photos.front! : step === 3 ? photos.side! : photos.damage!} alt="Preview" className="w-full h-full object-contain" />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent flex justify-center">
                    <label htmlFor={`photo-${step}`} className="cursor-pointer bg-black/50 backdrop-blur px-6 py-3 rounded-full text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-black transition-colors">
                      <Camera className="w-4 h-4" /> Retake
                    </label>
                  </div>
                </div>
              ) : (
                <label htmlFor={`photo-${step}`} className="w-full aspect-[4/3] bg-white/5 hover:bg-white/10 border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors group">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-[var(--orange)]">
                    <Camera className="w-10 h-10 text-white/50 group-hover:text-white" />
                  </div>
                  <span className="font-bold text-xl text-white/50 group-hover:text-white">Tap to Open Camera</span>
                </label>
              )}
              
              <input 
                id={`photo-${step}`}
                type="file" 
                accept="image/*" 
                capture="environment" 
                onChange={(e) => handlePhotoCapture(e, step === 2 ? 'front' : step === 3 ? 'side' : 'damage')}
                className="hidden" 
              />

              <button 
                disabled={!(step === 2 ? photos.front : step === 3 ? photos.side : photos.damage)}
                onClick={() => setStep(step + 1)}
                className={`w-full h-16 rounded-2xl font-bold uppercase tracking-wider transition-all mt-4 ${
                  (step === 2 && photos.front) || (step === 3 && photos.side) || (step === 4 && photos.damage) 
                    ? 'bg-[var(--orange)] text-white hover:scale-105 active:scale-95' 
                    : 'bg-white/5 text-white/20'}`}>
                {step === 4 ? 'Review Quote' : 'Next Step'}
              </button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 w-full text-center">
              <div>
                <h3 className="font-display font-bold text-3xl text-white mb-2">Review & Submit</h3>
                <p className="font-mono text-white/60 text-sm uppercase">{details.year} {details.make} {details.model}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="aspect-square rounded-2xl overflow-hidden relative bg-black">
                  <img src={photos.front!} className="object-cover w-full h-full" alt="Front" />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur rounded px-2 py-1 text-[8px] font-mono font-bold text-white uppercase tracking-widest">Front</div>
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden relative bg-black">
                  <img src={photos.side!} className="object-cover w-full h-full" alt="Side" />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur rounded px-2 py-1 text-[8px] font-mono font-bold text-white uppercase tracking-widest">Side</div>
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden relative bg-black">
                  <img src={photos.damage!} className="object-cover w-full h-full" alt="Damage" />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur rounded px-2 py-1 text-[8px] font-mono font-bold text-white uppercase tracking-widest">Damage</div>
                </div>
              </div>

              <button 
                onClick={submitQuote}
                className="w-full h-16 rounded-2xl bg-[var(--orange)] text-white font-bold uppercase tracking-wider hover:scale-105 active:scale-95 transition-all mt-4 flex items-center justify-center gap-3">
                <Upload className="w-5 h-5" /> Submit For Instant Quote
              </button>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="step6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center gap-6 w-full py-8">
              <div className="w-24 h-24 bg-[#00ff88]/20 rounded-full flex items-center justify-center text-[#00ff88] mb-2">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div>
                <h3 className="font-display font-bold text-3xl text-white mb-2">Quote Requested!</h3>
                <p className="font-mono text-white/60 text-sm max-w-[250px] mx-auto">We're reviewing your photos. You'll receive an instant cash offer momentarily.</p>
              </div>
              <button 
                onClick={() => setStep(0)}
                className="w-full h-16 rounded-2xl bg-white/10 text-white font-bold uppercase tracking-wider hover:bg-white/20 transition-all mt-4">
                Done
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const RecoveryHub = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Main Entry Button */}
      <div className="border-t border-[var(--border)] bg-[#0a0a0a] text-white relative z-10">
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full text-left p-8 md:p-16 hover:bg-[var(--blue)] transition-colors duration-500 group flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <h2 className="font-display font-bold text-3xl md:text-5xl uppercase tracking-tighter mb-2 group-hover:text-white transition-colors">
              Vehicle Recovery & Junk Car Hub
            </h2>
            <p className="font-mono text-sm md:text-base text-white/60 group-hover:text-white/90 transition-colors">
              Options for picking up, releasing, or selling a vehicle.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 group-hover:bg-white/20 px-6 py-3 rounded-full border border-white/10 transition-all duration-300">
            <span className="font-mono text-xs md:text-sm font-bold uppercase tracking-widest text-white/80 group-hover:text-white">
              View Options
            </span>
            <div className="w-8 h-8 bg-white/10 group-hover:bg-white rounded-full flex items-center justify-center group-hover:text-[var(--blue)] transition-colors">
              <Crosshair className="w-4 h-4" />
            </div>
          </div>
        </button>
      </div>

      {/* Modal UI */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 md:p-6 overflow-y-auto"
          >
            <motion.div 
              initial={{ y: 40, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-[#0f0f0f] w-full max-w-4xl relative flex flex-col my-auto rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 md:p-8 pb-4">
                <div>
                  <h3 className="font-display font-bold text-3xl text-white tracking-tight">Recovery Hub</h3>
                  <p className="font-mono text-sm text-white/50 mt-1">Concierge Services</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Bento Grid Content */}
              <div className="p-6 md:p-8 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-[#0f0f0f]">
                
                {/* Option A: Release Form */}
                <div className="bg-[var(--blue)] rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-8 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
                    <FileSignature className="w-32 h-32" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                      <FileSignature className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight mb-2">Release<br/>Authorization</h4>
                    <p className="font-mono text-sm text-white/80">Authorize someone else to pick up your vehicle.</p>
                  </div>
                  <button className="relative z-10 w-full bg-white text-[var(--blue)] rounded-full py-4 font-bold text-sm uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg">
                    Digital Release Form
                  </button>
                </div>

                {/* Option D: Sell Junk Car with Native Wizard */}
                <JunkCarQuoteFlow />

                {/* Option B: Checklist */}
                <div className="bg-[#1a1a1a] rounded-3xl p-6 md:p-8 flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <ListChecks className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-display font-bold text-xl text-white">What to Bring</h4>
                  </div>
                  <div className="flex flex-col gap-3">
                    {[
                      "Valid Photo ID (License/Passport)",
                      "Proof of Ownership (Title/Reg)",
                      "Valid Insurance Policy",
                      "Payment (Cash/Card)"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-[var(--orange)] shrink-0" />
                        <span className="font-mono text-sm text-white/80">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Option C: Order Ride */}
                <div className="bg-white rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
                        <Map className="w-5 h-5 text-black" />
                      </div>
                      <h4 className="font-display font-bold text-xl text-black">Order a Ride</h4>
                    </div>
                    <div className="bg-black/5 p-4 rounded-2xl">
                      <p className="font-mono text-xs text-black/50 uppercase tracking-widest mb-1">Destination</p>
                      <p className="font-mono text-sm text-black font-bold">28901 SE Dodge Park Blvd</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-auto">
                    <button className="flex-1 bg-black text-white rounded-2xl py-4 font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors flex justify-center items-center gap-2">
                      Uber
                    </button>
                    <button className="flex-1 bg-[#FF00BF]/10 text-[#FF00BF] rounded-2xl py-4 font-bold text-sm uppercase tracking-wider hover:bg-[#FF00BF]/20 transition-colors flex justify-center items-center gap-2">
                      Lyft
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const HeroGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = Array.from({ length: 13 }, (_, i) => `/gallery/gallery${i + 1}.jpg`);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      <AnimatePresence>
        <motion.img
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.7, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700"
        />
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={`min-h-screen font-sans flex flex-col pb-24 md:pb-0 transition-colors duration-500 selection:bg-[var(--blue)] selection:text-white ${isDarkMode ? 'dark' : ''}`} style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      {/* Noise Texture Overlay */}
      <div className="pointer-events-none fixed inset-0 z-[100] h-full w-full opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Header */}
      <header className="sticky top-0 flex justify-between items-center p-4 md:px-6 border-b border-[var(--border)] relative z-50 bg-[var(--bg)]/80 backdrop-blur-md transition-colors duration-500">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          role="button"
          tabIndex={0}
          aria-label="Scroll to top"
        >
          <img src="/logo.png" alt="Tow Guys Logo" className="h-8 md:h-10 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
          <span className="hidden font-display font-bold uppercase tracking-widest text-sm md:text-base">Tow Guys</span>
        </div>
        
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-[var(--orange)] text-white border-[var(--orange)] shadow-[0_0_20px_rgba(255,85,0,0.4)]' 
              : 'bg-[var(--bg)] text-[var(--fg)] border-[var(--border)] hover:bg-[var(--blue)] hover:text-white hover:border-[var(--blue)]'
          }`}
        >
          {isDarkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      <Marquee text="24/7 DISPATCH • FAST RESPONSE • GRESHAM, OR • TOW GUYS" />

      {/* Hero Section */}
      <section className="flex flex-col border-b border-[var(--border)]">
        {/* Hero Banner Area */}
        <div className="relative flex flex-col overflow-hidden">
          {/* Background Image & Grid Lines */}
          <div className="absolute inset-0 pointer-events-none z-0">
          <img 
            src="/images/hero-bg.jpg" 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover object-bottom opacity-30 grayscale mix-blend-luminosity"
          />
          <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`border-r border-[var(--border)] transition-colors duration-500 ${i >= 4 ? 'hidden md:block' : ''}`} />
            ))}
          </div>
        </div>

        <div className="p-4 md:p-6 relative z-10 flex-1 flex flex-col justify-center py-12 md:py-24">
          <div className="flex justify-between text-[10px] md:text-xs font-mono opacity-60 uppercase tracking-widest mb-2 md:mb-4">
            <span>Area Code</span>
            <span>Prefix</span>
            <span>Line Number</span>
          </div>
          <PhoneNumber />
          <div className="mt-8 md:mt-12 flex flex-col gap-4">
            <p className="font-mono text-xs md:text-sm text-[var(--orange)] font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--orange)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--orange)]"></span>
              </span>
              Stranded? Tap here to find your location and get help fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <OneClickDispatch className="bg-[var(--blue)] text-white px-8 py-4 text-lg hover:bg-[var(--orange)] border border-transparent hover:border-[var(--orange)] shadow-[4px_4px_0px_0px_rgba(10,10,10,0.15)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] active:translate-y-1 active:shadow-none" />
              <a href="tel:9712227994" className="flex items-center gap-2 px-8 py-4 text-lg font-display font-bold uppercase tracking-wider border border-[var(--border)] hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors shadow-[4px_4px_0px_0px_rgba(10,10,10,0.15)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] active:translate-y-1 active:shadow-none">
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            </div>
          </div>
        </div>
        </div>

        {/* Recovery & Junk Car Hub */}
        <RecoveryHub />

        {/* Services Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-[var(--border)] relative z-10 bg-[var(--bg)] transition-colors duration-500">
          {[
            { title: "Towing", desc: "24/7, Holiday, Emergency", time: "24:00", icon: Truck },
            { title: "Roadside", desc: "Jump starts, Lockouts", time: "ASAP", icon: Zap },
            { title: "Recovery", desc: "Accident towing & storage", time: "SAFE", icon: AlertTriangle },
            { title: "Junk Cars", desc: "Removal & purchase", time: "CASH", icon: Car }
          ].map((s, i) => (
            <motion.div 
              key={i} 
              whileHover="hover"
              className="relative p-4 md:p-6 border-r border-b md:border-b-0 border-[var(--border)] last:border-r-0 even:border-r-0 md:even:border-r overflow-hidden group cursor-pointer transition-colors duration-500"
            >
              <motion.div 
                variants={{ hover: { y: 0 } }}
                initial={{ y: "100%" }}
                transition={{ type: "tween", ease: "circOut", duration: 0.3 }}
                className="absolute inset-0 bg-[var(--blue)] z-0"
              />
              <div className="relative z-10 group-hover:text-white transition-colors duration-300">
                <div className="flex justify-between items-center mb-4">
                  <s.icon className="w-4 h-4 group-hover:text-[var(--orange)] transition-colors" />
                  <span className="font-mono text-[10px] opacity-50">{s.time}</span>
                </div>
                <h3 className="font-display font-bold uppercase text-sm md:text-base mb-1">{s.title}</h3>
                <p className="font-mono text-[10px] md:text-xs opacity-70">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Image Section */}
      <section className="relative h-[50vh] md:h-[70vh] border-b border-[var(--border)] bg-black overflow-hidden group">
        <HeroGallery />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pointer-events-none">
          <h2 className="font-display font-bold text-4xl md:text-6xl text-white uppercase tracking-tighter max-w-2xl leading-[0.9]">
            GRESHAM,<br/><span className="text-[var(--blue)]">OREGON, USA</span>
          </h2>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-4 font-mono text-xs md:text-sm flex flex-col gap-1">
            <span className="text-[var(--orange)] uppercase text-[10px] font-bold">Location</span>
            <span>28901 SE Dodge Park Blvd</span>
            <span>Gresham, OR 97080</span>
          </div>
        </div>
      </section>

      {/* Detailed Services */}
      <section className="border-b border-[var(--border)]">
        <div className="p-6 md:p-12 max-w-7xl mx-auto flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-8 md:mb-12">
            <div className="w-3 h-3 bg-[var(--orange)]"></div>
            <h2 className="font-display font-bold text-2xl md:text-4xl uppercase tracking-tight">Core Services</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {[
              { icon: Truck, title: "Towing", desc: "24-hour, holiday, emergency, and classic car towing. We handle your vehicle with the utmost care." },
              { icon: Zap, title: "Roadside Assistance", desc: "Jump starts, lockouts, and tire changes. Quick response times to get you back on the road." },
              { icon: AlertTriangle, title: "Accident Recovery", desc: "Professional towing and secure accident vehicle storage. We work with local authorities." },
              { icon: Car, title: "Junk Car Removal", desc: "Removal and purchase of junk vehicles. Turn your old, unwanted car into cash today." }
            ].map((s, i) => (
              <motion.div 
                key={i} 
                whileHover={{ x: 10 }}
                className="flex gap-4 group cursor-pointer"
              >
                <div className="mt-1 text-[var(--fg)] opacity-40 group-hover:text-[var(--blue)] group-hover:opacity-100 transition-all">
                  <s.icon className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl uppercase mb-2 group-hover:text-[var(--blue)] transition-colors">{s.title}</h3>
                  <p className="font-mono text-sm opacity-70 leading-relaxed max-w-md">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="border-b border-[var(--border)] bg-[#0a0a0a] text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/images/reviews-bg.jpg')] opacity-5 mix-blend-luminosity bg-cover bg-center pointer-events-none"></div>
        <div className="p-6 md:p-12 max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-[var(--blue)]"></div>
                <h2 className="font-display font-bold text-2xl md:text-4xl uppercase tracking-tight">Client Reviews</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-[#FBBC04]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="font-mono text-sm opacity-80">
                  <span className="font-bold text-xl mr-2">4.9</span>
                  (51 Google Reviews)
                </div>
              </div>
            </div>
            <a href="https://www.google.com/search?q=Tow+Guys+24HR+Roadside+Gresham" target="_blank" rel="noreferrer" className="px-6 py-3 border border-white/20 rounded-full font-mono text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
              Read All Reviews
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Alex Ziegelmeier",
                time: "7 months ago",
                text: "Absolute Professionals!! I got into an accident with my BMW classic car and the tow process was lightning fast and without causing anymore additional damage to the car. Very happy!"
              },
              {
                name: "Nicole Hansel",
                time: "6 months ago",
                text: "Super fast roadside assistance to get my key out of my locked car. I highly recommend them!"
              },
              {
                name: "Jim Bernard",
                time: "7 months ago",
                text: "On time and professional, if you need help or a tow tow guys are the ones to use. Alex picked up my old jag and dropped it off at my mechanics shop. Not often you can have a great experience when you need a car towed."
              },
              {
                name: "Nikki Harbert",
                time: "2 months ago",
                text: "Super helpful, kind, and great communication. They were also easy to reach every time I called."
              },
              {
                name: "Geobuddy",
                time: "2 years ago",
                text: "This company made my day! My car broke down on the way up Mt Hood... I called a couple places and was eventually referred to these guys. When I called, the person who answered was super helpful."
              },
              {
                name: "Tawny Milton",
                time: "3 years ago",
                text: "Very easy, fast and good communication. After dealing with a different tow company for over 4 hours, Tow Guys came to help in 30 minutes. Highly recommend."
              }
            ].map((review, i) => (
              <div key={i} className="bg-[#111] border border-white/10 p-6 rounded-2xl flex flex-col gap-4 hover:border-white/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--blue)] to-[var(--orange)] flex items-center justify-center font-display font-bold text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{review.name}</h4>
                    <p className="font-mono text-[10px] opacity-50">{review.time}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#FBBC04]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="font-mono text-sm opacity-80 leading-relaxed flex-1">"{review.text}"</p>
                <div className="flex items-center gap-2 mt-2 pt-4 border-t border-white/10">
                  <svg className="w-4 h-4 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  <span className="font-mono text-[10px] opacity-40 uppercase">Verified Google Review</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-6 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 bg-[var(--fg)] text-[var(--bg)] transition-colors duration-500 relative z-10">
        <div>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/logo.png" alt="Tow Guys Logo" className="h-10 md:h-12 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
            <span className="hidden font-display font-bold uppercase tracking-widest text-xl">Tow Guys</span>
          </div>
          <div className="font-mono text-sm opacity-60 space-y-1 mb-6">
            <p>28901 SE Dodge Park Blvd</p>
            <p>Gresham, OR 97080</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider">Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider">★ 5-Star Rated</span>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <a href="https://www.instagram.com/towguysgresham" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E1306C] hover:border-[#E1306C] text-white transition-all group" aria-label="Instagram">
              <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
            <a href="https://www.facebook.com/TowGuysPortland" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] text-white transition-all group" aria-label="Facebook">
              <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
        
        <div className="text-left md:text-right w-full md:w-auto">
          <p className="font-mono text-[10px] opacity-40 uppercase tracking-widest mb-2 flex items-center gap-2 md:justify-end">
            <span className="w-2 h-2 rounded-full bg-[var(--orange)] animate-pulse"></span>
            24/7 Dispatch
          </p>
          <motion.a 
            whileHover={{ scale: 1.05, color: 'var(--orange)' }}
            href="tel:9712227994" 
            className="inline-block font-display font-bold text-3xl md:text-5xl transition-colors"
            aria-label="Call Tow Guys at 971-222-7994"
          >
            (971) 222-7994
          </motion.a>
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-mono text-[10px] opacity-40 uppercase tracking-widest">
            <p>© {new Date().getFullYear()} Tow Guys LLC. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Action Bar */}
      <div className="fixed bottom-0 left-0 w-full z-50 md:hidden p-3 pb-4 bg-[var(--bg)]/90 backdrop-blur-md border-t border-[var(--border)] transition-colors duration-500 flex flex-col gap-2">
        <p className="text-center font-mono text-[9px] text-[var(--orange)] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--orange)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--orange)]"></span>
          </span>
          Stranded? Tap here to find your location and get help fast.
        </p>
        <div className="flex gap-3">
          <a 
            href="tel:9712227994" 
            className="flex items-center justify-center p-4 bg-[var(--bg)] text-[var(--fg)] border border-[var(--border)] transition-colors duration-500"
            aria-label="Call Now"
          >
            <Phone className="w-6 h-6" />
          </a>
          <OneClickDispatch 
            isPulse={true} 
            className="flex-1 py-4 bg-[var(--fg)] text-[var(--bg)] text-lg md:text-xl" 
          />
        </div>
      </div>
    </div>
  );
}
