import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { features } from "../data/homeData";

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-linear-to-b from-white/88 to-white/75">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full mb-4 shadow-sm">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm text-text-secondary font-medium">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-3xl font-heading font-medium text-text-primary mb-4">
            Why Choose ITSMS?
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
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
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center hover:border-accent/30 hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-text-primary font-heading font-medium mb-2">
                {feature.title}
              </h3>
              <p className="text-text-muted text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
