import { useState } from "react";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import GlassCard from "../components/GlassCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirm_password: "",
};

/* Same petals used on Home page */
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
      className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden"
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

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    // General email format validation
    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email) || email.includes("..")) {
      setError(
        "Invalid email format. Please enter a valid email address."
      );
      return;
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordRegex.test(form.password)) {
      setError(
        "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character."
      );
      return;
    }

    // Confirm password validation
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name,
        email,
        password: form.password,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          "Could not create account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-10">

      {/* SAME BACKGROUND AS HOME */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-violet-50 via-fuchsia-50/60 to-purple-100/70">

        {/* Left violet atmosphere */}
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

        {/* Right pink atmosphere */}
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

        {/* Bottom purple atmosphere */}
        <div className="absolute bottom-[-8rem] left-1/3 w-[26rem] h-[26rem] rounded-full bg-purple-300/40 blur-[110px]" />
      </div>

      {/* SAME FALLING PETALS AS HOME */}
      {!reduce && <Petals />}

      {/* REGISTER CARD */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <GlassCard className="w-full">

          <p className="eyebrow mb-2">
            Start your journey
          </p>

          <h1 className="text-3xl font-semibold mb-6">
            Create your account
          </h1>

          {error && (
            <div className="mb-4 rounded-xl bg-coral-500/10 border border-coral-500/30 text-coral-500 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1.5"
              >
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                className="glass-input"
                placeholder="Type your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1.5"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="text"
                required
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="glass-input"
                placeholder="you@gmail.com"
              />
            </div>

            {/* Password + Confirm Password */}
            <div className="grid grid-cols-2 gap-3">

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1.5"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    className="glass-input pr-10"
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <HiOutlineEyeOff size={20} />
                    ) : (
                      <HiOutlineEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirm_password"
                  className="block text-sm font-medium mb-1.5"
                >
                  Confirm
                </label>

                <div className="relative">
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    required
                    autoComplete="new-password"
                    value={form.confirm_password}
                    onChange={handleChange}
                    className="glass-input pr-10"
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <HiOutlineEyeOff size={20} />
                    ) : (
                      <HiOutlineEye size={20} />
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full mt-2"
            >
              {isSubmitting
                ? "Creating account…"
                : "Create account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-sm text-center text-ink/60 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-lavender-700 hover:underline"
            >
              Log in
            </Link>
          </p>

        </GlassCard>
      </motion.div>
    </div>
  );
}