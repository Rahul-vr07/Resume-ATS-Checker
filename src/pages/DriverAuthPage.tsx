import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Lock, ArrowRight, User, Car, FileText, Camera } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DriverAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    vehicleNumber: '',
    licenseNumber: '',
    vehicleType: 'jeep',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call
    toast.success(isSignUp ? 'Registration submitted for review' : 'Welcome back, driver!');
    navigate('/driver/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-800 rounded-full flex items-center justify-center">
            <Car size={32} className="text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          {isSignUp ? 'Join as a Driver' : 'Driver Login'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {isSignUp ? 'Start earning with PeakRide' : 'Access your driver dashboard'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isSignUp && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                    Full Name (as per license)
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-slate-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="input pl-10"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="vehicleType" className="block text-sm font-medium text-slate-700">
                    Vehicle Type
                  </label>
                  <div className="mt-1">
                    <select
                      id="vehicleType"
                      name="vehicleType"
                      required
                      className="input"
                      value={formData.vehicleType}
                      onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    >
                      <option value="jeep">Mountain Jeep</option>
                      <option value="bike">Hill Bike</option>
                      <option value="shared">Shared Cab</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="vehicleNumber" className="block text-sm font-medium text-slate-700">
                    Vehicle Registration Number
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Car size={18} className="text-slate-400" />
                    </div>
                    <input
                      id="vehicleNumber"
                      name="vehicleNumber"
                      type="text"
                      required
                      className="input pl-10 uppercase"
                      placeholder="UK07 AB 1234"
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-slate-700">
                    Driver's License Number
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText size={18} className="text-slate-400" />
                    </div>
                    <input
                      id="licenseNumber"
                      name="licenseNumber"
                      type="text"
                      required
                      className="input pl-10 uppercase"
                      placeholder="DL1420110012345"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Upload Documents
                  </label>
                  <div className="mt-1 space-y-2">
                    <button type="button" className="btn btn-outline w-full flex items-center justify-center">
                      <Camera size={18} className="mr-2" />
                      Upload Driver's License
                    </button>
                    <button type="button" className="btn btn-outline w-full flex items-center justify-center">
                      <Camera size={18} className="mr-2" />
                      Upload Vehicle RC
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-slate-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="input pl-10"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="input pl-10"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <button type="submit" className="btn bg-green-800 hover:bg-green-900 text-white w-full flex items-center justify-center">
                {isSignUp ? 'Submit Application' : 'Sign In'}
                <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  {isSignUp ? 'Already registered?' : 'Want to become a driver?'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="btn btn-outline w-full"
              >
                {isSignUp ? 'Sign In Instead' : 'Register as Driver'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverAuthPage;