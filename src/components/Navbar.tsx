import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Map, Home, User, Settings, GlobeIcon, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const location = useLocation();
  const { user } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: language === 'en' ? 'Home' : 'होम', path: '/', icon: <Home size={20} /> },
    { name: language === 'en' ? 'Booking' : 'बुकिंग', path: '/booking', icon: <Map size={20} /> },
  ];

  return (
    <nav className="bg-blue-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Map className="h-8 w-8" />
              <span className="font-bold text-xl">PeakRide</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-900 text-white'
                    : 'text-blue-100 hover:bg-blue-700'
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
            
            {user ? (
              <Link
                to="/profile"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/profile')
                    ? 'bg-blue-900 text-white'
                    : 'text-blue-100 hover:bg-blue-700'
                }`}
              >
                <User size={20} />
                <span className="ml-2">{user.name}</span>
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/auth/user"
                  className="btn bg-white text-blue-800 hover:bg-blue-50"
                >
                  <LogIn size={18} className="mr-2" />
                  Sign In
                </Link>
                <Link
                  to="/auth/driver"
                  className="btn bg-green-600 text-white hover:bg-green-700"
                >
                  Drive with us
                </Link>
              </div>
            )}
            
            <button
              onClick={toggleLanguage}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-700 transition-colors"
            >
              <GlobeIcon size={20} />
              <span className="ml-2">{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
          </div>
          
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-4 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? 'bg-blue-900 text-white'
                    : 'text-blue-100 hover:bg-blue-700'
                }`}
                onClick={closeMenu}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
            
            {user ? (
              <Link
                to="/profile"
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/profile')
                    ? 'bg-blue-900 text-white'
                    : 'text-blue-100 hover:bg-blue-700'
                }`}
                onClick={closeMenu}
              >
                <User size={20} />
                <span className="ml-3">{user.name}</span>
              </Link>
            ) : (
              <div className="space-y-2 mt-2">
                <Link
                  to="/auth/user"
                  className="btn bg-white text-blue-800 hover:bg-blue-50 w-full justify-center"
                  onClick={closeMenu}
                >
                  <LogIn size={18} className="mr-2" />
                  Sign In
                </Link>
                <Link
                  to="/auth/driver"
                  className="btn bg-green-600 text-white hover:bg-green-700 w-full justify-center"
                  onClick={closeMenu}
                >
                  Drive with us
                </Link>
              </div>
            )}
            
            <button
              onClick={() => {
                toggleLanguage();
                closeMenu();
              }}
              className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-700"
            >
              <GlobeIcon size={20} />
              <span className="ml-3">{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;