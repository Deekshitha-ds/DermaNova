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
        dot: "bg-red-500",
        text: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-100",
      };
    }

    if (value >= 60) {
      return {
        label: "Moderate",
        dot: "bg-amber-500",
        text: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
      };
    }

    return {
      label: "Low",
      dot: "bg-emerald-500",
      text: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    };
  };

  const getIssueIcon = (issue) => {
    const name = issue?.toLowerCase() ?? "";

    if (name.includes("acne")) return "✦";
    if (name.includes("blackhead")) return "●";
    if (name.includes("whitehead")) return "○";
    if (name.includes("papule")) return "◆";
    if (name.includes("pustule")) return "●";
    if (name.includes("nodule")) return "◆";
    if (name.includes("dark")) return "◐";
    if (name.includes("redness")) return "◌";
    if (name.includes("wrinkle")) return "⌁";
    if (name.includes("pigmentation")) return "◒";

    return "✦";
  };

  const getHealthLabel = (score) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Healthy";
    if (score >= 50) return "Needs Attention";
    return "Needs Care";
  };

  return (
    <div className="mt-10 space-y-6">

      {/* ================================================= */}
      {/* REPORT HEADER */}
      {/* ================================================= */}

      <section className="relative overflow-hidden rounded-[32px] border border-lavender-200/70 bg-white/75 backdrop-blur-2xl shadow-[0_20px_60px_rgba(80,60,120,0.10)]">

        {/* Decorative glow */}

        <div className="absolute -top-32 -right-20 h-72 w-72 rounded-full bg-lavender-300/20 blur-3xl" />

        <div className="absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-purple-200/20 blur-3xl" />

        <div className="relative p-7 md:p-9">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <div className="flex items-center gap-2 mb-3">

                <span className="relative flex h-2.5 w-2.5">

                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />

                </span>

                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">
                  Analysis Complete
                </span>

              </div>

              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
                Skin Analysis
                <span className="text-lavender-600"> Report</span>
              </h2>

              <p className="mt-2 text-sm text-ink/45">
                AI-powered facial skin assessment by DermaNova
              </p>

            </div>

            <div className="self-start md:self-center">

              <div className="flex items-center gap-2 rounded-full border border-lavender-200 bg-lavender-50/70 px-4 py-2">

                <span className="text-lavender-600 text-sm">
                  ✦
                </span>

                <span className="text-xs font-semibold tracking-wide text-lavender-700">
                  DERMANOVA AI
                </span>

              </div>

            </div>

          </div>

          <div className="mt-7 pt-5 border-t border-ink/5 flex flex-wrap gap-x-8 gap-y-3">

            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-ink/35">
                Skin Type
              </p>

              <p className="mt-1 text-sm font-semibold text-ink">
                {result.detected_type || "Not determined"}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-ink/35">
                Concerns Found
              </p>

              <p className="mt-1 text-sm font-semibold text-ink">
                {detections.length}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-ink/35">
                AI Confidence
              </p>

              <p className="mt-1 text-sm font-semibold text-ink">
                {confidence}%
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* MAIN SCORE */}
      {/* ================================================= */}

      <section className="relative overflow-hidden rounded-[32px] border border-lavender-200/60 bg-white/80 backdrop-blur-xl shadow-[0_18px_50px_rgba(80,60,120,0.08)] p-7 md:p-9">

        <div className="flex flex-col lg:flex-row items-center gap-9">

          {/* SCORE RING */}

          <div className="relative flex-shrink-0">

            <div
              className="relative w-44 h-44 rounded-full flex items-center justify-center"
              style={{
                background: `
                  conic-gradient(
                    #a99afc ${health}%,
                    #eeeafd ${health}% 100%
                  )
                `,
              }}
            >

              {/* subtle inner ring */}

              <div className="absolute inset-[5px] rounded-full bg-white" />

              <div className="relative w-32 h-32 rounded-full bg-white flex flex-col items-center justify-center shadow-inner">

                <span className="text-5xl font-semibold tracking-tight text-ink">
                  {health}
                </span>

                <span className="text-xs text-ink/35 mt-1">
                  OUT OF 100
                </span>

              </div>

            </div>

          </div>


          {/* SCORE INFORMATION */}

          <div className="flex-1 text-center lg:text-left">

            <div className="inline-flex items-center rounded-full bg-lavender-50 border border-lavender-100 px-3 py-1 mb-3">

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-lavender-600">
                Overall Skin Health
              </span>

            </div>

            <h3 className="text-3xl font-semibold tracking-tight text-ink">
              {getHealthLabel(health)}
            </h3>

            <p className="mt-3 max-w-xl text-sm leading-6 text-ink/50">
              Your skin health score is based on the visual characteristics
              identified during your DermaNova AI analysis.
            </p>

            <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-3">

              <div className="rounded-xl border border-lavender-100 bg-lavender-50/60 px-4 py-3">

                <p className="text-[10px] uppercase tracking-wider text-ink/40">
                  Skin type
                </p>

                <p className="mt-1 font-semibold text-sm text-ink">
                  {result.detected_type || "Unknown"}
                </p>

              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">

                <p className="text-[10px] uppercase tracking-wider text-ink/40">
                  Status
                </p>

                <p className="mt-1 font-semibold text-sm text-emerald-600">
                  Scan complete
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* METRICS */}
      {/* ================================================= */}

      <section>

        <div className="mb-4">

          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-lavender-600">
            Skin Metrics
          </p>

          <h3 className="mt-1 text-xl font-semibold text-ink">
            Your skin profile
          </h3>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <MetricCard
            title="AI Confidence"
            value={`${confidence}%`}
            progress={confidence}
            description="Model confidence"
            icon="✦"
          />

          <MetricCard
            title="Skin Health"
            value={health}
            progress={health}
            description="Overall condition"
            icon="♡"
          />

          <MetricCard
            title="Hydration"
            value={`${hydration}%`}
            progress={hydration}
            description="Moisture balance"
            icon="◌"
          />

          <MetricCard
            title="Oiliness"
            value={`${oiliness}%`}
            progress={oiliness}
            description="Surface oil level"
            icon="◐"
          />

        </div>

      </section>


      {/* ================================================= */}
      {/* DETECTED CONCERNS */}
      {/* ================================================= */}

      <section className="rounded-[32px] border border-lavender-200/60 bg-white/80 backdrop-blur-xl shadow-[0_18px_50px_rgba(80,60,120,0.07)] p-7 md:p-9">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">

          <div>

            <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-lavender-600">
              AI Detection
            </p>

            <h3 className="mt-1 text-2xl font-semibold tracking-tight">
              Detected concerns
            </h3>

            <p className="mt-1 text-sm text-ink/40">
              Areas identified during your facial scan
            </p>

          </div>

          <div className="self-start sm:self-auto rounded-full border border-lavender-200 bg-lavender-50 px-4 py-2">

            <span className="text-sm font-semibold text-lavender-700">
              {detections.length}
            </span>

            <span className="ml-1 text-xs text-lavender-600">
              {detections.length === 1 ? "concern" : "concerns"}
            </span>

          </div>

        </div>


        {detections.length === 0 ? (

          <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/60 p-8 text-center">

            <div className="mx-auto w-14 h-14 rounded-full bg-white border border-emerald-100 flex items-center justify-center shadow-sm">

              <span className="text-2xl text-emerald-500">
                ✓
              </span>

            </div>

            <h4 className="mt-4 text-lg font-semibold text-emerald-700">
              Your skin looks clear
            </h4>

            <p className="mt-2 text-sm text-emerald-700/60 max-w-md mx-auto">
              No significant skin concerns were detected in this scan.
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 gap-4">

            {detections.map((item, index) => {

              const confidenceValue = Number(
                item.confidence ?? 0
              );

              const severity = getSeverity(confidenceValue);

              return (

                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border border-ink/5 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-lavender-200 hover:shadow-[0_15px_35px_rgba(90,70,140,0.10)]"
                >

                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-lavender-300/60 to-transparent opacity-0 group-hover:opacity-100 transition" />

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-2xl bg-lavender-50 border border-lavender-100 flex items-center justify-center text-lavender-600 text-lg">

                        {getIssueIcon(item.issue)}

                      </div>

                      <div>

                        <h4 className="font-semibold text-lg text-ink">
                          {item.issue}
                        </h4>

                        <p className="text-xs text-ink/35 mt-0.5">
                          AI-detected concern
                        </p>

                      </div>

                    </div>

                    <div
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 ${severity.bg} ${severity.border}`}
                    >

                      <span
                        className={`w-1.5 h-1.5 rounded-full ${severity.dot}`}
                      />

                      <span
                        className={`text-[11px] font-semibold ${severity.text}`}
                      >
                        {severity.label}
                      </span>

                    </div>

                  </div>


                  {/* CONFIDENCE */}

                  <div className="mt-6">

                    <div className="flex items-center justify-between mb-2">

                      <span className="text-xs text-ink/40">
                        Detection confidence
                      </span>

                      <span className="text-xs font-semibold text-ink">
                        {confidenceValue.toFixed(1)}%
                      </span>

                    </div>

                    <div className="h-1.5 rounded-full bg-lavender-100 overflow-hidden">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-lavender-400 to-lavender-600 transition-all duration-1000"
                        style={{
                          width: `${Math.min(
                            Math.max(confidenceValue, 0),
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

      </section>


      {/* ================================================= */}
      {/* PERSONALIZED INSIGHTS */}
      {/* ================================================= */}

      <section className="relative overflow-hidden rounded-[32px] border border-lavender-200/70 bg-gradient-to-br from-lavender-50/90 via-white to-white p-7 md:p-9 shadow-[0_18px_50px_rgba(100,80,150,0.08)]">

        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-lavender-200/30 blur-3xl" />

        <div className="relative">

          <div className="flex items-center gap-4 mb-7">

            <div className="w-12 h-12 rounded-2xl bg-white border border-lavender-100 shadow-sm flex items-center justify-center">

              <span className="text-xl text-lavender-600">
                ✦
              </span>

            </div>

            <div>

              <p className="text-[10px] uppercase tracking-[0.22em] font-bold text-lavender-600">
                DermaNova Intelligence
              </p>

              <h3 className="mt-1 text-2xl font-semibold">
                Personalized insights
              </h3>

            </div>

          </div>


          {detections.length > 0 ? (

            <div className="grid md:grid-cols-2 gap-3">

              {detections.map((item, index) => (

                <Recommendation
                  key={index}
                  issue={item.issue}
                />

              ))}

            </div>

          ) : (

            <div className="rounded-2xl bg-white/80 border border-lavender-100 p-5">

              <div className="flex gap-3">

                <span className="text-lavender-600">
                  ✓
                </span>

                <p className="text-sm text-ink/60 leading-6">
                  Maintain a consistent skincare routine, stay hydrated,
                  use daily sun protection, and continue monitoring your
                  skin regularly.
                </p>

              </div>

            </div>

          )}

        </div>

      </section>


      {/* ================================================= */}
      {/* DISCLAIMER */}
      {/* ================================================= */}

      <div className="px-4 pb-3 text-center">

        <p className="text-[11px] leading-5 text-ink/35 max-w-2xl mx-auto">
          DermaNova AI provides an AI-assisted visual skin assessment.
          Results are informational and should not be considered a medical
          diagnosis. Consult a qualified dermatologist for persistent,
          painful, or concerning skin conditions.
        </p>

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
  icon,
}) {

  return (

    <div className="group rounded-2xl border border-lavender-200/60 bg-white/80 backdrop-blur-xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-lavender-300">

      <div className="flex items-center justify-between">

        <p className="text-xs font-medium text-ink/45">
          {title}
        </p>

        <div className="w-8 h-8 rounded-xl bg-lavender-50 text-lavender-600 flex items-center justify-center text-sm">

          {icon}

        </div>

      </div>


      <div className="mt-4 flex items-end justify-between">

        <h3 className="text-3xl font-semibold tracking-tight text-ink">
          {value}
        </h3>

        <span className="text-[10px] text-ink/30 mb-1">
          {description}
        </span>

      </div>


      <div className="mt-5 h-1.5 rounded-full bg-lavender-100 overflow-hidden">

        <div
          className="h-full rounded-full bg-gradient-to-r from-lavender-400 to-lavender-600 transition-all duration-1000"
          style={{
            width: `${Math.min(
              Math.max(Number(progress) || 0, 0),
              100
            )}%`,
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
    "Maintain a gentle skincare routine and monitor this concern regularly.";

  if (name.includes("acne")) {

    text =
      "Use a gentle cleanser and consider salicylic acid to help manage clogged pores and breakouts.";

  } else if (name.includes("blackhead")) {

    text =
      "A gentle cleanser with salicylic acid may help reduce clogged pores. Avoid squeezing affected areas.";

  } else if (name.includes("whitehead")) {

    text =
      "Keep the skin clean with a gentle cleanser and use non-comedogenic skincare products.";

  } else if (name.includes("papule")) {

    text =
      "Use a gentle, non-comedogenic routine and avoid harsh exfoliation or irritating active ingredients.";

  } else if (name.includes("pustule")) {

    text =
      "Avoid squeezing or picking the area. Gentle cleansing and non-comedogenic products can help.";

  } else if (name.includes("nodule")) {

    text =
      "Persistent or painful nodules may require professional dermatological evaluation.";

  } else if (
    name.includes("dark spot") ||
    name.includes("dark spots")
  ) {

    text =
      "Daily broad-spectrum sunscreen is important. Niacinamide may also help improve uneven pigmentation.";

  } else if (name.includes("pigmentation")) {

    text =
      "Use daily broad-spectrum sunscreen and consider gentle ingredients such as niacinamide for uneven pigmentation.";

  } else if (name.includes("redness")) {

    text =
      "Use a gentle, fragrance-free moisturizer and avoid products that cause irritation or excessive dryness.";

  } else if (name.includes("wrinkle")) {

    text =
      "Daily sunscreen and consistent moisturization can support healthy-looking skin. Retinoids may be considered with professional guidance.";

  } else if (name.includes("dark circle")) {

    text =
      "Prioritize adequate sleep, sun protection, and gentle care around the eye area.";

  }

  return (

    <div className="group flex gap-4 rounded-2xl border border-white bg-white/80 p-5 shadow-sm transition hover:shadow-md">

      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-lavender-50 text-lavender-600 flex items-center justify-center">

        <span className="text-sm">
          ✓
        </span>

      </div>

      <div>

        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-lavender-600 mb-1">
          {issue}
        </p>

        <p className="text-sm leading-6 text-ink/60">
          {text}
        </p>

      </div>

    </div>

  );
}