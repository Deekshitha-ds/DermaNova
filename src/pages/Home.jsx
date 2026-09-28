import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion, animate, useReducedMotion, useMotionValue, useSpring, useTransform,
} from "framer-motion";
import GlassCard from "../components/GlassCard.jsx";
import {
  HiOutlineSparkles, HiOutlineCamera, HiOutlineHeart, HiOutlineShieldCheck,
  HiOutlineLightningBolt, HiOutlineArrowRight, HiOutlineEmojiHappy,
  HiOutlineScissors, HiOutlineChatAlt2, HiCheck,
} from "react-icons/hi";

// ─────────────────────────────────────────────────────────────
// Save the hero portrait (the woman, cropped from your reference,
// ideally a transparent PNG/WebP) to: frontend/public/hero-woman.png
// If it's missing, a line-art illustration renders instead.
// ─────────────────────────────────────────────────────────────
const HERO_SRC = "/hero-woman.png";

/* ---------- small helpers ---------- */

function Magnetic({ children, strength = 14, className = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });
  const onMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * strength);
    y.set(((e.clientY - r.top) / r.height - 0.5) * strength);
  };
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }} style={{ x: sx, y: sy }} className={className}>
      {children}
    </motion.div>
  );
}

function FaceIllustration({ className = "" }) {
  return (
    <svg viewBox="0 0 100 130" className={className} fill="none" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="dn-line" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <path d="M27 42 C24 22 36 9 50 9 C64 9 76 22 73 42" stroke="url(#dn-line)" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M50 20 C38 20 30 30 30 44 C30 56 34 66 42 74 C46 78 54 78 58 74 C66 66 70 56 70 44 C70 30 62 20 50 20 Z" stroke="url(#dn-line)" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M41 73 L36 92 C35 102 32 110 22 118 M59 73 L64 92 C65 102 68 110 78 118" stroke="url(#dn-line)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/* 3D petals tumbling down the hero */
const PETALS = [
  { left: "8%", size: 26, delay: 0, dur: 16 }, { left: "24%", size: 18, delay: 4, dur: 19 },
  { left: "52%", size: 22, delay: 2, dur: 17 }, { left: "70%", size: 30, delay: 6, dur: 21 },
  { left: "86%", size: 20, delay: 1, dur: 18 }, { left: "40%", size: 16, delay: 9, dur: 20 },
];
function Petals() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden" style={{ perspective: 800 }} aria-hidden>
      {PETALS.map((p, i) => (
        <motion.span
          key={i}
          className="absolute -top-10 block bg-gradient-to-br from-pink-200 to-fuchsia-300/80 shadow-[0_6px_14px_-4px_rgba(217,70,239,0.35)]"
          style={{ left: p.left, width: p.size, height: p.size * 1.4, borderRadius: "80% 0 80% 0", transformStyle: "preserve-3d" }}
          animate={{ y: ["0vh", "105vh"], x: [0, 40, -30, 20], rotateX: [0, 360], rotateY: [0, 300], rotateZ: [0, 180], opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

/* animated confidence ring */
function ConfidenceRing({ reduce }) {
  const [val, setVal] = useState(reduce ? 98.4 : 0);
  useEffect(() => {
    if (reduce) return;
    const c = animate(0, 98.4, { duration: 2.2, delay: 0.9, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setVal(v) });
    return () => c.stop();
  }, [reduce]);
  const C = 2 * Math.PI * 42;
  return (
    <div className="relative w-[92px] h-[92px] shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id="dn-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="42" fill="none" stroke="#ede9fe" strokeWidth="7" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="url(#dn-ring)" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - val / 100)} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-[17px] font-semibold text-violet-900 tabular-nums">{val.toFixed(1)}%</span>
        <span className="text-[9px] text-violet-500 mt-1">Confidence</span>
      </div>
    </div>
  );
}

const glass =
  "rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_30px_60px_-20px_rgba(124,58,237,0.35),inset_0_1px_0_rgba(255,255,255,0.9)]";

const FEATURES = [
  { icon: HiOutlineEmojiHappy, label: "Skin Analysis" },
  { icon: HiOutlineScissors, label: "Hair Analysis" },
  { icon: HiOutlineHeart, label: "Personalized Recommendations" },
  { icon: HiOutlineChatAlt2, label: "AI Assistant" },
];

export default function Home() {
  const reduce = useReducedMotion();
  const [photo, setPhoto] = useState("loading");
  const stageRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setPhoto("ok");
    img.onerror = () => {
      console.warn(`Hero photo not found at ${HERO_SRC}. Put the file in frontend/public/ named exactly hero-woman.png`);
      setPhoto("failed");
    };
    img.src = HERO_SRC;
  }, []);

  /* ---- 3D tilt: pointer position → spring rotation + per-layer parallax ---- */
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 16 });
  const sy = useSpring(my, { stiffness: 90, damping: 16 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [9, -9]);
  const farX = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const nearX = useTransform(sx, [-0.5, 0.5], [26, -26]);
  const nearY = useTransform(sy, [-0.5, 0.5], [16, -16]);
  const midX = useTransform(sx, [-0.5, 0.5], [6, -6]);

  const onMove = (e) => {
    if (reduce || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const float = (amp, dur, delay = 0) =>
    reduce ? {} : { animate: { y: [0, -amp, 0] }, transition: { duration: dur, repeat: Infinity, ease: "easeInOut", delay } };

  return (
    <div className="relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,600&display=swap');
        .dn-serif { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        @keyframes dn-sheen { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        @keyframes dn-pulse { 0%,100% { opacity: .5; transform: scale(1); } 50% { opacity: .9; transform: scale(1.06); } }
        @keyframes dn-ping { 0% { transform: scale(1); opacity: .7; } 100% { transform: scale(2.6); opacity: 0; } }
        .dn-grad-text { background: linear-gradient(100deg,#c026d3,#ec4899,#a78bfa,#ec4899,#c026d3); background-size: 200% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: dn-sheen 6s linear infinite; }
      `}</style>

      {/* ================= ATMOSPHERE ================= */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-violet-50 via-fuchsia-50/60 to-purple-100/70">
        <motion.div className="absolute -top-40 -left-32 w-[34rem] h-[34rem] rounded-full bg-violet-300/40 blur-[110px]"
          {...(!reduce && { animate: { x: [0, 40, 0], y: [0, 30, 0] }, transition: { duration: 22, repeat: Infinity, ease: "easeInOut" } })} />
        <motion.div className="absolute top-20 right-[-8rem] w-[30rem] h-[30rem] rounded-full bg-pink-300/40 blur-[110px]"
          {...(!reduce && { animate: { x: [0, -35, 0], y: [0, 30, 0] }, transition: { duration: 26, repeat: Infinity, ease: "easeInOut" } })} />
        <div className="absolute bottom-[-8rem] left-1/3 w-[26rem] h-[26rem] rounded-full bg-purple-300/40 blur-[110px]" />
      </div>
      {!reduce && <Petals />}

      {/* ================= HERO ================= */}
      <section className="relative max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-4 items-center">

          {/* ---------- LEFT: copy ---------- */}
          <div className="min-w-0 text-center lg:text-left">
            <motion.p initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 mb-6 text-xs tracking-[0.3em] text-violet-400 font-mono uppercase">
              <span className="h-px w-9 bg-violet-300" /> AI Skin &amp; Hair Intelligence
            </motion.p>

            <h1 className="dn-serif text-5xl sm:text-6xl xl:text-[4.5rem] font-semibold leading-[1.02] tracking-tight mb-7" style={{ perspective: 600 }}>
              {["Your", "skin,"].map((w, i) => (
                <motion.span key={w} className="inline-block mr-4 text-violet-950"
                  initial={{ opacity: 0, y: 40, rotateX: -70 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "50% 100%" }}>{w}</motion.span>
              ))}
              <br />
              <motion.span className="dn-serif dn-grad-text italic inline-block pr-2"
                initial={{ opacity: 0, y: 40, rotateX: -70 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.9, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "50% 100%" }}>understood</motion.span>
              <motion.span className="text-violet-950" initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 1.1, type: "spring", stiffness: 300, damping: 12 }}>.</motion.span>
            </h1>

            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="text-lg text-violet-950/55 max-w-xl mx-auto lg:mx-0 mb-9 leading-relaxed">
              Scan your skin and hair with your camera, get a dermatologist-style report in seconds,
              and follow a routine built for exactly what your skin needs today.
            </motion.p>

            <motion.ul initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
              className="flex flex-wrap xl:flex-nowrap items-center justify-center lg:justify-start gap-y-3 mb-9 text-sm text-violet-950/55">
              {FEATURES.map(({ icon: Icon, label }, i) => (
                <li key={label} className={`flex items-center gap-2.5 px-4 ${i > 0 ? "lg:border-l lg:border-violet-200" : "lg:pl-0"}`}>
                  <Icon className="text-2xl text-violet-400 shrink-0" />
                  <span className="max-w-[8rem] leading-tight">{label}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4">
              <Magnetic strength={18} className="inline-block">
                <Link to="/scan/skin"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-400 px-9 py-4 text-lg font-medium text-white shadow-[0_18px_40px_-12px_rgba(139,92,246,0.7)] transition-shadow duration-300 hover:shadow-[0_24px_50px_-10px_rgba(192,38,211,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-500">
                  {!reduce && <span className="absolute inset-0 rounded-full bg-violet-400/40" style={{ animation: "dn-ping 2.6s ease-out infinite" }} />}
                  <span className="relative z-10 inline-flex items-center gap-3">
                    <HiOutlineSparkles className="text-xl" /> Start your free scan
                    <HiOutlineArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                </Link>
              </Magnetic>
              <div className="flex flex-col gap-1.5 text-sm text-violet-950/45">
                <span className="inline-flex items-center gap-1.5"><HiOutlineShieldCheck className="text-violet-500" /> Private by design</span>
                <span className="inline-flex items-center gap-1.5"><HiOutlineLightningBolt className="text-violet-500" /> Results in seconds</span>
              </div>
            </motion.div>
          </div>

          {/* ---------- RIGHT: 3D stage ---------- */}
          <div ref={stageRef} onMouseMove={onMove} onMouseLeave={onLeave}
            className="relative mx-auto w-full max-w-[600px]" style={{ perspective: 1300, height: "clamp(420px, 74vh, 640px)" }}>
            <motion.div className="absolute inset-0" style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              initial={{ opacity: 0, scale: 0.92, rotateY: -20 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}>

              {/* back: soft glass disc + glow (deep) */}
              <motion.div className="absolute right-[2%] top-[6%] aspect-square w-[88%] rounded-full border border-white/70 bg-gradient-to-br from-white/70 via-violet-100/50 to-pink-100/40 shadow-[0_40px_90px_-30px_rgba(124,58,237,0.45)]"
                style={{ translateZ: -90, x: farX }} />
              {!reduce && <div className="absolute right-[10%] top-[16%] aspect-square w-[62%] rounded-full bg-fuchsia-300/40 blur-3xl" style={{ transform: "translateZ(-60px)", animation: "dn-pulse 4.5s ease-in-out infinite" }} />}

              {/* portrait: sized by height, never cropped into a shape */}
              <motion.div className="absolute bottom-0 right-[6%] h-[100%] overflow-hidden"
                style={{ aspectRatio: "930 / 1452", translateZ: 0, x: midX,
                  maskImage: "radial-gradient(ellipse 72% 78% at 50% 44%, #000 62%, transparent 100%)",
                  WebkitMaskImage: "radial-gradient(ellipse 72% 78% at 50% 44%, #000 62%, transparent 100%)" }}>
                {photo === "ok" && (
                  <motion.img src={HERO_SRC} alt="Woman touching her cheek while her skin is scanned by AI" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
                    className="h-full w-full object-contain object-bottom" />
                )}
                {photo === "loading" && (
                  <div className="h-full w-full bg-gradient-to-br from-violet-100 via-pink-100 to-violet-100 animate-pulse" />
                )}
                {photo === "failed" && (
                  <FaceIllustration className="h-full w-full opacity-80" />
                )}

                {/* AI scan overlay */}
                {!reduce && (
                  <>
                    <motion.div className="absolute inset-x-0 h-1/5 bg-gradient-to-b from-transparent via-violet-300/40 to-transparent"
                      animate={{ y: ["-30%", "520%"] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }} />
                    <motion.div className="absolute inset-x-[10%] h-px bg-white shadow-[0_0_18px_4px_rgba(192,132,252,0.9)]"
                      animate={{ top: ["12%", "68%", "12%"] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} />
                  </>
                )}
              </motion.div>


              {/* Skin Analysis card (near) */}
              <motion.div className="absolute left-[-4%] top-[8%] z-20 w-[54%] sm:w-[46%]" style={{ translateZ: 110, x: nearX, y: nearY }}>
                <motion.div {...float(8, 6)} className={`${glass} p-4`}>
                  <p className="text-sm text-violet-950/60 mb-3">Skin Analysis</p>
                  <div className="flex items-center gap-4">
                    <ConfidenceRing reduce={reduce} />
                    <ul className="space-y-1.5 text-[11px] text-violet-950/55">
                      {["Blackheads", "Dark Spots", "Acne", "Pores"].map((t, i) => (
                        <motion.li key={t} className="flex items-center gap-1.5" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 + i * 0.15 }}>
                          <HiCheck className="text-violet-500" /> {t}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>

              {/* Recommended card (near) */}
              <motion.div className="absolute right-[-4%] bottom-[4%] z-20 w-[58%] sm:w-[48%]" style={{ translateZ: 100, x: nearX, y: nearY }}>
                <motion.div {...float(7, 6.5, 0.3)} className={`${glass} p-4`}>
                  <p className="text-sm font-medium text-violet-950 mb-2">Recommended For You</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-end gap-1" aria-hidden>
                      <span className="h-14 w-5 rounded-md bg-gradient-to-b from-violet-200 to-violet-400 shadow" />
                      <span className="h-9 w-7 rounded-md bg-gradient-to-b from-pink-100 to-fuchsia-300 shadow" />
                    </div>
                    <ul className="flex-1 space-y-1 text-[11px] text-violet-950/55">
                      {["Dermatologist-tested", "Budget-matched", "Personalized for you"].map((t) => (
                        <li key={t} className="flex items-center gap-1.5"><HiCheck className="text-violet-500" /> {t}</li>
                      ))}
                    </ul>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-violet-400 text-white"><HiOutlineArrowRight /></span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-violet-200/80 to-transparent" />
      </div>

      {/* ================= HOW IT WORKS ================= */}
      <section className="max-w-6xl mx-auto px-4 py-20 md:py-24">
        <div className="relative rounded-[3rem] border border-white/60 bg-white/50 backdrop-blur-sm shadow-[0_20px_60px_-30px_rgba(120,100,170,0.3)] px-6 py-14 md:px-14 md:py-16 overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-violet-200/40 blur-[90px]" />
          <div className="relative text-center mb-12">
            <h2 className="dn-serif text-3xl md:text-5xl font-semibold text-violet-950">From scan to skincare.</h2>
            <p className="text-violet-950/50 mt-3 max-w-lg mx-auto">Three intelligent steps between you and a better understanding of your skin.</p>
          </div>

          <div className="relative grid md:grid-cols-3 gap-6" style={{ perspective: 1000 }}>
            {[
              { number: "01", icon: HiOutlineCamera, title: "Scan", text: "Use your camera to capture a clear, guided image of your face." },
              { number: "02", icon: HiOutlineSparkles, title: "Analyze", text: "Our AI analyzes visible skin characteristics and detects concerns." },
              { number: "03", icon: HiOutlineHeart, title: "Personalize", text: "Turn your analysis into recommendations and a routine made for you." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.number}
                  initial={{ opacity: 0, y: 40, rotateX: -18 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={reduce ? undefined : { y: -8, rotateX: 6, rotateY: -5, scale: 1.02 }}
                  style={{ transformStyle: "preserve-3d" }}>
                  <GlassCard className="relative h-full border-t border-white/70" as="div">
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-xs text-violet-500">{item.number}</span>
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center text-violet-600" style={{ transform: "translateZ(30px)" }}>
                        <Icon className="text-xl" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-violet-950">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-violet-950/55">{item.text}</p>
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
