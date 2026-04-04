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

const simulateTraffic = (coordinates: [number, number][], distanceKm: number): Omit<RouteData, 'coordinates' | 'distance' | 'fare'> => {
  const hour = new Date().getHours();
  const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20) || (hour >= 12 && hour <= 14);
  
  const totalSignals = Math.max(2, Math.floor(distanceKm * 1.8));
  const redRatio = isPeakHour ? 0.7 : 0.35;
  const redSignals = Math.floor(totalSignals * redRatio);
  
  const trafficLevel: 'low' | 'moderate' | 'heavy' = isPeakHour ? 'heavy' : (distanceKm > 5 ? 'moderate' : 'low');
  
  const trafficDelayMin = trafficLevel === 'heavy' ? distanceKm * 1.5 : trafficLevel === 'moderate' ? distanceKm * 0.7 : distanceKm * 0.2;
  const signalDelayMin = redSignals * 1.2;
  const baseDuration = distanceKm * 2.5;
  const duration = Math.round(baseDuration + trafficDelayMin + signalDelayMin);
  
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

const buildRouteData = (route: any): RouteData | null => {
  if (!route?.geometry?.coordinates?.length) return null;

  const coordinates: [number, number][] = route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
  const distanceKm = Math.round((route.distance / 1000) * 10) / 10;

  // Use routing-engine duration as baseline, then layer simulated signal/traffic behavior
  const baseDurationMinutes = Math.max(1, Math.round(route.duration / 60));
  const traffic = simulateTraffic(coordinates, distanceKm);
  const normalizedDuration = Math.max(baseDurationMinutes, traffic.duration);

  const fare = Math.round(
    FARE_RATES.baseFare + (distanceKm * FARE_RATES.perKm) + (normalizedDuration * FARE_RATES.perMinute)
  );

  return {
    coordinates,
    distance: distanceKm,
    duration: normalizedDuration,
    fare,
    trafficLevel: traffic.trafficLevel,
    trafficSignals: traffic.trafficSignals,
    redSignals: traffic.redSignals,
    congestionPoints: traffic.congestionPoints,
  };
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
  const selectModeRef = useRef<IndiaMapProps['selectMode']>(selectMode);
  const pickupChangeRef = useRef(onPickupChange);
  const dropoffChangeRef = useRef(onDropoffChange);

  useEffect(() => {
    selectModeRef.current = selectMode;
  }, [selectMode]);

  useEffect(() => {
    pickupChangeRef.current = onPickupChange;
    dropoffChangeRef.current = onDropoffChange;
  }, [onPickupChange, onDropoffChange]);

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

    L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      attribution: '&copy; Google Maps',
      maxZoom: 20,
    }).addTo(map.current);

    map.current.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const currentMode = selectModeRef.current;
      if (!currentMode) return;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        const location = { lat, lng, address };
        if (currentMode === 'pickup') pickupChangeRef.current?.(location);
        else if (currentMode === 'dropoff') dropoffChangeRef.current?.(location);
      } catch {
        const location = { lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` };
        if (currentMode === 'pickup') pickupChangeRef.current?.(location);
        else if (currentMode === 'dropoff') dropoffChangeRef.current?.(location);
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
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=full&geometries=geojson&alternatives=true`
        );
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          clearRouteVisuals();

          const mainRouteData = buildRouteData(data.routes[0]);
          if (!mainRouteData) {
            return;
          }

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

          const rawAltRoute = data.routes[1];
          const altRouteData = buildRouteData(rawAltRoute) ?? mainRouteData;
          altRouteRef.current = altRouteData;

          if (rawAltRoute && altRouteData !== mainRouteData) {
            altRouteLine.current = L.polyline(altRouteData.coordinates, {
              color: '#22c55e',
              weight: 4,
              opacity: 0.7,
              lineCap: 'round',
              lineJoin: 'round',
              dashArray: '12, 8',
            }).addTo(map.current!);
          }

          map.current!.fitBounds(routeLine.current.getBounds(), { padding: [60, 60] });

          onRouteCalculated?.(mainRouteData.distance, mainRouteData.duration, mainRouteData.fare);
          onRoutesReady?.(mainRouteData, altRouteData);
        }
      } catch (error) {
        console.error('Error calculating route:', error);
        clearRouteVisuals();
        mainRouteRef.current = null;
        altRouteRef.current = null;

        const R = 6371;
        const dLat = (dropoff.lat - pickup.lat) * Math.PI / 180;
        const dLon = (dropoff.lng - pickup.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(pickup.lat * Math.PI / 180) * Math.cos(dropoff.lat * Math.PI / 180) * Math.sin(dLon/2)**2;
        const distanceKm = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 1.2 * 10) / 10;
        const duration = Math.round(distanceKm * 3);
        const fare = Math.round(FARE_RATES.baseFare + (distanceKm * FARE_RATES.perKm) + (duration * FARE_RATES.perMinute));

        // Keep fare/time estimate but avoid drawing synthetic non-road paths
        onRouteCalculated?.(distanceKm, duration, fare);
      }
    };

    calculateRoute();
  }, [pickup, dropoff]);

  // Handle route switching from parent
  useEffect(() => {
    if (!map.current) return;
    
    if (selectedRoute === 'main' || !altRouteLine.current || !altRouteRef.current) {
      routeLine.current?.setStyle({ opacity: 0.9, weight: 5 });
      glowLine.current?.setStyle({ opacity: 0.2 });
      altRouteLine.current?.setStyle({ opacity: 0.4, weight: 3 });
      if (mainRouteRef.current) {
        drawTrafficOnMap(mainRouteRef.current);
        onRouteCalculated?.(mainRouteRef.current.distance, mainRouteRef.current.duration, mainRouteRef.current.fare);
      }
      return;
    }

    routeLine.current?.setStyle({ opacity: 0.4, weight: 3 });
    glowLine.current?.setStyle({ opacity: 0.1 });
    altRouteLine.current?.setStyle({ opacity: 0.9, weight: 5 });
    drawTrafficOnMap(altRouteRef.current);
    onRouteCalculated?.(altRouteRef.current.distance, altRouteRef.current.duration, altRouteRef.current.fare);
  }, [selectedRoute, onRouteCalculated]);

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
