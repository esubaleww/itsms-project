// client/src/features/home/components/CTASection.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 bg-linear-to-r from-emerald-700 to-teal-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm text-white">Get Started Today</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Transform Your Ideas?
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Join hundreds of innovators, interns, and professionals who are
            already benefiting from our programs and services.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <button className="px-6 py-3 bg-white text-emerald-700 rounded-xl hover:bg-slate-100 transition font-medium shadow-lg">
                Get Started
              </button>
            </Link>
            <Link to="/services/browse">
              <button className="px-6 py-3 border border-white text-white rounded-xl hover:bg-white/10 transition font-medium">
                Browse Services
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
