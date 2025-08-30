import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SosButton from './SosButton';
import OfflineIndicator from './OfflineIndicator';

const Layout: React.FC = () => {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const location = useLocation();
  const isEmergencyPage = location.pathname === '/emergency';

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {isOffline && <OfflineIndicator />}
      <Navbar />
      <main className="flex-grow topographic-bg">
        <Outlet />
      </main>
      {!isEmergencyPage && <SosButton />}
      <Footer />
    </div>
  );
};

export default Layout;