import { useEffect, useId, useState } from "react";
import "./SerumLoader.css";

const DEFAULT_MESSAGES = [
  "Reading your skin profile",
  "Matching active ingredients",
  "Composing your routine",
];

/**
 * Props
 * - messages:    caption lines, one per step
 * - duration:    one full ritual loop in ms (animation, caption and steps stay in sync)
 * - showCaption: set false if your page already shows its own status text / progress bar
 * - label:       announcement for screen readers
 */
export default function SerumLoader({
  messages = DEFAULT_MESSAGES,
  duration = 4500,
  showCaption = true,
  label = "Preparing your personalized skincare recommendations",
  className = "",
}) {
  const uid = "dn" + useId().replace(/:/g, "");
  const u = (n) => `${uid}-${n}`;
  const ref = (n) => `url(#${u(n)})`;

  const [index, setIndex] = useState(0);
  const count = messages.length;
  const stepMs = duration / Math.max(count, 1);

  useEffect(() => {
    if (count < 2) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), stepMs);
    return () => clearInterval(t);
  }, [count, stepMs]);

  // Face is drawn in its own coordinate space, then placed in the scene.
  const FACE_T = "translate(196 112) scale(1.15) translate(-170 -81.5)";

  return (
    <div
      className={`dn-ritual-loader ${className}`.trim()}
      role="status"
      style={{ "--dn-cycle": `${duration}ms`, "--dn-step": `${stepMs}ms` }}
    >
      <span className="dn-ritual-sr">{label}</span>

      <svg
        className="dn-ritual-art"
        viewBox="0 0 320 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* ---------- light & atmosphere ---------- */}
          <radialGradient id={u("glow")} cx=".5" cy=".5" r=".5">
            <stop stopColor="#FFFFFF" stopOpacity=".95" />
            <stop offset=".55" stopColor="#F1E6FC" stopOpacity=".5" />
            <stop offset="1" stopColor="#F1E6FC" stopOpacity="0" />
          </radialGradient>

          <linearGradient id={u("plinth")} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#E7DAF7" />
          </linearGradient>

          <linearGradient id={u("plinthEdge")} x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#D8C6F0" stopOpacity="0" />
            <stop offset=".5" stopColor="#D8C6F0" stopOpacity=".9" />
            <stop offset="1" stopColor="#D8C6F0" stopOpacity="0" />
          </linearGradient>

          {/* ---------- porcelain face ---------- */}
          <linearGradient id={u("skin")} x1="140" y1="30" x2="205" y2="132" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset=".45" stopColor="#F5ECFB" />
            <stop offset="1" stopColor="#DECBF0" />
          </linearGradient>

          <linearGradient id={u("shade")} x1="133" y1="0" x2="207" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B99BD6" stopOpacity=".2" />
            <stop offset=".25" stopColor="#B99BD6" stopOpacity="0" />
            <stop offset=".6" stopColor="#B99BD6" stopOpacity="0" />
            <stop offset="1" stopColor="#A481C8" stopOpacity=".46" />
          </linearGradient>

          <linearGradient id={u("jaw")} x1="0" y1="110" x2="0" y2="135" gradientUnits="userSpaceOnUse">
            <stop stopColor="#B99BD6" stopOpacity="0" />
            <stop offset="1" stopColor="#B99BD6" stopOpacity=".34" />
          </linearGradient>

          <linearGradient id={u("rim")} x1="133" y1="0" x2="207" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E3D2F3" />
            <stop offset=".55" stopColor="#EBDDF7" />
            <stop offset="1" stopColor="#FFFFFF" />
          </linearGradient>

          <radialGradient id={u("sheen")} cx=".5" cy=".5" r=".5">
            <stop stopColor="#FFFFFF" stopOpacity=".95" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          <filter id={u("soft")} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.8" />
          </filter>

          <filter id={u("blur6")} x="-30%" y="-80%" width="160%" height="260%">
            <feGaussianBlur stdDeviation="5" />
          </filter>

          <path
            id={u("face")}
            d="M170 28 C193 28 207 46 207 72 C207 90 204 102 199 112 C194 122 187 130 178 133.5 C175 134.6 172.5 135 170 135 C167.5 135 165 134.6 162 133.5 C153 130 146 122 141 112 C136 102 133 90 133 72 C133 46 147 28 170 28 Z"
          />

          {/* the face outline in scene space — keeps light effects on the skin */}
          <clipPath id={u("faceClip")}>
            <use href={`#${u("face")}`} transform={FACE_T} />
          </clipPath>
          <clipPath id={u("faceLocal")}>
            <use href={`#${u("face")}`} />
          </clipPath>

          {/* ---------- glass, liquid, metal ---------- */}
          <linearGradient id={u("glass")} x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#FFFFFF" stopOpacity=".95" />
            <stop offset=".35" stopColor="#EADDF8" stopOpacity=".75" />
            <stop offset=".8" stopColor="#CDB6EC" stopOpacity=".85" />
            <stop offset="1" stopColor="#B99AE0" stopOpacity=".95" />
          </linearGradient>

          <linearGradient id={u("liquid")} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#F3E9FC" />
            <stop offset=".45" stopColor="#CDAEF0" />
            <stop offset="1" stopColor="#A67AE2" />
          </linearGradient>

          <linearGradient id={u("metal")} x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#D9AC98" />
            <stop offset=".2" stopColor="#FBE8E0" />
            <stop offset=".45" stopColor="#E7BFAD" />
            <stop offset=".7" stopColor="#FFF1EB" />
            <stop offset="1" stopColor="#CD9C86" />
          </linearGradient>

          <linearGradient id={u("tube")} x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#C4AEE3" stopOpacity=".9" />
            <stop offset=".4" stopColor="#FFFFFF" stopOpacity=".95" />
            <stop offset="1" stopColor="#CDB8EA" stopOpacity=".9" />
          </linearGradient>

          <radialGradient id={u("bulb")} cx=".32" cy=".28" r=".95">
            <stop stopColor="#F0E4FB" />
            <stop offset=".55" stopColor="#C7ADEA" />
            <stop offset="1" stopColor="#9F7FD0" />
          </radialGradient>

          <radialGradient id={u("bloom")} cx=".5" cy=".5" r=".5">
            <stop stopColor="#FFFFFF" stopOpacity=".9" />
            <stop offset=".35" stopColor="#F4CDF6" stopOpacity=".7" />
            <stop offset="1" stopColor="#D9A9F0" stopOpacity="0" />
          </radialGradient>

          <linearGradient id={u("sweep")} x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#E9C4F4" stopOpacity="0" />
            <stop offset=".34" stopColor="#F2CFF6" stopOpacity=".6" />
            <stop offset=".5" stopColor="#FFFFFF" stopOpacity=".95" />
            <stop offset=".66" stopColor="#F2CFF6" stopOpacity=".6" />
            <stop offset="1" stopColor="#E9C4F4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ===== Stage ===== */}
        <circle cx="196" cy="112" r="116" fill={ref("glow")} />

        {/* orbit: a hairline ring with one light travelling around it */}
        <circle cx="196" cy="112" r="92" stroke="#D5C2EE" strokeWidth=".8" opacity=".75" />
        <circle cx="196" cy="112" r="104" stroke="#E2D5F4" strokeWidth=".6" opacity=".6" strokeDasharray="1.5 5" />
        <g className="dn-ritual-orbit">
          <circle
            cx="196"
            cy="112"
            r="92"
            stroke="#C45BE8"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="46 532"
            opacity=".55"
          />
          <circle cx="276.5" cy="156.6" r="2.6" fill="#D24BE0" />
          <circle cx="276.5" cy="156.6" r="6" fill="#D24BE0" opacity=".18" />
        </g>

        {/* plinth */}
        <ellipse cx="160" cy="212" rx="136" ry="9" fill="#8D6BCB" opacity=".12" filter={`url(#${u("blur6")})`} />
        <ellipse cx="160" cy="205" rx="138" ry="11" fill={ref("plinth")} />
        <ellipse cx="160" cy="205" rx="138" ry="11" stroke="#FFFFFF" strokeWidth="1" />
        <ellipse cx="160" cy="205" rx="112" ry="8" stroke="#E4D7F6" strokeWidth=".7" />
        <path d="M40 202.6 Q160 195 280 202.6" stroke={ref("plinthEdge")} strokeWidth="1.2" strokeLinecap="round" />

        {/* contact shadows */}
        <ellipse cx="196" cy="203" rx="40" ry="4.5" fill="#6E4FB5" opacity=".2" filter={`url(#${u("soft")})`} />
        <ellipse cx="70" cy="203" rx="25" ry="3.6" fill="#6E4FB5" opacity=".26" filter={`url(#${u("soft")})`} />

        {/* ===== Face ===== */}
        <g transform={FACE_T}>
          <use
            href={`#${u("face")}`}
            fill={ref("skin")}
            stroke={ref("rim")}
            strokeWidth="1"
            strokeLinejoin="round"
          />

          <g clipPath={`url(#${u("faceLocal")})`}>
            <use href={`#${u("face")}`} fill={ref("shade")} />
            <use href={`#${u("face")}`} fill={ref("jaw")} />
            <ellipse cx="156" cy="46" rx="22" ry="13" fill={ref("sheen")} />

            <g filter={`url(#${u("soft")})`}>
              <path d="M139 94 Q144 110 158 120" stroke="#B99BD6" strokeWidth="6" strokeLinecap="round" opacity=".2" />
              <path d="M201 94 Q196 110 182 120" stroke="#9E7CC6" strokeWidth="6" strokeLinecap="round" opacity=".32" />
              <ellipse cx="137" cy="60" rx="5" ry="12" fill="#B99BD6" opacity=".2" />
              <ellipse cx="203" cy="60" rx="5" ry="12" fill="#9E7CC6" opacity=".3" />
              <ellipse cx="170" cy="104" rx="7" ry="2" fill="#B99BD6" opacity=".28" />
              <ellipse cx="170" cy="125" rx="8" ry="2.2" fill="#B99BD6" opacity=".28" />
              <ellipse cx="169" cy="87" rx="1.8" ry="9" fill="#FFFFFF" opacity=".65" />
              <ellipse cx="169" cy="98" rx="3" ry="1.8" fill="#FFFFFF" opacity=".55" />
              <ellipse cx="148" cy="90" rx="6" ry="3" fill="#FFFFFF" opacity=".5" transform="rotate(-25 148 90)" />
              <ellipse cx="190" cy="90" rx="5" ry="2.6" fill="#FFFFFF" opacity=".25" transform="rotate(25 190 90)" />
              <ellipse cx="168" cy="128" rx="6" ry="2.6" fill="#FFFFFF" opacity=".45" />
            </g>

            {/* ceramic specular */}
            <path d="M148 46 Q158 36 176 34" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity=".75" />
          </g>

          {/* quiet, tone-on-tone features */}
          <path d="M149 67 Q157 63.5 165 65.5" stroke="#BBA3CB" strokeWidth="1.2" strokeLinecap="round" opacity=".55" />
          <path d="M175 65.5 Q183 63.5 191 67" stroke="#A58DB8" strokeWidth="1.2" strokeLinecap="round" opacity=".5" />
          <path d="M150 76 Q157 79.2 164 76" stroke="#A58DB8" strokeWidth="1.15" strokeLinecap="round" />
          <path d="M176 76 Q183 79.2 190 76" stroke="#9479AC" strokeWidth="1.15" strokeLinecap="round" />
          <path d="M166.5 70 Q165 84 164.5 96" stroke="#D5BCDB" strokeWidth=".9" strokeLinecap="round" opacity=".5" />
          <path d="M173.5 70 Q175 84 175.5 96" stroke="#B79CCB" strokeWidth=".9" strokeLinecap="round" opacity=".5" />
          <path d="M164 98 C164.5 101.5 167 102.5 170 102.5 C173 102.5 175.5 101.5 176 98" stroke="#BF9FC7" strokeWidth=".95" strokeLinecap="round" />
          <path d="M166 100.4 Q167 101.4 168.6 100.9 M174 100.4 Q173 101.4 171.4 100.9" stroke="#A98DBA" strokeWidth=".85" strokeLinecap="round" />
          <path d="M160 114 C164 112.2 167 111.4 170 112.2 C173 111.4 176 112.2 180 114 C176 115.6 173 116 170 116 C167 116 164 115.6 160 114 Z" fill="#D8C4E5" opacity=".75" />
          <path d="M160.5 114.6 C164 116 167 116.3 170 116.3 C173 116.3 176 116 179.5 114.6 C177 119.6 173.5 120.6 170 120.6 C166.5 120.6 163 119.6 160.5 114.6 Z" fill="#E3D3EE" opacity=".8" />
          <path d="M160 114.2 C164 115.6 167 116 170 116 C173 116 176 115.6 180 114.2" stroke="#B9A0CB" strokeWidth=".85" strokeLinecap="round" />
        </g>

        {/* ===== Skin response (scene space, clipped to the face) ===== */}
        <g clipPath={`url(#${u("faceClip")})`}>
          <rect className="dn-ritual-flush" x="140" y="40" width="120" height="140" fill="#F7DDF8" />
          <circle className="dn-ritual-bloom" cx="168" cy="138" r="40" fill={ref("bloom")} />
          <g transform="rotate(-20 168 138)">
            <ellipse className="dn-ritual-ripple" cx="168" cy="138" rx="7" ry="4" stroke="#BFA0E6" strokeWidth=".9" />
            <ellipse
              className="dn-ritual-ripple"
              cx="168"
              cy="138"
              rx="7"
              ry="4"
              stroke="#D2B8EF"
              strokeWidth=".7"
              style={{ animationDelay: "0.2s" }}
            />
          </g>
          <g transform="skewX(-18)">
            <rect className="dn-ritual-sweep" x="-24" y="30" width="48" height="160" fill={ref("sweep")} />
          </g>
        </g>

        {/* ===== Bottle — back (glass, liquid) ===== */}
        <g>
          <path
            d="M52 162 C52 154 56 151 62 150 V142 H78 V150 C84 151 88 154 88 162 V190 Q88 200 78 200 H62 Q52 200 52 190 Z"
            fill={ref("glass")}
            stroke="#CDB9EA"
            strokeWidth=".9"
            strokeLinejoin="round"
          />
          <path
            d="M55.5 170 Q70 166.5 84.5 170 V191 Q84.5 196.5 78 196.5 H62 Q55.5 196.5 55.5 191 Z"
            fill={ref("liquid")}
            opacity=".95"
          />
          <ellipse cx="70" cy="168.4" rx="14.5" ry="2" fill="#F8F0FE" opacity=".85" />
          <path d="M62 144.5 H78 M62 147.5 H78" stroke="#C9B5E8" strokeWidth=".5" opacity=".8" />
        </g>

        {/* ===== Dropper — local origin is the tip ===== */}
        <g className="dn-ritual-pipette">
          <g transform="translate(70 186)">
            <path
              d="M-2.6 -44 H2.6 V-6 Q2.6 -2 0 0 Q-2.6 -2 -2.6 -6 Z"
              fill={ref("tube")}
              stroke="#C7B1E4"
              strokeWidth=".5"
            />
            <path
              className="dn-ritual-fill"
              d="M-1.6 -32 H1.6 V-6 Q1.6 -3 0 -1.2 Q-1.6 -3 -1.6 -6 Z"
              fill={ref("liquid")}
            />
            <path d="M-1 -41 V-12" stroke="#FFFFFF" strokeWidth=".9" strokeLinecap="round" opacity=".9" />

            <g className="dn-ritual-bulb">
              <path
                d="M-7.5 -57 C-8.6 -68 -5 -80 0 -80 C5 -80 8.6 -68 7.5 -57 Z"
                fill={ref("bulb")}
              />
              <path d="M-4.2 -62 Q-4.8 -72 -1.8 -76" stroke="#FFFFFF" strokeWidth="1.1" strokeLinecap="round" opacity=".75" />
            </g>

            {/* champagne collar */}
            <rect x="-9.5" y="-58" width="19" height="14" rx="2.4" fill={ref("metal")} stroke="#C99884" strokeWidth=".4" />
            <path d="M-9.5 -54.5 H9.5 M-9.5 -51 H9.5 M-9.5 -47.5 H9.5" stroke="#B98672" strokeWidth=".35" opacity=".55" />
            <rect x="-10.5" y="-59.2" width="21" height="3" rx="1.5" fill={ref("metal")} stroke="#C99884" strokeWidth=".4" />
          </g>
        </g>

        {/* ===== Bottle — front (label, glass highlights) ===== */}
        <g>
          <path d="M57 162 V191" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity=".9" />
          <path d="M83.5 164 V189" stroke="#A98AD6" strokeWidth=".8" strokeLinecap="round" opacity=".6" />
          <path d="M58 157 Q60 152.5 64.5 151.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity=".8" />
          <rect x="62" y="174" width="16" height="13" rx="1.8" fill="#FFFFFF" opacity=".62" />
          <rect x="62" y="174" width="16" height="13" rx="1.8" stroke="#E0B9A7" strokeWidth=".4" />
          
          <path d="M65.5 184.6 H74.5" stroke="#D9AE9A" strokeWidth=".4" />
        </g>

        {/* ===== Serum drop ===== */}
        <g transform="translate(168 119)">
          <g className="dn-ritual-drop">
            <path
              d="M0 0 C-2 3 -5 7 -5 10 A5 5 0 0 0 5 10 C5 7 2 3 0 0 Z"
              fill={ref("liquid")}
              stroke="#BFA0E6"
              strokeWidth=".5"
            />
            <path d="M-2 8 Q-3 10 -1 11" stroke="#FFFFFF" strokeWidth=".8" strokeLinecap="round" />
          </g>
        </g>

        {/* ===== Sparkles ===== */}
        {[
          { x: 175, y: 128, s: 5.5, d: "0s" },
          { x: 212, y: 96, s: 4, d: "0.14s" },
          { x: 190, y: 160, s: 3.4, d: "0.28s" },
        ].map((sp) => (
          <g key={`${sp.x}-${sp.y}`} transform={`translate(${sp.x} ${sp.y}) scale(${sp.s})`}>
            <path
              className="dn-ritual-sparkle"
              style={{ animationDelay: sp.d }}
              d="M0 -1 C.08 -.3 .3 -.08 1 0 C.3 .08 .08 .3 0 1 C-.08 .3 -.3 .08 -1 0 C-.3 -.08 -.08 -.3 0 -1Z"
              fill="#FFFFFF"
              stroke="#B392E3"
              strokeWidth=".14"
            />
          </g>
        ))}
      </svg>

      {showCaption && count > 0 && (
        <div className="dn-ritual-caption" aria-hidden="true">
          <div className="dn-ritual-lines">
            {messages.map((m, i) => (
              <p
                key={m}
                className="dn-ritual-line"
                data-state={i === index ? "active" : i < index ? "before" : "after"}
              >
                {m}
              </p>
            ))}
          </div>

          <div className="dn-ritual-steps">
            {messages.map((m, i) => (
              <span
                key={m}
                className="dn-ritual-step"
                data-state={i < index ? "done" : i === index ? "active" : "todo"}
              >
                <i />
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
