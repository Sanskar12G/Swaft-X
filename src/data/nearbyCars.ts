// Nearby cars data for Jabalpur with different categories

export type CarCategory = 'sedan' | 'hatchback' | 'muv' | 'suv';

export interface NearbyCarInfo {
  id: string;
  driverName: string;
  driverRating: number;
  carModel: string;
  carNumber: string;
  category: CarCategory;
  lat: number;
  lng: number;
  color: string;
  priceMultiplier: number;
  seatingCapacity: number;
  features: string[];
  photo: string;
  eta: number; // in minutes
}

// Car category icons (SVG paths)
export const carCategoryIcons: Record<CarCategory, { svg: string; color: string; label: string }> = {
  hatchback: {
    label: 'Hatchback',
    color: '#22c55e', // green
    svg: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M16 6l3 4h2c.55 0 1 .45 1 1v3h-2.1c-.17-1.69-1.59-3-3.3-3s-3.13 1.31-3.3 3H9.4c-.17-1.69-1.59-3-3.3-3s-3.13 1.31-3.3 3H1v-3c0-.55.45-1 1-1h2l3-4h9zm-9.5 9c-.83 0-1.5.67-1.5 1.5S5.67 18 6.5 18s1.5-.67 1.5-1.5S7.33 15 6.5 15zm10 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM7 7l-2 3h5V7H7zm5 0v3h4l-2-3h-2z"/></svg>`
  },
  sedan: {
    label: 'Sedan',
    color: '#3b82f6', // blue
    svg: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`
  },
  muv: {
    label: 'MUV',
    color: '#f59e0b', // amber
    svg: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17 5H3c-1.1 0-2 .89-2 2v9h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-6zM6 17.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm12 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM17 12V7h2l2 5h-4z"/></svg>`
  },
  suv: {
    label: 'SUV',
    color: '#8b5cf6', // purple
    svg: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.92 5.01C18.72 4.42 18.16 4 17.5 4H15V3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v1H6.5c-.66 0-1.21.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 15c-.83 0-1.5-.67-1.5-1.5S5.67 12 6.5 12s1.5.67 1.5 1.5S7.33 15 6.5 15zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z"/></svg>`
  }
};

// Generate nearby cars around a location
export function generateNearbyCars(centerLat: number, centerLng: number): NearbyCarInfo[] {
  const cars: NearbyCarInfo[] = [
    // Sedans
    {
      id: 'sedan-1',
      driverName: 'Rajesh Kumar',
      driverRating: 4.8,
      carModel: 'Maruti Dzire',
      carNumber: 'MP 20 AB 1234',
      category: 'sedan',
      lat: centerLat + 0.003,
      lng: centerLng + 0.002,
      color: 'White',
      priceMultiplier: 1.0,
      seatingCapacity: 4,
      features: ['AC', 'Music System', 'GPS'],
      photo: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300',
      eta: 3
    },
    {
      id: 'sedan-2',
      driverName: 'Amit Sharma',
      driverRating: 4.6,
      carModel: 'Honda Amaze',
      carNumber: 'MP 20 CD 5678',
      category: 'sedan',
      lat: centerLat - 0.004,
      lng: centerLng + 0.003,
      color: 'Silver',
      priceMultiplier: 1.1,
      seatingCapacity: 4,
      features: ['AC', 'Music System', 'Leather Seats'],
      photo: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=300',
      eta: 5
    },
    {
      id: 'sedan-3',
      driverName: 'Suresh Verma',
      driverRating: 4.9,
      carModel: 'Hyundai Aura',
      carNumber: 'MP 20 EF 9012',
      category: 'sedan',
      lat: centerLat + 0.002,
      lng: centerLng - 0.004,
      color: 'Blue',
      priceMultiplier: 1.0,
      seatingCapacity: 4,
      features: ['AC', 'USB Charging', 'GPS'],
      photo: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=300',
      eta: 4
    },
    // Hatchbacks
    {
      id: 'hatch-1',
      driverName: 'Vikram Singh',
      driverRating: 4.5,
      carModel: 'Maruti Swift',
      carNumber: 'MP 20 GH 3456',
      category: 'hatchback',
      lat: centerLat - 0.002,
      lng: centerLng - 0.003,
      color: 'Red',
      priceMultiplier: 0.85,
      seatingCapacity: 4,
      features: ['AC', 'Music System'],
      photo: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=300',
      eta: 2
    },
    {
      id: 'hatch-2',
      driverName: 'Pradeep Yadav',
      driverRating: 4.7,
      carModel: 'Hyundai i20',
      carNumber: 'MP 20 IJ 7890',
      category: 'hatchback',
      lat: centerLat + 0.005,
      lng: centerLng - 0.002,
      color: 'White',
      priceMultiplier: 0.9,
      seatingCapacity: 4,
      features: ['AC', 'Music System', 'Sunroof'],
      photo: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=300',
      eta: 4
    },
    {
      id: 'hatch-3',
      driverName: 'Manoj Tiwari',
      driverRating: 4.4,
      carModel: 'Tata Altroz',
      carNumber: 'MP 20 KL 1234',
      category: 'hatchback',
      lat: centerLat - 0.003,
      lng: centerLng + 0.005,
      color: 'Grey',
      priceMultiplier: 0.88,
      seatingCapacity: 4,
      features: ['AC', 'USB Charging'],
      photo: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=300',
      eta: 3
    },
    // MUVs
    {
      id: 'muv-1',
      driverName: 'Santosh Patel',
      driverRating: 4.7,
      carModel: 'Maruti Ertiga',
      carNumber: 'MP 20 MN 5678',
      category: 'muv',
      lat: centerLat + 0.004,
      lng: centerLng + 0.004,
      color: 'Silver',
      priceMultiplier: 1.3,
      seatingCapacity: 7,
      features: ['AC', 'Music System', 'Third Row Seating'],
      photo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300',
      eta: 6
    },
    {
      id: 'muv-2',
      driverName: 'Dinesh Gupta',
      driverRating: 4.6,
      carModel: 'Toyota Innova',
      carNumber: 'MP 20 OP 9012',
      category: 'muv',
      lat: centerLat - 0.005,
      lng: centerLng - 0.001,
      color: 'White',
      priceMultiplier: 1.5,
      seatingCapacity: 7,
      features: ['AC', 'Premium Interior', 'GPS', 'USB Charging'],
      photo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300',
      eta: 7
    },
    // SUVs
    {
      id: 'suv-1',
      driverName: 'Rahul Joshi',
      driverRating: 4.9,
      carModel: 'Mahindra XUV700',
      carNumber: 'MP 20 QR 3456',
      category: 'suv',
      lat: centerLat + 0.001,
      lng: centerLng + 0.006,
      color: 'Black',
      priceMultiplier: 1.8,
      seatingCapacity: 7,
      features: ['AC', 'Premium Sound', 'Sunroof', 'ADAS', 'GPS'],
      photo: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=300',
      eta: 5
    },
    {
      id: 'suv-2',
      driverName: 'Arun Mishra',
      driverRating: 4.8,
      carModel: 'Tata Harrier',
      carNumber: 'MP 20 ST 7890',
      category: 'suv',
      lat: centerLat - 0.006,
      lng: centerLng + 0.002,
      color: 'Blue',
      priceMultiplier: 1.7,
      seatingCapacity: 5,
      features: ['AC', 'Panoramic Sunroof', 'JBL Sound', 'GPS'],
      photo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300',
      eta: 8
    },
    {
      id: 'suv-3',
      driverName: 'Karan Singh',
      driverRating: 4.7,
      carModel: 'Hyundai Creta',
      carNumber: 'MP 20 UV 1234',
      category: 'suv',
      lat: centerLat + 0.003,
      lng: centerLng - 0.005,
      color: 'Red',
      priceMultiplier: 1.6,
      seatingCapacity: 5,
      features: ['AC', 'Ventilated Seats', 'Bose Sound', 'GPS'],
      photo: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=300',
      eta: 4
    }
  ];
  
  return cars;
}

// Default Jabalpur center coordinates
export const JABALPUR_CENTER = {
  lat: 23.1815,
  lng: 79.9864
};
