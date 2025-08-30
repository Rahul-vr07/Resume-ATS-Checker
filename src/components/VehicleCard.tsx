import React from 'react';
import { Calendar, Clock, MapPin, Users, Flame } from 'lucide-react';

export type VehicleType = 'jeep' | 'bike' | 'shared';

interface VehicleCardProps {
  type: VehicleType;
  title: string;
  price: number;
  eta: number; // minutes
  distance: number; // kilometers
  seats?: number;
  demand: 'low' | 'medium' | 'high';
  onSelect: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  type,
  title,
  price,
  eta,
  distance,
  seats,
  demand,
  onSelect,
}) => {
  const getVehicleIcon = () => {
    switch (type) {
      case 'jeep':
        return (
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 18L1 7h2.3l.7 3h16l.7-3H23l-4 11a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0z" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="7" cy="18" r="2" stroke="#047857" strokeWidth="2"/>
              <path d="M5 14h14" stroke="#047857" strokeWidth="2"/>
              <circle cx="17" cy="18" r="2" stroke="#047857" strokeWidth="2"/>
            </svg>
          </div>
        );
      case 'bike':
        return (
          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="5.5" cy="17.5" r="3.5" stroke="#B45309" strokeWidth="2"/>
              <circle cx="18.5" cy="17.5" r="3.5" stroke="#B45309" strokeWidth="2"/>
              <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
      case 'shared':
        return (
          <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 17.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 17V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13M2 17h20M8 17h8" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getDemandBadge = () => {
    switch (demand) {
      case 'low':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><Flame size={12} className="mr-1" />Low Demand</span>;
      case 'medium':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Flame size={12} className="mr-1" />Medium Demand</span>;
      case 'high':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><Flame size={12} className="mr-1" />High Demand</span>;
      default:
        return null;
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="p-4 flex items-center">
        {getVehicleIcon()}

        <div className="ml-4 flex-1">
          <div className="flex justify-between">
            <h3 className="font-medium text-slate-900">{title}</h3>
            <p className="font-bold text-blue-800">₹{price}</p>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-y-1 gap-x-2 text-sm">
            <div className="flex items-center text-slate-600">
              <Clock size={14} className="mr-1" />
              <span>{eta} min</span>
            </div>
            <div className="flex items-center text-slate-600">
              <MapPin size={14} className="mr-1" />
              <span>{distance} km</span>
            </div>
            {seats && (
              <div className="flex items-center text-slate-600">
                <Users size={14} className="mr-1" />
                <span>{seats} seats</span>
              </div>
            )}
            <div>
              {getDemandBadge()}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <button
          onClick={onSelect}
          className="btn btn-primary w-full"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;