import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, Users } from 'lucide-react';
import Map from '../components/Map';
import WeatherBanner from '../components/WeatherBanner';
import { useLocation } from '../contexts/LocationContext';
import { useVehicle } from '../contexts/VehicleContext';
import { WeatherCondition } from '../components/WeatherBanner';
import { useGSAPAnimation } from '../hooks/useGSAPAnimation';

const mockDestinations = [
  { id: 1, name: 'Mussoorie', distance: 35, image: 'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg' },
  { id: 2, name: 'Nainital', distance: 290, image: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg' },
  { id: 3, name: 'Shimla', distance: 210, image: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg' },
  { id: 4, name: 'Dharamshala', distance: 350, image: 'https://images.pexels.com/photos/2356059/pexels-photo-2356059.jpeg' },
];

const HomePage: React.FC = () => {
  const { heroRef, formRef, destinationsRef, mapRef } = useGSAPAnimation();
  const navigate = useNavigate();
  const { userLocation } = useLocation();
  const { vehicles } = useVehicle();
  const [pickup, setPickup] = useState('Dehradun');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');
  const [passengers, setPassengers] = useState<number>(2);
  
  const [weather] = useState<{
    condition: WeatherCondition;
    temperature: number;
    location: string;
  }>({
    condition: 'clear',
    temperature: 22,
    location: 'Dehradun',
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination) {
      navigate('/booking', {
        state: { pickup, destination, date, time, passengers },
      });
    }
  };
  
  return (
    <div className="smooth-scroll">
      {/* Hero Section */}
      <div 
        ref={heroRef}
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/2437291/pexels-photo-2437291.jpeg")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
        <div className="relative max-w-3xl mx-auto px-4 py-20 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Your Journey to the Mountains
            <br />
            Starts Here
          </h1>
          <p className="text-xl mb-8">Safe and reliable transportation in hill stations</p>
          <div ref={formRef} className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3 text-white" />
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-10 py-2 text-white placeholder-white/70"
                    placeholder="From"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3 text-white" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-10 py-2 text-white placeholder-white/70"
                    placeholder="To"
                    list="destinations"
                  />
                  <datalist id="destinations">
                    {mockDestinations.map((dest) => (
                      <option key={dest.id} value={dest.name} />
                    ))}
                  </datalist>
                </div>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2">
                  Search Rides
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <WeatherBanner
          condition={weather.condition}
          temperature={weather.temperature}
          location={weather.location}
        />
        
        <div ref={destinationsRef} className="mt-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Popular Destinations</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {mockDestinations.map((dest) => (
              <button
                key={dest.id}
                className="group relative overflow-hidden rounded-lg aspect-square"
                onClick={() => setDestination(dest.name)}
              >
                <img 
                  src={dest.image} 
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                  <h3 className="font-bold text-lg">{dest.name}</h3>
                  <p className="text-sm text-white/80">{dest.distance} km away</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div ref={mapRef} className="mt-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Live Vehicle Tracking</h2>
          <Map 
            vehicles={vehicles}
            className="h-64 sm:h-80"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;