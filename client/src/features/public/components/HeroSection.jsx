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
          style={{ filter: "brightness(1.05) contrast(0.95) saturate(0.9)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(rgba(255,255,255,0.88), rgba(255,255,255,0.75))",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-4"
        >
          <h1
            className="font-bold leading-[1.1]"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            <span className="text-[#111827] block">
              Driving Digital Transformation
            </span>
            <span className="block mt-1" style={{ color: "#14b8a6" }}>
              in Amhara Region
            </span>
          </h1>

          <p className="text-xl text-[#1e293b] max-w-xl sm:max-w-2xl mx-auto leading-relaxed px-4 font-medium">
            Delivering modern IT services and innovation programs to improve
            service delivery and accelerate development.
          </p>

          <p className="text-base text-[#334155] max-w-xl mx-auto px-4 font-medium">
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
