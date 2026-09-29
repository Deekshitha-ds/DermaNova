import { useState } from "react";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import GlassCard from "../components/GlassCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

/* ---------- Falling petals ---------- */

const PETALS = [
  { left: "8%", size: 26, delay: 0, dur: 16 },
  { left: "24%", size: 18, delay: 4, dur: 19 },
  { left: "52%", size: 22, delay: 2, dur: 17 },
  { left: "70%", size: 30, delay: 6, dur: 21 },
  { left: "86%", size: 20, delay: 1, dur: 18 },
  { left: "40%", size: 16, delay: 9, dur: 20 },
];

function Petals() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ perspective: 800 }}
      aria-hidden
    >
      {PETALS.map((p, i) => (
        <motion.span
          key={i}
          className="absolute -top-10 block bg-gradient-to-br from-pink-200 to-fuchsia-300/80 shadow-[0_6px_14px_-4px_rgba(217,70,239,0.35)]"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 1.4,
            borderRadius: "80% 0 80% 0",
            transformStyle: "preserve-3d",
          }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, 40, -30, 20],
            rotateX: [0, 360],
            rotateY: [0, 300],
            rotateZ: [0, 180],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const reduce = useReducedMotion();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo =
    location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) =>
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(form.email, form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4">

      {/* ================= ATMOSPHERE ================= */}

      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-violet-50 via-fuchsia-50/60 to-purple-100/70">

        {/* Violet blob */}
        <motion.div
          className="absolute -top-40 -left-32 w-[34rem] h-[34rem] rounded-full bg-violet-300/40 blur-[110px]"
          {...(!reduce && {
            animate: {
              x: [0, 40, 0],
              y: [0, 30, 0],
            },
            transition: {
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            },
          })}
        />

        {/* Pink blob */}
        <motion.div
          className="absolute top-20 right-[-8rem] w-[30rem] h-[30rem] rounded-full bg-pink-300/40 blur-[110px]"
          {...(!reduce && {
            animate: {
              x: [0, -35, 0],
              y: [0, 30, 0],
            },
            transition: {
              duration: 26,
              repeat: Infinity,
              ease: "easeInOut",
            },
          })}
        />

        {/* Purple bottom blob */}
        <div className="absolute bottom-[-8rem] left-1/3 w-[26rem] h-[26rem] rounded-full bg-purple-300/40 blur-[110px]" />
      </div>

      {/* Falling petals */}
      {!reduce && <Petals />}

      {/* ================= LOGIN CARD ================= */}

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 w-full max-w-md"
      >
        <GlassCard className="w-full">

          <p className="eyebrow mb-2">
            Welcome back
          </p>

          <h1 className="text-3xl font-semibold mb-6 text-violet-950">
            Log in to DermaNova
          </h1>

          {error && (
            <div className="mb-4 rounded-xl bg-coral-500/10 border border-coral-500/30 text-coral-500 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Email */}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1.5 text-violet-950"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="glass-input"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}

            <div>
              <div className="flex justify-between items-center mb-1.5">

                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-violet-950"
                >
                  Password
                </label>

                <Link
                  to="/reset-password"
                  className="text-xs font-medium text-lavender-700 hover:underline"
                >
                  Forgot password?
                </Link>

              </div>

              <div className="relative w-full">

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  className="glass-input w-full pr-12"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-gray-500 hover:text-violet-600 transition-colors"
                >
                  {showPassword ? (
                    <HiOutlineEyeOff className="w-5 h-5" />
                  ) : (
                    <HiOutlineEye className="w-5 h-5" />
                  )}
                </button>

              </div>
            </div>

            {/* Login button */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full mt-2"
            >
              {isSubmitting
                ? "Logging in…"
                : "Log in"}
            </button>

          </form>

          <p className="text-sm text-center text-ink/60 mt-6">
            New to DermaNova?{" "}
            <Link
              to="/register"
              className="font-semibold text-lavender-700 hover:underline"
            >
              Create an account
            </Link>
          </p>

        </GlassCard>
      </motion.div>

    </div>
  );
}