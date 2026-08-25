import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard.jsx";
import { HiOutlineSparkles } from "react-icons/hi";
import { HiOutlineCamera } from "react-icons/hi";
import { HiOutlineHeart } from "react-icons/hi";
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
        <Link to="/scan/skin" className="btn-primary text-base px-8 py-3.5">
          <HiOutlineSparkles /> Start your free scan
        </Link>
         
      </motion.div>
      <br /><br /><br /> <br /><br /><br /><br /><br /><br /><br /><br />

      
   
{/* =========================================
          HOW IT WORKS
      ========================================= */}

      <section className="max-w-6xl mx-auto px-4 pb-24">

        <div className="text-center mb-10">

          <h2 className="text-3xl md:text-4xl font-semibold">
            From scan to skincare.
          </h2>

          <p className="text-ink/50 mt-3 max-w-lg mx-auto">
            Three intelligent steps between you and a better understanding
            of your skin.
          </p>

        </div>


        <div className="grid md:grid-cols-3 gap-5">

          {[
            {
              number: "01",
              icon: HiOutlineCamera,
              title: "Scan",
              text: "Use your camera to capture a clear, guided image of your face."
            },
            {
              number: "02",
              icon: HiOutlineSparkles,
              title: "Analyze",
              text: "Our AI analyzes visible skin characteristics and detects concerns."
            },
            {
              number: "03",
              icon: HiOutlineHeart,
              title: "Personalize",
              text: "Turn your analysis into recommendations and a routine made for you."
            }
          ].map((item) => {

            const Icon = item.icon;

            return (
              <GlassCard
                key={item.number}
                className="relative group hover:-translate-y-1 transition-transform duration-300"
                as="div"
              >

                <div className="flex items-center justify-between mb-6">

                  <span className="font-mono text-xs text-lavender-500">
                    {item.number}
                  </span>

                  <div className="w-10 h-10 rounded-xl bg-lavender-100 flex items-center justify-center text-lavender-600">
                    <Icon className="text-lg" />
                  </div>

                </div>

                <h3 className="text-xl font-semibold mb-2">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-ink/55">
                  {item.text}
                </p>

              </GlassCard>
            );

          })}

        </div>

      </section>
       </div>
  );
}