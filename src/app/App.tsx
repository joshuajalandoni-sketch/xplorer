import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Menu, X, ChevronDown, BookOpen, Mail } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import nightcrawlerImg from "@/imports/images__1_.jpg";
import xmen97Img from "@/imports/x-men-97_h5s7.jpg";
import comicCoverImg from "@/imports/912gHLEZkmL._AC_UF1000_1000_QL80_.jpg";
import season2Img from "@/imports/images.jpg";
import galleryImg1 from "@/imports/gallery-amazing-xmen-quest-for-nightcrawler.jpg";
import galleryImg2 from "@/imports/gallery-giant-size-xmen-nightcrawler.jpg";
import galleryImg3 from "@/imports/gallery-nightcrawler-classic-flip.webp";
import galleryImg4 from "@/imports/gallery-uncanny-xmen-nightcrawler-sword.webp";
import galleryImg5 from "@/imports/gallery-cyclops-optic-blast.jpg";
import galleryImg6 from "@/imports/gallery-avx-alien-vs-xmen.jpg";
import galleryImg7 from "@/imports/gallery-xmen-classic-cover.jpg";
import galleryImg8 from "@/imports/gallery-all-new-xmen-team.webp";
import galleryImg9 from "@/imports/gallery-xmen-prime.jpg";
import galleryImg10 from "@/imports/gallery-exceptional-xmen.jpg";
import galleryImg11 from "@/imports/gallery-xmen-100-vintage.avif";
import galleryImg12 from "@/imports/gallery-xmen-new-beginning.jpg";
import galleryImg13 from "@/imports/gallery-avengers-team.webp";
import galleryImg14 from "@/imports/gallery-x-1-moon.jpg";
import galleryImg15 from "@/imports/gallery-excalibur-team.jpg";
import galleryImg16 from "@/imports/gallery-xmen-vs-xforce.jpg";
import galleryImg17 from "@/imports/gallery-nightcrawler-portrait.jpg";

/* ─── Global keyframes & overrides ─────────────────────────────────────── */
const STYLES = `
  @keyframes bamfPop {
    0%   { opacity: 0; transform: scale(0) rotate(0deg); }
    25%  { opacity: 1; transform: scale(1.3) rotate(120deg); }
    70%  { opacity: 0.7; transform: scale(1) rotate(300deg) translateY(-30px); }
    100% { opacity: 0; transform: scale(0.2) rotate(480deg) translateY(-60px); }
  }
  @keyframes eyeGlow {
    0%, 100% {
      box-shadow: 0 0 8px #3d7fe0, 0 0 18px #3d7fe050;
    }
    50% {
      box-shadow: 0 0 22px #3d7fe0, 0 0 55px #3d7fe080, 0 0 90px #3d7fe030;
    }
  }
  @keyframes floatUpDown {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-14px); }
  }
  @keyframes scanLine {
    0%   { top: -3px; }
    100% { top: 100%; }
  }
  @keyframes borderPulse {
    0%, 100% { border-color: rgba(245,197,24,0.15); }
    50%       { border-color: rgba(245,197,24,0.55); }
  }
  @keyframes smokeRise {
    0%   { opacity: 0.35; transform: translateY(0) scaleX(1); }
    100% { opacity: 0;    transform: translateY(-90px) scaleX(1.6); }
  }
  @keyframes heroTextGlow {
    0%, 100% { filter: drop-shadow(0 0 30px rgba(245,197,24,0.35)) drop-shadow(0 0 60px rgba(232,86,10,0.2)); }
    50%       { filter: drop-shadow(0 0 60px rgba(245,197,24,0.6))  drop-shadow(0 0 120px rgba(232,86,10,0.35)); }
  }
  @keyframes tailWag {
    0%, 100% { transform: rotate(-6deg) scaleX(1); }
    50%       { transform: rotate(6deg)  scaleX(-1); }
  }

  .bamf-dot   { animation: bamfPop var(--dur, 4s) ease-in-out var(--del, 0s) infinite; }
  .eye-pulse  { animation: eyeGlow 3s ease-in-out infinite; }
  .float-anim { animation: floatUpDown 6s ease-in-out infinite; }
  .hero-glow  { animation: heroTextGlow 5s ease-in-out infinite; }

  /* scroll reveal */
  .rv   { opacity: 0; transform: translateY(40px) scale(0.97); filter: blur(6px); transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1), filter .9s cubic-bezier(.16,1,.3,1); }
  .rv-l { opacity: 0; transform: translateX(-55px) scale(0.97); filter: blur(6px); transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1), filter .9s cubic-bezier(.16,1,.3,1); }
  .rv-r { opacity: 0; transform: translateX(55px) scale(0.97); filter: blur(6px); transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1), filter .9s cubic-bezier(.16,1,.3,1); }
  .rv-scale { opacity: 0; transform: scale(0.85); filter: blur(10px); transition: opacity .7s cubic-bezier(.34,1.56,.64,1), transform .7s cubic-bezier(.34,1.56,.64,1), filter .7s ease-out; }
  .rv.in, .rv-l.in, .rv-r.in, .rv-scale.in { opacity: 1; transform: none; filter: blur(0px); }

  /* gallery hover */
  .gal-wrap { transition: transform .35s cubic-bezier(.16,1,.3,1); transform-style: preserve-3d; will-change: transform; }
  .gal-img    { transition: transform .6s cubic-bezier(.16,1,.3,1); }
  .gal-wrap:hover .gal-img { transform: scale(1.1); }
  .gal-overlay { opacity: 0; transition: opacity .4s ease; }
  .gal-wrap:hover .gal-overlay { opacity: 1; }

  /* power card — 3D tilt handled via inline transform from JS, base transition covers return-to-rest */
  .pw-card {
    transition: transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s ease, border-color .35s ease;
    border: 1px solid rgba(245,197,24,0.1);
    transform-style: preserve-3d;
    will-change: transform;
  }
  .pw-card:hover {
    box-shadow: 0 20px 60px rgba(245,197,24,0.09), 0 0 0 1px rgba(245,197,24,0.3);
  }

  /* cursor smoke trail */
  @keyframes smokeTrailFade {
    0%   { opacity: 0.5; transform: translate(-50%, -50%) scale(0.4); }
    100% { opacity: 0;   transform: translate(-50%, -50%) scale(1.8); }
  }
  .smoke-trail-dot {
    position: absolute;
    pointer-events: none;
    border-radius: 9999px;
    animation: smokeTrailFade .9s ease-out forwards;
  }

  /* magnetic button wrapper — transform applied inline via JS */
  .magnetic-btn { will-change: transform; }

  /* nav underline */
  .nav-lnk { position: relative; }
  .nav-lnk::after {
    content: '';
    position: absolute;
    bottom: -3px; left: 0;
    width: 0; height: 1px;
    background: #3d7fe0;
    transition: width .3s ease;
  }
  .nav-lnk:hover::after { width: 100%; }

  /* custom scrollbar */
  ::-webkit-scrollbar       { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(245,197,24,0.35); border-radius: 2px; }

  /* story card */
  .story-card { transition: background .4s ease; }
  .story-card:hover { background: rgba(245,197,24,0.04); }
  .story-arrow { display: inline-block; transition: transform .3s ease; }
  .story-card:hover .story-arrow { transform: translateX(5px); }
`;

/* ─── BAMF Particle Field ───────────────────────────────────────────────── */
type Particle = { id: number; x: number; y: number; size: number; dur: number; del: number; color: string };

function BamfParticles({ count = 25 }: { count?: number }) {
  const particles = useRef<Particle[]>(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      dur: Math.random() * 4 + 3,
      del: Math.random() * 6,
      color: Math.random() > 0.55 ? "#e8560a" : "#3d7fe0",
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.current.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bamf-dot"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            "--dur": `${p.dur}s`,
            "--del": `${p.del}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* ─── Scroll Reveal hook ────────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        }),
      { threshold: 0.08 }
    );
    el.querySelectorAll(".rv, .rv-l, .rv-r, .rv-scale").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ─── Tilt hook (3D hover tilt for cards/gallery) ──────────────────────────── */
function useTilt(strength = 10) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py * strength).toFixed(2)}deg) rotateY(${(px * strength).toFixed(2)}deg) translateY(-6px)`;
    },
    [strength]
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}

/* ─── Magnetic button (cursor-attraction micro-interaction) ────────────────── */
function MagneticButton({
  children,
  onClick,
  className,
  strength = 0.35,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  const onMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x: sx, y: sy }}
      className={`magnetic-btn ${className ?? ""}`}
    >
      {children}
    </motion.button>
  );
}

/* ─── Navigation ────────────────────────────────────────────────────────── */
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const goto = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const links = [
    { label: "About", id: "about" },
    { label: "Gallery", id: "gallery" },
    { label: "Stories", id: "stories" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#050714]/92 backdrop-blur-lg border-b border-[#3d7fe018]"
          : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 group"
        >
          <span className="font-['Bangers'] text-2xl tracking-[0.15em] text-[#3d7fe0] leading-none">
            NIGHTCRAWLER
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => goto(id)}
              className="nav-lnk font-['Teko'] text-lg tracking-[0.25em] uppercase text-[#ddd8f0]/60 hover:text-[#3d7fe0] transition-colors"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden text-[#3d7fe0] p-1"
          aria-label="Toggle menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-[#050714]/96 backdrop-blur-lg border-t border-[#3d7fe020] px-8 py-8 flex flex-col gap-5">
          {links.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => goto(id)}
              className="font-['Bangers'] text-4xl tracking-[0.15em] text-[#ddd8f0]/60 hover:text-[#3d7fe0] transition-colors text-left"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ─── Hero ──────────────────────────────────────────────────────────────── */
function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const particleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const lastSpawn = useRef(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    if (bgRef.current) {
      bgRef.current.style.transform = `scale(1.08) translate(${(-px * 22).toFixed(1)}px, ${(-py * 22).toFixed(1)}px)`;
    }
    if (particleRef.current) {
      particleRef.current.style.transform = `translate(${(px * 34).toFixed(1)}px, ${(py * 34).toFixed(1)}px)`;
    }
    if (contentRef.current) {
      contentRef.current.style.transform = `translate(${(px * -10).toFixed(1)}px, ${(py * -6).toFixed(1)}px)`;
    }

    // spawn smoke trail dots, throttled
    const now = performance.now();
    if (trailRef.current && now - lastSpawn.current > 55) {
      lastSpawn.current = now;
      const dot = document.createElement("div");
      dot.className = "smoke-trail-dot";
      const size = 10 + Math.random() * 14;
      const color = Math.random() > 0.5 ? "#3d7fe0" : "#e8560a";
      dot.style.left = `${e.clientX - rect.left}px`;
      dot.style.top = `${e.clientY - rect.top}px`;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.background = `radial-gradient(circle, ${color}55 0%, ${color}00 70%)`;
      trailRef.current.appendChild(dot);
      setTimeout(() => dot.remove(), 900);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (bgRef.current) bgRef.current.style.transform = "scale(1.08) translate(0px, 0px)";
    if (particleRef.current) particleRef.current.style.transform = "translate(0px, 0px)";
    if (contentRef.current) contentRef.current.style.transform = "translate(0px, 0px)";
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        ref={bgRef}
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: "scale(1.08)" }}
      >
        <ImageWithFallback
          src={nightcrawlerImg}
          alt="Nightcrawler close-up with glowing eyes and fire in the background from X-Men 97"
          className="w-full h-full object-cover object-[center_20%]"
        />
        {/* layered dark overlay — heavier at bottom for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050714]/70 via-[#050714]/40 to-[#050714]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050714]/80 via-transparent to-[#050714]/60" />
        {/* indigo color grade — pulls warm/yellow tones toward Nightcrawler's blue-violet palette */}
        <div className="absolute inset-0 bg-[#141b45]/45 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#3d0a1a]/35 via-transparent to-[#0a1240]/40 mix-blend-color" />
      </div>

      {/* Cursor smoke trail */}
      <div ref={trailRef} className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden />

      {/* Particle field */}
      <div ref={particleRef} className="absolute inset-0 transition-transform duration-300 ease-out">
        <BamfParticles count={35} />
      </div>

      {/* Scan-line flicker */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.025]" aria-hidden>
        <div
          className="absolute w-full h-[2px] bg-[#3d7fe0]"
          style={{ animation: "scanLine 10s linear infinite" }}
        />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-16 transition-transform duration-300 ease-out"
      >
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="inline-flex items-center gap-3 mb-8 px-5 py-2 border border-[#3d7fe035] bg-[#3d7fe008]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#3d7fe0] eye-pulse" />
          <span className="font-['Teko'] text-sm tracking-[0.45em] text-[#3d7fe0] uppercase">
            Marvel Animation · X-Men &apos;97
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#3d7fe0] eye-pulse" />
        </motion.div>

        {/* X-97 title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-['Bangers'] leading-none hero-glow select-none block text-center mx-auto -mt-4 mb-2"
          style={{
            fontSize: "clamp(4.5rem, 15vw, 12rem)",
            letterSpacing: "0.03em",
            WebkitTextStroke: "2px rgba(5,7,20,0.4)",
            background: "linear-gradient(140deg, #6fa8ff 0%, #ddd8f0 42%, #ff2f4e 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          X-97
        </motion.h1>

        {/* Name + tagline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <p
            className="font-['Teko'] uppercase tracking-[0.4em] text-[#ddd8f0]/90 mb-3"
            style={{ fontSize: "clamp(1.4rem, 4vw, 3rem)" }}
          >
            Kurt Wagner · Nightcrawler
          </p>
          <p className="font-['Barlow'] text-[#ddd8f0]/50 text-sm md:text-base max-w-lg mx-auto tracking-wide leading-relaxed">
            Born in shadow. Leaping toward the light. Mutant. Acrobat. A devout soul
            wrestling between two worlds — and refusing to abandon either.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton
            onClick={() =>
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-9 py-3.5 bg-[#3d7fe0] text-[#050714] font-['Teko'] text-xl tracking-[0.3em] uppercase hover:bg-[#e8560a] transition-colors duration-300 active:scale-95"
          >
            Enter the Shadows
          </MagneticButton>
          <MagneticButton
            onClick={() =>
              document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-9 py-3.5 border border-[#3d7fe050] text-[#3d7fe0] font-['Teko'] text-xl tracking-[0.3em] uppercase hover:border-[#3d7fe0] hover:bg-[#3d7fe010] transition-all duration-300 active:scale-95"
          >
            View Gallery
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll nudge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 float-anim"
        aria-hidden
      >
        <span className="font-['Teko'] text-[10px] tracking-[0.5em] text-[#3d7fe0]/45 uppercase">
          Scroll
        </span>
        <ChevronDown size={14} className="text-[#3d7fe0]/45" />
      </motion.div>
    </section>
  );
}

/* ─── About ─────────────────────────────────────────────────────────────── */
function About() {
  const ref = useReveal();

  return (
    <section id="about" ref={ref as React.RefObject<HTMLElement>} className="relative py-36 overflow-hidden">
      {/* Atmospheric bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050714] via-[#0b0d1f] to-[#050714]" />
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-[#3d7fe0]/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#e8560a]/[0.04] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section label */}
        <div className="rv mb-20 flex items-center gap-4">
          <div className="h-px w-12 bg-[#3d7fe0]" />
          <span className="font-['Teko'] text-xs tracking-[0.55em] text-[#3d7fe0] uppercase">
            Origin Story
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left — image panel */}
          <div className="rv-l">
            <div
              className="relative overflow-hidden border border-[#3d7fe020]"
              style={{ animation: "borderPulse 5s ease-in-out infinite" }}
            >
              <ImageWithFallback
                src={nightcrawlerImg}
                alt="Nightcrawler and Wolverine standing beneath a luminous night sky"
                className="w-full h-[520px] object-cover object-bottom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050714] via-[#050714]/20 to-transparent" />
              {/* Comic corner marks */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#3d7fe0]/70" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#3d7fe0]/70" />
            </div>

            {/* Stat strip */}
            <div className="grid grid-cols-3 border border-t-0 border-[#3d7fe020]">
              {[
                { label: "Real Name", value: "Kurt Wagner" },
                { label: "Origin", value: "Bavaria, Germany" },
                { label: "Status", value: "X-Men Active" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className={`p-4 ${i < 2 ? "border-r border-[#3d7fe020]" : ""}`}
                >
                  <p className="font-['Teko'] text-[9px] tracking-[0.45em] text-[#3d7fe0]/55 uppercase mb-1">
                    {s.label}
                  </p>
                  <p className="font-['Teko'] text-base text-[#ddd8f0]">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — text */}
          <div className="rv-r">
            <h2
              className="font-['Bangers'] leading-none tracking-wider mb-8"
              style={{
                fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
                background: "linear-gradient(140deg, #ffffff 0%, #3d7fe0 65%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              FROM SHADOW REALM TO XAVIER&apos;S SCHOOL
            </h2>

            <blockquote className="border-l-2 border-[#3d7fe0] pl-6 mb-8">
              <p className="font-['Barlow'] text-lg text-[#ddd8f0]/80 italic leading-relaxed">
                &ldquo;Mein Gott... I am Nightcrawler. And I belong here, among friends —
                even if the world is not yet ready to believe it.&rdquo;
              </p>
              <cite className="font-['Teko'] text-xs tracking-[0.4em] text-[#3d7fe0]/65 uppercase mt-3 block">
                — Kurt Wagner, X-Men &apos;97
              </cite>
            </blockquote>

            <div className="space-y-4 font-['Barlow'] text-[#ddd8f0]/58 leading-relaxed text-[15px]">
              <p>
                Born in the mountains of Bavaria with indigo skin, a prehensile tail, and the
                ability to teleport through a brimstone dimension — Kurt Wagner was abandoned at
                birth and raised by a circus troupe who called him their own. The world called
                him a demon.
              </p>
              <p>
                In X-Men &apos;97, Kurt is the soul of the team. Devout, fiercely acrobatic,
                constitutionally incapable of cruelty — he bridges Charles Xavier&apos;s dream
                and the violent reality of a world that fears what it cannot understand.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3">
              {[
                { label: "Team Affiliation", value: "X-Men · Excalibur" },
                { label: "Power Class", value: "Gamma Level Mutant" },
                { label: "Combat Role", value: "Infiltration / Rescue" },
                { label: "First Appeared", value: "Giant-Size X-Men #1, 1975" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 bg-[#0b0d1f] border border-[#3d7fe018]"
                >
                  <p className="font-['Teko'] text-[9px] tracking-[0.35em] text-[#3d7fe0]/55 uppercase mb-0.5">
                    {item.label}
                  </p>
                  <p className="font-['Teko'] text-[15px] text-[#ddd8f0]/90">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Gallery ────────────────────────────────────────────────────────────── */
const galleryItems = [
  {
    img: nightcrawlerImg,
    title: "The Night Sentinel",
    desc: "Season 1 · Episode 5",
    span: "md:col-span-2 md:row-span-2",
    pos: "object-top",
  },
  {
    img: xmen97Img,
    title: "Resurrection Day",
    desc: "Official Ensemble Poster",
    span: "",
    pos: "object-center",
  },
  {
    img: comicCoverImg,
    title: "Great X-pectations",
    desc: "Marvel Animation — Issue #1",
    span: "",
    pos: "object-center",
  },
  {
    img: season2Img,
    title: "Season Two Begins",
    desc: "Disney+ — Now Streaming",
    span: "md:col-span-2",
    pos: "object-center",
  },
  {
    img: galleryImg1,
    title: "The Quest for Nightcrawler",
    desc: "Amazing X-Men, Vol. 1",
    span: "",
    pos: "object-center",
  },
  {
    img: galleryImg2,
    title: "Giant-Size Nightcrawler",
    desc: "X-Men Giant-Size #1",
    span: "",
    pos: "object-center",
  },
  {
    img: galleryImg3,
    title: "Acrobat of the Impossible",
    desc: "Classic Nightcrawler Art",
    span: "",
    pos: "object-center",
  },
  {
    img: galleryImg4,
    title: "Blade in the Brimstone",
    desc: "Uncanny X-Men, Vol. 6 #3",
    span: "md:col-span-2",
    pos: "object-center",
  },
  {
    img: galleryImg5,
    title: "Optic Overdrive",
    desc: "Cyclops in Action",
    span: "",
    pos: "object-center",
  },
  {
    img: galleryImg6,
    title: "Alien vs. X-Men",
    desc: "AvX #1",
    span: "",
    pos: "object-top",
  },
  {
    img: galleryImg7,
    title: "Break Free",
    desc: "X-Men Classic Cover",
    span: "",
    pos: "object-center",
  },
  {
    img: galleryImg8,
    title: "All-New, All Different",
    desc: "All-New X-Men",
    span: "",
    pos: "object-top",
  },
  {
    img: galleryImg9,
    title: "X-Men Prime",
    desc: "Team Reunited",
    span: "",
    pos: "object-top",
  },
  {
    img: galleryImg10,
    title: "From the Ashes",
    desc: "Exceptional X-Men #1",
    span: "",
    pos: "object-top",
  },
  {
    img: galleryImg11,
    title: "The Spectacular 100th",
    desc: "X-Men #100, 1976",
    span: "md:col-span-2",
    pos: "object-center",
  },
  {
    img: galleryImg12,
    title: "A New Beginning",
    desc: "X-Men #1, Legacy #301",
    span: "",
    pos: "object-top",
  },
  {
    img: galleryImg13,
    title: "Assemble",
    desc: "Marvel Ensemble Art",
    span: "",
    pos: "object-top",
  },
  {
    img: galleryImg14,
    title: "X #1",
    desc: "Team on the Moon",
    span: "",
    pos: "object-center",
  },
  {
    img: galleryImg15,
    title: "Excalibur Rises",
    desc: "Team Portrait",
    span: "",
    pos: "object-center",
  },
  {
    img: galleryImg16,
    title: "X-Men vs. X-Force",
    desc: "Animated-Style Cover",
    span: "md:col-span-2",
    pos: "object-center",
  },
  {
    img: galleryImg17,
    title: "One More Bamf",
    desc: "Nightcrawler Portrait",
    span: "",
    pos: "object-center",
  },
];

function GalleryTile({
  item,
  i,
  hovered,
  onEnter,
  onLeave,
}: {
  item: (typeof galleryItems)[number];
  i: number;
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const tilt = useTilt(6);
  return (
    <div
      ref={tilt.ref}
      className={`gal-wrap rv relative overflow-hidden cursor-pointer ${item.span}`}
      style={{ transitionDelay: `${i * 0.1}s` }}
      onMouseMove={tilt.onMouseMove}
      onMouseEnter={onEnter}
      onMouseLeave={() => {
        onLeave();
        tilt.onMouseLeave();
      }}
    >
      <ImageWithFallback
        src={item.img}
        alt={item.title}
        className={`gal-img w-full h-full object-cover ${item.pos}`}
      />

      {/* Corner marks — always visible */}
      <div className="absolute top-3 left-3 w-7 h-7 border-t-2 border-l-2 border-[#3d7fe0] opacity-60 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-7 h-7 border-b-2 border-r-2 border-[#3d7fe0] opacity-60 pointer-events-none" />

      {/* Hover overlay */}
      <div
        className="gal-overlay absolute inset-0 flex flex-col justify-end p-7 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(5,7,20,0.96) 0%, rgba(5,7,20,0.55) 50%, transparent 100%)",
        }}
      >
        <span className="font-['Teko'] text-[10px] tracking-[0.45em] text-[#3d7fe0] uppercase mb-1">
          {item.desc}
        </span>
        <h3 className="font-['Bangers'] text-4xl tracking-wider text-white">
          {item.title}
        </h3>
      </div>

      {/* Yellow border on hover */}
      <div
        className="absolute inset-0 border-2 pointer-events-none transition-all duration-400"
        style={{ borderColor: hovered ? "rgba(245,197,24,0.55)" : "transparent" }}
      />
    </div>
  );
}

function Gallery() {
  const ref = useReveal();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="gallery" ref={ref as React.RefObject<HTMLElement>} className="relative py-36 bg-[#050714]">
      <BamfParticles count={18} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="rv mb-16 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="h-px w-12 bg-[#e8560a]" />
              <span className="font-['Teko'] text-xs tracking-[0.55em] text-[#e8560a] uppercase">
                Art Gallery
              </span>
            </div>
            <h2
              className="font-['Bangers'] leading-none tracking-wider"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                background: "linear-gradient(135deg, #ffffff 0%, #e8560a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Through The Shadows
            </h2>
          </div>
          <span className="hidden md:block font-['Bangers'] text-7xl text-[#ddd8f0]/8 leading-none select-none">
            {galleryItems.length}
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 auto-rows-[300px]">
          {galleryItems.map((item, i) => (
            <GalleryTile
              key={i}
              item={item}
              i={i}
              hovered={hovered === i}
              onEnter={() => setHovered(i)}
              onLeave={() => setHovered(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Stories ────────────────────────────────────────────────────────────── */
const stories = [
  {
    tag: "Season 1 · Episode 8",
    title: "The Demon's Covenant",
    excerpt:
      "When an ancient relic surfaces in Genosha, Kurt faces the hardest question of his faith — what does a man of God do when God seems silent?",
    accent: "#e8560a",
  },
  {
    tag: "Season 2 · Exclusive",
    title: "Faith in the Shadows",
    excerpt:
      "Kurt Wagner's rosary and his claws — the eternal war between the saint he strives to be and the warrior the world demands he become.",
    accent: "#3d7fe0",
  },
  {
    tag: "Tie-In Comic · 2025",
    title: "Return to Excalibur",
    excerpt:
      "A trans-dimensional crisis reunites Kurt with old allies across the Marvel multiverse. Not every bamf lands safely — or in the right timeline.",
    accent: "#e8560a",
  },
];

function Stories() {
  const ref = useReveal();

  return (
    <section id="stories" ref={ref as React.RefObject<HTMLElement>} className="relative py-36 bg-[#050714]">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="rv mb-16 flex items-center gap-4">
          <div className="h-px w-12 bg-[#3d7fe0]" />
          <span className="font-['Teko'] text-xs tracking-[0.55em] text-[#3d7fe0] uppercase">
            Chronicles
          </span>
        </div>

        <h2
          className="rv font-['Bangers'] leading-none tracking-wider mb-12"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            background: "linear-gradient(135deg, #ffffff 0%, #3d7fe0 70%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            transitionDelay: "0.1s",
          }}
        >
          From the Archives
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 border border-[#3d7fe020]">
          {stories.map((s, i) => (
            <div
              key={i}
              className={`story-card rv cursor-pointer p-10 border-b lg:border-b-0 lg:border-r last:border-r-0 border-[#3d7fe020]`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              {/* Comic panel number */}
              <span
                className="font-['Bangers'] text-6xl leading-none select-none"
                style={{ color: `${s.accent}18` }}
              >
                0{i + 1}
              </span>

              <div className="mt-3">
                <span
                  className="font-['Teko'] text-[9px] tracking-[0.45em] uppercase block mb-3"
                  style={{ color: s.accent }}
                >
                  {s.tag}
                </span>

                <h3 className="font-['Bangers'] text-3xl tracking-wider text-[#ddd8f0] mb-4 leading-tight">
                  {s.title}
                </h3>

                <p className="font-['Barlow'] text-sm text-[#ddd8f0]/50 leading-relaxed mb-8">
                  {s.excerpt}
                </p>

                <div
                  className="flex items-center gap-2"
                  style={{ color: s.accent }}
                >
                  <BookOpen size={13} />
                  <span className="font-['Teko'] text-sm tracking-[0.35em] uppercase">
                    Read Story
                  </span>
                  <span className="story-arrow">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Footer / Contact ───────────────────────────────────────────────────── */
function Footer() {
  const ref = useReveal();
  const [email, setEmail] = useState("");

  return (
    <footer
      id="contact"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative pt-28 pb-12 overflow-hidden border-t border-[#3d7fe018]"
    >
      <div className="absolute inset-0 bg-[#050714]" />
      <BamfParticles count={22} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-24">
          {/* Left — CTA */}
          <div className="rv">
            <h2
              className="font-['Bangers'] leading-none tracking-wider mb-6"
              style={{
                fontSize: "clamp(3rem, 7vw, 7.5rem)",
                background: "linear-gradient(140deg, #3d7fe0 0%, #e8560a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              JOIN THE DREAM
            </h2>
            <p className="font-['Barlow'] text-[#ddd8f0]/55 max-w-sm leading-relaxed mb-8 text-sm">
              Xavier&apos;s dream lives in those who dare to hope for a world where mutant and
              human stand side by side. The shadow realm is waiting — are you ready?
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmail("");
              }}
              className="flex max-w-sm"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 border border-[#3d7fe030] bg-transparent px-4 py-3 font-['Barlow'] text-sm text-[#ddd8f0] placeholder-[#ddd8f0]/28 outline-none focus:border-[#3d7fe0] transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#3d7fe0] text-[#050714] hover:bg-[#e8560a] transition-colors"
                aria-label="Subscribe"
              >
                <Mail size={16} />
              </button>
            </form>
          </div>

          {/* Right — Links */}
          <div className="rv grid grid-cols-2 gap-10" style={{ transitionDelay: "0.15s" }}>
            {[
              {
                heading: "Navigate",
                links: ["About Kurt", "Gallery", "Powers", "Stories"],
              },
              {
                heading: "Universe",
                links: ["X-Men '97", "Disney+", "Marvel Animation", "Comics Archive"],
              },
            ].map((col) => (
              <div key={col.heading}>
                <h4 className="font-['Teko'] text-xs tracking-[0.45em] text-[#3d7fe0] uppercase mb-7">
                  {col.heading}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="font-['Barlow'] text-sm text-[#ddd8f0]/45 hover:text-[#3d7fe0] transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#3d7fe030] to-transparent mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#3d7fe0] eye-pulse flex items-center justify-center shrink-0">
              <div className="w-3 h-3 rounded-full bg-[#050714]" />
            </div>
            <span className="font-['Bangers'] text-2xl tracking-[0.15em] text-[#3d7fe0]">
              NIGHTCRAWLER
            </span>
          </div>

          <p className="font-['Teko'] text-[10px] tracking-[0.3em] text-[#ddd8f0]/25 uppercase text-center">
            Fan tribute · Not affiliated with Marvel Studios or Disney · X-Men &apos;97
          </p>

          <div
            className="font-['Bangers'] text-5xl tracking-widest select-none"
            style={{
              background: "linear-gradient(135deg, rgba(245,197,24,0.25), rgba(232,86,10,0.25))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Xplorer
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── App root ───────────────────────────────────────────────────────────── */
/* ─── Watermark ─────────────────────────────────────────────────────────── */
function Watermark() {
  return (
    <div className="fixed bottom-4 right-4 z-40 pointer-events-none select-none">
      <div className="px-3 py-2 bg-[#050714]/70 backdrop-blur-sm border border-[#3d7fe020]">
        <p className="font-['Teko'] text-[10px] tracking-[0.2em] text-[#ddd8f0]/50 uppercase leading-tight">
          Made by Joshua Jalandoni
        </p>
        <p className="font-['Teko'] text-[9px] tracking-[0.15em] text-[#3d7fe0]/50 uppercase leading-tight">
          In appreciation of X-Men &apos;97
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <style>{STYLES}</style>
      <div className="bg-background text-foreground">
        <Nav />
        <Hero />
        <About />
        <Gallery />
        <Stories />
        <Footer />
        <Watermark />
      </div>
    </>
  );
}
