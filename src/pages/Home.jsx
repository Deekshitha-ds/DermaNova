import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
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
// Save the AI face-mesh graphic you provided to:
//   frontend/public/face-scan-mesh.png
// (same folder as logo3.png / robot.png — or update FACE_MESH_SRC
// below if you name it differently). It's recolored to lavender
// purely in CSS (hue-rotate + screen blend), so the exact source
// file's blue tones don't need to be edited — just drop it in.
// If it's missing, the line-art illustration renders instead, so
// the hero is never blank.
// ─────────────────────────────────────────────────────────────
const FACE_MESH_SRC = "/face-scan-mesh.png";

/* Shared check: is a custom cursor appropriate right now?
   Fine pointer (mouse/trackpad, not touch) AND motion is allowed.
   Both the wrapper (which hides the native cursor) and the
   CustomCursor component (which draws the replacement) key off
   this same value, so the two can never fall out of sync — you
   can't end up with no cursor at all. */
function useCustomCursorEnabled() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const fine = window.matchMedia?.("(pointer: fine)").matches;
    setEnabled(Boolean(fine) && !prefersReducedMotion);
  }, [prefersReducedMotion]);
  return enabled;
}

/* ============================================================
   CUSTOM CURSOR — an AI "viewfinder" reticle: four rotating
   corner brackets with a short comet-tail of trailing dots.
   Snaps tighter and shows a small label over tagged elements.
============================================================ */
function CustomCursor({ enabled }) {
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState(null);
  const [pressed, setPressed] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 300, damping: 30, mass: 0.4 });
  const ringY = useSpring(dotY, { stiffness: 300, damping: 30, mass: 0.4 });

  const tail0X = useSpring(dotX, { stiffness: 140, damping: 20, mass: 0.6 });
  const tail0Y = useSpring(dotY, { stiffness: 140, damping: 20, mass: 0.6 });
  const tail1X = useSpring(dotX, { stiffness: 80, damping: 20, mass: 0.9 });
  const tail1Y = useSpring(dotY, { stiffness: 80, damping: 20, mass: 0.9 });
  const tail2X = useSpring(dotX, { stiffness: 50, damping: 20, mass: 1.2 });
  const tail2Y = useSpring(dotY, { stiffness: 50, damping: 20, mass: 1.2 });
  const tail = [
    { x: tail0X, y: tail0Y, size: 5, opacity: 0.22 },
    { x: tail1X, y: tail1Y, size: 4, opacity: 0.16 },
    { x: tail2X, y: tail2Y, size: 3, opacity: 0.1 },
  ];

  useEffect(() => {
    if (!enabled) return;
    const move = (e) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      const el = e.target.closest?.("a, button, [data-cursor-hover], input, textarea");
      setHovering(Boolean(el));
      setLabel(el?.getAttribute?.("data-cursor-label") || null);
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
  }, [enabled, dotX, dotY]);

  if (!enabled) return null;
  const size = hovering ? 30 : 44;

  return (
    <>
      {tail.map((t, i) => (
        <motion.div
          key={i}
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-[99] rounded-full bg-lavender-400"
          style={{
            x: t.x,
            y: t.y,
            translateX: "-50%",
            translateY: "-50%",
            width: t.size,
            height: t.size,
            opacity: t.opacity,
          }}
        />
      ))}

      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100]"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: size, height: size }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.svg
          viewBox="0 0 44 44"
          className="w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          <motion.g
            stroke="rgb(139 92 246)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            animate={{ opacity: hovering ? 1 : 0.65 }}
          >
            <path d="M4 14 L4 4 L14 4" />
            <path d="M30 4 L40 4 L40 14" />
            <path d="M4 30 L4 40 L14 40" />
            <path d="M40 30 L40 40 L30 40" />
          </motion.g>
        </motion.svg>
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] w-1 h-1 rounded-full bg-lavender-600"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: pressed ? 0.5 : 1 }}
        transition={{ duration: 0.15 }}
      />

      <AnimatePresence>
        {label && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none fixed top-0 left-0 z-[100] rounded-full bg-ink text-white text-[10px] font-medium tracking-wide px-2 py-1 whitespace-nowrap"
            style={{ x: ringX, y: ringY, translateX: "20px", translateY: "20px" }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* Makes its child drift a few px toward the cursor while hovered. */
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
      data-cursor-label="Scan"
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   Self-contained line-art face illustration. Pure SVG, no
   external asset — bolder strokes and a real gradient "canvas"
   fill so the frame reads as designed, never as an empty hole.
============================================================ */
function FaceIllustration({ className = "" }) {
  return (
    <svg viewBox="0 0 100 130" className={className} fill="none" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="dn-face-fill" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#ddd6fe" stopOpacity="1" />
          <stop offset="55%" stopColor="#fbcfe8" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
        </radialGradient>
        <linearGradient id="dn-face-line" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* full-bleed canvas so the frame is never empty */}
      <rect x="0" y="0" width="100" height="130" fill="url(#dn-face-fill)" />

      <path
        d="M27 42 C24 22 36 9 50 9 C64 9 76 22 73 42"
        stroke="url(#dn-face-line)" strokeWidth="1.3" strokeLinecap="round"
      />
      <path
        d="M50 20 C38 20 30 30 30 44 C30 56 34 66 42 74 C46 78 54 78 58 74 C66 66 70 56 70 44 C70 30 62 20 50 20 Z"
        stroke="url(#dn-face-line)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M41 73 L36 92 C35 102 32 110 22 118 M59 73 L64 92 C65 102 68 110 78 118 M18 122 C30 110 70 110 82 122"
        stroke="url(#dn-face-line)" strokeWidth="1.3" strokeLinecap="round"
      />
      <path d="M39 46 C41 44 45 44 47 46" stroke="url(#dn-face-line)" strokeWidth="1" strokeLinecap="round" />
      <path d="M53 46 C55 44 59 44 61 46" stroke="url(#dn-face-line)" strokeWidth="1" strokeLinecap="round" />
      <path d="M50 51 C50 55 49 58 47 60" stroke="url(#dn-face-line)" strokeWidth="0.9" strokeLinecap="round" opacity="0.75" />
      <path d="M44 66 C47 68 53 68 56 66" stroke="url(#dn-face-line)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/* Wraps the photo frame with a subtle 3D lean toward the cursor —
   rotateX/rotateY driven by pointer position within the element,
   spring-smoothed, resetting to flat on mouse leave. */
function TiltFrame({ children, reducedMotion }) {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 15 });
  const sry = useSpring(ry, { stiffness: 150, damping: 15 });

  const onMove = (e) => {
    if (reducedMotion || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 14);
    rx.set(-py * 14);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
      className="relative w-full h-full"
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const cursorEnabled = useCustomCursorEnabled();
  const [photoStatus, setPhotoStatus] = useState("loading"); // loading | ok | failed
  const heroRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setPhotoStatus("ok");
    img.onerror = () => setPhotoStatus("failed");
    img.src = FACE_MESH_SRC;
  }, []);

  const spotX = useMotionValue(50);
  const spotY = useMotionValue(40);
  const spotXs = useSpring(spotX, { stiffness: 60, damping: 20 });
  const spotYs = useSpring(spotY, { stiffness: 60, damping: 20 });
  const spotlightBg = useMotionTemplate`radial-gradient(600px circle at ${spotXs}% ${spotYs}%, rgba(196,181,253,0.18), transparent 60%)`;

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
    <div className={`relative overflow-hidden ${cursorEnabled ? "cursor-none" : ""}`}>
      <CustomCursor enabled={cursorEnabled} />

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
        className="relative max-w-6xl mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: spotlightBg }}
        />

        <div className="grid md:grid-cols-2 gap-16 md:gap-10 items-center">
          {/* ---------- LEFT: copy ---------- */}
          <div className="min-w-0 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2 mb-5"
            >
              <span className="h-px w-6 bg-lavender-400/60" />
              <p className="eyebrow">AI Skin & Hair Intelligence</p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-semibold leading-[1.05] mb-6 tracking-tight"
            >
              Your skin, <span className="text-petal-500">understood</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-ink/60 max-w-xl mx-auto md:mx-0 mb-8 leading-relaxed"
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

          {/* ---------- RIGHT: AI face-scan mesh, recolored to theme ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="relative w-full max-w-[19rem] md:max-w-sm mx-auto aspect-[4/5] [perspective:1000px]"
          >
            <style>{`
              @keyframes dn-shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
              @keyframes dn-drift-a { 0%,100% { transform: translate(0,0); } 50% { transform: translate(6px,-10px); } }
              @keyframes dn-drift-b { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-8px,8px); } }
              @keyframes dn-scanlines { 0% { background-position: 0 0; } 100% { background-position: 0 40px; } }
              @keyframes dn-pulse-glow { 0%,100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 0.9; transform: scale(1.06); } }
            `}</style>

            <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-lavender-200/60 via-rose-100/40 to-transparent blur-3xl" />

            {/* pulsing glow behind the mesh */}
            {!prefersReducedMotion && (
              <div
                className="absolute inset-6 -z-10 rounded-full bg-lavender-300/50 blur-3xl"
                style={{ animation: "dn-pulse-glow 4.5s ease-in-out infinite" }}
              />
            )}

            <div className="hidden lg:flex absolute -left-10 top-1/2 -translate-y-1/2 -rotate-90 items-center gap-2 text-[10px] tracking-[0.25em] text-ink/35 uppercase">
              <span className="h-px w-5 bg-ink/20" /> AI Analysis
            </div>

            {/* drifting light particles around the frame */}
            {!prefersReducedMotion && (
              <>
                <span className="absolute -top-3 left-10 w-2 h-2 rounded-full bg-lavender-300/80 blur-[1px] [animation:dn-drift-a_7s_ease-in-out_infinite]" />
                <span className="absolute top-1/4 -right-4 w-1.5 h-1.5 rounded-full bg-rose-300/80 blur-[1px] [animation:dn-drift-b_9s_ease-in-out_infinite]" />
                <span className="absolute bottom-1/3 -left-3 w-1.5 h-1.5 rounded-full bg-lavender-400/70 blur-[1px] [animation:dn-drift-a_8s_ease-in-out_infinite]" />
                <span className="absolute -bottom-2 right-12 w-2 h-2 rounded-full bg-rose-200/80 blur-[1px] [animation:dn-drift-b_6s_ease-in-out_infinite]" />
              </>
            )}

            <TiltFrame reducedMotion={prefersReducedMotion}>
              {/* shimmering animated gradient border */}
              <div
                data-cursor-hover
                className="relative w-full h-full rounded-[2.5rem] p-[2px] shadow-[0_25px_70px_-15px_rgba(120,100,170,0.45)] bg-gradient-to-r from-lavender-300 via-rose-200 to-lavender-300 bg-[length:200%_200%]"
                style={!prefersReducedMotion ? { animation: "dn-shimmer 5s linear infinite" } : undefined}
              >
                {/* light lavender canvas behind the mesh — the image's
                    own dark background dissolves into this via the
                    screen blend mode below */}
                <div className="relative w-full h-full rounded-[2.4rem] overflow-hidden border border-white/40 bg-gradient-to-br from-lavender-100 via-white to-rose-50">
                  <FaceIllustration
                    className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
                      photoStatus === "ok" ? "opacity-0" : "opacity-100"
                    }`}
                  />

                  <AnimatePresence>
                    {photoStatus === "ok" && (
                      <motion.img
                        key="mesh"
                        src={FACE_MESH_SRC}
                        alt="AI facial analysis visualization"
                        initial={{ clipPath: "inset(0 100% 0 0)", scale: 1.08 }}
                        animate={{ clipPath: "inset(0 0% 0 0)", scale: 1 }}
                        transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
                        className="absolute inset-0 w-full h-full object-cover mix-blend-screen"
                        style={{ filter: "hue-rotate(75deg) saturate(1.4) brightness(1.15) contrast(1.05)" }}
                      />
                    )}
                  </AnimatePresence>

                  {/* faint moving scanline texture, on top of the mesh */}
                  {!prefersReducedMotion && photoStatus === "ok" && (
                    <div
                      className="absolute inset-0 opacity-[0.12] mix-blend-multiply"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to bottom, rgba(124,58,237,0.6) 0px, transparent 1px, transparent 4px)",
                        animation: "dn-scanlines 3s linear infinite",
                      }}
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/15" />

                  {!prefersReducedMotion && (
                    <motion.div
                      className="absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-white/50 to-transparent"
                      animate={{ y: ["-30%", "130%"] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
                    />
                  )}

                  <svg className="absolute inset-0 w-full h-full text-white" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <g stroke="currentColor" strokeWidth="0.25" opacity="0.6">
                      <line x1="38" y1="38" x2="50" y2="45" />
                      <line x1="62" y1="38" x2="50" y2="45" />
                      <line x1="50" y1="45" x2="50" y2="60" />
                      <line x1="50" y1="60" x2="40" y2="68" />
                      <line x1="50" y1="60" x2="60" y2="68" />
                    </g>
                    {[[38, 38], [62, 38], [50, 45], [50, 60], [40, 68], [60, 68]].map(([cx, cy], i) => (
                      <motion.circle
                        key={i} cx={cx} cy={cy} r="1" fill="white"
                        {...(!prefersReducedMotion && {
                          animate: { opacity: [0.5, 1, 0.5] },
                          transition: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
                        })}
                      />
                    ))}
                  </svg>

                  <motion.svg
                    className="absolute top-5 left-5 w-10 h-10"
                    viewBox="0 0 40 40"
                    {...(!prefersReducedMotion && {
                      animate: { rotate: 360 },
                      transition: { duration: 18, repeat: Infinity, ease: "linear" },
                    })}
                  >
                    <circle cx="20" cy="20" r="16" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
                    <circle cx="20" cy="20" r="16" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="18 82" strokeLinecap="round" />
                  </motion.svg>
                </div>
              </div>
            </TiltFrame>

            {/* floating cards sit outside TiltFrame, so they hover-bob
                independently rather than tilting with the photo */}
            <motion.div
              className="absolute -top-5 -right-3 md:-right-6 z-20"
              data-cursor-hover
              {...(!prefersReducedMotion && {
                animate: { y: [0, -8, 0] },
                transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              })}
            >
              <GlassCard className="!p-3.5 min-w-[9.5rem] border-t border-white/70" as="div">
                <p className="text-[11px] text-ink/50 mb-0.5">AI Skin Analysis</p>
                <p className="text-sm font-semibold text-lavender-600">98.4% Confidence</p>
              </GlassCard>
            </motion.div>

            <motion.div
              className="absolute top-8 -left-4 md:-left-8 z-20 hidden sm:block"
              data-cursor-hover
              {...(!prefersReducedMotion && {
                animate: { y: [0, 7, 0] },
                transition: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
              })}
            >
              <GlassCard className="!p-3 min-w-[8rem] border-t border-white/70" as="div">
                <p className="text-[11px] text-ink/50 mb-0.5">Skin Texture</p>
                <p className="text-xs font-medium text-ink/70">Analyzing…</p>
              </GlassCard>
            </motion.div>

            <motion.div
              className="absolute -bottom-5 left-4 md:left-8 z-20"
              data-cursor-hover
              {...(!prefersReducedMotion && {
                animate: { y: [0, -6, 0] },
                transition: { duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 },
              })}
            >
              <GlassCard className="!p-3.5 min-w-[8.5rem] border-t border-white/70" as="div">
                <p className="text-[11px] text-ink/50 mb-0.5">Hydration</p>
                <p className="text-sm font-semibold text-petal-500">76%</p>
              </GlassCard>
            </motion.div>

            <div className="absolute -bottom-4 -right-3 md:-right-5 z-20" data-cursor-hover>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/70 backdrop-blur-md border border-white/60 px-3 py-1.5 text-[11px] font-medium text-lavender-600 shadow-sm">
                <HiOutlineSparkles /> AI Powered
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-lavender-200/70 to-transparent" />
      </div>

      {/* =========================================
          HOW IT WORKS
      ========================================= */}
      <section className="max-w-6xl mx-auto px-4 py-20 md:py-24">
        <div className="relative rounded-[3rem] border border-white/50 bg-white/40 backdrop-blur-sm shadow-[0_20px_60px_-30px_rgba(120,100,170,0.3)] px-6 py-14 md:px-14 md:py-16 overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-lavender-200/40 blur-[90px]" />

          <div className="relative text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-3 text-[10px] tracking-[0.25em] text-lavender-500 uppercase font-medium">
              <span className="h-px w-5 bg-lavender-400/60" /> Process
              <span className="h-px w-5 bg-lavender-400/60" />
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold">From scan to skincare.</h2>
            <p className="text-ink/50 mt-3 max-w-lg mx-auto">
              Three intelligent steps between you and a better understanding
              of your skin.
            </p>
          </div>

          <div className="relative grid md:grid-cols-3 gap-5">
            {[
              { number: "01", icon: HiOutlineCamera, title: "Scan", text: "Use your camera to capture a clear, guided image of your face." },
              { number: "02", icon: HiOutlineSparkles, title: "Analyze", text: "Our AI analyzes visible skin characteristics and detects concerns." },
              { number: "03", icon: HiOutlineHeart, title: "Personalize", text: "Turn your analysis into recommendations and a routine made for you." },
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
                    className="relative group hover:-translate-y-1 transition-transform duration-300 h-full border-t border-white/70"
                    as="div"
                    data-cursor-hover
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-xs text-lavender-500">{item.number}</span>
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
        </div>
      </section>
    </div>
  );
}
