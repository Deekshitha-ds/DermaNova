import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard.jsx";
import { HiOutlineSparkles } from "react-icons/hi";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="eyebrow mb-4"
      >
        AI Skin & Hair Intelligence
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-6xl font-semibold leading-tight mb-6"
      >
        Your skin, <span className="text-petal-500">understood</span>.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-ink/60 max-w-xl mx-auto mb-10"
      >
        Scan your skin and hair with your camera, get a dermatologist-style
        report in seconds, and follow a routine built for exactly what your
        skin needs today.
      </motion.p>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Link to="/register" className="btn-primary text-base px-8 py-3.5">
          <HiOutlineSparkles /> Start your free scan
        </Link>
      </motion.div>

      <GlassCard className="mt-16 text-left grid md:grid-cols-3 gap-6" as="div">
        {[
          ["01", "Scan", "Live face detection guides you to the perfect frame — no blurry uploads."],
          ["02", "Analyze", "A transfer-learning model reads acne, tone, texture, and more."],
          ["03", "Follow", "Get a morning, night, and weekly routine matched to your results."]
        ].map(([step, title, copy]) => (
          <div key={step}>
            <p className="font-mono text-xs text-lavender-500 mb-2">{step}</p>
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-sm text-ink/60">{copy}</p>
          </div>
        ))}
      </GlassCard>
    </div>
  );
}
