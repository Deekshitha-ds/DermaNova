import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

import GlassCard from "../components/GlassCard";
import { getSkinReportHistory } from "../api/skinAnalysis";

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

export default function SavedScans() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const [savedReports, setSavedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSavedScans() {
      try {
        setLoading(true);
        setError("");

        /*
         * Get analysis IDs that were saved
         * using the Save Scan button.
         */
        const savedIds = Object.keys(localStorage)
          .filter((key) =>
            key.startsWith("dermanova_saved_scan_")
          )
          .map((key) =>
            key.replace(
              "dermanova_saved_scan_",
              ""
            )
          );

        if (savedIds.length === 0) {
          setSavedReports([]);
          return;
        }

        /*
         * Fetch report history from backend.
         */
        const response =
          await getSkinReportHistory();

        const history =
          Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.data?.reports)
              ? response.data.reports
              : Array.isArray(response?.data?.results)
                ? response.data.results
                : [];

        /*
         * Keep only the reports that were saved.
         */
        const filteredReports =
          history.filter((report) => {
            const reportId =
              report?.analysis_id ??
              report?.id ??
              report?.analysisId;

            return savedIds.includes(
              String(reportId)
            );
          });

        setSavedReports(filteredReports);
      } catch (err) {
        console.error(
          "FAILED TO LOAD SAVED SCANS:",
          err
        );

        setError(
          "Unable to load your saved scans."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSavedScans();
  }, []);

  const getReportId = (report) =>
    report?.analysis_id ??
    report?.id ??
    report?.analysisId;

  const getHealth = (report) =>
    Math.round(
      Number(
        report?.scores?.health ??
        report?.health ??
        0
      )
    );

  const getConcernCount = (report) => {
    if (Array.isArray(report?.detections)) {
      return report.detections.length;
    }

    if (Array.isArray(report?.detected_issues)) {
      return report.detected_issues.length;
    }

    return 0;
  };

  const getDate = (report) => {
    const dateValue =
      report?.created_at ??
      report?.createdAt ??
      report?.captured_at ??
      report?.date;

    if (!dateValue) {
      return "Saved scan";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Saved scan";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

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

      {/* SAVED SCANS CONTENT */}
      <motion.main
        className="relative z-10 max-w-6xl mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
      >

        <div className="mb-8">

          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-lavender-600">
            DermaNova
          </p>

          <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-ink">
            Saved Scans
          </h1>

          <p className="mt-2 text-sm text-ink/45">
            View your saved facial analysis reports.
          </p>

        </div>

        {/* LOADING */}
        {loading && (
          <GlassCard>

            <div className="py-16 text-center">

              <div className="mx-auto h-8 w-8 rounded-full border-2 border-lavender-200 border-t-lavender-600 animate-spin" />

              <p className="mt-4 text-sm text-ink/40">
                Loading your saved scans...
              </p>

            </div>

          </GlassCard>
        )}

        {/* ERROR */}
        {!loading && error && (
          <GlassCard>

            <div className="py-12 text-center">

              <p className="text-sm text-red-500">
                {error}
              </p>

            </div>

          </GlassCard>
        )}

        {/* EMPTY STATE */}
        {!loading &&
          !error &&
          savedReports.length === 0 && (
            <GlassCard>

              <div className="py-16 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-lavender-100 bg-lavender-50">

                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="text-lavender-600"
                  >
                    <path d="M6 3.75A1.75 1.75 0 0 1 7.75 2h8.5A1.75 1.75 0 0 1 18 3.75v17.1a.65.65 0 0 1-1.02.53L12 17.8l-4.98 3.58A.65.65 0 0 1 6 20.85V3.75Z" />
                  </svg>

                </div>

                <h3 className="mt-5 text-lg font-semibold text-ink">
                  No saved scans yet
                </h3>

                <p className="mt-2 max-w-md mx-auto text-sm leading-6 text-ink/45">
                  Complete a skin analysis and use
                  “Save Scan” to keep the report here.
                </p>

              </div>

            </GlassCard>
          )}

        {/* SAVED REPORTS */}
        {!loading &&
          !error &&
          savedReports.length > 0 && (

            <div className="grid md:grid-cols-2 gap-5">

              {savedReports.map((report) => {

                const reportId =
                  getReportId(report);

                const health =
                  getHealth(report);

                const concernCount =
                  getConcernCount(report);

                return (
                  <motion.div
                    key={reportId}
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                    className="group rounded-[26px] border border-lavender-100 bg-white/80 backdrop-blur-xl p-6 shadow-[0_16px_40px_rgba(80,60,120,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-lavender-200 hover:shadow-[0_20px_45px_rgba(80,60,120,0.10)]"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-lavender-600">
                          Facial Analysis
                        </p>

                        <h2 className="mt-2 text-xl font-semibold text-ink">
                          {report?.detected_type ||
                            "Skin Analysis"}
                        </h2>

                        <p className="mt-1 text-xs text-ink/35">
                          {getDate(report)}
                        </p>

                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lavender-50 border border-lavender-100 text-lavender-600">
                        ✓
                      </div>

                    </div>

                    <div className="mt-7 grid grid-cols-3 gap-3">

                      <div className="rounded-xl bg-lavender-50/60 border border-lavender-100 p-3">

                        <p className="text-[9px] uppercase tracking-wider text-ink/35">
                          Health
                        </p>

                        <p className="mt-1 text-xl font-semibold text-ink">
                          {health}
                        </p>

                      </div>

                      <div className="rounded-xl bg-white border border-ink/5 p-3">

                        <p className="text-[9px] uppercase tracking-wider text-ink/35">
                          Concerns
                        </p>

                        <p className="mt-1 text-xl font-semibold text-ink">
                          {concernCount}
                        </p>

                      </div>

                      <div className="rounded-xl bg-white border border-ink/5 p-3">

                        <p className="text-[9px] uppercase tracking-wider text-ink/35">
                          Type
                        </p>

                        <p className="mt-1 text-sm font-semibold text-ink truncate">
                          {report?.detected_type ||
                            "Unknown"}
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/saved-scans/${reportId}`
                        )
                      }
                      className="mt-6 w-full rounded-xl border border-lavender-200 bg-lavender-50/70 px-4 py-3 text-sm font-semibold text-lavender-700 transition hover:bg-lavender-100"
                    >
                      View Full Report
                    </button>

                  </motion.div>
                );
              })}

            </div>
          )}

      </motion.main>
    </div>
  );
}