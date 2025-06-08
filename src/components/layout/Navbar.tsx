import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30 shadow-lg">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-pink-900/20"></div>
      
      <div className="relative px-6 py-4 flex items-center justify-between">
        {/* Enhanced logo section */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <img
              src="/colorcura-icon2.png"
              alt="Colorcura Logo"
              className="h-10 w-10 object-contain transition-all duration-300 group-hover:scale-110 drop-shadow-lg"
            />
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-purple-500/0 group-hover:from-blue-400/20 group-hover:to-purple-500/20 rounded-full blur-xl transition-all duration-300"></div>
          </div>
          
          <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
            ColorCura
          </span>
        </Link>
        
        {/* Enhanced navigation with glassmorphism */}
        <nav className="flex items-center space-x-2">
          <Link 
            to="/" 
            className="relative px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 rounded-xl hover:bg-white/60 dark:hover:bg-gray-800/60 backdrop-blur-sm border border-transparent hover:border-white/30 dark:hover:border-gray-600/30 hover:shadow-lg group"
          >
            <span className="relative z-10 font-medium">Palettes</span>
            {/* Subtle gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 rounded-xl transition-all duration-300"></div>
          </Link>
          
          <Link 
            to="/about" 
            className="relative px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 rounded-xl hover:bg-white/60 dark:hover:bg-gray-800/60 backdrop-blur-sm border border-transparent hover:border-white/30 dark:hover:border-gray-600/30 hover:shadow-lg group"
          >
            <span className="relative z-10 font-medium">About</span>
            {/* Subtle gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 rounded-xl transition-all duration-300"></div>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

