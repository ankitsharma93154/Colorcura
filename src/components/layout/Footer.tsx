import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/30 overflow-hidden">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-pink-900/10"></div>
      
      {/* Subtle animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-br from-pink-400/10 to-orange-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright section with enhanced styling */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0 font-medium">
            © {new Date().getFullYear()} ColorCura. All rights reserved.
          </p>
          
          {/* Enhanced "Made with love" section */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 group">
            <span className="font-medium">Made with</span>
            <div className="relative">
              <Heart className="h-5 w-5 text-red-500 fill-current transition-all duration-300 group-hover:scale-125 group-hover:text-red-400 drop-shadow-sm" />
              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </div>
            <span className="font-medium bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-400 dark:to-gray-200 bg-clip-text text-transparent">
              for designers & developers
            </span>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;

