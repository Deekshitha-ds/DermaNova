import { useId } from "react";
import "./SkinAnalysisCard.css";

const DEFAULT_METRICS = [
  { key: "hydration", label: "Hydration", value: "Balanced", progress: 0.78, pos: "tl" },
  { key: "texture", label: "Texture", value: "Smooth", progress: 0.9, pos: "mr" },
  { key: "radiance", label: "Radiance", value: "Glowing", progress: 0.66, pos: "bl" },
];

const RING_R = 9;
const RING_C = 2 * Math.PI * RING_R;

/**
 * Hero side card: a neutral model face being "read" by a scan line,
 * with glass chips that light up as the scan passes them.
 *
 * Props: title, subtitle, selection {title, caption}, metrics[], className
 */
export default function SkinAnalysisCard({
  title = "Made for your skin",
  subtitle = "Personalized picks. Thoughtful routines.",
  selection = {
    title: "Analysis-based selection",
    caption: "A routine made more personal",
  },
  metrics = DEFAULT_METRICS,
  className = "",
}) {
  const uid = "sa" + useId().replace(/:/g, "");
  const u = (n) => `${uid}-${n}`;
  const ref = (n) => `url(#${u(n)})`;

  return (
    <article className={`sa-card ${className}`.trim()}>
      {/* shared gradient for the gauge rings */}
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id={u("ring")} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#E040C8" />
          </linearGradient>
        </defs>
      </svg>

      <div className="sa-stage">
        <svg
          className="sa-art"
          viewBox="0 0 300 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="A skin analysis scan passing over a model face"
        >
          <defs>
            <radialGradient id={u("halo")} cx=".5" cy=".5" r=".5">
              <stop stopColor="#FFFFFF" stopOpacity=".9" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>

            <linearGradient id={u("skin")} x1="130" y1="30" x2="210" y2="150" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF8FC" />
              <stop offset="1" stopColor="#EADCF7" />
            </linearGradient>

            <linearGradient id={u("shade")} x1="134" y1="0" x2="206" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C9AEDA" stopOpacity=".42" />
              <stop offset=".22" stopColor="#C9AEDA" stopOpacity="0" />
              <stop offset=".78" stopColor="#C9AEDA" stopOpacity="0" />
              <stop offset="1" stopColor="#C9AEDA" stopOpacity=".42" />
            </linearGradient>

            <linearGradient id={u("jaw")} x1="0" y1="112" x2="0" y2="135" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C9AEDA" stopOpacity="0" />
              <stop offset="1" stopColor="#C9AEDA" stopOpacity=".32" />
            </linearGradient>

            <radialGradient id={u("sheen")} cx=".5" cy=".5" r=".5">
              <stop stopColor="#FFFFFF" stopOpacity=".9" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>

            <linearGradient id={u("band")} x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#D946EF" stopOpacity="0" />
              <stop offset="1" stopColor="#D946EF" stopOpacity=".34" />
            </linearGradient>

            <linearGradient id={u("line")} x1="0" y1="0" x2="1" y2="0">
              <stop stopColor="#C45BE8" stopOpacity="0" />
              <stop offset=".5" stopColor="#C45BE8" stopOpacity=".95" />
              <stop offset="1" stopColor="#C45BE8" stopOpacity="0" />
            </linearGradient>

            <filter id={u("soft")} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" />
            </filter>

            <path
              id={u("face")}
              d="M170 28 C193 28 207 46 207 72 C207 90 204 102 199 112 C194 122 187 130 178 133.5 C175 134.6 172.5 135 170 135 C167.5 135 165 134.6 162 133.5 C153 130 146 122 141 112 C136 102 133 90 133 72 C133 46 147 28 170 28 Z"
            />

            {/* face outline in panel space — keeps the scan glow on the face only */}
            <clipPath id={u("faceClip")}>
              <use href={`#${u("face")}`} transform="translate(150 128) scale(1.6) translate(-170 -81.5)" />
            </clipPath>
            {/* the same outline in face space, for the shading inside the face group */}
            <clipPath id={u("faceLocal")}>
              <use href={`#${u("face")}`} />
            </clipPath>
          </defs>

          {/* soft light behind the face + floor shadow */}
          <circle cx="150" cy="128" r="118" fill={ref("halo")} />
          <ellipse cx="150" cy="233" rx="52" ry="6" fill="#9A7BD0" opacity=".16" />

          {/* scan frame */}
          <g className="sa-frame" stroke="#B79AE8" strokeWidth="1.2" strokeLinecap="round" opacity=".7">
            <path d="M16 34 V16 H34" />
            <path d="M266 16 H284 V34" />
            <path d="M16 226 V244 H34" />
            <path d="M284 226 V244 H266" />
          </g>

          {/* face */}
          <g transform="translate(150 128) scale(1.6) translate(-170 -81.5)">
            <use
              href={`#${u("face")}`}
              fill={ref("skin")}
              stroke="#FFFFFF"
              strokeWidth=".9"
              strokeLinejoin="round"
            />

            <g clipPath={`url(#${u("faceLocal")})`}>
              <use href={`#${u("face")}`} fill={ref("shade")} />
              <use href={`#${u("face")}`} fill={ref("jaw")} />
              <ellipse cx="158" cy="46" rx="22" ry="12" fill={ref("sheen")} />
              <g filter={`url(#${u("soft")})`}>
                <path d="M139 94 Q144 110 158 120" stroke="#C9AEDA" strokeWidth="6" strokeLinecap="round" opacity=".22" />
                <path d="M201 94 Q196 110 182 120" stroke="#C9AEDA" strokeWidth="6" strokeLinecap="round" opacity=".22" />
                <ellipse cx="137" cy="60" rx="5" ry="12" fill="#CDB3DC" opacity=".25" />
                <ellipse cx="203" cy="60" rx="5" ry="12" fill="#CDB3DC" opacity=".25" />
                <ellipse cx="170" cy="104" rx="7" ry="2" fill="#CDB3DC" opacity=".3" />
                <ellipse cx="170" cy="125" rx="8" ry="2.2" fill="#CDB3DC" opacity=".3" />
                <ellipse cx="170" cy="87" rx="1.8" ry="9" fill="#FFFFFF" opacity=".6" />
                <ellipse cx="170" cy="98" rx="3" ry="1.8" fill="#FFFFFF" opacity=".5" />
                <ellipse cx="148" cy="90" rx="6" ry="3" fill="#FFFFFF" opacity=".4" transform="rotate(-25 148 90)" />
                <ellipse cx="192" cy="90" rx="6" ry="3" fill="#FFFFFF" opacity=".4" transform="rotate(25 192 90)" />
                <ellipse cx="170" cy="128" rx="6" ry="2.6" fill="#FFFFFF" opacity=".45" />
              </g>
            </g>

            {/* quiet, tone-on-tone features */}
            <path d="M149 67 Q157 63.5 165 65.5" stroke="#BBA3CB" strokeWidth="1.3" strokeLinecap="round" opacity=".6" />
            <path d="M175 65.5 Q183 63.5 191 67" stroke="#BBA3CB" strokeWidth="1.3" strokeLinecap="round" opacity=".6" />
            <path d="M150 76 Q157 79.2 164 76" stroke="#A58DB8" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M176 76 Q183 79.2 190 76" stroke="#A58DB8" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M166.5 70 Q165 84 164.5 96" stroke="#D5BCDB" strokeWidth=".9" strokeLinecap="round" opacity=".55" />
            <path d="M173.5 70 Q175 84 175.5 96" stroke="#D5BCDB" strokeWidth=".9" strokeLinecap="round" opacity=".55" />
            <path d="M164 98 C164.5 101.5 167 102.5 170 102.5 C173 102.5 175.5 101.5 176 98" stroke="#BF9FC7" strokeWidth="1" strokeLinecap="round" />
            <path d="M166 100.4 Q167 101.4 168.6 100.9 M174 100.4 Q173 101.4 171.4 100.9" stroke="#A98DBA" strokeWidth=".9" strokeLinecap="round" />
            <path d="M160 114 C164 112.2 167 111.4 170 112.2 C173 111.4 176 112.2 180 114 C176 115.6 173 116 170 116 C167 116 164 115.6 160 114 Z" fill="#D8C4E5" opacity=".75" />
            <path d="M160.5 114.6 C164 116 167 116.3 170 116.3 C173 116.3 176 116 179.5 114.6 C177 119.6 173.5 120.6 170 120.6 C166.5 120.6 163 119.6 160.5 114.6 Z" fill="#E3D3EE" opacity=".8" />
            <path d="M160 114.2 C164 115.6 167 116 170 116 C173 116 176 115.6 180 114.2" stroke="#B9A0CB" strokeWidth=".9" strokeLinecap="round" />

            {/* analysis mesh */}
            <g className="sa-mesh">
              <g stroke="#9B6CF0" strokeWidth=".35" strokeLinecap="round">
                <path d="M141 68 L170 48 L199 68" />
                <path d="M141 68 L146 100 L170 96 L194 100 L199 68" />
                <path d="M170 48 L170 96 M141 68 L170 96 M199 68 L170 96" />
                <path d="M146 100 L170 128 L194 100 M170 96 L170 128" />
              </g>
              <g fill="#FFFFFF" stroke="#9B6CF0" strokeWidth=".5">
                {[
                  [170, 48], [141, 68], [199, 68], [146, 100], [194, 100], [170, 96], [170, 128],
                ].map(([x, y]) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" />
                ))}
              </g>
            </g>
          </g>

          {/* scan: glow only on the face, line across the frame */}
          <g clipPath={`url(#${u("faceClip")})`}>
            <g className="sa-scan">
              <rect x="60" y="-34" width="180" height="34" fill={ref("band")} />
            </g>
          </g>
          <g className="sa-scan">
            <rect x="24" y="-.75" width="252" height="1.5" fill={ref("line")} />
          </g>
        </svg>

        {metrics.map((m, i) => (
          <div
            key={m.key}
            className={`sa-chip sa-chip--${m.pos}`}
            style={{ "--sa-delay": `${0.7 + i * 0.95}s` }}
          >
            <svg className="sa-ring" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r={RING_R} stroke="#E9DDFB" strokeWidth="3" fill="none" />
              <circle
                cx="12"
                cy="12"
                r={RING_R}
                stroke={ref("ring")}
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C * (1 - m.progress)}
                transform="rotate(-90 12 12)"
              />
            </svg>
            <span className="sa-chip-text">
              <span className="sa-chip-label">{m.label}</span>
              <span className="sa-chip-value">{m.value}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="sa-copy">
        <h3 className="sa-title">{title}</h3>
        <p className="sa-sub">{subtitle}</p>
      </div>

      <div className="sa-selection">
        <span className="sa-check" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="#7C4DDB" strokeWidth="1.4" />
            <path d="M6.8 10.2l2.2 2.2 4.2-4.4" stroke="#7C4DDB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="sa-selection-text">
          <span className="sa-selection-title">{selection.title}</span>
          <span className="sa-selection-caption">{selection.caption}</span>
        </span>

        {/* the routine this selection builds: cleanser, serum, cream */}
        <span className="sa-routine" aria-hidden="true">
          <svg viewBox="0 0 60 22" fill="none">
            <rect x="3" y="4" width="9" height="16" rx="3" fill="#E6D8FA" stroke="#C7AEEF" strokeWidth=".8" />
            <rect x="5" y="1.5" width="5" height="3.5" rx="1.2" fill="#B99AE6" />
            <rect x="23" y="8" width="11" height="12" rx="3" fill="#F3D5EE" stroke="#E0A8D8" strokeWidth=".8" />
            <rect x="26" y="3" width="5" height="5" rx="1.5" fill="#D58BC8" />
            <rect x="45" y="11" width="12" height="9" rx="3" fill="#E6D8FA" stroke="#C7AEEF" strokeWidth=".8" />
            <rect x="46.5" y="8" width="9" height="3.5" rx="1.5" fill="#B99AE6" />
          </svg>
        </span>
      </div>
    </article>
  );
}
