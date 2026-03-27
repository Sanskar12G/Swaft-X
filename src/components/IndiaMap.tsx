import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { JABALPUR_CENTER } from '@/data/nearbyCars';

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface RouteData {
  coordinates: [number, number][];
  distance: number;
  duration: number;
  fare: number;
  trafficLevel: 'low' | 'moderate' | 'heavy';
  trafficSignals: number;
  redSignals: number;
  congestionPoints: { lat: number; lng: number; level: 'moderate' | 'heavy' }[];
}

interface IndiaMapProps {
  pickup?: Location | null;
  dropoff?: Location | null;
  onPickupChange?: (location: Location | null) => void;
  onDropoffChange?: (location: Location | null) => void;
  onRouteCalculated?: (distance: number, duration: number, fare: number) => void;
  onRoutesReady?: (mainRoute: RouteData, altRoute: RouteData) => void;
  selectedRoute?: 'main' | 'alt';
  selectMode?: 'pickup' | 'dropoff' | null;
}

// Custom marker icons
const pickupIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `<div style="background: linear-gradient(135deg, #10b981, #059669); width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3);"></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const dropoffIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `<div style="background: linear-gradient(135deg, #ef4444, #dc2626); width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3);"></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const createTrafficSignalIcon = (isRed: boolean) => new L.DivIcon({
  className: 'traffic-signal-marker',
  html: `<div style="width: 20px; height: 20px; border-radius: 50%; background: ${isRed ? '#ef4444' : '#22c55e'}; border: 2px solid ${isRed ? '#991b1b' : '#166534'}; box-shadow: 0 0 8px ${isRed ? 'rgba(239,68,68,0.5)' : 'rgba(34,197,94,0.4)'}; display: flex; align-items: center; justify-content: center;">
    <div style="width: 6px; height: 6px; border-radius: 50%; background: white; opacity: 0.9;"></div>
  </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const FARE_RATES = {
  baseFare: 25,
  perKm: 12,
  perMinute: 1.5,
  surgeFactor: 1.0,
};

interface RoutingApiRoute {
  coordinates: [number, number][];
  distanceMeters: number;
  durationSeconds: number;
}

interface OrsFeature {
  geometry: {
    coordinates: [number, number][];
  };
  properties: {
    summary: {
      distance: number;
      duration: number;
    };
  };
}

interface OsrmRoute {
  geometry: {
    coordinates: [number, number][];
  };
  distance: number;
  duration: number;
}

const simulateTraffic = (
  coordinates: [number, number][],
  distanceKm: number,
  baseDurationMin: number
): Omit<RouteData, 'coordinates' | 'distance' | 'fare'> => {
  const hour = new Date().getHours();
  const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20) || (hour >= 12 && hour <= 14);
  
  const totalSignals = Math.max(2, Math.floor(distanceKm * 1.8));
  const redRatio = isPeakHour ? 0.7 : 0.35;
  const redSignals = Math.floor(totalSignals * redRatio);
  
  const trafficLevel: 'low' | 'moderate' | 'heavy' = isPeakHour ? 'heavy' : (distanceKm > 5 ? 'moderate' : 'low');
  
  const duration = Math.max(1, Math.round(baseDurationMin));
  
  const congestionPoints: { lat: number; lng: number; level: 'moderate' | 'heavy' }[] = [];
  const step = Math.max(1, Math.floor(coordinates.length / (isPeakHour ? 4 : 6)));
  for (let i = step; i < coordinates.length - step; i += step) {
    if (Math.random() < (isPeakHour ? 0.8 : 0.4)) {
      congestionPoints.push({
        lat: coordinates[i][0],
        lng: coordinates[i][1],
        level: Math.random() > 0.5 ? 'heavy' : 'moderate',
      });
    }
  }
  
  return { duration, trafficLevel, trafficSignals: totalSignals, redSignals, congestionPoints };
};

const generateAlternativeRoute = (
  coordinates: [number, number][],
  distanceKm: number,
  durationMin: number
): RouteData => {
  const offset = 0.005 + Math.random() * 0.008;
  const direction = Math.random() > 0.5 ? 1 : -1;
  
  const altCoords: [number, number][] = coordinates.map((coord, i) => {
    const progress = i / coordinates.length;
    const bulge = Math.sin(progress * Math.PI);
    return [
      coord[0] + offset * bulge * direction,
      coord[1] + offset * bulge * direction * 0.7,
    ];
  });
  
  const altDistance = Math.round((distanceKm * (1.05 + Math.random() * 0.15)) * 10) / 10;
  const traffic = simulateTraffic(altCoords, altDistance, Math.round(durationMin * 1.1));
  
  const betterTraffic = {
    ...traffic,
    trafficLevel: 'low' as const,
    redSignals: Math.max(0, traffic.redSignals - Math.floor(traffic.redSignals * 0.6)),
    duration: Math.round(traffic.duration * 0.65),
    congestionPoints: traffic.congestionPoints.slice(0, 1),
  };
  
  const fare = Math.round(
    FARE_RATES.baseFare + (altDistance * FARE_RATES.perKm) + (betterTraffic.duration * FARE_RATES.perMinute)
  );
  
  return { coordinates: altCoords, distance: altDistance, fare, ...betterTraffic };
};

const toRouteData = (route: RoutingApiRoute): RouteData => {
  const distanceKm = Math.round((route.distanceMeters / 1000) * 10) / 10;
  const durationMin = Math.max(1, Math.round(route.durationSeconds / 60));
  const traffic = simulateTraffic(route.coordinates, distanceKm, durationMin);
  const fare = Math.round(
    FARE_RATES.baseFare + (distanceKm * FARE_RATES.perKm) + (traffic.duration * FARE_RATES.perMinute)
  );

  return {
    coordinates: route.coordinates,
    distance: distanceKm,
    duration: traffic.duration,
    fare,
    trafficLevel: traffic.trafficLevel,
    trafficSignals: traffic.trafficSignals,
    redSignals: traffic.redSignals,
    congestionPoints: traffic.congestionPoints,
  };
};

const fetchRoutes = async (pickup: Location, dropoff: Location): Promise<RoutingApiRoute[]> => {
  const orsApiKey = import.meta.env.VITE_ORS_API_KEY;

  if (orsApiKey) {
    const orsResponse = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
      method: 'POST',
      headers: {
        Authorization: orsApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinates: [
          [pickup.lng, pickup.lat],
          [dropoff.lng, dropoff.lat],
        ],
        alternative_routes: {
          target_count: 2,
          weight_factor: 1.6,
          share_factor: 0.6,
        },
      }),
    });

    if (orsResponse.ok) {
      const orsData = await orsResponse.json() as { features?: OrsFeature[] };
      const orsRoutes: RoutingApiRoute[] = (orsData.features || []).map((feature) => ({
        coordinates: feature.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as [number, number]),
        distanceMeters: feature.properties.summary.distance,
        durationSeconds: feature.properties.summary.duration,
      }));
      if (orsRoutes.length > 0) {
        return orsRoutes;
      }
    }
  }

  const osrmResponse = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=full&geometries=geojson&alternatives=true`
  );
  if (!osrmResponse.ok) {
    throw new Error('Failed to fetch route from OSRM');
  }
  const osrmData = await osrmResponse.json() as { routes?: OsrmRoute[] };

  const osrmRoutes: RoutingApiRoute[] = (osrmData.routes || []).map((route) => ({
    coordinates: route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as [number, number]),
    distanceMeters: route.distance,
    durationSeconds: route.duration,
  }));

  if (osrmRoutes.length === 0) {
    throw new Error('No routes returned by routing APIs');
  }

  return osrmRoutes;
};

const IndiaMap = ({ 
  pickup, 
  dropoff, 
  onPickupChange, 
  onDropoffChange, 
  onRouteCalculated,
  onRoutesReady,
  selectedRoute = 'main',
  selectMode 
}: IndiaMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const pickupMarker = useRef<L.Marker | null>(null);
  const dropoffMarker = useRef<L.Marker | null>(null);
  const routeLine = useRef<L.Polyline | null>(null);
  const glowLine = useRef<L.Polyline | null>(null);
  const altRouteLine = useRef<L.Polyline | null>(null);
  const trafficMarkers = useRef<L.Marker[]>([]);
  const congestionCircles = useRef<L.Circle[]>([]);
  const mainRouteRef = useRef<RouteData | null>(null);
  const altRouteRef = useRef<RouteData | null>(null);

  const clearRouteVisuals = () => {
    routeLine.current?.remove();
    routeLine.current = null;
    glowLine.current?.remove();
    glowLine.current = null;
    altRouteLine.current?.remove();
    altRouteLine.current = null;
    trafficMarkers.current.forEach(m => m.remove());
    trafficMarkers.current = [];
    congestionCircles.current.forEach(c => c.remove());
    congestionCircles.current = [];
  };

  const drawTrafficOnMap = (route: RouteData) => {
    if (!map.current) return;
    
    // Clear old traffic markers
    trafficMarkers.current.forEach(m => m.remove());
    trafficMarkers.current = [];
    congestionCircles.current.forEach(c => c.remove());
    congestionCircles.current = [];
    
    const signalStep = Math.max(1, Math.floor(route.coordinates.length / (route.trafficSignals + 1)));
    let signalCount = 0;
    for (let i = signalStep; i < route.coordinates.length - signalStep && signalCount < route.trafficSignals; i += signalStep) {
      const isRed = signalCount < route.redSignals;
      const marker = L.marker(route.coordinates[i], { icon: createTrafficSignalIcon(isRed) })
        .addTo(map.current)
        .bindPopup(`<div style="text-align:center"><strong>Traffic Signal</strong><br/><span style="color:${isRed ? '#ef4444' : '#22c55e'}; font-weight:bold">${isRed ? '🔴 RED' : '🟢 GREEN'}</span></div>`);
      trafficMarkers.current.push(marker);
      signalCount++;
    }
    
    route.congestionPoints.forEach(point => {
      const color = point.level === 'heavy' ? '#ef4444' : '#f59e0b';
      const circle = L.circle([point.lat, point.lng], {
        radius: 200,
        color,
        fillColor: color,
        fillOpacity: 0.15,
        weight: 2,
        opacity: 0.5,
      }).addTo(map.current!)
        .bindPopup(`<div style="text-align:center"><strong>⚠️ ${point.level === 'heavy' ? 'Heavy' : 'Moderate'} Traffic</strong></div>`);
      congestionCircles.current.push(circle);
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current, {
      zoomControl: false,
    }).setView([JABALPUR_CENTER.lat, JABALPUR_CENTER.lng], 13);

    L.control.zoom({ position: 'bottomright' }).addTo(map.current);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 20
    }).addTo(map.current);

    map.current.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        const location = { lat, lng, address };
        if (selectMode === 'pickup' && onPickupChange) onPickupChange(location);
        else if (selectMode === 'dropoff' && onDropoffChange) onDropoffChange(location);
      } catch {
        const location = { lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` };
        if (selectMode === 'pickup' && onPickupChange) onPickupChange(location);
        else if (selectMode === 'dropoff' && onDropoffChange) onDropoffChange(location);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update pickup marker
  useEffect(() => {
    if (!map.current) return;
    pickupMarker.current?.remove();
    pickupMarker.current = null;
    if (pickup) {
      pickupMarker.current = L.marker([pickup.lat, pickup.lng], { icon: pickupIcon })
        .addTo(map.current)
        .bindPopup(`<strong>Pickup</strong><br/>${pickup.address}`);
      map.current.setView([pickup.lat, pickup.lng], 14);
    }
  }, [pickup]);

  // Update dropoff marker
  useEffect(() => {
    if (!map.current) return;
    dropoffMarker.current?.remove();
    dropoffMarker.current = null;
    if (dropoff) {
      dropoffMarker.current = L.marker([dropoff.lat, dropoff.lng], { icon: dropoffIcon })
        .addTo(map.current)
        .bindPopup(`<strong>Dropoff</strong><br/>${dropoff.address}`);
    }
  }, [dropoff]);

  // Calculate and draw routes
  useEffect(() => {
    if (!map.current || !pickup || !dropoff) {
      clearRouteVisuals();
      mainRouteRef.current = null;
      altRouteRef.current = null;
      return;
    }

    const calculateRoute = async () => {
      try {
        const routes = await fetchRoutes(pickup, dropoff);
        if (routes.length > 0) {
          clearRouteVisuals();

          const mainRouteData = toRouteData(routes[0]);
          mainRouteRef.current = mainRouteData;

          const mainColor = mainRouteData.trafficLevel === 'heavy' ? '#ef4444' : mainRouteData.trafficLevel === 'moderate' ? '#f59e0b' : '#00e5ff';
          
          glowLine.current = L.polyline(mainRouteData.coordinates, {
            color: mainColor,
            weight: 14,
            opacity: 0.2,
            lineCap: 'round',
            lineJoin: 'round',
          }).addTo(map.current!);

          routeLine.current = L.polyline(mainRouteData.coordinates, {
            color: mainColor,
            weight: 5,
            opacity: 0.9,
            lineCap: 'round',
            lineJoin: 'round',
          }).addTo(map.current!);

          drawTrafficOnMap(mainRouteData);

          const altRouteData = routes[1]
            ? toRouteData(routes[1])
            : generateAlternativeRoute(mainRouteData.coordinates, mainRouteData.distance, mainRouteData.duration);
          altRouteRef.current = altRouteData;

          altRouteLine.current = L.polyline(altRouteData.coordinates, {
            color: '#22c55e',
            weight: 4,
            opacity: 0.7,
            lineCap: 'round',
            lineJoin: 'round',
            dashArray: '12, 8',
          }).addTo(map.current!);

          map.current!.fitBounds(routeLine.current.getBounds(), { padding: [60, 60] });

          onRouteCalculated?.(mainRouteData.distance, mainRouteData.duration, mainRouteData.fare);
          onRoutesReady?.(mainRouteData, altRouteData);
        }
      } catch (error) {
        console.error('Error calculating route:', error);
        clearRouteVisuals();
        
        const R = 6371;
        const dLat = (dropoff.lat - pickup.lat) * Math.PI / 180;
        const dLon = (dropoff.lng - pickup.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(pickup.lat * Math.PI / 180) * Math.cos(dropoff.lat * Math.PI / 180) * Math.sin(dLon/2)**2;
        const distanceKm = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 10) / 10;
        const duration = Math.round(distanceKm * 3);
        const fare = Math.round(FARE_RATES.baseFare + (distanceKm * FARE_RATES.perKm) + (duration * FARE_RATES.perMinute));

        routeLine.current = L.polyline(
          [[pickup.lat, pickup.lng], [dropoff.lat, dropoff.lng]],
          { color: '#f59e0b', weight: 4, opacity: 0.8, dashArray: '10, 10' }
        ).addTo(map.current!);

        const mainRouteData: RouteData = { coordinates: [[pickup.lat, pickup.lng], [dropoff.lat, dropoff.lng]], distance: distanceKm, duration, fare, trafficLevel: 'moderate', trafficSignals: 3, redSignals: 2, congestionPoints: [] };
        mainRouteRef.current = mainRouteData;
        onRouteCalculated?.(distanceKm, duration, fare);
      }
    };

    calculateRoute();
  }, [pickup, dropoff]);

  // Handle route switching from parent
  useEffect(() => {
    if (!map.current) return;
    
    if (selectedRoute === 'main') {
      routeLine.current?.setStyle({ opacity: 0.9, weight: 5 });
      glowLine.current?.setStyle({ opacity: 0.2 });
      altRouteLine.current?.setStyle({ opacity: 0.4, weight: 3 });
      if (mainRouteRef.current) drawTrafficOnMap(mainRouteRef.current);
    } else {
      routeLine.current?.setStyle({ opacity: 0.4, weight: 3 });
      glowLine.current?.setStyle({ opacity: 0.1 });
      altRouteLine.current?.setStyle({ opacity: 0.9, weight: 5 });
      if (altRouteRef.current) drawTrafficOnMap(altRouteRef.current);
    }
    
    const info = selectedRoute === 'main' ? mainRouteRef.current : altRouteRef.current;
    if (info) onRouteCalculated?.(info.distance, info.duration, info.fare);
  }, [selectedRoute]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-xl overflow-hidden" />

      {/* Selection mode indicator */}
      {selectMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-xl border border-primary/30 px-4 py-2 rounded-full z-[1000]">
          <div className="flex items-center gap-2">
            <MapPin className={`w-5 h-5 ${selectMode === 'pickup' ? 'text-green-500' : 'text-red-500'}`} />
            <span className="text-sm font-medium">
              Click on map to set {selectMode} location
            </span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/20 via-transparent to-background/10 rounded-xl" />
    </div>
  );
};

export default IndiaMap;
