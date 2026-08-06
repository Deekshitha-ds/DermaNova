import { motion } from "framer-motion";

/**
 * The signature surface of DermaNova AI: a soft, frosted card that lets
 * the lavender/pink ambient gradient show through. Every panel in the
 * app (auth forms, scan viewport, report cards) is built on this.
 */
export default function GlassCard({ children, className = "", as: Component = motion.div, ...props }) {
  return (
    <Component
      className={`glass-panel p-6 md:p-8 ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      {...props}
    >
      {children}
    </Component>
  );
}
