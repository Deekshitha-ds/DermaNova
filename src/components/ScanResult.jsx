import { useEffect, useState } from "react";

export default function ScanResult({ result }) {
  if (!result) return null;
  const [isSaved, setIsSaved] = useState(false);

  const analysisId = result.analysis_id;

  const saveKey = analysisId
    ? `dermanova_saved_scan_${analysisId}`
    : null;

  useEffect(() => {
    if (!saveKey) return;

    const saved =
      localStorage.getItem(saveKey) === "true";

    setIsSaved(saved);
  }, [saveKey]);

  const handleSaveScan = () => {
    if (!saveKey) return;

    localStorage.setItem(saveKey, "true");

    setIsSaved(true);
  };

  const health = Math.round(result.scores?.health ?? 0);
  const oiliness = Math.round(result.scores?.oiliness ?? 0);
  const hydration = Math.round(result.scores?.hydration ?? 0);
  const confidence = Math.round(result.scores?.confidence ?? 0);

  const skinMetrics = result.skin_metrics ?? {};
  const darkCircles = result.dark_circles ?? {};

  const backendBaseUrl =
   import.meta.env.VITE_BACKEND_URL ||
  "http://127.0.0.1:8000";

  const processedImageUrl = result.processed_image
  ? result.processed_image.startsWith("http")
    ? result.processed_image
    : `${backendBaseUrl}${result.processed_image}`
  : null;

  const unevenTone = Math.round(
    skinMetrics.uneven_tone ?? 0
  );

  const pigmentation = Math.round(
    skinMetrics.pigmentation ?? 0
  );

  const darkSpots = Math.round(
    skinMetrics.dark_spots ?? 0
  );

  const redness = Math.round(
    skinMetrics.redness ?? 0
  );
  const darkCircleScore = Math.round(
  darkCircles.overall ?? 0
);

  const detections = result.detections ?? [];
    /* ========================================================= */
    /* GROUP DETECTIONS BY UNIQUE CONDITION */
    /* ========================================================= */

    const groupedDetections = (() => {
      const groups = {};

      detections.forEach((item) => {
        const issueName =
          item?.issue ||
          item?.class_name ||
          item?.name ||
          item?.label ||
          "Unknown";

        const cleanName = String(issueName)
          .trim()
          .replace(/blackheads?/i, "Blackhead")
          .replace(/whiteheads?/i, "Whitehead")
          .replace(/papules?/i, "Papule")
          .replace(/pustules?/i, "Pustule")
          .replace(/nodules?/i, "Nodule")
          .replace(/dark spots?/i, "Dark Spot");
        // Normalize the name so repeated detections
        // of the same condition are grouped together.
        const key = cleanName.toLowerCase();

        const confidenceValue = Number(
          item?.confidence ?? 0
        );

        if (!groups[key]) {
          groups[key] = {
            issue: cleanName,
            confidenceValues: [],
          };
        }

        groups[key].confidenceValues.push(
          confidenceValue
        );
      });

      return Object.values(groups).map((group) => {
        const values = group.confidenceValues;

        const highestConfidence =
  values.length > 0
    ? Math.max(...values)
    : 0;

        return {
          issue: group.issue,
          confidence: Math.round(
            Math.min(
            Math.max(highestConfidence, 0),
            100
          )
        ),
        };
      });
    })();
    const getIssueDescription = (issue) => {
      const name = issue?.toLowerCase() ?? "";

      if (name.includes("blackhead")) {
        return "An acne type caused by clogged pores that appear dark on the skin.";
      }

      if (name.includes("whitehead")) {
        return "An acne type caused by clogged pores that remain closed beneath the skin.";
      }

      if (name.includes("papule")) {
        return "An inflammatory acne type that appears as small, raised bumps on the skin.";
      }

      if (name.includes("pustule")) {
        return "An inflammatory acne type that appears as a raised bump containing visible pus.";
      }

      if (name.includes("nodule")) {
        return "A deeper, more solid inflammatory acne type that develops beneath the skin.";
      }

      if (name.includes("dark spot")) {
        return "A visible pigmentation concern that can remain after acne or skin inflammation.";
      }

      return "A skin concern identified during the facial analysis.";
    };
  /* ========================================================= */
  /* RECOMMENDATION DATA */
  /* ========================================================= */

  const fullRecommendation =
    result.full_recommendation ?? {};

  const profile =
    fullRecommendation.profile ?? {};

  const routine =
    fullRecommendation.routine ?? {};

  const products =
    fullRecommendation.products ?? [];

  const focus =
    fullRecommendation.focus ?? [];

  const avoid =
    fullRecommendation.avoid ?? [];

  const notes =
    fullRecommendation.notes ?? [];

  /* ========================================================= */
  /* SEVERITY */
  /* ========================================================= 

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
*/

  /* ========================================================= */
  /* ISSUE ICON */
  /* ========================================================= 

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
  };*/
 
  /* ========================================================= */
  /* HEALTH LABEL */
  /* ========================================================= */

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
                <span className="text-lavender-600">
                  {" "}Report
                </span>
              </h2>

              <p className="mt-2 text-sm text-ink/45">
                AI-powered facial skin assessment by DermaNova
              </p>

            </div>

           <div className="self-start md:self-center flex items-center gap-3">

  <div className="flex items-center gap-2 rounded-full border border-lavender-200 bg-lavender-50/70 px-4 py-2">

    <span className="text-lavender-600 text-sm">
      ✦
    </span>

    <span className="text-xs font-semibold tracking-wide text-lavender-700">
      DERMANOVA AI
    </span>

  </div>

  <button
    type="button"
    onClick={handleSaveScan}
    disabled={isSaved}
    className={`
      group flex items-center gap-2 rounded-full
      border px-4 py-2
      text-xs font-semibold
      transition-all duration-300
      ${
        isSaved
          ? "border-lavender-200 bg-lavender-50 text-lavender-700"
          : "border-ink/10 bg-white/70 text-ink/55 hover:border-lavender-200 hover:bg-lavender-50 hover:text-lavender-700"
      }
    `}
    aria-label={
      isSaved
        ? "Scan saved"
        : "Save this scan"
    }
  >

    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill={isSaved ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-300 group-hover:scale-105"
    >
      <path d="M6 3.75A1.75 1.75 0 0 1 7.75 2h8.5A1.75 1.75 0 0 1 18 3.75v17.1a.65.65 0 0 1-1.02.53L12 17.8l-4.98 3.58A.65.65 0 0 1 6 20.85V3.75Z" />
    </svg>

    <span>
      {isSaved ? "Saved" : "Save Scan"}
    </span>

  </button>

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
                {groupedDetections.length}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-ink/30">
                 confidence
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {confidence}%
              </p>
            </div>

          </div>

        </div>

      </section>
{/* ================================================= */}
{/* FACE VISUALIZATION */}
{/* ================================================= */}

<section className="relative overflow-hidden rounded-[32px] border border-lavender-200/60 bg-white/80 backdrop-blur-xl shadow-[0_18px_50px_rgba(80,60,120,0.08)] p-6 md:p-8">

  <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-lavender-200/20 blur-3xl" />

  <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-purple-200/15 blur-3xl" />

  <div className="relative">

    <div className="mb-6">

      <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-lavender-600">
        Facial Visualization
      </p>

      <h3 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
        Your skin concerns on the face
      </h3>

      <p className="mt-2 text-sm text-ink/40">
        Highlighted regions are generated from your facial scan.
      </p>

    </div>

    {processedImageUrl ? (

      <div className="space-y-5">

        {/* FACE IMAGE */}

        <div className="relative overflow-hidden rounded-[28px] border border-lavender-100 bg-[#f7f4ff] shadow-inner">

          <img
            src={processedImageUrl}
            alt="DermaNova facial skin analysis visualization"
            className="block w-full max-h-[720px] object-contain"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

        </div>

        {/* DETECTED CONCERNS */}

        <div className="rounded-2xl border border-lavender-100 bg-white/70 p-5">

          <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-lavender-600">
            Detected on your face
          </p>

          <div className="mt-3 flex flex-wrap gap-2">

            {groupedDetections.length > 0 ? (

              groupedDetections.map((item) => (

                <div
                  key={item.issue}
                  className="rounded-full border border-lavender-100 bg-lavender-50/70 px-3.5 py-2"
                >

                  <span className="text-xs font-medium text-ink">
                    {item.issue}
                  </span>

                  <span className="ml-2 text-[10px] text-lavender-600">
                    {item.confidence}%
                  </span>

                </div>

              ))

            ) : (

              <p className="text-sm text-ink/45">
                No trained acne lesion types were detected.
              </p>

            )}

          </div>

        </div>

      </div>

    ) : (

      <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-6 text-center">

        <p className="text-sm text-amber-700">
          Facial visualization is not available for this scan.
        </p>

      </div>

    )}

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
              Your skin health score is based on the visual
              characteristics identified during your DermaNova
              AI analysis.
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
      {/* SKIN CONDITION BREAKDOWN */}
      {/* ================================================= */}

      <section className="relative overflow-hidden rounded-[32px] border border-lavender-200/60 bg-white/80 backdrop-blur-xl shadow-[0_18px_50px_rgba(80,60,120,0.07)] p-7 md:p-9">

        <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-lavender-200/20 blur-3xl" />

        <div className="relative">

          <div className="mb-8">

            <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-lavender-600">
              Visual Skin Analysis
            </p>

            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
              Skin condition breakdown
            </h3>

            <p className="mt-2 text-sm text-ink/40">
              Visual indicators identified from your facial scan
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <SkinConditionCard
              title="Uneven Skin Tone"
              value={unevenTone}
              description="Tone consistency across the detected facial region"
              icon="◐"
            />

            <SkinConditionCard
              title="Pigmentation"
              value={pigmentation}
              description="Visible variation in skin pigmentation"
              icon="◒"
            />

            <SkinConditionCard
              title="Dark Spots"
              value={darkSpots}
              description="Localized darker areas detected in the skin"
              icon="◉"
            />

            <SkinConditionCard
              title="Redness"
              value={redness}
              description="Visible redness detected across the facial region"
              icon="◌"
            />
            <SkinConditionCard
  title="Dark Circles"
  value={darkCircleScore}
  description="Under-eye visual indicator"
  icon="◉"
/>

          </div>

        </div>

      </section>


            {/* ================================================= */}
      {/* DETECTED CONCERNS */}
      {/* ================================================= */}

      <section className="rounded-[32px] border border-lavender-200/60 bg-white/80 backdrop-blur-xl shadow-[0_18px_50px_rgba(80,60,120,0.07)] p-7 md:p-9">

        <div className="mb-7">

          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-lavender-600">
            AI Detection
          </p>

          <h3 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
  Acne & Skin Concerns
</h3>



          <p className="mt-1 text-sm text-ink/40">
  Skin concerns identified from your facial scan
</p>
        </div>


        {groupedDetections.length === 0 ? (

          <div className="rounded-2xl border border-lavender-100 bg-lavender-50/40 p-7 text-center">

            <div className="mx-auto w-12 h-12 rounded-full bg-white border border-lavender-100 flex items-center justify-center">

              <span className="text-xl text-lavender-500">
                ✓
              </span>

            </div>

           <h4 className="mt-4 text-base font-semibold text-ink">
  No acne lesions detected
</h4>

<p className="mt-2 text-sm text-ink/45 max-w-md mx-auto">
  No trained acne lesion types were identified in the analyzed facial region.
  Other skin metrics are shown separately in your report.
</p>

          </div>

        ) : (

          <div className="space-y-4">

            {groupedDetections.map((item) => {

             

              return (

                <div
                  key={item.issue}
                  className="rounded-2xl border border-lavender-100 bg-white/70 p-4 transition-all duration-300 hover:border-lavender-200 hover:shadow-[0_12px_30px_rgba(90,70,140,0.07)]"
                >
                
                
                

                  {/* CONDITION + PERCENTAGE */}

                  <div className="flex items-center justify-between gap-5">

                    <div className="flex items-center">

                     
                      <div>

                        <h4 className="text-base font-semibold text-ink">
                          {item.issue}
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-ink/45 max-w-md">
  {getIssueDescription(item.issue)}
</p>


                      </div>

                    </div>


                    <div className="text-right">

                      <span className="text-xl md:text-2xl font-semibold tracking-tight text-ink">
                        {item.confidence}%
                      </span>
                      <p className="text-[10px] uppercase tracking-wider text-ink/30">
                        AI confidence
                      </p>

                    </div>

                  </div>


                  {/* CONFIDENCE BAR */}

                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-[0.14em] text-ink/30">
                        Detection confidence
                      </span>

                      <span className="text-[10px] text-ink/30">
                        {item.confidence}%
                      </span>
                    </div>

                    <div className="h-1 rounded-full bg-lavender-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-lavender-400"
                        style={{
                          width: `${item.confidence}%`,
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

<section className="relative overflow-hidden rounded-[34px] border border-lavender-200/60 bg-white/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(80,60,120,0.08)]">

  {/* Soft background accents */}
  <div className="pointer-events-none absolute -top-28 -right-24 h-72 w-72 rounded-full bg-lavender-200/20 blur-3xl" />
  <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-purple-200/10 blur-3xl" />

  <div className="relative p-7 md:p-10">

    {/* ================================================= */}
    {/* HEADER */}
    {/* ================================================= */}

    <div className="max-w-2xl">

      <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-lavender-600">
        DermaNova Intelligence
      </p>

      <h3 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-ink">
        Personalized insights
      </h3>

      <p className="mt-3 text-sm md:text-[15px] leading-7 text-ink/45">
        A tailored skincare plan based on the visual characteristics
        identified during your DermaNova analysis.
      </p>

    </div>


    {/* ================================================= */}
    {/* SKIN PROFILE */}
    {/* ================================================= */}

    {profile.summary && (

      <div className="mt-10 border-t border-ink/5 pt-8">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

          <div>

            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-lavender-600">
              01 · Skin profile
            </p>

            <h4 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-ink">
              {profile.skin_type || result.detected_type || "Skin"}
              {" "}
              Skin
            </h4>

          </div>

          <span className="text-[10px] uppercase tracking-[0.16em] text-ink/30">
            AI assessment
          </span>

        </div>

        <p className="mt-5 max-w-4xl text-sm leading-7 text-ink/55">
          {profile.summary}
        </p>

      </div>

    )}


    {/* ================================================= */}
    {/* DAILY ROUTINE */}
    {/* ================================================= */}

    {(routine.morning?.length > 0 || routine.night?.length > 0) && (

      <div className="mt-10 border-t border-ink/5 pt-8">

        <div className="mb-7">

          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-lavender-600">
            02 · Daily routine
          </p>

          <h4 className="mt-2 text-xl md:text-2xl font-semibold tracking-tight text-ink">
            A simple routine for your skin
          </h4>

        </div>

        <div className="grid lg:grid-cols-2 gap-x-12 gap-y-8">

          {/* MORNING */}

          <div>

            <div className="flex items-center justify-between pb-3 border-b border-ink/5">

              <h5 className="text-sm font-semibold text-ink">
                Morning
              </h5>

              <span className="text-[10px] uppercase tracking-[0.16em] text-ink/30">
                AM
              </span>

            </div>

            <div className="mt-5 space-y-5">

              {routine.morning?.map((step, index) => (

                <div
                  key={index}
                  className="flex items-start gap-4"
                >

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lavender-50 border border-lavender-100 text-[11px] font-semibold text-lavender-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="pt-0.5">

                    <p className="text-sm font-medium leading-6 text-ink">
                      {typeof step === "object"
                        ? step.product
                        : step}
                    </p>

                    {typeof step === "object" &&
                      step.purpose && (

                        <p className="mt-1 max-w-md text-xs leading-5 text-ink/40">
                          {step.purpose}
                        </p>

                    )}

                  </div>

                </div>

              ))}

            </div>

          </div>


          {/* NIGHT */}

          <div>

            <div className="flex items-center justify-between pb-3 border-b border-ink/5">

              <h5 className="text-sm font-semibold text-ink">
                Night
              </h5>

              <span className="text-[10px] uppercase tracking-[0.16em] text-ink/30">
                PM
              </span>

            </div>

            <div className="mt-5 space-y-5">

              {routine.night?.map((step, index) => (

                <div
                  key={index}
                  className="flex items-start gap-4"
                >

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lavender-50 border border-lavender-100 text-[11px] font-semibold text-lavender-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="pt-0.5">

                    <p className="text-sm font-medium leading-6 text-ink">
                      {typeof step === "object"
                        ? step.product
                        : step}
                    </p>

                    {typeof step === "object" &&
                      step.purpose && (

                        <p className="mt-1 max-w-md text-xs leading-5 text-ink/40">
                          {step.purpose}
                        </p>

                    )}

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    )}


    {/* ================================================= */}
    {/* RECOMMENDED SKINCARE */}
    {/* ================================================= */}

    {products.length > 0 && (

      <div className="mt-10 border-t border-ink/5 pt-8">

        <div className="mb-6">

          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-lavender-600">
            03 · Recommended skincare
          </p>

          <h4 className="mt-2 text-xl md:text-2xl font-semibold tracking-tight text-ink">
            Selected for your profile
          </h4>

        </div>

        <div className="divide-y divide-ink/5 border-y border-ink/5">

          {products.map((product, index) => (

            <div
              key={index}
              className="grid md:grid-cols-[140px_minmax(0,1fr)_auto] gap-3 md:gap-6 py-5"
            >

              <div>

                <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-lavender-600">
                  {product.category}
                </p>

              </div>

              <div>

                <p className="text-sm font-semibold text-ink">
                  {product.recommendation}
                </p>

                {product.reason && (

                  <p className="mt-1.5 max-w-2xl text-xs leading-5 text-ink/45">
                    {product.reason}
                  </p>

                )}

              </div>

              {product.priority && (

                <div className="md:text-right">

                  <span className="text-[10px] uppercase tracking-[0.14em] text-ink/30">
                    {product.priority}
                  </span>

                </div>

              )}

            </div>

          ))}

        </div>

      </div>

    )}


    {/* ================================================= */}
    {/* PERSONAL FOCUS */}
    {/* ================================================= */}

    {focus.length > 0 && (

      <div className="mt-10 border-t border-ink/5 pt-8">

        <div className="mb-6">

          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-lavender-600">
            04 · Personal focus
          </p>

          <h4 className="mt-2 text-xl md:text-2xl font-semibold tracking-tight text-ink">
            What deserves your attention
          </h4>

        </div>

        <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">

          {focus.map((item, index) => (

            <div
              key={index}
              className="border-l border-lavender-200 pl-5"
            >

              <div className="flex items-center justify-between gap-4">

                <h5 className="text-sm font-semibold text-ink">
                  {typeof item === "object"
                    ? item.title
                    : item}
                </h5>

                {typeof item === "object" &&
                  item.priority && (

                    <span className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-ink/30">
                      {item.priority}
                    </span>

                  )}

              </div>

              {typeof item === "object" &&
                item.description && (

                  <p className="mt-2 text-xs leading-5 text-ink/45">
                    {item.description}
                  </p>

                )}

            </div>

          ))}

        </div>

      </div>

    )}


    {/* ================================================= */}
    {/* ROUTINE NOTES */}
    {/* ================================================= */}

    {(avoid.length > 0 || notes.length > 0) && (

      <div className="mt-10 border-t border-ink/5 pt-8">

        <div className="grid lg:grid-cols-2 gap-10">

          {/* WHAT TO AVOID */}

          {avoid.length > 0 && (

            <div>

              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-lavender-600">
                05 · Routine notes
              </p>

              <h4 className="mt-2 text-base font-semibold text-ink">
                What to avoid
              </h4>

              <div className="mt-4 space-y-3">

                {avoid.map((item, index) => (

                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >

                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lavender-300" />

                    <p className="text-sm leading-6 text-ink/50">
                      {item}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          )}


          {/* IMPORTANT NOTES */}

          {notes.length > 0 && (

            <div>

              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-lavender-600">
                Important notes
              </p>

              <div className="mt-4 space-y-3">

                {notes.map((note, index) => (

                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >

                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lavender-300" />

                    <p className="text-sm leading-6 text-ink/50">
                      {note}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          )}

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

          DermaNova AI provides an AI-assisted visual skin
          assessment. Results are informational and should not
          be considered a medical diagnosis. Consult a qualified
          dermatologist for persistent, painful, or concerning
          skin conditions.

        </p>

      </div>

    </div>
  );
}
function LegendItem({
  color,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-3">

      <span
        className={`mt-1.5 w-3 h-3 rounded-full shrink-0 ${color}`}
      />

      <div>

        <p className="text-sm font-semibold text-ink">
          {title}
        </p>

        <p className="mt-0.5 text-xs leading-5 text-ink/40">
          {description}
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
/* SKIN CONDITION CARD */
/* ========================================================= */

function SkinConditionCard({
  title,
  value,
  description,
  icon,
}) {

  const score = Math.min(
    Math.max(Number(value) || 0, 0),
    100
  );

  let status = "Low";

  let statusClass =
    "bg-emerald-50 text-emerald-600 border-emerald-100";

  if (score >= 75) {

    status = "High";

    statusClass =
      "bg-red-50 text-red-600 border-red-100";

  } else if (score >= 50) {

    status = "Moderate";

    statusClass =
      "bg-amber-50 text-amber-600 border-amber-100";

  }

  return (

    <div className="group relative overflow-hidden rounded-2xl border border-ink/5 bg-white/90 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-lavender-200 hover:shadow-[0_15px_35px_rgba(90,70,140,0.10)]">

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lavender-300/70 to-transparent opacity-0 group-hover:opacity-100 transition" />


      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-4">

          <div className="w-11 h-11 rounded-2xl bg-lavender-50 border border-lavender-100 flex items-center justify-center text-lavender-600 text-lg">
            {icon}
          </div>

          <div>

            <h4 className="font-semibold text-base text-ink">
              {title}
            </h4>

            <p className="text-xs text-ink/35 mt-1">
              Visual indicator
            </p>

          </div>

        </div>


        <span
          className={`px-3 py-1 rounded-full border text-[10px] font-semibold ${statusClass}`}
        >
          {status}
        </span>

      </div>


      <div className="mt-6 flex items-end justify-between">

        <div>

          <span className="text-3xl font-semibold tracking-tight text-ink">
            {score}
          </span>

          <span className="ml-1 text-xs text-ink/30">
            / 100
          </span>

        </div>

        <span className="text-[10px] uppercase tracking-wider text-ink/30">
          Indicator score
        </span>

      </div>


      <div className="mt-4 h-2 rounded-full bg-lavender-100 overflow-hidden">

        <div
          className="h-full rounded-full bg-gradient-to-r from-lavender-400 to-lavender-600 transition-all duration-1000"
          style={{
            width: `${score}%`,
          }}
        />

      </div>


      <p className="mt-4 text-xs leading-5 text-ink/45">
        {description}
      </p>

    </div>

  );
}


/* ========================================================= */
/* OLD RECOMMENDATION COMPONENT */
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