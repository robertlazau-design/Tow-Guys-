import React, { useState, useEffect } from 'react';
import { Car, Truck, AlertTriangle, Zap, Siren, SquareParking, Menu, Phone, MapPin, Loader2, ListChecks, Map, Banknote, Instagram, Facebook, Sun, Moon, Camera, ArrowLeft, MessageSquare } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { track } from '@vercel/analytics';
import BlogIndex from './pages/BlogIndex';
import Privacy from './pages/Privacy';
import ServiceArea from './pages/ServiceArea';
import SERVICE_AREAS from './data/serviceAreas';
import SERVICES from './data/services';
import ServicePage from './pages/ServicePage';
import Picture from './components/Picture';
import MobileMenu from './components/MobileMenu';

const Marquee = ({ text }: { text: string }) => {
  // Scroll only on larger screens, and never for people who've asked their
  // device to reduce motion. Decided after mount so prerendered HTML matches.
  const [shouldScroll, setShouldScroll] = useState(false);
  useEffect(() => {
    setShouldScroll(window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)').matches);
  }, []);

  const content = [...Array(5)].map((_, i) => (
    <span key={i} className="flex items-center gap-8 mx-4">
      {text} <AlertTriangle className="w-4 h-4 text-[var(--orange)]" />
    </span>
  ));

  return (
    <div className="overflow-hidden whitespace-nowrap py-3 border-y border-[var(--border)] bg-[var(--blue)] text-white flex items-center relative z-20 w-full">
      <motion.div
        className="flex font-mono text-sm uppercase tracking-widest font-bold"
        animate={shouldScroll ? { x: ["0%", "-50%"] } : { x: "0%" }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        style={{ width: "fit-content" }}
      >
        <div className="flex">{content}</div>
        <div className="flex">{content}</div>
      </motion.div>
    </div>
  );
};

const OneClickDispatch = ({ className = "", isPulse = false, label = "Text My Location" }: { className?: string, isPulse?: boolean, label?: string }) => {
  const [dispatchState, setDispatchState] = useState<'idle' | 'locating' | 'success' | 'calling'>('idle');

  const handleDispatch = () => {
    if (dispatchState !== 'idle') return;
    track('Send Location Click', { page: window.location.pathname });

    const phoneNumber = "+19712227994";
    const triggerSMS = (mapsLink: string) => {
      const message = `I need a tow! My exact location is: ${mapsLink}`;
      // Handle iOS vs Android SMS URI formatting
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const separator = isIOS ? '&' : '?';
      window.location.href = `sms:${phoneNumber}${separator}body=${encodeURIComponent(message)}`;
      
      // Keep the "press Send" reminder up for when they switch back to the page
      setTimeout(() => setDispatchState('idle'), 15000);
    };

    // No location (denied or unavailable): call instead, and say so
    const fallbackCall = () => {
      setDispatchState('calling');
      window.location.href = `tel:${phoneNumber}`;
      setTimeout(() => setDispatchState('idle'), 4000);
    };

    if (!navigator.geolocation) {
      fallbackCall();
      return;
    }

    setDispatchState('locating');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        
        // Tell them what happens next before their messages app opens
        setDispatchState('success');
        setTimeout(() => triggerSMS(mapsLink), 1200);
      },
      (error) => {
        console.warn("Geolocation failed or denied:", error);
        fallbackCall(); // Graceful fallback to phone call
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Merge the passed className with our new base aesthetics (massive, rounded-2xl)
  const baseClassName = `min-h-[60px] rounded-2xl flex items-center justify-center gap-3 font-display font-bold uppercase tracking-wider transition-all duration-500 disabled:opacity-90 disabled:cursor-wait relative overflow-hidden ${isPulse ? 'pulse-button' : ''}`;
  
  return (
    <button 
      onClick={handleDispatch}
      disabled={dispatchState !== 'idle'}
      className={`${baseClassName} ${className}`}
    >
      {/* Plain swaps, no enter/exit animation: the label must never be blank,
          even before JS loads or while a background tab pauses animations. */}
      <span className="flex items-center gap-2" aria-live="polite">
        {dispatchState === 'idle' && (<><MapPin className="w-5 h-5" /><span>{label}</span></>)}
        {dispatchState === 'locating' && (<><Loader2 className="w-5 h-5 animate-spin" /><span>Finding You…</span></>)}
        {dispatchState === 'success' && (<><MessageSquare className="w-5 h-5" /><span>Now Press Send</span></>)}
        {dispatchState === 'calling' && (<><Phone className="w-5 h-5" /><span>Calling Instead…</span></>)}
      </span>
    </button>
  );
};

const PhoneNumber = () => {
  const number = "971:222:7994";
  return (
    <a
      href="tel:9712227994"
      aria-label="Call Tow Guys at (971) 222-7994"
      className="block w-full md:cursor-crosshair"
    >
      <span className="md:hidden block font-display font-bold text-[11vw] leading-none tracking-tight whitespace-nowrap">
        (971) 222-7994
      </span>
      <span className="md:hidden flex items-center gap-2 mt-3 font-mono text-sm font-bold uppercase tracking-widest text-[var(--blue)]">
        <Phone className="w-4 h-4" /> Tap to call — open 24/7
      </span>
      <span className="hidden md:flex justify-between items-baseline font-display font-bold md:text-[14vw] lg:text-[11vw] xl:text-[12vw] leading-[0.8] tracking-tighter uppercase w-full">
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
      </span>
    </a>
  );
};

const JunkCarQuoteFlow = () => {
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState({ year: '', make: '', model: '' });

  const handleSMSHandoff = () => {
    track('Junk Car Quote Click');
    const phoneNumber = "+19712227994";
    const message = `Junk Car Quote Request: ${details.year} ${details.make} ${details.model}. (I am attaching my 3 photos to this text now).`;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const separator = isIOS ? '&' : '?';
    window.location.href = `sms:${phoneNumber}${separator}body=${encodeURIComponent(message)}`;
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
          <p className="font-mono text-sm text-white/80">Get an instant quote by texting us 3 photos.</p>
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
                <p className="font-mono text-white/60 text-sm">Step 1 of 2</p>
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

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 w-full">
              <div className="text-center mb-4">
                <h3 className="font-display font-bold text-3xl text-white mb-2">Photo Attachments</h3>
                <p className="font-mono text-white/60 text-sm">Step 2 of 2</p>
              </div>
              
              <div className="bg-black/30 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center gap-4">
                <div className="flex gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-[var(--orange)]" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-[var(--orange)]" />
                  </div>
                </div>
                <h4 className="font-bold text-xl text-white">Next Step:</h4>
                <p className="text-white/80 leading-relaxed font-mono text-sm max-w-[280px]">
                  We will open your text messages. Please snap <strong className="text-white">3 quick photos</strong> (Front, Side, Interior) and attach them to the text.
                </p>
              </div>

              <button 
                onClick={handleSMSHandoff}
                className="w-full h-20 rounded-2xl bg-[var(--orange)] text-white font-display font-bold text-xl flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all mt-4 shadow-lg">
                <span className="uppercase tracking-wider">Open Messages</span>
                <span className="text-xs md:text-[10px] opacity-80 font-mono tracking-widest mt-1">To Send Photos</span>
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const RecoveryHub = () => (
  <section id="recovery" className="scroll-mt-20 border-b border-[var(--border)] bg-[#0f0f0f] text-white">
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <div className="mb-8 md:mb-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 bg-[var(--orange)]" />
          <h2 className="font-display font-bold text-3xl md:text-5xl uppercase tracking-tighter">
            Car Got Towed? Selling a Junk Car?
          </h2>
        </div>
        <p className="font-mono text-sm md:text-base text-white/60">
          Picking up a towed car, selling a junk car, or managing a property — start here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

        {/* Car got towed? */}
        <div className="bg-[#1a1a1a] rounded-3xl p-6 md:p-8 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-display font-bold text-xl text-white">Car got towed? Bring:</h3>
          </div>
          <div className="flex flex-col gap-3">
            {[
              "Valid Photo ID (License/Passport)",
              "Proof of Ownership (Title/Reg)",
              "Valid Insurance Policy",
              "Payment (CASH ONLY)"
            ].map((item) => (
              <div key={item} className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5">
                <div className="w-2 h-2 rounded-full bg-[var(--orange)] shrink-0" />
                <span className="font-mono text-sm text-white/80">{item}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <a
              href="https://maps.google.com/?q=28901+SE+Dodge+Park+Blvd,+Gresham,+OR+97080"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-white text-black rounded-2xl py-4 font-bold text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors flex justify-center items-center gap-2"
            >
              <MapPin className="w-4 h-4" /> Directions
            </a>
            <a
              href="tel:9712227994"
              className="flex-1 bg-white/10 text-white rounded-2xl py-4 font-bold text-sm uppercase tracking-wider hover:bg-white/20 transition-colors flex justify-center items-center gap-2"
            >
              <Phone className="w-4 h-4" /> Call Ahead
            </a>
          </div>
        </div>

        {/* Order a ride to the yard */}
        <div className="bg-white rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
                <Map className="w-5 h-5 text-black" />
              </div>
              <h3 className="font-display font-bold text-xl text-black">Need a Ride to the Yard?</h3>
            </div>
            <div className="bg-black/5 p-4 rounded-2xl">
              <p className="font-mono text-xs text-black/50 uppercase tracking-widest mb-1">Destination</p>
              <p className="font-mono text-sm text-black font-bold">28901 SE Dodge Park Blvd, Gresham</p>
            </div>
          </div>
          <div className="flex gap-3 mt-auto">
            <a href="https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=28901%20SE%20Dodge%20Park%20Blvd%2C%20Gresham%2C%20OR%2097080" target="_blank" rel="noopener noreferrer" className="flex-1 bg-black text-white rounded-2xl py-4 font-bold text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors flex justify-center items-center gap-2">
              Uber
            </a>
            <a href="https://ride.lyft.com/app?destination[address]=28901%20SE%20Dodge%20Park%20Blvd,%20Gresham,%20OR%2097080" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#FF00BF]/10 text-[#FF00BF] rounded-2xl py-4 font-bold text-sm uppercase tracking-wider hover:bg-[#FF00BF]/20 transition-colors flex justify-center items-center gap-2">
              Lyft
            </a>
          </div>
        </div>

        {/* Sell junk car */}
        <JunkCarQuoteFlow />

        {/* Property managers */}
        <Link
          to="/services/private-property-impound"
          className="bg-[var(--blue)] rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-8 relative overflow-hidden group shadow-lg"
        >
          <div className="absolute -right-4 -top-4 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
            <SquareParking className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <SquareParking className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight mb-2">Property<br/>Managers</h3>
            <p className="font-mono text-sm text-white/80">Unauthorized or abandoned vehicles? Private property impounds at no cost to you.</p>
          </div>
          <span className="relative z-10 w-full bg-white text-[var(--blue)] rounded-full py-4 font-bold text-sm uppercase tracking-wider text-center group-hover:scale-[1.02] transition-transform shadow-lg">
            Learn More
          </span>
        </Link>

      </div>
    </div>
  </section>
);

const MotionLink = motion.create(Link);

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'emergency-towing': Siren,
  'flatbed-towing': Truck,
  'roadside-assistance': Zap,
  'accident-recovery': AlertTriangle,
  'junk-car-removal': Car,
  'private-property-impound': SquareParking,
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
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.7, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 [@media(hover:hover)]:mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700"
        >
          <Picture
            src={images[currentIndex]}
            alt={`Tow Guys Towing and Recovery in Gresham OR - Gallery image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Home = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <>
      <Helmet>
        <title>Tow Guys 24HR Roadside | 24/7 Towing in Gresham, OR</title>
        <meta name="description" content="Need a tow in Gresham, OR? Tow Guys offers 24/7 towing, roadside help, accident recovery, property impounds and cash for junk cars. Call 971-222-7994." />
        <meta property="og:title" content="Tow Guys 24HR Roadside | 24/7 Towing in Gresham, OR" />
        <meta property="og:description" content="24/7 towing, roadside assistance, accident recovery, and cash for junk cars in Gresham and East Portland. Call 971-222-7994." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.towguysgresham.com/images/og-share.jpg" />
        <meta property="og:url" content="https://www.towguysgresham.com/" />
        <link rel="canonical" href="https://www.towguysgresham.com/" />
      </Helmet>
      <h1 className="sr-only">Tow Guys - 24/7 Towing, Roadside Assistance & Cash for Junk Cars in Gresham, OR</h1>
      <Marquee text="OPEN 24/7 • CALL (971) 222-7994 • GRESHAM, OR • TOW GUYS" />

      {/* Hero Section */}
      <section className="flex flex-col border-b border-[var(--border)]">
        {/* Hero Banner Area */}
        <div className="relative flex flex-col overflow-hidden">
          {/* Background Image & Grid Lines */}
          <div className="absolute inset-0 pointer-events-none z-0">
          <Picture 
            src="/images/hero-bg.jpg" 
            alt="" 
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover object-bottom md:object-center opacity-30 grayscale mix-blend-luminosity"
          />
          <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`border-r border-[var(--border)] transition-colors duration-500 ${i >= 4 ? 'hidden md:block' : ''}`} />
            ))}
          </div>
        </div>

        <div className="p-4 md:p-6 relative z-10 flex-1 flex flex-col justify-center py-12 md:py-24">
          <div className="hidden md:flex justify-between text-xs font-mono opacity-60 uppercase tracking-widest mb-4">
            <span>Area Code</span>
            <span>Prefix</span>
            <span>Line Number</span>
          </div>
          <PhoneNumber />
          <div className="mt-8 md:mt-12 flex flex-col gap-4">
            <p className="hidden md:flex font-mono text-sm text-[var(--orange)] font-bold uppercase tracking-widest items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--orange)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--orange)]"></span>
              </span>
              Need a tow? Call us 24/7 — a real person answers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-start">
              <a 
                href="tel:9712227994" 
                className="min-h-[60px] rounded-2xl flex items-center justify-center gap-3 bg-[var(--blue)] text-white px-8 py-4 text-lg font-display font-bold uppercase tracking-wider hover:bg-[var(--orange)] border border-transparent hover:border-[var(--orange)] shadow-[4px_4px_0px_0px_rgba(10,10,10,0.15)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] active:translate-y-1 active:shadow-none transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
              {/* Texting a location only works from a phone */}
              <div className="[@media(pointer:fine)]:hidden flex flex-col gap-2">
                <OneClickDispatch className={`px-8 py-4 text-lg active:translate-y-1 ${isDarkMode ? 'bg-[#1a1a1a] text-white border border-white/20' : 'bg-white text-black border border-black/20 shadow-[4px_4px_0px_0px_rgba(10,10,10,0.15)]'}`} />
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--orange)] text-center sm:text-left">
                  Can't talk? This opens a text to us — just hit Send.
                </p>
              </div>
            </div>
            <ul className="flex flex-wrap gap-2 mt-2 font-mono text-xs font-bold uppercase tracking-wider">
              {[
                <><span className="text-[#FBBC04]">★★★★★</span> 4.9 · 51 Google Reviews</>,
                <>Licensed & Insured</>,
                <>Gresham-Based · 24/7</>,
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 bg-[var(--bg)]/80 backdrop-blur-sm px-3 py-2 rounded-full border border-[var(--border)]">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>

        {/* Services Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-[var(--border)] relative z-10 bg-[var(--bg)] transition-colors duration-500">
          {[
            { title: "Towing", desc: "24/7, Holiday, Emergency", time: "24:00", icon: Truck, to: "/services/emergency-towing" },
            { title: "Roadside", desc: "Jump starts, Lockouts", time: "ASAP", icon: Zap, to: "/services/roadside-assistance" },
            { title: "Recovery", desc: "Accident towing & storage", time: "SAFE", icon: AlertTriangle, to: "/services/accident-recovery" },
            { title: "Junk Cars", desc: "Removal & purchase", time: "CASH", icon: Car, to: "/services/junk-car-removal" }
          ].map((s, i) => (
            <MotionLink 
              key={i} 
              to={s.to}
              whileHover="hover"
              className="relative p-4 md:p-6 border-r border-b md:border-b-0 border-[var(--border)] last:border-r-0 even:border-r-0 md:even:border-r overflow-hidden group transition-colors duration-500"
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
                  <span className="hidden md:inline font-mono text-[10px] opacity-50">{s.time}</span>
                </div>
                <h3 className="font-display font-bold uppercase text-sm md:text-base mb-1">{s.title}</h3>
                <p className="font-mono text-xs md:text-xs opacity-70">{s.desc}</p>
              </div>
            </MotionLink>
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
            <span className="text-[var(--orange)] uppercase text-xs md:text-[10px] font-bold">Location</span>
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
            {SERVICES.map((s) => ({ ...s, icon: SERVICE_ICONS[s.slug] ?? Truck })).map((s) => (
              <MotionLink 
                key={s.slug} 
                to={`/services/${s.slug}`}
                whileHover={{ x: 10 }}
                className="flex gap-4 group"
              >
                <div className="mt-1 text-[var(--fg)] opacity-40 group-hover:text-[var(--blue)] group-hover:opacity-100 transition-all">
                  <s.icon className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl uppercase mb-2 group-hover:text-[var(--blue)] transition-colors">{s.name}</h3>
                  <p className="font-mono text-sm opacity-70 leading-relaxed max-w-md">{s.summary}</p>
                </div>
              </MotionLink>
            ))}
          </div>
        </div>
      </section>

      {/* Recovery & Junk Car Hub */}
      <RecoveryHub />

      {/* Reviews Section */}
      <section className="border-b border-[var(--border)] bg-[#0a0a0a] text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/images/tow4-800.webp')] opacity-5 mix-blend-luminosity bg-cover bg-center pointer-events-none"></div>
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
                text: "Absolute Professionals!! I got into an accident with my BMW classic car and the tow process was lightning fast and without causing anymore additional damage to the car. Very happy!"
              },
              {
                name: "Nicole Hansel",
                text: "Super fast roadside assistance to get my key out of my locked car. I highly recommend them!"
              },
              {
                name: "Jim Bernard",
                text: "On time and professional, if you need help or a tow tow guys are the ones to use. Alex picked up my old jag and dropped it off at my mechanics shop. Not often you can have a great experience when you need a car towed."
              },
              {
                name: "Nikki Harbert",
                text: "Super helpful, kind, and great communication. They were also easy to reach every time I called."
              },
              {
                name: "Geobuddy",
                text: "This company made my day! My car broke down on the way up Mt Hood... I called a couple places and was eventually referred to these guys. When I called, the person who answered was super helpful."
              },
              {
                name: "Tawny Milton",
                text: "Very easy, fast and good communication. After dealing with a different tow company for over 4 hours, Tow Guys came to help in 30 minutes. Highly recommend."
              }
            ].map((review, i) => (
              <div key={i} className="bg-[#111] border border-white/10 p-6 rounded-2xl flex flex-col gap-4 hover:border-white/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--blue)] to-[var(--orange)] flex items-center justify-center font-display font-bold text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <h4 className="font-bold text-sm">{review.name}</h4>
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
                  <span className="font-mono text-xs md:text-[10px] opacity-40 uppercase">Verified Google Review</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  </>
);


export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setIsMenuOpen(false), [location.pathname]);
  const isHome = location.pathname === '/';
  const isBlog = location.pathname.startsWith('/blog');
  const isServiceArea = location.pathname.startsWith('/towing/');

  return (
    <div className={`min-h-screen font-sans flex flex-col pb-[84px] md:pb-0 transition-colors duration-500 selection:bg-[var(--blue)] selection:text-white ${isDarkMode ? 'dark' : ''}`} style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      {/* Noise Texture Overlay */}
      <div className="pointer-events-none fixed inset-0 z-[100] h-full w-full opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Header */}
      <header className={`sticky top-0 flex justify-between items-center p-4 md:px-6 border-b border-[var(--border)] relative z-50 backdrop-blur-md transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-black'}`}>
        <Link 
          to="/"
          className="flex items-center gap-3 cursor-pointer shrink-0" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          role="button"
          tabIndex={0}
          aria-label="Scroll to top"
        >
          <img src="/logo.png" alt="Tow Guys Logo" className={`h-10 md:h-14 w-auto object-contain transition-transform hover:scale-105 duration-300 ${isDarkMode ? 'invert hue-rotate-180' : ''}`} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
          <span className="hidden font-display font-bold uppercase tracking-widest text-sm md:text-base">Tow Guys</span>
        </Link>
        
        <div className="flex items-center gap-3 md:gap-6">
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                isHome
                  ? (isDarkMode ? 'text-white opacity-100' : 'text-black opacity-100')
                  : (isDarkMode ? 'text-white opacity-60 hover:opacity-100' : 'text-black opacity-60 hover:opacity-100')
              }`}
            >
              Home
            </Link>
            <span className={`font-mono text-xs font-light select-none pointer-events-none ${
              isDarkMode ? 'text-white opacity-30' : 'text-black opacity-30'
            }`}>|</span>
            <Link
              to="/towing/gresham"
              className={`font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                isServiceArea
                  ? (isDarkMode ? 'text-white opacity-100' : 'text-black opacity-100')
                  : (isDarkMode ? 'text-white opacity-60 hover:opacity-100' : 'text-black opacity-60 hover:opacity-100')
              }`}
            >
              Service Areas
            </Link>
            <span className={`font-mono text-xs font-light select-none pointer-events-none ${
              isDarkMode ? 'text-white opacity-30' : 'text-black opacity-30'
            }`}>|</span>
            <Link
              to="/blog"
              className={`font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                isBlog
                  ? (isDarkMode ? 'text-white opacity-100' : 'text-black opacity-100')
                  : (isDarkMode ? 'text-white opacity-60 hover:opacity-100' : 'text-black opacity-60 hover:opacity-100')
              }`}
            >
              News & Tips
            </Link>
          </nav>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`hidden md:flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
              isDarkMode
                ? 'bg-[var(--orange)] text-white border-[var(--orange)] shadow-[0_0_20px_rgba(255,85,0,0.4)]'
                : 'bg-[var(--bg)] text-[var(--fg)] border-[var(--border)] hover:bg-[var(--blue)] hover:text-white hover:border-[var(--blue)]'
            }`}
          >
            {isDarkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider border border-[var(--border)]"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
          >
            <Menu className="w-4 h-4" />
            Menu
          </button>
        </div>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/towing/:city" element={<ServiceArea />} />
          <Route path="/services/:service" element={<ServicePage />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </div>


      {/* Footer */}
      <footer className={`p-6 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-t border-[var(--border)] transition-colors duration-500 relative z-10 ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-black'}`}>
        <div>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/logo.png" alt="Tow Guys Logo" className={`h-14 md:h-20 w-auto object-contain transition-transform hover:scale-105 duration-300 ${isDarkMode ? 'invert hue-rotate-180' : ''}`} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
            <span className="hidden font-display font-bold uppercase tracking-widest text-xl">Tow Guys</span>
          </div>
          <div className="font-mono text-sm opacity-60 space-y-1 mb-6">
            <p>28901 SE Dodge Park Blvd</p>
            <p>Gresham, OR 97080</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="font-mono text-xs md:text-[10px] uppercase font-bold tracking-wider">Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10">
              <span className="font-mono text-xs md:text-[10px] uppercase font-bold tracking-wider">★ 4.9 on Google</span>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <a href="https://www.instagram.com/towguysgresham" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-[#E1306C] hover:border-[#E1306C] text-black dark:text-white hover:text-white transition-all group" aria-label="Instagram">
              <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
            <a href="https://www.facebook.com/TowGuysPortland" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] text-black dark:text-white hover:text-white transition-all group" aria-label="Facebook">
              <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
        
        {/* Service + Service Area Links for SEO */}
        <div className="w-full md:w-auto mb-8 md:mb-0 flex flex-col gap-6">
          <div>
            <p className="font-mono text-xs md:text-[10px] opacity-40 uppercase tracking-widest mb-3">Services</p>
            <div className="flex flex-wrap gap-x-4 gap-y-0 md:gap-y-2">
              {SERVICES.map((s) => (
                <Link
                  key={s.slug}
                  to={`/services/${s.slug}`}
                  className="font-mono text-sm md:text-xs py-2 md:py-0 opacity-60 hover:opacity-100 hover:text-[var(--blue)] transition-all"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-xs md:text-[10px] opacity-40 uppercase tracking-widest mb-3">Service Areas</p>
            <div className="flex flex-wrap gap-x-4 gap-y-0 md:gap-y-2">
              {SERVICE_AREAS.map((area) => (
                <Link
                  key={area.slug}
                  to={`/towing/${area.slug}`}
                  className="font-mono text-sm md:text-xs py-2 md:py-0 opacity-60 hover:opacity-100 hover:text-[var(--blue)] transition-all"
                >
                  {area.name}, OR
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="text-left md:text-right w-full md:w-auto">
          <p className="font-mono text-xs md:text-[10px] opacity-40 uppercase tracking-widest mb-2 flex items-center gap-2 md:justify-end">
            <span className="w-2 h-2 rounded-full bg-[var(--orange)] animate-pulse"></span>
            Open 24/7
          </p>
          <motion.a 
            whileHover={{ scale: 1.05, color: 'var(--orange)' }}
            href="tel:9712227994" 
            className="inline-block font-display font-bold text-3xl md:text-5xl transition-colors"
            aria-label="Call Tow Guys at 971-222-7994"
          >
            (971) 222-7994
          </motion.a>
          <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-mono text-xs md:text-[10px] opacity-40 uppercase tracking-widest">
            <p>© {new Date().getFullYear()} Tow Guys LLC. All rights reserved.</p>
            <Link to="/privacy" className="py-2 md:py-0 hover:text-black/70 dark:hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>

      {/* Mobile Action Bar */}
      <div className="fixed bottom-0 left-0 w-full z-50 md:hidden p-3 bg-[var(--bg)]/90 backdrop-blur-md border-t border-[var(--border)] transition-colors duration-500 grid grid-cols-2 gap-3">
        <a
          href="tel:9712227994"
          className="min-h-[60px] rounded-2xl flex items-center justify-center gap-2 bg-[var(--orange)] text-white font-display font-bold uppercase tracking-wider text-lg"
        >
          <Phone className="w-5 h-5" />
          Call
        </a>
        <OneClickDispatch
          isPulse={true}
          label="Text Location"
          className="bg-[var(--fg)] text-[var(--bg)] text-base"
        />
      </div>
    </div>
  );
}
