import { motion } from "framer-motion";
import {
  Lightbulb,
  GraduationCap,
  Rocket,
  ArrowRight,
  CheckCircle,
  Trophy,
} from "lucide-react";

const programs = [
  {
    id: "innovation",
    title: "Innovation Program",
    description:
      "Transform your innovative ideas into reality with mentorship, funding, and incubation support.",
    benefits: ["Mentorship", "Funding Support", "Incubation Space"],
    buttonText: "Apply Now",
    path: "/applications/apply/innovation",
    icon: Lightbulb,
    linear: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-500/20 to-orange-600/10",
    image:
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    color: "amber",
  },
  {
    id: "internship",
    title: "Internship Program",
    description:
      "Gain hands-on experience and develop professional skills through our comprehensive internship program.",
    benefits: ["Hands-on Experience", "Professional Training", "Certification"],
    buttonText: "Apply Now",
    path: "/applications/apply/internship",
    icon: GraduationCap,
    linear: "from-blue-500 to-cyan-600",
    bgGradient: "from-blue-500/20 to-cyan-600/10",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    color: "blue",
  },
  {
    id: "startup",
    title: "Startup Program",
    description:
      "Register your startup and get access to resources, mentorship, and funding opportunities.",
    benefits: ["Mentorships", "Investment Funds", "Venture Capital"],
    buttonText: "Apply Now",
    path: "/applications/apply/startup",
    icon: Rocket,
    linear: "from-purple-500 to-pink-600",
    bgGradient: "from-purple-500/20 to-pink-600/10",
    image:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    color: "purple",
  },
];

export default function ProgramsSection({ isAuthenticated, onApply }) {
  return (
    <section className="py-24 bg-linear-to-b from-slate-800 via-slate-700/50 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">
              Our Programs
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Choose Your Path
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Select from our innovative programs designed to foster growth,
            learning, and technological advancement.
          </p>
        </motion.div>

        {/* Programs Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden hover:border-slate-600 transition-all duration-300 h-full flex flex-col">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className={`absolute inset-0 bg-linear-to-t ${program.bgGradient} from-slate-900 via-slate-900/50 to-transparent`}
                  />

                  <div
                    className={`absolute top-4 right-4 w-12 h-12 bg-linear-to-br ${program.linear} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <program.icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="absolute bottom-4 left-4">
                    <span
                      className={`px-3 py-1 bg-linear-to-r ${program.linear} rounded-lg text-white text-xs font-medium`}
                    >
                      Featured Program
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {program.title}
                  </h3>
                  <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                    {program.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {program.benefits.map((benefit) => (
                      <div
                        key={benefit}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle
                          className={`w-4 h-4 text-${program.color}-400`}
                        />
                        <span className="text-slate-300">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => onApply(program.path)}
                    className={`mt-auto w-full px-6 py-3 bg-linear-to-r ${program.linear} text-white rounded-xl hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 font-medium group/btn`}
                  >
                    {program.buttonText}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
