import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Github, Linkedin, Code2, Zap, Database, Brain, Leaf, Shield } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-14 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Home</span>
          </Link>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">
              Swaft <span className="text-primary">X</span>
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-3xl">
        {/* Hero */}
        <motion.div {...fadeUp} className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-primary">Swaft X</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A smart ride intelligence platform built to compare fares, reduce emissions, and save money — starting with Jabalpur, MP.
          </p>
        </motion.div>

        {/* Project Info */}
        <motion.section {...fadeUp} className="mb-12 space-y-6">
          <div className="p-6 rounded-2xl bg-secondary/30 border border-border space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground">The Project</h2>
            <p className="text-muted-foreground leading-relaxed">
              Swaft X is a real-time ride fare comparison tool designed to help commuters find the cheapest, fastest, and most eco-friendly ride across multiple services like Ola, Uber, Rapido, and more.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The platform features a <strong className="text-foreground">Jabalpur-specific ride intelligence engine</strong> that operates strictly within geographic constraints (lat 23.10–23.25, lng 79.85–80.05). It uses deterministic surge pricing logic, a weighted scoring formula combining price and ETA, and carbon emission estimates to recommend the best ride.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The scoring formula is: <code className="px-2 py-1 rounded bg-secondary text-primary text-sm font-mono">score = (0.7 × adjusted_price) + (0.3 × eta_minutes)</code> — where lower scores indicate better rides. If two rides score within 5%, the greener option wins.
            </p>
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section {...fadeUp} className="mb-12">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Tech Stack</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <Code2 className="h-5 w-5" />, title: "React + TypeScript", desc: "Modern frontend with type safety and component-based architecture" },
              { icon: <Zap className="h-5 w-5" />, title: "Vite + Tailwind CSS", desc: "Lightning-fast builds with utility-first styling" },
              { icon: <Database className="h-5 w-5" />, title: "MongoDB (Backend)", desc: "Planned backend storage for ride history and analytics" },
              { icon: <Brain className="h-5 w-5" />, title: "Ollama AI (Backend)", desc: "Local LLM reasoning for intelligent ride recommendations" },
              { icon: <Leaf className="h-5 w-5" />, title: "Carbon Estimation", desc: "Per-ride CO₂ calculations based on vehicle type and distance" },
              { icon: <Shield className="h-5 w-5" />, title: "Geo-Constrained", desc: "Strictly bounded to Jabalpur MP coordinates for data accuracy" },
            ].map((item) => (
              <div key={item.title} className="p-4 rounded-xl bg-secondary/30 border border-border flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="font-medium text-foreground text-sm">{item.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Key Features */}
        <motion.section {...fadeUp} className="mb-12">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Key Features</h2>
          <ul className="space-y-3">
            {[
              "Real-time fare comparison across Ola, Uber, Rapido, and more",
              "Deterministic surge pricing: peak hours (+0.5x) and high traffic (+0.3x) are cumulative",
              "Weighted ride scoring: 70% price + 30% ETA for optimal recommendations",
              "Carbon emission tracking: car (120 g/km), auto (80 g/km), bike (60 g/km)",
              "Paginated results with vehicle type filtering (Auto, Bike, Cab)",
              "Structured JSON output conforming to strict schema specifications",
              "20+ Jabalpur locations including Railway Station, Gwarighat, Napier Town, Vijay Nagar",
              "Location autocomplete with instant search",
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Creator */}
        <motion.section {...fadeUp} className="mb-12">
          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto">
              <span className="font-display text-3xl font-bold text-primary">S</span>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Created by Samrat</h2>
              <p className="text-muted-foreground text-sm mt-1">Full-Stack Developer</p>
            </div>
            <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
              Swaft X was designed and developed by Samrat as a project to demonstrate real-world application of ride-sharing fare comparison, intelligent scoring algorithms, environmental awareness through carbon tracking, and geo-constrained data systems.
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <a href="#" className="h-10 w-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="h-10 w-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pb-8">
          © 2026 Swaft X · Built by Samrat · All rights reserved
        </div>
      </main>
    </div>
  );
};

export default About;
