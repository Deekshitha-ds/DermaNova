import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import GlassCard from "../components/GlassCard.jsx";
import {
  HiOutlineSparkles,
  HiOutlineCamera,
  HiOutlineHeart,
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
} from "react-icons/hi";

// ─────────────────────────────────────────────────────────────
// Put your hero face image at: /public/assets/hero-face.jpg
// (or update HERO_FACE_SRC below to wherever it lives).
// A portrait, front-facing, soft studio lighting works best —
// the frame will crop it into a tall rounded shape.
// If the image is missing, a gradient placeholder renders instead
// so the page never breaks.
// ─────────────────────────────────────────────────────────────
const HERO_FACE_SRC = "/assets/hero-face.jpg";

/* ============================================================
   Custom cursor — a lagging glass ring trailing a small solid
   dot. Grows and tints lavender over anything interactive
   (tag any element with data-cursor-hover to opt it in).
   Desktop / fine-pointer only; native cursor untouched on touch,
   and listeners are added on mount / removed on unmount, so no
   other route is affected.
============================================================ */
function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 260, damping: 26, mass: 0.4 });
  const ringY = useSpring(dotY, { stiffness: 260, damping: 26, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia?.("(pointer: fine)").matches;
    if (!fine || prefersReducedMotion) return;
    setEnabled(true);

    const move = (e) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      const el = e.target.closest?.("a, button, [data-cursor-hover], input, textarea");
      setHovering(Boolean(el));
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [dotX, dotY, prefersReducedMotion]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] rounded-full border border-lavender-400/70 mix-blend-multiply"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hovering ? 52 : 30,
          height: hovering ? 52 : 30,
          backgroundColor: hovering ? "rgba(196,181,253,0.18)" : "rgba(196,181,253,0.06)",
          scale: pressed ? 0.85 : 1,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] w-1.5 h-1.5 rounded-full bg-lavender-500"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: pressed ? 0.6 : hovering ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}

/* Small helper: makes its child drift a few px toward the cursor
   while hovered — the "magnetic button" feel. */
function Magnetic({ children, strength = 14, className = "" }) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  const onMove = (e) => {
    if (prefersReducedMotion || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * strength);
    y.set(((e.clientY - r.top) / r.height - 0.5) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={className}
      data-cursor-hover
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const [imageFailed, setImageFailed] = useState(false);
  const heroRef = useRef(null);

  // Mouse-tracked spotlight behind the hero — a soft light that
  // leans toward the cursor, echoing the custom cursor above it.
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(40);
  const spotXs = useSpring(spotX, { stiffness: 60, damping: 20 });
  const spotYs = useSpring(spotY, { stiffness: 60, damping: 20 });
  const spotlightBg = useMotionTemplate`radial-gradient(600px circle at ${spotXs}% ${spotYs}%, rgba(196,181,253,0.16), transparent 60%)`;

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      spotX.set(((e.clientX - r.left) / r.width) * 100);
      spotY.set(((e.clientY - r.top) / r.height) * 100);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [prefersReducedMotion, spotX, spotY]);

  return (
    <div className="relative overflow-hidden [@media(pointer:fine)]:cursor-none">
      <CustomCursor />

      {/* ================= ATMOSPHERE ================= */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-32 w-[32rem] h-[32rem] rounded-full bg-lavender-200/50 blur-[110px]"
          {...(!prefersReducedMotion && {
            animate: { x: [0, 30, 0], y: [0, 20, 0] },
            transition: { duration: 22, repeat: Infinity, ease: "easeInOut" },
          })}
        />
        <motion.div
          className="absolute top-10 right-[-10rem] w-[28rem] h-[28rem] rounded-full bg-rose-200/40 blur-[100px]"
          {...(!prefersReducedMotion && {
            animate: { x: [0, -25, 0], y: [0, 25, 0] },
            transition: { duration: 26, repeat: Infinity, ease: "easeInOut" },
          })}
        />
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.03)_1px,transparent_0)] [background-size:28px_28px] opacity-40" />
        {/* faint film grain for a filmic, non-flat surface */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.035] mix-blend-overlay">
          <filter id="dn-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#dn-grain)" />
        </svg>
      </div>

      {/* ================= HERO ================= */}
      <section
        ref={heroRef}
        className="relative max-w-6xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28"
      >
        {/* cursor-tracked spotlight */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: spotlightBg }}
        />

        <div className="grid md:grid-cols-2 gap-14 md:gap-10 items-center">
          {/* ---------- LEFT: copy ---------- */}
          <div className="text-center md:text-left">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="eyebrow mb-4"
            >
              AI Skin & Hair Intelligence
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-semibold leading-tight mb-6 tracking-tight"
            >
              Your skin, <span className="text-petal-500">understood</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-ink/60 max-w-xl mx-auto md:mx-0 mb-8"
            >
              Scan your skin and hair with your camera, get a
              dermatologist-style report in seconds, and follow a routine
              built for exactly what your skin needs today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-4"
            >
              <Magnetic strength={16} className="inline-block">
                <Link
                  to="/scan/skin"
                  className="btn-primary text-base px-8 py-3.5 relative overflow-hidden group"
                >
                  <span className="relative z-10 inline-flex items-center gap-2">
                    <HiOutlineSparkles /> Start your free scan
                  </span>
                  {/* gloss sweep on hover */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                </Link>
              </Magnetic>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-ink/45"
            >
              <span className="inline-flex items-center gap-1.5">
                <HiOutlineShieldCheck className="text-lavender-500" /> Private by design
              </span>
              <span className="inline-flex items-center gap-1.5">
                <HiOutlineLightningBolt className="text-lavender-500" /> Results in seconds
              </span>
            </motion.div>
          </div>

          {/* ---------- RIGHT: decorative AI face visual ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="relative mx-auto w-full max-w-sm md:max-w-md aspect-[4/5]"
          >
            <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-lavender-200/60 via-rose-100/40 to-transparent blur-3xl" />

            {/* hairline gradient border wrapper */}
            <div className="relative w-full h-full rounded-[2.5rem] p-[1px] bg-gradient-to-br from-white/80 via-lavender-200/60 to-rose-200/40 shadow-[0_25px_70px_-15px_rgba(120,100,170,0.4)]">
              <div
                data-cursor-hover
                className="relative w-full h-full rounded-[2.4rem] overflow-hidden border border-white/40 bg-white/30 backdrop-blur-xl"
              >
                {!imageFailed ? (
                  <img
                    src={HERO_FACE_SRC}
                    alt="AI skin analysis preview"
                    onError={() => setImageFailed(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-lavender-100 via-rose-50 to-white flex items-center justify-center">
                    <HiOutlineSparkles className="text-5xl text-lavender-300" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />

                {!prefersReducedMotion && (
                  <motion.div
                    className="absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-lavender-200/50 to-transparent"
                    animate={{ y: ["-30%", "130%"] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
                  />
                )}

                <svg
                  className="absolute inset-0 w-full h-full text-white/80"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <g stroke="currentColor" strokeWidth="0.2" opacity="0.5">
                    <line x1="38" y1="38" x2="50" y2="45" />
                    <line x1="62" y1="38" x2="50" y2="45" />
                    <line x1="50" y1="45" x2="50" y2="60" />
                    <line x1="50" y1="60" x2="40" y2="68" />
                    <line x1="50" y1="60" x2="60" y2="68" />
                  </g>
                  {[[38, 38], [62, 38], [50, 45], [50, 60], [40, 68], [60, 68]].map(
                    ([cx, cy], i) => (
                      <motion.circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r="0.9"
                        fill="white"
                        {...(!prefersReducedMotion && {
                          animate: { opacity: [0.4, 1, 0.4] },
                          transition: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
                        })}
                      />
                    )
                  )}
                </svg>

                <motion.svg
                  className="absolute top-5 left-5 w-10 h-10"
                  viewBox="0 0 40 40"
                  {...(!prefersReducedMotion && {
                    animate: { rotate: 360 },
                    transition: { duration: 18, repeat: Infinity, ease: "linear" },
                  })}
                >
                  <circle cx="20" cy="20" r="16" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />
                  <circle
                    cx="20" cy="20" r="16" fill="none" stroke="white" strokeWidth="1.5"
                    strokeDasharray="18 82" strokeLinecap="round"
                  />
                </motion.svg>
              </div>
            </div>

            <motion.div
              className="absolute -top-6 -right-4 md:-right-8"
              data-cursor-hover
              {...(!prefersReducedMotion && {
                animate: { y: [0, -8, 0] },
                transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              })}
            >
              <GlassCard className="!p-3.5 min-w-[9.5rem]" as="div">
                <p className="text-[11px] text-ink/50 mb-0.5">AI Skin Analysis</p>
                <p className="text-sm font-semibold text-lavender-600">98.4% Confidence</p>
              </GlassCard>
            </motion.div>

            <motion.div
              className="absolute top-1/3 -left-6 md:-left-10 hidden sm:block"
              data-cursor-hover
              {...(!prefersReducedMotion && {
                animate: { y: [0, 7, 0] },
                transition: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
              })}
            >
              <GlassCard className="!p-3 min-w-[8rem]" as="div">
                <p className="text-[11px] text-ink/50 mb-0.5">Skin Texture</p>
                <p className="text-xs font-medium text-ink/70">Analyzing…</p>
              </GlassCard>
            </motion.div>

            <motion.div
              className="absolute -bottom-5 left-6 md:left-10"
              data-cursor-hover
              {...(!prefersReducedMotion && {
                animate: { y: [0, -6, 0] },
                transition: { duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 },
              })}
            >
              <GlassCard className="!p-3.5 min-w-[8.5rem]" as="div">
                <p className="text-[11px] text-ink/50 mb-0.5">Hydration</p>
                <p className="text-sm font-semibold text-petal-500">76%</p>
              </GlassCard>
            </motion.div>

            <div className="absolute -bottom-4 -right-3 md:-right-6" data-cursor-hover>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/60 backdrop-blur-md border border-white/60 px-3 py-1.5 text-[11px] font-medium text-lavender-600 shadow-sm">
                <HiOutlineSparkles /> AI Powered
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          HOW IT WORKS
      ========================================= */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold">
            From scan to skincare.
          </h2>
          <p className="text-ink/50 mt-3 max-w-lg mx-auto">
            Three intelligent steps between you and a better understanding
            of your skin.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              number: "01",
              icon: HiOutlineCamera,
              title: "Scan",
              text: "Use your camera to capture a clear, guided image of your face.",
            },
            {
              number: "02",
              icon: HiOutlineSparkles,
              title: "Analyze",
              text: "Our AI analyzes visible skin characteristics and detects concerns.",
            },
            {
              number: "03",
              icon: HiOutlineHeart,
              title: "Personalize",
              text: "Turn your analysis into recommendations and a routine made for you.",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <GlassCard
                  className="relative group hover:-translate-y-1 transition-transform duration-300 h-full"
                  as="div"
                  data-cursor-hover
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs text-lavender-500">
                      {item.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-lavender-100 flex items-center justify-center text-lavender-600">
                      <Icon className="text-lg" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-ink/55">{item.text}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
