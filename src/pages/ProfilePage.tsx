import React, { useState } from 'react';
import { User, Bell, CreditCard, Phone, Moon, Settings, LogOut, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import BookingSummary from '../components/BookingSummary';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { bookings } = useBooking();
  const [activeTab, setActiveTab] = useState<'bookings' | 'preferences'>('bookings');
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="card p-4 mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <User size={30} className="text-blue-800" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{user?.name || 'Guest User'}</h1>
            <p className="text-slate-600">{user?.phone || '+91 98765 43210'}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-800">{bookings.length}</p>
            <p className="text-sm text-slate-600">Rides</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-800">241</p>
            <p className="text-sm text-slate-600">km</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-800">4.9</p>
            <p className="text-sm text-slate-600">Rating</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-slate-200">
          <button
            className={`flex-1 py-3 font-medium text-center ${
              activeTab === 'bookings'
                ? 'text-blue-800 border-b-2 border-blue-800'
                : 'text-slate-600'
            }`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings
          </button>
          <button
            className={`flex-1 py-3 font-medium text-center ${
              activeTab === 'preferences'
                ? 'text-blue-800 border-b-2 border-blue-800'
                : 'text-slate-600'
            }`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
        </div>
      </div>
      
      {activeTab === 'bookings' && (
        <div>
          <h2 className="font-medium text-lg mb-4">Recent Bookings</h2>
          
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <BookingSummary
                  key={booking.id}
                  pickup={booking.pickup}
                  destination={booking.destination}
                  date={new Date(booking.date)}
                  time={booking.time}
                  passengers={booking.passengers}
                  price={booking.vehicle.price}
                  vehicleType={booking.vehicle.type}
                  vehicleName={booking.vehicle.title}
                  paymentMethod="Cash on Pickup"
                  showActions={false}
                  className="mb-4"
                />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <Clock size={48} className="mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Bookings Yet</h3>
              <p className="text-slate-600 mb-4">You haven't made any bookings yet.</p>
              <button className="btn btn-primary">Book a Ride</button>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'preferences' && (
        <div className="space-y-4">
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-medium">Account Settings</h3>
            </div>
            
            <div>
              <button className="w-full flex items-center p-4 hover:bg-slate-50 transition-colors border-b border-slate-200">
                <User size={20} className="text-blue-700 mr-3" />
                <span className="flex-1 text-left">Profile Information</span>
              </button>
              
              <button className="w-full flex items-center p-4 hover:bg-slate-50 transition-colors border-b border-slate-200">
                <Bell size={20} className="text-amber-600 mr-3" />
                <span className="flex-1 text-left">Notifications</span>
              </button>
              
              <button className="w-full flex items-center p-4 hover:bg-slate-50 transition-colors border-b border-slate-200">
                <CreditCard size={20} className="text-green-700 mr-3" />
                <span className="flex-1 text-left">Payment Methods</span>
              </button>
              
              <button className="w-full flex items-center p-4 hover:bg-slate-50 transition-colors">
                <Phone size={20} className="text-indigo-600 mr-3" />
                <span className="flex-1 text-left">Emergency Contacts</span>
              </button>
            </div>
          </div>
          
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-medium">App Settings</h3>
            </div>
            
            <div>
              <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-200">
                <div className="flex items-center">
                  <Moon size={20} className="text-slate-700 mr-3" />
                  <span>Dark Mode</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-800"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-200">
                <div className="flex items-center">
                  <Settings size={20} className="text-slate-700 mr-3" />
                  <span>Offline Map Quality</span>
                </div>
                <select className="bg-slate-100 border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center">
                  <Bell size={20} className="text-slate-700 mr-3" />
                  <span>Push Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={true} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-800"></div>
                </label>
              </div>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="btn btn-outline w-full flex items-center justify-center mt-6"
          >
            <LogOut size={18} className="mr-2" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;