import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard.jsx";
import {
  HiOutlineSparkles,
  HiOutlineCamera,
  HiOutlineChartBar,
  HiOutlineHeart
} from "react-icons/hi";

export default function Home() {
  return (
    <div className="relative overflow-hidden">

      {/* =========================================
          HERO
      ========================================= */}

      <section className="relative max-w-6xl mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-24">

        {/* Lavender ambient glow */}

        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-lavender-300/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative text-center">

          {/* Eyebrow */}

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-lavender-200/60 backdrop-blur-md shadow-sm mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-lavender-500 animate-pulse" />

            <span className="text-[10px] font-medium tracking-[0.22em] uppercase text-lavender-700">
              AI Skin Intelligence
            </span>
          </motion.div>


          {/* Heading */}

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]"
          >
            Your skin.

            <br />

            <span className="bg-gradient-to-r from-[#6d4bc3] via-[#9877e8] to-[#c4aafc] bg-clip-text text-transparent">
              Understood.
            </span>
          </motion.h1>


          {/* Description */}

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="max-w-2xl mx-auto mt-7 text-base md:text-lg leading-relaxed text-ink/55"
          >
            DermaNova uses computer vision and AI to understand your skin,
            detect visible concerns, and transform your results into a
            personalized skincare journey.
          </motion.p>


          {/* CTA */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9"
          >

            <Link
              to="/scan/skin"
              className="btn-primary flex items-center gap-2 px-7 py-3.5 text-sm shadow-lg shadow-lavender-500/20"
            >
              <HiOutlineSparkles className="text-lg" />
              Start Skin Scan
            </Link>


            <Link
              to="/dashboard"
              className="px-7 py-3.5 rounded-full text-sm font-medium bg-white/60 border border-white/70 backdrop-blur-md hover:bg-white transition"
            >
              Explore Dashboard
            </Link>

          </motion.div>


          {/* Trust line */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex items-center justify-center gap-2 mt-5 text-xs text-ink/40"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            AI-powered analysis · Private · Personalized
          </motion.div>

        </div>
      </section>


      {/* =========================================
          AI ANALYSIS PREVIEW
      ========================================= */}

      <section className="max-w-6xl mx-auto px-4 pb-20">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >

          <GlassCard
            className="relative overflow-hidden !p-0"
            as="div"
          >

            {/* Top bar */}

            <div className="flex items-center justify-between px-6 py-4 border-b border-white/50">

              <div className="flex items-center gap-2">

                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

                <span className="text-xs font-medium text-ink/50">
                  DERMANOVA AI
                </span>

              </div>

              <span className="text-[10px] tracking-widest uppercase text-ink/35">
                Live Analysis
              </span>

            </div>


            <div className="grid md:grid-cols-2 gap-0">

              {/* Scan preview */}

              <div className="relative min-h-[320px] flex items-center justify-center bg-gradient-to-br from-lavender-100/40 to-white/30">

                <div className="relative w-52 h-64 rounded-[45%] border border-lavender-300/50 flex items-center justify-center">

                  {/* Face silhouette */}

                  <div className="w-36 h-48 rounded-[48%] bg-gradient-to-b from-lavender-200/60 to-petal-100/30 border border-white/60 shadow-inner" />

                  {/* Scan line */}

                  <div className="absolute left-4 right-4 top-1/2 h-px bg-gradient-to-r from-transparent via-lavender-500 to-transparent animate-scanLaser" />

                  {/* Detection points */}

                  <span className="absolute top-[28%] left-[38%] w-2 h-2 rounded-full bg-lavender-500 shadow-[0_0_12px_rgba(139,92,246,.7)]" />

                  <span className="absolute top-[28%] right-[38%] w-2 h-2 rounded-full bg-lavender-500 shadow-[0_0_12px_rgba(139,92,246,.7)]" />

                  <span className="absolute top-[47%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-lavender-500" />

                  <span className="absolute bottom-[27%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-lavender-500" />

                </div>

                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[10px] tracking-widest uppercase text-lavender-600">
                  Facial Mapping
                </div>

              </div>


              {/* Analysis */}

              <div className="p-7 md:p-9">

                <p className="eyebrow mb-2">
                  AI Report
                </p>

                <h2 className="text-2xl font-semibold mb-6">
                  Skin health at a glance.
                </h2>


                <div className="grid grid-cols-2 gap-3 mb-6">

                  <div className="rounded-2xl bg-white/60 border border-white p-4">
                    <p className="text-xs text-ink/40">
                      Skin Health
                    </p>

                    <p className="text-3xl font-semibold text-lavender-700 mt-1">
                      84
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/60 border border-white p-4">
                    <p className="text-xs text-ink/40">
                      Hydration
                    </p>

                    <p className="text-3xl font-semibold text-lavender-700 mt-1">
                      72%
                    </p>
                  </div>

                </div>


                <p className="text-xs uppercase tracking-widest text-ink/40 mb-3">
                  Detected concerns
                </p>


                <div className="space-y-3">

                  {[
                    ["Acne", "82%"],
                    ["Dark Spots", "71%"],
                    ["Redness", "64%"]
                  ].map(([name, score]) => (

                    <div
                      key={name}
                      className="flex items-center justify-between"
                    >

                      <div className="flex items-center gap-2">

                        <span className="w-2 h-2 rounded-full bg-lavender-400" />

                        <span className="text-sm">
                          {name}
                        </span>

                      </div>

                      <span className="text-xs text-ink/40">
                        {score}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </GlassCard>

        </motion.div>

      </section>


      {/* =========================================
          HOW IT WORKS
      ========================================= */}

      <section className="max-w-6xl mx-auto px-4 pb-24">

        <div className="text-center mb-10">

          <p className="eyebrow mb-2">
            Simple by design
          </p>

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
              text: "Use your camera to capture a clear, guided image of your face."
            },
            {
              number: "02",
              icon: HiOutlineSparkles,
              title: "Analyze",
              text: "Our AI analyzes visible skin characteristics and detects concerns."
            },
            {
              number: "03",
              icon: HiOutlineHeart,
              title: "Personalize",
              text: "Turn your analysis into recommendations and a routine made for you."
            }
          ].map((item) => {

            const Icon = item.icon;

            return (
              <GlassCard
                key={item.number}
                className="relative group hover:-translate-y-1 transition-transform duration-300"
                as="div"
              >

                <div className="flex items-center justify-between mb-6">

                  <span className="font-mono text-xs text-lavender-500">
                    {item.number}
                  </span>

                  <div className="w-10 h-10 rounded-xl bg-lavender-100 flex items-center justify-center text-lavender-600">
                    <Icon className="text-lg" />
                  </div>

                </div>

                <h3 className="text-xl font-semibold mb-2">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-ink/55">
                  {item.text}
                </p>

              </GlassCard>
            );

          })}

        </div>

      </section>

    </div>
  );
}