import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, MessageSquare, Share2, DownloadCloud } from 'lucide-react';
import Map from '../components/Map';
import LoadingSpinner from '../components/LoadingSpinner';
import { useBooking } from '../contexts/BookingContext';
import { toast } from 'react-hot-toast';

const TrackingPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { getBooking } = useBooking();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [driverLocation, setDriverLocation] = useState<[number, number]>([78.0322, 30.3165]);
  const [eta, setEta] = useState<number>(15);
  const [routeProgress, setRouteProgress] = useState<number>(0);
  
  useEffect(() => {
    if (bookingId) {
      const bookingData = getBooking(bookingId);
      if (bookingData) {
        setBooking(bookingData);
        setIsLoading(false);
        
        // Simulate driver movement
        const interval = setInterval(() => {
          setDriverLocation(prevLocation => {
            // Move driver location slightly toward destination
            const newLat = prevLocation[1] + (Math.random() * 0.005);
            const newLng = prevLocation[0] + (Math.random() * 0.005);
            return [newLng, newLat];
          });
          
          setEta(prevEta => {
            const newEta = prevEta > 1 ? prevEta - 1 : 0;
            return newEta;
          });
          
          setRouteProgress(prevProgress => {
            const newProgress = prevProgress + (100 / 15) / 60;
            return Math.min(newProgress, 100);
          });
        }, 1000);
        
        return () => clearInterval(interval);
      } else {
        navigate('/');
        toast.error('Booking not found');
      }
    }
  }, [bookingId, getBooking, navigate]);
  
  const handleDownloadOffline = () => {
    toast.success('Route downloaded for offline use!');
  };
  
  const handleShareLocation = () => {
    toast.success('Location shared with emergency contacts!');
  };
  
  if (isLoading || !booking) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-800">Track Your Ride</h1>
        <p className="text-slate-600">Follow your driver's location in real-time</p>
      </div>
      
      <Map
        className="h-64 mb-6"
        routeCoordinates={[
          [78.0322, 30.3165], // Dehradun (starting point)
          driverLocation, // Current driver location
          [78.0747, 30.4599], // Mussoorie (destination)
        ]}
        vehicles={[
          {
            id: '1',
            type: booking.vehicle.type,
            location: driverLocation,
            heading: 45,
          },
        ]}
      />
      
      <div className="card mb-6">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium text-lg">Driver ETA</h2>
            <div className="text-xl font-bold text-blue-800">{eta} mins</div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{booking.pickup}</span>
              <span>{booking.destination}</span>
            </div>
            <div className="bg-slate-200 h-2 rounded-full">
              <div 
                className="bg-blue-800 h-2 rounded-full transition-all duration-1000 ease-in-out"
                style={{ width: `${routeProgress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between pb-4">
            <div>
              <p className="text-sm text-slate-500">Driver</p>
              <p className="font-medium">Ramesh Singh</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Vehicle</p>
              <p className="font-medium">{booking.vehicle.title}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Plate</p>
              <p className="font-medium">UK 07 AB 1234</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 border-t border-slate-200">
          <button className="flex items-center justify-center p-3 hover:bg-slate-50 transition-colors border-r border-slate-200">
            <Phone size={18} className="text-green-600 mr-2" />
            <span>Call Driver</span>
          </button>
          <button className="flex items-center justify-center p-3 hover:bg-slate-50 transition-colors">
            <MessageSquare size={18} className="text-blue-600 mr-2" />
            <span>Message</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button 
          onClick={handleDownloadOffline}
          className="card p-3 flex flex-col items-center justify-center hover:shadow-md transition-shadow h-24"
        >
          <DownloadCloud size={24} className="text-blue-700 mb-2" />
          <span className="text-center text-sm">Download for Offline</span>
        </button>
        
        <button 
          onClick={handleShareLocation}
          className="card p-3 flex flex-col items-center justify-center hover:shadow-md transition-shadow h-24"
        >
          <Share2 size={24} className="text-green-700 mb-2" />
          <span className="text-center text-sm">Share Location</span>
        </button>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">Ride Information</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Rate and tip your driver at the end of the ride</li>
          <li>• Luggage tracking is enabled for this journey</li>
          <li>• Offline mode is available if network is lost</li>
          <li>• Press the SOS button for any emergency</li>
        </ul>
      </div>
    </div>
  );
};

export default TrackingPage;