export default function ScanResult({ result }) {
  if (!result) return null;

  const health = Math.round(result.scores?.health ?? 0);
  const oiliness = Math.round(result.scores?.oiliness ?? 0);
  const hydration = Math.round(result.scores?.hydration ?? 0);
  const confidence = Math.round(result.scores?.confidence ?? 0);

  const detections = result.detections ?? [];

  const getSeverity = (value) => {
    if (value >= 80) {
      return {
        label: "High",
        className:
          "bg-red-50 text-red-600 border-red-200",
      };
    }

    if (value >= 50) {
      return {
        label: "Medium",
        className:
          "bg-amber-50 text-amber-600 border-amber-200",
      };
    }

    return {
      label: "Low",
      className:
        "bg-emerald-50 text-emerald-600 border-emerald-200",
    };
  };

  const getIssueIcon = (issue) => {
    const name = issue?.toLowerCase();

    if (name?.includes("blackhead")) return "●";
    if (name?.includes("whitehead")) return "○";
    if (name?.includes("papule")) return "◆";
    if (name?.includes("pustule")) return "●";
    if (name?.includes("nodule")) return "◆";
    if (name?.includes("dark")) return "◐";

    return "✦";
  };

  return (
    <div className="mt-8 space-y-6">

      {/* ================= HEADER ================= */}

      <div className="relative overflow-hidden rounded-3xl border border-lavender-200/60 bg-white/80 backdrop-blur-xl shadow-xl p-7">

        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-lavender-200/30 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>
            <div className="flex items-center gap-2 mb-2">

              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />

              <span className="text-sm font-medium text-emerald-600">
                Analysis Complete
              </span>

            </div>

            <h2 className="text-3xl font-bold text-ink">
              Skin Analysis Report
            </h2>

            <p className="text-sm text-ink/50 mt-2">
              Powered by DermaNova AI
            </p>
          </div>

          <div className="px-4 py-2 rounded-full bg-lavender-50 border border-lavender-200 text-lavender-700 text-sm font-medium">
            AI Skin Scan
          </div>

        </div>
      </div>


      {/* ================= HEALTH SCORE ================= */}

      <div className="rounded-3xl border border-lavender-200/60 bg-white/80 backdrop-blur-xl shadow-lg p-7">

        <div className="flex flex-col md:flex-row items-center gap-8">

          {/* Circle */}

          <div
            className="relative w-36 h-36 rounded-full flex items-center justify-center"
            style={{
              background: `conic-gradient(#9b8cff ${health}%, #eeeafa ${health}% 100%)`,
            }}
          >

            <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center">

              <span className="text-4xl font-bold text-ink">
                {health}
              </span>

              <span className="text-xs text-ink/50">
                / 100
              </span>

            </div>

          </div>

          <div className="text-center md:text-left">

            <p className="text-sm uppercase tracking-[0.18em] text-lavender-600 font-medium">
              Overall score
            </p>

            <h3 className="text-2xl font-bold mt-1">
              Skin Health
            </h3>

            <p className="text-sm text-ink/50 mt-2 max-w-md">
              Your overall skin health score is calculated from the
              characteristics detected during the AI analysis.
            </p>

          </div>

        </div>

      </div>


      {/* ================= METRICS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Confidence */}

        <MetricCard
          title="AI Confidence"
          value={`${confidence}%`}
          progress={confidence}
          description="Analysis confidence"
        />

        {/* Health */}

        <MetricCard
          title="Skin Health"
          value={health}
          progress={health}
          description="Overall condition"
        />

        {/* Hydration */}

        <MetricCard
          title="Hydration"
          value={`${hydration}%`}
          progress={hydration}
          description="Skin moisture"
        />

        {/* Oiliness */}

        <MetricCard
          title="Oiliness"
          value={`${oiliness}%`}
          progress={oiliness}
          description="Oil level"
        />

      </div>


      {/* ================= DETECTED ISSUES ================= */}

      <div className="rounded-3xl border border-lavender-200/60 bg-white/80 backdrop-blur-xl shadow-lg p-7">

        <div className="flex items-center justify-between mb-6">

          <div>

            <p className="text-sm text-lavender-600 font-medium uppercase tracking-[0.15em]">
              AI Detection
            </p>

            <h3 className="text-2xl font-bold mt-1">
              Detected Skin Concerns
            </h3>

          </div>

          <div className="px-3 py-1.5 rounded-full bg-lavender-50 text-lavender-700 text-sm font-semibold">
            {detections.length} detected
          </div>

        </div>


        {detections.length === 0 ? (

          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-6 text-center">

            <div className="text-3xl mb-2">
              ✓
            </div>

            <h4 className="font-semibold text-emerald-700">
              No major concerns detected
            </h4>

            <p className="text-sm text-emerald-600/70 mt-1">
              Your scan did not identify any significant skin concerns.
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 gap-4">

            {detections.map((item, index) => {

              const confidenceValue =
                Number(item.confidence ?? 0);

              const severity =
                getSeverity(confidenceValue);

              return (

                <div
                  key={index}
                  className="group rounded-2xl border border-ink/10 bg-white p-5 hover:border-lavender-300 hover:shadow-md transition-all duration-300"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-4">

                      <div className="w-11 h-11 rounded-xl bg-lavender-50 text-lavender-600 flex items-center justify-center text-lg">
                        {getIssueIcon(item.issue)}
                      </div>

                      <div>

                        <h4 className="font-bold text-lg">
                          {item.issue}
                        </h4>

                        <p className="text-xs text-ink/45 mt-0.5">
                          AI detected concern
                        </p>

                      </div>

                    </div>

                    <span
                      className={`px-3 py-1 rounded-full border text-xs font-semibold ${severity.className}`}
                    >
                      {severity.label}
                    </span>

                  </div>


                  {/* Confidence */}

                  <div className="mt-5">

                    <div className="flex justify-between text-xs mb-2">

                      <span className="text-ink/50">
                        Confidence
                      </span>

                      <span className="font-semibold">
                        {confidenceValue.toFixed(1)}%
                      </span>

                    </div>

                    <div className="h-2 rounded-full bg-lavender-100 overflow-hidden">

                      <div
                        className="h-full rounded-full bg-lavender-500 transition-all duration-700"
                        style={{
                          width: `${Math.min(
                            confidenceValue,
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>


      {/* ================= AI INSIGHTS ================= */}

      <div className="rounded-3xl border border-lavender-200/60 bg-gradient-to-br from-lavender-50/80 to-white p-7 shadow-lg">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center text-lavender-600">
            ✦
          </div>

          <div>

            <p className="text-xs uppercase tracking-[0.15em] text-lavender-600 font-semibold">
              DermaNova AI
            </p>

            <h3 className="text-2xl font-bold">
              Personalized Insights
            </h3>

          </div>

        </div>


        <div className="space-y-3">

          {detections.length > 0 ? (

            detections.map((item, index) => (

              <Recommendation
                key={index}
                issue={item.issue}
              />

            ))

          ) : (

            <div className="rounded-2xl bg-white p-5 border border-lavender-100">

              <p className="text-sm text-ink/70">
                Maintain a consistent skincare routine,
                stay hydrated, protect your skin from UV exposure,
                and continue monitoring your skin regularly.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}


/* ========================================================= */
/* METRIC CARD */
/* ========================================================= */

function MetricCard({
  title,
  value,
  progress,
  description,
}) {

  return (

    <div className="rounded-2xl border border-lavender-200/60 bg-white/80 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition">

      <p className="text-sm text-ink/50">
        {title}
      </p>

      <div className="flex items-end justify-between mt-2">

        <h3 className="text-2xl font-bold">
          {value}
        </h3>

        <span className="text-xs text-ink/40">
          {description}
        </span>

      </div>

      <div className="mt-4 h-1.5 bg-lavender-100 rounded-full overflow-hidden">

        <div
          className="h-full bg-lavender-500 rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(progress, 100)}%`,
          }}
        />

      </div>

    </div>

  );
}


/* ========================================================= */
/* RECOMMENDATION */
/* ========================================================= */

function Recommendation({ issue }) {

  const name = issue?.toLowerCase() ?? "";

  let text =
    "Maintain a gentle skincare routine and monitor this concern.";

  if (name.includes("blackhead")) {

    text =
      "Use a gentle cleanser and consider salicylic acid to help manage clogged pores.";

  } else if (name.includes("whitehead")) {

    text =
      "Keep pores clean with a gentle cleanser and avoid picking or squeezing the affected areas.";

  } else if (name.includes("papule")) {

    text =
      "Use a gentle, non-comedogenic skincare routine and avoid irritating active ingredients.";

  } else if (name.includes("pustule")) {

    text =
      "Avoid squeezing the affected area and use gentle, non-comedogenic skincare products.";

  } else if (name.includes("nodule")) {

    text =
      "Persistent or painful nodules may require professional dermatological evaluation.";

  } else if (name.includes("dark spot")) {

    text =
      "Daily broad-spectrum sunscreen is important. Niacinamide may also help improve uneven pigmentation.";

  }

  return (

    <div className="flex gap-3 rounded-2xl bg-white border border-lavender-100 p-4">

      <div className="text-lavender-600 text-lg">
        ✓
      </div>

      <p className="text-sm text-ink/70 leading-relaxed">
        {text}
      </p>

    </div>

  );
}