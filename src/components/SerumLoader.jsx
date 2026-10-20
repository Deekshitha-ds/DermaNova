import { useEffect, useId, useState } from "react";
import "./SerumLoader.css";

const DEFAULT_MESSAGES = [
  "Reading your skin profile",
  "Matching active ingredients",
  "Building your routine",
];

/**
 * Props
 * - messages: status lines shown under the illustration
 * - duration: length of one full ritual loop in ms (animation + text stay in sync)
 * - label: accessible announcement for screen readers
 */
export default function SerumLoader({
  messages = DEFAULT_MESSAGES,
  duration = 6000,
  label = "Preparing your personalized skincare recommendations",
  className = "",
}) {
  // useId returns ":r1:" — strip colons so it's safe inside url(#...)
  const uid = "dn" + useId().replace(/:/g, "");
  const u = (name) => `${uid}-${name}`;
  const ref = (name) => `url(#${u(name)})`;

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length < 2) return undefined;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % messages.length),
      duration / messages.length
    );
    return () => clearInterval(timer);
  }, [messages.length, duration]);

  return (
    <div
      className={`dn-ritual-loader ${className}`.trim()}
      role="status"
      style={{ "--dn-cycle": `${duration}ms` }}
    >
      <span className="dn-ritual-sr">{label}</span>

      <svg
        className="dn-ritual-art"
        viewBox="0 0 260 205"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={u("skin")} x1="130" y1="30" x2="210" y2="170" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FBEFF3" />
            <stop offset="1" stopColor="#E6D3F0" />
          </linearGradient>

          <linearGradient id={u("shade")} x1="134" y1="0" x2="206" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#CDB3DC" stopOpacity=".4" />
            <stop offset=".22" stopColor="#CDB3DC" stopOpacity="0" />
            <stop offset=".78" stopColor="#CDB3DC" stopOpacity="0" />
            <stop offset="1" stopColor="#CDB3DC" stopOpacity=".4" />
          </linearGradient>

          <radialGradient id={u("sheen")} cx=".5" cy=".5" r=".5">
            <stop stopColor="#FFFFFF" stopOpacity=".85" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>

          <linearGradient id={u("glass")} x1="34" y1="130" x2="67" y2="170" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" stopOpacity=".95" />
            <stop offset=".45" stopColor="#DCCDF2" stopOpacity=".82" />
            <stop offset="1" stopColor="#BFA8DF" stopOpacity=".92" />
          </linearGradient>

          <linearGradient id={u("tube")} x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#BBA5D8" stopOpacity=".9" />
            <stop offset=".4" stopColor="#FFFFFF" stopOpacity=".95" />
            <stop offset="1" stopColor="#C8B3E4" stopOpacity=".9" />
          </linearGradient>

          <linearGradient id={u("liquid")} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#EBDDF9" />
            <stop offset="1" stopColor="#B898E0" />
          </linearGradient>

          <radialGradient id={u("bulb")} cx=".35" cy=".3" r=".9">
            <stop stopColor="#E4D4F5" />
            <stop offset="1" stopColor="#A98ECB" />
          </radialGradient>

          <radialGradient id={u("bloom")} cx=".5" cy=".5" r=".5">
            <stop stopColor="#FFFFFF" stopOpacity=".95" />
            <stop offset=".4" stopColor="#EEE0FA" stopOpacity=".7" />
            <stop offset="1" stopColor="#DCC8F2" stopOpacity="0" />
          </radialGradient>

          <radialGradient id={u("halo")} cx=".5" cy=".5" r=".5">
            <stop stopColor="#E9D9F7" stopOpacity=".55" />
            <stop offset="1" stopColor="#E9D9F7" stopOpacity="0" />
          </radialGradient>

          <linearGradient id={u("jaw")} x1="0" y1="112" x2="0" y2="135" gradientUnits="userSpaceOnUse">
            <stop stopColor="#CDB3DC" stopOpacity="0" />
            <stop offset="1" stopColor="#CDB3DC" stopOpacity=".32" />
          </linearGradient>

          <filter id={u("soft")} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" />
          </filter>

          <path
            id={u("face")}
            d="M170 28 C193 28 207 46 207 72 C207 90 204 102 199 112 C194 122 187 130 178 133.5 C175 134.6 172.5 135 170 135 C167.5 135 165 134.6 162 133.5 C153 130 146 122 141 112 C136 102 133 90 133 72 C133 46 147 28 170 28 Z"
          />

          <clipPath id={u("clip")}>
            <use href={`#${u("face")}`} />
          </clipPath>
        </defs>

        {/* Ambient halo — breathes once per loop */}
        <ellipse
          className="dn-ritual-halo"
          cx="170"
          cy="90"
          rx="92"
          ry="92"
          fill={ref("halo")}
        />

        {/* Ground shadows */}
        <ellipse cx="170" cy="154" rx="38" ry="5" fill="#B8A1D2" opacity=".12" />
        <ellipse cx="51" cy="171" rx="21" ry="3" fill="#8F78B4" opacity=".14" />

        {/* Face */}
        <use
          href={`#${u("face")}`}
          fill={ref("skin")}
          stroke="#DCC9E8"
          strokeWidth=".9"
          strokeLinejoin="round"
        />

        {/* Sculpting — all clipped to the face, soft-focus like airbrushed light */}
        <g clipPath={`url(#${u("clip")})`}>
          <use href={`#${u("face")}`} fill={ref("shade")} />
          <use href={`#${u("face")}`} fill={ref("jaw")} />
          <ellipse cx="158" cy="46" rx="22" ry="12" fill={ref("sheen")} />

          <g filter={`url(#${u("soft")})`}>
            {/* contour */}
            <path d="M139 94 Q144 110 158 120" stroke="#C9AEDA" strokeWidth="6" strokeLinecap="round" opacity=".22" />
            <path d="M201 94 Q196 110 182 120" stroke="#C9AEDA" strokeWidth="6" strokeLinecap="round" opacity=".22" />
            <ellipse cx="137" cy="60" rx="5" ry="12" fill="#CDB3DC" opacity=".25" />
            <ellipse cx="203" cy="60" rx="5" ry="12" fill="#CDB3DC" opacity=".25" />
            <ellipse cx="170" cy="104" rx="7" ry="2" fill="#CDB3DC" opacity=".3" />
            <ellipse cx="170" cy="125" rx="8" ry="2.2" fill="#CDB3DC" opacity=".3" />
            {/* highlights */}
            <ellipse cx="170" cy="87" rx="1.8" ry="9" fill="#FFFFFF" opacity=".55" />
            <ellipse cx="170" cy="98" rx="3" ry="1.8" fill="#FFFFFF" opacity=".5" />
            <ellipse cx="148" cy="90" rx="6" ry="3" fill="#FFFFFF" opacity=".35" transform="rotate(-25 148 90)" />
            <ellipse cx="192" cy="90" rx="6" ry="3" fill="#FFFFFF" opacity=".35" transform="rotate(25 192 90)" />
            <ellipse cx="170" cy="128" rx="6" ry="2.6" fill="#FFFFFF" opacity=".45" />
          </g>
        </g>

        {/* Skin response — clipped to the face */}
        <g clipPath={`url(#${u("clip")})`}>
          <circle
            className="dn-ritual-bloom"
            cx="148"
            cy="104"
            r="40"
            fill={ref("bloom")}
          />
          <ellipse
            className="dn-ritual-dew"
            cx="151"
            cy="95"
            rx="6.5"
            ry="2.6"
            fill="#FFFFFF"
            transform="rotate(-25 151 95)"
            filter={`url(#${u("soft")})`}
          />
        </g>

        {/* Brows + closed eyes — quiet, tone-on-tone */}
        <path d="M149 67 Q157 63.5 165 65.5" stroke="#BBA3CB" strokeWidth="1.3" strokeLinecap="round" opacity=".6" />
        <path d="M175 65.5 Q183 63.5 191 67" stroke="#BBA3CB" strokeWidth="1.3" strokeLinecap="round" opacity=".6" />
        <path d="M150 76 Q157 79.2 164 76" stroke="#A58DB8" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M176 76 Q183 79.2 190 76" stroke="#A58DB8" strokeWidth="1.2" strokeLinecap="round" />

        {/* Nose */}
        <path d="M166.5 70 Q165 84 164.5 96" stroke="#D5BCDB" strokeWidth=".9" strokeLinecap="round" opacity=".55" />
        <path d="M173.5 70 Q175 84 175.5 96" stroke="#D5BCDB" strokeWidth=".9" strokeLinecap="round" opacity=".55" />
        <path d="M164 98 C164.5 101.5 167 102.5 170 102.5 C173 102.5 175.5 101.5 176 98" stroke="#BF9FC7" strokeWidth="1" strokeLinecap="round" />
        <path d="M166 100.4 Q167 101.4 168.6 100.9 M174 100.4 Q173 101.4 171.4 100.9" stroke="#A98DBA" strokeWidth=".9" strokeLinecap="round" />

        {/* Mouth — same skin family, no colour */}
        <path
          d="M160 114 C164 112.2 167 111.4 170 112.2 C173 111.4 176 112.2 180 114 C176 115.6 173 116 170 116 C167 116 164 115.6 160 114 Z"
          fill="#D8C4E5"
          opacity=".75"
        />
        <path
          d="M160.5 114.6 C164 116 167 116.3 170 116.3 C173 116.3 176 116 179.5 114.6 C177 119.6 173.5 120.6 170 120.6 C166.5 120.6 163 119.6 160.5 114.6 Z"
          fill="#E3D3EE"
          opacity=".8"
        />
        <path d="M160 114.2 C164 115.6 167 116 170 116 C173 116 176 115.6 180 114.2" stroke="#B9A0CB" strokeWidth=".9" strokeLinecap="round" />

        {/* Bottle — back layer (body, liquid, open neck) */}
        <g>
          <rect x="37" y="129" width="28" height="40" rx="7" fill={ref("glass")} stroke="#C9B4E1" strokeWidth=".9" />
          <path
            d="M40 148 Q51 145 62 148 V162 Q62 166 57 166 H45 Q40 166 40 162 Z"
            fill={ref("liquid")}
            opacity=".9"
          />
          <rect x="44" y="121" width="14" height="10" rx="2" fill="#D8C7EA" stroke="#C1AAD9" strokeWidth=".6" />
          <rect x="42" y="118.5" width="18" height="4" rx="2" fill="#C7B1E0" />
        </g>

        {/* Pipette — local origin is the tip */}
        <g className="dn-ritual-pipette">
          <g transform="translate(51 152)">
            <g className="dn-ritual-bulb">
              <path
                d="M-7.5 -45 C-8 -55 -4.5 -62 0 -62 C4.5 -62 8 -55 7.5 -45 L7.5 -40 L-7.5 -40 Z"
                fill={ref("bulb")}
              />
              <path d="M-4 -50 Q-4.6 -56 -1.6 -58.5" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity=".7" />
            </g>

            <rect x="-6.5" y="-42" width="13" height="6" rx="2.2" fill="#CBB6E3" stroke="#B9A1D6" strokeWidth=".5" />

            <path
              d="M-3 -37 H3 V-8 Q3 -3.5 0 0 Q-3 -3.5 -3 -8 Z"
              fill={ref("tube")}
              stroke="#C7B1E0"
              strokeWidth=".6"
            />
            <path
              className="dn-ritual-fill"
              d="M-1.9 -24 H1.9 V-8 Q1.9 -4.5 0 -1.8 Q-1.9 -4.5 -1.9 -8 Z"
              fill={ref("liquid")}
            />
            <path d="M-1.3 -33 V-12" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity=".9" />
          </g>
        </g>

        {/* Bottle — front layer (submerged tint, sheen, label) */}
        <g>
          <path
            d="M40 148 Q51 145 62 148 V162 Q62 166 57 166 H45 Q40 166 40 162 Z"
            fill={ref("liquid")}
            opacity=".4"
          />
          <path d="M41 138 V160" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity=".9" />
          <path d="M60 139 V159" stroke="#B9A1D6" strokeWidth=".8" strokeLinecap="round" />
          <text
            x="51"
            y="161"
            fontFamily="Georgia, serif"
            fontSize="6"
            textAnchor="middle"
            fill="#826B9C"
          >
            DN
          </text>
        </g>

        {/* Landing point + ripples (left cheek) */}
        <circle className="dn-ritual-point" cx="148" cy="104" r="3" fill="#D7B8E8" />
        <circle className="dn-ritual-ripple" cx="148" cy="104" r="6" stroke="#CDB0E6" strokeWidth=".9" />
        <circle
          className="dn-ritual-ripple"
          cx="148"
          cy="104"
          r="6"
          stroke="#D9C0EE"
          strokeWidth=".7"
          style={{ animationDelay: "0.22s" }}
        />

        {/* Serum drop — forms on the tip, falls onto the cheek */}
        <g transform="translate(148 74)">
          <g className="dn-ritual-drop">
            <path
              d="M0 0 C-2 3 -5 7 -5 10 A5 5 0 0 0 5 10 C5 7 2 3 0 0 Z"
              fill={ref("liquid")}
              stroke="#C6AFE3"
              strokeWidth=".6"
            />
            <path d="M-2 8 Q-3 10 -1 11" stroke="#FFFFFF" strokeWidth=".8" strokeLinecap="round" />
          </g>
        </g>

        {/* Sparkles after absorption */}
        {[
          { x: 145, y: 88, s: 6, d: "0s" },
          { x: 160, y: 108, s: 4, d: "0.2s" },
          { x: 194, y: 94, s: 4, d: "0.38s" },
        ].map((sp) => (
          <g key={`${sp.x}-${sp.y}`} transform={`translate(${sp.x} ${sp.y}) scale(${sp.s})`}>
            <path
              className="dn-ritual-sparkle"
              style={{ animationDelay: sp.d }}
              d="M0 -1 C.08 -.3 .3 -.08 1 0 C.3 .08 .08 .3 0 1 C-.08 .3 -.3 .08 -1 0 C-.3 -.08 -.08 -.3 0 -1Z"
              fill="#FFFFFF"
              stroke="#B99AD9"
              strokeWidth=".16"
            />
          </g>
        ))}
      </svg>

      <p key={index} className="dn-ritual-line" aria-hidden="true">
        {messages[index]}
      </p>
    </div>
  );
}
