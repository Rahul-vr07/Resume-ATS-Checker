import React from 'react';
import { WifiOff } from 'lucide-react';

const OfflineIndicator: React.FC = () => {
  return (
    <div className="offline-indicator">
      <div className="flex items-center justify-center space-x-2">
        <WifiOff size={16} />
        <span>You are offline. Some features may be limited.</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;