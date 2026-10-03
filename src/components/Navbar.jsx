import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { HiOutlineLogout } from "react-icons/hi";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/scan/skin", label: "Skin Scan" },
  { to: "/saved-scans", label: "Saved Scans" },
  { to: "/recommendations", label: "Products" },
  { to: "/progress", label: "Progress" },
  { to: "/assistant", label: "Assistant" },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-4 z-40 mx-4 md:mx-8">
      <nav
        className="
          glass-panel
          !rounded-full
          flex
          items-center
          justify-between
          px-5
          py-3
          border border-white/70
          shadow-[0_10px_35px_rgba(94,69,140,0.10)]
          backdrop-blur-xl
        "
      >

        {/* LOGO */}
        <NavLink
          to="/"
          className="flex items-center gap-3 group shrink-0"
        >
          <div className="premium-logo">
            <div className="premium-logo-orb">
              <img
                src="/logo3.png"
                alt="DermaNova AI"
                className="premium-logo-image"
              />

              <span className="logo-reflection"></span>
            </div>

            <span className="logo-star">✦</span>
          </div>

          <span className="font-display text-xl font-semibold tracking-tight">
            <span className="text-[#4b3288]">
              DermaNova
            </span>{" "}
            <span className="text-[#a68be8]">
              AI
            </span>
          </span>
        </NavLink>

        {/* DESKTOP NAVIGATION */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1 ml-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-medium
                    transition-all
                    duration-300
                    ${
                      isActive
                        ? "bg-lavender-500 text-white shadow-[0_5px_18px_rgba(149,113,223,0.22)]"
                        : "text-ink/70 hover:bg-white/60 hover:text-[#4b3288]"
                    }
                  `
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 ml-auto">

          {isAuthenticated ? (
            <>
              {/* USER NAME */}
              <span className="hidden lg:block text-sm font-medium text-ink/70">
                Hello, {user?.name?.split(" ")[0]}
              </span>

              {/* LOGOUT */}
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="
                  btn-ghost
                  !px-4
                  !py-2
                  text-sm
                  inline-flex
                  items-center
                  gap-2
                  transition-all
                  duration-300
                  hover:bg-white/70
                "
                aria-label="Log out"
              >
                <HiOutlineLogout size={18} />
                <span>Log out</span>
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="
                btn-primary
                !px-5
                !py-2
                text-sm
                transition-all
                duration-300
              "
            >
              Log in
            </NavLink>
          )}

        </div>
      </nav>
    </header>
  );
}