import React from 'react';
import { MapPin, Calendar, Clock, CreditCard, Truck } from 'lucide-react';
import { VehicleType } from './VehicleCard';

interface BookingSummaryProps {
  pickup: string;
  destination: string;
  date: Date;
  time: string;
  passengers: number;
  price: number;
  vehicleType: VehicleType;
  vehicleName: string;
  paymentMethod: string;
  className?: string;
  showActions?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  pickup,
  destination,
  date,
  time,
  passengers,
  price,
  vehicleType,
  vehicleName,
  paymentMethod,
  className = '',
  showActions = true,
  onCancel,
  onConfirm,
}) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);

  const getVehicleIcon = () => {
    switch (vehicleType) {
      case 'jeep':
        return <Truck size={18} className="text-green-600" />;
      case 'bike':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="5.5" cy="17.5" r="3.5" stroke="#B45309" strokeWidth="2"/>
            <circle cx="18.5" cy="17.5" r="3.5" stroke="#B45309" strokeWidth="2"/>
            <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'shared':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 17.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 17V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13M2 17h20M8 17h8" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return <Truck size={18} />;
    }
  };

  return (
    <div className={`card ${className}`}>
      <div className="p-4">
        <h3 className="font-medium text-lg text-slate-900 mb-3">Booking Summary</h3>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin size={18} className="text-blue-700 mt-0.5 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm text-slate-500">Pickup</p>
              <p className="font-medium">{pickup}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <MapPin size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm text-slate-500">Destination</p>
              <p className="font-medium">{destination}</p>
            </div>
          </div>
          
          <div className="flex">
            <Calendar size={18} className="text-slate-600 mt-0.5 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm text-slate-500">Date</p>
              <p className="font-medium">{formattedDate}</p>
            </div>
            
            <Clock size={18} className="text-slate-600 mt-0.5 ml-6 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm text-slate-500">Time</p>
              <p className="font-medium">{time}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            {getVehicleIcon()}
            <div className="ml-3">
              <p className="text-sm text-slate-500">Vehicle</p>
              <p className="font-medium">{vehicleName}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <CreditCard size={18} className="text-slate-600 mt-0.5 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm text-slate-500">Payment Method</p>
              <p className="font-medium">{paymentMethod}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500">Total Amount</p>
              <p className="text-xl font-bold text-blue-800">₹{price}</p>
            </div>
            <div className="bg-green-100 px-3 py-1 rounded-full text-green-800 text-sm">
              Confirmed
            </div>
          </div>
        </div>
      </div>
      
      {showActions && (
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex space-x-3">
          <button 
            onClick={onCancel}
            className="btn btn-outline flex-1"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="btn btn-primary flex-1"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingSummary;