import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import heroPhone from "@/assets/hero-phone.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden gradient-mesh pt-20">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium">
            <Zap className="h-4 w-4" />
            Trusted by 100K+ riders across India
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            Compare.{" "}
            <span className="text-primary glow-text">Save.</span>
            <br />
            Ride Smarter.
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
            Instantly compare fares across Uber, Ola, Rapido & Namma Yatri.
            Save <span className="text-primary font-semibold">25% or more</span> on every ride with real-time pricing and Smart Pickup.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#compare"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-display font-semibold text-lg hover:opacity-90 transition-all glow-primary"
            >
              Compare Fares Now
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-border text-foreground font-display font-medium text-lg hover:bg-secondary transition-all"
            >
              How It Works
            </a>
          </div>

          <div className="flex items-center gap-8 pt-4">
            {[
              { label: "Avg Saved", value: "₹45/ride" },
              { label: "Cities", value: "50+" },
              { label: "Data Safety", value: "100%" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center lg:justify-end"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-3xl scale-90" />
            <img
              src={heroPhone}
              alt="Swaft X ride comparison app showing fare comparisons"
              className="relative w-72 md:w-80 lg:w-96 animate-float drop-shadow-2xl"
              loading="eager"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
