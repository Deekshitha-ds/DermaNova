import { NavLink } from "react-router-dom";
import {
  HiOutlineSparkles,
  HiOutlineMail,
  HiOutlineHeart
} from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="mt-20 px-4 md:px-8 pb-6">
      <div className="footer-glass">

        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 p-8 md:p-10">

          {/* Brand */}
          <div className="md:col-span-2">

            <NavLink
              to="/"
              className="flex items-center gap-3 mb-5"
            >
              <div className="footer-logo">
                <img
                  src="/logo3.png"
                  alt="DermaNova AI"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  <span className="text-[#4b3288]">
                    DermaNova
                  </span>{" "}
                  <span className="text-[#a68be8]">
                    AI
                  </span>
                </h2>

                <p className="text-xs text-ink/50">
                  Intelligent Skin Analysis
                </p>
              </div>
            </NavLink>

            <p className="text-sm text-ink/60 leading-6 max-w-md">
              AI-powered facial skin analysis designed to
              help you understand your skin, discover
              potential concerns, and build a smarter
              skincare routine.
            </p>

            <div className="flex items-center gap-2 mt-5 text-sm text-ink/50">
              <HiOutlineSparkles className="text-lavender-500" />
              Smart Skin · Better You
            </div>

          </div>


          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-ink mb-4">
              Explore
            </h3>

            <div className="flex flex-col gap-3 text-sm">

              <NavLink
                to="/dashboard"
                className="footer-link"
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/scan/skin"
                className="footer-link"
              >
                Skin Scan
              </NavLink>

              <NavLink
                to="/recommendations"
                className="footer-link"
              >
                Products
              </NavLink>

              <NavLink
                to="/progress"
                className="footer-link"
              >
                Progress
              </NavLink>

              <NavLink
                to="/assistant"
                className="footer-link"
              >
                AI Assistant
              </NavLink>

            </div>
          </div>


          {/* Features */}
          <div>
            <h3 className="font-semibold text-ink mb-4">
              Features
            </h3>

            <div className="flex flex-col gap-3 text-sm text-ink/60">

              <span>AI Skin Analysis</span>

              <span>Skin Concern Detection</span>

              <span>Personalized Recommendations</span>

              <span>Progress Tracking</span>

              <span>AI Skincare Assistant</span>

            </div>
          </div>

        </div>


        {/* Divider */}
        <div className="mx-8 border-t border-white/60" />


        {/* Bottom */}
        <div className="px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">

          <p className="text-xs text-ink/50 text-center md:text-left">
            © {new Date().getFullYear()} DermaNova AI. All rights reserved.
          </p>

          <div className="flex items-center gap-1 text-xs text-ink/50">
            Made with
            <HiOutlineHeart className="text-pink-400 mx-1" />
            for smarter skincare
          </div>

        </div>

      </div>
    </footer>
  );
}