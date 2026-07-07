import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Phone, MapPin, Truck, Zap, AlertTriangle, Car, ArrowLeft, ChevronDown, Clock, Shield, Star } from 'lucide-react';
import SERVICE_AREAS, { type CityData } from '../data/serviceAreas';

/* ─── Constants ──────────────────────────────────────────────────────────── */

const PHONE       = '(971) 222-7994';
const PHONE_HREF  = 'tel:9712227994';
const SITE_URL    = 'https://towguysgresham.com';

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

/* ─── JSON-LD builders ───────────────────────────────────────────────────── */

function buildLocalBusinessJsonLd(city: CityData) {
  return {
    '@context': 'https://schema.org',
    '@type': ['AutoRepair', 'TowingBusiness'],
    '@id': `${SITE_URL}/towing/${city.slug}#business`,
    name: NAP.name,
    alternateName: 'Tow Guys 24HR Roadside',
    url: `${SITE_URL}/towing/${city.slug}`,
    telephone: NAP.phone,
    email: NAP.email,
    image: `${SITE_URL}/logo.png`,
    logo: `${SITE_URL}/logo.png`,
    description: `24/7 emergency towing, flatbed towing, roadside assistance, and accident recovery in ${city.name}, Oregon. Fast dispatch from Tow Guys LLC serving the ${city.highway} corridor.`,
    priceRange: '$$',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Cash, Credit Card, Debit Card',
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
    hasMap: `https://www.google.com/maps/place/Tow+Guys+24HR+Roadside/@${city.lat},${city.lng},14z`,
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
    areaServed: SERVICE_AREAS.map((c) => ({
      '@type': 'City',
      name: c.name,
      sameAs: c.wiki,
      ...(c.postalCodes.length > 0 && {
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: `${c.name}, OR`,
        },
      }),
      geo: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: c.lat,
          longitude: c.lng,
        },
        geoRadius: `${c.radiusMi} mi`,
      },
    })),
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Emergency Towing',
          description: `24/7 emergency tow dispatch to ${city.name} and surrounding areas along the ${city.highway} corridor.`,
          serviceType: 'Emergency Towing',
          areaServed: { '@type': 'State', name: 'Oregon' },
          availableChannel: {
            '@type': 'ServiceChannel',
            servicePhone: NAP.phone,
            availableLanguage: 'English',
          },
          hoursAvailable: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
            opens: '00:00',
            closes: '23:59',
          },
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Flatbed Towing',
          description: 'Flatbed tow truck service for AWD, luxury, classic, and lowered vehicles. Zero-scratch transport guaranteed.',
          serviceType: 'Flatbed Towing',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Roadside Assistance',
          description: `Jump starts, lockout service, tire changes, and fuel delivery across ${city.name} and the ${city.highway} corridor.`,
          serviceType: 'Roadside Assistance',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Accident Recovery',
          description: `Professional accident vehicle towing and recovery in ${city.name}. Coordination with law enforcement and insurance. Secure vehicle storage available.`,
          serviceType: 'Accident Recovery and Towing',
        },
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      ratingCount: '51',
      reviewCount: '51',
    },
    sameAs: [
      'https://www.facebook.com/TowGuysPortland',
      'https://www.instagram.com/towguysgresham',
      'https://www.google.com/maps/place/Tow+Guys+24HR+Roadside',
    ],
  };
}

function buildFAQJsonLd(city: CityData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: city.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function ServiceArea() {
  const { city: citySlug } = useParams<{ city: string }>();
  const city = SERVICE_AREAS.find((c) => c.slug === citySlug);

  if (!city) {
    return <Navigate to="/" replace />;
  }

  const localBusinessJsonLd = buildLocalBusinessJsonLd(city);
  const faqJsonLd = buildFAQJsonLd(city);
  const nearbyData = SERVICE_AREAS.filter((c) => city.nearbyAreas.includes(c.slug));
  const primaryImage = city.galleryImages[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Helmet>
        <title>{city.metaTitle}</title>
        <meta name="description" content={city.metaDescription} />
        <meta name="keywords" content={`towing ${city.name} OR, tow truck ${city.name}, roadside assistance ${city.name}, ${city.highway} towing, emergency tow ${city.name} Oregon, Tow Guys`} />
        <meta property="og:title" content={city.metaTitle} />
        <meta property="og:description" content={city.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/towing/${city.slug}`} />
        {primaryImage && <meta property="og:image" content={`${SITE_URL}${primaryImage.src}`} />}
        <link rel="canonical" href={`${SITE_URL}/towing/${city.slug}`} />
        <script type="application/ld+json">{JSON.stringify(localBusinessJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
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

          {/* Highway corridor badge */}
          <div className="inline-flex items-center gap-2 bg-[var(--blue)]/10 border border-[var(--blue)]/30 rounded-full px-4 py-1.5 mb-8 ml-3">
            <MapPin className="w-3 h-3 text-[var(--blue)]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--blue)] font-bold">
              {city.highway} Corridor — {city.exitRef}
            </span>
          </div>

          <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter leading-[0.9] mb-6">
            24/7 Emergency Towing<br />
            &amp; Roadside Assistance<br />
            in <span className="text-[var(--blue)]">{city.name}</span>, OR
          </h1>

          <p className="font-mono text-sm md:text-base text-white/60 max-w-2xl mb-4">
            {city.tagline}
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a
              href={PHONE_HREF}
              id={`cta-call-${city.slug}`}
              className="inline-flex items-center justify-center gap-3 bg-[var(--orange)] text-white px-8 py-5 rounded-2xl font-display font-bold text-lg md:text-xl uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform shadow-[0_0_40px_rgba(255,85,0,0.3)]"
            >
              <Phone className="w-6 h-6" />
              Call Now: {PHONE}
            </a>
            <a
              href={`https://maps.google.com/?q=${NAP.street},+${NAP.city},+${NAP.state}+${NAP.zip}`}
              target="_blank"
              rel="noopener noreferrer"
              id={`cta-directions-${city.slug}`}
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
        <div className="grid grid-cols-1 md:grid-cols-4">
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
            {
              icon: Car,
              title: 'Accident Recovery',
              desc: `Professional accident towing and secure storage. We coordinate with law enforcement in ${city.name}.`,
              tag: 'SECURE',
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

      {/* ── GALLERY SECTION ───────────────────────────────────────────────── */}
      {city.galleryImages.length > 0 && (
        <section className="border-b border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {city.galleryImages.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden group">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-mono text-[10px] text-white/60 uppercase tracking-wider leading-relaxed">
                    {img.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
            {city.seoContent.map((block, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-10">
                <h3 className="font-display font-bold text-lg uppercase tracking-tight text-[var(--blue)] mb-4">
                  {block.headline}
                </h3>
                <p className="font-mono text-sm text-white/70 leading-relaxed">
                  {block.body}
                </p>
              </div>
            ))}

            {/* Highway corridor context block */}
            <div className="bg-[var(--blue)]/5 border border-[var(--blue)]/20 rounded-3xl p-6 md:p-10">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-[var(--blue)]" />
                <h3 className="font-display font-bold text-lg uppercase tracking-tight text-[var(--blue)]">
                  {city.highway} Coverage Area
                </h3>
              </div>
              <p className="font-mono text-sm text-white/70 leading-relaxed mb-4">
                Tow Guys provides towing and roadside assistance along the <strong className="text-white">{city.highway}</strong> corridor
                near <strong className="text-white">{city.exitRef}</strong>. Our Gresham-based trucks serve {city.name} and the surrounding communities
                of {nearbyData.map((c) => c.name).join(', ')}.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {city.landmarks.map((landmark, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 font-mono text-[10px] text-white/60 uppercase tracking-widest">
                    <MapPin className="w-2.5 h-2.5" />
                    {landmark}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION (FAQPage schema rich results) ─────────────────────── */}
      <section className="py-16 md:py-24 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-3 h-3 bg-[var(--blue)]" />
            <h2 className="font-display font-bold text-2xl md:text-4xl uppercase tracking-tight">
              Towing FAQs — {city.name}, OR
            </h2>
          </div>

          <div className="space-y-4">
            {city.faqs.map((faq, i) => (
              <details key={i} className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-display font-bold text-base md:text-lg uppercase tracking-tight group-open:text-[var(--blue)] transition-colors list-none">
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-white/30 group-open:rotate-180 transition-transform duration-300 shrink-0" />
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="font-mono text-sm text-white/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST SIGNALS ─────────────────────────────────────────────────── */}
      <section className="border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {[
            { icon: Clock, title: '24/7 Dispatch', desc: 'Every call answered live — no voicemail, no hold music, no chatbots.' },
            { icon: Shield, title: 'Licensed & Insured', desc: 'Fully licensed Oregon towing operator with comprehensive insurance coverage.' },
            { icon: Star, title: '4.9★ Google Rating', desc: '50+ verified reviews from real customers across the service area.' },
          ].map((item, i) => (
            <div key={i} className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10 last:border-r-0 last:border-b-0 text-center">
              <div className="w-14 h-14 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                <item.icon className="w-7 h-7 text-[var(--orange)]" />
              </div>
              <h3 className="font-display font-bold text-lg uppercase tracking-tight mb-2">{item.title}</h3>
              <p className="font-mono text-xs text-white/50 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEARBY SERVICE AREAS (Internal Cross-Links) ───────────────────── */}
      {nearbyData.length > 0 && (
        <section className="py-16 md:py-24 border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-10">
              <div className="w-3 h-3 bg-[var(--orange)]" />
              <h2 className="font-display font-bold text-2xl md:text-4xl uppercase tracking-tight">
                Nearby Service Areas
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nearbyData.map((nearby) => (
                <Link
                  key={nearby.slug}
                  to={`/towing/${nearby.slug}`}
                  className="group bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-[var(--blue)]/50 hover:bg-[var(--blue)]/5 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-bold text-lg uppercase tracking-tight group-hover:text-[var(--blue)] transition-colors">
                      {nearby.name}, OR
                    </h3>
                    <ArrowLeft className="w-4 h-4 text-white/20 rotate-180 group-hover:text-[var(--blue)] group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="font-mono text-xs text-white/50 leading-relaxed mb-3">
                    {nearby.tagline}
                  </p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-white/30" />
                    <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                      {nearby.highway}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl md:text-5xl uppercase tracking-tighter mb-4">
            Need a Tow in{' '}
            <span className="text-[var(--orange)]">{city.name}</span>?
          </h2>
          <p className="font-mono text-sm text-white/60 max-w-xl mx-auto mb-8">
            Don't wait on hold with a national chain. Call Tow Guys — your local,
            licensed, 24/7 towing company serving {city.name} and the {city.highway} corridor.
          </p>

          <a
            href={PHONE_HREF}
            id={`cta-bottom-call-${city.slug}`}
            className="inline-flex items-center justify-center gap-3 bg-[var(--orange)] text-white px-10 py-6 rounded-2xl font-display font-bold text-xl md:text-2xl uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform shadow-[0_0_60px_rgba(255,85,0,0.3)]"
          >
            <Phone className="w-7 h-7" />
            {PHONE}
          </a>

          <p className="font-mono text-xs text-white/30 mt-6 uppercase tracking-widest">
            {NAP.street} · {NAP.city}, {NAP.state} {NAP.zip}
          </p>

          {/* All service area links for crawler depth */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-4">All Service Areas</p>
            <div className="flex flex-wrap justify-center gap-3">
              {SERVICE_AREAS.map((c) => (
                <Link
                  key={c.slug}
                  to={`/towing/${c.slug}`}
                  className={`font-mono text-xs uppercase tracking-wider transition-colors ${
                    c.slug === city.slug
                      ? 'text-[var(--blue)] font-bold'
                      : 'text-white/30 hover:text-white/70'
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
