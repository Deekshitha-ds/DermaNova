export default function WebLoader({ exiting = false }) {
  return (
    <div className={`web-loader ${exiting ? "web-loader-exit" : ""}`}>

      {/* Background glow */}
      <div className="web-loader-glow" />

      {/* Main loader */}
      <div className="web-loader-orb">

        {/* Orbital rings */}
        <div className="loader-ring loader-ring-one" />
        <div className="loader-ring loader-ring-two" />

        {/* Logo */}
        <div className="loader-logo">

          <img
            src="/logo3.png"
            alt="DermaNova AI"
          />

        </div>

        {/* Small particles */}
        <span className="loader-dot dot-one" />
        <span className="loader-dot dot-two" />
        <span className="loader-dot dot-three" />
        <span className="loader-dot dot-four" />

      </div>


      {/* Branding */}
      <div className="loader-content">

        <h1>
          DermaNova
          <span> AI</span>
        </h1>

        <p>
          AI SKIN INTELLIGENCE
        </p>


        {/* Loading bar */}
        <div className="loader-track">
          <div className="loader-progress" />
        </div>

      </div>

    </div>
  );
}