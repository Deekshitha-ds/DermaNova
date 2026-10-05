import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

import ScanResult from "../components/ScanResult";
import { getSkinReportById } from "../api/skinAnalysis";

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

export default function SavedScanReport() {
  const { reportId } = useParams();
  const reduce = useReducedMotion();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
        setError("");

        const response =
          await getSkinReportById(reportId);

        const data = response?.data;

        /*
         * Support common backend response shapes.
         */
        const report =
          data?.report ??
          data?.result ??
          data;

        setResult(report);
      } catch (err) {
        console.error(
          "FAILED TO LOAD SAVED REPORT:",
          err
        );

        setError(
          "Unable to load this saved report."
        );
      } finally {
        setLoading(false);
      }
    }

    if (reportId) {
      loadReport();
    }
  }, [reportId]);

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* SAME BACKGROUND ATMOSPHERE */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-violet-50 via-fuchsia-50/60 to-purple-100/70">

        {/* Violet atmosphere */}
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

        {/* Pink atmosphere */}
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

        {/* Bottom purple atmosphere */}
        <div className="absolute bottom-[-8rem] left-1/3 w-[26rem] h-[26rem] rounded-full bg-purple-300/40 blur-[110px]" />
      </div>

      {/* Falling petals */}
      {!reduce && <Petals />}

      {/* PAGE CONTENT */}
      <motion.main
        className="relative z-10 max-w-5xl mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
      >

        {/* LOADING */}
        {loading && (
          <div className="py-12">
            <div className="text-center">

              <div className="mx-auto h-9 w-9 rounded-full border-2 border-lavender-200 border-t-lavender-600 animate-spin" />

              <p className="mt-4 text-sm text-ink/40">
                Loading saved report...
              </p>

            </div>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="py-12">

            <div className="rounded-2xl border border-red-100 bg-red-50/60 p-6 text-center">

              <p className="text-sm text-red-600">
                {error}
              </p>

            </div>

          </div>
        )}

        {/* REPORT */}
        {!loading && !error && result && (
          <ScanResult result={result} />
        )}

      </motion.main>
    </div>
  );
}