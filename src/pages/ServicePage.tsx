import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Phone, MapPin, ArrowLeft, ChevronDown, Check } from 'lucide-react';
import SERVICES, { type ServiceData } from '../data/services';
import SERVICE_AREAS from '../data/serviceAreas';
import Picture from '../components/Picture';

const PHONE      = '(971) 222-7994';
const PHONE_HREF = 'tel:9712227994';
const SITE_URL   = 'https://www.towguysgresham.com';

function buildServiceJsonLd(service: ServiceData) {
  const pageUrl = `${SITE_URL}/services/${service.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    name: service.name,
    serviceType: service.serviceType,
    description: service.metaDescription,
    url: pageUrl,
    image: `${SITE_URL}${service.images[0].src}`,
    provider: { '@id': `${SITE_URL}/#business` },
    areaServed: SERVICE_AREAS.map((c) => ({ '@type': 'City', name: c.name, sameAs: c.wiki })),
    availableChannel: { '@type': 'ServiceChannel', servicePhone: '+1-971-222-7994' },
  };
}

function buildFAQJsonLd(service: ServiceData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

function buildBreadcrumbJsonLd(service: ServiceData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: service.name, item: `${SITE_URL}/services/${service.slug}` },
    ],
  };
}

const ListCard = ({ heading, items, numbered = false }: { heading: string; items: string[]; numbered?: boolean }) => (
  <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8">
    <h2 className="font-display font-bold text-lg uppercase tracking-tight text-[var(--blue)] mb-5">{heading}</h2>
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={item} className="flex gap-3 font-mono text-sm text-white/80 leading-relaxed">
          {numbered ? (
            <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--orange)] text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
          ) : (
            <Check className="shrink-0 w-4 h-4 mt-0.5 text-[var(--orange)]" />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default function ServicePage() {
  const { service: slug } = useParams<{ service: string }>();
  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) {
    return <Navigate to="/" replace />;
  }

  const pageUrl = `${SITE_URL}/services/${service.slug}`;
  const otherServices = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Helmet>
        <title>{service.metaTitle}</title>
        <meta name="description" content={service.metaDescription} />
        <meta property="og:title" content={service.metaTitle} />
        <meta property="og:description" content={service.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={`${SITE_URL}${service.images[0].src}`} />
        <link rel="canonical" href={pageUrl} />
        <script type="application/ld+json">{JSON.stringify(buildServiceJsonLd(service))}</script>
        <script type="application/ld+json">{JSON.stringify(buildFAQJsonLd(service))}</script>
        <script type="application/ld+json">{JSON.stringify(buildBreadcrumbJsonLd(service))}</script>
      </Helmet>

      <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-4 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>
        <span className="font-mono text-xs text-white/30 mx-2">/</span>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-white/70">{service.name}</span>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a] to-[var(--blue)]/20 pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-14 md:py-24">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--orange)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--orange)]" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/70 font-bold">
              24/7 Dispatch — Gresham, OR
            </span>
          </div>

          <h1 className="font-display font-bold text-4xl md:text-6xl uppercase tracking-tighter leading-[0.9] mb-6 max-w-4xl">
            {service.headline}
          </h1>
          <p className="font-mono text-sm md:text-base text-white/70 max-w-2xl leading-relaxed">
            {service.intro}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a
              href={PHONE_HREF}
              className="inline-flex items-center justify-center gap-3 bg-[var(--orange)] text-white px-8 py-5 rounded-2xl font-display font-bold text-lg md:text-xl uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform shadow-[0_0_40px_rgba(255,85,0,0.3)]"
            >
              <Phone className="w-6 h-6" />
              Call Now: {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* ── PHOTOS ────────────────────────────────────────────────────────── */}
      <section className="border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {service.images.map((img, i) => (
            <div key={img.src} className="relative aspect-[4/3] overflow-hidden">
              <Picture
                src={img.src}
                alt={img.alt}
                sizes="(min-width: 768px) 33vw, 100vw"
                loading={i === 0 ? 'eager' : 'lazy'}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ───────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ListCard heading="What we handle" items={service.includes} />
          {service.audience && <ListCard heading={service.audience.heading} items={service.audience.items} />}
          {service.steps && <ListCard heading={service.steps.heading} items={service.steps.items} numbered />}
        </div>
      </section>

      {/* ── CONTENT ───────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {service.content.map((block) => (
            <div key={block.headline}>
              <h2 className="font-display font-bold text-2xl uppercase tracking-tight mb-3">{block.headline}</h2>
              <p className="font-mono text-sm text-white/70 leading-relaxed">{block.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-3 h-3 bg-[var(--blue)]" />
            <h2 className="font-display font-bold text-2xl md:text-4xl uppercase tracking-tight">
              {service.name} FAQs
            </h2>
          </div>
          <div className="space-y-4">
            {service.faqs.map((faq) => (
              <details key={faq.question} className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-display font-bold text-base md:text-lg uppercase tracking-tight group-open:text-[var(--blue)] transition-colors list-none">
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-white/30 group-open:rotate-180 transition-transform duration-300 shrink-0" />
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="font-mono text-sm text-white/70 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHERE / OTHER SERVICES ────────────────────────────────────────── */}
      <section className="py-16 md:py-20 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display font-bold text-xl uppercase tracking-tight mb-5">Areas we serve</h2>
            <div className="flex flex-wrap gap-2">
              {SERVICE_AREAS.map((c) => (
                <Link
                  key={c.slug}
                  to={`/towing/${c.slug}`}
                  className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 font-mono text-xs text-white/70 hover:text-white hover:border-[var(--blue)]/50 transition-colors"
                >
                  <MapPin className="w-3 h-3" />
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display font-bold text-xl uppercase tracking-tight mb-5">Other services</h2>
            <ul className="space-y-3">
              {otherServices.map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="group block">
                    <span className="font-display font-bold uppercase tracking-tight group-hover:text-[var(--blue)] transition-colors">{s.name}</span>
                    <span className="block font-mono text-xs text-white/50">{s.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl md:text-5xl uppercase tracking-tighter mb-6">
            Need <span className="text-[var(--orange)]">{service.name.toLowerCase()}</span>?
          </h2>
          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-3 bg-[var(--orange)] text-white px-10 py-6 rounded-2xl font-display font-bold text-xl md:text-2xl uppercase tracking-wider hover:scale-105 active:scale-95 transition-transform shadow-[0_0_60px_rgba(255,85,0,0.3)]"
          >
            <Phone className="w-7 h-7" />
            {PHONE}
          </a>
          <p className="font-mono text-xs text-white/30 mt-6 uppercase tracking-widest">
            28901 SE Dodge Park Blvd · Gresham, OR 97080 · Open 24/7
          </p>
        </div>
      </section>
    </div>
  );
}
