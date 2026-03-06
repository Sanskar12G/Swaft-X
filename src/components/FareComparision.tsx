import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Bike, Car, TrendingDown, Search, ArrowDownUp } from "lucide-react";
import LocationInput from "./LocationInput";
import type { Location } from "../lib/location";
import { calculateFares, getDistance } from "../lib/location";

type RideType = "auto" | "bike" | "cab";

const FareComparison = () => {
  const [rideType, setRideType] = useState<RideType>("auto");
  const [pickup, setPickup] = useState<Location | null>(null);
  const [drop, setDrop] = useState<Location | null>(null);

  const distance = useMemo(() => {
    if (!pickup || !drop) return 0;
    return getDistance(pickup, drop);
  }, [pickup, drop]);

  const rides = useMemo(() => {
    if (!pickup || !drop) return [];
    return calculateFares(pickup, drop, rideType).sort((a, b) => a.price - b.price);
  }, [pickup, drop, rideType]);

  const savings = rides.length > 1 ? rides[rides.length - 1].price - rides[0].price : 0;
  const hasResults = rides.length > 0;

  const handleSwap = () => {
    const temp = pickup;
    setPickup(drop);
    setDrop(temp);
  };

  const rideTypes: { key: RideType; label: string; icon: React.ReactNode }[] = [
    { key: "auto", label: "Auto", icon: <Car className="h-4 w-4" /> },
    { key: "bike", label: "Bike", icon: <Bike className="h-4 w-4" /> },
    { key: "cab", label: "Cab", icon: <Car className="h-4 w-4" /> },
  ];

  return (
    <section id="compare" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Real-Time Fare <span className="text-primary">Comparison</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Enter your pickup and drop locations to see fares across all services instantly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <div className="glass rounded-2xl p-6 space-y-6">
            {/* Location inputs */}
            <div className="space-y-1 relative">
              <LocationInput
                label="Pickup"
                value={pickup}
                onChange={setPickup}
                icon="pickup"
                showCurrentLocation
              />

              {/* Swap button */}
              <div className="absolute left-1/2 -translate-x-1/2 top-[calc(50%-14px)] z-10">
                <button
                  onClick={handleSwap}
                  disabled={!pickup && !drop}
                  className="h-7 w-7 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-primary/20 hover:border-primary/30 transition-all disabled:opacity-30"
                >
                  <ArrowDownUp className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>

              <LocationInput
                label="Drop"
                value={drop}
                onChange={setDrop}
                icon="drop"
              />
            </div>

            {/* Distance indicator */}
            {pickup && drop && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
              >
                <Search className="h-3.5 w-3.5" />
                <span>
                  Distance: <span className="text-foreground font-semibold">{distance.toFixed(1)} km</span>
                </span>
              </motion.div>
            )}

            {/* Ride type tabs */}
            <div className="flex gap-2 p-1 rounded-xl bg-secondary/50">
              {rideTypes.map((type) => (
                <button
                  key={type.key}
                  onClick={() => setRideType(type.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    rideType === type.key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {type.icon}
                  {type.label}
                </button>
              ))}
            </div>

            {/* Fare cards */}
            <AnimatePresence mode="wait">
              {!hasResults ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-8 text-center"
                >
                  <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                    <Search className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Enter pickup & drop locations to compare fares
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={`${rideType}-${pickup?.id}-${drop?.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {rides.map((ride, i) => (
                    <motion.div
                      key={ride.service}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer ${
                        i === 0
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-secondary/30 border border-transparent hover:border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full ${ride.color} opacity-90 flex items-center justify-center`}
                        >
                          <span className="text-xs font-bold text-background">
                            {ride.service.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-foreground flex items-center gap-2">
                            {ride.service}
                            {i === 0 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-semibold uppercase tracking-wider">
                                Best
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{ride.eta} away</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-display text-lg font-bold ${
                            i === 0 ? "text-primary" : "text-foreground"
                          }`}
                        >
                          ₹{ride.price}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Savings banner */}
            {hasResults && savings > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20"
              >
                <TrendingDown className="h-5 w-5 text-primary shrink-0" />
                <div className="text-sm">
                  <span className="text-muted-foreground">You save up to </span>
                  <span className="text-primary font-display font-bold text-lg">₹{savings}</span>
                  <span className="text-muted-foreground"> with Swaft X</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FareComparison;
