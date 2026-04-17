import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen pt-20 sm:pt-24 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://res.cloudinary.com/dlqn1qugq/image/upload/q_auto/f_auto/v1776159724/hero_bsherp.jpg"
          alt="ITSMS Bureau Building - Bahir Dar"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/80 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-4"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-tight">
            <span className="text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)] block">
              Driving Digital Transformation
            </span>
            <span className="bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(0,0,0,0.5)] block mt-1">
              in Amhara Region
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-white max-w-xl sm:max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] px-4 font-medium">
            Delivering modern IT services and innovation programs to improve
            service delivery and accelerate development.
          </p>

          <p className="text-sm sm:text-base text-gray-100 max-w-xl mx-auto drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] px-4">
            Supporting startups, innovators, interns, and trainees through
            inclusive digital programs.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4">
            <Link to="/services/browse">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 sm:px-6 py-2.5 border-2 border-white/80 text-white rounded-lg hover:bg-white/20 hover:border-white transition-all duration-300 font-semibold backdrop-blur-sm flex items-center gap-2 group text-sm sm:text-base"
              >
                <Play className="w-4 h-4 group-hover:text-emerald-400 transition" />
                Browse Services
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
