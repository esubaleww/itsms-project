import { motion } from "framer-motion";
import {
  Users,
  Rocket,
  School,
  Lightbulb,
  TrendingUp,
  Code,
  Loader2,
  Briefcase,
} from "lucide-react";

const iconMap = {
  Users: Users,
  Rocket: Rocket,
  School: School,
  Briefcase: Briefcase,
  Lightbulb: Lightbulb,
  TrendingUp: TrendingUp,
  Code: Code,
};

export default function StatsSection({ stats, loading }) {
  if (loading) {
    return (
      <div className="py-12 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-slate-800/30 border-y border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon] || Users;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-500/30 to-transparent" />
    </div>
  );
}
