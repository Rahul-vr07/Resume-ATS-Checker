import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageSquare, AlertTriangle, UserCheck, Bell, MapPin } from 'lucide-react';
import Map from '../components/Map';
import { useLocation } from '../contexts/LocationContext';
import { toast } from 'react-hot-toast';

const EmergencyPage: React.FC = () => {
  const navigate = useNavigate();
  const { userLocation } = useLocation();
  const [countdown, setCountdown] = useState<number>(5);
  const [emergencySent, setEmergencySent] = useState<boolean>(false);
  const [helpOptions, setHelpOptions] = useState<Array<{ id: string; title: string; icon: JSX.Element }>>([
    { id: 'police', title: 'Police', icon: <UserCheck size={24} className="text-blue-700" /> },
    { id: 'medical', title: 'Medical', icon: <Bell size={24} className="text-red-700" /> },
    { id: 'breakdown', title: 'Breakdown', icon: <AlertTriangle size={24} className="text-amber-700" /> },
    { id: 'other', title: 'Other', icon: <MessageSquare size={24} className="text-green-700" /> },
  ]);
  const [selectedHelpOption, setSelectedHelpOption] = useState<string | null>(null);
  
  // Cancel countdown when user selects a help option
  useEffect(() => {
    if (selectedHelpOption) {
      setCountdown(0);
    }
  }, [selectedHelpOption]);
  
  // Auto-send SOS after countdown
  useEffect(() => {
    if (countdown > 0 && !selectedHelpOption) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !emergencySent) {
      handleSendEmergency();
    }
  }, [countdown, emergencySent, selectedHelpOption]);
  
  const handleCancelEmergency = () => {
    navigate(-1);
  };
  
  const handleSendEmergency = () => {
    setEmergencySent(true);
    toast.success('Emergency alert sent. Help is on the way!');
    
    // Simulate SMS fallback for offline
    setTimeout(() => {
      toast('SMS alert sent to emergency contacts', {
        icon: '📱',
      });
    }, 2000);
  };
  
  const handleHelpOptionSelect = (optionId: string) => {
    setSelectedHelpOption(optionId);
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-red-700">Emergency Assistance</h1>
        {!emergencySent ? (
          <p className="text-slate-700">
            {countdown > 0 
              ? `Sending emergency alert in ${countdown} seconds...` 
              : 'Please select the type of emergency'}
          </p>
        ) : (
          <p className="text-green-700 font-medium">Emergency alert sent successfully</p>
        )}
      </div>
      
      <Map
        className="h-56 mb-6"
        zoom={15}
      />
      
      {!emergencySent ? (
        <>
          <div className="mb-6">
            <div className="card p-4">
              <h2 className="font-medium mb-2">Current Location</h2>
              <div className="flex items-center text-slate-700">
                <MapPin size={18} className="text-red-600 mr-2 flex-shrink-0" />
                <p className="text-sm">
                  {userLocation 
                    ? `${userLocation[1].toFixed(6)}, ${userLocation[0].toFixed(6)}`
                    : 'Obtaining your precise location...'}
                </p>
              </div>
              
              {selectedHelpOption && (
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <h3 className="font-medium mb-2">Emergency Type</h3>
                  <div className="bg-red-50 text-red-800 px-3 py-2 rounded-md text-sm">
                    {helpOptions.find(option => option.id === selectedHelpOption)?.title} Emergency
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="font-medium mb-2">What kind of help do you need?</h2>
            <div className="grid grid-cols-2 gap-3">
              {helpOptions.map((option) => (
                <button
                  key={option.id}
                  className={`card p-3 hover:shadow-md transition-shadow flex flex-col items-center justify-center h-24 ${
                    selectedHelpOption === option.id ? 'ring-2 ring-red-500' : ''
                  }`}
                  onClick={() => handleHelpOptionSelect(option.id)}
                >
                  {option.icon}
                  <span className="mt-2">{option.title}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleCancelEmergency}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleSendEmergency}
              className="btn btn-sos"
            >
              Send Alert
            </button>
          </div>
        </>
      ) : (
        <div>
          <div className="card p-4 mb-6">
            <div className="flex items-center justify-center flex-col p-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-pulse">
                <AlertTriangle size={32} className="text-green-700" />
              </div>
              <h2 className="font-bold text-lg text-center mb-2">Help is on the way!</h2>
              <p className="text-slate-600 text-center">
                Your emergency alert has been sent to nearby authorities and emergency contacts.
              </p>
            </div>
            
            <div className="border-t border-slate-200 pt-4 mt-2">
              <p className="text-sm text-slate-700 mb-4">
                Expected response time: <span className="font-bold">10-15 minutes</span>
              </p>
              
              <div className="bg-blue-50 p-3 rounded-md mb-4">
                <h3 className="font-medium text-blue-800 text-sm mb-1">Stay where you are</h3>
                <p className="text-xs text-blue-700">
                  For faster assistance, please remain at your current location unless it's unsafe to do so.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="btn btn-primary flex items-center justify-center">
              <Phone size={18} className="mr-2" />
              Call Helpline
            </button>
            <button className="btn btn-secondary flex items-center justify-center">
              <MessageSquare size={18} className="mr-2" />
              Chat Support
            </button>
          </div>
          
          <button
            onClick={() => navigate('/')}
            className="btn btn-outline w-full"
          >
            Return to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default EmergencyPage;