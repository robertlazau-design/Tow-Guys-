import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Phone, MapPin, Truck, Zap, AlertTriangle, ArrowLeft } from 'lucide-react';
import SERVICE_AREAS, { type CityData } from '../data/serviceAreas';

/* ─── Constants ──────────────────────────────────────────────────────────── */

const PHONE       = '(971) 222-7994';
const PHONE_HREF  = 'tel:9712227994';
const SITE_URL    = 'https://towguys.com';

const NAP = {
  name:    'Tow Guys LLC',
  street:  '28901 SE Dodge Park Blvd',
  city:    'Gresham',
  state:   'OR',
  zip:     '97080',
  country: 'US',
  phone:   '+1-971-222-7994',
  email:   'info@towguys.com',
};

/* ─── JSON-LD builder ────────────────────────────────────────────────────── */

function buildJsonLd(city: CityData) {
  return {
    '@context': 'https://schema.org',
    '@type': ['AutoRepair', 'LocalBusiness'],
    '@id': `${SITE_URL}/towing/${city.slug}#business`,
    name: NAP.name,
    url: `${SITE_URL}/towing/${city.slug}`,
    telephone: NAP.phone,
    email: NAP.email,
    image: `${SITE_URL}/logo.png`,
    logo: `${SITE_URL}/logo.png`,
    description: `24/7 emergency towing, flatbed towing, and roadside assistance in ${city.name}, Oregon. Fast dispatch from Tow Guys LLC.`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: NAP.street,
      addressLocality: NAP.city,
      addressRegion: NAP.state,
      postalCode: NAP.zip,
      addressCountry: NAP.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: city.lat,
      longitude: city.lng,
    },
    areaServed: {
      '@type': 'City',
      name: city.name,
      sameAs: city.wiki,
      geo: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: city.lat,
          longitude: city.lng,
        },
        geoRadius: `${city.radiusMi} mi`,
      },
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday',
          'Friday', 'Saturday', 'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Emergency Towing',
          description: `24/7 emergency tow dispatch to ${city.name} and surrounding areas.`,
          serviceType: 'Emergency Towing',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Flatbed Towing',
          description: 'Flatbed tow truck service for AWD, luxury, classic, and lowered vehicles.',
          serviceType: 'Flatbed Towing',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Roadside Assistance',
          description: 'Jump starts, lockout service, tire changes, and fuel delivery.',
          serviceType: 'Roadside Assistance',
        },
      },
    ],
    sameAs: [
      'https://www.facebook.com/TowGuysPortland',
      'https://www.instagram.com/towguysgresham',
    ],
  };
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function ServiceArea() {
  const { city: citySlug } = useParams<{ city: string }>();
  const city = SERVICE_AREAS.find((c) => c.slug === citySlug);

  if (!city) {
    return <Navigate to="/" replace />;
  }

  const jsonLd = buildJsonLd(city);
  const pageTitle = `24/7 Emergency Towing & Roadside Assistance in ${city.name}, OR | Tow Guys`;
  const metaDesc  = `Stranded in ${city.name}? Tow Guys LLC provides fast 24/7 emergency towing, flatbed transport, and roadside assistance. Call ${PHONE} now.`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/towing/${city.slug}`} />
        <link rel="canonical" href={`${SITE_URL}/towing/${city.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* ── Back Link ─────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/10">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-[var(--blue)]/20 pointer-events-none" />
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-6 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`border-r border-white/5 ${i >= 4 ? 'hidden md:block' : ''}`} />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-28">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--orange)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--orange)]" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/70 font-bold">
              24/7 Dispatch — {city.name}, OR
            </span>
          </div>

          <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter leading-[0.9] mb-6">
            24/7 Emergency Towing<br />
            & Roadside Assistance<br />
            in <span className="text-[var(--blue)]">{city.name}</span>, OR
          </h1>

          <p className="font-mono text-sm md:text-base text-white/60 max-w-2xl mb-4">
            {city.tagline}
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a
              href={PHONE_HREF}
              className="inline-flex items-center justify-center gap-3 bg-[var(--orange)] text-white px-8 py-5 rounded-2xl font-display font-bold text-lg md:text-xl uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform shadow-[0_0_40px_rgba(255,85,0,0.3)]"
            >
              <Phone className="w-6 h-6" />
              Call Now: {PHONE}
            </a>
            <a
              href={`https://maps.google.com/?q=${NAP.street},+${NAP.city},+${NAP.state}+${NAP.zip}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white/5 text-white border border-white/15 px-8 py-5 rounded-2xl font-display font-bold text-lg uppercase tracking-wider hover:bg-white/10 transition-colors"
            >
              <MapPin className="w-5 h-5" />
              Get Directions
            </a>
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ─────────────────────────────────────────────────── */}
      <section className="border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {[
            {
              icon: Truck,
              title: 'Emergency Towing',
              desc: `Fast dispatch to ${city.name} — breakdowns, accidents, and disabled vehicles. No voicemail. No wait.`,
              tag: '24/7',
            },
            {
              icon: AlertTriangle,
              title: 'Flatbed Towing',
              desc: `Zero-scratch flatbed transport for AWD, lowered, and luxury vehicles in the ${city.name} area.`,
              tag: 'SAFE',
            },
            {
              icon: Zap,
              title: 'Roadside Assistance',
              desc: `Jump starts, lockouts, tire changes, and fuel delivery across ${city.name} and surrounding corridors.`,
              tag: 'FAST',
            },
          ].map((s, i) => (
            <div
              key={i}
              className="p-6 md:p-10 border-b md:border-b-0 md:border-r border-white/10 last:border-r-0 last:border-b-0 group hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-[var(--blue)]/20 transition-colors">
                  <s.icon className="w-6 h-6 text-[var(--blue)]" />
                </div>
                <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">{s.tag}</span>
              </div>
              <h3 className="font-display font-bold text-xl uppercase tracking-tight mb-3 group-hover:text-[var(--blue)] transition-colors">
                {s.title}
              </h3>
              <p className="font-mono text-sm text-white/60 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LOCAL SEO CONTENT BLOCKS ──────────────────────────────────────── */}
      <section className="py-16 md:py-24 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-3 h-3 bg-[var(--orange)]" />
            <h2 className="font-display font-bold text-2xl md:text-4xl uppercase tracking-tight">
              Trusted Towing in {city.name}
            </h2>
          </div>

          <div className="space-y-8">
            {/* Block 1 */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-10">
              <h3 className="font-display font-bold text-lg uppercase tracking-tight text-[var(--blue)] mb-4">
                Stranded in {city.name}? Help Is Minutes Away.
              </h3>
              <p className="font-mono text-sm text-white/70 leading-relaxed">
                When your car breaks down in the {city.name} area, the last thing you need is a
                long wait or a voicemail. Tow Guys LLC provides fast dispatch to {city.name} from our base
                on SE Dodge Park Blvd — one of the shortest response corridors in East Portland.
                We answer every call, 24 hours a day, 7 days a week, including holidays.
              </p>
            </div>

            {/* Block 2 */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-10">
              <h3 className="font-display font-bold text-lg uppercase tracking-tight text-[var(--blue)] mb-4">
                Emergency Roadside Assistance Across {city.name}
              </h3>
              <p className="font-mono text-sm text-white/70 leading-relaxed">
                Dead battery, flat tire, or locked out of your car? Our roadside team covers all of
                {' '}{city.name} and the surrounding communities. Every truck is stocked with jump packs,
                professional lockout tools, and spare fuel. We'll get you back on the road — or safely
                towed to the shop of your choice — without the stress.
              </p>
            </div>

            {/* Block 3 */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-10">
              <h3 className="font-display font-bold text-lg uppercase tracking-tight text-[var(--blue)] mb-4">
                Why {city.name} Drivers Choose Tow Guys
              </h3>
              <p className="font-mono text-sm text-white/70 leading-relaxed">
                Trusted towing in the {city.name} area means no hidden fees, no surprise surcharges, and
                a driver who treats your vehicle like their own. We're rated 4.9 stars on Google with
                50+ reviews from real customers across Gresham, {city.name}, and the Mt. Hood corridor.
                When you call {PHONE}, a real person picks up — not a dispatch center in another state.
              </p>
            </div>

            {/* ── LOCAL LANDMARK PLACEHOLDER ─────────────────────────────── */}
            {/*
              <!-- INSERT LOCAL LANDMARKS/HIGHWAYS HERE -->
              Add a block here with specific highways, interchanges, or weather
              hazards relevant to this city for maximum local authenticity.
              Example for Troutdale:
                "From I-84 Exit 17 to the Columbia River Highway, we cover
                 every mile of the Troutdale corridor."
            */}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl md:text-5xl uppercase tracking-tighter mb-4">
            Need a Tow in{' '}
            <span className="text-[var(--orange)]">{city.name}</span>?
          </h2>
          <p className="font-mono text-sm text-white/60 max-w-xl mx-auto mb-8">
            Don't wait on hold with a national chain. Call Tow Guys — your local,
            licensed, 24/7 towing company serving {city.name} and all of East Portland.
          </p>

          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-3 bg-[var(--orange)] text-white px-10 py-6 rounded-2xl font-display font-bold text-xl md:text-2xl uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform shadow-[0_0_60px_rgba(255,85,0,0.3)]"
          >
            <Phone className="w-7 h-7" />
            {PHONE}
          </a>

          <p className="font-mono text-xs text-white/30 mt-6 uppercase tracking-widest">
            {NAP.street} · {NAP.city}, {NAP.state} {NAP.zip}
          </p>
        </div>
      </section>
    </div>
  );
}
