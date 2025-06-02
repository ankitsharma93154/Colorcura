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
        relative group flex flex-col rounded-lg overflow-hidden shadow-sm
        border-2 transition-all duration-200
        ${isSelected ? 'border-indigo-500 scale-105' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      <div 
        className="h-16 w-full flex items-end justify-end p-2"
        style={{ backgroundColor: color }}
      >
        <button
          onClick={handleCopy}
          className="bg-white bg-opacity-70 dark:bg-black dark:bg-opacity-50 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-label="Copy color code"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-600" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>
      
      <div className="p-3 bg-white dark:bg-gray-800">
        <div className="text-sm font-medium mb-1">{role}</div>
        <div className="text-xs font-mono text-gray-600 dark:text-gray-400 mb-1">{color}</div>
        <div className="text-xs text-gray-500 dark:text-gray-500">{usage}</div>
      </div>
      
      {copied && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white animate-fade-in-out">
          Copied!
        </div>
      )}
    </div>
  );
};

export default ColorSwatch;