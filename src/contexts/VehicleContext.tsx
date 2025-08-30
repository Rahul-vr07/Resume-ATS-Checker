import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateMockVehicles } from '../utils/mockData';

interface Vehicle {
  id: string;
  type: 'jeep' | 'bike' | 'shared';
  location: [number, number];
  heading: number;
  // Other vehicle properties
}

interface VehicleContextType {
  vehicles: Vehicle[];
  nearbyVehicles: (location: [number, number], radius?: number) => Vehicle[];
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  
  // Initialize with mock vehicles
  useEffect(() => {
    // Create 5 mock vehicles around Dehradun area
    const mockVehicles = [
      {
        id: 'v1',
        type: 'jeep' as const,
        location: [78.0322, 30.3165] as [number, number],
        heading: 45,
      },
      {
        id: 'v2',
        type: 'bike' as const,
        location: [78.0422, 30.3265] as [number, number],
        heading: 90,
      },
      {
        id: 'v3',
        type: 'shared' as const,
        location: [78.0222, 30.3065] as [number, number],
        heading: 180,
      },
      {
        id: 'v4',
        type: 'jeep' as const,
        location: [78.0522, 30.3365] as [number, number],
        heading: 270,
      },
      {
        id: 'v5',
        type: 'bike' as const,
        location: [78.0122, 30.2965] as [number, number],
        heading: 0,
      },
    ];
    
    setVehicles(mockVehicles);
    
    // Simulate vehicle movement
    const interval = setInterval(() => {
      setVehicles(prevVehicles => {
        return prevVehicles.map(vehicle => {
          // Randomly move the vehicle slightly
          const latChange = (Math.random() - 0.5) * 0.001;
          const lngChange = (Math.random() - 0.5) * 0.001;
          
          // Update heading based on movement direction
          const heading = Math.atan2(latChange, lngChange) * (180 / Math.PI);
          
          return {
            ...vehicle,
            location: [
              vehicle.location[0] + lngChange,
              vehicle.location[1] + latChange,
            ] as [number, number],
            heading: heading >= 0 ? heading : heading + 360,
          };
        });
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Function to get vehicles near a specific location
  const nearbyVehicles = (location: [number, number], radius: number = 5): Vehicle[] => {
    // Simple distance calculation (not accurate for long distances)
    const calcDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371; // Radius of the earth in km
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      const d = R * c; // Distance in km
      return d;
    };
    
    const deg2rad = (deg: number): number => {
      return deg * (Math.PI/180);
    };
    
    return vehicles.filter(vehicle => {
      const distance = calcDistance(
        location[1], location[0],
        vehicle.location[1], vehicle.location[0]
      );
      return distance <= radius;
    });
  };
  
  return (
    <VehicleContext.Provider value={{
      vehicles,
      nearbyVehicles,
    }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = (): VehicleContextType => {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
};