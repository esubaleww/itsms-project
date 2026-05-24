import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen pt-20 sm:pt-24 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://res.cloudinary.com/dlqn1qugq/image/upload/q_auto/f_auto/v1776159724/hero_bsherp.jpg"
          alt="ITSMS Bureau Building - Bahir Dar"
          className="
    w-full h-full object-cover object-center
    brightness-[0.96]
    contrast-[0.88]
    saturate-[0.75]
    blur-[0.5px]
    scale-[1.01]
  "
        />
        <div className="absolute inset-0 bg-white/70" />{" "}
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-4"
        >
          <h1 className="font-heading font-medium leading-[0.98] tracking-[0.01em] text-[clamp(3.2rem,7vw,5.8rem)] drop-shadow-[0_2px_12px_rgba(255,255,255,0.35)]">
            <span className="text-accent block">Driving Digital</span>

            <span className="text-accent block">Transformation</span>

            <span className="text-accent-teal block text-[0.78em] mt-2">
              in Amhara Region
            </span>
          </h1>

          <p className="text-xl text-text-secondary max-w-xl sm:max-w-2xl mx-auto leading-relaxed px-4 font-medium">
            Delivering modern IT services and innovation programs to improve
            service delivery and accelerate development.
          </p>

          <p className="text-base text-text-secondary max-w-xl mx-auto px-4 font-medium">
            Supporting startups, innovators, interns, and trainees through
            inclusive digital programs.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4">
            <Link to="/services/browse">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="btn-filled"
              >
                <Play className="w-4 h-4" />
                Browse Services
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
