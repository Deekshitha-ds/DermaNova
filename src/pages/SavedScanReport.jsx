import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ScanResult from "../components/ScanResult";
import { getSkinReportById } from "../api/skinAnalysis";

export default function SavedScanReport() {
  const { reportId } = useParams();

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

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">

        <div className="text-center">

          <div className="mx-auto h-9 w-9 rounded-full border-2 border-lavender-200 border-t-lavender-600 animate-spin" />

          <p className="mt-4 text-sm text-ink/40">
            Loading saved report...
          </p>

        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">

        <div className="rounded-2xl border border-red-100 bg-red-50/60 p-6 text-center">

          <p className="text-sm text-red-600">
            {error}
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      <ScanResult result={result} />

    </div>
  );
}