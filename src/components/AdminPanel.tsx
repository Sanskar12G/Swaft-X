import { motion } from "framer-motion";
import { Car, Users, DollarSign, TrendingUp, MapPin, Settings, Shield, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Active Rides", value: "1,247", change: "+12%", icon: Car, color: "primary" },
  { label: "Online Drivers", value: "3,891", change: "+8%", icon: Users, color: "secondary" },
  { label: "Today's Revenue", value: "$47,832", change: "+23%", icon: DollarSign, color: "accent" },
  { label: "Surge Zones", value: "8", change: "+3", icon: Zap, color: "destructive" },
];

const fleetStatus = [
  { type: "Economy", online: 2340, total: 3200, utilization: 73 },
  { type: "Luxury", online: 456, total: 600, utilization: 76 },
  { type: "Electric", online: 892, total: 1100, utilization: 81 },
  { type: "Rental", online: 203, total: 450, utilization: 45 },
];

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel = ({ onBack }: AdminPanelProps) => {
  return (
    <section className="min-h-screen py-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(220_15%_8%)_1px,transparent_1px),linear-gradient(90deg,hsl(220_15%_8%)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />
      
      <div className="container relative z-10 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" className="mb-2" onClick={onBack}>
              ← Back to Home
            </Button>
            <h1 className="text-3xl font-bold">Admin Control Center</h1>
            <p className="text-muted-foreground">Real-time fleet management</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="default">
              <Shield className="w-4 h-4 mr-2" />
              Safety Override
            </Button>
          </div>
        </div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glass" className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className={`text-sm mt-1 ${
                      stat.color === "primary" ? "text-primary" :
                      stat.color === "secondary" ? "text-secondary" :
                      stat.color === "accent" ? "text-accent" :
                      "text-destructive"
                    }`}>
                      {stat.change} from yesterday
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    stat.color === "primary" ? "bg-primary/20" :
                    stat.color === "secondary" ? "bg-secondary/20" :
                    stat.color === "accent" ? "bg-accent/20" :
                    "bg-destructive/20"
                  }`}>
                    <stat.icon className={`w-6 h-6 ${
                      stat.color === "primary" ? "text-primary" :
                      stat.color === "secondary" ? "text-secondary" :
                      stat.color === "accent" ? "text-accent" :
                      "text-destructive"
                    }`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Live map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card variant="glass" className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Live Fleet Map
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-sm text-muted-foreground">Live</span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-muted to-card">
                  {/* Grid pattern */}
                  <div className="absolute inset-0 bg-[linear-gradient(hsl(220_15%_15%)_1px,transparent_1px),linear-gradient(90deg,hsl(220_15%_15%)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
                  
                  {/* Simulated map areas */}
                  <div className="absolute inset-8">
                    {/* City zones */}
                    <div className="absolute top-[20%] left-[30%] w-24 h-24 rounded-full bg-accent/20 animate-pulse" />
                    <div className="absolute top-[40%] right-[20%] w-32 h-32 rounded-full bg-destructive/20 animate-pulse" style={{ animationDelay: "0.5s" }} />
                    <div className="absolute bottom-[25%] left-[15%] w-20 h-20 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: "1s" }} />
                    
                    {/* Car dots */}
                    {Array.from({ length: 30 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-primary"
                        style={{
                          left: `${Math.random() * 90}%`,
                          top: `${Math.random() * 90}%`,
                        }}
                        animate={{
                          x: [0, Math.random() * 20 - 10],
                          y: [0, Math.random() * 20 - 10],
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      />
                    ))}
                    
                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-card/90 backdrop-blur border border-border text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-accent" />
                          <span>High Demand</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-destructive" />
                          <span>Surge</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span>Drivers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Fleet status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Fleet Utilization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {fleetStatus.map((fleet) => (
                    <div key={fleet.type}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{fleet.type}</span>
                        <span className="text-sm text-muted-foreground">
                          {fleet.online}/{fleet.total}
                        </span>
                      </div>
                      <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className={`absolute inset-y-0 left-0 rounded-full ${
                            fleet.utilization > 75 ? "bg-accent" :
                            fleet.utilization > 50 ? "bg-primary" :
                            "bg-secondary"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${fleet.utilization}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                      <div className="text-right text-sm text-muted-foreground mt-1">
                        {fleet.utilization}% utilized
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Quick actions */}
            <Card variant="glass" className="mt-4">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Zap className="w-4 h-4 mr-2 text-destructive" />
                  Activate Surge Pricing
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2 text-primary" />
                  Send Driver Alerts
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2 text-accent" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;
