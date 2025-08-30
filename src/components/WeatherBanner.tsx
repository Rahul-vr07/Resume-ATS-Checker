import React from 'react';
import { CloudRain, CloudSnow, Cloud, Sun, Wind } from 'lucide-react';

export type WeatherCondition = 'clear' | 'cloudy' | 'rain' | 'snow' | 'windy';

interface WeatherBannerProps {
  condition: WeatherCondition;
  temperature: number;
  location: string;
}

const WeatherBanner: React.FC<WeatherBannerProps> = ({ condition, temperature, location }) => {
  const getWeatherIcon = () => {
    switch (condition) {
      case 'clear':
        return <Sun className="text-amber-500" size={24} />;
      case 'cloudy':
        return <Cloud className="text-slate-500" size={24} />;
      case 'rain':
        return <CloudRain className="text-blue-500" size={24} />;
      case 'snow':
        return <CloudSnow className="text-blue-200" size={24} />;
      case 'windy':
        return <Wind className="text-slate-400" size={24} />;
      default:
        return <Sun className="text-amber-500" size={24} />;
    }
  };

  const getWeatherClass = () => {
    switch (condition) {
      case 'clear':
        return 'bg-gradient-to-r from-amber-50 to-yellow-50';
      case 'cloudy':
        return 'bg-gradient-to-r from-slate-100 to-slate-200';
      case 'rain':
        return 'bg-gradient-to-r from-blue-50 to-blue-100';
      case 'snow':
        return 'bg-gradient-to-r from-blue-50 to-slate-100';
      case 'windy':
        return 'bg-gradient-to-r from-slate-50 to-gray-100';
      default:
        return 'bg-gradient-to-r from-amber-50 to-yellow-50';
    }
  };

  const getWeatherMessage = () => {
    switch (condition) {
      case 'clear':
        return 'Clear skies for smooth rides';
      case 'cloudy':
        return 'Drive carefully in cloudy conditions';
      case 'rain':
        return 'Slower rides due to rain';
      case 'snow':
        return 'Snowy conditions, limited availability';
      case 'windy':
        return 'Strong winds, drive with caution';
      default:
        return 'Weather updates available';
    }
  };

  return (
    <div className={`rounded-lg shadow-sm ${getWeatherClass()} p-3 flex items-center space-x-3`}>
      <div className="p-2 rounded-full bg-white bg-opacity-60">
        {getWeatherIcon()}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <p className="font-medium">{location}</p>
          <p className="text-xl font-semibold">{temperature}°C</p>
        </div>
        <p className="text-sm text-slate-700 mt-1">{getWeatherMessage()}</p>
      </div>
    </div>
  );
};

export default WeatherBanner;