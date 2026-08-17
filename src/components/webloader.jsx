import { useEffect, useState } from "react";

export default function WebLoader({ exiting }) {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    if (!exiting) return;

    const navbarLogo = document.getElementById("navbar-logo");

    if (!navbarLogo) return;

    const rect = navbarLogo.getBoundingClientRect();

    setTarget({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
    });
  }, [exiting]);

  return (
    <div className={`web-loader ${exiting ? "web-loader-exit" : ""}`}>

      <div className="web-loader-bg-glow" />

      <div
        className="web-loader-orb"
        style={
          target
            ? {
                "--target-x": `${target.x}px`,
                "--target-y": `${target.y}px`,
                "--target-width": `${target.width}px`,
                "--target-height": `${target.height}px`,
              }
            : {}
        }
      >

        <div className="web-loader-ring ring-one" />
        <div className="web-loader-ring ring-two" />

        <div className="web-loader-logo-wrap">
          <img
            src="/logo3.png"
            alt="DermaNova"
            className="web-loader-logo"
          />
        </div>

        <span className="loader-particle particle-one" />
        <span className="loader-particle particle-two" />
        <span className="loader-particle particle-three" />
        <span className="loader-particle particle-four" />

      </div>

      <div className="web-loader-content">

        <h1>DERMANOVA</h1>

        <p>AI SKIN INTELLIGENCE</p>

        <div className="web-loader-track">
          <div className="web-loader-bar" />
        </div>

      </div>

    </div>
  );
}