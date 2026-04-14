import { motion } from "framer-motion";
import { Zap, Target, Users, Award, Shield, Clock } from "lucide-react";

const features = [
  {
    title: "Fast Processing",
    description: "Quick turnaround on applications and requests",
    icon: Zap,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    title: "Secure Platform",
    description: "Your data is protected with enterprise security",
    icon: Shield,
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    title: "Expert Support",
    description: "Guidance from experienced professionals",
    icon: Users,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "24/7 Availability",
    description: "Access services anytime, anywhere",
    icon: Clock,
    gradient: "from-purple-500 to-pink-600",
  },

  {
    title: "Cutting-Edge Resources",
    description: "Access to modern facilities and equipment",
    icon: Target,
    gradient: "from-blue-500 to-cyan-600",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-linear-to-b from-slate-800 via-slate-700/50 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why Choose ITSMS?
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            We provide comprehensive support and resources to help you succeed
            in the digital economy.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6 hover:border-emerald-500/30 hover:shadow-xl transition-all duration-300"
            >
              <div
                className={`w-14 h-14 bg-linear-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
