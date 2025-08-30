import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import VehicleCard, { VehicleType } from '../components/VehicleCard';
import Map from '../components/Map';
import { generateMockVehicles } from '../utils/mockData';
import BookingSummary from '../components/BookingSummary';
import LoadingSpinner from '../components/LoadingSpinner';
import { useBooking } from '../contexts/BookingContext';
import { toast } from 'react-hot-toast';

interface BookingState {
  pickup: string;
  destination: string;
  date: string;
  time: string;
  passengers: number;
}

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addBooking } = useBooking();
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [bookingState, setBookingState] = useState<BookingState>({
    pickup: 'Dehradun',
    destination: 'Mussoorie',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    passengers: 2,
  });
  const [showSummary, setShowSummary] = useState(false);

  // Extract booking details from navigation state
  useEffect(() => {
    if (location.state) {
      setBookingState(location.state as BookingState);
    }
    
    // Simulate API call to fetch vehicles
    setTimeout(() => {
      const mockVehicles = generateMockVehicles(
        bookingState.passengers,
        bookingState.pickup,
        bookingState.destination
      );
      setVehicles(mockVehicles);
      setIsLoading(false);
    }, 1500);
  }, [location.state]);
  
  const handleVehicleSelect = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setShowSummary(true);
  };
  
  const handleBackToVehicles = () => {
    setShowSummary(false);
  };
  
  const handleConfirmBooking = () => {
    if (selectedVehicle) {
      const newBooking = {
        id: `BOOK-${Math.floor(Math.random() * 10000)}`,
        ...bookingState,
        vehicle: selectedVehicle,
        status: 'confirmed',
        paymentMethod: 'Cash on Pickup',
        createdAt: new Date().toISOString(),
      };
      
      addBooking(newBooking);
      toast.success('Booking confirmed successfully!');
      
      // Navigate to tracking page
      navigate(`/tracking/${newBooking.id}`);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-slate-800 ml-2">
          {showSummary ? 'Booking Summary' : 'Available Vehicles'}
        </h1>
      </div>
      
      {!showSummary && (
        <>
          <div className="mb-6">
            <Map 
              className="h-48"
              zoom={12}
            />
          </div>
          
          <div className="card p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">From</p>
                <p className="font-medium">{bookingState.pickup}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">To</p>
                <p className="font-medium">{bookingState.destination}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Date & Time</p>
                <p className="font-medium">{new Date(bookingState.date).toLocaleDateString()} at {bookingState.time}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Passengers</p>
                <p className="font-medium">{bookingState.passengers} {bookingState.passengers === 1 ? 'person' : 'people'}</p>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  type={vehicle.type as VehicleType}
                  title={vehicle.title}
                  price={vehicle.price}
                  eta={vehicle.eta}
                  distance={vehicle.distance}
                  seats={vehicle.seats}
                  demand={vehicle.demand}
                  onSelect={() => handleVehicleSelect(vehicle)}
                />
              ))}
            </div>
          )}
        </>
      )}
      
      {showSummary && selectedVehicle && (
        <div>
          <div className="mb-6">
            <Map 
              className="h-56"
              routeCoordinates={[
                [78.0322, 30.3165], // Dehradun
                [78.0747, 30.4599], // Mussoorie
              ]}
            />
          </div>
          
          <BookingSummary
            pickup={bookingState.pickup}
            destination={bookingState.destination}
            date={new Date(bookingState.date)}
            time={bookingState.time}
            passengers={bookingState.passengers}
            price={selectedVehicle.price}
            vehicleType={selectedVehicle.type}
            vehicleName={selectedVehicle.title}
            paymentMethod="Cash on Pickup"
            onCancel={handleBackToVehicles}
            onConfirm={handleConfirmBooking}
          />
          
          <div className="mt-4 bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Booking Information</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Drivers are verified and follow COVID-19 safety protocols</li>
              <li>• Free cancellation up to 1 hour before pickup</li>
              <li>• Route map available offline during your journey</li>
              <li>• Emergency SOS button available during your ride</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;