import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import InstallPWA from './InstallPWA';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">PeakRide</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Safe and reliable transportation solutions for hill stations, designed to work even in low-connectivity areas.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 text-slate-300 flex-shrink-0 mt-0.5" />
                <span>123 Mountain View, Himachal Pradesh, India</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-slate-300 flex-shrink-0" />
                <span>support@peakride.com</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-slate-300 flex-shrink-0" />
                <span>+91 12345 67890</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Download</h3>
            <p className="text-slate-400 text-sm mb-3">
              Install our app for the best offline experience.
            </p>
            <InstallPWA />
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} PeakRide. All rights reserved.</p>
          <div className="mt-4 sm:mt-0">
            <ul className="flex space-x-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;