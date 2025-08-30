import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { WifiOff, Wifi } from 'lucide-react';

const OfflineManager: React.FC = () => {
  const [wasOffline, setWasOffline] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Initial state
    setWasOffline(!navigator.onLine);

    const handleOnline = () => {
      // Only show toast if user was previously offline
      if (wasOffline) {
        toast.success('You are back online!', {
          icon: <Wifi size={16} />,
        });
      }
      setWasOffline(false);
    };

    const handleOffline = () => {
      setWasOffline(true);
      toast.error('You are offline. Limited functionality available.', {
        icon: <WifiOff size={16} />,
        duration: 4000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  // Sync local data when back online
  useEffect(() => {
    if (!wasOffline && navigator.onLine) {
      // In a real app, this would sync cached data with the server
      // This is a placeholder for demonstration
      const attemptSync = async () => {
        try {
          console.log('Syncing data after coming back online');
          // This would be an API call to sync data
        } catch (error) {
          console.error('Failed to sync data:', error);
        }
      };

      attemptSync();
    }
  }, [wasOffline, location.pathname]);

  return null; // This is a non-visual component
};

export default OfflineManager;