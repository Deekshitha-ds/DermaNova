import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { HiOutlineCamera, HiOutlinePhotograph } from "react-icons/hi";

const EASE = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------
   DATA HOOKS
   Nothing here is invented: with no scan data yet, the page shows
   honest empty states. When your API is ready, fill `scannedDays`
   (dates as "YYYY-MM-DD") and the week strip lights up by itself.
------------------------------------------------------- */

const scannedDays = new Set(); // e.g. new Set(["2026-10-19"])

const toKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const getGreeting = (hour) =>
  hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

function getWeek(today) {
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return {
      key: toKey(date),
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      day: date.getDate(),
      isToday: toKey(date) === toKey(today),
      scanned: scannedDays.has(toKey(date)),
    };
  });
}

/* -------------------------------------------------------
   PETALS (kept from your original, quieter)
------------------------------------------------------- */

const PETALS = [
  { left: "8%", size: 24, delay: 0, dur: 18 },
  { left: "30%", size: 16, delay: 5, dur: 21 },
  { left: "64%", size: 26, delay: 3, dur: 19 },
  { left: "88%", size: 18, delay: 8, dur: 22 },
];

function Petals() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden"
      style={{ perspective: 800 }}
      aria-hidden
    >
      {PETALS.map((p, i) => (
        <motion.span
          key={i}
          className="absolute -top-10 block bg-gradient-to-br from-pink-200 to-fuchsia-300/80 shadow-[0_6px_14px_-4px_rgba(217,70,239,0.3)]"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 1.4,
            borderRadius: "80% 0 80% 0",
            transformStyle: "preserve-3d",
          }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, 40, -30, 20],
            rotateX: [0, 360],
            rotateY: [0, 300],
            rotateZ: [0, 180],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------
   THE ONE MEMORABLE THING: a model face being read by a scan line
------------------------------------------------------- */

function ScanPortal() {
  const T = "translate(160 164) scale(1.5) translate(-170 -81.5)";

  return (
    <svg
      viewBox="0 0 320 320"
      fill="none"
      className="h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="dnd-glow" cx=".5" cy=".5" r=".5">
          <stop stopColor="#FFFFFF" stopOpacity=".95" />
          <stop offset=".6" stopColor="#F3E8FF" stopOpacity=".55" />
          <stop offset="1" stopColor="#F3E8FF" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="dnd-skin" x1="140" y1="30" x2="205" y2="132" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset=".45" stopColor="#F5ECFB" />
          <stop offset="1" stopColor="#DECBF0" />
        </linearGradient>

        <linearGradient id="dnd-shade" x1="133" y1="0" x2="207" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B99BD6" stopOpacity=".2" />
          <stop offset=".25" stopColor="#B99BD6" stopOpacity="0" />
          <stop offset=".6" stopColor="#B99BD6" stopOpacity="0" />
          <stop offset="1" stopColor="#A481C8" stopOpacity=".46" />
        </linearGradient>

        <linearGradient id="dnd-jaw" x1="0" y1="110" x2="0" y2="135" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B99BD6" stopOpacity="0" />
          <stop offset="1" stopColor="#B99BD6" stopOpacity=".34" />
        </linearGradient>

        <linearGradient id="dnd-rim" x1="133" y1="0" x2="207" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E3D2F3" />
          <stop offset=".55" stopColor="#EBDDF7" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>

        <radialGradient id="dnd-sheen" cx=".5" cy=".5" r=".5">
          <stop stopColor="#FFFFFF" stopOpacity=".95" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="dnd-band" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#D946EF" stopOpacity="0" />
          <stop offset="1" stopColor="#D946EF" stopOpacity=".34" />
        </linearGradient>

        <linearGradient id="dnd-line" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#C45BE8" stopOpacity="0" />
          <stop offset=".5" stopColor="#C45BE8" stopOpacity=".95" />
          <stop offset="1" stopColor="#C45BE8" stopOpacity="0" />
        </linearGradient>

        <filter id="dnd-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>

        <path
          id="dnd-face"
          d="M170 28 C193 28 207 46 207 72 C207 90 204 102 199 112 C194 122 187 130 178 133.5 C175 134.6 172.5 135 170 135 C167.5 135 165 134.6 162 133.5 C153 130 146 122 141 112 C136 102 133 90 133 72 C133 46 147 28 170 28 Z"
        />
        <clipPath id="dnd-clip">
          <use href="#dnd-face" transform={T} />
        </clipPath>
        <clipPath id="dnd-local">
          <use href="#dnd-face" />
        </clipPath>
      </defs>

      <circle cx="160" cy="160" r="156" fill="url(#dnd-glow)" />

      {/* rings and orbiting light */}
      <circle cx="160" cy="164" r="138" stroke="#D5C2EE" strokeWidth=".9" opacity=".8" />
      <circle cx="160" cy="164" r="112" stroke="#E4D8F5" strokeWidth=".8" opacity=".8" />
      <circle cx="160" cy="164" r="150" stroke="#E2D5F4" strokeWidth=".7" strokeDasharray="1.5 6" opacity=".7" />
      <g className="dn-orbit">
        <circle cx="160" cy="164" r="138" stroke="#C45BE8" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="46 821" opacity=".55" />
        <circle cx="290.4" cy="209.2" r="2.8" fill="#D24BE0" />
        <circle cx="290.4" cy="209.2" r="6.5" fill="#D24BE0" opacity=".18" />
      </g>

      {/* floor shadow */}
      <ellipse cx="160" cy="262" rx="50" ry="5" fill="#6E4FB5" opacity=".16" filter="url(#dnd-soft)" />

      {/* face */}
      <g transform={T}>
        <use href="#dnd-face" fill="url(#dnd-skin)" stroke="url(#dnd-rim)" strokeWidth="1" strokeLinejoin="round" />

        <g clipPath="url(#dnd-local)">
          <use href="#dnd-face" fill="url(#dnd-shade)" />
          <use href="#dnd-face" fill="url(#dnd-jaw)" />
          <ellipse cx="156" cy="46" rx="22" ry="13" fill="url(#dnd-sheen)" />
          <g filter="url(#dnd-soft)">
            <path d="M139 94 Q144 110 158 120" stroke="#B99BD6" strokeWidth="6" strokeLinecap="round" opacity=".2" />
            <path d="M201 94 Q196 110 182 120" stroke="#9E7CC6" strokeWidth="6" strokeLinecap="round" opacity=".32" />
            <ellipse cx="137" cy="60" rx="5" ry="12" fill="#B99BD6" opacity=".2" />
            <ellipse cx="203" cy="60" rx="5" ry="12" fill="#9E7CC6" opacity=".3" />
            <ellipse cx="169" cy="87" rx="1.8" ry="9" fill="#FFFFFF" opacity=".65" />
            <ellipse cx="169" cy="98" rx="3" ry="1.8" fill="#FFFFFF" opacity=".55" />
            <ellipse cx="148" cy="90" rx="6" ry="3" fill="#FFFFFF" opacity=".5" transform="rotate(-25 148 90)" />
            <ellipse cx="168" cy="128" rx="6" ry="2.6" fill="#FFFFFF" opacity=".45" />
          </g>
          <path d="M148 46 Q158 36 176 34" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity=".75" />
        </g>

        <path d="M149 67 Q157 63.5 165 65.5" stroke="#BBA3CB" strokeWidth="1.2" strokeLinecap="round" opacity=".55" />
        <path d="M175 65.5 Q183 63.5 191 67" stroke="#A58DB8" strokeWidth="1.2" strokeLinecap="round" opacity=".5" />
        <path d="M150 76 Q157 79.2 164 76" stroke="#A58DB8" strokeWidth="1.15" strokeLinecap="round" />
        <path d="M176 76 Q183 79.2 190 76" stroke="#9479AC" strokeWidth="1.15" strokeLinecap="round" />
        <path d="M166.5 70 Q165 84 164.5 96" stroke="#D5BCDB" strokeWidth=".9" strokeLinecap="round" opacity=".5" />
        <path d="M173.5 70 Q175 84 175.5 96" stroke="#B79CCB" strokeWidth=".9" strokeLinecap="round" opacity=".5" />
        <path d="M164 98 C164.5 101.5 167 102.5 170 102.5 C173 102.5 175.5 101.5 176 98" stroke="#BF9FC7" strokeWidth=".95" strokeLinecap="round" />
        <path d="M160 114 C164 112.2 167 111.4 170 112.2 C173 111.4 176 112.2 180 114 C176 115.6 173 116 170 116 C167 116 164 115.6 160 114 Z" fill="#D8C4E5" opacity=".75" />
        <path d="M160.5 114.6 C164 116 167 116.3 170 116.3 C173 116.3 176 116 179.5 114.6 C177 119.6 173.5 120.6 170 120.6 C166.5 120.6 163 119.6 160.5 114.6 Z" fill="#E3D3EE" opacity=".8" />
        <path d="M160 114.2 C164 115.6 167 116 170 116 C173 116 176 115.6 180 114.2" stroke="#B9A0CB" strokeWidth=".85" strokeLinecap="round" />
      </g>

      {/* scan: glow stays on the face, the line crosses the whole frame */}
      <g clipPath="url(#dnd-clip)">
        <g className="dn-scan">
          <rect x="90" y="-54" width="140" height="54" fill="url(#dnd-band)" />
        </g>
      </g>
      <g className="dn-scan">
        <rect x="26" y="-.75" width="268" height="1.5" fill="url(#dnd-line)" />
      </g>
    </svg>
  );
}

/* -------------------------------------------------------
   SMALL PIECES
------------------------------------------------------- */

function SkinGlyph() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7" aria-hidden="true">
      <path
        d="M16 4.5c4.6 0 7.4 3.3 7.4 8 0 3.2-.8 5.6-2.3 7.6-1.2 1.6-3 2.9-5.1 2.9s-3.9-1.3-5.1-2.9c-1.5-2-2.3-4.4-2.3-7.6 0-4.7 2.8-8 7.4-8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12.6 13.2c1 .7 2 .7 3 0M17.4 13.2c1 .7 2 .7 3 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M13.5 19.2c1.7 1 3.3 1 5 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M6 7V5.5A1.5 1.5 0 0 1 7.5 4H9M23 4h1.5A1.5 1.5 0 0 1 26 5.5V7M26 25v1.5a1.5 1.5 0 0 1-1.5 1.5H23M9 28H7.5A1.5 1.5 0 0 1 6 26.5V25" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity=".55" />
    </svg>
  );
}

function HairGlyph() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7" aria-hidden="true">
      <path d="M10 5c-2 5 3 7 1 13s-3 7-3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 4c-2.4 5.6 3.2 8 1 14.4-1.2 3.6-2.4 6-2.4 9.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 5c-2 5 3 7 1 13s-3 7-3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

const primaryBtn =
  "inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-400 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_-12px_rgba(147,51,234,0.8)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgba(147,51,234,0.8)] focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300 focus-visible:ring-offset-2";

const secondaryBtn =
  "inline-flex items-center gap-2 rounded-2xl border border-violet-200/80 bg-white/70 px-5 py-3 text-sm font-semibold text-violet-800 transition hover:border-fuchsia-200 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2";

function ScanOption({ glyph, title, status, text, children }) {
  return (
    <div className="flex flex-col p-7 sm:p-9">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-violet-200/70 bg-gradient-to-br from-white to-violet-50 text-violet-600 shadow-[0_8px_20px_-12px_rgba(124,58,237,.5)]">
          {glyph}
        </span>
        <div>
          <h3 className="dn-serif text-2xl font-medium text-violet-950">{title}</h3>
          <p className="mt-0.5 flex items-center gap-2 text-sm text-violet-900/55">
            <span className="h-2 w-2 rounded-full border border-fuchsia-400" aria-hidden />
            {status}
          </p>
        </div>
      </div>

      <p className="mt-5 max-w-sm text-[15px] leading-7 text-violet-900/65">{text}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function GhostChart() {
  return (
    <svg viewBox="0 0 520 130" fill="none" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="dnd-ghost-line" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#A78BFA" />
          <stop offset="1" stopColor="#E879F9" />
        </linearGradient>
        <linearGradient id="dnd-ghost-fill" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#C4A5FA" stopOpacity=".28" />
          <stop offset="1" stopColor="#C4A5FA" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[24, 58, 92].map((y) => (
        <path key={y} d={`M8 ${y} H512`} stroke="#E4D8F5" strokeWidth="1" strokeDasharray="2 5" />
      ))}
      <path
        d="M16 98 C78 94 114 76 179 80 S280 48 345 54 S458 28 504 34 V122 H16 Z"
        fill="url(#dnd-ghost-fill)"
      />
      <path
        d="M16 98 C78 94 114 76 179 80 S280 48 345 54 S458 28 504 34"
        stroke="url(#dnd-ghost-line)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 7"
        opacity=".85"
      />
      <circle cx="504" cy="34" r="4" fill="#FFFFFF" stroke="#C45BE8" strokeWidth="1.4" />
    </svg>
  );
}

/* -------------------------------------------------------
   PAGE
------------------------------------------------------- */

export default function Dashboard() {
  const { user } = useAuth();
  const reduce = useReducedMotion();

  const now = new Date();
  const greeting = getGreeting(now.getHours());
  const firstName = user?.name?.split(" ")[0] || "there";
  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const week = getWeek(now);
  const scannedCount = week.filter((d) => d.scanned).length;

  const lines = [`${greeting},`, `${firstName}.`];

  return (
    <div className="dn-dash relative min-h-screen overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap');

        .dn-dash .dn-serif {
          font-family: 'Fraunces', Georgia, serif;
          font-optical-sizing: auto;
        }

        .dn-dash .dn-glass {
          border: 1px solid rgba(255,255,255,.85);
          background: linear-gradient(180deg, rgba(255,255,255,.82), rgba(255,255,255,.6));
          box-shadow:
            0 1px 0 rgba(255,255,255,.95) inset,
            0 40px 80px -40px rgba(124,58,237,.32);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
        }

        @keyframes dn-scan {
          0%   { transform: translateY(78px);  opacity: 0; }
          8%   { opacity: 1; }
          52%  { transform: translateY(250px); opacity: 1; }
          60%  { transform: translateY(254px); opacity: 0; }
          100% { transform: translateY(78px);  opacity: 0; }
        }
        .dn-dash .dn-scan {
          opacity: 0;
          animation: dn-scan 6.5s cubic-bezier(.45,0,.35,1) infinite;
        }

        @keyframes dn-orbit { to { transform: rotate(360deg); } }
        .dn-dash .dn-orbit {
          transform-box: view-box;
          transform-origin: 160px 164px;
          animation: dn-orbit 26s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .dn-dash .dn-scan,
          .dn-dash .dn-orbit { animation: none !important; }
          .dn-dash .dn-scan { opacity: 0; }
        }
      `}</style>

      {/* Atmosphere — same as Home */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-violet-50 via-fuchsia-50/60 to-purple-100/70">
        <motion.div
          className="absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-violet-300/40 blur-[110px]"
          {...(!reduce && {
            animate: { x: [0, 40, 0], y: [0, 30, 0] },
            transition: { duration: 22, repeat: Infinity, ease: "easeInOut" },
          })}
        />
        <motion.div
          className="absolute right-[-8rem] top-20 h-[30rem] w-[30rem] rounded-full bg-pink-300/40 blur-[110px]"
          {...(!reduce && {
            animate: { x: [0, -35, 0], y: [0, 30, 0] },
            transition: { duration: 26, repeat: Infinity, ease: "easeInOut" },
          })}
        />
        <div className="absolute bottom-[-8rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-purple-300/40 blur-[110px]" />
      </div>

      {!reduce && <Petals />}

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        {/* ============ HERO ============ */}
        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-6">
          <div>
            <p className="text-sm text-violet-900/55">{dateLabel}</p>

            <h1 className="dn-serif mt-4 text-[44px] font-medium leading-[1.04] tracking-[-0.02em] text-violet-950 sm:text-6xl lg:text-[76px]">
              {lines.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
                  <motion.span
                    className="block"
                    initial={reduce ? false : { y: "108%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: EASE }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
            >
              <p className="mt-6 max-w-md text-base leading-7 text-violet-900/65">
                Here's where your skin care and hair care routine stands today.
              </p>

              <p className="mt-2 flex items-center gap-2 text-sm text-violet-900/55">
                <span className="h-2 w-2 rounded-full border border-fuchsia-400" aria-hidden />
                No scans yet this week
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/scan/skin" className={primaryBtn}>
                  <HiOutlineCamera size={20} />
                  Scan my skin
                </Link>
                <Link to="/saved-products" className={secondaryBtn}>
                  My collection
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="mx-auto aspect-square w-full max-w-[440px] lg:max-w-none">
            <ScanPortal />
          </div>
        </section>

        {/* ============ SCANS ============ */}
        <section className="mt-16 sm:mt-20" aria-labelledby="scans-title">
          <h2 id="scans-title" className="dn-serif mb-5 text-2xl font-medium text-violet-950 sm:text-3xl">
            Start a scan
          </h2>

          <div className="dn-glass grid overflow-hidden rounded-[36px] md:grid-cols-2">
            <ScanOption
              glyph={<SkinGlyph />}
              title="Skin"
              status="No scan yet this week"
              text="Scan with your camera or upload a clear photo. You'll get a routine matched to your analysis."
            >
              <Link to="/scan/skin" className={primaryBtn}>
                <HiOutlineCamera size={20} />
                Scan my skin
              </Link>
              <Link to="/scan/skin?upload=true" className={secondaryBtn}>
                <HiOutlinePhotograph size={20} />
                Upload an image
              </Link>
            </ScanOption>

            <div className="border-t border-violet-100/80 md:border-l md:border-t-0">
              <ScanOption
                glyph={<HairGlyph />}
                title="Hair"
                status="Personalized hair care"
                text="Answer a few simple questions about your hair and scalp to receive a personalized care routine and product categories."
              >
               <Link to="/hair-care" className={primaryBtn}>
                <HairGlyph />
                Build my hair routine
              </Link>
              </ScanOption>
            </div>
          </div>
        </section>

        {/* ============ WEEK + PROGRESS (open band, no card) ============ */}
        <section
          className="mt-16 grid gap-10 border-y border-violet-200/50 py-10 sm:mt-20 lg:grid-cols-2 lg:gap-0"
          aria-labelledby="week-title"
        >
          <div className="lg:pr-12">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="week-title" className="dn-serif text-2xl font-medium text-violet-950">
                This week
              </h2>
              <p className="text-sm text-violet-900/55">
                {scannedCount === 0
                  ? "No scans yet"
                  : `${scannedCount} ${scannedCount === 1 ? "scan" : "scans"} this week`}
              </p>
            </div>

            <ol className="mt-7 grid grid-cols-7 gap-1 sm:gap-2">
              {week.map((d) => (
                <li key={d.key} className="flex flex-col items-center gap-2.5">
                  <span className="text-xs text-violet-900/50">{d.label}</span>
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold sm:h-12 sm:w-12 ${
                      d.scanned
                        ? "bg-gradient-to-br from-violet-500 to-fuchsia-400 text-white shadow-[0_8px_18px_-8px_rgba(147,51,234,.8)]"
                        : d.isToday
                          ? "border border-fuchsia-300 bg-white text-violet-950 shadow-[0_0_0_5px_rgba(232,121,249,.14)]"
                          : "border border-dashed border-violet-200 text-violet-900/45"
                    }`}
                    aria-label={`${d.label} ${d.day}${d.isToday ? ", today" : ""}${d.scanned ? ", scanned" : ""}`}
                  >
                    {d.day}
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-7 max-w-sm text-sm leading-6 text-violet-900/55">
              One scan a week is enough to see how your skin changes over time.
            </p>
          </div>

          <div className="lg:border-l lg:border-violet-200/50 lg:pl-12">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="dn-serif text-2xl font-medium text-violet-950">Skin progress</h2>
              <p className="text-sm text-violet-900/55">Starts after your first scan</p>
            </div>

            <div className="mt-5 h-32">
              <GhostChart />
            </div>
          </div>
        </section>

        


      </main>
    </div>
  );
}
