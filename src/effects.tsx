// Motion effects from the Golden Boy kit (first built for RobertLazau.com),
// tuned for Tow Guys. Styles live in index.css under "tg-".
// Every effect keeps all text in the prerendered HTML, moves only transform or
// opacity (plus paint-only touches: the phone number's glint and the card
// light), and shows its finished state for "reduce motion". Mouse-only effects
// run only on devices with a real hover pointer.
import React from 'react';
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from 'motion/react';

const matches = (query: string) => typeof window !== 'undefined' && window.matchMedia(query).matches;
const reducedMotion = () => matches('(prefers-reduced-motion: reduce)');
const finePointer = () => matches('(hover: hover) and (pointer: fine)');

// Set once the prerendered page has come to life (usePageEffects in App).
// Before that, anything already on screen has been seen, so it must not be
// hidden again. After it (moving between pages in the menu), new content can
// open with an effect.
let pageReady = false;

// ── Widescreen bars that open the first time a section comes into view ─────
// On a fresh load they wait until the section is scrolled to, and never cover
// one that's already showing. On a page reached from the menu they open as the
// page appears.
export function Letterbox({
  as: Tag = 'div',
  children,
  className = '',
}: {
  as?: 'div' | 'section';
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [state, setState] = React.useState<'idle' | 'armed' | 'open'>('idle');
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || typeof IntersectionObserver === 'undefined') return;
    const r = el.getBoundingClientRect();
    if (!pageReady && r.top < window.innerHeight && r.bottom > 0) return;
    setState('armed');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        // two frames so the closed bars are painted before they open
        requestAnimationFrame(() => requestAnimationFrame(() => setState('open')));
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      className={`tg-letterbox tg-letterbox-${state} ${className}`}
    >
      {children}
      <span className="tg-letterbox-bar tg-letterbox-top" aria-hidden="true" />
      <span className="tg-letterbox-bar tg-letterbox-bottom" aria-hidden="true" />
    </Tag>
  );
}

// ── Call buttons that lean toward the cursor ───────────────────────────────
// Uses motion's transform, so it never fights Tailwind's scale and translate
// classes (Tailwind 4 puts those on their own CSS properties).
type MagneticProps = HTMLMotionProps<'a'> & { strength?: number; max?: number };
export function MagneticLink({ strength = 0.3, max = 10, onPointerMove, onPointerLeave, style, ...rest }: MagneticProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });
  const enabled = React.useRef(false);
  React.useEffect(() => {
    enabled.current = finePointer() && !reducedMotion();
  }, []);
  const clamp = (v: number) => Math.max(-max, Math.min(max, v));
  return (
    <motion.a
      {...rest}
      style={{ ...style, x: springX, y: springY }}
      onPointerMove={(e) => {
        if (enabled.current) {
          const r = e.currentTarget.getBoundingClientRect();
          x.set(clamp((e.clientX - (r.left + r.width / 2)) * strength));
          y.set(clamp((e.clientY - (r.top + r.height / 2)) * strength));
        }
        onPointerMove?.(e);
      }}
      onPointerLeave={(e) => {
        x.set(0);
        y.set(0);
        onPointerLeave?.(e);
      }}
    />
  );
}

// ── Page-wide setup, mounted once in App ───────────────────────────────────
// Marks the page as ready, and moves the soft light on any .tg-glow card to
// follow the mouse (it sets --gx/--gy; the light itself is CSS).
export function usePageEffects() {
  React.useEffect(() => {
    pageReady = true;
    if (!finePointer()) return;
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.('.tg-glow') as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--gx', `${e.clientX - r.left}px`);
      card.style.setProperty('--gy', `${e.clientY - r.top}px`);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, []);
}
