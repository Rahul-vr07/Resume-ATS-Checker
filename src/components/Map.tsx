import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLocation } from '../contexts/LocationContext';
import LoadingSpinner from './LoadingSpinner';

// Using environment variable for Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface MapProps {
  vehicles?: Array<{
    id: string;
    type: 'jeep' | 'bike' | 'shared';
    location: [number, number];
    heading: number;
  }>;
  showUserLocation?: boolean;
  routeCoordinates?: Array<[number, number]>;
  zoom?: number;
  interactive?: boolean;
  className?: string;
}

const Map: React.FC<MapProps> = ({
  vehicles = [],
  showUserLocation = true,
  routeCoordinates,
  zoom = 14,
  interactive = true,
  className = '',
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { userLocation, locationError } = useLocation();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Initialize map
  useEffect(() => {
    if (!mapboxgl.accessToken) {
      setMapError('Mapbox token is not configured');
      return;
    }

    if (mapContainer.current && !map.current) {
      const initialLocation = userLocation || [78.0322, 30.3165]; // Default: Dehradun
      
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/outdoors-v12', // Terrain-friendly style
          center: initialLocation as [number, number],
          zoom: zoom,
          interactive: interactive,
          attributionControl: false,
        });
        
        // Add navigation control
        if (interactive) {
          map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        }
        
        // Add attribution control
        map.current.addControl(new mapboxgl.AttributionControl({
          compact: true
        }));
        
        map.current.on('load', () => {
          setMapLoaded(true);
        });

        map.current.on('error', (e) => {
          console.error('Mapbox error:', e);
          setMapError('Failed to load map');
        });
      } catch (error) {
        console.error('Map initialization error:', error);
        setMapError('Failed to initialize map');
      }
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);
  
  // Update map when user location changes
  useEffect(() => {
    if (map.current && userLocation && mapLoaded) {
      if (showUserLocation) {
        // Add or update user location marker
        const el = document.createElement('div');
        el.className = 'user-location-marker';
        el.style.width = '15px';
        el.style.height = '15px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = '#4169E1';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.25)';
        
        new mapboxgl.Marker(el)
          .setLngLat(userLocation as [number, number])
          .addTo(map.current);
        
        // Center map on user location
        map.current.flyTo({
          center: userLocation as [number, number],
          essential: true,
          speed: 0.5,
        });
      }
    }
  }, [userLocation, mapLoaded, showUserLocation]);
  
  // Add or update vehicle markers
  useEffect(() => {
    if (map.current && mapLoaded && vehicles.length > 0) {
      // Clear existing markers
      const markersToRemove = document.querySelectorAll('.vehicle-marker');
      markersToRemove.forEach(marker => marker.remove());
      
      // Add new markers
      vehicles.forEach(vehicle => {
        const el = document.createElement('div');
        el.className = 'vehicle-marker';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.backgroundSize = 'contain';
        el.style.backgroundRepeat = 'no-repeat';
        el.style.backgroundPosition = 'center';
        el.style.transform = `rotate(${vehicle.heading}deg)`;
        
        // Different icons for different vehicle types
        if (vehicle.type === 'jeep') {
          el.style.backgroundColor = '#10B981';
          el.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"white\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 18 1 7h2.3l.7 3h16l.7-3H23l-4 11a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0z\"/><circle cx=\"7\" cy=\"18\" r=\"2\"/><path d=\"M5 14h14\"/><circle cx=\"17\" cy=\"18\" r=\"2\"/></svg>')";
        } else if (vehicle.type === 'bike') {
          el.style.backgroundColor = '#F59E0B';
          el.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"white\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"5.5\" cy=\"17.5\" r=\"3.5\"/><circle cx=\"18.5\" cy=\"17.5\" r=\"3.5\"/><path d=\"M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2\"/></svg>')";
        } else {
          el.style.backgroundColor = '#6366F1';
          el.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"white\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M10 17.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 17V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13M2 17h20M8 17h8\"/></svg>')";
        }
        
        new mapboxgl.Marker(el)
          .setLngLat(vehicle.location)
          .addTo(map.current!);
      });
    }
  }, [vehicles, mapLoaded]);
  
  // Draw route if provided
  useEffect(() => {
    if (map.current && mapLoaded && routeCoordinates && routeCoordinates.length > 1) {
      // Add source if it doesn't exist
      if (!map.current.getSource('route')) {
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: routeCoordinates,
            },
          },
        });
        
        // Add route layer
        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#1E40AF',
            'line-width': 5,
            'line-opacity': 0.8,
            'line-dasharray': [0.5, 1.5],
          },
        });
      } else {
        // Update existing source
        (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates,
          },
        });
      }
      
      // Fit bounds to route
      const bounds = routeCoordinates.reduce(
        (bounds, coord) => bounds.extend(coord as mapboxgl.LngLatLike),
        new mapboxgl.LngLatBounds(routeCoordinates[0], routeCoordinates[0])
      );
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
        duration: 1000,
      });
    }
  }, [routeCoordinates, mapLoaded]);
  
  if (mapError) {
    return (
      <div className={`bg-slate-100 rounded-lg shadow-sm flex items-center justify-center p-4 ${className}`} style={{ height: '300px' }}>
        <div className="text-center text-slate-600">
          <p>{mapError}</p>
          <p className="text-sm mt-2">Please check your Mapbox configuration.</p>
        </div>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className={`bg-slate-100 rounded-lg shadow-sm flex items-center justify-center p-4 ${className}`} style={{ height: '300px' }}>
        <div className="text-center text-slate-600">
          <p>Unable to access location.</p>
          <p className="text-sm mt-2">Please enable location services and reload.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`relative ${className}`} style={{ height: '300px' }}>
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-sm" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 bg-opacity-80 rounded-lg">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default Map;