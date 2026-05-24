import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 bg-linear-to-b from-white/88 to-white/75">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-text-secondary font-medium">
              Get Started Today
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-medium text-text-primary">
            Ready to Transform Your Ideas?
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Join hundreds of innovators, interns, and professionals who are
            already benefiting from our programs and services.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <button className="btn-outline">Get Started</button>
            </Link>
            <Link to="/services/browse">
              <button className="btn-filled">Browse Services</button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
