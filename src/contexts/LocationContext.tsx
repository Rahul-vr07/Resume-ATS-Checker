import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LocationContextType {
  userLocation: [number, number] | null;
  locationError: string | null;
  watchLocation: () => void;
  stopWatchingLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  
  // Initialize location on mount
  useEffect(() => {
    watchLocation();
    
    return () => {
      stopWatchingLocation();
    };
  }, []);
  
  const watchLocation = () => {
    if (navigator.geolocation) {
      try {
        const id = navigator.geolocation.watchPosition(
          (position) => {
            setUserLocation([position.coords.longitude, position.coords.latitude]);
            setLocationError(null);
            setRetryCount(0); // Reset retry count on success
          },
          (error) => {
            console.error('Error getting location:', error);
            
            // Implement retry logic with exponential backoff
            if (retryCount < MAX_RETRIES) {
              const backoffDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff
              setTimeout(() => {
                setRetryCount(prev => prev + 1);
                watchLocation();
              }, backoffDelay);
            } else {
              setLocationError(getLocationErrorMessage(error.code));
              // Use a fallback location - Dehradun
              setUserLocation([78.0322, 30.3165]);
            }
          },
          {
            enableHighAccuracy: true,
            maximumAge: 15000, // Reduced from 30000 to ensure fresher location data
            timeout: 45000, // Increased from 27000 to allow more time for location acquisition
          }
        );
        
        setWatchId(id);
      } catch (error) {
        console.error('Error watching location:', error);
        setLocationError('Unable to access location services');
        
        // Use a fallback location
        setUserLocation([78.0322, 30.3165]);
      }
    } else {
      setLocationError('Geolocation is not supported by this browser');
      
      // Use a fallback location
      setUserLocation([78.0322, 30.3165]);
    }
  };
  
  const stopWatchingLocation = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };
  
  const getLocationErrorMessage = (code: number): string => {
    switch (code) {
      case 1:
        return 'Permission denied. Please enable location services.';
      case 2:
        return 'Location unavailable. Please try again later.';
      case 3:
        return 'Location request timed out. Please try again.';
      default:
        return 'An unknown error occurred.';
    }
  };
  
  return (
    <LocationContext.Provider value={{
      userLocation,
      locationError,
      watchLocation,
      stopWatchingLocation,
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};