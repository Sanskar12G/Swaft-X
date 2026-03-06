import { motion } from "framer-motion";
import { Navigation, Shield, Zap, Footprints, ArrowRightLeft, Clock } from "lucide-react";

const features = [
  {
    icon: <ArrowRightLeft className="h-6 w-6" />,
    title: "Compare All Services",
    description: "Side-by-side fares from Uber, Ola, Rapido & Namma Yatri in one view.",
  },
  {
    icon: <Footprints className="h-6 w-6" />,
    title: "Smart Pickup",
    description: "Walk to a nearby spot, cut wait time, burn calories & save even more money.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Instant Booking",
    description: "Book directly from the app — no switching between multiple ride apps.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "100% Privacy",
    description: "No login stored, no data sold. Your ride history stays yours.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Real-Time Pricing",
    description: "Live fare data that updates every few seconds for accurate comparisons.",
  },
  {
    icon: <Navigation className="h-6 w-6" />,
    title: "50+ Cities",
    description: "Available wherever Uber, Ola, Rapido or Namma Yatri operates in India.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Why Riders <span className="text-primary">Love</span> Swaft X
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Every feature designed to save you time, money, and hassle on every ride.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
