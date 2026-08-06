import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const initialForm = { full_name: "", email: "", password: "", confirm_password: "" };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        full_name: form.full_name,
        email: form.email,
        password: form.password
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Could not create account. Try a different email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 py-10">
      <GlassCard className="w-full max-w-md">
        <p className="eyebrow mb-2">Start your journey</p>
        <h1 className="text-3xl font-semibold mb-6">Create your account</h1>

        {error && (
          <div className="mb-4 rounded-xl bg-coral-500/10 border border-coral-500/30 text-coral-500 text-sm px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium mb-1.5">Full name</label>
            <input
              id="full_name" name="full_name" required
              value={form.full_name} onChange={handleChange}
              className="glass-input" placeholder="Ananya Rao"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
            <input
              id="email" name="email" type="email" required autoComplete="email"
              value={form.email} onChange={handleChange}
              className="glass-input" placeholder="you@example.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5">Password</label>
              <input
                id="password" name="password" type="password" required autoComplete="new-password"
                value={form.password} onChange={handleChange}
                className="glass-input" placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium mb-1.5">Confirm</label>
              <input
                id="confirm_password" name="confirm_password" type="password" required
                value={form.confirm_password} onChange={handleChange}
                className="glass-input" placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-center text-ink/60 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-lavender-700 hover:underline">
            Log in
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
