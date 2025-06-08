import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ColorSwatchProps {
  color: string;
  role: string;
  usage: string;
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ 
  color, 
  role, 
  usage, 
  onClick,
  isSelected = false
}) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(color);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };
  
  return (
    <div 
      className={`
        relative group flex flex-col rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl
        border-2 transition-all duration-500 backdrop-blur-sm
        ${isSelected ? 
          'border-indigo-500 scale-105 shadow-indigo-500/25 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20' : 
          'border-transparent hover:border-white/30 dark:hover:border-gray-600/50 hover:scale-[1.02] hover:-translate-y-1'
        }
        ${onClick ? 'cursor-pointer' : ''}
        bg-white/80 dark:bg-gray-800/80
      `}
      onClick={onClick}
    >
      {/* Color display area with enhanced styling */}
      <div 
        className="h-20 w-full flex items-end justify-end p-3 relative overflow-hidden"
        style={{ backgroundColor: color }}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10"></div>
        
        {/* Enhanced copy button with glassmorphism */}
        <button
          onClick={handleCopy}
          className="relative z-10 bg-white/80 dark:bg-black/60 backdrop-blur-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-white/30 shadow-lg hover:shadow-xl"
          aria-label="Copy color code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          )}
        </button>

        {/* Hover overlay effect */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300"></div>
      </div>
      
      {/* Enhanced info section with better typography and spacing */}
      <div className="p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-t border-white/20 dark:border-gray-700/30">
        <div className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">{role}</div>
        <div className="text-xs font-mono text-gray-600 dark:text-gray-400 mb-2 bg-gray-100/80 dark:bg-gray-700/80 px-2 py-1 rounded-lg backdrop-blur-sm">{color}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{usage}</div>
      </div>
      
      {/* Enhanced copied notification with modern styling */}
      {copied && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-500/90 to-emerald-500/90 backdrop-blur-lg text-white font-medium animate-pulse border border-white/30 rounded-2xl">
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5" />
            <span>Copied!</span>
          </div>
        </div>
      )}

      {/* Selection indicator with gradient */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full shadow-lg border-2 border-white"></div>
      )}
    </div>
  );
};

export default ColorSwatch;

