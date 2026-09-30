import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import GlassCard from "../components/GlassCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  HiOutlineCamera,
  HiOutlinePhotograph,
} from "react-icons/hi";

const PETALS = [
  { left: "8%", size: 26, delay: 0, dur: 16 },
  { left: "24%", size: 18, delay: 4, dur: 19 },
  { left: "52%", size: 22, delay: 2, dur: 17 },
  { left: "70%", size: 30, delay: 6, dur: 21 },
  { left: "86%", size: 20, delay: 1, dur: 18 },
  { left: "40%", size: 16, delay: 9, dur: 20 },
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
          className="absolute -top-10 block bg-gradient-to-br from-pink-200 to-fuchsia-300/80 shadow-[0_6px_14px_-4px_rgba(217,70,239,0.35)]"
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
            opacity: [0, 0.9, 0.9, 0],
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

export default function Dashboard() {
  const { user } = useAuth();
  const reduce = useReducedMotion();

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* SAME BACKGROUND ATMOSPHERE AS HOME */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-violet-50 via-fuchsia-50/60 to-purple-100/70">

        {/* Violet orb */}
        <motion.div
          className="absolute -top-40 -left-32 w-[34rem] h-[34rem] rounded-full bg-violet-300/40 blur-[110px]"
          {...(!reduce && {
            animate: {
              x: [0, 40, 0],
              y: [0, 30, 0],
            },
            transition: {
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            },
          })}
        />

        {/* Pink orb */}
        <motion.div
          className="absolute top-20 right-[-8rem] w-[30rem] h-[30rem] rounded-full bg-pink-300/40 blur-[110px]"
          {...(!reduce && {
            animate: {
              x: [0, -35, 0],
              y: [0, 30, 0],
            },
            transition: {
              duration: 26,
              repeat: Infinity,
              ease: "easeInOut",
            },
          })}
        />

        {/* Bottom purple orb */}
        <div className="absolute bottom-[-8rem] left-1/3 w-[26rem] h-[26rem] rounded-full bg-purple-300/40 blur-[110px]" />
      </div>

      {/* Falling petals */}
      {!reduce && <Petals />}

      {/* DASHBOARD CONTENT */}
      <motion.main
        className="relative z-10 max-w-5xl mx-auto px-4 py-10"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-semibold mb-1">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>

        <p className="text-ink/60 mb-8">
          Here's where your routine stands today.
        </p>

        <div className="grid md:grid-cols-2 gap-6">

          {/* SKIN CARD */}
          <GlassCard>
            <p className="eyebrow mb-2">Skin</p>

            <p className="text-ink/60 mb-4">
              No scan yet this week.
            </p>

            <div className="flex flex-wrap items-center gap-4">

              <Link
                to="/scan/skin"
                className="btn-primary text-sm inline-flex items-center gap-2"
              >
                <HiOutlineCamera size={20} />
                Scan my skin
              </Link>

              <Link
                to="/scan/skin?upload=true"
                className="btn-primary text-sm inline-flex items-center gap-2"
              >
                <HiOutlinePhotograph size={20} />
                Upload an image
              </Link>

            </div>
          </GlassCard>

          {/* HAIR CARD */}
          <GlassCard>
            <p className="eyebrow mb-2">Hair</p>

            <p className="text-ink/60 mb-4">
              No scan yet this week.
            </p>

            <Link
              to="/scan/hair"
              className="btn-primary text-sm inline-flex items-center gap-2"
            >
              <HiOutlineCamera size={20} />
              Scan my hair
            </Link>
          </GlassCard>

        </div>

        <p className="text-sm text-ink/40 mt-8">
          Progress charts, product recommendations, and the AI assistant
          plug into this dashboard in the next build modules.
        </p>
      </motion.main>
    </div>
  );
}