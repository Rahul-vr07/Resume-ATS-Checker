import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const SosButton: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);
  const navigate = useNavigate();

  const handleSosPress = () => {
    setIsPressed(true);
    setTimeout(() => {
      navigate('/emergency');
      setIsPressed(false);
    }, 1500);
  };

  const handleSosRelease = () => {
    if (isPressed) {
      setIsPressed(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <button
        className={`btn btn-sos h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isPressed ? 'scale-95 bg-red-800' : 'hover:scale-105'
        }`}
        onTouchStart={handleSosPress}
        onMouseDown={handleSosPress}
        onTouchEnd={handleSosRelease}
        onMouseUp={handleSosRelease}
        onTouchCancel={handleSosRelease}
        onMouseLeave={handleSosRelease}
        aria-label="Emergency SOS"
      >
        <AlertTriangle size={24} />
        {isPressed && (
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-red-900 text-white text-xs px-2 py-1 rounded">
            Hold for SOS
          </span>
        )}
      </button>
    </div>
  );
};

export default SosButton;