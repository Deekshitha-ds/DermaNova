import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { HiOutlineSparkles, HiOutlineLogout } from "react-icons/hi";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/scan/skin", label: "Skin Scan" },
  { to: "/recommendations", label: "Products" },
  { to: "/progress", label: "Progress" },
  { to: "/assistant", label: "Assistant" }
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-4 z-40 mx-4 md:mx-8">
      <nav className="glass-panel !rounded-full flex items-center justify-between px-5 py-3">
       
  <NavLink
  to="/"
  className="flex items-center gap-3 group"
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
    <span className="text-[#4b3288]">DermaNova</span>{" "}
    <span className="text-[#a68be8]">AI</span>
  </span>
</NavLink>
         

        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition ${
                    isActive ? "bg-lavender-500 text-white" : "text-ink/70 hover:bg-white/60"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:block text-sm font-medium text-ink/70">
                Hello ,{user?.name?.split(" ")[0]}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="btn-ghost !px-4 !py-2 text-sm"
                aria-label="Log out"
              >
                <HiOutlineLogout /> Log out
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn-primary !px-5 !py-2 text-sm">
              Log in
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
