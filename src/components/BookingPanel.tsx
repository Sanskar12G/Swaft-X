import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Clock, Car, Zap, Crown, Leaf, Calendar, IndianRupee, AlertTriangle, Route, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useState, useRef, useEffect, useCallback } from "react";
import IndiaMap, { type RouteData } from "./IndiaMap";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { searchJabalpurLocations } from "@/data/jabalpurLocations";
import RideCompare from "./RideCompare";

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface LocationSuggestion {
  name: string;
  area: string;
  lat: number;
  lng: number;
  fullAddress: string;
}

const suggestionCache = new Map<string, LocationSuggestion[]>();
const BLOCKED_ROAD_TERMS = ["nh45", "nh 45", "nh-45", "highway", "national highway", "airport road", "dumna airport road"];
const JABALPUR_VIEWBOX = "79.82,23.28,80.10,23.05";

const resolveAccurateLocation = async (location: LocationSuggestion): Promise<LocationSuggestion> => {
  try {
    const query = location.fullAddress || `${location.name}, Jabalpur, MP`;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&bounded=1&viewbox=${JABALPUR_VIEWBOX}&q=${encodeURIComponent(query)}`
    );
    if (!response.ok) return location;

    const data = await response.json() as Array<{ lat: string; lon: string; display_name?: string }>;
    const best = data[0];
    if (!best) return location;

    const lat = Number(best.lat);
    const lng = Number(best.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return location;

    return {
      ...location,
      lat,
      lng,
      fullAddress: best.display_name || location.fullAddress,
    };
  } catch {
    return location;
  }
};

const searchLiveLocations = async (query: string): Promise<LocationSuggestion[]> => {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const cacheKey = trimmed.toLowerCase();
  const cached = suggestionCache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=8&countrycodes=in&addressdetails=1&bounded=1&viewbox=79.82,23.26,80.08,23.05&q=${encodeURIComponent(trimmed + ", Jabalpur, MP")}`
    );
    if (!response.ok) return [];

    const data = await response.json() as Array<{
      lat: string;
      lon: string;
      display_name: string;
      name?: string;
      address?: Record<string, string | undefined>;
      class?: string;
      type?: string;
    }>;

    const suggestions = data.map((item) => {
      const area =
        item.address?.suburb ||
        item.address?.neighbourhood ||
        item.address?.city_district ||
        item.address?.road ||
        "Jabalpur";

      return {
        name: item.name || item.address?.road || item.display_name.split(",")[0] || "Location",
        area,
        lat: Number(item.lat),
        lng: Number(item.lon),
        fullAddress: item.display_name,
      };
    }).filter((item) => {
      const haystack = `${item.name} ${item.fullAddress}`.toLowerCase();
      return !BLOCKED_ROAD_TERMS.some((term) => haystack.includes(term));
    });

    suggestionCache.set(cacheKey, suggestions);
    return suggestions;
  } catch {
    return [];
  }
};

const mapLocalSuggestion = (item: { name: string; area: string; lat: number; lng: number; fullAddress: string }): LocationSuggestion => ({
  name: item.name,
  area: item.area,
  lat: item.lat,
  lng: item.lng,
  fullAddress: item.fullAddress,
});

const mergeSuggestions = (localList: LocationSuggestion[], liveList: LocationSuggestion[]): LocationSuggestion[] => {
  const merged: LocationSuggestion[] = [];
  const seen = new Set<string>();

  [...localList, ...liveList].forEach((item) => {
    const key = `${item.name.toLowerCase()}|${item.fullAddress.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
  });

  return merged.slice(0, 8);
};

const rideOptions = [
  {
    id: "economy",
    name: "Economy",
    icon: Car,
    basePrice: 25,
    perKm: 12,
    time: "3 min",
    description: "Affordable everyday rides",
    multiplier: 1,
  },
  {
    id: "luxury",
    name: "Luxury",
    icon: Crown,
    basePrice: 50,
    perKm: 25,
    time: "5 min",
    description: "Premium comfort experience",
    multiplier: 2.2,
  },
  {
    id: "ev",
    name: "Electric",
    icon: Leaf,
    basePrice: 30,
    perKm: 14,
    time: "4 min",
    description: "Eco-friendly rides",
    multiplier: 1.2,
  },
];

interface BookingPanelProps {
  onBack: () => void;
}

const BookingPanel = ({ onBack }: BookingPanelProps) => {
  const [pickup, setPickup] = useState<Location | null>(null);
  const [dropoff, setDropoff] = useState<Location | null>(null);
  const [pickupText, setPickupText] = useState("");
  const [dropoffText, setDropoffText] = useState("");
  const [selectedRide, setSelectedRide] = useState("economy");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("");
  const [selectMode, setSelectMode] = useState<'pickup' | 'dropoff' | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number; fare: number } | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedPlatformFare, setSelectedPlatformFare] = useState<number | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [mainRoute, setMainRoute] = useState<RouteData | null>(null);
  const [altRoute, setAltRoute] = useState<RouteData | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<'main' | 'alt'>('main');
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState<LocationSuggestion[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<LocationSuggestion[]>([]);
  
  const pickupRef = useRef<HTMLDivElement>(null);
  const dropoffRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const pickupBaseSuggestions = searchJabalpurLocations(pickupText).map(mapLocalSuggestion);
  const dropoffBaseSuggestions = searchJabalpurLocations(dropoffText).map(mapLocalSuggestion);

  const finalPickupSuggestions = mergeSuggestions(pickupBaseSuggestions, pickupSuggestions);
  const finalDropoffSuggestions = mergeSuggestions(dropoffBaseSuggestions, dropoffSuggestions);

  // Fetch live suggestions based on input
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      const suggestions = await searchLiveLocations(pickupText);
      if (!cancelled) setPickupSuggestions(suggestions);
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pickupText]);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      const suggestions = await searchLiveLocations(dropoffText);
      if (!cancelled) setDropoffSuggestions(suggestions);
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [dropoffText]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickupRef.current && !pickupRef.current.contains(event.target as Node)) {
        setShowPickupSuggestions(false);
      }
      if (dropoffRef.current && !dropoffRef.current.contains(event.target as Node)) {
        setShowDropoffSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPickupSuggestion = async (location: LocationSuggestion) => {
    setPickupText(location.fullAddress);
    setShowPickupSuggestions(false);
    const accurate = await resolveAccurateLocation(location);
    setPickup({
      lat: accurate.lat,
      lng: accurate.lng,
      address: accurate.fullAddress,
    });
    setPickupText(accurate.fullAddress);
  };

  const handleSelectDropoffSuggestion = async (location: LocationSuggestion) => {
    setDropoffText(location.fullAddress);
    setShowDropoffSuggestions(false);
    const accurate = await resolveAccurateLocation(location);
    setDropoff({
      lat: accurate.lat,
      lng: accurate.lng,
      address: accurate.fullAddress,
    });
    setDropoffText(accurate.fullAddress);
  };

  const handlePickupChange = (location: Location | null) => {
    setPickup(location);
    if (location) {
      setPickupText(location.address);
    }
    setSelectMode(null);
  };

  const handleDropoffChange = (location: Location | null) => {
    setDropoff(location);
    if (location) {
      setDropoffText(location.address);
    }
    setSelectMode(null);
  };

  const handleRouteCalculated = useCallback((distance: number, duration: number, fare: number) => {
    // Keep a stable base fare from route service and derive ride/platform fares from it.
    setRouteInfo({ distance, duration, fare });
    setSelectedPlatform(null);
    setSelectedPlatformFare(null);
  }, []);

  const handleRoutesReady = useCallback((main: RouteData, alt: RouteData) => {
    setMainRoute(main);
    setAltRoute(alt);
    setSelectedRoute('main');
  }, []);

  const handleSelectRoute = (route: 'main' | 'alt') => {
    setSelectedRoute(route);
    const info = route === 'main' ? mainRoute : altRoute;
    if (info) {
      setRouteInfo({ distance: info.distance, duration: info.duration, fare: info.fare });
      setSelectedPlatform(null);
      setSelectedPlatformFare(null);
    }
  };

  const trafficColor = (level: string) => level === 'heavy' ? 'text-red-500' : level === 'moderate' ? 'text-yellow-500' : 'text-green-500';
  const trafficBg = (level: string) => level === 'heavy' ? 'bg-red-500/10 border-red-500/30' : level === 'moderate' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-green-500/10 border-green-500/30';

  const calculateFare = () => {
    if (!routeInfo) return null;
    if (selectedPlatformFare !== null) return selectedPlatformFare;
    const selectedOption = rideOptions.find(r => r.id === selectedRide);
    return Math.round(routeInfo.fare * (selectedOption?.multiplier || 1));
  };

  useEffect(() => {
    const currentFare = calculateFare();
    const base = currentFare || routeInfo?.fare || 180;
    const prices = {
      Uber: Math.round(base * 1.12),
      Ola: Math.round(base * 1.05),
      Rapido: Math.round(base * 0.94),
    };
    const selectedRouteData = selectedRoute === "main" ? mainRoute : altRoute;

    const context = {
      pickupAddress: pickup?.address ?? null,
      dropoffAddress: dropoff?.address ?? null,
      pickupLat: pickup?.lat ?? null,
      pickupLng: pickup?.lng ?? null,
      dropoffLat: dropoff?.lat ?? null,
      dropoffLng: dropoff?.lng ?? null,
      distance: routeInfo?.distance ?? null,
      duration: routeInfo?.duration ?? null,
      rideType: selectedRide,
      currentFare: currentFare ?? null,
      prices,
      selectedPlatform: selectedPlatform ?? null,
      selectedRoute,
      routeTrafficLevel: selectedRouteData?.trafficLevel ?? null,
      routeSignals: selectedRouteData?.trafficSignals ?? null,
      routeRedSignals: selectedRouteData?.redSignals ?? null,
      rideDetails: rideOptions.map((opt) => ({
        id: opt.id,
        name: opt.name,
        description: opt.description,
        basePrice: opt.basePrice,
        perKm: opt.perKm,
        etaText: opt.time,
        multiplier: opt.multiplier,
      })),
      updatedAt: Date.now(),
    };

    localStorage.setItem("ride_context", JSON.stringify(context));

  }, [routeInfo, selectedRide, selectedPlatform, selectedPlatformFare, selectedRoute, mainRoute, altRoute, pickup, dropoff]);

  const handleRideNowClick = () => {
    setIsScheduled(false);

    if (routeInfo?.distance && routeInfo?.duration && pickup && dropoff) {
      window.dispatchEvent(
        new CustomEvent("ride-context-updated", {
          detail: {
            autoOpenAssistant: true,
            nudgeOnly: true,
            signature: `${pickup.address}|${dropoff.address}|${routeInfo.distance}|${routeInfo.duration}|${selectedRide}|${selectedPlatform ?? "none"}|${selectedRoute}`,
          },
        })
      );
    }
  };

  const handlePlatformSelect = (platformId: string, fare: number) => {
    setSelectedPlatform(platformId);
    setSelectedPlatformFare(fare);
  };

  const handleConfirmRide = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book a ride.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!pickup || !dropoff) {
      toast({
        title: "Missing Locations",
        description: "Please select pickup and dropoff locations.",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);

    try {
      const fare = calculateFare();
      const { error } = await supabase.from('trips').insert({
        rider_id: user.id,
        pickup_address: pickup.address,
        pickup_lat: pickup.lat,
        pickup_lng: pickup.lng,
        dropoff_address: dropoff.address,
        dropoff_lat: dropoff.lat,
        dropoff_lng: dropoff.lng,
        distance_km: routeInfo?.distance,
        fare: fare,
        ride_type: selectedPlatform ? `${selectedRide}-${selectedPlatform}` : selectedRide,
        status: 'pending',
        scheduled_at: isScheduled && scheduleTime ? new Date(scheduleTime).toISOString() : null,
      });

      if (error) throw error;

      toast({
        title: "Ride Booked!",
        description: `Your ${selectedRide} ride has been confirmed. Fare: ₹${fare}`,
      });

      // Reset form
      setPickup(null);
      setDropoff(null);
      setPickupText("");
      setDropoffText("");
      setRouteInfo(null);
      setSelectedPlatform(null);
      setSelectedPlatformFare(null);
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <section className="min-h-screen py-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] bg-[size:60px_60px] opacity-8 dark:opacity-20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
      
      <div className="container relative z-10 px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Booking form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button variant="ghost" className="mb-6" onClick={onBack}>
              ← Back to Home
            </Button>
            
            <Card variant="glass" className="p-6">
              <h2 className="text-2xl font-bold mb-6">Book Your Ride</h2>
              
              {/* Location inputs */}
              <div className="space-y-4 mb-6 relative">
                {/* Pickup input with autocomplete */}
                <div className="relative" ref={pickupRef}>
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 z-10" />
                  <Input
                    placeholder="Search pickup in Jabalpur..."
                    value={pickupText}
                    onChange={(e) => {
                      setPickupText(e.target.value);
                      setPickup(null);
                      setMainRoute(null);
                      setAltRoute(null);
                      setRouteInfo(null);
                      setSelectedPlatform(null);
                      setSelectedPlatformFare(null);
                      setShowPickupSuggestions(true);
                    }}
                    onFocus={() => setShowPickupSuggestions(true)}
                    className="pl-12 pr-24"
                  />
                  <Button
                    variant={selectMode === 'pickup' ? 'default' : 'ghost'}
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                    onClick={() => setSelectMode(selectMode === 'pickup' ? null : 'pickup')}
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectMode === 'pickup' ? 'Selecting...' : 'Map'}
                  </Button>
                  
                  {/* Pickup suggestions dropdown */}
                  <AnimatePresence>
                    {showPickupSuggestions && finalPickupSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
                      >
                        {finalPickupSuggestions.map((location, index) => (
                          <button
                            key={`${location.name}-${index}`}
                            className="w-full px-4 py-3 text-left hover:bg-muted/50 flex items-start gap-3 border-b border-border/50 last:border-0 transition-colors"
                            onClick={() => handleSelectPickupSuggestion(location)}
                          >
                            <MapPin className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-sm">{location.name}</p>
                              <p className="text-xs text-muted-foreground">{location.area} • {location.fullAddress}</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Dropoff input with autocomplete */}
                <div className="relative" ref={dropoffRef}>
                  <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500 z-10" />
                  <Input
                    placeholder="Search destination in Jabalpur..."
                    value={dropoffText}
                    onChange={(e) => {
                      setDropoffText(e.target.value);
                      setDropoff(null);
                      setMainRoute(null);
                      setAltRoute(null);
                      setRouteInfo(null);
                      setSelectedPlatform(null);
                      setSelectedPlatformFare(null);
                      setShowDropoffSuggestions(true);
                    }}
                    onFocus={() => setShowDropoffSuggestions(true)}
                    className="pl-12 pr-24"
                  />
                  <Button
                    variant={selectMode === 'dropoff' ? 'default' : 'ghost'}
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                    onClick={() => setSelectMode(selectMode === 'dropoff' ? null : 'dropoff')}
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    {selectMode === 'dropoff' ? 'Selecting...' : 'Map'}
                  </Button>
                  
                  {/* Dropoff suggestions dropdown */}
                  <AnimatePresence>
                    {showDropoffSuggestions && finalDropoffSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
                      >
                        {finalDropoffSuggestions.map((location, index) => (
                          <button
                            key={`${location.name}-${index}`}
                            className="w-full px-4 py-3 text-left hover:bg-muted/50 flex items-start gap-3 border-b border-border/50 last:border-0 transition-colors"
                            onClick={() => handleSelectDropoffSuggestion(location)}
                          >
                            <Navigation className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-sm">{location.name}</p>
                              <p className="text-xs text-muted-foreground">{location.area} • {location.fullAddress}</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Connecting line */}
                <div className="absolute left-[2.15rem] top-[1.5rem] w-0.5 h-8 bg-gradient-to-b from-green-500 to-red-500" />
              </div>
              
              {/* Schedule toggle */}
              <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-muted/50">
                <Button
                  variant={!isScheduled ? "default" : "ghost"}
                  size="sm"
                  onClick={handleRideNowClick}
                  className="flex-1"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Ride Now
                </Button>
                <Button
                  variant={isScheduled ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setIsScheduled(true)}
                  className="flex-1"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
              </div>
              
              {isScheduled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-6"
                >
                  <Input 
                    type="datetime-local" 
                    className="w-full" 
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </motion.div>
              )}
              
              {/* Ride options */}
              <div className="space-y-3 mb-6">
                <h3 className="text-sm font-medium text-muted-foreground">Select Ride Type</h3>
                {rideOptions.map((option) => {
                  const optionFare = routeInfo 
                    ? Math.round(routeInfo.fare * option.multiplier)
                    : null;
                  
                  return (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        variant={selectedRide === option.id ? "glow" : "default"}
                        className={`p-4 cursor-pointer transition-all ${
                          selectedRide === option.id ? "border-primary" : ""
                        }`}
                        onClick={() => {
                          setSelectedRide(option.id);
                          setSelectedPlatform(null);
                          setSelectedPlatformFare(null);
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            selectedRide === option.id ? "bg-primary/20" : "bg-muted"
                          }`}>
                            <option.icon className={`w-6 h-6 ${
                              selectedRide === option.id ? "text-primary" : "text-muted-foreground"
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">{option.name}</span>
                              <span className="font-bold text-primary flex items-center">
                                <IndianRupee className="w-4 h-4" />
                                {optionFare || `${option.basePrice}+`}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>{option.description}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {option.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Route summary */}
              {routeInfo && (
                <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Distance</p>
                      <p className="font-bold">{routeInfo.distance} km</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-bold">{routeInfo.duration} min</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fare</p>
                      <p className="font-bold text-accent flex items-center">
                        <IndianRupee className="w-4 h-4" />
                        {calculateFare()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Traffic Prediction Panel */}
              {mainRoute && altRoute && (
                <div className="mb-6 space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Route className="w-4 h-4" />
                    Route & Traffic Prediction
                  </h3>
                  
                  {/* Main Route */}
                  <button
                    onClick={() => handleSelectRoute('main')}
                    className={`w-full text-left rounded-lg border p-4 transition-all ${
                      selectedRoute === 'main' 
                        ? 'border-red-500/50 bg-red-500/10' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-sm font-semibold">Main Route</span>
                      </div>
                      {selectedRoute === 'main' && <CheckCircle className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex items-center gap-3 text-xs mb-2">
                      <span>{mainRoute.distance} km</span>
                      <span>•</span>
                      <span>{mainRoute.duration} min</span>
                      <span>•</span>
                      <span className="font-semibold">₹{mainRoute.fare}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs ${trafficBg(mainRoute.trafficLevel)}`}>
                      <AlertTriangle className={`w-3.5 h-3.5 ${trafficColor(mainRoute.trafficLevel)}`} />
                      <span className={`font-medium ${trafficColor(mainRoute.trafficLevel)}`}>
                        {mainRoute.trafficLevel === 'heavy' ? 'Heavy Traffic' : mainRoute.trafficLevel === 'moderate' ? 'Moderate Traffic' : 'Light Traffic'}
                      </span>
                      <span className="text-muted-foreground">• {mainRoute.redSignals} 🔴 {mainRoute.trafficSignals - mainRoute.redSignals} 🟢</span>
                    </div>
                  </button>

                  {/* Alternative Route */}
                  <button
                    onClick={() => handleSelectRoute('alt')}
                    className={`w-full text-left rounded-lg border p-4 transition-all ${
                      selectedRoute === 'alt' 
                        ? 'border-green-500/50 bg-green-500/10' 
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm font-semibold">Alternate Route</span>
                        <span className="px-1.5 py-0.5 bg-green-500/20 text-green-500 text-[10px] font-bold rounded">RECOMMENDED</span>
                      </div>
                      {selectedRoute === 'alt' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                    <div className="flex items-center gap-3 text-xs mb-2">
                      <span>{altRoute.distance} km</span>
                      <span>•</span>
                      <span>{altRoute.duration} min</span>
                      <span>•</span>
                      <span className="font-semibold">₹{altRoute.fare}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs ${trafficBg(altRoute.trafficLevel)}`}>
                      <Route className={`w-3.5 h-3.5 ${trafficColor(altRoute.trafficLevel)}`} />
                      <span className={`font-medium ${trafficColor(altRoute.trafficLevel)}`}>
                        {altRoute.trafficLevel === 'heavy' ? 'Heavy Traffic' : altRoute.trafficLevel === 'moderate' ? 'Moderate Traffic' : 'Clear Road'}
                      </span>
                      <span className="text-muted-foreground">• {altRoute.redSignals} 🔴 {altRoute.trafficSignals - altRoute.redSignals} 🟢</span>
                    </div>
                    {mainRoute.duration > altRoute.duration && (
                      <p className="mt-2 text-xs text-green-500 font-medium">
                        ⚡ Save {mainRoute.duration - altRoute.duration} min — Less traffic, fewer red signals!
                      </p>
                    )}
                  </button>
                </div>
              )}
              
              {/* Platform Price Comparison */}
              {routeInfo && (
                <div className="mb-6">
                  <RideCompare
                    distanceKm={routeInfo.distance}
                    durationMin={routeInfo.duration}
                    rideType={selectedRide}
                    onSelectPlatform={handlePlatformSelect}
                  />
                </div>
              )}

              <Button 
                variant="hero" 
                size="xl" 
                className="w-full"
                onClick={handleConfirmRide}
                disabled={!pickup || !dropoff || isBooking}
              >
                {isBooking ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Confirm Ride
                    {calculateFare() && <span className="ml-2">• ₹{calculateFare()}</span>}
                  </>
                )}
              </Button>
            </Card>
          </motion.div>
          
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="sticky top-24 h-[600px] rounded-xl overflow-hidden border border-border/50"
          >
            <IndiaMap
              pickup={pickup}
              dropoff={dropoff}
              onPickupChange={handlePickupChange}
              onDropoffChange={handleDropoffChange}
              onRouteCalculated={handleRouteCalculated}
              onRoutesReady={handleRoutesReady}
              selectedRoute={selectedRoute}
              selectMode={selectMode}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BookingPanel;
