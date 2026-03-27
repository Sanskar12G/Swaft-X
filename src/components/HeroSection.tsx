import { motion } from "framer-motion";
import {
  Car,
  Clock,
  MapPin,
  Star,
  Brain,
  TrafficCone,
  TrendingUp,
  Bot,
  Leaf,
  Timer,
  Route,
  Link2,
  BarChart3,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Brain,
    title: "Smart Ride Comparison",
    description:
      "Compare Uber, Ola, and Rapido rides by price, ETA, and efficiency in one place.",
  },
  {
    icon: TrafficCone,
    title: "Real-Time Traffic Intelligence",
    description:
      "Get live traffic alerts like route avoidance and congestion warnings before you ride.",
  },
  {
    icon: TrendingUp,
    title: "Surge Pricing Simulator",
    description:
      "See a transparent surge breakdown across peak time, traffic, and weather multipliers.",
  },
  {
    icon: Bot,
    title: "AI Ride Recommendation",
    description:
      "Receive the best ride option with clear reasoning on why it fits your trip.",
  },
  {
    icon: Leaf,
    title: "Carbon Footprint Tracker",
    description:
      "Compare CO2 impact across rides and choose lower-emission options instantly.",
  },
  {
    icon: Timer,
    title: "Wait or Book Prediction",
    description:
      "Know the right booking moment with savings insights like waiting to save more.",
  },
  {
    icon: Route,
    title: "Multi-Route Optimization",
    description:
      "Explore fastest, shortest, and least-traffic routes to pick the smartest journey path.",
  },
  {
    icon: Link2,
    title: "One-Tap Booking Redirect",
    description:
      "Continue booking directly in Uber or Ola apps from within the platform in one tap.",
  },
  {
    icon: BarChart3,
    title: "Price Trend Analyzer",
    description:
      "Track fare movement over time using historical and predicted ride pricing trends.",
  },
  {
    icon: Bell,
    title: "Smart Price Alerts",
    description:
      "Get instant notifications when fares drop so you can book at the best available price.",
  },
];

const stats = [
  { value: "2M+", label: "Rides Completed" },
  { value: "50K+", label: "Active Drivers" },
  { value: "4.9", label: "Average Rating" },
  { value: "100+", label: "Cities" },
];

interface HeroSectionProps {
  onBookNow: () => void;
}

const HeroSection = ({ onBookNow }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] bg-[size:60px_60px] opacity-8 dark:opacity-25" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      
      <div className="container relative z-10 px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm text-primary font-medium">AI-Powered Ride Technology</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              The Future of
              <span className="block text-black dark:bg-gradient-to-r dark:from-primary dark:via-secondary dark:to-accent dark:bg-clip-text dark:text-transparent">
                Urban Mobility
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg">
              Experience seamless rides with predictive AI, real-time tracking, and 
              unmatched safety features. Your journey, reimagined.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" onClick={onBookNow}>
                <MapPin className="w-5 h-5" />
                Book a Ride
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border/50">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Right content - Map preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Glowing ring */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" style={{ animationDuration: "3s" }} />
              <div className="absolute inset-4 rounded-full border border-primary/20" />
              
              {/* Map simulation */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-muted to-card overflow-hidden border border-border">
                {/* Grid lines */}
                <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] bg-[size:20px_20px] opacity-50" />
                
                {/* Animated routes */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                  <motion.path
                    d="M40 160 Q100 80 160 40"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                  <motion.path
                    d="M30 100 Q80 60 150 120"
                    stroke="hsl(var(--accent))"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.5 }}
                  />
                </svg>
                
                {/* Animated car icons */}
                <motion.div
                  className="absolute w-4 h-4 text-primary"
                  animate={{
                    x: [60, 120, 180],
                    y: [180, 100, 40],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Car className="w-4 h-4 -rotate-45" />
                </motion.div>
                <motion.div
                  className="absolute w-4 h-4 text-secondary"
                  animate={{
                    x: [40, 90, 160],
                    y: [120, 70, 140],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                  <Car className="w-4 h-4 rotate-12" />
                </motion.div>
                
                {/* Center pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-accent/20 animate-ping" />
                    <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-accent" />
                  </div>
                </div>
              </div>
              
              {/* Floating cards */}
              <motion.div
                className="absolute -top-4 -right-4 p-4 rounded-xl bg-card/90 backdrop-blur-lg border border-border/50 shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Top Rated</div>
                    <div className="text-xs text-muted-foreground">4.9 ★ (12k reviews)</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 p-4 rounded-xl bg-card/90 backdrop-blur-lg border border-border/50 shadow-xl"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">ETA: 3 mins</div>
                    <div className="text-xs text-muted-foreground">Driver on the way</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Features section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20"
        >
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary/80 font-semibold mb-2">
                Product Highlights
              </p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Feature Wheel
                <span className="block text-muted-foreground text-base md:text-lg font-medium mt-1">
                  Swipe through what makes every ride smarter.
                </span>
              </h2>
            </div>
            <p className="hidden md:block text-sm text-muted-foreground">Scroll down to explore</p>
          </div>

          <div className="relative rounded-3xl border border-border/60 bg-gradient-to-r from-card/70 via-card/45 to-card/70 p-4 md:p-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-background to-transparent z-10 rounded-t-3xl" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent z-10 rounded-b-3xl" />
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.16),transparent_45%),radial-gradient(circle_at_80%_30%,hsl(var(--accent)/0.14),transparent_40%)]" />

            <div
              className="relative z-20 grid gap-5 max-h-[560px] overflow-y-auto pr-2 snap-y snap-mandatory [scrollbar-width:thin]"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.55 + index * 0.06 }}
                  className="group snap-start p-6 rounded-3xl bg-gradient-to-b from-card via-card/90 to-muted/60 backdrop-blur-xl border border-border/70 hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_16px_50px_hsl(var(--primary)/0.24)] transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/18 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/12 text-primary border border-primary/25">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{feature.description}</p>
                  <div className="h-1 w-24 rounded-full bg-gradient-to-r from-primary/70 to-accent/50" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
