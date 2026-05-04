import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { features } from "../data/homeData";

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">Why Choose Us</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Why Choose ITSMS?
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            We provide comprehensive support and resources to help you succeed
            in the digital economy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 text-center hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-linear-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
