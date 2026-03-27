import { motion, AnimatePresence } from "framer-motion";
import { IndianRupee, Clock, Star, TrendingDown, CheckCircle, ArrowRight, Shield, Percent } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useMemo, useState } from "react";

interface Platform {
  id: string;
  name: string;
  logo: string;
  color: string;
  baseFare: number;
  perKm: number;
  perMin: number;
  surgeFactor: number;
  rating: number;
  eta: number;
  promoDiscount: number;
  features: string[];
}

const platforms: Platform[] = [
  {
    id: "swiftride",
    name: "Swift Ride",
    logo: "🚕",
    color: "#00e5ff",
    baseFare: 25,
    perKm: 10,
    perMin: 1.0,
    surgeFactor: 1.0,
    rating: 4.8,
    eta: 3,
    promoDiscount: 15,
    features: ["No Surge", "Verified Drivers", "Live Tracking"],
  },
  {
    id: "ola",
    name: "Ola",
    logo: "🟢",
    color: "#1a8d1a",
    baseFare: 30,
    perKm: 13,
    perMin: 1.5,
    surgeFactor: 1.3,
    rating: 4.3,
    eta: 5,
    promoDiscount: 0,
    features: ["Ola Money", "Share Ride"],
  },
  {
    id: "uber",
    name: "Uber",
    logo: "⬛",
    color: "#000000",
    baseFare: 35,
    perKm: 14,
    perMin: 2.0,
    surgeFactor: 1.5,
    rating: 4.5,
    eta: 7,
    promoDiscount: 10,
    features: ["UPI Pay", "Safety Toolkit"],
  },
  {
    id: "rapido",
    name: "Rapido",
    logo: "🟡",
    color: "#f5c518",
    baseFare: 20,
    perKm: 9,
    perMin: 0.8,
    surgeFactor: 1.1,
    rating: 4.1,
    eta: 4,
    promoDiscount: 0,
    features: ["Bike + Auto", "Budget Friendly"],
  },
  {
    id: "indrive",
    name: "InDrive",
    logo: "🟣",
    color: "#6b21a8",
    baseFare: 28,
    perKm: 11,
    perMin: 1.2,
    surgeFactor: 1.0,
    rating: 4.0,
    eta: 8,
    promoDiscount: 5,
    features: ["Negotiate Price", "Cash Only"],
  },
];

interface RideCompareProps {
  distanceKm: number;
  durationMin: number;
  rideType: string;
  onSelectPlatform?: (platformId: string, fare: number) => void;
}

const RideCompare = ({ distanceKm, durationMin, rideType, onSelectPlatform }: RideCompareProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const rideMultiplier = rideType === "luxury" ? 2.2 : rideType === "ev" ? 1.2 : 1.0;

  const comparisons = useMemo(() => {
    return platforms.map((p) => {
      const rawFare = (p.baseFare + p.perKm * distanceKm + p.perMin * durationMin) * p.surgeFactor * rideMultiplier;
      const discount = Math.round(rawFare * p.promoDiscount / 100);
      const finalFare = Math.round(rawFare - discount);
      return { ...p, rawFare: Math.round(rawFare), discount, finalFare };
    }).sort((a, b) => a.finalFare - b.finalFare);
  }, [distanceKm, durationMin, rideMultiplier]);

  const cheapest = comparisons[0];
  const costliest = comparisons[comparisons.length - 1];
  const savings = costliest.finalFare - cheapest.finalFare;

  const handleSelect = (platform: typeof comparisons[0]) => {
    setSelectedPlatform(platform.id);
    onSelectPlatform?.(platform.id, platform.finalFare);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-green-500" />
          Compare Ride Platforms
        </h3>
        <Badge variant="secondary" className="text-xs">
          Save up to ₹{savings}
        </Badge>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {comparisons.map((platform, index) => {
            const isCheapest = index === 0;
            const isSelected = selectedPlatform === platform.id;
            
            return (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card
                  className={`p-3 cursor-pointer transition-all border ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : isCheapest
                      ? "border-green-500/40 bg-green-500/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                  onClick={() => handleSelect(platform)}
                >
                  <div className="flex items-center gap-3">
                    {/* Logo */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                      style={{ backgroundColor: platform.color + "20" }}
                    >
                      {platform.logo}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{platform.name}</span>
                        {isCheapest && (
                          <span className="px-1.5 py-0.5 bg-green-500/20 text-green-500 text-[10px] font-bold rounded">
                            CHEAPEST
                          </span>
                        )}
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          {platform.rating}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {platform.eta} min
                        </span>
                        {platform.surgeFactor > 1 && (
                          <span className="text-red-400 font-medium">
                            {platform.surgeFactor}x surge
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      {platform.discount > 0 && (
                        <p className="text-xs text-muted-foreground line-through">
                          ₹{platform.rawFare}
                        </p>
                      )}
                      <p className={`font-bold text-base flex items-center justify-end ${isCheapest ? "text-green-500" : "text-foreground"}`}>
                        <IndianRupee className="w-3.5 h-3.5" />
                        {platform.finalFare}
                      </p>
                      {platform.discount > 0 && (
                        <p className="text-[10px] text-green-500 flex items-center gap-0.5 justify-end">
                          <Percent className="w-2.5 h-2.5" />
                          {platform.promoDiscount}% off
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Features row */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {platform.features.map((f) => (
                      <span
                        key={f}
                        className="px-1.5 py-0.5 bg-muted text-muted-foreground text-[10px] rounded"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Savings summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-3 rounded-lg bg-green-500/10 border border-green-500/20"
      >
        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-green-500" />
          <span className="text-green-500 font-medium">
            Best Deal: {cheapest.name} at ₹{cheapest.finalFare}
          </span>
          <ArrowRight className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground">
            saves ₹{savings} vs {costliest.name}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RideCompare;
