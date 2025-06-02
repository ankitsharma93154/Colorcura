import React from 'react';
import { Link } from 'react-router-dom';



const Navbar: React.FC = () => {
  
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
      <div className="px-4 py-3 mr-2 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img
          src="/colorcura-icon2.png"
          alt="Colorcura Logo"
          className="h-8 w-8 object-contain"
          />
           <span className="text-xl font-bold">Colorcura</span>
        </Link>
        
        <nav className="flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Palettes
          </Link>
          <Link 
            to="/about" 
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center space-x-1"
          >
            <span>About</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;