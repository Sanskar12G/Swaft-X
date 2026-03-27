import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Car, 
  Users, 
  IndianRupee, 
  TrendingUp, 
  MapPin, 
  Clock,
  Shield,
  LogOut,
  Activity,
  Zap,
  Navigation,
  AlertTriangle
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import IndiaMap from '@/components/IndiaMap';

interface Stats {
  totalRides: number;
  activeDrivers: number;
  totalRevenue: number;
  pendingTrips: number;
}

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalRides: 0,
    activeDrivers: 0,
    totalRevenue: 0,
    pendingTrips: 0,
  });
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [recentTrips, setRecentTrips] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate('/auth');
        return;
      }

      // Check if user has admin role
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin');

      if (error) throw error;

      if (!roles || roles.length === 0) {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges.',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
      await loadDashboardData();
    } catch (error: any) {
      console.error('Admin check error:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify admin access.',
        variant: 'destructive',
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      // Load trips count
      const { count: tripsCount } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true });

      // Load pending trips
      const { count: pendingCount } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Load recent payments
      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Load recent trips
      const { data: trips } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Calculate total revenue
      const { data: revenueData } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed');

      const totalRevenue = revenueData?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      setStats({
        totalRides: tripsCount || 0,
        activeDrivers: 47, // Simulated for now
        totalRevenue,
        pendingTrips: pendingCount || 0,
      });

      setRecentPayments(payments || []);
      setRecentTrips(trips || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const statCards = [
    { label: 'Total Rides', value: stats.totalRides, icon: Car, color: 'text-primary', change: '+12%' },
    { label: 'Active Drivers', value: stats.activeDrivers, icon: Users, color: 'text-accent', change: '+5%' },
    { label: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: 'text-green-500', change: '+18%' },
    { label: 'Pending Trips', value: stats.pendingTrips, icon: Clock, color: 'text-yellow-500', change: '-3%' },
  ];

  const fleetStatus = [
    { type: 'Economy', online: 23, total: 30, utilization: 77 },
    { type: 'Luxury', online: 8, total: 10, utilization: 80 },
    { type: 'Electric', online: 12, total: 15, utilization: 80 },
    { type: 'Rental', online: 4, total: 8, utilization: 50 },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - RideX</title>
        <meta name="description" content="RideX Admin Dashboard - Fleet Management and Analytics" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Background effects */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="fixed inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)/0.15) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />

        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Fleet Management & Analytics</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 relative z-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-card/80 backdrop-blur-xl border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-500">{stat.change}</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl bg-primary/10 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Live Map */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-card/80 backdrop-blur-xl border-border/50 h-[500px]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Live Fleet Map - India
                    </h2>
                    <p className="text-sm text-muted-foreground">Real-time driver locations</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-muted-foreground">Live</span>
                  </div>
                </div>
                <div className="h-[400px] rounded-xl overflow-hidden">
                  <IndiaMap />
                </div>
              </Card>
            </motion.div>

            {/* Fleet Utilization */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-card/80 backdrop-blur-xl border-border/50">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Fleet Utilization</h2>
                </div>
                <div className="space-y-6">
                  {fleetStatus.map((fleet) => (
                    <div key={fleet.type}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{fleet.type}</span>
                        <span className="text-sm text-muted-foreground">
                          {fleet.online}/{fleet.total} online
                        </span>
                      </div>
                      <Progress value={fleet.utilization} className="h-2" />
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Zap className="w-4 h-4" />
                      Surge Pricing
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Navigation className="w-4 h-4" />
                      Route Alerts
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Users className="w-4 h-4" />
                      Driver Mgmt
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Incidents
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Recent Payments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 bg-card/80 backdrop-blur-xl border-border/50">
                <div className="flex items-center gap-2 mb-6">
                  <IndianRupee className="w-5 h-5 text-green-500" />
                  <h2 className="text-lg font-semibold">Recent Payments</h2>
                </div>
                {recentPayments.length > 0 ? (
                  <div className="space-y-4">
                    {recentPayments.slice(0, 5).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div>
                          <p className="font-medium">₹{payment.amount}</p>
                          <p className="text-sm text-muted-foreground">{payment.payment_method || 'UPI'}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          payment.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                          payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-red-500/20 text-red-500'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No payments yet</p>
                )}
              </Card>
            </motion.div>

            {/* Recent Trips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 bg-card/80 backdrop-blur-xl border-border/50">
                <div className="flex items-center gap-2 mb-6">
                  <Car className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Recent Trips</h2>
                </div>
                {recentTrips.length > 0 ? (
                  <div className="space-y-4">
                    {recentTrips.slice(0, 5).map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{trip.pickup_address}</p>
                          <p className="text-sm text-muted-foreground truncate">→ {trip.dropoff_address}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-medium text-accent">₹{trip.fare || 0}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            trip.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                            trip.status === 'active' ? 'bg-primary/20 text-primary' :
                            'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {trip.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No trips yet</p>
                )}
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Admin;
