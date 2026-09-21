import { useEffect, useState } from "react";
import "./WebLoader.css";

export default function WebLoader({ exiting = false }) {
  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = [
    "INITIALIZING VISION ENGINE",
    "MAPPING FACIAL FEATURES",
    "ANALYZING SKIN SURFACE",
    "CALIBRATING AI MODEL",
    "DERMANOVA READY",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statuses.length);
    }, 750);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`web-loader ${
        exiting ? "web-loader-exit" : ""
      }`}
    >

      {/* =====================================
          BACKGROUND
      ===================================== */}

      <div className="loader-noise" />

      <div className="loader-ambient ambient-one" />
      <div className="loader-ambient ambient-two" />
      <div className="loader-ambient ambient-three" />


      

      {/* =====================================
          MAIN CORE
      ===================================== */}

      <div className="derma-core">

        {/* Outer glow */}

        <div className="core-glow" />


        {/* Orbital rings */}

        <div className="orbit orbit-one">
          <span className="orbit-point" />
        </div>

        <div className="orbit orbit-two">
          <span className="orbit-point" />
        </div>

        <div className="orbit orbit-three">
          <span className="orbit-point" />
        </div>


        {/* Glass sphere */}

        <div className="core-glass">

          {/* Inner glow */}

          <div className="core-inner-glow" />


          {/* Facial scan grid */}

          <div className="face-grid">

            <div className="grid-horizontal grid-h1" />
            <div className="grid-horizontal grid-h2" />
            <div className="grid-horizontal grid-h3" />

            <div className="grid-vertical grid-v1" />
            <div className="grid-vertical grid-v2" />
            <div className="grid-vertical grid-v3" />

          </div>


          {/* Face outline */}

          <div className="face-outline">

            <span className="face-eye eye-left" />
            <span className="face-eye eye-right" />

            <span className="face-point point-nose" />
            <span className="face-point point-mouth" />

          </div>


          {/* Scanning beam */}

          <div className="scan-beam" />


          {/* Logo */}

          <div className="logo-core">

            <div className="logo-halo" />

            <img
              src="/logo3.png"
              alt="DermaNova AI"
            />

          </div>


          {/* Floating data points */}

          <span className="data-point data-one" />
          <span className="data-point data-two" />
          <span className="data-point data-three" />
          <span className="data-point data-four" />

        </div>


        {/* Corner brackets */}

        <div className="core-bracket bracket-tl" />
        <div className="core-bracket bracket-tr" />
        <div className="core-bracket bracket-bl" />
        <div className="core-bracket bracket-br" />

      </div>


      {/* =====================================
          BRANDING
      ===================================== */}

      <div className="loader-brand">

        <h1>
          DermaNova
          <span> AI</span>
        </h1>

        <p>
          AI SKIN INTELLIGENCE
        </p>

      </div>


      {/* =====================================
          STATUS
      ===================================== */}

      <div className="loader-status">

        <div className="status-header">

          <span className="status-pulse" />

          <span>
            {statuses[statusIndex]}
          </span>

        </div>


        <div className="status-track">

          <div className="status-progress" />

        </div>

      </div>


      {/* =====================================
          BOTTOM METADATA
      ===================================== */}

      <div className="loader-meta">

        <span>VISION</span>

        <i />

        <span>ANALYSIS</span>

        <i />

        <span>PERSONALIZATION</span>

      </div>

    </div>
  );
}