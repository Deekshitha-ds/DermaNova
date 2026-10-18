import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

import GlassCard from "../components/GlassCard";
import {
  getSkinReportById,
} from "../api/skinAnalysis";
import {
  getSavedScans,
  unsaveScan,
} from "../api/savedscans";

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
  const [deletingId, setDeletingId] = useState(null);

  // Load saved scan IDs from the backend and fetch each full report.
  useEffect(() => {
    let cancelled = false;

    async function loadSavedScans() {
      try {
        setLoading(true);
        setError("");

        const response = await getSavedScans();

        const savedItems = Array.isArray(response?.data)
          ? response.data
          : [];

        const reports = await Promise.all(
          savedItems.map(async (item) => {
            const id = item.analysis_id ?? item.id;

            if (id == null) return null;

            try {
              const reportResponse = await getSkinReportById(id);

              const reportData =
                reportResponse?.data?.report ??
                reportResponse?.data?.result ??
                reportResponse?.data;

              if (
                !reportData ||
                typeof reportData !== "object"
              ) {
                return null;
              }

              return {
                ...reportData,
                analysis_id: id,
                saved_at: item.saved_at ?? null,
              };
            } catch (err) {
              console.error(
                `Failed to load report ${id}:`,
                err
              );

              // Keep the saved item visible even if its report fails.
              return {
                analysis_id: id,
                id,
                detected_type: "Skin Analysis",
                scores: {},
                detected_issues: [],
                detections: [],
                created_at: item.saved_at ?? null,
                reportUnavailable: true,
              };
            }
          })
        );

        if (!cancelled) {
          setSavedReports(reports.filter(Boolean));
        }
      } catch (err) {
        console.error("FAILED TO LOAD SAVED SCANS:", err);

        if (!cancelled) {
          setError(
            err?.response?.status === 401
              ? "Your session may have expired. Please log in again."
              : "Unable to load your saved scans. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSavedScans();

    return () => {
      cancelled = true;
    };
  }, []);

  // Helpers
  const getReportId = (report) =>
    report?.analysis_id ??
    report?.id ??
    report?.analysisId;

  const getHealth = (report) => {
    const value = Number(
      report?.scores?.health ?? report?.health ?? 0
    );

    return Number.isFinite(value)
      ? Math.round(value)
      : 0;
  };

  const getConcernCount = (report) => {
    if (Array.isArray(report?.detected_issues)) {
      return report.detected_issues.length;
    }

    if (Array.isArray(report?.detections)) {
      return report.detections.length;
    }

    return 0;
  };

  const getDate = (report) => {
    const dateValue =
      report?.created_at ??
      report?.createdAt ??
      report?.captured_at ??
      report?.date ??
      report?.saved_at;

    if (!dateValue) return "Saved scan";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Saved scan";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Remove a scan from Saved Scans without deleting its analysis.
  const handleDelete = async (reportId) => {
    const confirmed = window.confirm(
      "Remove this scan from Saved Scans? The original analysis will remain in your history."
    );

    if (!confirmed) return;

    try {
      setDeletingId(reportId);
      setError("");

      await unsaveScan(reportId);

      setSavedReports((currentReports) =>
        currentReports.filter(
          (report) =>
            String(getReportId(report)) !== String(reportId)
        )
      );
    } catch (err) {
      console.error("FAILED TO UNSAVE SCAN:", err);

      setError(
        err?.response?.status === 404
          ? "This scan is no longer saved. Refresh the page."
          : "Unable to remove this scan. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-violet-50 via-fuchsia-50/60 to-purple-100/70">
        <motion.div
          className="absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-violet-300/40 blur-[110px]"
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

        <motion.div
          className="absolute right-[-8rem] top-20 h-[30rem] w-[30rem] rounded-full bg-pink-300/40 blur-[110px]"
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

        <div className="absolute bottom-[-8rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-purple-300/40 blur-[110px]" />
      </div>

      {!reduce && <Petals />}

      <motion.main
        className="relative z-10 mx-auto max-w-6xl px-4 py-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-lavender-600">
            DermaNova
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Saved Scans
          </h1>

          <p className="mt-2 text-sm text-ink/45">
            View and manage your saved facial analysis reports.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <GlassCard>
            <div className="py-16 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-lavender-200 border-t-lavender-600" />

              <p className="mt-4 text-sm text-ink/40">
                Loading your saved scans...
              </p>
            </div>
          </GlassCard>
        )}

        {/* Error */}
        {!loading && error && (
          <GlassCard>
            <div className="py-6 text-center">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          </GlassCard>
        )}

        {/* Empty state */}
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
                    aria-hidden="true"
                  >
                    <path d="M6 3.75A1.75 1.75 0 0 1 7.75 2h8.5A1.75 1.75 0 0 1 18 3.75v17.1a.65.65 0 0 1-1.02.53L12 17.8l-4.98 3.58A.65.65 0 0 1 6 20.85V3.75Z" />
                  </svg>
                </div>

                <h3 className="mt-5 text-lg font-semibold text-ink">
                  No saved scans yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/45">
                  Complete a skin analysis and use “Save Scan” to keep the report here.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/scan/skin")}
                  className="mt-6 rounded-xl bg-lavender-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-lavender-700"
                >
                  Start a Skin Scan
                </button>
              </div>
            </GlassCard>
          )}

        {/* Saved reports */}
        {!loading &&
          !error &&
          savedReports.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2">
              {savedReports.map((report) => {
                const reportId = getReportId(report);
                const health = getHealth(report);
                const concernCount = getConcernCount(report);

                const isDeleting =
                  String(deletingId) === String(reportId);

                return (
                  <motion.div
                    key={reportId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{
                      opacity: isDeleting ? 0.55 : 1,
                      y: 0,
                    }}
                    transition={{ duration: 0.4 }}
                    className="group rounded-[26px] border border-lavender-100 bg-white/80 p-6 shadow-[0_16px_40px_rgba(80,60,120,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-lavender-200 hover:shadow-[0_20px_45px_rgba(80,60,120,0.10)]"
                  >
                    {/* Card header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-lavender-600">
                          Facial Analysis
                        </p>

                        <h2 className="mt-2 text-xl font-semibold text-ink">
                          {report?.detected_type || "Skin Analysis"}
                        </h2>

                        <p className="mt-1 text-xs text-ink/35">
                          {getDate(report)}
                        </p>
                      </div>

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-lavender-100 bg-lavender-50 text-lavender-600">
                        ✓
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-7 grid grid-cols-3 gap-3">
                      <div className="rounded-xl border border-lavender-100 bg-lavender-50/60 p-3">
                        <p className="text-[9px] uppercase tracking-wider text-ink/35">
                          Health
                        </p>

                        <p className="mt-1 text-xl font-semibold text-ink">
                          {health}
                        </p>
                      </div>

                      <div className="rounded-xl border border-ink/5 bg-white p-3">
                        <p className="text-[9px] uppercase tracking-wider text-ink/35">
                          Concerns
                        </p>

                        <p className="mt-1 text-xl font-semibold text-ink">
                          {concernCount}
                        </p>
                      </div>

                      <div className="rounded-xl border border-ink/5 bg-white p-3">
                        <p className="text-[9px] uppercase tracking-wider text-ink/35">
                          Type
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-ink">
                          {report?.detected_type || "Unknown"}
                        </p>
                      </div>
                    </div>

                    {report.reportUnavailable && (
                      <p className="mt-4 text-xs text-amber-600">
                        The report details could not be loaded. You can retry by refreshing this page.
                      </p>
                    )}

                    {/* Actions */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() =>
                          navigate(`/saved-scans/${reportId}`)
                        }
                        className="rounded-xl border border-lavender-200 bg-lavender-50/70 px-4 py-3 text-sm font-semibold text-lavender-700 transition hover:bg-lavender-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        View Report
                      </button>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleDelete(reportId)}
                        className="rounded-xl border border-red-100 bg-red-50/60 px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isDeleting ? "Removing..." : "Remove Saved Scan"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
      </motion.main>
    </div>
  );
}
