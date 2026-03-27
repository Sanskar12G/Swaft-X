import { motion } from "framer-motion";
import { Car, DollarSign, MapPin, Clock, TrendingUp, Navigation, Power, Star, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const earnings = {
  today: 187.50,
  week: 1243.80,
  trips: 12,
  hours: 6.5,
  rating: 4.92,
};

const heatmapData = [
  { area: "Downtown", demand: "high", bonus: "+$5" },
  { area: "Airport", demand: "medium", bonus: "+$3" },
  { area: "Stadium", demand: "surge", bonus: "+$8" },
  { area: "Mall District", demand: "low", bonus: "" },
];

const recentTrips = [
  { id: 1, from: "123 Main St", to: "Airport Terminal 2", fare: 34.50, time: "25 min", rating: 5 },
  { id: 2, from: "Downtown Mall", to: "Riverside Apts", fare: 18.20, time: "15 min", rating: 5 },
  { id: 3, from: "Tech Park", to: "Central Station", fare: 22.80, time: "18 min", rating: 4 },
];

interface DriverDashboardProps {
  onBack: () => void;
}

const DriverDashboard = ({ onBack }: DriverDashboardProps) => {
  return (
    <section className="min-h-screen py-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(220_15%_8%)_1px,transparent_1px),linear-gradient(90deg,hsl(220_15%_8%)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[150px]" />
      
      <div className="container relative z-10 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" className="mb-2" onClick={onBack}>
              ← Back to Home
            </Button>
            <h1 className="text-3xl font-bold">Driver Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Alex</p>
          </div>
          <Button variant="accent" size="lg" className="gap-2">
            <Power className="w-5 h-5" />
            Go Online
          </Button>
        </div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="glow" className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Today</div>
                  <div className="text-2xl font-bold">${earnings.today}</div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card variant="glass" className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">This Week</div>
                  <div className="text-2xl font-bold">${earnings.week}</div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="glass" className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Car className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Trips</div>
                  <div className="text-2xl font-bold">{earnings.trips}</div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card variant="glass" className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Hours</div>
                  <div className="text-2xl font-bold">{earnings.hours}h</div>
                </div>
              </div>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="glass" className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                  <div className="text-2xl font-bold">{earnings.rating}</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Heatmap */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Demand Heatmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {heatmapData.map((zone) => (
                    <div
                      key={zone.area}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          zone.demand === "surge" ? "bg-destructive animate-pulse" :
                          zone.demand === "high" ? "bg-accent" :
                          zone.demand === "medium" ? "bg-primary" :
                          "bg-muted-foreground"
                        }`} />
                        <span className="font-medium">{zone.area}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          zone.demand === "surge" ? "bg-destructive/20 text-destructive" :
                          zone.demand === "high" ? "bg-accent/20 text-accent" :
                          zone.demand === "medium" ? "bg-primary/20 text-primary" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {zone.demand.toUpperCase()}
                        </span>
                        {zone.bonus && (
                          <span className="text-sm font-semibold text-accent">{zone.bonus}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  <Navigation className="w-4 h-4 mr-2" />
                  Navigate to High Demand
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Recent trips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-primary" />
                  Recent Trips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            {trip.from}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            {trip.to}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">${trip.fare}</div>
                          <div className="text-xs text-muted-foreground">{trip.time}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: trip.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Incoming ride alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card variant="glow" className="p-6 border-accent/50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center animate-pulse">
                <AlertCircle className="w-8 h-8 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">New Ride Request</h3>
                <p className="text-muted-foreground">Downtown → Airport Terminal 1</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    5 min away
                  </span>
                  <span className="flex items-center gap-1 text-accent font-semibold">
                    <DollarSign className="w-4 h-4" />
                    Est. $42.00
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="lg">
                  Decline
                </Button>
                <Button variant="accent" size="lg">
                  Accept
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default DriverDashboard;
